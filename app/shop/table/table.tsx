'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTable } from 'react-table';

const Table = () => {
  const [quantities, setQuantities] = useState({});

  const quantitiesRef = useRef({});

  const handleQuantityChange = (id: string, value: string) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: value };
      quantitiesRef.current = updated; // update ref
      return updated; // update state
    });
  };

  useEffect(() => {
    console.log(quantities);
  }, [quantities]);
  const data = useMemo(
    () => [
      {
        codeCol: 'Hello',
        nameCol: 'World',
        _id: '1g',
      },
      {
        codeCol: 'react-table',
        nameCol: 'rocks',
        _id: '2a',
      },
      {
        codeCol: 'whatever',
        nameCol: 'you want',
        _id: '3s',
      },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Код',
        accessor: 'codeCol', // accessor is the "key" in the data
      },
      {
        Header: 'Назва',
        accessor: 'nameCol',
      },
      {
        Header: 'Фото',
        accessor: 'photoCol',
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
            className="h-8 w-10 rounded-md border-2 border-gray-400 p-1 text-center"
            onChange={(e) => {
              handleQuantityChange(row.original._id, e.target.value);
            }}
            defaultValue={row.values.quantityCol}
          />
        ),
      },
      {
        Header: 'Кошик',
        accessor: 'cartCol',
        Cell: ({ row }) => (
          <button
            className="rounded-md bg-green-500 px-2 py-1 text-white"
            onClick={() => {
              console.log(
                `Product ID: ${row.original._id}, Quantity: ${quantitiesRef.current[row.original._id]}`,
              );
              document.querySelector(
                `input[name="${row.original._id}"]`,
              ).value = '';
            }}
          >
            {row.values.cartCol}
          </button>
        ),
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                className="border-b-[3px] border-red-700 bg-blue-400 font-medium"
                {...column.getHeaderProps()}
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
                    className="border-2 border-gray-400 bg-yellow-200 p-4"
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
