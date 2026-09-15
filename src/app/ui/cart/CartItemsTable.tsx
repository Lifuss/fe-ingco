'use no memo';
'use client';

import Table from '@/app/ui/Table';
import Image from 'next/image';
import { useMemo } from 'react';
import { Product } from '@/lib/types';
import Icon from '@/app/ui/assets/Icon';
import PricingTooltip from '@/app/ui/PricingTooltip';
import CartQuantityControl from './CartQuantityControl';
import { type ColumnDef } from '@tanstack/react-table';
import { UnifiedCartItem } from '@/lib/useCart';

type CartTableRow = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  priceCol: number;
  priceUahCol: number;
  rrcCol: number;
  quantityCol: number;
  totalCol: string;
  id: number;
  product: Product;
};

interface CartItemsTableProps {
  items: UnifiedCartItem[];
  isB2b: boolean;
  currencyUsdRate: number;
  onUpdateQuantity: (id: number, operation: 'increment' | 'decrement') => void;
  onSetQuantity?: (id: number, quantity: number) => void;
  onRemoveItem: (id: number, quantity?: number) => void;
  onOpenModal: (product: Product) => void;
  isUpdating?: boolean;
}

export default function CartItemsTable({
  items,
  isB2b,
  currencyUsdRate,
  onUpdateQuantity,
  onSetQuantity,
  onRemoveItem,
  onOpenModal,
  isUpdating = false,
}: CartItemsTableProps) {
  const data = useMemo<CartTableRow[]>(() => {
    return items.map((item) => {
      const p = item.productId;
      const priceUsd = Number(p.price);
      const priceUah = Math.ceil(priceUsd * currencyUsdRate);
      const rrc = Number(p.priceRetailRecommendation);

      const totalCol = isB2b
        ? `${(priceUsd * item.quantity).toFixed(2)}$ | ${priceUah * item.quantity}грн`
        : `${Math.round(item.totalPrice).toLocaleString('uk-UA')} грн`;

      return {
        codeCol: p.article,
        nameCol: p.name,
        photoCol: p.image,
        priceCol: priceUsd,
        priceUahCol: priceUah,
        rrcCol: isB2b ? rrc : item.unitPrice,
        quantityCol: item.quantity,
        totalCol,
        id: p.id,
        product: p,
      };
    });
  }, [items, isB2b, currencyUsdRate]);

  const columns = useMemo<ColumnDef<CartTableRow>[]>(() => {
    const baseCols: ColumnDef<CartTableRow>[] = [
      {
        header: 'Артикль',
        accessorKey: 'codeCol',
      },
      {
        header: 'Назва',
        accessorKey: 'nameCol',
        cell: ({ row }) => (
          <button
            className="w-full min-w-[150px] text-left transition-colors hover:text-blue-500"
            onClick={() => onOpenModal(row.original.product)}
            type="button"
          >
            {row.original.nameCol}
          </button>
        ),
      },
      {
        header: 'Фото',
        accessorKey: 'photoCol',
        cell: ({ row }) => {
          const imgSrc = row.original.photoCol
            ? `${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`
            : '/placeholder.webp';

          return (
            <Image
              src={imgSrc}
              alt={row.original.nameCol || 'Зображення товару'}
              width={64}
              height={64}
              className="mx-auto block h-11 w-11 cursor-pointer object-contain transition-transform hover:scale-105 min-[1440px]:h-16 min-[1440px]:w-16"
              onMouseEnter={(e) => showImagePreview(e, imgSrc, row.original.nameCol)}
              onMouseOut={hideImagePreview}
            />
          );
        },
      },
    ];

    if (isB2b) {
      baseCols.push(
        {
          header: 'Ціна($)',
          accessorKey: 'priceCol',
        },
        {
          header: 'Ціна(грн)',
          accessorKey: 'priceUahCol',
        },
        {
          header: 'РРЦ(грн)',
          accessorKey: 'rrcCol',
          cell: ({ row }) => <div title="Рекомендована роздрібна ціна">{row.original.rrcCol}</div>,
        },
      );
    } else {
      baseCols.push({
        header: 'Ціна(грн)',
        accessorKey: 'rrcCol',
      });
    }

    baseCols.push(
      {
        header: 'Кількість',
        accessorKey: 'quantityCol',
        cell: ({ row }) => (
          <CartQuantityControl
            quantity={row.original.quantityCol}
            onIncrement={() => onUpdateQuantity(row.original.id, 'increment')}
            onDecrement={() => onUpdateQuantity(row.original.id, 'decrement')}
            onSetQuantity={(qty) => onSetQuantity?.(row.original.id, qty)}
            disabled={isUpdating}
            productName={row.original.nameCol}
          />
        ),
      },
      {
        header: () =>
          isB2b ? (
            <div className="flex items-center justify-center gap-1">
              <span>Сума($|грн)</span>
              <PricingTooltip />
            </div>
          ) : (
            <span>Сума</span>
          ),
        accessorKey: 'totalCol',
      },
      {
        header: '',
        id: 'deleteCol',
        cell: ({ row }) => (
          <button
            className="mx-auto flex cursor-pointer items-center justify-center text-neutral-400 transition-transform duration-200 hover:scale-110 hover:text-rose-500"
            onClick={() => onRemoveItem(row.original.id, row.original.quantityCol)}
            aria-label={`Видалити ${row.original.nameCol} з кошика`}
            type="button"
          >
            <Icon icon="delete" className="h-5 w-5 fill-current" />
          </button>
        ),
      },
    );

    return baseCols;
  }, [isB2b, onOpenModal, onUpdateQuantity, onSetQuantity, onRemoveItem, isUpdating]);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table columns={columns} data={data} />
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row) => {
          const imgSrc = row.photoCol
            ? `${process.env.NEXT_PUBLIC_API}${row.photoCol}`
            : '/placeholder.webp';

          return (
            <div
              key={row.id}
              className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-xs"
            >
              <div
                className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-neutral-50 p-1"
                onClick={() => onOpenModal(row.product)}
              >
                <Image
                  src={imgSrc}
                  alt={row.nameCol || 'Зображення товару'}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400">
                      АРТ: {row.codeCol}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenModal(row.product)}
                      className="line-clamp-2 text-left text-sm font-medium text-neutral-800 transition-colors hover:text-amber-600"
                    >
                      {row.nameCol}
                    </button>
                  </div>
                  <button
                    className="p-1 text-neutral-400 transition-colors hover:text-rose-500"
                    onClick={() => onRemoveItem(row.id, row.quantityCol)}
                    aria-label={`Видалити ${row.nameCol} з кошика`}
                    type="button"
                  >
                    <Icon icon="delete" className="h-5 w-5 fill-current" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <CartQuantityControl
                    quantity={row.quantityCol}
                    onIncrement={() => onUpdateQuantity(row.id, 'increment')}
                    onDecrement={() => onUpdateQuantity(row.id, 'decrement')}
                    onSetQuantity={(qty) => onSetQuantity?.(row.id, qty)}
                    disabled={isUpdating}
                    productName={row.nameCol}
                  />

                  <div className="text-right">
                    <span className="text-sm font-bold text-neutral-900">{row.totalCol}</span>
                    {row.quantityCol > 1 && (
                      <div className="text-[11px] text-neutral-500">
                        {isB2b ? `${row.priceUahCol} грн/шт` : `${row.rrcCol} грн/шт`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function showImagePreview(e: React.MouseEvent, src: string, alt: string) {
  const img = document.getElementById('image') as HTMLDivElement | null;
  if (!img) return;

  const imgTag = document.createElement('img');
  imgTag.src = src;
  imgTag.alt = alt || 'Зображення товару';
  img.replaceChildren(imgTag);
  img.style.top = `${e.clientY + 20}px`;
  img.style.left = `${e.clientX + 20}px`;
  img.classList.remove('hidden');
}

function hideImagePreview() {
  const img = document.getElementById('image') as HTMLDivElement | null;
  if (!img) return;

  img.replaceChildren();
  img.classList.add('hidden');
}
