import Search from '@/app/ui/search';
import CategoryTable from '../tables/CategoryTable';
import { CategoryModalCreate } from '@/app/ui/modals/CategoryModal';

const Page = () => {
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-800">Категорії</h1>
      <div className="mb-6 flex justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Назва категорії" variant="dashboard" />
        </div>
        <CategoryModalCreate />
      </div>
      <CategoryTable />
    </div>
  );
};

export default Page;
