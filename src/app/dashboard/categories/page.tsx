import Search from '@/app/ui/search';
import CategoryTable from '../tables/CategoryTable';
import { CategoryModalCreate } from '@/app/ui/modals/CategoryModal';

const Page = () => {
  return (
    <div className="w-full max-w-full">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-4xl">
        Категорії
      </h1>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
