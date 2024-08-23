'use client';

import Icon from '@/app/ui/assets/Icon';
import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import {
  deleteProductThunk,
  fetchMainTableDataThunk,
} from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Row } from 'react-table';

const ProductTable = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { products, totalPages } = useAppSelector(
    (state) => state.persistedMainReducer,
  );

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let category = searchParams.get('category') || '';

  useEffect(() => {
    dispatch(fetchMainTableDataThunk({ page, query, category, limit: 20 }));
  }, [dispatch, page, query, category]);

  const columns = useMemo(
    () => [
      {
        Header: 'Артикль',
        accessor: 'articleCol',
      },
      {
        Header: 'Найменування',
        accessor: 'nameCol',
      },
      {
        Header: 'Категорія',
        accessor: 'categoryCol',
      },
      {
        Header: 'Ціна',
        accessor: 'priceCol',
      },
      {
        Header: 'РРЦ',
        accessor: 'rrcCol',
      },
      {
        Header: 'Наявність',
        accessor: 'availabilityCol',
      },
      {
        Header: 'Сортування',
        accessor: 'sortCol',
      },
      {
        Header: 'Ред|Вид',
        accessor: 'editCol',
        Cell: ({ row }: { row: Row }) => (
          <div className="flex justify-center gap-4">
            <Link
              href={`/dashboard/product/edit/${row.values.editCol}`}
              className="flex justify-center"
            >
              <Icon
                icon="edit"
                className="h-[25px] w-[25px] cursor-pointer fill-[#667085] transition-colors hover:fill-black"
              />
            </Link>
            <button
              onClick={() => {
                dispatch(deleteProductThunk(row.values.editCol));
              }}
            >
              <Icon
                icon="delete"
                className="h-[28px] w-[27px] cursor-pointer fill-[#667085] transition-colors
            hover:fill-black"
              />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const data = useMemo(() => {
    return products.map((product) => ({
      articleCol: product.article,
      nameCol: product.name,
      categoryCol: product.category?.name,
      priceCol: product.price,
      rrcCol: product.rrcSale
        ? product.priceRetailRecommendation + '|' + product.rrcSale
        : product.priceRetailRecommendation,
      availabilityCol: product.countInStock,
      editCol: product._id,
      sortCol: product.sort,
    }));
  }, [products]);

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

export default ProductTable;
