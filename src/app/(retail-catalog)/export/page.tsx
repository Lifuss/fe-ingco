import ExportClient from './ExportClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Експорт товарів',
  description: 'Панель вивантаження товарних позицій та XML-фідів для партнерів INGCO Україна.',
  path: '/export',
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <ExportClient />;
}
