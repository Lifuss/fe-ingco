'use client';

import Icon from '@/app/ui/assets/Icon';
import { sortValueType } from '@/app/ui/FiltersBlock';
import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { deleteProductThunk, fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';

type ProductTableRow = {
  articleCol: string;
  nameCol: string;
  categoryCol: string | undefined;
  priceCol: number;
  rrcCol: string;
  availabilityCol: number;
  editCol: number;
  sortCol: number;
};

const ProductTable = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { products, totalPages } = useAppSelector((state) => state.persistedMainReducer);

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const sortValue: sortValueType = (searchParams.get('sortValue') as sortValueType) || 'default';

  useEffect(() => {
    dispatch(
      fetchMainTableDataThunk({
        page,
        query,
        category,
        limit: 20,
        isRetail: false,
        sortValue,
      }),
    );
  }, [dispatch, page, query, category, sortValue]);

  const data = useMemo<ProductTableRow[]>(() => {
    return products.map((product) => ({
      articleCol: product.article,
      nameCol: product.name,
      categoryCol: product.category?.name,
      priceCol: product.price,
      rrcCol: product.rrcSale
        ? product.priceRetailRecommendation + '|' + product.rrcSale
        : product.priceRetailRecommendation.toString(),
      availabilityCol: product.countInStock,
      editCol: product.id,
      sortCol: product.sort,
    }));
  }, [products]);

  const columns = useMemo<ColumnDef<ProductTableRow>[]>(
    () => [
      {
        header: 'Артикль',
        accessorKey: 'articleCol',
      },
      {
        header: 'Найменування',
        accessorKey: 'nameCol',
      },
      {
        header: 'Категорія',
        accessorKey: 'categoryCol',
      },
      {
        header: 'Ціна',
        accessorKey: 'priceCol',
      },
      {
        header: 'РРЦ',
        accessorKey: 'rrcCol',
      },
      {
        header: 'Наявність',
        accessorKey: 'availabilityCol',
      },
      {
        header: 'Сортування',
        accessorKey: 'sortCol',
      },
      {
        header: 'Ред|Вид',
        accessorKey: 'editCol',
        cell: ({ row }) => (
          <div className="flex justify-center gap-4">
            <Link
              href={`/dashboard/product/edit/${row.original.editCol}`}
              className="flex justify-center"
            >
              <Icon
                icon="edit"
                className="fill-inactive h-[25px] w-[25px] cursor-pointer transition-colors hover:fill-black"
              />
            </Link>
            <button
              onClick={() => {
                const productName = row.original.nameCol as string;
                if (confirm(`Ви впевнені, що хочете видалити "${productName}"?`)) {
                  dispatch(deleteProductThunk(row.original.editCol));
                }
              }}
            >
              <Icon
                icon="delete"
                className="fill-inactive h-[28px] w-[27px] cursor-pointer transition-colors hover:fill-black"
              />
            </button>
          </div>
        ),
      },
    ],
    [dispatch],
  );

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
