'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { registerThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import { Button } from '../buttons/button';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPartnerForm() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/shop');
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerResponse = await dispatch(registerThunk(data));
      console.log(registerResponse);
      // @ts-ignore
      if (registerResponse.error) {
        if (registerResponse.payload.message.includes('409')) {
          toast.error('Такий email вже зайнятий');
        } else {
          toast.error('Помилка авторизації');
        }
      } else {
        toast.info(
          'Ми постараємося обробити інформацію як найскоріше, якщо уточнень для вашого акаунту буде не потрібно, всі реквізити для входу будуть надіслані на пошту',
          {
            autoClose: 15000,
          },
        );
        toast.info(
          <Link href={'/retail'}>
            Ознайомлення з продукцією INGCO можна розпочати в роздрібному
            каталозі
          </Link>,
          {
            autoClose: 15000,
          },
        );
        router.push('/home');
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error('Щось пішло не так, спробуйте ще раз.');
    }
  };

  const errorClassName = 'p-1 text-red-500 text-sm';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                placeholder="Прізвище"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className={errorClassName}>{errors.lastName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-base" htmlFor="firstName">
                Ім&apos;я <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="firstName"
                type="text"
                placeholder="Ім'я"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className={errorClassName}>{errors.firstName.message}</p>
              )}
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
              placeholder="По батькові"
              {...register('surName')}
            />
            {errors.surName && (
              <p className={errorClassName}>{errors.surName.message}</p>
            )}
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
                placeholder="+38067..."
                defaultValue="+"
                {...register('phone')}
              />
              {errors.phone && (
                <p className={errorClassName}>{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-base" htmlFor="edrpou">
                Код ЄДРПОУ <span className="text-red">*</span>
              </label>
              <input
                className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
                id="edrpou"
                type="text"
                placeholder="ЄДРПОУ"
                {...register('edrpou')}
              />
              {errors.edrpou && (
                <p className={errorClassName}>{errors.edrpou.message}</p>
              )}
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
              placeholder="Ваш email"
              {...register('email')}
            />
            {errors.email && (
              <p className={errorClassName}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="about">
              Розкажіть про себе
            </label>
            <textarea
              className="peer block max-h-56 w-full rounded-2xl border border-[#1d1c1c] pb-[20px] pl-4 pt-[10px] text-base outline-2 placeholder:text-gray-500"
              id="about"
              placeholder="Необов'язкове поле про свою діяльність..."
              {...register('about')}
            />
            {errors.about && (
              <p className={errorClassName}>{errors.about.message}</p>
            )}
          </div>
        </div>
        <Button
          className="text-2x mt-4 w-full  bg-orangeLight text-2xl hover:bg-orange-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Відправка...' : 'Зареєструватися'}
        </Button>
        <p className="mt-8 text-center">
          Вже зареєстровані та верифіковані?{' '}
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
