import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import Header from '~/ui/header/Header';
import Footer from '~/ui/Footer';

export const metadata: Metadata = generatePageMetadata({
  title: 'Каталог інструментів INGCO',
  description:
    'Каталог професійних інструментів INGCO. Великий вибір електроінструментів для будівництва та ремонту. Доставка по всій Україні!',
  path: '/',
});

export default function RetailCatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
