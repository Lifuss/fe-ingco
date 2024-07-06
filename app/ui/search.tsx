'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchFoo({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex w-fit flex-shrink-0 xl:w-2/5">
      <label htmlFor="search" className="sr-only">
        Пошук
      </label>
      <input
        className="peer block w-full rounded-2xl border border-black bg-transparent py-[4px] pl-10 text-base outline-2 transition-colors placeholder:text-[#717171] focus:border-gray-300 focus:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 lg:py-[13px]"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <Search
        size={20}
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
      />
    </div>
  );
}
