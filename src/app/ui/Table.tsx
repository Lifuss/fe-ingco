'use no memo';
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
  scrollTrigger?: unknown;
  maxHeight?: string | null;
} & (TableWithClickableRow<T> | TableWithoutClickableRow);

export default function Table<T extends object>({
  columns,
  data,
  headerColor,
  borderColor = 'border-neutral-250',
  rowClickable,
  rowFunction,
  scrollTrigger,
  maxHeight = 'max-h-[75vh]',
}: TableProps<T>) {
  // TanStack Table useReactTable повертає функції, які React Compiler (React 19) намагається
  // автоматично мемоізувати, що може призвести до нестабільної роботи інтерфейсу.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (scrollTrigger !== undefined && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollTrigger]);

  // Dynamic cell and header text alignment helper
  const getAlignClass = (columnId: string) => {
    const isCentered = [
      'codeCol',
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

  const getCellPaddingClass = (columnId: string) => {
    if (columnId === 'photoCol') {
      return 'p-0';
    }
    if (
      ['favoriteCol', 'quantityCol', 'cartCol', 'deleteCol', 'editCol', 'actionCol'].includes(
        columnId,
      )
    ) {
      return 'xl:px-2 lg:px-1 md:px-2 md:py-3 max-md:px-0.5 max-md:py-2 max-[425px]:px-0';
    }
    if (['priceCol', 'priceUahCol', 'rrcCol', 'codeCol'].includes(columnId)) {
      return 'xl:px-3 lg:px-1 md:px-3 md:py-3 max-md:px-1.5 max-md:py-2 max-[425px]:px-0';
    }
    return 'xl:px-3 lg:px-2 md:px-3 md:py-3 max-md:px-1.5 max-md:py-2 max-[425px]:px-0';
  };

  // Dynamic column width helper
  const getWidthClass = (columnId: string) => {
    if (columnId === 'codeCol') {
      return 'w-[100px] max-w-[120px] truncate';
    }
    if (columnId === 'photoCol') {
      return 'w-[50px] max-w-[50px] min-[1440px]:w-[80px] min-[1440px]:max-w-[80px]';
    }
    if (columnId === 'nameCol') {
      return 'w-full min-w-[180px] lg:min-w-[220px] xl:min-w-[250px] max-w-[350px] lg:max-w-[450px]';
    }
    return '';
  };

  const isScrollable = maxHeight !== null;

  return (
    <div
      className={clsx(
        'w-full rounded-xl border bg-white shadow-sm',
        isScrollable ? 'overflow-auto' : 'overflow-x-auto',
        borderColor,
        isScrollable && (maxHeight || 'max-h-[75vh]'),
      )}
    >
      <table
        className="font-table w-full border-collapse text-sm text-neutral-800 tabular-nums"
        ref={tableRef}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-neutral-200">
              {headerGroup.headers.map((header) => {
                const alignClass = getAlignClass(header.column.id);
                const paddingClass = getCellPaddingClass(header.column.id);
                const widthClass = getWidthClass(header.column.id);
                // Ensure dynamic header classes have high-quality styling while preserving passed headerColor overrides
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      'font-table sticky top-0 z-10 border-r border-b border-neutral-200 text-[11px] font-bold tracking-wider text-neutral-500 uppercase select-none last:border-r-0',
                      paddingClass,
                      alignClass,
                      widthClass,
                      headerColor || 'bg-neutral-50',
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
                  ? 'pointer-events-none cursor-context-menu bg-neutral-50/25 opacity-40'
                  : 'bg-white transition-colors hover:bg-neutral-50/50',
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const alignClass = getAlignClass(cell.column.id);
                const paddingClass = getCellPaddingClass(cell.column.id);
                const widthClass = getWidthClass(cell.column.id);
                let cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());

                if (cell.column.id === 'nameCol') {
                  cellContent = (
                    <div className="line-clamp-2 text-left break-words whitespace-normal">
                      {cellContent}
                    </div>
                  );
                }

                return (
                  <td
                    key={cell.id}
                    className={clsx(
                      'border-r border-neutral-200/60 align-middle font-medium text-neutral-700 last:border-r-0',
                      paddingClass,
                      alignClass,
                      widthClass,
                    )}
                  >
                    {cellContent}
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
