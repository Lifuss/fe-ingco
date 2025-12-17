'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProductList from '~/retail/ProductList';
import { useEffect } from 'react';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import CategoriesSidebar from '~/ui/CategoriesSidebar';
import Header from '~/ui/home/Header';
import Footer from '~/ui/Footer';

export default function Page() {
  const { isAuthenticated, isB2b } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isB2b) {
      router.push('/shop');
      return;
    }

    if (!isAuthenticated) {
      let token: string | null = null;
      const savedUserString = localStorage.getItem('persist:auth');
      if (savedUserString) {
        const savedUser = JSON.parse(savedUserString);
        token = savedUser?.token ? JSON.parse(savedUser.token) : null;
      }
      if (token) {
        dispatch(refreshTokenThunk())
          .unwrap()
          .then((response) => {
            if (response.isB2b) {
              router.push('/shop');
            }
          })
          .catch((err) => {
            dispatch(clearAuthState());
            toast.info(
              'Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.',
            );
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
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px] w-full">
          <ProductList />
        </div>
      </main>
      <Footer />
    </>
  );
}
