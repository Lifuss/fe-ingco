'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchOrdersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import AdminOrderModal from '@/app/ui/modals/AdminOrderModal';
import { Order, OrderStatusEnum } from '@/lib/types';
import { fetchCurrencyRatesThunk } from '@/lib/appState/main/operations';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { Button } from '@/app/ui/buttons/button';
import OrderStats from '../orders/OrderStats';
import clsx from 'clsx';

type OrderTableRow = {
  numberCol: string;
  dateCol: string;
  loginCol: string;
  statusCol: string;
  commentCol: string;
  totalPrice: number;
};

export const orderStatusEnum = [
  'всі',
  'очікує підтвердження',
  'очікує оплати',
  'комплектується',
  'відправлено',
  'замовлення виконано',
  'замовлення скасовано',
] as const;

const OrderTable = ({ isRetail = false }: { isRetail: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { orders, totalPages } = useAppSelector(
    (state) => state.dashboardSlice,
  );
  const usdRate = useAppSelector(selectUSDRate);

  const openModal = (id: string) => {
    const order = orders.find((order) => order.orderCode === id) ?? null;
    setSelectedOrder(order);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;
  const query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchOrdersThunk({ page, query, limit: 20, isRetail }));
  }, [dispatch, page, query, isRetail]);

  const handleRowClick = (targetRow: OrderTableRow) => {
    openModal(targetRow.numberCol);
  };

  const data = useMemo<OrderTableRow[]>(() => {
    const statusEmoji = {
      [OrderStatusEnum.OrderCompleted]: '✅',
      [OrderStatusEnum.OrderCancelled]: '❌',
      [OrderStatusEnum.PendingConfirmation]: '⏳',
      [OrderStatusEnum.PendingPayment]: '💰',
      [OrderStatusEnum.BeingCompiled]: '🔄',
      [OrderStatusEnum.Shipped]: '🚚',
    };

    return orders.map((order) => ({
      numberCol: order.orderCode,
      dateCol: new Date(order.createdAt).toLocaleDateString('uk-UA'),
      loginCol: 'login' in order.user ? order.user.login : order.user.email,
      statusCol: `${order.status} ${statusEmoji[order.status]}`,
      commentCol: order.comment,
      totalPrice: !isRetail
        ? Math.ceil(order.totalPrice * usdRate)
        : order.totalPrice,
    }));
  }, [orders, usdRate, isRetail]);

  const columns = useMemo<ColumnDef<OrderTableRow>[]>(() => [
    {
      header: 'Номер',
      accessorKey: 'numberCol',
    },
    {
      header: 'Дата',
      accessorKey: 'dateCol',
    },
    {
      header: 'Логін',
      accessorKey: 'loginCol',
    },
    {
      header: 'Статус',
      accessorKey: 'statusCol',
    },
    {
      header: 'Коментар',
      accessorKey: 'commentCol',
      cell: ({ row }) => <div>{row.original.commentCol ? 'так' : 'немає'}</div>,
    },
    {
      header: 'Сума зам. грн',
      accessorKey: 'totalPrice',
    },
  ], []);

  const handleCheckboxChange = (
    status:
      | 'всі'
      | 'очікує підтвердження'
      | 'очікує оплати'
      | 'комплектується'
      | 'відправлено'
      | 'замовлення виконано'
      | 'замовлення скасовано',
  ) => {
    dispatch(
      fetchOrdersThunk({
        page: 1,
        query,
        status,
        limit: 20,
        isRetail,
      }),
    );
  };

  const dataToStats = useMemo((): Record<OrderStatusEnum, number> => {
    const stats: Record<OrderStatusEnum, number> = {
      [OrderStatusEnum.BeingCompiled]: 0,
      [OrderStatusEnum.PendingPayment]: 0,
      [OrderStatusEnum.PendingConfirmation]: 0,
      [OrderStatusEnum.Shipped]: 0,
      [OrderStatusEnum.OrderCompleted]: 0,
      [OrderStatusEnum.OrderCancelled]: 0,
    };
    orders.forEach((order) => {
      stats[order.status] = (stats[order.status] || 0) + 1;
    });
    return stats;
  }, [orders]);

  if (usdRate === 41.0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl">Використовується резервний курс валюти</h2>
        <p className="text-gray-600">USD: {usdRate} (резервний курс)</p>
        <Button
          className="text-white"
          onClick={() => {
            dispatch(fetchCurrencyRatesThunk());
          }}
        >
          Спробувати оновити курс
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4">
        <OrderStats dataToStats={dataToStats} />
        <label className={clsx('flex w-fit items-center gap-2')}>
          <select
            className="rounded-xl bg-gray-200 p-2"
            onChange={(e) =>
              handleCheckboxChange(e.currentTarget.value as OrderStatusEnum)
            }
          >
            {orderStatusEnum.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
        rowClickable={true}
        rowFunction={handleRowClick}
      />
      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
      <AdminOrderModal
        closeModal={closeModal}
        isOpen={isOpen}
        order={selectedOrder}
        isRetail={isRetail}
      />
    </div>
  );
};

export default OrderTable;
