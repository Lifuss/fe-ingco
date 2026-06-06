'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export default function Logo() {
  const pathname = usePathname();
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  const isShop = isB2b || pathname?.includes('/shop');
  const targetUrl = isShop ? '/shop' : '/';

  return (
    <div className="flex items-start gap-1 relative">
      <Link href={targetUrl} className="shrink-0">
        <Image
          src="/logo.png"
          width={150}
          height={38}
          alt="Лого компанії INGCO"
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>
      {/* Ukraine Pill Badge */}
      <div className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 rounded-full bg-amber-400 text-[9px] font-bold text-neutral-900 border border-amber-500/10 shadow-sm select-none shrink-0 mt-0.5">
        <span className="hidden md:inline">Україна</span>
        <div className="w-3 h-3 rounded-full overflow-hidden flex flex-col border border-neutral-900/10 shrink-0">
          <div className="bg-flag-blue h-[50%] w-full" />
          <div className="bg-flag-yellow h-[50%] w-full" />
        </div>
      </div>
    </div>
  );
}
