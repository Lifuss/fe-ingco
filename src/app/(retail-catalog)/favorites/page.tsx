'use client';

import ProductList from '@/app/ui/product/ProductList';
import ShopTable from '@/app/ui/product/ShopTable';
import { useAppSelector } from '@/lib/hooks';

const Page = () => {
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  return (
    <main className="min-h-[550px] w-full bg-white px-[60px] pt-8">
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

export default Page;
