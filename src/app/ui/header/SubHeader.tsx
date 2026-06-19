'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/hooks';
import CurrencyRate from './CurrencyRate';

export default function SubHeader() {
  const pathname = usePathname();
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const user = authState.user;
  const isB2BUser =
    authState.isB2b ||
    (user &&
      ((user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2B === true ||
        (user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2b === true));

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
    'text-primary-500 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-primary-500';

  return (
    <nav className="hidden items-center justify-between border-b border-[#E5E3DD] bg-[#FDFDFD] px-5 py-1 select-none md:flex md:px-[60px]">
      <ul className="flex items-center gap-6 font-sans text-xs font-semibold text-neutral-500">
        {menuItems.map((item) => (
          <li key={item.href} className="relative py-1">
            <Link
              href={item.href}
              className={cn(
                'hover:text-primary-500 block cursor-pointer transition-colors',
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
                'hover:text-primary-500 block cursor-pointer text-neutral-500 transition-colors',
                item.active && 'text-primary-500',
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
    </nav>
  );
}
