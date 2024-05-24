import Link from 'next/link';
import Search from '../ui/search';
import ProductTable from './tables/ProductTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Управління продуктами</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Артикль або найменування" />
        <div>
          <Link
            href={'/dashboard/product/create'}
            className="mr-4 rounded-xl bg-blue-400 p-4 text-lg text-white transition-colors hover:bg-blue-700"
          >
            Створити новий продукт
          </Link>
          <button
            className="cursor-help rounded-xl bg-gray-400 p-4 text-lg text-white"
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
