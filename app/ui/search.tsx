'use client';
import { Search, X } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchFoo({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchQuery = searchParams?.get('query')?.toString() || '';
  const [term, setTerm] = useState(searchQuery);

  useEffect(() => {
    setTerm(searchQuery);
  }, [searchQuery]);

  let validPathname = pathname;
  const splitedPathname = validPathname.split('/');

  if (
    splitedPathname.length >= 3 &&
    !splitedPathname.includes('favorites') &&
    !splitedPathname.includes('dashboard')
  ) {
    validPathname = splitedPathname.slice(0, 2).join('/');
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');
    term ? params.set('query', term) : params.delete('query');

    replace(`${validPathname}?${params.toString()}`);
  }, 300);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleReset = () => {
    setTerm('');
    handleSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex w-fit flex-shrink-0 xl:w-2/5">
      <label htmlFor="search" className="sr-only">
        Пошук
      </label>
      <input
        className="block w-full rounded-2xl border border-black bg-transparent py-[4px] pl-10 pr-10 text-base outline-2 transition-colors placeholder:text-[#717171] focus:border-gray-200 focus:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 lg:py-[13px]"
        placeholder={placeholder}
        onChange={handleInput}
        value={term}
        aria-label="Search"
        ref={inputRef}
      />
      <Search
        size={20}
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
        onClick={() => inputRef.current?.focus()}
      />
      {term && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
