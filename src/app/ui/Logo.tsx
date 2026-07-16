'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Logo() {
  const searchParams = useSearchParams();
  const targetUrl = '/';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If there are search params in the current URL (e.g. ?query=скло or ?category=123),
    // we force a clean redirect/reload to '/' to ensure all search, category,
    // and input states are completely reset and cleared across the app.
    const hasParams = searchParams ? Array.from(searchParams.keys()).length > 0 : false;
    if (hasParams) {
      e.preventDefault();
      window.location.href = '/';
    }
  };

  return (
    <div className="relative flex items-start gap-1">
      <Link href={targetUrl} className="shrink-0" onClick={handleClick}>
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
      <div className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full border border-amber-500/10 bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-neutral-900 shadow-sm select-none md:px-2">
        <span className="hidden md:inline">Україна</span>
        <div className="flex h-3 w-3 shrink-0 flex-col overflow-hidden rounded-full border border-neutral-900/10">
          <div className="bg-flag-blue h-[50%] w-full" />
          <div className="bg-flag-yellow h-[50%] w-full" />
        </div>
      </div>
    </div>
  );
}
