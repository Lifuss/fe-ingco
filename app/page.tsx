'use client';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const isAuthenticated = useAppSelector(
    (state) => state.persistedAuthReducer.isAuthenticated,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(refreshTokenThunk())
      .unwrap()
      .then(() => {
        router.push('/shop');
      })
      .catch(() => {
        router.push('/home');
      });
  }, [dispatch, router]);
  return <></>;
}
