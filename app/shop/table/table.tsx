'use client';
import { useEffect, useRef, useState } from 'react';
import { useTable } from 'react-table';
import { rawData } from '../page';
import Image from 'next/image';

type TProps = {
  rawData: rawData[];
};
type rowProduct = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  favoriteCol: boolean;
  priceCol: string;
  rrcCol: string;
  availableCol: string;
  _id: string;
};

const Table = ({ rawData = [] }: TProps) => {
  const [quantities, setQuantities] = useState({});

  const data = rawData.map((product) => {
    const row: rowProduct = {
      codeCol: product.article,
      nameCol: product.name,
      photoCol: product.image,
      favoriteCol: true,
      priceCol: product.price,
      rrcCol: product.priceRetailRecommendation,
      availableCol: product.countInStock > 0 ? 'Так' : 'Ні',
      _id: product._id,
    };
    return row;
  });

  const quantitiesRef = useRef({});

  const handleQuantityChange = (id: string, value: string) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: value };
      quantitiesRef.current = updated; // update ref
      return updated; // update state
    });
  };

  const columns = [
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
          src={row.values.photoCol}
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
              `Product ID: ${row.original._id}, Quantity: ${quantitiesRef.current[row.original._id]}`,
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
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                key={column.render('Header')}
                className="border-[1px] border-gray-300 bg-gray-100 px-3 py-2 font-medium"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    className="border-[1px] border-gray-300 px-1 text-center"
                    {...cell.getCellProps()}
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
  );
};

export default Table;
