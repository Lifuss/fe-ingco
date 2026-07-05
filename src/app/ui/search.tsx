'use client';
import { Search, X } from 'lucide-react';
import { useSearchParams, usePathname, useRouter, useParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';

export default function SearchFoo({
  placeholder,
  variant = 'default',
}: {
  placeholder: string;
  variant?: 'default' | 'header';
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const paramsRoute = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchQuery = searchParams?.get('query')?.toString() || '';
  const [term, setTerm] = useState(searchQuery);

  const categorySlug = paramsRoute?.categorySlug;
  const categories = useAppSelector((state) => state.persistedMainReducer.categories);
  const currentCategory = categories?.find((c) => c.slug === categorySlug);
  const currentCategoryName = currentCategory?.name || '';

  useEffect(() => {
    setTerm(searchQuery);
  }, [searchQuery]);

  let validPathname = '/';
  if (pathname === '/' || pathname.startsWith('/categories/') || pathname === '/favorites') {
    validPathname = pathname;
  }

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    router.push(`${validPathname}?${params.toString()}`);
  };

  const handleRemoveCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.push(`/?${params.toString()}`);
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

  if (variant === 'header') {
    return (
      <div className="border-primary-500/30 focus-within:border-primary-500 focus-within:ring-primary-500 relative flex w-full max-w-none items-center rounded-lg border bg-white px-4 py-2 font-sans text-sm shadow-sm transition-all focus-within:ring-1">
        <label htmlFor="header-search" className="sr-only">
          Пошук
        </label>
        {currentCategoryName && (
          <div className="mr-2 flex shrink-0 items-center gap-1 rounded-md border border-[#FFD9C6] bg-[#FFF2EB] py-0.5 pr-1 pl-2 text-xs font-semibold text-[#D95F2B] select-none">
            <span className="max-w-[120px] truncate">{currentCategoryName}</span>
            <button
              type="button"
              onClick={handleRemoveCategory}
              className="rounded-full p-0.5 text-[#D95F2B] transition hover:bg-[#FFD9C6]"
              title="Шукати в усіх категоріях"
            >
              <X size={12} className="stroke-[2.5]" />
            </button>
          </div>
        )}
        <input
          id="header-search"
          name="search"
          className="block w-full appearance-none border-none bg-transparent pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 focus:ring-0 focus:outline-none focus-visible:outline-none"
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
            className="absolute top-1/2 right-10 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition hover:text-neutral-600 focus-visible:outline-none"
            aria-label="Скинути пошук"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="button"
          className="text-brand-cyan hover:text-primary-600 absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 transition focus-visible:outline-none"
          onClick={handleSubmit}
          aria-label="Пошук"
        >
          <Search size={18} className="stroke-[2.5]" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-1 items-center rounded-full bg-white/95 px-4 py-[6px] shadow-md ring-1 ring-gray-100 transition focus-within:ring-2 focus-within:ring-gray-900/12 focus-within:outline-none md:mx-auto md:max-w-xl lg:py-3 xl:w-3/5">
      <label htmlFor="spefix-search" className="sr-only">
        Пошук
      </label>
      <Search
        size={18}
        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
        aria-hidden
      />
      <div className="flex w-full items-center pr-32 pl-10">
        {currentCategoryName && (
          <div className="mr-2 flex shrink-0 items-center gap-1 rounded-md border border-[#FFD9C6] bg-[#FFF2EB] py-0.5 pr-1 pl-2 text-xs font-semibold text-[#D95F2B] select-none">
            <span className="max-w-[120px] truncate">{currentCategoryName}</span>
            <button
              type="button"
              onClick={handleRemoveCategory}
              className="rounded-full p-0.5 text-[#D95F2B] transition hover:bg-[#FFD9C6]"
              title="Шукати в усіх категоріях"
            >
              <X size={12} className="stroke-[2.5]" />
            </button>
          </div>
        )}
        <input
          id="spefix-search"
          name="search"
          className="block w-full appearance-none border-none bg-transparent text-base text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:ring-0 focus:outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none"
          placeholder={placeholder}
          onChange={handleInput}
          value={term}
          aria-label="Search"
          ref={inputRef}
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />
      </div>
      {term && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-1/2 right-28 -translate-y-1/2 rounded-full p-2 text-gray-400 transition hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:outline-none"
          aria-label="Скинути пошук"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="button"
        className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={handleSubmit}
        aria-label="Пошук"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Знайти</span>
      </button>
    </div>
  );
}
