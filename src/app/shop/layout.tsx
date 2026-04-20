'use client';
import CategoriesSidebar from '../ui/CategoriesSidebar';
import withAuth from '../service/PrivateRouting';
import Header from '../ui/home/Header';
import Footer from '../ui/Footer';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px]">{children}</div>
        <div
          id="image"
          className="absolute z-50 hidden h-[200px] w-[200px] 2xl:h-[250px] 2xl:w-[250px]"
        ></div>
      </main>
      <Footer />
    </>
  );
};

export default withAuth(Layout);
