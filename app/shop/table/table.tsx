'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTable } from 'react-table';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Pagination from '@/app/ui/Pagination';

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
  console.log('searchParams', searchParams);

  const dispatch = useAppDispatch();

  const { products, totalPages, tableLoading } = useAppSelector(
    (state) => state.persistedMainReducer,
  );
  console.log('products', products);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    dispatch(fetchMainTableDataThunk({ page, query }));
  }, [dispatch, page, query]);

  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;

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
        Cell: ({ row }) => (
          <Image
            src={`http://localhost:3030${row.values.photoCol}`}
            alt={row.values.nameCol}
            width={40}
            height={40}
            className="h-11 w-11"
          />
        ),
      },
      {
        Header: 'Улюблене',
        accessor: 'favoriteCol',
        Cell: ({ row }) => (
          <button
            className="px-2 py-1 text-white"
            onClick={() => {
              console.log(`Product ID: ${row.original._id} added to favorites`);
            }}
          >
            <svg
              width="32"
              height="28"
              viewBox="0 0 32 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.0312 0.5C20.1273 0.5 17.5848 1.74875 16 3.85953C14.4152 1.74875 11.8727 0.5 8.96875 0.5C6.65719 0.502605 4.44106 1.42202 2.80654 3.05654C1.17202 4.69106 0.252605 6.90719 0.25 9.21875C0.25 19.0625 14.8455 27.0303 15.467 27.3594C15.6309 27.4475 15.814 27.4936 16 27.4936C16.186 27.4936 16.3691 27.4475 16.533 27.3594C17.1545 27.0303 31.75 19.0625 31.75 9.21875C31.7474 6.90719 30.828 4.69106 29.1935 3.05654C27.5589 1.42202 25.3428 0.502605 23.0312 0.5ZM16 25.0813C13.4322 23.585 2.5 16.7689 2.5 9.21875C2.50223 7.50382 3.18448 5.85976 4.39712 4.64712C5.60976 3.43448 7.25382 2.75223 8.96875 2.75C11.7039 2.75 14.0003 4.20688 14.9594 6.54688C15.0441 6.75321 15.1883 6.92969 15.3736 7.0539C15.5589 7.1781 15.7769 7.24441 16 7.24441C16.2231 7.24441 16.4411 7.1781 16.6264 7.0539C16.8117 6.92969 16.9559 6.75321 17.0406 6.54688C17.9997 4.20266 20.2961 2.75 23.0312 2.75C24.7462 2.75223 26.3902 3.43448 27.6029 4.64712C28.8155 5.85976 29.4978 7.50382 29.5 9.21875C29.5 16.7577 18.565 23.5836 16 25.0813Z"
                fill="#F81414"
              />
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

      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
};

export default Table;
