import Search from '@/app/ui/search';
import Link from 'next/link';
import CategoryTable from '../tables/CategoryTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Категорії</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Назва категорії" />
        <Link
          href={'/dashboard/categories/create'}
          className="rounded-xl bg-blue-400 p-4 text-lg text-white transition-colors hover:bg-blue-700"
        >
          Створити нову категорію
        </Link>
      </div>
      <CategoryTable />
    </div>
  );
};

export default Page;
