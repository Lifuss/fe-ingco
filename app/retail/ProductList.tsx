'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToRetailCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import TextPlaceholder from '../ui/TextPlaceholder';

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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { products, totalPages } = state.persistedMainReducer;
  let favorites: Product[] = state.persistedAuthReducer.user.favorites;
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
        product.category.name.toLowerCase().includes(category.toLowerCase()),
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
    if (favoritesList.includes(id)) {
      dispatch(deleteFavoriteProductThunk(id));
    } else {
      dispatch(addFavoriteProductThunk(id));
    }
  }

  const handleCartClick = (id: string, productName: string) => {
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
                        setSelectedProduct(product);
                        console.log('selectedProduct in ProductList', product);

                        openModal();
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
                          'text-white',
                          favoritesList.includes(_id)
                            ? ' fill-orange-500'
                            : 'fill-white stroke-black',
                        )}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="-2 10 35 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-inherit stroke-inherit"
                        >
                          <path d="M15 27.525L12.825 25.545C5.1 18.54 0 13.905 0 8.25C0 3.615 3.63 0 8.25 0C10.86 0 13.365 1.215 15 3.12C16.635 1.215 19.14 0 21.75 0C26.37 0 30 3.615 30 8.25C30 13.905 24.9 18.54 17.175 25.545L15 27.525Z" />
                        </svg>
                      </button>

                      <div className="flex items-center justify-end">
                        <p
                          className="border-r border-black pr-1 text-base font-medium"
                          onClick={() => {
                            setSelectedProduct(product);
                            openModal();
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
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 36 36"
                            fill="none"
                            className="fill-black hover:fill-orange-500"
                          >
                            <path d="M35.7068 9.98438C35.6036 9.83783 35.4667 9.71821 35.3077 9.6356C35.1486 9.553 34.972 9.50982 34.7928 9.5097H10.9169L9.1096 3.2772C8.40085 0.823013 6.71669 0.558075 6.02594 0.558075H1.207C0.589344 0.558075 0.0898438 1.05814 0.0898438 1.6752C0.0898438 2.29226 0.589906 2.79229 1.20697 2.79229H6.02534C6.17778 2.79229 6.64297 2.79229 6.96025 3.8886L13.1776 26.7379C13.3126 27.22 13.7519 27.5529 14.253 27.5529H29.4394C29.9108 27.5529 30.3315 27.2576 30.4908 26.8138L35.8435 11.0048C35.9667 10.6622 35.9155 10.2808 35.7068 9.98438H35.7068ZM28.6532 25.3193H15.101L11.5448 11.7445H33.2045L28.6532 25.3193ZM26.4376 29.8171C24.884 29.8171 23.6251 31.076 23.6251 32.6296C23.6251 34.1832 24.884 35.4421 26.4376 35.4421C27.9912 35.4421 29.2501 34.1832 29.2501 32.6296C29.2501 31.076 27.9912 29.8171 26.4376 29.8171ZM16.3126 29.8171C14.759 29.8171 13.5001 31.076 13.5001 32.6296C13.5001 34.1832 14.759 35.4421 16.3126 35.4421C17.8662 35.4421 19.1251 34.1832 19.1251 32.6296C19.1251 31.076 17.8662 29.8171 16.3126 29.8171Z" />
                          </svg>
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

          <ModalProduct
            product={selectedProduct}
            closeModal={closeModal}
            isOpen={isModalOpen}
            isRetail
          />
        </>
      )}
    </>
  );
};

export default ProductList;
