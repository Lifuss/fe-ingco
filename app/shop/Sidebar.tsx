'use client';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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

  const createPageURL = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    let pagePathname = pathname;
    switch (pathname) {
      case '/shop/cart':
        pagePathname = '/shop';
        break;
      case '/shop/favorites':
        pagePathname = 'favorites';
        break;
      case '/shop/history':
        pagePathname = '/shop';
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
        href={createPageURL('')}
        className="relative mb-4 block py-1 shadow-md hover:bg-gray-100 hover:text-gray-800"
      >
        <h2 className="text-center text-base font-medium tracking-[0.01em]">
          Каталог товарів
        </h2>
        <svg
          viewBox="0 0 24 17"
          className="absolute left-1 top-[50%] h-3 w-5 -translate-y-[50%]"
        >
          <path
            d="M1.33333 16.5H22.6667C23.4 16.5 24 15.9 24 15.1667C24 14.4333 23.4 13.8333 22.6667 13.8333H1.33333C0.6 13.8333 0 14.4333 0 15.1667C0 15.9 0.6 16.5 1.33333 16.5ZM1.33333 9.83333H22.6667C23.4 9.83333 24 9.23333 24 8.5C24 7.76667 23.4 7.16667 22.6667 7.16667H1.33333C0.6 7.16667 0 7.76667 0 8.5C0 9.23333 0.6 9.83333 1.33333 9.83333ZM0 1.83333C0 2.56667 0.6 3.16667 1.33333 3.16667H22.6667C23.4 3.16667 24 2.56667 24 1.83333C24 1.1 23.4 0.5 22.6667 0.5H1.33333C0.6 0.5 0 1.1 0 1.83333Z"
            fill="#111111"
          />
        </svg>
      </Link>
      <ul className="flex flex-col shadow-md">
        {productsCategories?.map((category) => (
          <li
            className={clsx(
              'cursor-pointer border-b-2 border-gray-200 px-2 py-1 text-base tracking-[0.01em] transition-colors hover:bg-gray-100 hover:text-gray-800',
              searchParams.get('category') === category._id &&
                'bg-orange-200 text-gray-800',
            )}
            key={category._id}
          >
            <Link href={createPageURL(category._id)}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
