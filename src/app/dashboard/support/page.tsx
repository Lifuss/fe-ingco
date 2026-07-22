import Search from '@/app/ui/search';
import SupportTable from '../tables/SupportTable';

const Page = () => {
  return (
    <div className="w-full max-w-full">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-4xl">
        Підтримка
      </h1>
      <div className="mb-6 flex justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Номер звернення, ПІБ, email або телефон" variant="dashboard" />
        </div>
      </div>
      <div>
        <SupportTable />
      </div>
    </div>
  );
};

export default Page;
