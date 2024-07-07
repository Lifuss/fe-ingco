'use client';

import { Button } from '../buttons/button';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { registerClientThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import { CircleHelp } from 'lucide-react';

const inputStyle =
  'block w-full rounded-2xl border border-[#1d1c1c] py-[16px] pl-4 text-base outline-2 placeholder:text-gray-500';

export default function RegisterClientForm() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/retail');
    }
  }, [isAuthenticated]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.password.value !== form.checkPassword.value) {
      toast.error('Паролі не співпадають');
      return;
    }
    const credential = {
      email: form.email.value.trim(),
      lastName: form.lastName.value.trim(),
      firstName: form.firstName.value.trim(),
      surName: form.surName.value.trim(),
      phone: form.phone.value.trim(),
      password: form.password.value.trim(),
    };
    dispatch(registerClientThunk(credential))
      .unwrap()
      .then(() => {
        toast.info('Ви успішно зареєструвалися');
        router.push('/auth/login');
      })
      .catch((error) => {
        console.error('Error in login:', error);
        toast.error('Помилка авторизації');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg pb-4">
        <div className="flex w-full flex-col gap-2">
          <div>
            <label className="mb-2 block text-base" htmlFor="lastName">
              Прізвище <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Прізвище"
              required
              pattern="[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]{2,}"
            />
          </div>

          <div>
            <label className="mb-2 block text-base" htmlFor="firstName">
              Ім&apos;я <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Ім'я"
              required
              pattern="[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]{2,}"
            />
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="surName">
              По батькові <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="surName"
              type="text"
              name="surName"
              placeholder="По батькові"
              required
              pattern="[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]{2,}"
            />
          </div>
          <div className="flex gap-5">
            <div>
              <label className="mb-2 block text-base" htmlFor="phone">
                Номер телефону <span className="text-red">*</span>
              </label>
              <input
                className={inputStyle}
                id="phone"
                type="phone"
                name="phone"
                placeholder="38067..."
                required
                pattern="\[0-9]{12}"
              />
            </div>

            <div>
              <label className="mb-2 block text-base" htmlFor="email">
                <div className="inline-flex w-full items-center justify-between">
                  <div>
                    Email
                    <span className="text-red">*</span>
                  </div>
                  <span
                    className="cursor-help text-gray-400 hover:text-gray-600"
                    title="Ваш email буде логіном для входу"
                  >
                    <CircleHelp size={16} />
                  </span>
                </div>
              </label>
              <input
                className={inputStyle}
                id="email"
                type="email"
                name="email"
                placeholder="Ваш email"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="password">
              Пароль <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="password"
              type="password"
              name="password"
              placeholder="Пароль"
              maxLength={20}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="checkPassword">
              Повторіть пароль <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="checkPassword"
              type="password"
              name="checkPassword"
              placeholder="Пароль"
              maxLength={20}
              required
            />
          </div>
        </div>
        <RegisterButton />
        <p className="mt-8 text-center">
          Вже зареєстровані?{' '}
          <Link
            className="w-fit text-base underline transition-all duration-200 ease-out hover:text-orangeLight"
            href={'/auth/login'}
          >
            Ввійти в акаунт
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

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="text-2x mt-4 w-full  bg-orangeLight text-2xl hover:bg-orange-400"
      aria-disabled={pending}
    >
      Зареєструватися
    </Button>
  );
}
