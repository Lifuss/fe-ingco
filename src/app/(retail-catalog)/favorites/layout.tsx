import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Обрані товари',
  description: 'Ваші обрані інструменти INGCO',
  path: '/favorites',
  noindex: true,
  nofollow: true,
});

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
