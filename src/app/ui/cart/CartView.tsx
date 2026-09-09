'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCart } from '@/lib/hooks';
import { Product } from '@/lib/types';
import ModalProduct from '@/app/ui/modals/ProductModal';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import CartItemsTable from './CartItemsTable';
import RetailCheckoutForm from './RetailCheckoutForm';
import B2bCheckoutForm from './B2bCheckoutForm';

export default function CartView() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    items,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    currency,
    isB2b,
    isRetail,
    isUpdating,
  } = useCart();

  useEffect(() => {
    const payment = searchParams?.get('payment');
    const orderCode = searchParams?.get('orderCode');
    if (payment === 'status' && orderCode) {
      toast.success(`Замовлення #${orderCode} передано в обробку. Дякуємо за покупку!`);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/cart');
      }
    }
  }, [searchParams]);

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (items.length === 0) {
    return (
      <div className="pt-10">
        <TextPlaceholder
          title="Кошик порожній 🍃"
          text={
            isB2b
              ? 'Негайно треба добавити сюди продуктів 🛒🏃‍♂️'
              : 'Негайно треба добавити сюди пару інструментів 🛒🏃‍♂️'
          }
          titleSize="4xl"
          textSize="xl"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CartItemsTable
        items={items}
        isB2b={isB2b}
        currencyUsdRate={currency.USD}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onOpenModal={openProductModal}
        isUpdating={isUpdating}
      />

      <div className="mt-2 ml-auto flex w-fit gap-2 border-b-2 text-lg font-medium text-neutral-900">
        <p>Загальна сума</p>
        <p>
          {isB2b
            ? `${totalPrice.toFixed(2)}$ | ${Math.ceil(totalPrice * currency.USD)}грн`
            : `${Math.round(totalPrice).toLocaleString('uk-UA')} грн`}
        </p>
      </div>

      {isB2b ? (
        <B2bCheckoutForm items={items} usdRate={currency.USD} clearCart={clearCart} />
      ) : (
        <RetailCheckoutForm items={items} clearCart={clearCart} />
      )}

      <ModalProduct
        product={selectedProduct}
        closeModal={closeProductModal}
        isOpen={isModalOpen}
        isRetail={isRetail}
      />
    </div>
  );
}
