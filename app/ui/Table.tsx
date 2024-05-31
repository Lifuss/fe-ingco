// make reusable table component from react-table
import clsx from 'clsx';
import React from 'react';
import { Column, useTable } from 'react-table';

export default function Table({
  columns,
  data,
  headerColor = 'bg-gray-100',
  borderColor = 'border-gray-300',
  rowClickable,
  rowFunction,
}: {
  columns: Column<{}>[];
  data: {}[];
  headerColor?: string;
  borderColor?: string;
  rowClickable?: boolean;
  rowFunction?: (row: any) => void;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} className="w-full">
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
                className={`border-[1px] px-3 py-2 font-medium ${headerColor} ${borderColor}`}
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
                onClick: () =>
                  rowClickable &&
                  rowFunction &&
                  rowFunction((row.original as { numberCol: any }).numberCol),
              } as React.HTMLAttributes<HTMLTableRowElement>)}
              key={`tr-${rowIndex}`}
              className={clsx(rowClickable && 'cursor-pointer')}
            >
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={`td-${cellIndex}`}
                    className={`border-[1px] ${borderColor} px-1 text-center`}
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
