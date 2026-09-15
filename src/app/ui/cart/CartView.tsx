'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ShoppingCart, ArrowLeft, ShieldCheck, RotateCcw, Truck } from 'lucide-react';
import { useCart } from '@/lib/hooks';
import { Product } from '@/lib/types';
import ModalProduct from '@/app/ui/modals/ProductModal';
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
    totalQuantity,
    totalPrice,
    updateQuantity,
    setQuantity,
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
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-inner">
          <ShoppingCart className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-neutral-900 md:text-3xl">Ваш кошик порожній</h2>
        <p className="mx-auto mb-8 max-w-md text-base text-neutral-600">
          {isB2b
            ? 'Ви ще не додали жодної позиції до гуртового замовлення. Перейдіть до каталогу для вибору інструментів.'
            : 'Ви ще не вибрали жодного інструменту. Перейдіть до каталогу, щоб знайти якісний інструмент INGCO за доступними цінами.'}
        </p>
        <Link
          href="/?catalog=true"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-amber-600 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Перейти до каталогу</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Items Table + Checkout Form */}
        <div className="space-y-8 lg:col-span-8">
          <CartItemsTable
            items={items}
            isB2b={isB2b}
            currencyUsdRate={currency.USD}
            onUpdateQuantity={updateQuantity}
            onSetQuantity={setQuantity}
            onRemoveItem={removeItem}
            onOpenModal={openProductModal}
            isUpdating={isUpdating}
          />

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
        </div>

        {/* Right Column: Sticky Summary & Trust Badges */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
            <h3 className="mb-4 text-lg font-bold text-neutral-900">Разом до сплати</h3>

            <div className="space-y-3 border-b border-gray-100 pb-4 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Кількість позицій:</span>
                <span className="font-semibold text-neutral-900">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Всього товарів:</span>
                <span className="font-semibold text-neutral-900">{totalQuantity} шт.</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span className="font-medium text-neutral-900">Нова Пошта (за тарифами)</span>
              </div>
            </div>

            <div className="my-5 flex items-baseline justify-between">
              <span className="text-base font-medium text-neutral-700">До сплати:</span>
              <div className="text-right">
                {isB2b ? (
                  <div>
                    <p className="text-2xl font-black text-neutral-900">${totalPrice.toFixed(2)}</p>
                    <p className="text-sm font-medium text-neutral-500">
                      ≈ {Math.ceil(totalPrice * currency.USD).toLocaleString('uk-UA')} грн
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-black text-neutral-900">
                    {Math.round(totalPrice).toLocaleString('uk-UA')}{' '}
                    <span className="text-lg font-bold">грн</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              form={isB2b ? 'b2b-checkout-form' : 'retail-checkout-form'}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-amber-600 active:scale-[0.98]"
            >
              <span>Підтвердити замовлення</span>
            </button>

            {/* Trust Badges */}
            <div className="mt-6 space-y-3.5 border-t border-gray-100 pt-5 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">100% Оригінальний INGCO</p>
                  <p className="text-neutral-500">Офіційна гарантія виробника</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">Обмін та повернення</p>
                  <p className="text-neutral-500">Протягом 14 днів згідно із законом</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">Швидка доставка</p>
                  <p className="text-neutral-500">Відправка 1-2 дні Новою Поштою</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ModalProduct
        product={selectedProduct}
        closeModal={closeProductModal}
        isOpen={isModalOpen}
        isRetail={isRetail}
      />
    </div>
  );
}
