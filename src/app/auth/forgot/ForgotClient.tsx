'use client';

import { Button } from '@/app/ui/buttons/button';
import { forgotPasswordThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotClient = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const resetData = (form.get('resetPassword') as string)?.trim();

    if (!resetData) {
      toast.error('Введіть email або логін');
      return;
    }

    setIsLoading(true);
    dispatch(forgotPasswordThunk({ resetData }))
      .unwrap()
      .then(() => {
        setIsSuccess(true);
        toast.success('Інструкцію з відновлення пароля надіслано на вашу пошту!');
      })
      .catch((error) => {
        console.error('Error in forgot password:', error);
        if (error?.status === 429) {
          toast.error('Занадто багато спроб. Спробуйте пізніше');
        } else {
          toast.error(error?.message || 'Помилка при відправленні запиту');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto mt-20 grid max-w-md place-content-center gap-4 px-4">
        <h1 className="mb-2 block text-center text-xl font-bold">Скидання паролю</h1>

        {isSuccess ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="mb-2 font-medium text-green-800">Запит успішно відправлено!</p>
            <p className="text-sm text-green-700">
              Якщо акаунт з таким email або логіном існує, ми надіслали інструкцію та посилання для
              відновлення пароля на вашу електронну пошту.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              Не забудьте перевірити папку «Спам», якщо лист не з'явився у «Вхідних».
            </p>
          </div>
        ) : (
          <>
            <input
              className="border-input-border peer block w-full rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              id="resetPassword"
              type="text"
              name="resetPassword"
              placeholder="email або логін"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500">
              Після підтвердження вам на пошту прийде повідомлення з інструкцією
            </p>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-light flex items-center justify-center gap-2 text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Надсилання...</span>
                </>
              ) : (
                'Скинути пароль'
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ForgotClient;
