'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import CurrencyRate from './CurrencyRate';

export default function SubHeader() {
  const pathname = usePathname();
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  const isStoreActive = pathname === '/' || pathname === '/shop';
  const isTermsActive = pathname.startsWith('/legal');
  const isAboutActive = pathname.startsWith('/about-us') && !pathname.includes('contacts');

  return (
    <nav className="hidden md:flex items-center justify-between border-b border-[#E5E3DD] bg-[#FDFDFD] py-1 px-5 md:px-[60px] select-none">
      <ul className="flex items-center gap-6 font-sans text-xs font-semibold text-neutral-500">
        <li className="relative py-1">
          <Link
            href={isB2b ? '/shop' : '/'}
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isStoreActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Магазин
          </Link>
        </li>
        <li className="relative py-1">
          <Link
            href="/legal/terms"
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isTermsActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Умови і правила
          </Link>
        </li>
        <li className="relative py-1">
          <Link
            href="/about-us"
            className={cn(
              'transition-colors hover:text-primary-500 cursor-pointer block',
              isAboutActive && 'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500'
            )}
          >
            Про нас
          </Link>
        </li>
      </ul>

      <ul className="flex items-center gap-8 font-sans text-xs font-semibold">
        <li>
          <Link href="/about-us/contacts" className="text-neutral-500 hover:text-primary-500 transition-colors cursor-pointer">
            Зв&apos;язок
          </Link>
        </li>
        <li>
          <CurrencyRate />
        </li>
      </ul>
    </nav>
  );
}
