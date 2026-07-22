import Search from '@/app/ui/search';
import OrderTable from '../tables/OrderTable';

const Page = () => {
  return (
    <div className="w-full max-w-full">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-4xl">
        Замовлення B2B
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Номер замовлення, ПІБ, email, телефон або ТТН" variant="dashboard" />
        </div>
      </div>

      <OrderTable isRetail={false} />
    </div>
  );
};

export default Page;
