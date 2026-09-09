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
    <form
      className="mb-20 flex flex-col justify-between gap-12 lg:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-1">
        <NovaPoshtaDelivery
          onCityChange={(city) => setValue('city', city, { shouldValidate: true })}
          onWarehouseChange={(warehouse) =>
            setValue('warehouse', warehouse, { shouldValidate: true })
          }
          cityError={errors.city?.message}
          warehouseError={errors.warehouse?.message}
        />
      </div>

      <div className="flex w-full flex-col lg:w-[500px]">
        <ul className="mb-4 flex flex-col gap-1 rounded-xl border border-gray-200 p-4 text-base text-neutral-700">
          <li>
            <p>Після оформлення з вами зв&apos;яжеться менеджер для уточнення.</p>
          </li>
          <li>
            <p>
              В коментарі можете вказати бажаний тип зв&apos;язку, а також неявні деталі по типу
              розділеного замовлення тощо.
            </p>
          </li>
        </ul>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-neutral-700">Коментарій</span>
          <textarea
            {...register('comment')}
            className="block h-24 w-full rounded-lg border border-gray-500 p-2 outline-none focus:border-amber-500"
            placeholder="Коментарій до замовлення"
          />
        </label>

        <PaymentMethodSelector
          value={selectedPaymentMethod}
          onChange={(method) =>
            setValue('paymentMethod', method as 'ENTERPRISE' | 'CASH', { shouldValidate: true })
          }
          allowedMethods={['ENTERPRISE', 'CASH']}
          errorMessage={errors.paymentMethod?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-dark mx-auto mt-6 w-full cursor-pointer rounded-lg p-3 text-xl font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-fit md:px-8"
        >
          {isSubmitting ? 'Оформлення...' : 'Оформити замовлення'}
        </button>
      </div>
    </form>
  );
}
