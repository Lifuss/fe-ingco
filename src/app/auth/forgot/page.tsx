import ForgotClient from './ForgotClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Скидання паролю',
  description: 'Відновлення доступу до вашого акаунту користувача INGCO Україна.',
  path: '/auth/forgot',
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <ForgotClient />;
}
