import HistoryClient from './HistoryClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Історія замовлень',
  description: 'Історія покупок та замовлень користувача в магазині INGCO Україна.',
  path: '/history',
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <HistoryClient />;
}
