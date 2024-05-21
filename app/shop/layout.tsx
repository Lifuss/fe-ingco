'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import withAuth from '../service/PrivateRouting';
import { usePathname } from 'next/navigation';

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
    default:
      pathname;
  }

  return (
    <main className="flex gap-14 px-[60px] pt-8">
      <Sidebar />
      {pathname !== '/shop' ? (
        <div className="w-full">
          <h2 className="mb-8 text-center text-3xl">{title}</h2>
          {children}
        </div>
      ) : (
        children
      )}
      <div
        id="image"
        className="absolute z-50 hidden h-[200px] w-[200px]"
      ></div>
    </main>
  );
};

export default withAuth(Layout);
