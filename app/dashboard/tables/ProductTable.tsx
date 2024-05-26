'use client';

import Pagination from '@/app/ui/Pagination';
import Table from '@/app/ui/Table';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

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
        Header: 'Ціна ОПТ',
        accessor: 'priceBulkCol',
      },
      {
        Header: 'Наявність',
        accessor: 'availabilityCol',
      },
      {
        Header: 'Редагувати',
        accessor: 'editCol',
        Cell: ({ row }) => (
          <Link
            href={`/dashboard/product/edit/${row.values.editCol}`}
            className="flex justify-center"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              className="cursor-pointer fill-[#667085] transition-colors hover:fill-black"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 13C22 12.7348 22.1054 12.4804 22.2929 12.2929C22.4804 12.1054 22.7348 12 23 12C23.2652 12 23.5196 12.1054 23.7071 12.2929C23.8946 12.4804 24 12.7348 24 13V24C24 24.2652 23.8946 24.5196 23.7071 24.7071C23.5196 24.8947 23.2652 25 23 25H1C0.734784 25 0.48043 24.8947 0.292893 24.7071C0.105357 24.5196 0 24.2652 0 24V2.00001C0 1.7348 0.105357 1.48044 0.292893 1.29291C0.48043 1.10537 0.734784 1.00001 1 1.00001H12C12.2652 1.00001 12.5196 1.10537 12.7071 1.29291C12.8946 1.48044 13 1.7348 13 2.00001C13 2.26523 12.8946 2.51958 12.7071 2.70712C12.5196 2.89465 12.2652 3.00001 12 3.00001H2V23H22V13Z" />
              <path d="M10.686 14.32L12.336 14.084L22.472 3.95001C22.5675 3.85776 22.6437 3.74742 22.6961 3.62542C22.7485 3.50341 22.7761 3.37219 22.7773 3.23941C22.7784 3.10663 22.7531 2.97495 22.7028 2.85206C22.6525 2.72916 22.5783 2.61751 22.4844 2.52362C22.3905 2.42972 22.2789 2.35547 22.156 2.30519C22.0331 2.25491 21.9014 2.22961 21.7686 2.23076C21.6358 2.23192 21.5046 2.2595 21.3826 2.31191C21.2606 2.36432 21.1502 2.4405 21.058 2.53601L10.92 12.67L10.684 14.32H10.686ZM23.886 1.12001C24.1648 1.39861 24.3859 1.72942 24.5368 2.09352C24.6877 2.45762 24.7654 2.84788 24.7654 3.24201C24.7654 3.63614 24.6877 4.0264 24.5368 4.39051C24.3859 4.75461 24.1648 5.08541 23.886 5.36401L13.516 15.734C13.3631 15.8875 13.1645 15.9872 12.95 16.018L9.65 16.49C9.49621 16.5121 9.33938 16.498 9.19197 16.449C9.04455 16.3999 8.9106 16.3171 8.80074 16.2073C8.69087 16.0974 8.60812 15.9635 8.55904 15.816C8.50997 15.6686 8.49591 15.5118 8.518 15.358L8.99 12.058C9.0203 11.8438 9.11925 11.6452 9.272 11.492L19.644 1.12201C20.2066 0.559599 20.9695 0.243652 21.765 0.243652C22.5605 0.243652 23.3234 0.559599 23.886 1.12201V1.12001Z" />
            </svg>
          </Link>
        ),
      },
    ],
    [],
  );

  const data = useMemo(() => {
    return products.map((product) => ({
      articleCol: product.article,
      nameCol: product.name,
      categoryCol: product.category.name,
      priceCol: product.price,
      priceBulkCol: product.priceBulk,
      availabilityCol: product.countInStock,
      editCol: product._id,
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
