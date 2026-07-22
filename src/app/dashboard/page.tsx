import Link from 'next/link';
import Search from '../ui/search';
import ProductTable from './tables/ProductTable';
import GoogleMerchantSyncCard from './GoogleMerchantSyncCard';

const Page = () => {
  return (
    <div className="w-full max-w-full">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-4xl">
        Управління продуктами
      </h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Артикул або назва товару" variant="dashboard" />
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href={'/dashboard/product/create'}
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-center text-sm font-bold whitespace-nowrap text-white shadow-sm transition-all duration-200 hover:bg-blue-600 active:scale-98"
          >
            Створити новий продукт
          </Link>
          <button
            className="inline-flex cursor-help items-center justify-center rounded-xl bg-neutral-400 px-5 py-2.5 text-center text-sm font-bold whitespace-nowrap text-white shadow-sm transition-all duration-200 hover:bg-neutral-500 active:scale-98"
            title="В майбутніх планах"
          >
            Завантажити з Excel
          </button>
        </div>
      </div>
      <ProductTable />
      <div className="mt-8">
        <GoogleMerchantSyncCard />
      </div>
    </div>
  );
};

export default Page;
