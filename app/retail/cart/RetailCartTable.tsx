'use client';

import Table from '@/app/ui/Table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import {
  addProductToRetailCartThunk,
  createRetailOrderThunk,
  deleteProductFromRetailCartThunk,
} from '@/lib/appState/user/operation';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import {
  decreaseProductQuantityInLocalStorageCart,
  increaseProductQuantityInLocalStorageCart,
  removeProductFromLocalStorageCart,
} from '@/lib/appState/user/slice';
import Icon from '@/app/ui/assets/Icon';
import NovaPoshtaComponent from '@/app/ui/NovaPoshta';

type CartData = { quantity: number; _id: string; productId: Product }[];

const RetailCartTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector(
    (state) => state.persistedAuthReducer.isAuthenticated,
  );
  const {
    retailCart,
    firstName,
    lastName,
    surName,
    phone,
    email,
  }: {
    retailCart: CartData;
    firstName: string;
    lastName: string;
    surName: string;
    phone: string;
    email: string;
  } = useAppSelector((state) => state.persistedAuthReducer.user);
  const localStorageCart = useAppSelector(
    (state) => state.persistedAuthReducer.localStorageCart,
  );

  let selectedCart = isAuth ? retailCart : localStorageCart;

  const handleQuantityChange = (id: string, operation: string) => {
    if (isAuth) {
      if (operation === 'increment') {
        dispatch(addProductToRetailCartThunk({ productId: id, quantity: 1 }));
      } else {
        dispatch(
          deleteProductFromRetailCartThunk({ productId: id, quantity: 1 }),
        );
      }
    } else {
      if (operation === 'increment') {
        dispatch(increaseProductQuantityInLocalStorageCart(id));
      } else {
        dispatch(decreaseProductQuantityInLocalStorageCart(id));
      }
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
  };

  const data = useMemo(() => {
    return selectedCart.map((item) => ({
      codeCol: item.productId.article,
      nameCol: item.productId.name,
      photoCol: item.productId.image,
      rrcCol: item.productId.rrcSale
        ? item.productId.rrcSale
        : item.productId.priceRetailRecommendation,
      quantityCol: item.quantity,
      totalCol: `${item.productId.rrcSale ? item.productId.rrcSale * item.quantity : item.productId.priceRetailRecommendation * item.quantity} грн`,
      _id: item.productId._id,
      product: item.productId,
    }));
  }, [selectedCart]);

  const columns = useMemo(
    () => [
      {
        Header: 'Артикль',
        accessor: 'codeCol',
      },
      {
        Header: 'Назва',
        accessor: 'nameCol',
        Cell: ({ row }: any) => {
          return (
            <button
              className="min-w-[150px] text-left transition-colors hover:text-blue-500"
              onClick={() => {
                openProductModal(row.original.product);
              }}
            >
              {row.values.nameCol}
            </button>
          );
        },
      },
      {
        Header: 'Фото',
        accessor: 'photoCol',
        Cell: ({ row }) => {
          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_API}${row.values.photoCol}`}
              alt={row.values.nameCol}
              width={40}
              height={40}
              className="mx-auto h-11 w-11"
              onMouseEnter={(e) => {
                let img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = `<img src="${process.env.NEXT_PUBLIC_API}${row.values.photoCol}" alt="${row.values.nameCol}" />`;
                img.style.top = `${e.clientY + 20}px`;
                img.style.left = `${e.clientX + 20}px`;
                img.classList.remove('hidden');
              }}
              onMouseOut={() => {
                let img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = '';
                img.classList.add('hidden');
              }}
            />
          );
        },
      },
      {
        Header: 'Ціна(грн)',
        accessor: 'rrcCol',
      },
      {
        Header: 'Кількість',
        accessor: 'quantityCol',
        Cell: ({ row }) => {
          return (
            <div>
              <button
                className="mr-2"
                onClick={() =>
                  handleQuantityChange(row.original._id, 'decrement')
                }
              >
                -
              </button>
              <input
                className="w-5 border-none p-0 text-center outline-none"
                type="number"
                value={row.values.quantityCol}
                readOnly
              />
              <button
                className="ml-2"
                onClick={() =>
                  handleQuantityChange(row.original._id, 'increment')
                }
              >
                +
              </button>
            </div>
          );
        },
      },
      {
        Header: 'Сума',
        accessor: 'totalCol',
        Cell: ({ row }) => {
          return (
            <div
              className="relative"
              title="Сума = кількість * ціна | кількість * ціна * курс долара монобанку"
            >
              {row.values.totalCol}
              <button
                className="absolute -right-7 top-0 fill-gray-400 hover:fill-red-500"
                onClick={() => {
                  isAuth
                    ? dispatch(
                        deleteProductFromRetailCartThunk({
                          productId: row.original._id,
                          quantity: row.values.quantityCol,
                        }),
                      )
                    : dispatch(
                        removeProductFromLocalStorageCart(row.original._id),
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
    [dispatch],
  );

  const sum = Math.ceil(
    selectedCart.reduce((acc, item) => {
      return (
        acc +
        (item.productId.rrcSale
          ? item.productId.rrcSale * item.quantity
          : item.productId.priceRetailRecommendation * item.quantity)
      );
    }, 0),
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const comment = (form.elements.namedItem('comment') as HTMLInputElement)
      ?.value;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement)
      ?.value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement)
      ?.value;
    const surName = (form.elements.namedItem('surName') as HTMLInputElement)
      ?.value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const city = (form.elements.namedItem('city') as HTMLInputElement)?.value;
    const warehouse = (form.elements.namedItem('warehouse') as HTMLInputElement)
      ?.value;

    const shippingAddress = `${city}, ${warehouse}`;

    const order = {
      products: selectedCart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: Math.ceil(
          item.productId.rrcSale
            ? item.productId.rrcSale
            : item.productId.priceRetailRecommendation,
        ),
        totalPriceByOneProduct: Math.ceil(
          item.productId.rrcSale
            ? item.productId.rrcSale * item.quantity
            : item.productId.priceRetailRecommendation * item.quantity,
        ),
      })),
      totalPrice: sum,
      shippingAddress,
      firstName,
      lastName,
      surName,
      phone,
      email,
      comment,
      token: localStorage.getItem('token') || '',
    };
    dispatch(createRetailOrderThunk(order))
      .unwrap()
      .then((data) => {
        toast.success(`Замовлення #${data.orderCode} успішно оформлено`);
        form.reset();
      });
  };

  return selectedCart.length > 0 ? (
    <div className="">
      <Table columns={columns} data={data} />
      <div className="ml-auto mt-2 flex w-fit gap-2 border-b-2 text-lg">
        <p>Загальна сума</p>
        <p>{sum} грн</p>
      </div>
      <form
        className="mb-20  flex justify-between gap-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h3 className="mb-2 text-base font-medium">Дані для доставки</h3>
            <label className="flex flex-col">
              <span>
                Ім&apos;я<span className="text-red-600">*</span>
              </span>
              <input
                required
                type="text"
                name="firstName"
                defaultValue={firstName || ''}
                className="border-1 rounded-s-lg border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>
                Прізвище<span className="text-red-600">*</span>
              </span>
              <input
                required
                type="text"
                name="lastName"
                defaultValue={lastName || ''}
                className="border-b-1 border-t-1 border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>
                По-батькові<span className="text-red-600">*</span>
              </span>
              <input
                required
                type="text"
                name="surName"
                defaultValue={surName || ''}
                className="border-1 rounded-e-lg border-gray-400 p-2"
              />
            </label>
          </div>
          <div className="flex">
            <label className="flex flex-col">
              <span>
                Телефон<span className="text-red-600">*</span>
              </span>
              <input
                required
                type="tel"
                name="phone"
                defaultValue={phone || ''}
                className="border-1 rounded-s-lg border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>
                Email<span className="text-red-600">*</span>
              </span>
              <input
                required
                type="email"
                name="email"
                defaultValue={email || ''}
                className="border-1 rounded-e-lg border-gray-400 p-2"
              />
            </label>
          </div>
        </div>

        <div className="mt-auto flex h-full w-1/3 flex-col gap-4">
          <div className="w-full">
            <h3 className="mb-2 text-base font-medium">Перевізник</h3>
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
          <label>
            Коментарій
            <textarea
              className="border-1 h-24 w-full rounded-lg border-gray-400 p-2"
              name="comment"
              placeholder="Коментарій до замовлення"
            />
          </label>
          <button
            type="submit"
            className="ml-auto mt-auto block h-fit w-fit rounded-lg bg-[#111827] px-2 py-2 text-lg text-white"
          >
            Підтвердити замовлення
          </button>
        </div>
      </form>
      <ModalProduct
        product={selectedProduct}
        closeModal={closeProductModal}
        isOpen={isModalOpen}
        isRetail
      />
    </div>
  ) : (
    <div className="pt-10">
      <TextPlaceholder
        title="Кошик порожній 🍃"
        text="Негайно треба добавити сюди пару інструментів 🛒🏃‍♂️"
        titleSize="4xl"
        textSize="xl"
      />
    </div>
  );
};

export default RetailCartTable;
