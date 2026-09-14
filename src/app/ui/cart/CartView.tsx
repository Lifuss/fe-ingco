'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCart } from '@/lib/hooks';
import { Product } from '@/lib/types';
import ModalProduct from '@/app/ui/modals/ProductModal';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import OrderSuccessView, { CompletedOrderSummary } from './OrderSuccessView';
import CartItemsTable from './CartItemsTable';
import RetailCheckoutForm from './RetailCheckoutForm';
import B2bCheckoutForm from './B2bCheckoutForm';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartView() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [placedOrder, setPlacedOrder] = useState<CompletedOrderSummary | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const payment = searchParams?.get('payment');
  const orderCode = searchParams?.get('orderCode');

  const monobankOrder = useMemo<CompletedOrderSummary | null>(() => {
    if (!isClient || payment !== 'status' || !orderCode) return null;
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem('lastRetailOrder') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CompletedOrderSummary;
        if (String(parsed.orderCode) === String(orderCode)) {
          return parsed;
        }
      } catch {
        // Ignore parse error
      }
    }
    return {
      orderCode,
      email: '',
    };
  }, [isClient, payment, orderCode]);

  const completedOrder = !isDismissed ? placedOrder || monobankOrder : null;

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
    if (payment === 'status' && orderCode) {
      toast.success(`Замовлення #${orderCode} передано в обробку. Дякуємо за покупку!`);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('lastRetailOrder');
        window.history.replaceState({}, '', '/cart');
      }
    }
  }, [payment, orderCode]);

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (completedOrder) {
    return (
      <OrderSuccessView
        order={completedOrder}
        onReset={() => {
          setPlacedOrder(null);
          setIsDismissed(true);
        }}
      />
    );
  }

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
        <RetailCheckoutForm
          items={items}
          clearCart={clearCart}
          onOrderSuccess={(order) => {
            setIsDismissed(false);
            setPlacedOrder(order);
          }}
        />
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
