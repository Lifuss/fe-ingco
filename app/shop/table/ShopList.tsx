'use client';
import { useAppDispatch, useAppSelector, useProductStats } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import ProductBlockList from '@/app/ui/product/ProductBlockList';
import { selectUSDRate } from '@/lib/appState/main/selectors';

interface ShopListProps {
  isFavoritePage?: boolean;
  products: Product[];
  totalPages: number;
  favorites: Product[];
}

const ShopList = ({
  isFavoritePage = false,
  products,
  favorites,
}: ShopListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const mainState = useAppSelector((state) => state.persistedMainReducer);
  const usdRate = useAppSelector(selectUSDRate);
  const { logProductClick } = useProductStats();

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

  function handleFavoriteClick(id: string) {
    if (favoritesList.includes(id)) {
      dispatch(deleteFavoriteProductThunk(id));
    } else {
      dispatch(addFavoriteProductThunk(id));
    }
  }

  const handleCartClick = (id: string, productName: string) => {
    dispatch(
      addProductToCartThunk({
        productId: id,
        quantity: 1,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success(`1 шт. - ${productName} додано в кошик`);
      });
  };

  // Перехід на товар тепер обробляється всередині ProductBlockList з урахуванням query

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
        <ProductBlockList
          favoritesIdList={favoritesList}
          listType="partner"
          productsData={productsData}
          handleCartClick={handleCartClick}
          handleFavoriteClick={handleFavoriteClick}
          USDCurrency={usdRate}
        />
      )}
    </>
  );
};

export default ShopList;
