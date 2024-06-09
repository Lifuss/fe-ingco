'use client';

import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { clearAuthState } from '@/lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { ComponentPropsWithRef, ComponentType, FC, useEffect } from 'react';
import { toast } from 'react-toastify';

interface ComponentProps {
  [key: string]: any;
}

export default function withAuth(
  Component: ComponentType<ComponentPropsWithRef<any>>,
) {
  const AuthComponent: FC = (props) => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user } = useAppSelector(
      (state) => state.persistedAuthReducer,
    );
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
              toast.error('Сесія закінчилася. Будь ласка, увійдіть знову.');
              router.push('/auth/login');
            });
        } else if (
          pathname !== '/auth/login' &&
          pathname !== '/auth/register'
        ) {
          redirect('/auth/login');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (
      !isAuthenticated &&
      pathname !== '/auth/login' &&
      pathname !== '/auth/register'
    ) {
      return null;
    }

    if (
      user.isVerified === false &&
      pathname !== '/auth/login' &&
      pathname !== '/auth/register'
    ) {
      toast.info('Ваш статус верифікації, не підтверджений');
      redirect('/home');
    }

    // Admin routing
    if (pathname.includes('/dashboard') && user.role !== 'admin') {
      redirect('/');
    }

    return <Component {...props} />;
  };
  return AuthComponent;
}
