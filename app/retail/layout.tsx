import CategoriesSidebar from '../ui/CategoriesSidebar';
import Header from '../ui/home/Header';
import Footer from '../ui/Footer';
import { ReactNode, useEffect } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className=" min-h-[550px]">{children}</div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
