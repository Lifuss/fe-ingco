import CartClient from './CartClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Кошик покупок',
  description:
    'Оформлення замовлення та перегляд товарів у кошику інтернет-магазину INGCO Україна.',
  path: '/cart',
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <CartClient />;
}
