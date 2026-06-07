'use client';

import { useRouter } from 'next/navigation';

export const Error = () => {
  const router = useRouter();
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6 py-20 px-6 font-sans">
      <h2 className="text-2xl font-bold text-neutral-800">Щось пішло не так під час авторизації</h2>
      <p className="text-sm text-neutral-500 max-w-md text-center">
        Виникла помилка під час обробки вашого запиту. Будь ласка, спробуйте ще раз або поверніться на головну сторінку.
      </p>
      <div className="flex gap-4">
        <button
          className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          onClick={() => router.refresh()}
        >
          Спробувати ще раз
        </button>
        <button
          className="border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          onClick={() => router.push('/')}
        >
          На головну
        </button>
      </div>
    </div>
  );
};

export default Error;
