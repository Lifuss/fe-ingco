'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AuthButtons = () => {
  const pathname = usePathname();

  return (
    <div className="text-sm lg:flex lg:items-center lg:gap-3 lg:text-[20px] lg:tracking-tight 2xl:gap-5 2xl:text-2xl">
      <Link
        href={'/auth/login'}
        className={clsx(
          'relative block text-center transition-colors ease-out hover:text-white',
          (pathname === '/auth/login' && 'pointer-events-none text-white') ||
            (pathname === '/auth/register' && 'pointer-events-none text-white'),
        )}
      >
        Вхід
      </Link>
    </div>
  );
};

export default AuthButtons;
