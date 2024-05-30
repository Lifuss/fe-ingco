'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import OrderModal from '@/app/ui/modals/OrderModal';
import { fetchHistoryThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const HistoryTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };
  const dispatch = useAppDispatch();
  const {
    history,
    currencyRates: { USD: usdCurrency },
    totalPages,
  } = useAppSelector((state) => state.persistedMainReducer);
  const searchParams = useSearchParams();

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchHistoryThunk({ page, q: query }));
  }, [dispatch, page, query]);

  const columns = useMemo(
    () => [
      {
        Header: 'Номер замовлення',
        accessor: 'orderCodeCol',
        Cell: ({ row }: { row: any }) => {
          return (
            <button
              onClick={() => openModal(row.original.order)}
              className="w-full transition-colors hover:text-blue-500"
            >
              {row.values.orderCodeCol}
            </button>
          );
        },
      },
      {
        Header: 'Дата',
        accessor: 'createdAtCol',
      },
      {
        Header: 'Сума грн',
        accessor: 'totalPriceCol',
      },
      {
        Header: 'Статус',
        accessor: 'statusCol',
      },
      {
        Header: 'Номер декларації',
        accessor: 'declarationNumberCol',
        Cell: ({ row }: any) => {
          return row.original.declarationNumber
            ? row.original.declarationNumber
            : '—';
        },
      },
    ],
    [],
  );
  const data = useMemo(
    () =>
      history.map((item) => ({
        orderCodeCol: item.orderCode,
        createdAtCol: new Date(item.createdAt).toLocaleDateString(),
        totalPriceCol: item.totalPrice * usdCurrency,
        statusCol: item.status,
        declarationNumberCol: item.declarationNumber,
        order: item,
      })),
    [history, usdCurrency],
  );
  return history.length ? (
    <>
      <Table columns={columns} data={data} />
      <div className="mx-auto mt-5 w-[43%] pb-10">
        <Pagination totalPages={totalPages} />
      </div>
      <OrderModal
        order={selectedOrder as Order}
        isOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  ) : (
    <h2 className="text-center text-3xl">
      Ви ще нічого не замовили, тут з&apos;явиться майбутні ваші замовлення
    </h2>
  );
};

export default HistoryTable;
