'use client';

import CategoriesSidebar from '../ui/CategoriesSidebar';
import withAuth from '../service/PrivateRouting';
import { usePathname } from 'next/navigation';
import Header from '../ui/home/Header';
import Footer from '../ui/Footer';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
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
    default:
      pathname;
  }

  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        {pathname !== '/shop' ? (
          <div className="grid w-full grid-cols-3 ">
            <h2 className="col-span-2 mb-2 text-center text-4xl">{title}</h2>
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
