import Search from '@/app/ui/search';
import SupportTable from '../tables/SupportTable';

const Page = () => {
  return (
    <div className="w-full max-w-[1200px]">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-800">Підтримка</h1>
      <div className="mb-6 flex justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Search placeholder="Email або номер звернення" variant="dashboard" />
        </div>
      </div>
      <div>
        <SupportTable />
      </div>
    </div>
  );
};

export default Page;
