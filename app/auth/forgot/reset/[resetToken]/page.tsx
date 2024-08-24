'use client';
import { Button } from '@/app/ui/buttons/button';
import { forgotPasswordThunk } from '@/lib/appState/user/operation';
import { useAppDispatch } from '@/lib/hooks';
import { redirect } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

type PageProps = {
  params: {
    resetToken: string;
  };
};

const Page = ({ params }: PageProps) => {
  if (!params.resetToken) {
    toast.warning('Не можливо змінити пароль по цьому посиланню');
    redirect('/auth/login');
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    console.log(form.values());
    const resetData = form.get('resetPassword') as string;
    dispatch(forgotPasswordThunk({ resetData }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-20 grid place-content-center gap-4">
        <label
          className="mb-2 block text-center text-xl"
          htmlFor="resetPassword"
        >
          Ваш email або логін
        </label>
        <input
          className="peer block w-full rounded-2xl border border-[#1d1c1c] py-[20px] pl-4 text-base outline-2 placeholder:text-gray-500"
          id="resetPassword"
          type="text"
          name="resetPassword"
          placeholder="email або логін"
          required
        />
        <Button>Скинути пароль</Button>
      </div>
    </form>
  );
};

export default Page;
