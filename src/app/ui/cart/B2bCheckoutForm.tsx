'use no memo';
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '@/lib/appState/api/ordersApi';
import NovaPoshtaDelivery from './NovaPoshtaDelivery';
import PaymentMethodSelector from './PaymentMethodSelector';
import { b2bCheckoutSchema, B2bCheckoutFormValues } from '@/lib/validationSchema';
import { UnifiedCartItem } from '@/lib/useCart';

interface B2bCheckoutFormProps {
  items: UnifiedCartItem[];
  usdRate: number;
  clearCart: () => void;
}

export default function B2bCheckoutForm({ items, usdRate, clearCart }: B2bCheckoutFormProps) {
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<B2bCheckoutFormValues>({
    resolver: zodResolver(b2bCheckoutSchema),
    defaultValues: {
      city: '',
      warehouse: '',
      comment: '',
      paymentMethod: 'ENTERPRISE',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedPaymentMethod = watch('paymentMethod');

  const onSubmit = async (values: B2bCheckoutFormValues) => {
    const orderPayload = {
      items: items.map((item) => ({
        productId: item.productId.id,
        quantity: item.quantity,
      })),
      shippingAddress: `${values.city}, ${values.warehouse}`,
      comment: values.comment || '',
      usdRate,
      paymentMethod: values.paymentMethod,
    };

    try {
      const created = await createOrder(orderPayload).unwrap();
      toast.success(`Замовлення #${created.orderCode} успішно оформлено`);
      clearCart();
      reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || 'Не вдалося оформити замовлення');
    }
  };

  return (
    <form id="b2b-checkout-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
        <h3 className="mb-4 text-base font-bold text-neutral-900 md:text-lg">
          1. Доставка Новою Поштою
        </h3>
        <NovaPoshtaDelivery
          onCityChange={(city) => setValue('city', city, { shouldValidate: true })}
          onWarehouseChange={(warehouse) =>
            setValue('warehouse', warehouse, { shouldValidate: true })
          }
          cityError={errors.city?.message}
          warehouseError={errors.warehouse?.message}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
        <h3 className="mb-4 text-base font-bold text-neutral-900 md:text-lg">2. Спосіб оплати</h3>
        <PaymentMethodSelector
          value={selectedPaymentMethod}
          onChange={(method) =>
            setValue('paymentMethod', method as 'ENTERPRISE' | 'CASH', { shouldValidate: true })
          }
          allowedMethods={['ENTERPRISE', 'CASH']}
          errorMessage={errors.paymentMethod?.message}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
        <ul className="mb-4 flex flex-col gap-1 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-sm text-neutral-700">
          <li className="font-medium text-amber-900">
            Після оформлення з вами зв&apos;яжеться персональний B2B менеджер.
          </li>
          <li className="text-neutral-600">
            В коментарі ви можете зазначити бажаний тип зв&apos;язку або деталі щодо виставлення
            рахунку.
          </li>
        </ul>

        <h3 className="mb-4 text-base font-bold text-neutral-900 md:text-lg">
          3. Коментар до замовлення
        </h3>
        <label className="flex flex-col text-sm">
          <textarea
            {...register('comment')}
            className="h-24 w-full rounded-lg border border-gray-300 p-2.5 transition-colors outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Вкажіть коментар або реквізити підприємства..."
          />
        </label>
      </div>

      <div className="flex justify-end rounded-2xl border border-gray-200 bg-white p-5 shadow-xs md:p-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? 'Оформлення...' : 'Оформити замовлення'}
        </button>
      </div>
    </form>
  );
}
