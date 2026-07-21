'use no memo';
'use client';

import Icon from '@/app/ui/assets/Icon';
import { sortValueType } from '@/app/ui/catalog/FiltersBlock';
import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { deleteProductThunk, fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import ConfirmModal from '@/app/ui/modals/ConfirmModal';

type ProductTableRow = {
  articleCol: string;
  nameCol: string;
  categoryCol: string | undefined;
  priceCol: number;
  rrcCol: string;
  availabilityCol: number;
  editCol: number;
};

const ProductTable = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { products, totalPages } = useAppSelector((state) => state.persistedMainReducer);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProductThunk(productToDelete.id));
      setProductToDelete(null);
    }
  };

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
    }));
  }, [products]);

  const columns = useMemo<ColumnDef<ProductTableRow>[]>(
    () => [
      {
        header: 'Артикль',
        accessorKey: 'articleCol',
        cell: ({ row }) => (
          <Link
            href={`/dashboard/product/edit/${row.original.editCol}`}
            className="block w-full text-left transition-colors hover:text-blue-500"
          >
            {row.original.articleCol}
          </Link>
        ),
      },
      {
        header: 'Найменування',
        accessorKey: 'nameCol',
        cell: ({ row }) => (
          <Link
            href={`/dashboard/product/edit/${row.original.editCol}`}
            className="block w-full text-left transition-colors hover:text-blue-500"
          >
            {row.original.nameCol}
          </Link>
        ),
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
        header: 'Вид',
        accessorKey: 'editCol',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setProductToDelete({ id: row.original.editCol, name: row.original.nameCol });
                setIsConfirmOpen(true);
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
    [],
  );

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
        scrollTrigger={page}
      />
      <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Видалення товару"
        message={`Ви впевнені, що хочете видалити товар "${productToDelete?.name}"?`}
        confirmText="Видалити"
        cancelText="Скасувати"
        type="danger"
      />
    </div>
  );
};

export default ProductTable;
