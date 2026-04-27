import ShopTable from './table/ShopTable';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Каталог для партнерів | INGCO Україна',
  description:
    'Партнерський каталог інструментів INGCO: гуртові ціни, фільтри, швидкий пошук. Купуйте офіційно в Україні.',
  path: '/shop',
});

function Page() {
  return (
    <div className="grow">
      <ShopTable />
    </div>
  );
}

export default Page;
