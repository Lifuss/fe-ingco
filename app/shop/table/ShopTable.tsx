'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import clsx from 'clsx';
import Table from '@/app/ui/Table';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';

export type rawData = {
  article: string;
  name: string;
  category: string;
  image: string;
  price: string;
  priceRetailRecommendation: string;
  countInStock: number;
  _id: string;
};

// This is a table wrapper component that fetches data from the server and displays it in a table.
const ShopTable = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { products, totalPages } = state.persistedMainReducer;
  let favorites: Product[] = state.persistedAuthReducer.user.favorites;
  const favoritesList = favorites.map((product) => product._id);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let category = searchParams.get('category') || '';

  let productsData = products;
  if (isFavoritePage) {
    productsData = favorites;
    if (query) {
      productsData = favorites.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.article.toLowerCase().includes(query.toLowerCase()),
      );
    }
    if (category) {
      productsData = productsData.filter((product) =>
        product.category.name.toLowerCase().includes(category.toLowerCase()),
      );
    }
    productsData = productsData.slice((page - 1) * 10, page * 10);
  }

  useEffect(() => {
    if (!isFavoritePage) {
      dispatch(fetchMainTableDataThunk({ page, query, category }));
    }
  }, [dispatch, page, query, category, isFavoritePage]);

  const [quantities, setQuantities] = useState({});

  // ref to store quantities
  const quantitiesRef = useRef<Record<string, number>>({});
  const handleQuantityChange = (id: string, value: string) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: value };
      quantitiesRef.current = updated; // update ref
      return updated; // update state
    });
  };

  function handleFavoriteClick(id: string) {
    const element = document.querySelector(
      `button[data-favorite="${id}"]`,
    ) as HTMLButtonElement;
    if (favoritesList.includes(id)) {
      dispatch(deleteFavoriteProductThunk(id));
      element.classList.remove('fill-orange-500');
      element.classList.add('fill-white');
    } else {
      dispatch(addFavoriteProductThunk(id));
      element.classList.remove('fill-white');
      element.classList.add('fill-orange-500');
    }
  }

  const data = useMemo(() => {
    return productsData.map((product) => ({
      codeCol: product.article,
      nameCol: product.name,
      photoCol: product.image,
      favoriteCol: true,
      priceCol: product.price,
      rrcCol: product.priceRetailRecommendation,
      availableCol: product.countInStock > 0 ? 'Так' : 'Ні',
      _id: product._id,
      product,
    }));
  }, [productsData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Артикль',
        accessor: 'codeCol', // accessor is the "key" in the data
      },
      {
        Header: 'Назва',
        accessor: 'nameCol',
        Cell: ({ row }: { row: any }) => (
          <button
            className="min-w-[150px] text-left transition-colors hover:text-blue-500"
            onClick={() => {
              setSelectedProduct(row.original.product);
              openModal();
            }}
          >
            {row.values.nameCol}
          </button>
        ),
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
        Header: 'Улюблене',
        accessor: 'favoriteCol',
        Cell: ({ row }) => (
          <button
            onClick={handleFavoriteClick.bind(
              null,
              (row.original as { _id: string })._id,
            )}
            data-favorite={(row.original as { _id: string })._id}
            className={clsx(
              'px-2 py-1 text-white',
              favoritesList.includes((row.original as { _id: string })._id)
                ? ' fill-orange-500'
                : 'fill-white stroke-black',
            )}
          >
            <svg
              width="30"
              height="28"
              viewBox="-2 10 35 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-inherit stroke-inherit"
            >
              <path d="M15 27.525L12.825 25.545C5.1 18.54 0 13.905 0 8.25C0 3.615 3.63 0 8.25 0C10.86 0 13.365 1.215 15 3.12C16.635 1.215 19.14 0 21.75 0C26.37 0 30 3.615 30 8.25C30 13.905 24.9 18.54 17.175 25.545L15 27.525Z" />
            </svg>
          </button>
        ),
      },
      {
        Header: 'Ціна($)',
        accessor: 'priceCol',
      },
      {
        Header: 'РРЦ(грн)',
        accessor: 'rrcCol',
      },
      {
        Header: 'В наявності',
        accessor: 'availableCol',
      },
      {
        Header: 'Кількість',
        accessor: 'quantityCol',
        Cell: ({ row }) => (
          <input
            name={(row.original as { _id: string })._id}
            type="number"
            className="h-8 w-[70px] rounded-md p-1 text-center"
            onChange={(e) => {
              handleQuantityChange(
                (row.original as { _id: string })._id,
                e.target.value,
              );
            }}
            defaultValue={row.values.quantityCol}
            placeholder="0"
          />
        ),
      },
      {
        Header: 'Кошик',

        accessor: 'cartCol',
        Cell: ({ row }: { row: any }) => (
          <button
            className="px-2 py-1 text-white"
            onClick={() => {
              const id = (row.original as { _id: string })._id;
              console.log(
                `Product ID: ${id}, Quantity: ${quantitiesRef.current[id]} product: ${(row.original as { product: { article: string } }).product.article}`,
              );
              if (quantitiesRef.current[row.original._id] > 0) {
                dispatch(
                  addProductToCartThunk({
                    productId: id,
                    quantity: quantitiesRef.current[id],
                  }),
                )
                  .unwrap()
                  .then(() => {
                    toast.success(`${row.values.nameCol} додано в корзину`);
                  });
              } else {
                toast.warning('Введіть кількість товару');
              }
              const inputElement = document.querySelector(
                `input[name="${id}"]`,
              ) as HTMLInputElement;
              inputElement.value = '';
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="fill-black hover:fill-orange-500"
            >
              <path d="M35.7068 9.98438C35.6036 9.83783 35.4667 9.71821 35.3077 9.6356C35.1486 9.553 34.972 9.50982 34.7928 9.5097H10.9169L9.1096 3.2772C8.40085 0.823013 6.71669 0.558075 6.02594 0.558075H1.207C0.589344 0.558075 0.0898438 1.05814 0.0898438 1.6752C0.0898438 2.29226 0.589906 2.79229 1.20697 2.79229H6.02534C6.17778 2.79229 6.64297 2.79229 6.96025 3.8886L13.1776 26.7379C13.3126 27.22 13.7519 27.5529 14.253 27.5529H29.4394C29.9108 27.5529 30.3315 27.2576 30.4908 26.8138L35.8435 11.0048C35.9667 10.6622 35.9155 10.2808 35.7068 9.98438H35.7068ZM28.6532 25.3193H15.101L11.5448 11.7445H33.2045L28.6532 25.3193ZM26.4376 29.8171C24.884 29.8171 23.6251 31.076 23.6251 32.6296C23.6251 34.1832 24.884 35.4421 26.4376 35.4421C27.9912 35.4421 29.2501 34.1832 29.2501 32.6296C29.2501 31.076 27.9912 29.8171 26.4376 29.8171ZM16.3126 29.8171C14.759 29.8171 13.5001 31.076 13.5001 32.6296C13.5001 34.1832 14.759 35.4421 16.3126 35.4421C17.8662 35.4421 19.1251 34.1832 19.1251 32.6296C19.1251 31.076 17.8662 29.8171 16.3126 29.8171Z" />
            </svg>
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const totalPage = isFavoritePage
    ? Math.ceil(favorites.length / 10)
    : totalPages;

  return (
    <>
      {products.length === 0 ? (
        <div className="grid place-items-center">
          <h2 className="w-1/2 text-center text-3xl">
            По вибраним параметрам товару більше не знайдено
          </h2>
        </div>
      ) : (
        <>
          <div className="w-3/4">
            <Table columns={columns} data={data} />
          </div>
          <ModalProduct
            product={selectedProduct}
            closeModal={closeModal}
            isOpen={isModalOpen}
          />
        </>
      )}

      <div className="mx-auto mt-5 w-[43%] pb-10">
        <Pagination totalPages={totalPage} />
      </div>
    </>
  );
};

export default ShopTable;
