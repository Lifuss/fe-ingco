import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Кошик покупок',
  description: 'Ваш кошик покупок інструментів INGCO',
  path: '/cart',
  noindex: true,
  nofollow: true,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
