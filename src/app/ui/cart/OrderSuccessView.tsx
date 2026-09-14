'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import GoogleReviewsOptIn from '@/app/ui/utils/GoogleReviewsOptIn';
import { trackPurchase } from '@/lib/analytics';

export interface CompletedOrderSummary {
  orderCode: string | number;
  email: string;
  totalPrice?: number;
  recipientName?: string;
  phone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  products?: Array<{
    gtin?: string | null;
    id?: number | string;
    article?: string;
    name?: string;
    price?: number;
    quantity?: number;
  }>;
}

interface OrderSuccessViewProps {
  order: CompletedOrderSummary;
  onReset?: () => void;
}

export default function OrderSuccessView({ order, onReset }: OrderSuccessViewProps) {
  const paymentMethodLabels: Record<string, string> = {
    CARD: 'Оплата карткою (онлайн)',
    CASH: 'Оплата при отриманні (післяплата)',
    ENTERPRISE: 'Безготівковий розрахунок',
  };

  const paymentLabel =
    (order.paymentMethod && paymentMethodLabels[order.paymentMethod]) || order.paymentMethod;

  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    if (!order.orderCode || typeof order.totalPrice !== 'number' || order.totalPrice <= 0) return;

    const storageKey = `tracked_order_${order.orderCode}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) {
      trackedRef.current = true;
      return;
    }

    trackedRef.current = true;

    trackPurchase({
      orderCode: order.orderCode,
      totalPrice: order.totalPrice,
      currency: 'UAH',
      email: order.email,
      phone: order.phone,
      items: (order.products || []).map((p) => ({
        id: p.id || p.article || p.gtin || order.orderCode,
        name: p.name || 'Товар INGCO',
        price: p.price || 0,
        quantity: p.quantity || 1,
        article: p.article || undefined,
      })),
    });

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [order.orderCode, order.totalPrice, order.email, order.phone, order.products]);

  return (
    <div className="mx-auto my-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
      {/* Google Customer Reviews Opt-In Modal Trigger */}
      {order.email && (
        <GoogleReviewsOptIn
          orderId={order.orderCode}
          email={order.email}
          products={order.products}
          deliveryCountry="UA"
          estimatedDeliveryDays={4}
        />
      )}

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
          Дякуємо за замовлення!
        </h2>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
          <span>Номер замовлення:</span>
          <span className="font-mono text-base">#{order.orderCode}</span>
        </div>

        <p className="mb-6 text-sm text-neutral-600 sm:text-base">
          Ваше замовлення успішно оформлено та передано в обробку. Наш менеджер незабаром
          зв&apos;яжеться з вами для підтвердження.
        </p>

        {/* Order Details Card */}
        <div className="mb-8 w-full rounded-xl border border-gray-100 bg-neutral-50 p-4 text-left text-sm text-neutral-700 sm:p-6">
          <h3 className="mb-3 font-semibold text-neutral-900">Деталі замовлення:</h3>
          <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {order.recipientName && (
              <div>
                <dt className="text-xs text-neutral-500">Одержувач</dt>
                <dd className="font-medium text-neutral-800">{order.recipientName}</dd>
              </div>
            )}
            {order.phone && (
              <div>
                <dt className="text-xs text-neutral-500">Телефон</dt>
                <dd className="font-medium text-neutral-800">{order.phone}</dd>
              </div>
            )}
            {order.email && (
              <div>
                <dt className="text-xs text-neutral-500">Email підтвердження</dt>
                <dd className="font-medium text-neutral-800">{order.email}</dd>
              </div>
            )}
            {paymentLabel && (
              <div>
                <dt className="text-xs text-neutral-500">Спосіб оплати</dt>
                <dd className="font-medium text-neutral-800">{paymentLabel}</dd>
              </div>
            )}
            {order.shippingAddress && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-neutral-500">Доставка</dt>
                <dd className="font-medium text-neutral-800">{order.shippingAddress}</dd>
              </div>
            )}
            {typeof order.totalPrice === 'number' && (
              <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-3 sm:col-span-2">
                <dt className="text-sm font-semibold text-neutral-900">Сума до сплати</dt>
                <dd className="text-lg font-bold text-neutral-900">
                  {Math.round(order.totalPrice).toLocaleString('uk-UA')} грн
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-amber-600"
          >
            <ShoppingBag className="h-5 w-5" />
            Продовжити покупки
          </Link>
        </div>
      </div>
    </div>
  );
}
