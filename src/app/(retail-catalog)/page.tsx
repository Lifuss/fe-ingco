'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProductList from '~/retail/ProductList';
import { useEffect } from 'react';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import CatalogSidebar from '~/ui/CatalogSidebar';
import Header from '~/ui/home/Header';
import Footer from '~/ui/Footer';

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
  const router = useRouter();
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
        })
      );
    }
  }, [dispatch, showCatalog, products.length]);

  useEffect(() => {
    if (isAuthenticated && isB2b) {
      router.push('/shop');
      return;
    }

    if (!isAuthenticated) {
      let token: string | null = null;
      try {
        const savedUserString = localStorage.getItem('persist:auth');
        if (savedUserString) {
          const savedUser = JSON.parse(savedUserString);
          token = savedUser?.token ? JSON.parse(savedUser.token) : null;
        }
      } catch (e) {
        console.error('Error parsing auth from local storage:', e);
      }
      if (token) {
        dispatch(refreshTokenThunk())
          .unwrap()
          .then((response) => {
            if (response.isB2b) {
              router.push('/shop');
            }
          })
          .catch(() => {
            dispatch(clearAuthState());
            toast.info('Сесія закінчилися. Для взаємодії з акаунтом будь ласка, увійдіть знову.');
          });
      }
    }
  }, [dispatch, router, isAuthenticated, isB2b]);

  if (isAuthenticated && isB2b) {
    return null;
  }

  return (
    <>
      <Header />
      {showCatalog ? (
        <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14 bg-white">
          <CatalogSidebar />
          <div className="min-h-[550px] w-full">
            <ProductList />
          </div>
        </main>
      ) : (
        <main className="flex flex-col bg-[#FFF8F5] min-h-[550px]">
          <RetailHero />
          <TrustRibbon />
          <HotOffers products={products} />
          <CategoryGrid />
          <SeriesComparison products={products} />
          <Testimonials />
          <FaqSection />
          <ConsultationCTA />
        </main>
      )}
      <Footer />
    </>
  );
}

