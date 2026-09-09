'use client';
import CartView from '@/app/ui/cart/CartView';

const CartClient = () => {
  return (
    <main className="mx-auto min-h-[550px] w-full max-w-[1680px] bg-white px-4 pt-8 md:px-8 lg:px-[60px]">
      <CartView />
      <div id="image" className="absolute z-50 hidden h-[200px] w-[200px]"></div>
    </main>
  );
};

export default CartClient;
