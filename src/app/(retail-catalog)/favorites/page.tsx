import FavoritesClient from './FavoritesClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Обрані товари',
  description: 'Ваш список бажаних товарів та інструментів на сайті INGCO Україна.',
  path: '/favorites',
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <FavoritesClient />;
}
