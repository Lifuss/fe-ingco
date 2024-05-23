'use client';

import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, usePathname } from 'next/navigation';
import { ComponentPropsWithRef, ComponentType, FC, useEffect } from 'react';

interface ComponentProps {
  [key: string]: any;
}

export default function withAuth(
  Component: ComponentType<ComponentPropsWithRef<any>>,
) {
  const AuthComponent: FC = (props) => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
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
          dispatch(refreshTokenThunk());
        } else if (
          pathname !== '/auth/login' &&
          pathname !== '/auth/register'
        ) {
          redirect('/auth/login');
        }
      }
    }, []);

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
      // TODO: add toast notification
      console.log('need to verify email');
      redirect('/');
    }

    // Admin routing
    if (pathname.includes('/dashboard') && user.role !== 'admin') {
      redirect('/');
    }

    return <Component {...props} />;
  };
  return AuthComponent;
}
