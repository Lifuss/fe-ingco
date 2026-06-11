'use client';

import React from 'react';
import Header from '~/ui/header/Header';
import Footer from '~/ui/Footer';
import { useAppSelector } from '@/lib/hooks';

export default function CatalogLayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  return (
    <>
      <Header />
      {children}
      <Footer isShop={isB2b} />
    </>
  );
}
