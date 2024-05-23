'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SwitchAuthButtons = () => {
  const pathname = usePathname();
  return (
    <div className="mb-8 flex justify-between text-4xl text-[#7a7c7f]">
      <Link
        className={clsx(
          'border-b-2 pb-3',
          pathname === '/auth/login' &&
            'pointer-events-none border-black text-black',
        )}
        href={'/auth/login'}
      >
        Вхід
      </Link>
      <Link
        className={clsx(
          'grow border-b-2 pb-3 text-right',
          pathname === '/auth/register' &&
            'pointer-events-none border-black text-black',
        )}
        href={'/auth/register'}
      >
        Реєстрація
      </Link>
    </div>
  );
};

export default SwitchAuthButtons;
