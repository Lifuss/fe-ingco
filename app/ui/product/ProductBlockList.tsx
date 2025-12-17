'use client';
import { useAppSelector, useProductStats } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { CardSkeleton } from '../skeletons/skeletons';

interface ProductBlockListProps {
  productsData: Product[];
  listType: 'partner' | 'retail';
  handleCartClick: (id: string, productName: string) => void;
  handleFavoriteClick: (id: string) => void;
  favoritesIdList: string[];
  USDCurrency?: number;
}

const ProductBlockList = ({
  productsData = [],
  listType = 'retail',
  USDCurrency,
  favoritesIdList,
  handleCartClick,
  handleFavoriteClick,
}: ProductBlockListProps) => {
  const { logProductClick } = useProductStats();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProductsLoading = useAppSelector(
    (state) => state.persistedMainReducer.tableLoading,
  );

  const handleDirectToProduct = (id: string, slug: string) => {
    logProductClick(id);

    const base = listType === 'retail' ? `/${slug}` : `/shop/${slug}`;
    const qs = searchParams.toString();
    const link = qs ? `${base}?${qs}` : base;
    router.push(link);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
        {productsData?.map((product) => {
          return isProductsLoading ? (
            <CardSkeleton />
          ) : (
            <ProductCard
              key={product._id}
              product={product}
              listType={listType}
              handleDirectToProduct={handleDirectToProduct}
              handleCartClick={handleCartClick}
              handleFavoriteClick={handleFavoriteClick}
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
