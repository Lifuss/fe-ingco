'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchOrdersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import AdminOrderModal from '@/app/ui/modals/AdminOrderModal';
import { Order } from '@/lib/types';
import clsx from 'clsx';

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
  const [selectedOrder, setSelectedOrder] = useState<Order | any>();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { orders, totalPages } = useAppSelector(
    (state) => state.dashboardSlice,
  );
  const usdRate = useAppSelector(
    (state) => state.persistedMainReducer.currencyRates.USD,
  );

  const openModal = (id: string) => {
    const order = orders.find((order) => order.orderCode === id);
    setSelectedOrder(order);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;
  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchOrdersThunk({ page, query, limit: 20, isRetail }));
  }, [dispatch, page, query, isRetail]);

  const handleRowClick = (data: { numberCol: string }) => {
    openModal(data.numberCol);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Номер',
        accessor: 'numberCol',
      },
      {
        Header: 'Дата',
        accessor: 'dateCol',
      },
      {
        Header: 'Логін',
        accessor: 'loginCol',
      },
      {
        Header: 'Статус',
        accessor: 'statusCol',
      },
      {
        Header: 'Коментар',
        accessor: 'commentCol',
        Cell: ({ row }: { row: Row }) => (
          <div>{row.values.commentCol ? '✅' : '❌'}</div>
        ),
      },
      {
        Header: 'Сума зам. грн',
        accessor: 'totalPrice',
      },
    ],
    [],
  );

  const data = useMemo(() => {
    return orders.map((order) => ({
      numberCol: order.orderCode,
      dateCol: new Date(order.createdAt).toLocaleDateString(),
      loginCol: 'login' in order.user ? order.user.login : order.user.email,
      statusCol: order.status,
      commentCol: order.comment,
      totalPrice: !isRetail
        ? Math.ceil(order.totalPrice * usdRate)
        : order.totalPrice,
    }));
  }, [orders, usdRate, isRetail]);

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

  return (
    <div>
      <div className="flex gap-4">
        <label className={clsx('mb-2 flex w-fit items-center gap-2')}>
          <select
            className="rounded-xl bg-gray-200 p-2"
            // @ts-ignore
            onChange={(e) => handleCheckboxChange(e.currentTarget.value)}
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
