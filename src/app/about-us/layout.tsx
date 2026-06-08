'use client';

import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';
import Footer from '../ui/Footer';
import Header from '../ui/home/Header';

const Layout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.persistedAuthReducer);
  const dispatch = useAppDispatch();

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
            toast.info('Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.');
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
