'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProductList from './ProductList';
import { useEffect } from 'react';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { toast } from 'react-toastify';

export default function Page() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
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
          .catch((err) => {
            dispatch(clearAuthState());
            toast.info(
              'Сесія закінчилася. Для взаємодії з акаунтом будь ласка, увійдіть знову.',
            );
          });
      }
    }
  }, [dispatch, isAuthenticated]);

  return <ProductList />;
}
