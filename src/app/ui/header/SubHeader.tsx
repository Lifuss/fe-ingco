'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsB2B } from '@/lib/hooks';
import CurrencyRate from './CurrencyRate';

interface SubHeaderLinkProps {
  href: string;
  label: string;
  active: boolean;
}

export default function SubHeader() {
  const pathname = usePathname();
  const isB2BUser = useIsB2B();

  const isStoreActive = pathname === '/';
  const isPartnershipActive = pathname === '/about-us/partnership';
  const isTermsActive = pathname.startsWith('/legal');
  const isContactsActive = pathname.startsWith('/about-us/contacts');
  const isAboutActive =
    pathname.startsWith('/about-us') && !isPartnershipActive && !isContactsActive;

  const menuItems = [
    { href: '/', label: 'Магазин', active: isStoreActive },
    { href: '/about-us/partnership', label: 'Партнерам', active: isPartnershipActive },
    { href: '/about-us', label: 'Про нас', active: isAboutActive },
    { href: '/legal/terms', label: 'Умови і правила', active: isTermsActive },
  ];

  const utilMenu = [
    ...(isB2BUser
      ? [
          {
            href: '/export',
            label: 'Експорт',
            active: pathname.startsWith('/export'),
          },
        ]
      : []),
    {
      href: '/about-us/contacts',
      label: "Зв'язок",
      active: isContactsActive,
    },
  ];

  return (
    <nav
      aria-label="Додаткова навігація"
      className="hidden border-b border-[#E5E3DD] bg-[#FDFDFD] py-1 select-none md:flex"
    >
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between px-5 md:px-[60px]">
        {/* Left Navigation */}
        <ul className="flex items-center gap-2 font-sans text-sm">
          {menuItems.map((item) => (
            <li key={item.href}>
              <SubHeaderLink {...item} />
            </li>
          ))}
        </ul>

        {/* Right Utility Navigation */}
        <ul className="flex items-center gap-4 font-sans text-sm">
          {utilMenu.map((item) => (
            <li key={item.href}>
              <SubHeaderLink {...item} />
            </li>
          ))}
          <li className="flex items-center border-l border-[#E5E3DD] pl-4">
            <CurrencyRate />
          </li>
        </ul>
      </div>
    </nav>
  );
}

function SubHeaderLink({ href, label, active }: SubHeaderLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative inline-flex items-center rounded-md px-2.5 py-1 font-semibold text-neutral-800 transition-all duration-200',
        'hover:bg-neutral-100 hover:text-amber-700 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:outline-hidden',
        active &&
          'font-bold text-amber-800 after:absolute after:right-2 after:bottom-0 after:left-2 after:h-[2px] after:rounded-full after:bg-amber-500',
      )}
    >
      {label}
    </Link>
  );
}
