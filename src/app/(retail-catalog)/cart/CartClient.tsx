'use client';
import RetailCartTable from '@/app/ui/product/RetailCartTable';
import CartTable from '@/app/ui/product/CartTable';
import { useIsB2B } from '@/lib/hooks';

const CartClient = () => {
  const isB2b = useIsB2B();

  return (
    <main className="mx-auto min-h-[550px] w-full max-w-[1680px] bg-white px-4 pt-8 md:px-8 lg:px-[60px]">
      {isB2b ? <CartTable /> : <RetailCartTable />}
      <div id="image" className="absolute z-50 hidden h-[200px] w-[200px]"></div>
    </main>
  );
};

export default CartClient;
