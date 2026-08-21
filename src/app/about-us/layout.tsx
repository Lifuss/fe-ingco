import { ReactNode } from 'react';
import Footer from '../ui/Footer';
import Header from '../ui/header/Header';

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[70%]">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
