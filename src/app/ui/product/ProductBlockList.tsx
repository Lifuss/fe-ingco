'use client';

import { Product } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

interface ProductBlockListProps {
  productsData: Product[];
  listType: 'partner' | 'retail';
  handleCartClick?: (id: number, productName: string) => void;
  handleFavoriteClick?: (id: number) => void;
  favoritesIdList: number[];
  USDCurrency?: number;
}

const ProductBlockList = ({
  productsData = [],
  listType = 'retail',
  USDCurrency,
  favoritesIdList,
}: ProductBlockListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get('view') || 'grid';
  const isListView = listType === 'partner' ? false : viewParam === 'list';

  const handleDirectToProduct = (_id: number, slug: string) => {
    const base = `/${slug}`;
    const qs = searchParams ? searchParams.toString() : '';
    const link = qs ? `${base}?${qs}` : base;
    router.push(link);
  };

  return (
    <div className="w-full">
      <h2 className="sr-only">Список товарів</h2>
      <ul
        className={
          isListView
            ? 'flex w-full flex-col gap-4'
            : 'grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      >
        {productsData?.map((product) => {
          return (
            <ProductCard
              key={product.id}
              product={product}
              listType={listType}
              handleDirectToProduct={handleDirectToProduct}
              favoritesIdList={favoritesIdList}
              USDCurrency={USDCurrency}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ProductBlockList;
