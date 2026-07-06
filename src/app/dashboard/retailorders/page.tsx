import Search from '@/app/ui/search';
import OrderTable from '../tables/OrderTable';

const Page = () => {
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-800">
        Замовлення в Роздріб
      </h1>
      
      {/* Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Email або номер замовлення" variant="dashboard" />
        </div>
      </div>

      <OrderTable isRetail />
    </div>
  );
};

export default Page;
