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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerClientSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import Loader from '../utils/Loader';

type RegisterFormData = z.infer<typeof registerClientSchema>;

export const inputStyle =
  'block w-full rounded-2xl border border-[#1d1c1c] py-[16px] pl-4 text-base outline-2 placeholder:text-gray-500';
const errorClassName = 'max-w-[22em] p-1 text-red-500 text-sm';

export default function RegisterClientForm() {
  const { isAuthenticated } = useAppSelector(
    (state) => state.persistedAuthReducer,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerClientSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/retail');
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { checkPassword, ...registerData } = data;
      const registerResponse = await dispatch(
        registerClientThunk(registerData),
      );
      // @ts-ignore
      if (registerResponse.error) {
        if (registerResponse.payload.message.includes('409')) {
          toast.error('Такий email вже зайнятий');
        } else {
          toast.error('Помилка авторизації');
        }
      } else {
        toast.success('Ви успішно зареєструвалися');
        router.push('/auth/login');
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error('Щось пішло не так, спробуйте ще раз.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
              className={inputStyle}
              id="firstName"
              type="text"
              placeholder="Ім'я"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className={errorClassName}>{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="surName">
              По батькові <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
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
                className={inputStyle}
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
                placeholder="Ваш email"
                {...register('email')}
              />
              {errors.email && (
                <p className={errorClassName}>{errors.email.message}</p>
              )}
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
              placeholder="Пароль"
              {...register('password')}
            />
            {errors.password && (
              <p className={errorClassName}>{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-base" htmlFor="checkPassword">
              Повторіть пароль <span className="text-red">*</span>
            </label>
            <input
              className={inputStyle}
              id="checkPassword"
              type="password"
              placeholder="Пароль"
              {...register('checkPassword')}
            />
            {errors.checkPassword && (
              <p className={errorClassName}>{errors.checkPassword.message}</p>
            )}
          </div>
        </div>
        <Button
          className="text-2x mt-4 w-full  bg-orangeLight text-2xl hover:bg-orange-400"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader className="mx-auto" size={32} />
          ) : (
            'Зареєструватися'
          )}
        </Button>
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
