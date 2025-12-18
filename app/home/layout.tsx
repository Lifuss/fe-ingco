'use client';

import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';
import Footer from '../ui/Footer';
import Header from '../ui/home/Header';

const Layout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      const savedUserString = localStorage.getItem('persist:auth');
      if (!savedUserString) return;
      
      const savedUser = JSON.parse(savedUserString);
      const token = savedUser?.token ? JSON.parse(savedUser.token) : null;

      if (token) {
        dispatch(refreshTokenThunk())
          .unwrap()
          .catch((err) => {
            dispatch(clearAuthState());
            toast.info(
              'Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.',
            );
          });
      }
    }
  }, [dispatch, isAuthenticated]);
  return (
    <>
      <main className="min-h-[70%]">
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;
