'use client';

import { useRouter } from 'next/navigation';

export const Error = () => {
  const router = useRouter();
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6 px-6 py-20 font-sans">
      <h2 className="text-2xl font-bold text-neutral-800">Помилка завантаження панелі керування</h2>
      <p className="max-w-md text-center text-sm text-neutral-500">
        Не вдалося завантажити сторінку кабінету адміністратора. Спробуйте оновити сторінку.
      </p>
      <div className="flex gap-4">
        <button
          className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          onClick={() => router.refresh()}
        >
          Спробувати ще раз
        </button>
        <button
          className="cursor-pointer rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          onClick={() => router.push('/')}
        >
          На головну
        </button>
      </div>
    </div>
  );
};

export default Error;
