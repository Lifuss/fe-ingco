'use client';
import { useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useAddToCartMutation } from '@/lib/appState/api/cartApi';
import { useAddFavoriteMutation, useDeleteFavoriteMutation } from '@/lib/appState/api/favoritesApi';
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

const ShopList = ({ isFavoritePage = false, products, favorites = [] }: ShopListProps) => {
  const searchParams = useSearchParams();
  const [addToCart] = useAddToCartMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const usdRate = useAppSelector(selectUSDRate);

  const favoritesList = (favorites || []).map((product) => product.id);

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';

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

  async function handleFavoriteClick(id: number) {
    try {
      if (favoritesList.includes(id)) {
        await deleteFavorite(id).unwrap();
      } else {
        await addFavorite(id).unwrap();
      }
    } catch {
      toast.error('Не вдалося оновити обране');
    }
  }

  const handleCartClick = async (id: number, productName: string) => {
    try {
      await addToCart({
        productId: id,
        quantity: 1,
        isRetail: false,
      }).unwrap();
      toast.success(`1 шт. - ${productName} додано в кошик`);
    } catch {
      toast.error('Не вдалося додати товар у кошик');
    }
  };

  // Перехід на товар тепер обробляється всередині ProductBlockList з урахуванням query

  return (
    <>
      {products.length === 0 ? (
        <div className="pt-10">
          <TextPlaceholder
            title="Нічого не знайдено"
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
