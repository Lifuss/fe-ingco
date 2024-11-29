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
      const savedUser = JSON.parse(
        localStorage.getItem('persist:auth') as string,
      );
      const token = JSON.parse(savedUser?.token);

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
      <main className="min-h-[70%]">{children}</main>
    </>
  );
};

export default Layout;
