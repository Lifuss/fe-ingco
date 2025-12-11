'use client';
import { Search, X } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

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

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');
    term ? params.set('query', term) : params.delete('query');

    replace(`${validPathname}?${params.toString()}`);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleReset = () => {
    setTerm('');
    handleSearch('');
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    handleSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex w-fit flex-shrink-0 xl:w-2/5">
      <label htmlFor="search" className="sr-only">
        Пошук
      </label>
      <input
        id="spefix-search"
        name="search"
        className="block w-full rounded-2xl border border-black bg-transparent py-[4px] pl-10 pr-28 text-base outline-2 transition-colors placeholder:text-[#717171] focus:border-gray-200 focus:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 lg:py-[13px]"
        placeholder={placeholder}
        onChange={handleInput}
        value={term}
        aria-label="Search"
        ref={inputRef}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:text-gray-900"
        onClick={handleSubmit}
        aria-label="Пошук"
      >
        <Search size={18} />
      </button>
      {term && (
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Скинути пошук"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-black px-3 py-1 text-sm text-white transition hover:bg-gray-800"
          >
            Знайти
          </button>
        </div>
      )}
    </div>
  );
}
