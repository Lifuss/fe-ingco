'use client';
import ProductList from '@/app/ui/product/ProductList';
import ShopTable from '@/app/ui/product/ShopTable';
import { useAppSelector } from '@/lib/hooks';

const FavoritesClient = () => {
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  return (
    <main className="mx-auto min-h-[550px] w-full max-w-[1680px] bg-white px-4 pt-8 md:px-8 lg:px-[60px]">
      {isAuthenticated && isB2b ? (
        <>
          <ShopTable isFavoritePage={true} />
          <div
            id="image"
            className="absolute z-50 hidden h-[200px] w-[200px] 2xl:h-[250px] 2xl:w-[250px]"
          ></div>
        </>
      ) : (
        <ProductList isFavoritePage={true} />
      )}
    </main>
  );
};

export default FavoritesClient;
