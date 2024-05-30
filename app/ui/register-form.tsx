'use client';

import { Button } from './button';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { registerThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';

export default function RegisterForm() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/shop');
    }
  }, [isAuthenticated]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const credential = {
      email: form.email.value.trim(),
      lastName: form.lastName.value.trim(),
      firstName: form.firstName.value.trim(),
      surName: form.surName.value.trim(),
      phone: form.phone.value.trim(),
      edrpou: form.edrpou.value.trim(),
      about: form.about.value.trim(),
    };
    dispatch(registerThunk(credential))
      .unwrap()
      .then(() => {
        alert(
          'Дякую за довіру\nПісля реєстрації менеджер обробить інформацію протягом 1 робочого дня і вам на пошту прийде лист з іформацією та паролем для входу в акаунт',
        );
        toast.info(
          'Після реєстрації менеджер обробить інформацію протягом 1 робочого дня і вам на пошту прийде лист з іформацією та паролем для входу в акаунт',
        );
        router.push('/shop');
      })
      .catch((error) => {
        // TODO: пропрацювати помилки авторизації та вивести їх на екран
        console.error('Error in login:', error);
        toast.error('Помилка авторизації');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg pb-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex gap-5">
            <div>
              <label className="mb-2 block text-base" htmlFor="lastName">
                Прізвище <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Прізвище"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-base" htmlFor="firstName">
                Ім&apos;я <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Ім'я"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="surName">
              По батькові <span className="text-red">*</span>
            </label>
            <input
              className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
              id="surName"
              type="text"
              name="surName"
              placeholder="По батькові"
              required
            />
          </div>
          <div className="flex gap-5">
            <div>
              <label className="mb-2 block text-base" htmlFor="phone">
                Номер телефону <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="phone"
                type="phone"
                name="phone"
                placeholder="+38"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-base" htmlFor="edrpou">
                Код ЄДРПОУ <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="edrpou"
                type="text"
                name="edrpou"
                placeholder="ЄДРПОУ"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="email">
              Email <span className="text-red">*</span>
            </label>
            <input
              className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Ваш email"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="about">
              Розкажіть про себе
            </label>
            <textarea
              className="peer block max-h-56 w-full rounded-2xl border border-[#1d1c1c] pb-[20px] pl-4 pt-[10px] text-base outline-2 placeholder:text-gray-500"
              name="about"
              id="about"
              placeholder="Необов'язкове поле про свою діяльність та цілі"
            />
          </div>
        </div>
        <RegisterButton />
        <p className="mt-8 text-center">
          Вже зареєстровані та верифіковані?{' '}
          <Link
            className="w-fit text-base underline transition-all duration-200 ease-out hover:text-orangeLight"
            href={'/register'}
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
    <Button className="mt-4 w-full text-2xl" aria-disabled={pending}>
      Зареєструватися
    </Button>
  );
}
