'use no memo';
'use client';

import Table from '@/app/ui/Table';
import { useCart } from '@/lib/hooks';
import Image from 'next/image';
import { SubmitEvent, useCallback, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import { useCreateOrderMutation } from '@/lib/appState/api/ordersApi';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import Icon from '@/app/ui/assets/Icon';
import NovaPoshtaComponent from '@/app/ui/utils/NovaPoshta';
import { type ColumnDef } from '@tanstack/react-table';
import PricingTooltip from '@/app/ui/PricingTooltip';
import { extractNovaPoshtaAddress } from '@/lib/utils';

type CartTableRow = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  priceCol: number;
  priceUahCol: number;
  rrcCol: number;
  quantityCol: number;
  totalCol: string;
  id: number;
  product: Product;
};

const CartTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ENTERPRISE' | 'CASH'>('ENTERPRISE');
  const { items, updateQuantity, removeItem, currency, totalPrice } = useCart();

  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const handleQuantityChange = useCallback(
    (id: number, operation: 'increment' | 'decrement') => {
      updateQuantity(id, operation);
    },
    [updateQuantity],
  );

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const data = useMemo<CartTableRow[]>(() => {
    return items.map((item) => {
      const priceUsd = Number(item.productId.price);
      const priceUah = Math.ceil(priceUsd * currency.USD);
      const itemTotalUsd = (priceUsd * item.quantity).toFixed(2);
      const itemTotalUah = priceUah * item.quantity;

      return {
        codeCol: item.productId.article,
        nameCol: item.productId.name,
        photoCol: item.productId.image,
        priceCol: priceUsd,
        priceUahCol: priceUah,
        rrcCol: Number(item.productId.priceRetailRecommendation),
        quantityCol: item.quantity,
        totalCol: `${itemTotalUsd}$ | ${itemTotalUah}грн`,
        id: item.productId.id,
        product: item.productId,
      };
    });
  }, [items, currency.USD]);

  const columns = useMemo<ColumnDef<CartTableRow>[]>(
    () => [
      {
        header: 'Артикль',
        accessorKey: 'codeCol',
      },
      {
        header: 'Назва',
        accessorKey: 'nameCol',
        cell: ({ row }) => {
          return (
            <button
              className="w-full min-w-[150px] text-left transition-colors hover:text-blue-500"
              onClick={() => {
                openProductModal(row.original.product);
              }}
            >
              {row.original.nameCol}
            </button>
          );
        },
      },
      {
        header: 'Фото',
        accessorKey: 'photoCol',
        cell: ({ row }) => {
          return (
            <Image
              src={
                row.original.photoCol
                  ? `${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`
                  : '/placeholder.webp'
              }
              alt={row.original.nameCol || 'Зображення товару'}
              width={64}
              height={64}
              className="mx-auto block h-11 w-11 cursor-pointer object-contain transition-transform hover:scale-105 min-[1440px]:h-16 min-[1440px]:w-16"
              onMouseEnter={(e) => {
                const img = document.getElementById('image') as HTMLDivElement;
                if (img) {
                  const imgTag = document.createElement('img');
                  imgTag.src = row.original.photoCol
                    ? `${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`
                    : '/placeholder.webp';
                  imgTag.alt = row.original.nameCol || 'Зображення товару';
                  img.replaceChildren(imgTag);
                  img.style.top = `${e.clientY + 20}px`;
                  img.style.left = `${e.clientX + 20}px`;
                  img.classList.remove('hidden');
                }
              }}
              onMouseOut={() => {
                const img = document.getElementById('image') as HTMLDivElement;
                if (img) {
                  img.replaceChildren();
                  img.classList.add('hidden');
                }
              }}
            />
          );
        },
      },
      {
        header: 'Ціна($)',
        accessorKey: 'priceCol',
      },
      {
        header: 'Ціна(грн)',
        accessorKey: 'priceUahCol',
      },
      {
        header: 'РРЦ(грн)',
        accessorKey: 'rrcCol',
        cell: ({ row }) => {
          return <div title="Рекомендована роздрібна ціна">{row.original.rrcCol}</div>;
        },
      },
      {
        header: 'Кількість',
        accessorKey: 'quantityCol',
        cell: ({ row }) => {
          return (
            <div className="font-table mx-auto flex h-8 w-[100px] items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-xs shadow-inner select-none">
              <button
                onClick={() => handleQuantityChange(row.original.id, 'decrement')}
                className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200"
                type="button"
                aria-label={`Зменшити кількість для ${row.original.nameCol}`}
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-neutral-900">
                {row.original.quantityCol}
              </span>
              <button
                onClick={() => handleQuantityChange(row.original.id, 'increment')}
                className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200"
                type="button"
                aria-label={`Збільшити кількість для ${row.original.nameCol}`}
              >
                +
              </button>
            </div>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center justify-center gap-1">
            <span>Сума($|грн)</span>
            <PricingTooltip />
          </div>
        ),
        accessorKey: 'totalCol',
      },
      {
        header: '',
        id: 'deleteCol',
        cell: ({ row }) => (
          <button
            className="mx-auto flex cursor-pointer items-center justify-center text-neutral-400 transition-transform duration-200 hover:scale-110 hover:text-rose-500"
            onClick={() => {
              removeItem(row.original.id, row.original.quantityCol);
            }}
            aria-label={`Видалити ${row.original.nameCol} з кошика`}
          >
            <Icon icon="delete" className="h-5 w-5 fill-current" />
          </button>
        ),
      },
    ],
    [removeItem, handleQuantityChange, openProductModal],
  );

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const comment = (form.elements.namedItem('comment') as HTMLInputElement)?.value;
    const shippingAddress = extractNovaPoshtaAddress(form);
    if (!shippingAddress) {
      toast.error('Будь ласка, оберіть населений пункт та відділення Нової Пошти');
      return;
    }

    const order = {
      items: items.map((item) => ({
        productId: item.productId.id,
        quantity: item.quantity,
      })),
      shippingAddress,
      comment,
      usdRate: currency.USD,
      paymentMethod,
    };

    try {
      const created = await createOrder(order).unwrap();
      toast.success(`Замовлення #${created.orderCode} успішно оформлено`);
      form.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      toast.error(error?.data?.message || error?.message || 'Не вдалося оформити замовлення');
    }
  };

  const sum = totalPrice.toFixed(2);

  return items.length > 0 ? (
    <div className="">
      <Table columns={columns} data={data} />
      <div className="mt-2 ml-auto flex w-fit gap-2 border-b-2 text-lg">
        <p>Загальна сума</p>
        <p>
          {sum}$ | {Math.ceil(totalPrice * currency.USD)}грн
        </p>
      </div>
      <div className="flex justify-between gap-20">
        <form className="flex w-full justify-between px-5" onSubmit={handleSubmit}>
          <div className="w-full">
            <h4 className="mb-2 w-fit rounded-full border border-gray-500 p-2">
              <Image
                src="/icons/Nova_Poshta_2019_ua.svg"
                alt="Nova Poshta"
                width={100}
                height={100}
                className="rounded-full"
              />
            </h4>
            <NovaPoshtaComponent />
          </div>
          <div className="flex w-[500px] flex-col">
            <ul className="mt-4 mb-4 flex flex-col gap-1 rounded-xl border border-gray-200 p-2 text-lg">
              <li>
                <p>Після оформлення з вами зв&apos;яжеться менеджер для уточнення</p>
              </li>
              <li>
                <p>
                  В коментарі можете вказати бажаний тип зв&apos;язку, а також неявні деталі по типу
                  розділеного замовлення тощо.
                </p>
              </li>
            </ul>
            <label>
              Коментарій
              <textarea
                className="block w-full rounded-lg border border-gray-500 p-2"
                name="comment"
                placeholder="Коментарій до замовлення"
              />
            </label>

            <div className="mt-4 flex flex-col gap-2">
              <span className="text-base font-medium">Спосіб оплати</span>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  paymentMethod === 'ENTERPRISE'
                    ? 'border-amber-500 bg-amber-50/40'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="b2bPaymentMethod"
                  value="ENTERPRISE"
                  checked={paymentMethod === 'ENTERPRISE'}
                  onChange={() => setPaymentMethod('ENTERPRISE')}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Безготівковий розрахунок (IBAN)</div>
                  <div className="text-xs text-gray-500">
                    Оплата за виставленим рахунком-фактурою для юридичних осіб / ФОП
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  paymentMethod === 'CASH'
                    ? 'border-amber-500 bg-amber-50/40'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="b2bPaymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Оплата при отриманні</div>
                  <div className="text-xs text-gray-500">
                    Накладений платіж у відділенні перевізника
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-dark mx-auto mt-5 mb-20 w-fit cursor-pointer rounded-lg p-2 text-2xl text-white transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Оформлення...' : 'Оформити замовлення'}
            </button>
          </div>
        </form>
      </div>
      <ModalProduct product={selectedProduct} closeModal={closeProductModal} isOpen={isModalOpen} />
    </div>
  ) : (
    <div className="pt-10">
      <TextPlaceholder
        title="Кошик порожній 🍃"
        text="Негайно треба добавити сюди продуктів 🛒🏃‍♂️"
        titleSize="4xl"
        textSize="xl"
      />
    </div>
  );
};

export default CartTable;
