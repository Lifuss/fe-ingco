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
  headerColor,
  borderColor = 'border-neutral-250',
  rowClickable,
  rowFunction,
}: TableProps<T>) {
  'use no memo';

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

  // Dynamic cell and header text alignment helper
  const getAlignClass = (columnId: string) => {
    const isCentered = [
      'photoCol',
      'favoriteCol',
      'quantityCol',
      'cartCol',
      'editCol',
      'actionCol',
      'priceCol',
      'priceUahCol',
      'rrcCol',
      'availabilityCol',
      'sortCol',
      'deleteCol',
    ].includes(columnId);
    return isCentered ? 'text-center' : 'text-left';
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm text-neutral-800 font-sans" ref={tableRef}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-neutral-200">
              {headerGroup.headers.map((header) => {
                const alignClass = getAlignClass(header.column.id);
                // Ensure dynamic header classes have high-quality styling while preserving passed headerColor overrides
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "px-4 py-3 font-display font-bold text-[11px] uppercase tracking-wider text-neutral-500 select-none sticky top-0 z-10 border-b border-neutral-200",
                      alignClass,
                      headerColor || "bg-neutral-50/90"
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-neutral-200/50">
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
                (row.original as { availableCol?: boolean }).availableCol
                  ? 'pointer-events-none cursor-context-menu opacity-40 bg-neutral-50/25'
                  : 'hover:bg-neutral-50/50 transition-colors bg-white'
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const alignClass = getAlignClass(cell.column.id);
                return (
                  <td
                    key={cell.id}
                    className={clsx(
                      "px-4 py-3 font-medium text-neutral-700 align-middle",
                      alignClass
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
