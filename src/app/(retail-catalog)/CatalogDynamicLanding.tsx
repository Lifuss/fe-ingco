'use client';

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useSyncExternalStore } from 'react';
import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import ShopTable from '@/app/ui/product/ShopTable';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface CatalogDynamicLandingProps {
  children: ReactNode;
}

export default function CatalogDynamicLanding({ children }: CatalogDynamicLandingProps) {
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const displayB2b = isClient && isAuthenticated && isB2b;

  if (displayB2b) {
    return (
      <main className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 bg-white px-4 pt-8 md:px-8 xl:flex-row 2xl:gap-10">
        <CatalogSidebar />
        <div className="min-h-[550px] w-full">
          <ShopTable />
          <div
            id="image"
            className="absolute z-50 hidden h-[200px] w-[200px] 2xl:h-[250px] 2xl:w-[250px]"
          ></div>
        </div>
      </main>
    );
  }

  return <main className="flex min-h-[550px] flex-col bg-[#FFF8F5]">{children}</main>;
}
