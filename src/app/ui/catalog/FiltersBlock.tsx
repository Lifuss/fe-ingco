'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setShopView } from '@/lib/appState/main/slice';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';

interface FilterBlockProps {
  listType: 'partner' | 'retail';
}

export type sortValueType = 'default' | 'popular' | 'cheap' | 'expensive' | 'name';

const sortOptions: { label: string; sortValue: sortValueType }[] = [
  { label: 'За популярністю', sortValue: 'popular' },
  { label: 'Від дешевших', sortValue: 'cheap' },
  { label: 'Від дорожчих', sortValue: 'expensive' },
  { label: 'За назвою', sortValue: 'name' },
];

const FiltersBlock = ({ listType = 'retail' }: FilterBlockProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const productsCategories = useAppSelector((state) => state.persistedMainReducer.categories);
  const {
    products = [],
    total = 0,
    shopView,
  } = useAppSelector((state) => state.persistedMainReducer);

  const paramsRoute = useParams<{ categorySlug?: string }>();
  const categorySlug = paramsRoute?.categorySlug;
  const currentSort = (searchParams.get('sortValue') as sortValueType) || 'default';

  // Determine active category name for breadcrumbs & title
  const activeCategory = React.useMemo(() => {
    if (productsCategories && productsCategories.length > 0) {
      if (categorySlug) {
        return productsCategories.find((c) => c.slug === categorySlug);
      }
      const activeCategoryId = searchParams.get('category') || '';
      if (activeCategoryId) {
        return productsCategories.find((c) => String(c.id) === activeCategoryId);
      }
    }
    return undefined;
  }, [categorySlug, productsCategories, searchParams]);

  const categoryName = activeCategory ? activeCategory.name : 'Каталог інструментів INGCO';

  // Breadcrumbs items
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Головна', href: '/' },
    { label: 'Інструменти', href: '/?catalog=true' },
  ];

  if (activeCategory) {
    breadcrumbItems.push({ label: activeCategory.name });
  } else {
    breadcrumbItems.push({ label: 'Каталог' });
  }

  // Handle Sort Change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as sortValueType;
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('sortValue', value);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle View Change
  const handleViewChange = (newView: 'grid' | 'list') => {
    if (listType === 'partner') {
      dispatch(setShopView(newView === 'grid' ? 'table' : 'list'));
    } else {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set('view', newView);
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Title & Stats */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-wide text-gray-900 uppercase">{categoryName}</h1>
        <p className="text-xs font-medium text-gray-500">
          Показано {products.length} з {total} товарів
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        {/* Left space */}
        <div className="flex items-center gap-2"></div>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-4">
          {/* Grid / List Switcher (B2B only) */}
          {listType === 'partner' && (
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100 p-0.5">
              <button
                onClick={() => handleViewChange('list')}
                className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                  shopView === 'list'
                    ? 'text-primary-500 bg-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => handleViewChange('grid')}
                className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                  shopView === 'table'
                    ? 'text-primary-500 bg-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Table view"
              >
                <List size={15} />
              </button>
            </div>
          )}

          {/* Sorting Dropdown */}
          <div className="relative flex items-center">
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="focus:border-primary-500 cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white py-1.5 pr-10 pl-4 text-xs font-semibold text-gray-700 shadow-sm focus:outline-none"
            >
              <option value="default">Сортувати</option>
              {sortOptions.map((opt) => (
                <option key={opt.sortValue} value={opt.sortValue}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBlock;
