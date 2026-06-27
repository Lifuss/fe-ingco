import ContactsClient from './ContactsClient';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Контакти | INGCO Україна',
  description:
    "Зв'яжіться з нами: телефони, електронна пошта та адреси фізичних відділень інтернет-магазину INGCO Україна.",
  path: '/about-us/contacts',
});

export default function Page() {
  return <ContactsClient />;
}
