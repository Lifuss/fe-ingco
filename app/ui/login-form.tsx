'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
// import { authenticate } from '../../lib/actions';

export default function LoginForm() {
  // const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const user = await response.json();
      // dispatch({ type: 'success', user });
    } else {
      const { error } = await response.json();
      // dispatch({ type: 'failure', error });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg pb-4">
        <div className="w-full">
          <div>
            <label className="mb-2 block text-base" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Ваш email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-base" htmlFor="password">
              Пароль
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Введіть пароль"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Link
          className="ml-auto mt-5 block w-fit text-base underline transition-all duration-200 ease-out hover:text-orangeLight"
          href={'/forgot'}
        >
          Забули пароль?
        </Link>
        <LoginButton />
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
        >
          {/* {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )} */}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full text-2xl" aria-disabled={pending}>
      Увійти
    </Button>
  );
}
