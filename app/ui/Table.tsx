// make reusable table component from react-table
import React from 'react';
import { Column, useTable } from 'react-table';

export default function Table({
  columns,
  data,
}: {
  columns: Column<{}>[];
  data: {}[];
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
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
  );
}
