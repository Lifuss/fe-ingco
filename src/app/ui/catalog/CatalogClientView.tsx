'use client';

import React, { useSyncExternalStore, Suspense } from 'react';
import { useIsB2B } from '@/lib/hooks';
import ShopTable from '@/app/ui/product/ShopTable';
import ProductList from '@/app/ui/product/ProductList';
import { Category } from '@/lib/types';
import { ServerProductsResponse } from '@/lib/serverData';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface CatalogClientViewProps {
  isFavoritePage?: boolean;
  initialCategory?: Category;
  initialCatalogData?: ServerProductsResponse;
}

export default function CatalogClientView(props: CatalogClientViewProps) {
  return (
    <Suspense fallback={<div className="min-h-[550px] w-full" />}>
      <CatalogClientViewContent {...props} />
    </Suspense>
  );
}

function CatalogClientViewContent({
  isFavoritePage = false,
  initialCategory,
  initialCatalogData,
}: CatalogClientViewProps) {
  const isB2B = useIsB2B();
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const showB2BTable = isClient && isB2B;

  if (showB2BTable) {
    return (
      <div className="w-full">
        <ShopTable isFavoritePage={isFavoritePage} />
        <div
          id="image"
          className="absolute z-50 hidden h-[200px] w-[200px] 2xl:h-[250px] 2xl:w-[250px]"
        ></div>
      </div>
    );
  }

  return (
    <ProductList
      isFavoritePage={isFavoritePage}
      initialCategory={initialCategory}
      initialCatalogData={initialCatalogData}
    />
  );
}
