'use client';

import { useAppSelector } from '@/lib/hooks';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface ComponentProps {
  [key: string]: any;
}

export default function withAuth(
  Component: React.ComponentType<ComponentProps>,
) {
  return function ProtectedRoute(props: ComponentProps) {
    const { isAuthenticated, user } = useAppSelector(
      (state) => state.persistedAuthReducer,
    );
    useEffect(() => {
      if (!isAuthenticated) {
        console.log('redirecting to login');
        redirect('/login');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    if (user.isVerified === false) {
      console.log('need to verify email');
      redirect('/');
    }

    return <Component {...props} />;
  };
}
