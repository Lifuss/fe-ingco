// make reusable table component from react-table
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { Column, useTable } from 'react-table';

type TableWithClickableRow<T extends object> = {
  rowClickable: true;
  rowFunction: (row: T) => void;
};

type TableWithoutClickableRow = {
  rowClickable?: undefined | false;
  rowFunction?: never;
};

export type TableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  headerColor?: string;
  borderColor?: string;
} & (TableWithClickableRow<T> | TableWithoutClickableRow);

export default function Table<T extends object>({
  columns,
  data,
  headerColor = 'bg-gray-100',
  borderColor = 'border-gray-300',
  rowClickable,
  rowFunction,
}: TableProps<T>) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>({
      columns,
      data,
    });

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  return (
    <table
      {...getTableProps()}
      className="w-full text-sm lg:text-base"
      ref={tableRef}
    >
      <thead>
        {headerGroups.map((headerGroup, headerGroupIndex) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={`thead-${headerGroupIndex}`}
            className="sticky -top-1"
          >
            {headerGroup.headers.map((column, columnIndex) => (
              <th
                {...column.getHeaderProps()}
                key={`th-${columnIndex}`}
                className={`border-px px-1 py-1 font-medium lg:px-3 lg:py-2 ${headerColor} ${borderColor}`}
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
            <tr
              {...row.getRowProps({
                onClick: () => rowClickable && rowFunction(row.original),
              } as React.HTMLAttributes<HTMLTableRowElement>)}
              key={`tr-${rowIndex}`}
              title={
                (row.original as { availableCol?: boolean }).availableCol
                  ? 'Немає на складі в Україні'
                  : undefined
              }
              className={clsx(
                rowClickable && 'cursor-pointer',
                (row.original as { availableCol?: boolean }).availableCol &&
                  'pointer-events-none cursor-context-menu opacity-40',
              )}
            >
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={`td-${cellIndex}`}
                    className={`border-px ${borderColor} px-[2px] text-center lg:px-1`}
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
}
