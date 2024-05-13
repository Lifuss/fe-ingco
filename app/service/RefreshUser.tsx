'use client';

import { refreshTokenThunk } from '@/lib/appState/auth/operation';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';

const RefreshUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokenThunk());
  }, [dispatch]);

  return <>{children}</>;
};

export default RefreshUser;
