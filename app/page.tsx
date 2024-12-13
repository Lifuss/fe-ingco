'use client';
import { refreshTokenThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Home from './ui/pages/Home';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(refreshTokenThunk())
      .unwrap()
      .then(() => {
        router.push('/shop');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, router]);

  return loading ? (
    <h2 className="h-screen pt-10 text-center text-2xl">
      Перевірка вашого статусу автентифікації...
    </h2>
  ) : (
    <Home isMainPage={true} />
  );
}
