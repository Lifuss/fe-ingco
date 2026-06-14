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
import { Category } from '@/lib/types';
import CategorySortView from './CategorySortView';

type CategoryTableRow = {
  id: number;
  nameCol: string;
  productsCountCol: number;
  editCol: number;
  deleteCol: number;
  renderSortCol: number;
  depthCol: number;
  parentIdCol: number | null;
  showInMenuCol: boolean;
};

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function getSortedHierarchy(categories: Category[]): (Category & { depth: number })[] {
  if (!categories || categories.length === 0) return [];

  const map = new Map<number, CategoryNode>();
  categories.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  const roots: CategoryNode[] = [];
  categories.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.renderSort - b.renderSort);
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  const flatten = (nodes: CategoryNode[], depth = 0): (Category & { depth: number })[] => {
    const result: (Category & { depth: number })[] = [];
    nodes.forEach((node) => {
      const { children, ...rest } = node;
      result.push({ ...rest, depth });
      result.push(...flatten(children, depth + 1));
    });
    return result;
  };

  return flatten(roots);
}

const CategoryTable = () => {
  const [viewMode, setViewMode] = useState<'table' | 'sort'>('table');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    id?: number;
    name: string;
    renderSort: number;
    parentId?: number | null;
    showInMenu?: boolean;
  }>({ name: '', renderSort: 0, showInMenu: true });
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const productsCategories = useAppSelector((state) => state.persistedMainReducer.categories);

  const openModal = (
    id: number,
    name: string,
    renderSort: number,
    parentId: number | null,
    showInMenu: boolean,
  ) => {
    setSelectedId(id);
    setSelectedCategory({ id, name, renderSort, parentId, showInMenu });
    setSelectedAttributeIds([]);

    // Fetch linked attributes for this category
    fetch(`${process.env.NEXT_PUBLIC_API}/api/categories/${id}/attributes`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSelectedAttributeIds(data.map((a: any) => a.id));
        }
      })
      .catch((err) => console.error('Failed to fetch category attributes:', err));

    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedAttributeIds([]);
  };

  const query = searchParams.get('query') || '';

  useEffect(() => {
    dispatch(fetchCategoriesThunk(query));
  }, [dispatch, query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const parentIdSelect = form.elements.namedItem('parentId') as HTMLSelectElement;
    const showInMenuInput = form.elements.namedItem('showInMenu') as HTMLInputElement;

    if (nameInput) {
      const name = nameInput.value.trim();
      const parentId = parentIdSelect && parentIdSelect.value ? Number(parentIdSelect.value) : null;
      const showInMenu = showInMenuInput ? showInMenuInput.checked : true;

      dispatch(updateCategoryThunk({ id: selectedId, name, parentId, showInMenu, attributeIds: selectedAttributeIds }))
        .unwrap()
        .then(() => closeModal())
        .catch(
          (err) =>
            (err?.status === 409 || err?.response?.status === 409) &&
            toast.error('Категорія з такою назвою вже існує'),
        );
    }
  };

  const sortedCategories = useMemo(
    () => getSortedHierarchy(productsCategories || []),
    [productsCategories],
  );

  const data = useMemo<CategoryTableRow[]>(
    () =>
      sortedCategories.map((category) => ({
        id: category.id,
        nameCol: category.name,
        productsCountCol: category.count,
        editCol: category.id,
        deleteCol: category.id,
        renderSortCol: category.renderSort,
        depthCol: category.depth,
        parentIdCol: category.parentId ?? null,
        showInMenuCol: category.showInMenu,
      })),
    [sortedCategories],
  );

  const columns = useMemo<ColumnDef<CategoryTableRow>[]>(
    () => [
      {
        header: 'Найменування',
        accessorKey: 'nameCol',
        cell: ({ row }) => {
          const depth = row.original.depthCol;
          return (
            <div
              style={{ paddingLeft: `${depth * 24}px` }}
              className="flex items-center gap-1.5 text-left"
            >
              {depth > 0 && <span className="font-mono text-neutral-400">└─</span>}
              <span
                className={
                  depth === 0 ? 'font-bold text-neutral-900' : 'font-medium text-neutral-600'
                }
              >
                {row.original.nameCol}
              </span>
            </div>
          );
        },
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
        header: 'Меню',
        accessorKey: 'showInMenuCol',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${row.original.showInMenuCol ? 'border border-green-100 bg-green-50 text-green-600' : 'border border-orange-100 bg-orange-50 text-orange-600'}`}
            >
              {row.original.showInMenuCol ? 'Так' : 'Ні'}
            </span>
          </div>
        ),
      },
      {
        header: 'Редагувати',
        accessorKey: 'editCol',
        cell: ({ row }) => (
          <button
            className="flex w-full justify-center"
            onClick={() =>
              openModal(
                row.original.editCol,
                row.original.nameCol,
                row.original.renderSortCol,
                row.original.parentIdCol,
                row.original.showInMenuCol,
              )
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
    <div className="flex w-full flex-col gap-6 font-sans">
      {/* View Mode Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setViewMode('table')}
          className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-bold transition-all ${
            viewMode === 'table'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Список категорій
        </button>
        <button
          onClick={() => setViewMode('sort')}
          className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-bold transition-all ${
            viewMode === 'sort'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Сортування (Drag & Drop)
        </button>
      </div>

      {viewMode === 'table' ? (
        <Table
          columns={columns}
          data={data}
          headerColor="bg-blue-200"
          borderColor="border-gray-400"
        />
      ) : (
        <CategorySortView />
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <CategoryForm
          handleSubmit={handleSubmit}
          defaultValue={selectedCategory}
          selectedAttributeIds={selectedAttributeIds}
          setSelectedAttributeIds={setSelectedAttributeIds}
        />
      </Modal>
    </div>
  );
};

export default CategoryTable;
