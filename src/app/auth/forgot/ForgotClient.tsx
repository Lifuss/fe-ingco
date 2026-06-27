'use client';
import { Button } from '@/app/ui/buttons/button';
import { forgotPasswordThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react';
import { toast } from 'react-toastify';

const ForgotClient = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const resetData = form.get('resetPassword') as string;
    const formElement = e.currentTarget;
    dispatch(forgotPasswordThunk({ resetData }))
      .unwrap()
      .then(() => {
        const resetPasswordInput = formElement.elements.namedItem('resetPassword');
        if (resetPasswordInput instanceof HTMLInputElement) {
          resetPasswordInput.value = '';
        }
      })
      .catch((error) => {
        console.error('Error in forgot password:', error);
        if (error?.status === 429) {
          toast.error('Занадто багато спроб. Спробуйте пізніше');
        } else {
          toast.error('Помилка при відправленні запиту');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-20 grid place-content-center gap-4">
        <h1 className="mb-2 block text-center text-xl">Скидання паролю</h1>
        <input
          className="peer border-input-border block w-full rounded-2xl border py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="resetPassword"
          type="text"
          name="resetPassword"
          placeholder="email або логін"
          required
        />
        <p className="text-xs text-gray-300">
          Після підтвердження вам на пошту прийде повідомлення з інструкцією
        </p>
        <Button className="bg-orange-light text-white hover:bg-orange-500">Скинути пароль</Button>
      </div>
    </form>
  );
};

export default ForgotClient;
