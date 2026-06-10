'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

  const productsCategories = useAppSelector((state) => state.persistedMainReducer.categories) || [];
  const { products = [], total = 0, shopView } = useAppSelector((state) => state.persistedMainReducer);

  const activeCategoryId = searchParams.get('category') || '';
  const currentSort = (searchParams.get('sortValue') as sortValueType) || 'default';
  const viewParam = searchParams.get('view') || 'grid';

  // Determine active category name for breadcrumbs & title
  const activeCategory = productsCategories.find((c) => String(c.id) === activeCategoryId);
  const categoryName = activeCategory ? activeCategory.name : 'Електроінструмент';

  // Breadcrumbs items
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Головна', href: listType === 'retail' ? '/' : '/shop' },
    { label: 'Інструменти', href: listType === 'retail' ? '/?catalog=true' : '/shop?catalog=true' },
  ];

  if (activeCategory) {
    breadcrumbItems.push({ label: activeCategory.name });
  } else {
    breadcrumbItems.push({ label: 'Каталог' });
  }

  // Handle Sort Change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as sortValueType;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortValue', value);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handle View Change
  const handleViewChange = (newView: 'grid' | 'list') => {
    if (listType === 'partner') {
      dispatch(setShopView(newView === 'grid' ? 'table' : 'list'));
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', newView);
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const isListView = listType === 'partner' ? shopView === 'list' : viewParam === 'list';

  return (
    <div className="w-full font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Title & Stats */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
          {categoryName}
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Показано {products.length} з {total} товарів
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between py-2 gap-4 flex-wrap">
        
        {/* Left space */}
        <div className="flex items-center gap-2">
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Grid / List Switcher (B2B only) */}
          {listType === 'partner' && (
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  !isListView ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Table view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isListView ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List view"
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
              className="appearance-none bg-white pl-4 pr-10 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-primary-500 cursor-pointer shadow-sm"
            >
              <option value="default">Сортувати</option>
              {sortOptions.map((opt) => (
                <option key={opt.sortValue} value={opt.sortValue}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBlock;
