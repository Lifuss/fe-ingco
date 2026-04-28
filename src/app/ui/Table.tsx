import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type TableWithClickableRow<T extends object> = {
  rowClickable: true;
  rowFunction: (row: T) => void;
};

type TableWithoutClickableRow = {
  rowClickable?: undefined | false;
  rowFunction?: never;
};

export type TableProps<T extends object> = {
  columns: ColumnDef<T>[];
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
  'use no memo';

  // The 'use no memo' directive already opts the component out of React Compiler memoization (which is correct for TanStack Table)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  return (
    <table className="w-full text-sm lg:text-base" ref={tableRef}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="sticky -top-1">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={`border-px px-1 py-1 font-medium lg:px-3 lg:py-2 ${headerColor} ${borderColor}`}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            onClick={rowClickable ? () => rowFunction(row.original) : undefined}
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
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={`border-px ${borderColor} px-[2px] text-center lg:px-1`}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
