import Home from '../ui/pages/Home';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'INGCO - Головна сторінка',
  description:
    'INGCO - офіційний імпортер професійних інструментів в Україні. Електроінструменти для будівництва та ремонту. Доставка по всій країні!',
  path: '/home',
});

export default function Page() {
  return <Home isMainPage={false} />;
}
