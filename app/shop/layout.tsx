'use client';

import CategoriesSidebar from '../ui/CategoriesSidebar';
import withAuth from '../service/PrivateRouting';
import { usePathname, useSearchParams } from 'next/navigation';
import Header from '../ui/home/Header';
import Footer from '../ui/Footer';
import { ReactNode } from 'react';
import { useAppSelector } from '@/lib/hooks';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  let title = '';
  switch (pathname) {
    case '/shop/cart':
      title = 'Кошик';
      break;
    case '/shop/favorites':
      title = 'Обране';
      break;
    case '/shop/history':
      title = 'Історія замовлень';
      break;
    case '/shop':
      title = 'Каталог';
      const categoryId: string | null = params.get('category');
      if (categoryId) {
        console.log(categoryId);
        title = productsCategories.find((val) => val._id === categoryId)
          ?.name as string;
      }
      break;
    default:
      pathname;
  }

  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        {pathname ? (
          <div className="grid w-full grid-cols-3">
            <h2 className="col-span-3 mb-2 text-center text-3xl">{title}</h2>
            <div className="col-span-3 min-h-[550px]">{children}</div>
          </div>
        ) : (
          children
        )}
        <div
          id="image"
          className="absolute z-50 hidden h-[200px] w-[200px]"
        ></div>
      </main>
      <Footer />
    </>
  );
};

export default withAuth(Layout);
