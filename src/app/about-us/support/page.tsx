import SupportClient from './SupportClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Служба підтримки | INGCO Україна',
  description: 'Форма зворотного зв\'язку та служба підтримки клієнтів інтернет-магазину INGCO Україна.',
  path: '/about-us/support',
});

export default function Page() {
  return <SupportClient />;
}
