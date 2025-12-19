import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Контакти INGCO',
  description:
    "Контактна інформація INGCO Ukraine. Адреси відділень, телефони, email. Зв'яжіться з нами для замовлення інструментів.",
  path: '/home/contacts',
});

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
