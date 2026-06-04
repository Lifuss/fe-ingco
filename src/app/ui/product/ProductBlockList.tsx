'use client';

import { useAppSelector, useProductStats } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { CardSkeleton } from '../skeletons/skeletons';

interface ProductBlockListProps {
  productsData: Product[];
  listType: 'partner' | 'retail';
  handleCartClick?: (id: string, productName: string) => void;
  handleFavoriteClick?: (id: string) => void;
  favoritesIdList: string[];
  USDCurrency?: number;
}

const ProductBlockList = ({
  productsData = [],
  listType = 'retail',
  USDCurrency,
  favoritesIdList,
}: ProductBlockListProps) => {
  const { logProductClick } = useProductStats();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isProductsLoading = useAppSelector((state) => state.persistedMainReducer.tableLoading);
  const shopView = useAppSelector((state) => state.persistedMainReducer.shopView);
  
  const viewParam = searchParams.get('view') || 'grid';
  const isListView = listType === 'partner' ? shopView === 'list' : viewParam === 'list';

  const handleDirectToProduct = (id: string, slug: string) => {
    logProductClick(id);

    const base = listType === 'retail' ? `/${slug}` : `/shop/${slug}`;
    const qs = searchParams.toString();
    const link = qs ? `${base}?${qs}` : base;
    router.push(link);
  };

  return (
    <div className="w-full">
      <ul 
        className={
          isListView
            ? 'flex flex-col gap-4 w-full'
            : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full'
        }
      >
        {productsData?.map((product) => {
          return isProductsLoading ? (
            <CardSkeleton key={product._id} />
          ) : (
            <ProductCard
              key={product._id}
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
