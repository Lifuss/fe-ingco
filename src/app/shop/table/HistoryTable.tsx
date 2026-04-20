'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import OrderModal from '@/app/ui/modals/OrderModal';
import { fetchHistoryThunk } from '@/lib/appState/main/operations';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Order } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Column } from 'react-table';

type HistoryTableProps = {
  isRetail?: boolean;
};

type HistoryTableRow = {
  orderCodeCol: string;
  createdAtCol: string;
  totalPriceCol: number;
  statusCol: Order['status'];
  declarationNumberCol: string;
  order: Order;
};

const HistoryTable = ({ isRetail = false }: HistoryTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const openModal = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  }, []);
  const dispatch = useAppDispatch();
  const { history, totalPages } = useAppSelector(
    (state) => state.persistedMainReducer,
  );
  const usdCurrency = useAppSelector(selectUSDRate);
  const searchParams = useSearchParams();

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchHistoryThunk({ page, q: query, isRetail }));
  }, [dispatch, page, query, isRetail]);

  const columns = useMemo<Column<HistoryTableRow>[]>(
    () => [
      {
        Header: 'Номер замовлення',
        accessor: 'orderCodeCol',
        Cell: ({ row }) => (
          <button
            onClick={() => openModal(row.original.order)}
            className="w-full transition-colors hover:text-blue-500"
          >
            {row.values.orderCodeCol}
          </button>
        ),
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
        Cell: ({ row }) => {
          return row.values.declarationNumberCol
            ? row.values.declarationNumberCol
            : '—';
        },
      },
    ],
    [openModal],
  );

  const data = useMemo<HistoryTableRow[]>(() => {
    return history.map((item) => ({
      orderCodeCol: item.orderCode,
      createdAtCol: new Date(item.createdAt).toLocaleDateString('uk-UA'),
      totalPriceCol: !isRetail
        ? Math.ceil(item.totalPrice * usdCurrency)
        : item.totalPrice,
      statusCol: item.status,
      declarationNumberCol: item.declarationNumber,
      order: item,
    }));
  }, [history, usdCurrency, isRetail]);

  return history.length ? (
    <>
      <Table columns={columns} data={data} />
      <div className="mx-auto mt-5 w-[43%] pb-10">
        <Pagination totalPages={totalPages} />
      </div>
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        closeModal={closeModal}
        isRetail={isRetail}
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
