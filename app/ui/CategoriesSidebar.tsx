'use client';

import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Icon from './assets/Icon';
import { FileSpreadsheet } from 'lucide-react';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );

  useEffect(() => {
    dispatch(fetchCategoriesThunk(''));
  }, [dispatch]);

  const isShop = pathname.includes('/shop');
  const createPageURL = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    let pagePathname = pathname;
    switch (pathname) {
      case '/shop/cart':
        pagePathname = '/shop';
        break;
      case '/retail/cart':
        pagePathname = '/retail';
        break;
      case '/shop/favorites':
        pagePathname = 'favorites';
        break;
      case '/retail/favorites':
        pagePathname = 'favorites';
        break;
      case '/shop/history':
        pagePathname = '/shop';
        break;
      case '/retail/history':
        pagePathname = '/retail';
        break;
      default:
        pagePathname;
    }
    if (categoryId === '') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    if (categoryId) {
      params.set('page', '1');
      return `${pagePathname}?${params.toString()}`;
    } else {
      params.set('page', '1');
      return `/shop?${params.toString()}`;
    }
  };

  return (
    <aside className="min-w-[200px]">
      <Link
        href={isShop ? '/shop' : '/retail'}
        className="relative mb-2 block py-1 shadow-md hover:bg-gray-100 hover:text-gray-800 xl:mb-4"
      >
        <h2 className="text-center text-base font-medium tracking-[0.01em]">
          Каталог товарів
        </h2>
        <Icon
          icon="burger"
          className="absolute left-1 top-[50%] h-3 w-5 -translate-y-[50%]"
        />
      </Link>
      <ul className="mb-4 flex flex-wrap justify-between gap-2 text-sm shadow-md xl:flex-col xl:text-base">
        {productsCategories?.map((category) => (
          <li
            className={clsx(
              'cursor-pointer border-b-2 border-gray-200 px-2 py-1  tracking-[0.01em] transition-colors  hover:bg-gray-100 hover:text-gray-800',
              searchParams.get('category') === category._id &&
                'bg-orange-200 text-gray-800',
            )}
            key={category._id}
          >
            <Link href={createPageURL(category._id)}>{category.name}</Link>
          </li>
        ))}
      </ul>
      {pathname.includes('/shop') && (
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-orangeLight p-2"
          href={'/shop/export'}
        >
          <FileSpreadsheet size={20} />
          Експорт таблиць
        </Link>
      )}
    </aside>
  );
};

export default Sidebar;
