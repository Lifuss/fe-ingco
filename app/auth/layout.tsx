import { ReactElement } from 'react';
import Footer from '../ui/Footer';
import Header from '../ui/home/Header';

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
