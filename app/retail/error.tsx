'use client';

import { useRouter } from 'next/navigation';

export const Error = () => {
  const router = useRouter();
  return (
    <div className="mx-auto flex flex-col items-center gap-4">
      <h2 className="text-2xl">Щось пішло не так</h2>
      <button
        className="w-fit rounded-md bg-orangeLight p-2 text-lg transition-colors hover:bg-orange-400"
        onClick={() => router.refresh()}
      >
        Спробувати ще раз
      </button>
    </div>
  );
};

export default Error;
