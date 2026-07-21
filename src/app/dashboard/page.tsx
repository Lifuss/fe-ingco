import Link from 'next/link';
import Search from '../ui/search';
import ProductTable from './tables/ProductTable';
import GoogleMerchantSyncCard from './GoogleMerchantSyncCard';

const Page = () => {
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-800">
        Управління продуктами
      </h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Артикул або назва товару" variant="dashboard" />
        </div>
        <div className="flex gap-3">
          <Link
            href={'/dashboard/product/create'}
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 active:scale-98"
          >
            Створити новий продукт
          </Link>
          <button
            className="inline-flex cursor-help items-center justify-center rounded-xl bg-neutral-400 px-5 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-500 active:scale-98"
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
