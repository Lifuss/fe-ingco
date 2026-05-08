'use client';

import Table from '@/app/ui/Table';
import {
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from '../../../lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import Modal from 'react-modal';
import { customModalStyles } from '../../ui/modals/CategoryModal';
import CategoryForm from '../../ui/forms/CategoryForm';
import { toast } from 'react-toastify';
import Icon from '@/app/ui/assets/Icon';

type CategoryTableRow = {
  nameCol: string;
  productsCountCol: number;
  editCol: number;
  deleteCol: number;
  renderSortCol: number;
};

const CategoryTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    renderSort: number;
  }>({ name: '', renderSort: 0 });
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const productsCategories = useAppSelector((state) => state.persistedMainReducer.categories);

  const openModal = (name: string, id: number, renderSort: number) => {
    setSelectedId(id);
    setSelectedCategory({ name, renderSort });
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchCategoriesThunk(query));
  }, [dispatch, query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const renderSortInput = form.elements.namedItem('renderSort') as HTMLInputElement;

    if (nameInput && renderSortInput) {
      const name = nameInput.value.trim();
      const renderSort = Number(renderSortInput.value.trim());

      dispatch(updateCategoryThunk({ id: selectedId, name, renderSort }))
        .unwrap()
        .then(() => closeModal())
        .catch(
          (err) => err.response.status === 409 && toast.error('Категорія з такою назвою вже існує'),
        );
    }
  };

  const data = useMemo<CategoryTableRow[]>(
    () =>
      productsCategories?.map((category) => ({
        nameCol: category.name,
        productsCountCol: category.count,
        editCol: category.id,
        deleteCol: category.id,
        renderSortCol: category.renderSort,
      })),
    [productsCategories],
  );

  const columns = useMemo<ColumnDef<CategoryTableRow>[]>(
    () => [
      {
        header: 'Найменування',
        accessorKey: 'nameCol',
      },
      {
        header: 'Кількість товарів',
        accessorKey: 'productsCountCol',
      },
      {
        header: 'Сортування',
        accessorKey: 'renderSortCol',
      },
      {
        header: 'Редагувати',
        accessorKey: 'editCol',
        cell: ({ row }) => (
          <button
            className="flex w-full justify-center"
            onClick={() =>
              openModal(row.original.nameCol, row.original.editCol, row.original.renderSortCol)
            }
          >
            <Icon
              icon="edit"
              className="fill-inactive h-[25px] w-[25px] cursor-pointer transition-colors hover:fill-black"
            />
          </button>
        ),
      },
      {
        header: 'Видалити',
        accessorKey: 'deleteCol',
        cell: ({ row }) => (
          <button
            className="flex w-full justify-center"
            onClick={() => dispatch(deleteCategoryThunk(row.original.deleteCol))}
          >
            <Icon
              icon="delete"
              className="fill-inactive h-[28px] w-[27px] cursor-pointer transition-colors hover:fill-black"
            />
          </button>
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
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <CategoryForm handleSubmit={handleSubmit} defaultValue={selectedCategory} />
      </Modal>
      {/* <div className="mx-auto mt-5 w-fit">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
};

export default CategoryTable;
