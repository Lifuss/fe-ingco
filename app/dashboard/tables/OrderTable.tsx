'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchOrdersThunk } from '@/lib/appState/dashboard/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Row } from 'react-table';

const OrderTable = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { orders, totalPages } = useAppSelector(
    (state) => state.dashboardSlice,
  );

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchOrdersThunk({ page, query, limit: 20 }));
  }, [dispatch, page, query]);

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
    ],
    [],
  );

  const data = useMemo(() => {
    return orders.map((order) => ({
      numberCol: order.orderCode,
      dateCol: order.createdAt,
      loginCol: order.user.login,
      statusCol: order.status,
      commentCol: order.comment,
    }));
  }, [orders]);

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
      />
      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default OrderTable;
