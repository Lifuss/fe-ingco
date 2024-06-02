import Link from 'next/link';
import Search from '../ui/search';
import ProductTable from './tables/ProductTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Управління продуктами</h1>
      <div className="mb-10 flex justify-between gap-2 text-sm xl:text-base 2xl:text-lg">
        <Search placeholder="Артикль або найменування" />
        <div className="flex gap-4">
          <Link
            href={'/dashboard/product/create'}
            className="rounded-xl bg-blue-400 p-2 text-center text-white transition-colors hover:bg-blue-700 xl:p-4"
          >
            Створити новий продукт
          </Link>
          <button
            className="cursor-help rounded-xl bg-gray-400 p-2 text-center text-white xl:p-4"
            title="В майбутніх планах"
          >
            Створити опт ексель
          </button>
        </div>
      </div>
      <ProductTable />
    </div>
  );
};

export default Page;
