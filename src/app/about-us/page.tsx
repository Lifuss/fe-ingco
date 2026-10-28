import AboutUsPage from '../ui/pages/AboutUs';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Про компанію INGCO Україна — Офіційний імпортер інструменту',
  description:
    'INGCO Україна — офіційний імпортер надійного професійного та побутового інструменту. Дізнайтеся більше про компанію, переваги бренду, сервіс та наші фірмові магазини.',
  path: '/about-us',
});

export default function Page() {
  return <AboutUsPage />;
}
