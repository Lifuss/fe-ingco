'use no memo';
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/lib/hooks';
import { useCreateRetailOrderMutation } from '@/lib/appState/api/ordersApi';
import TurnstileWidget from '@/app/ui/utils/TurnstileWidget';
import NovaPoshtaDelivery from './NovaPoshtaDelivery';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';
import { retailCheckoutSchema, RetailCheckoutFormValues } from '@/lib/validationSchema';
import { UnifiedCartItem } from '@/lib/useCart';

interface RetailCheckoutFormProps {
  items: UnifiedCartItem[];
  clearCart: () => void;
}

export default function RetailCheckoutForm({ items, clearCart }: RetailCheckoutFormProps) {
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileKey, setTurnstileKey] = useState<number>(0);

  const userState = useAppSelector((state) => state.persistedAuthReducer.user);
  const [createRetailOrder, { isLoading: isSubmitting }] = useCreateRetailOrderMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RetailCheckoutFormValues>({
    resolver: zodResolver(retailCheckoutSchema),
    defaultValues: {
      firstName: userState?.firstName || '',
      lastName: userState?.lastName || '',
      surName: userState?.surName || '',
      phone: userState?.phone || '',
      email: userState?.email || '',
      city: '',
      warehouse: '',
      comment: '',
      paymentMethod: 'CARD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  const onSubmit = async (values: RetailCheckoutFormValues) => {
    if (!turnstileToken) {
      toast.error('Будь ласка, підтвердіть, що ви не робот');
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        productId: item.productId.id,
        quantity: item.quantity,
      })),
      shippingAddress: `${values.city}, ${values.warehouse}`,
      firstName: values.firstName,
      lastName: values.lastName,
      surName: values.surName,
      phone: values.phone,
      email: values.email,
      comment: values.comment || '',
      paymentMethod: values.paymentMethod,
      turnstileToken,
    };

    try {
      const data = await createRetailOrder(orderPayload).unwrap();
      clearCart();
      reset();

      if (values.paymentMethod === 'CARD' && data.paymentUrl) {
        toast.info(`Замовлення #${data.orderCode} створено! Перенаправляємо на сторінку оплати...`);
        window.location.href = data.paymentUrl;
      } else {
        toast.success(`Замовлення #${data.orderCode} успішно оформлено`);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      const errMsg = error?.data?.message || error?.message || 'Помилка при оформленні замовлення';
      toast.error(errMsg);
    } finally {
      setTurnstileKey((prev) => prev + 1);
      setTurnstileToken('');
    }
  };

  return (
    <form
      className="mb-20 flex flex-col justify-between gap-8 lg:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="mb-2 text-base font-medium text-neutral-900">Дані для доставки</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-neutral-700">
                Ім&apos;я<span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                {...register('firstName')}
                className="rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
              />
              {errors.firstName && (
                <span className="mt-1 text-xs text-rose-600">{errors.firstName.message}</span>
              )}
            </label>
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-neutral-700">
                Прізвище<span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                {...register('lastName')}
                className="rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
              />
              {errors.lastName && (
                <span className="mt-1 text-xs text-rose-600">{errors.lastName.message}</span>
              )}
            </label>
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-neutral-700">
                По батькові<span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                {...register('surName')}
                className="rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
              />
              {errors.surName && (
                <span className="mt-1 text-xs text-rose-600">{errors.surName.message}</span>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-neutral-700">
              Телефон<span className="text-red-600">*</span>
            </span>
            <input
              type="tel"
              placeholder="+380..."
              {...register('phone')}
              className="rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
            />
            {errors.phone && (
              <span className="mt-1 text-xs text-rose-600">{errors.phone.message}</span>
            )}
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-neutral-700">
              Email<span className="text-red-600">*</span>
            </span>
            <input
              type="email"
              placeholder="example@mail.com"
              {...register('email')}
              className="rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
            />
            {errors.email && (
              <span className="mt-1 text-xs text-rose-600">{errors.email.message}</span>
            )}
          </label>
        </div>

        <PaymentMethodSelector
          value={selectedPaymentMethod}
          onChange={(method: PaymentMethod) =>
            setValue('paymentMethod', method, { shouldValidate: true })
          }
          errorMessage={errors.paymentMethod?.message}
        />
      </div>

      <div className="flex w-full flex-col gap-4 lg:w-[450px]">
        <NovaPoshtaDelivery
          onCityChange={(city) => setValue('city', city, { shouldValidate: true })}
          onWarehouseChange={(warehouse) =>
            setValue('warehouse', warehouse, { shouldValidate: true })
          }
          cityError={errors.city?.message}
          warehouseError={errors.warehouse?.message}
        />

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-neutral-700">Коментарій</span>
          <textarea
            {...register('comment')}
            className="h-24 w-full rounded-lg border border-gray-400 p-2 outline-none focus:border-amber-500"
            placeholder="Коментарій до замовлення"
          />
        </label>

        <TurnstileWidget
          key={turnstileKey}
          action="checkout_retail"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken('')}
          className="my-2 flex justify-end"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-dark ml-auto block h-fit w-full cursor-pointer rounded-lg px-6 py-3 text-lg font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-fit"
        >
          {isSubmitting ? 'Оформлення...' : 'Підтвердити замовлення'}
        </button>
      </div>
    </form>
  );
}
