'use client';
import { useProductStats } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React from 'react';
import ProductCard from './ProductCard';

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

  const handleDirectToProduct = (id: string) => {
    logProductClick(id); // tracking product activity

    const link = listType === 'retail' ? `/retail/${id}` : `/shop/${id}`;
    router.push(link);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {productsData?.map((product) => {
          return (
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
