'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToRetailCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import TextPlaceholder from '../ui/TextPlaceholder';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import ProductBlockList from '../ui/product/ProductBlockList';
import FiltersBlock, { sortValueType } from '../ui/FiltersBlock';

const ProductList = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const mainState = useAppSelector((state) => state.persistedMainReducer);
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const isWideDesktop = useMediaQuery({ query: '(min-width: 1536px)' });

  const { products = [], totalPages = 1 } = mainState;
  const favorites: Product[] = [...authState.user.favorites];
  const isAuth = authState.isAuthenticated || false;
  const favoritesIdList = favorites.map((product) => product._id);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const sortValue: sortValueType =
    (searchParams.get('sortValue') as sortValueType) || 'default';

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

  const limit = isWideDesktop ? 30 : isDesktop ? 20 : 18;
  useEffect(() => {
    if (!isFavoritePage) {
      dispatch(
        fetchMainTableDataThunk({
          page,
          query,
          category,
          limit,
          sortValue,
          isRetail: true,
        }),
      );
    }
  }, [dispatch, page, query, category, isFavoritePage, limit, sortValue]);

  function handleFavoriteClick(id: string) {
    if (isAuth) {
      if (favoritesIdList.includes(id)) {
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
      const product = productsData.find((product) => product._id === id);
      if (!product) {
        toast.error(
          'Виникла помилка з додаванням товару в кошик, спробуйте ще раз через',
        );
        return;
      }
      const { price: _price, priceBulk: _priceBulk, ...restProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: restProduct,
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
          <FiltersBlock listType="retail" />
          <ProductBlockList
            favoritesIdList={favoritesIdList}
            listType="retail"
            productsData={productsData}
            handleCartClick={handleCartClick}
            handleFavoriteClick={handleFavoriteClick}
          />

          <div className="relative">
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
