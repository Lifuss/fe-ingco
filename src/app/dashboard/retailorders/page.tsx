import Search from '@/app/ui/search';
import OrderTable from '../tables/OrderTable';

const Page = () => {
  return (
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl">Замовлення в Роздріб</h1>
      <div className="mb-10 flex justify-between">
        <Search placeholder="Email або номер замовлення" />
      </div>
      <OrderTable isRetail />
    </div>
  );
};

export default Page;
