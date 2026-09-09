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
  onRemoveItem: (id: number, quantity?: number) => void;
  onOpenModal: (product: Product) => void;
  isUpdating?: boolean;
}

export default function CartItemsTable({
  items,
  isB2b,
  currencyUsdRate,
  onUpdateQuantity,
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
  }, [isB2b, onOpenModal, onUpdateQuantity, onRemoveItem, isUpdating]);

  return <Table columns={columns} data={data} />;
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
