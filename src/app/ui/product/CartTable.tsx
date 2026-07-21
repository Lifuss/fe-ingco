'use no memo';
'use client';

import Table from '@/app/ui/Table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { SubmitEvent, useCallback, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import {
  addProductToCartThunk,
  createOrderThunk,
  deleteProductFromCartThunk,
} from '@/lib/appState/user/operation';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import Icon from '@/app/ui/assets/Icon';
import NovaPoshtaComponent from '@/app/ui/utils/NovaPoshta';
import { selectCurrency } from '@/lib/appState/main/selectors';
import { type ColumnDef } from '@tanstack/react-table';
import PricingTooltip from '@/app/ui/PricingTooltip';

type CartData = { quantity: number; id: number; productId: Product }[];
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
  const dispatch = useAppDispatch();

  const rawCart = useAppSelector((state) => state.persistedAuthReducer.user?.cart);
  const selectedCart = useMemo<CartData>(() => (rawCart as CartData) || [], [rawCart]);
  const selectedCurrency = useAppSelector(selectCurrency);

  const handleQuantityChange = useCallback(
    (id: number, operation: string) => {
      if (operation === 'increment') {
        dispatch(addProductToCartThunk({ productId: id, quantity: 1 }));
      } else {
        dispatch(deleteProductFromCartThunk({ productId: id, quantity: 1 }));
      }
    },
    [dispatch],
  );

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const data = useMemo<CartTableRow[]>(() => {
    return selectedCart.map((item) => ({
      codeCol: item.productId.article,
      nameCol: item.productId.name,
      photoCol: item.productId.image,
      priceCol: item.productId.price,
      priceUahCol: Math.ceil(item.productId.price * selectedCurrency.USD),
      rrcCol: item.productId.priceRetailRecommendation,
      quantityCol: item.quantity,
      totalCol: `${(item.productId.price * item.quantity).toFixed(2)}$ | ${Math.ceil(item.productId.price * selectedCurrency.USD * item.quantity)}грн`,
      id: item.productId.id,
      product: item.productId,
    }));
  }, [selectedCart, selectedCurrency.USD]);

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
              dispatch(
                deleteProductFromCartThunk({
                  productId: row.original.id,
                  quantity: row.original.quantityCol,
                }),
              );
            }}
            aria-label={`Видалити ${row.original.nameCol} з кошика`}
          >
            <Icon icon="delete" className="h-5 w-5 fill-current" />
          </button>
        ),
      },
    ],
    [dispatch, handleQuantityChange, openProductModal],
  );

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const comment = (form.elements.namedItem('comment') as HTMLInputElement)?.value;
    const address =
      (form.elements.namedItem('city') as HTMLInputElement)?.value +
      ', ' +
      (form.elements.namedItem('warehouse') as HTMLInputElement)?.value;
    const order = {
      products: selectedCart.map((item) => ({
        productId: item.productId.id,
        quantity: item.quantity,
        price: Number(Number(item.productId.price).toFixed(2)),
        totalPriceByOneProduct: Number((item.productId.price * item.quantity).toFixed(2)),
      })),
      shippingAddress: address,
      totalPrice: Number(
        selectedCart
          .reduce((acc, item) => {
            return acc + item.productId.price * item.quantity;
          }, 0)
          .toFixed(2),
      ),
      comment,
      usdRate: selectedCurrency.USD,
    };

    dispatch(createOrderThunk(order))
      .unwrap()
      .then(() => {
        toast.success('Замовлення успішно оформлено');
      });
  };

  const sum = selectedCart
    .reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0)
    .toFixed(2);

  return selectedCart.length > 0 ? (
    <div className="">
      <Table columns={columns} data={data} />
      <div className="mt-2 ml-auto flex w-fit gap-2 border-b-2 text-lg">
        <p>Загальна сума</p>
        <p>
          {sum}$ | {Math.ceil(+sum * selectedCurrency.USD)}грн
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

            <button
              type="submit"
              className="bg-brand-dark mx-auto mt-5 mb-20 w-fit rounded-lg p-2 text-2xl text-white"
            >
              Оформити замовлення
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
