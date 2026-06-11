import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Історія замовлень',
  description: 'Історія ваших замовлень інструментів INGCO',
  path: '/history',
  noindex: true,
  nofollow: true,
});

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
