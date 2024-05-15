'use client';

import { Button } from './button';
import Link from 'next/link';
import { loginThunk } from '@/lib/appState/auth/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import withAuth from '../service/PrivateRouting';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/shop');
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const login = form.login.value.trim();
    const password = form.password.value.trim();
    dispatch(loginThunk({ login, password }))
      .unwrap()
      .then(() => {
        router.push('/shop');
      })
      .catch((error) => {
        // TODO: пропрацювати помилки авторизації та вивести їх на екран
        console.error('Error in login:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg pb-4">
        <div className="w-full">
          <div>
            <label className="mb-2 block text-base" htmlFor="login">
              Логін
            </label>
            <input
              className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
              id="login"
              type="text"
              name="login"
              placeholder="Ваш лоігн"
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-base" htmlFor="password">
              Пароль
            </label>
            <input
              className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              placeholder="Введіть пароль"
              required
              minLength={6}
            />
          </div>
        </div>
        <Link
          className="ml-auto mt-5 block w-fit text-base underline transition-all duration-200 ease-out hover:text-orangeLight"
          href={'/forgot'}
        >
          Забули пароль?
        </Link>
        {!isLoading ? <LoginButton /> : <h2> Завантаження</h2>}
        <p className="mt-8 text-center">
          Немає облікового запису?{' '}
          <Link
            className="w-fit text-base underline transition-all duration-200 ease-out hover:text-orangeLight"
            href={'/register'}
          >
            Зареєструватися
          </Link>
        </p>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}

function LoginButton() {
  return <Button className="mt-4 w-full text-2xl">Увійти</Button>;
}

export default withAuth(LoginForm);
