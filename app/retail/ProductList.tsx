'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToRetailCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import TextPlaceholder from '../ui/TextPlaceholder';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import Icon from '../ui/assets/Icon';
import { Heart } from 'lucide-react';

export type rawData = {
  article: string;
  name: string;
  category: string;
  image: string;
  price: string;
  priceRetailRecommendation: string;
  countInStock: number;
  _id: string;
};

// This is a table wrapper component that fetches data from the server and displays it in a table.
const ProductList = ({ isFavoritePage = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  const { products, totalPages } = state.persistedMainReducer;
  let favorites: Product[] = state.persistedAuthReducer.user.favorites;
  const isAuth = state.persistedAuthReducer.isAuthenticated;
  const favoritesList = favorites.map((product) => product._id);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let category = searchParams.get('category') || '';

  let productsData = products;
  if (isFavoritePage) {
    productsData = favorites;
    if (query) {
      productsData = favorites.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.article.toLowerCase().includes(query.toLowerCase()),
      );
    }
    if (category) {
      productsData = productsData.filter((product) =>
        product.category?.name.toLowerCase().includes(category.toLowerCase()),
      );
    }
    productsData = productsData.slice((page - 1) * 10, page * 10);
  }

  let limit = isDesktop ? 20 : 15;
  useEffect(() => {
    if (!isFavoritePage) {
      dispatch(fetchMainTableDataThunk({ page, query, category, limit }));
    }
  }, [dispatch, page, query, category, isFavoritePage, limit]);

  function handleFavoriteClick(id: string) {
    if (isAuth) {
      if (favoritesList.includes(id)) {
        dispatch(deleteFavoriteProductThunk(id));
      } else {
        dispatch(addFavoriteProductThunk(id));
      }
    } else {
      toast.error('Для додавання в обране потрібно увійти в профіль');
    }
  }

  const handleCartClick = (id: string, productName: string) => {
    if (isAuth) {
      dispatch(
        addProductToRetailCartThunk({
          productId: id,
          quantity: 1,
        }),
      )
        .unwrap()
        .then(() => {
          toast.success(`${productName} додано в кошик`);
        });
    } else {
      const { price, priceBulk, ...product } = productsData.find(
        (product) => product._id === id,
      ) as Product;
      dispatch(
        addProductToLocalStorageCart({
          productId: product,
          quantity: 1,
          _id: id,
        }),
      );

      toast.success(`${productName} додано в кошик`);
    }
  };

  const totalPage = isFavoritePage
    ? Math.ceil(favorites.length / 10)
    : totalPages;

  return (
    <>
      {products.length === 0 ? (
        <div className="pt-10">
          <TextPlaceholder
            title="Не знайдено 🥲"
            text={
              isFavoritePage
                ? 'Ви ще не додали жодного товару або видалили наявні товари з обраного'
                : 'Спробуйте змінити параметри пошуку або категорії'
            }
            titleSize="4xl"
            textSize="xl"
          />
        </div>
      ) : (
        <>
          <div>
            <ul className="flex flex-wrap justify-center gap-8 gap-y-6 xl:gap-2 2xl:justify-normal 2xl:gap-10">
              {productsData?.map((product) => {
                const {
                  article,
                  image,
                  priceRetailRecommendation,
                  name,
                  description,
                  characteristics,
                  _id,
                  rrcSale,
                  countInStock,
                } = product;
                let splitDesc = description.split('\n');
                if (splitDesc.length > 3) {
                  splitDesc = splitDesc.slice(0, 3);
                }
                splitDesc = splitDesc
                  .filter((item) => item !== '')
                  .map((item) => {
                    if (item && item.length > 25) {
                      return item.slice(0, 25) + '...';
                    }
                    return item;
                  });
                return (
                  <li
                    key={article}
                    className={clsx(
                      'relative flex h-[320px] w-[225px] cursor-pointer flex-col justify-between rounded-2xl border-2 border-transparent px-4 pb-2  shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:border-[#FACC15] hover:shadow-lg',
                      countInStock <= 0 && 'pointer-events-none opacity-40',
                    )}
                  >
                    <div
                      className="grow"
                      onClick={() => {
                        router.push(`/retail/${_id}`);
                      }}
                    >
                      {countInStock <= 0 && (
                        <div className="rounded-2x absolute left-0 top-0 flex h-full w-full items-center justify-center">
                          <p className="text-lg font-semibold text-black">
                            Немає в наявності
                          </p>
                        </div>
                      )}
                      <div className="relative h-[150px] w-full shrink-0">
                        <Image
                          src={NEXT_PUBLIC_API + image}
                          alt={name}
                          layout="fill"
                          objectFit="contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          loading="lazy"
                        />
                      </div>

                      <h3 className="text-xs font-medium text-[#FACC15]">
                        {article}
                      </h3>
                      <h4
                        className={clsx(
                          ' font-medium',
                          name.length > 50 ? 'text-xs' : 'text-sm',
                        )}
                      >
                        {name}
                      </h4>
                      <ul className="h-[50px] text-xs text-[#9CA3AF]">
                        {characteristics.length ? (
                          characteristics.slice(0, 3).map((item) => {
                            let name = item.name.trim();
                            let value = item.value.trim();

                            name.length > 15 &&
                              (name = name.slice(0, 15) + '...');
                            value.length > 15 &&
                              (value = value.slice(0, 15) + '...');

                            return item.value !== '-' ? (
                              <li key={item._id}>
                                {name}: {value}
                              </li>
                            ) : (
                              <li key={item._id}>{name}</li>
                            );
                          })
                        ) : (
                          <li>{splitDesc}</li>
                        )}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleFavoriteClick.bind(null, _id)}
                        data-favorite={_id}
                        className={clsx(
                          'stroke-black text-white',
                          favoritesList.includes(_id)
                            ? ' fill-orange-500'
                            : 'fill-white ',
                        )}
                      >
                        <Heart
                          size={24}
                          className="fill-inherit stroke-inherit stroke-1"
                        />
                      </button>

                      <div className="flex items-center justify-end">
                        <p
                          className="border-r border-black pr-1 text-base font-medium"
                          onClick={() => {
                            router.push(`/retail/${_id}`);
                          }}
                        >
                          {rrcSale ? (
                            <div className="flex flex-col items-end">
                              <span className="text-xs line-through">
                                {priceRetailRecommendation} грн
                              </span>
                              <span className="pl-1 text-orangeLight">
                                {rrcSale} грн
                              </span>
                            </div>
                          ) : (
                            priceRetailRecommendation + ' грн'
                          )}
                        </p>
                        <button
                          className="fill-black pl-1 hover:fill-orange-500"
                          onClick={() => handleCartClick(_id, name)}
                        >
                          <Icon
                            icon="cart"
                            className="h-6 w-6 fill-black hover:fill-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative w-full 2xl:w-4/5">
            <div className="mx-auto mt-5 w-fit pb-10">
              <Pagination totalPages={totalPage} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
