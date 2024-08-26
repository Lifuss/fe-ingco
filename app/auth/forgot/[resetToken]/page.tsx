'use client';

import { Button } from '@/app/ui/buttons/button';
import { inputStyle } from '@/app/ui/forms/RegisterClient-form';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import { resetPasswordThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type PageProps = {
  params: {
    resetToken: string;
  };
};

const Page = ({ params }: PageProps) => {
  const [isAllow, setIsAllow] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!params.resetToken) {
      setIsAllow(false);
    }
  }, [params.resetToken]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;
    const checkPassword = password === (form.get('checkPassword') as string);
    if (!checkPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    dispatch(
      resetPasswordThunk({
        resetToken: params.resetToken,
        newPassword: password,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Пароль успішно змінено');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 500);
      })
      .catch(() => {
        toast.error('Посилання не валідне');
        setIsAllow(false);
      });
  };

  return isAllow ? (
    <form onSubmit={handleSubmit}>
      <div className="mt-20 grid place-content-center gap-4">
        <h1 className="mb-2 block text-center text-xl">Новий пароль</h1>
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
        <Button className="bg-orangeLight text-white hover:bg-orange-500">
          Скинути пароль
        </Button>
      </div>
    </form>
  ) : (
    <div className="mx-auto flex w-fit flex-col gap-4 pt-20">
      <TextPlaceholder
        text="Це посилання не валідне або термін операції скидування вже закінчився"
        title="Не можливо змінити пароль по цьому посиланню"
      />
      <Button
        onClick={() => {
          router.replace('/auth/login');
        }}
        className="bg-orangeLight text-white hover:bg-orange-500"
      >
        Ввійти в кабінет
      </Button>
    </div>
  );
};

export default Page;
