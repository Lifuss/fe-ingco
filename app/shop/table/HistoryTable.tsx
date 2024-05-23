'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchHistoryThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { CellProps, Row } from 'react-table';

const HistoryTable = () => {
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
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: 'Номер замовлення',
        accessor: 'orderCodeCol',
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
      })),
    [history],
  );
  return history.length ? (
    <>
      <Table columns={columns} data={data} />
      <div className="mx-auto mt-5 w-[43%] pb-10">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  ) : (
    <h2 className="text-center text-3xl">
      Ви ще нічого не замовили, тут з&apos;явиться майбутні ваші замовлення
    </h2>
  );
};

export default HistoryTable;
