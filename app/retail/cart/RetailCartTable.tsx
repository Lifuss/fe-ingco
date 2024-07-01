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
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-inherit"
                >
                  <path d="M17.25 3.5H13.5V2.75C13.5 2.15326 13.2629 1.58097 12.841 1.15901C12.419 0.737053 11.8467 0.5 11.25 0.5H6.75C6.15326 0.5 5.58097 0.737053 5.15901 1.15901C4.73705 1.58097 4.5 2.15326 4.5 2.75V3.5H0.75C0.551088 3.5 0.360322 3.57902 0.21967 3.71967C0.0790178 3.86032 0 4.05109 0 4.25C0 4.44891 0.0790178 4.63968 0.21967 4.78033C0.360322 4.92098 0.551088 5 0.75 5H1.5V18.5C1.5 18.8978 1.65804 19.2794 1.93934 19.5607C2.22064 19.842 2.60218 20 3 20H15C15.3978 20 15.7794 19.842 16.0607 19.5607C16.342 19.2794 16.5 18.8978 16.5 18.5V5H17.25C17.4489 5 17.6397 4.92098 17.7803 4.78033C17.921 4.63968 18 4.44891 18 4.25C18 4.05109 17.921 3.86032 17.7803 3.71967C17.6397 3.57902 17.4489 3.5 17.25 3.5ZM6 2.75C6 2.55109 6.07902 2.36032 6.21967 2.21967C6.36032 2.07902 6.55109 2 6.75 2H11.25C11.4489 2 11.6397 2.07902 11.7803 2.21967C11.921 2.36032 12 2.55109 12 2.75V3.5H6V2.75ZM15 18.5H3V5H15V18.5ZM7.5 8.75V14.75C7.5 14.9489 7.42098 15.1397 7.28033 15.2803C7.13968 15.421 6.94891 15.5 6.75 15.5C6.55109 15.5 6.36032 15.421 6.21967 15.2803C6.07902 15.1397 6 14.9489 6 14.75V8.75C6 8.55109 6.07902 8.36032 6.21967 8.21967C6.36032 8.07902 6.55109 8 6.75 8C6.94891 8 7.13968 8.07902 7.28033 8.21967C7.42098 8.36032 7.5 8.55109 7.5 8.75ZM12 8.75V14.75C12 14.9489 11.921 15.1397 11.7803 15.2803C11.6397 15.421 11.4489 15.5 11.25 15.5C11.0511 15.5 10.8603 15.421 10.7197 15.2803C10.579 15.1397 10.5 14.9489 10.5 14.75V8.75C10.5 8.55109 10.579 8.36032 10.7197 8.21967C10.8603 8.07902 11.0511 8 11.25 8C11.4489 8 11.6397 8.07902 11.7803 8.21967C11.921 8.36032 12 8.55109 12 8.75Z" />
                </svg>
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
    const shippingAddress = (
      form.elements.namedItem('shippingAddress') as HTMLInputElement
    )?.value;

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
      <form className="flex  justify-between gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <label className="flex flex-col">
              <span>Ім&apos;я</span>
              <input
                required
                type="text"
                name="firstName"
                defaultValue={firstName || ''}
                className="border-1 rounded-s-lg border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>Прізвище</span>
              <input
                required
                type="text"
                name="lastName"
                defaultValue={lastName || ''}
                className="border-b-1 border-t-1 border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>По-батькові</span>
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
              <span>Телефон</span>
              <input
                required
                type="tel"
                name="phone"
                defaultValue={phone || ''}
                className="border-1 rounded-s-lg border-gray-400 p-2"
              />
            </label>
            <label className="flex flex-col">
              <span>Email</span>
              <input
                required
                type="email"
                name="email"
                defaultValue={email || ''}
                className="border-1 rounded-e-lg border-gray-400 p-2"
              />
            </label>
          </div>
          <label className="mb-2 flex w-1/2 flex-col">
            <span>Адреса доставки</span>
            <input
              type="text"
              name="shippingAddress"
              className="border-1 rounded-lg border-gray-400 p-2"
            />
          </label>
          <textarea
            className="border-1 h-24 w-1/2 rounded-lg border-gray-400 p-2"
            name="comment"
            placeholder="Коментарій до замовлення"
          />
        </div>
        <button
          type="submit"
          className="ml-auto mt-auto block h-fit w-fit rounded-lg bg-[#111827] px-2 py-2 text-lg text-white"
        >
          Підтвердити замовлення
        </button>
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
