'use client';

import ToBackButton from '@/app/ui/ToBackButton';
import UserForm from '../UserForm';
import { FormEvent } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { createUserThunk } from '@/lib/appState/dashboard/operations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('isB2B', 'true');
    const data = Object.fromEntries(formData.entries()) as {
      firstName: string;
      lastName: string;
      surName: string;
      email: string;
      login: string;
      password: string;
      role: 'user' | 'admin';
      phone: string;
      edrpou?: string;
      about?: string;
      address?: string;
      isB2B: 'true' | 'false';
    };
    dispatch(createUserThunk(data))
      .unwrap()
      .then((data) => {
        toast.success('Користувача створено');
        router.push('/dashboard/users');
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.error('Користувач з таким email або логіном вже існує');
        } else {
          toast.error('Помилка створення користувача');
        }
      });
  };
  return (
    <>
      <ToBackButton />
      <h1 className="mb-4 text-center text-3xl 2xl:mb-20">
        Створення користувача
      </h1>
      <UserForm handleSubmit={handleSubmit} />
    </>
  );
};

export default Page;
