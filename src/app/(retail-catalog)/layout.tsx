import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import CatalogLayoutClientWrapper from './CatalogLayoutClientWrapper';

export const metadata: Metadata = generatePageMetadata({
  title: 'Каталог інструментів INGCO',
  description:
    'Каталог професійних інструментів INGCO. Великий вибір електроінструментів для будівництва та ремонту. Доставка по всій Україні!',
  path: '/',
});

export default function RetailCatalogLayout({ children }: { children: React.ReactNode }) {
  return <CatalogLayoutClientWrapper>{children}</CatalogLayoutClientWrapper>;
}
