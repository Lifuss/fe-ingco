'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTable } from 'react-table';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { usePathname, useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
} from '@/lib/appState/auth/operation';
import clsx from 'clsx';

export type rawData = {
  article: string;
  name: string;
  image: string;
  price: string;
  priceRetailRecommendation: string;
  countInStock: number;
  _id: string;
};

const Table = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);

  const { products, totalPages } = state.persistedMainReducer;
  let favorites = state.persistedAuthReducer.user.favorites;

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let category = searchParams.get('category') || '';

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    dispatch(fetchMainTableDataThunk({ page, query, category }));
  }, [dispatch, page, query, category]);

  const [quantities, setQuantities] = useState({});

  // ref to store quantities
  const quantitiesRef = useRef({});
  const handleQuantityChange = (id: string, value: string) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: value };
      quantitiesRef.current = updated; // update ref
      return updated; // update state
    });
  };

  let image = document.getElementById('image') as HTMLDivElement;
  if (!image) {
    image = document.createElement('div');
    image.className = `absolute  z-50 h-[200px] w-[200px] hidden`;
    image.id = 'image';
    document.body.appendChild(image);
  }

  function handleFavoriteClick(id: string) {
    dispatch(addFavoriteProductThunk(id));
    const element = document.querySelector(
      `button[data-favoriteId="${id}"]`,
    ) as HTMLButtonElement;

    if (favorites.includes(id)) {
      element.classList.remove('fill-orange-500 outline-yellow-500');
      console.log('remove', id);
    } else {
      element.classList.add('fill-orange-500 outline-red-500');
      console.log('add', id);
    }
  }

  const data = useMemo(() => {
    return products.map((product) => ({
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
  }, [products]);

  const columns = useMemo(
    () => [
      {
        Header: 'Код',
        accessor: 'codeCol', // accessor is the "key" in the data
      },
      {
        Header: 'Назва',
        accessor: 'nameCol',
        Cell: ({ row }) => (
          <button
            className="min-w-[300px] text-left"
            onClick={() => {
              console.log(row.values.nameCol);
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
              src={`http://localhost:3030${row.values.photoCol}`}
              alt={row.values.nameCol}
              width={40}
              height={40}
              className="h-11 w-11"
              onMouseEnter={(e) => {
                let img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = `<img src="http://localhost:3030${row.values.photoCol}" alt="${row.values.nameCol}" />`;
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
            className="px-2 py-1 text-white"
            onClick={handleFavoriteClick.bind(null, row.original._id)}
            data-favoriteId={row.original._id}
          >
            <svg
              width="30"
              height="28"
              viewBox="-2 10 35 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={clsx(
                'fill-white stroke-red-600 stroke-2 hover:fill-orange-500',
                favorites.includes(row.original._id) && 'fill-orange-500',
              )}
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
            name={row.original._id}
            type="number"
            className="h-8 w-[70px] rounded-md p-1 text-center"
            onChange={(e) => {
              handleQuantityChange(row.original._id, e.target.value);
            }}
            defaultValue={row.values.quantityCol}
            placeholder="0"
          />
        ),
      },
      {
        Header: 'Кошик',

        accessor: 'cartCol',
        Cell: ({ row }) => (
          <button
            className="px-2 py-1 text-white"
            onClick={() => {
              console.log(
                `Product ID: ${row.original._id}, Quantity: ${quantitiesRef.current[row.original._id]} product: ${row.original.product.article}`,
              );
              if (quantitiesRef.current[row.original._id] > 0) {
                dispatch(
                  addProductToCartThunk({
                    productId: row.original._id,
                    quantity: quantitiesRef.current[row.original._id],
                  }),
                );
              } else {
                alert('Введіть кількість товару');
              }
              const inputElement = document.querySelector(
                `input[name="${row.original._id}"]`,
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
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      {products.length === 0 ? (
        <div className="grid place-items-center">
          <h2 className="w-1/2 text-center text-3xl">
            По вибраним параметрам товару більше не знайдено
          </h2>
        </div>
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`thead-${headerGroupIndex}`}
              >
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    {...column.getHeaderProps()}
                    key={`th-${columnIndex}`}
                    className="border-[1px] border-gray-300 bg-gray-100 px-3 py-2 font-medium"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`tr-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`td-${cellIndex}`}
                        className="border-[1px] border-gray-300 px-1 text-center"
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
};

export default Table;
