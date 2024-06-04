'use client';
import { ReactNode } from 'react';
import withAuth from '../service/PrivateRouting';
import Sidebar from './Sidebar';
import { SpeedInsights } from '@vercel/speed-insights/next';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid grid-cols-6">
      <Sidebar />
      <div className="relative col-span-5 bg-[#FAFAFF] px-[40px] pl-20 pt-10">
        {children}
        <SpeedInsights />
      </div>
    </main>
  );
};

export default withAuth(Layout);
