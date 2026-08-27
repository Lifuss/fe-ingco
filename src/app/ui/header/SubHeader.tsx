'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsB2B } from '@/lib/hooks';
import CurrencyRate from './CurrencyRate';

export default function SubHeader() {
  const pathname = usePathname();
  const isB2BUser = useIsB2B();

  const isStoreActive = pathname === '/';
  const isPartnershipActive = pathname === '/about-us/partnership';
  const isTermsActive = pathname.startsWith('/legal');
  const isAboutActive =
    pathname.startsWith('/about-us') &&
    pathname !== '/about-us/partnership' &&
    !pathname.includes('contacts');

  const menuItems = [
    { href: '/', label: 'Магазин', active: isStoreActive },
    { href: '/legal/terms', label: 'Умови і правила', active: isTermsActive },
    { href: '/about-us/partnership', label: 'Партнерам', active: isPartnershipActive },
    { href: '/about-us', label: 'Про нас', active: isAboutActive },
  ];

  const utilMenu = [
    ...(isB2BUser
      ? [
          {
            href: '/export',
            label: 'Експорт',
            active: pathname === '/export',
          },
        ]
      : []),
    {
      href: '/about-us/contacts',
      label: "Зв'язок",
      active: pathname === '/about-us/contacts',
    },
  ];

  const activeLinkClass =
    'text-amber-800 font-bold after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-amber-600';

  return (
    <nav className="hidden border-b border-[#E5E3DD] bg-[#FDFDFD] py-1 select-none md:flex">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-5 md:px-[60px]">
        <ul className="flex items-center gap-6 font-sans text-xs font-semibold text-neutral-600">
          {menuItems.map((item) => (
            <li key={item.href} className="relative py-1">
              <Link
                href={item.href}
                className={cn(
                  'block cursor-pointer transition-colors hover:text-amber-700',
                  item.active && activeLinkClass,
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex items-center gap-8 font-sans text-xs font-semibold">
          {utilMenu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'block cursor-pointer text-neutral-600 transition-colors hover:text-amber-700',
                  item.active && 'font-bold text-amber-800',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <CurrencyRate />
          </li>
        </ul>
      </div>
    </nav>
  );
}
