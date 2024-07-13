'use client';
import Link from 'next/link';

export const error = () => {
  return (
    <div className="mx-auto flex flex-col items-center gap-4">
      <h2 className="text-2xl">Щось пішло не так</h2>
      <Link
        className="w-fit rounded-md bg-orangeLight p-2 text-lg transition-colors hover:bg-orange-400"
        href="/"
      >
        На головну
      </Link>
    </div>
  );
};

export default error;
