'use client';

import Table from '@/app/ui/Table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { SubmitEvent, useMemo, useState } from 'react';
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

type CartData = { quantity: number; _id: string; productId: Product }[];
type CartTableRow = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  priceCol: number;
  priceUahCol: number;
  rrcCol: number;
  quantityCol: number;
  totalCol: string;
  _id: string;
  product: Product;
};

const CartTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useAppDispatch();

  const selectedCart: CartData = useAppSelector((state) => state.persistedAuthReducer.user.cart);
  const selectedCurrency = useAppSelector(selectCurrency);

  const handleQuantityChange = (id: string, operation: string) => {
    if (operation === 'increment') {
      dispatch(addProductToCartThunk({ productId: id, quantity: 1 }));
    } else {
      dispatch(deleteProductFromCartThunk({ productId: id, quantity: 1 }));
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

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
      _id: item.productId._id,
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
              className="min-w-[150px] text-left transition-colors hover:text-blue-500"
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
              src={`${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`}
              alt={row.original.nameCol}
              width={40}
              height={40}
              className="mx-auto h-11 w-11"
              onMouseEnter={(e) => {
                const img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = `<img src="${process.env.NEXT_PUBLIC_API}${row.original.photoCol}" alt="${row.original.nameCol}" />`;
                img.style.top = `${e.clientY + 20}px`;
                img.style.left = `${e.clientX + 20}px`;
                img.classList.remove('hidden');
              }}
              onMouseOut={() => {
                const img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = '';
                img.classList.add('hidden');
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
            <div>
              <button
                className="mr-2"
                onClick={() => handleQuantityChange(row.original._id, 'decrement')}
              >
                -
              </button>
              <input
                className="w-5 border-none p-0 text-center outline-none"
                type="number"
                value={row.original.quantityCol}
                readOnly
              />
              <button
                className="ml-2"
                onClick={() => handleQuantityChange(row.original._id, 'increment')}
              >
                +
              </button>
            </div>
          );
        },
      },
      {
        header: 'Сума($|грн)',
        accessorKey: 'totalCol',
        cell: ({ row }) => {
          return (
            <div
              className="relative"
              title="Сума = кількість * ціна | кількість * ціна * курс долара монобанку"
            >
              {row.original.totalCol}
              <button
                className="absolute top-0 -right-7 fill-gray-400 hover:fill-red-500"
                onClick={() => {
                  dispatch(
                    deleteProductFromCartThunk({
                      productId: row.original._id,
                      quantity: row.original.quantityCol,
                    }),
                  );
                }}
              >
                <Icon icon="delete" className="h-5 w-5 fill-inherit" />
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        productId: item.productId._id,
        quantity: item.quantity,
        price: Number(item.productId.price.toFixed(2)),
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
              className="mx-auto mt-5 mb-20 w-fit rounded-lg bg-[#111827] p-2 text-2xl text-white"
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
