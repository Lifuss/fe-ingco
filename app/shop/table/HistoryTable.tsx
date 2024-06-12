'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import OrderModal from '@/app/ui/modals/OrderModal';
import { fetchHistoryThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';

const HistoryTable = ({ isRetail = false }: { isRetail: boolean }) => {
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
    dispatch(fetchHistoryThunk({ page, q: query, isRetail }));
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
        Header: 'Номер декларації НП',
        accessor: 'declarationNumberCol',
        Cell: ({ row }: { row: Row }) => {
          return row.values.declarationNumberCol
            ? row.values.declarationNumberCol
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
        totalPriceCol: Math.ceil(item.totalPrice * usdCurrency),
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
    <div className="pt-10">
      <TextPlaceholder
        title="Історія порожня"
        text="Історія порожня, здійсніть замовлення"
        titleSize="4xl"
        textSize="xl"
      />
    </div>
  );
};

export default HistoryTable;
