'use client';

import { refreshTokenThunk } from '@/lib/appState/auth/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ComponentProps {
  [key: string]: any;
}

export default function withAuth(
  Component: React.ComponentType<ComponentProps>,
) {
  return function ProtectedRoute(props: ComponentProps) {
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
        } else if (pathname !== '/login' && pathname !== '/register') {
          redirect('/login');
        }
      }
    }, []);

    if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      return null;
    }
    // TODO: check if the register and login redirect works correctly
    if (
      user.isVerified === false &&
      pathname !== '/login' &&
      pathname !== '/register'
    ) {
      console.log('need to verify email');
      redirect('/');
    }

    return <Component {...props} />;
  };
}
