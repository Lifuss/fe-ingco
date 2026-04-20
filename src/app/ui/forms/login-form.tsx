'use client';

import { Button } from '../buttons/button';
import Link from 'next/link';
import { loginThunk } from '@/lib/appState/user/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import withAuth from '../../service/PrivateRouting';
import { toast } from 'react-toastify';
import Loader from '../utils/Loader';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, isB2b } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isB2b) {
      redirect('/shop');
    } else if (isAuthenticated && !isB2b) {
      redirect('/');
    }
  }, [isAuthenticated, isB2b]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const login = form.login.value.trim();
    const password = form.password.value.trim();
    dispatch(loginThunk({ login, password }))
      .unwrap()
      .then(({ isB2B }) => {
        if (isB2B) {
          router.push('/shop');
        } else {
          router.push('/');
        }
        toast.success('💸Вітаємо в INGCO!💸');
      })
      .catch((error) => {
        console.error('Error in login:', error);
        toast.error('Помилка авторизації');
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
          className="hover:text-orange-light mt-5 ml-auto block w-fit text-base underline transition-all duration-200 ease-out"
          href={'/auth/forgot'}
        >
          Забули пароль?
        </Link>
        {!isLoading ? (
          <LoginButton />
        ) : (
          <Button className="pointer-events-none mt-4 w-full bg-orange-400 py-2 text-2xl">
            <Loader className="mx-auto" size={32} />
          </Button>
        )}
        <p className="mt-8 text-center">
          Немає облікового запису?{' '}
          <Link
            className="hover:text-orange-light w-fit text-base underline transition-all duration-200 ease-out"
            href={'/auth/register'}
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
  return (
    <Button className="bg-orange-light mt-4 w-full text-2xl hover:bg-orange-400">
      Увійти
    </Button>
  );
}

export default withAuth(LoginForm);
