import Search from '@/app/ui/search';
import Link from 'next/link';
import CategoryTable from '../tables/CategoryTable';
import { CategoryModalCreate } from '@/app/ui/modals/CategoryModal';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Категорії</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Назва категорії" />
        <CategoryModalCreate />
      </div>
      <CategoryTable />
    </div>
  );
};

export default Page;
