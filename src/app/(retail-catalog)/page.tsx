'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProductList from '@/app/ui/product/ProductList';
import ShopTable from '@/app/ui/product/ShopTable';
import { useEffect } from 'react';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import CatalogSidebar from '~/ui/catalog/CatalogSidebar';

// B2C Landing Page Components
import RetailHero from '~/ui/home/RetailHero';
import TrustRibbon from '~/ui/home/TrustRibbon';
import SeriesComparison from '~/ui/home/SeriesComparison';
import CategoryGrid from '~/ui/home/CategoryGrid';
import HotOffers from '~/ui/home/HotOffers';
import Testimonials from '~/ui/home/Testimonials';
import FaqSection from '~/ui/home/FaqSection';
import ConsultationCTA from '~/ui/home/ConsultationCTA';

export default function Page() {
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);
  const { products = [] } = useAppSelector((state) => state.persistedMainReducer);

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || '';
  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '';
  const catalog = searchParams.get('catalog') || '';

  const showCatalog = !!(category || query || page || catalog === 'true');

  // Prefetch products for B2C Showcase elements if not already present
  useEffect(() => {
    if (!showCatalog && products.length === 0) {
      dispatch(
        fetchMainTableDataThunk({
          page: 1,
          limit: 100,
          isRetail: true,
          query: '',
          sortValue: 'default',
        }),
      );
    }
  }, [dispatch, showCatalog, products.length]);

  useEffect(() => {
    if (!isAuthenticated) {
      let token: string | null = null;
      try {
        const savedUserString = localStorage.getItem('persist:auth');
        if (savedUserString) {
          const savedUser = JSON.parse(savedUserString);
          if (savedUser?.token) {
            try {
              token = JSON.parse(savedUser.token);
            } catch {
              token = savedUser.token; // Fallback if token is already a plain string
            }
          }
        }
      } catch (e) {
        console.error('Error parsing auth from local storage:', e);
      }
      if (token) {
        dispatch(refreshTokenThunk())
          .unwrap()
          .catch(() => {
            dispatch(clearAuthState());
            toast.info('Сесія закінчилися. Для взаємодії з акаунтом будь ласка, увійдіть знову.');
          });
      }
    }
  }, [dispatch, isAuthenticated]);

  if (isAuthenticated && isB2b) {
    return (
      <main className="flex flex-col gap-4 bg-white px-[60px] pt-8 xl:flex-row 2xl:gap-14">
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

  return showCatalog ? (
    <main className="flex flex-col gap-4 bg-white px-[60px] pt-8 xl:flex-row 2xl:gap-14">
      <CatalogSidebar />
      <div className="min-h-[550px] w-full">
        <ProductList />
      </div>
    </main>
  ) : (
    <main className="flex min-h-[550px] flex-col bg-[#FFF8F5]">
      <RetailHero />
      <TrustRibbon />
      <HotOffers products={products} />
      <CategoryGrid />
      <SeriesComparison products={products} />
      <Testimonials />
      <FaqSection />
      <ConsultationCTA />
    </main>
  );
}
