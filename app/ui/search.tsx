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
    <div className="focus-within:ring-gray-900/12 relative flex w-full max-w-xl flex-shrink-0 items-center rounded-full bg-white/95 px-4 py-[6px] shadow-md ring-1 ring-gray-100 transition focus-within:outline-none focus-within:ring-2 lg:py-3 xl:w-2/5">
      <label htmlFor="spefix-search" className="sr-only">
        Пошук
      </label>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        aria-hidden
      />
      <input
        id="spefix-search"
        name="search"
        className="block w-full appearance-none border-none bg-transparent pl-10 pr-32 text-base text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-0 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0"
        placeholder={placeholder}
        onChange={handleInput}
        value={term}
        aria-label="Search"
        ref={inputRef}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />
      {term && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-28 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
          aria-label="Скинути пошук"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="button"
        className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        onClick={handleSubmit}
        aria-label="Пошук"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Знайти</span>
      </button>
    </div>
  );
}
