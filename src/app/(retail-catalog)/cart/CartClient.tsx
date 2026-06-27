'use client';
import RetailCartTable from '@/app/ui/product/RetailCartTable';
import CartTable from '@/app/ui/product/CartTable';
import { useAppSelector } from '@/lib/hooks';

const CartClient = () => {
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  return (
    <main className="min-h-[550px] w-full bg-white px-[60px] pt-8">
      {isAuthenticated && isB2b ? <CartTable /> : <RetailCartTable />}
      <div id="image" className="absolute z-50 hidden h-[200px] w-[200px]"></div>
    </main>
  );
};

export default CartClient;
