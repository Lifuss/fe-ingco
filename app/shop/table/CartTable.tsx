'use client';

import Table from '@/app/ui/Table';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
// import { Row } from 'react-table';
import {
  addProductToCartThunk,
  createOrderThunk,
  deleteProductFromCartThunk,
} from '@/lib/appState/user/operation';
import Modal from 'react-modal';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import Icon from '@/app/ui/assets/Icon';

type CartData = { quantity: number; _id: string; productId: Product }[];

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const CartTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useAppDispatch();

  const selectedCart: CartData = useAppSelector(
    (state) => state.persistedAuthReducer.user.cart,
  );
  const selectedCurrency = useAppSelector(
    (state) => state.persistedMainReducer.currencyRates,
  );

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

  const data = useMemo(() => {
    return selectedCart.map((item) => ({
      codeCol: item.productId.article,
      nameCol: item.productId.name,
      photoCol: item.productId.image,
      priceCol: item.productId.price,
      priceUahCol: Math.ceil(
        item.productId.price * +selectedCurrency.USD.toFixed(2),
      ),
      rrcCol: item.productId.priceRetailRecommendation,
      quantityCol: item.quantity,
      totalCol: `${(item.productId.price * item.quantity).toFixed(2)}$ | ${Math.ceil(item.productId.price * selectedCurrency.USD * item.quantity)}грн`,
      _id: item.productId._id,
      product: item.productId,
    }));
  }, [selectedCart, selectedCurrency.USD]);

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
        Header: 'Ціна($)',
        accessor: 'priceCol',
      },
      {
        Header: 'Ціна(грн)',
        accessor: 'priceUahCol',
      },
      {
        Header: 'РРЦ(грн)',
        accessor: 'rrcCol',
        Cell: ({ row }) => {
          return (
            <div title="Рекомендована роздрібна ціна">{row.values.rrcCol}</div>
          );
        },
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
        Header: 'Сума($|грн)',
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
                  dispatch(
                    deleteProductFromCartThunk({
                      productId: row.original._id,
                      quantity: row.values.quantityCol,
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

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const comment = (form.elements.namedItem('comment') as HTMLInputElement)
      ?.value;
    const order = {
      products: selectedCart.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: Number(item.productId.price.toFixed(2)),
        totalPriceByOneProduct: Number(
          (item.productId.price * item.quantity).toFixed(2),
        ),
      })),
      shippingAddress: 'test',
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
      .then((data) => {
        closeModal();
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
      <div className="ml-auto mt-2 flex w-fit gap-2 border-b-2 text-lg">
        <p>Загальна сума</p>
        <p>
          {sum}$ | {Math.ceil(+sum * selectedCurrency.USD)}грн
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          openModal();
        }}
        className="ml-auto mt-4 block w-fit rounded-lg bg-[#111827] px-2 py-2 text-lg text-white"
      >
        Підтвердити замовлення
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Підтвердження замовлення"
      >
        <form
          className="flex w-[500px] flex-col gap-4 px-5"
          onSubmit={handleSubmit}
        >
          <ul className="flex flex-col gap-2 text-lg">
            <li>
              <p>
                Після оформлення з вами зв&apos;яжеться менеджер через вайбер
                або дзвінок і уточнить деталі
              </p>
            </li>
            <li>
              <p>
                В коментарі можете вказати бажаний тип зв&apos;язку, а також
                неявні деталі по типу розділеного замовлення тощо.
              </p>
            </li>
            <li>
              <p>
                Якщо не бажаєте щоб вам передзвонювали, то вкажіть повне інфо
                для відправки в коментарі (ПІБ, тел номер, адреса відділення НП)
              </p>
            </li>
          </ul>
          <textarea
            className=""
            name="comment"
            placeholder="Коментарій до замовлення"
          />

          <button
            type="submit"
            className="mx-auto w-fit rounded-lg bg-[#111827] px-4 py-4 text-2xl text-white"
          >
            Оформити замовлення
          </button>
        </form>
      </Modal>
      <ModalProduct
        product={selectedProduct}
        closeModal={closeProductModal}
        isOpen={isModalOpen}
      />
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
