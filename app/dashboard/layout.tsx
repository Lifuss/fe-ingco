'use client';
import { ReactNode } from 'react';
import withAuth from '../service/PrivateRouting';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid grid-cols-6">
      <Sidebar />
      <div className="col-span-5 bg-[#FAFAFF] px-[40px]">{children}</div>
    </main>
  );
};

export default withAuth(Layout);
