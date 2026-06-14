'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import TextPlaceholder from '../TextPlaceholder';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import ProductBlockList from '../product/ProductBlockList';
import FiltersBlock, { sortValueType } from '../catalog/FiltersBlock';
import { SITE_URL } from '@/lib/metadata';

const ProductList = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const mainState = useAppSelector((state) => state.persistedMainReducer);
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
  const isWideDesktop = useMediaQuery({ query: '(min-width: 1536px)' });

  const { products = [], totalPages = 1 } = mainState;
  const favorites: Product[] = [...(authState.user?.favorites || [])];
  const isAuth = authState.isAuthenticated || false;
  const favoritesIdList = favorites.map((product) => product.id);

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const sortValue: sortValueType = (searchParams.get('sortValue') as sortValueType) || 'default';
  const filters = searchParams.get('filters') || '';

  // Spec filters from URL
  const minPower = searchParams.get('minPower')
    ? parseInt(searchParams.get('minPower') as string)
    : null;
  const maxPower = searchParams.get('maxPower')
    ? parseInt(searchParams.get('maxPower') as string)
    : null;
  const battery = searchParams.get('battery') === 'true';
  const mains = searchParams.get('mains') === 'true';

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
      productsData = productsData.filter(
        (product) =>
          String(product.category?.id) === category ||
          product.category?.name.toLowerCase().includes(category.toLowerCase()),
      );
    }
  }

  // Client-side specifications filtering
  if (minPower !== null || maxPower !== null) {
    productsData = productsData.filter((product) => {
      const powerChar = product.characteristics?.find((c) =>
        c.name.toLowerCase().includes('потужність'),
      );
      if (!powerChar) return false;
      const powerVal = parseInt(powerChar.value);
      if (isNaN(powerVal)) return false;
      if (minPower !== null && powerVal < minPower) return false;
      if (maxPower !== null && powerVal > maxPower) return false;
      return true;
    });
  }

  if (battery || mains) {
    productsData = productsData.filter((product) => {
      const nameLower = product.name.toLowerCase();
      const hasBatteryIndicators =
        nameLower.includes('акумулятор') ||
        product.characteristics?.some(
          (c) =>
            c.name.toLowerCase().includes('напруга') ||
            c.value.toLowerCase().includes('li-ion') ||
            c.value.toLowerCase().includes('акум') ||
            c.value.toLowerCase().includes('в ') ||
            c.value.endsWith('в'),
        );

      const isBatteryProduct = !!hasBatteryIndicators;
      const isMainsProduct = !isBatteryProduct;

      if (battery && isBatteryProduct) return true;
      if (mains && isMainsProduct) return true;
      return false;
    });
  }

  if (isFavoritePage) {
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
          filters,
        }),
      );
    }
  }, [dispatch, page, query, category, isFavoritePage, limit, sortValue, filters]);

  function handleFavoriteClick(id: number) {
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

  const handleCartClick = (id: number, productName: string) => {
    if (isAuth) {
      dispatch(
        addProductToCartThunk({
          productId: id,
          quantity: 1,
          isRetail: true,
        }),
      )
        .unwrap()
        .then(() => {
          toast.success(`${productName} додано в кошик`);
        });
    } else {
      const product = productsData.find((product) => product.id === id);
      if (!product) {
        toast.error('Виникла помилка з додаванням товару в кошик, спробуйте ще раз');
        return;
      }
      const { price: _price, priceBulk: _priceBulk, ...restProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: restProduct,
          quantity: 1,
          id,
        }),
      );

      toast.success(`${productName} додано в кошик`);
    }
  };

  const totalPage = isFavoritePage ? Math.ceil(favorites.length / 10) : totalPages;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productsData.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <>
      {productsData.length > 0 && !isFavoritePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema, null, 2),
          }}
        />
      )}
      {productsData.length === 0 ? (
        <div className="pt-10">
          <TextPlaceholder
            title="Не знайдено 🥲"
            text={
              isFavoritePage
                ? 'Ви ще не додали жодного товару або видалили наявні товари з обраного'
                : 'Спробуйте змінити параметри пошуку або фільтрації'
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
            <div className="mx-auto mt-8 w-fit pb-10">
              <Pagination totalPages={totalPage} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductList;
