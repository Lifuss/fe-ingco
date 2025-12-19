import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Підтримка INGCO',
  description:
    "Зв'яжіться з підтримкою INGCO Ukraine. Задайте питання про інструменти, замовлення або отримайте допомогу.",
  path: '/home/support',
});

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
