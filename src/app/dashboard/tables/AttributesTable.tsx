'use no memo';
'use client';


import { useEffect, useMemo, useState, useCallback } from 'react';
import Table from '@/app/ui/Table';
import { type ColumnDef } from '@tanstack/react-table';
import { apiIngco } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import Icon from '@/app/ui/assets/Icon';
import { AttributeModalEdit } from '@/app/ui/modals/AttributeModal';
import { ProductAttribute } from '@/lib/types';

type AttributeTableRow = {
  id: number;
  codeCol: string;
  nameCol: string;
  unitCol: string;
  optionsCol: string[];
  editCol: number;
  deleteCol: number;
};

interface AttributesTableProps {
  refreshTrigger: number;
  onRefresh: () => void;
  query?: string;
}

const AttributesTable = ({ refreshTrigger, onRefresh, query = '' }: AttributesTableProps) => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);

  const fetchAttributes = useCallback(() => {
    Promise.resolve().then(() => setLoading(true));
    apiIngco
      .get('/attributes')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAttributes(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch attributes:', err);
        toast.error('Не вдалося завантажити список характеристик');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAttributes();
  }, [refreshTrigger, fetchAttributes]);

  const handleDelete = useCallback(
    (id: number, name: string) => {
      if (confirm(`Ви дійсно хочете видалити характеристику "${name}"?`)) {
        apiIngco
          .delete(`/attributes/${id}`)
          .then(() => {
            toast.success(`Характеристику "${name}" видалено`);
            onRefresh();
          })
          .catch((err) => {
            const msg = err.response?.data?.message || 'Помилка видалення характеристики';
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
          });
      }
    },
    [onRefresh],
  );

  const openEditModal = useCallback((attr: ProductAttribute) => {
    setSelectedAttribute(attr);
    setIsEditOpen(true);
  }, []);

  const data = useMemo<AttributeTableRow[]>(
    () =>
      attributes
        .filter((attr) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return attr.name.toLowerCase().includes(q) || attr.code.toLowerCase().includes(q);
        })
        .map((attr) => ({
          id: attr.id,
          codeCol: attr.code,
          nameCol: attr.name,
          unitCol: attr.unit || '—',
          optionsCol: attr.options || [],
          editCol: attr.id,
          deleteCol: attr.id,
        })),
    [attributes, query],
  );

  const columns = useMemo<ColumnDef<AttributeTableRow>[]>(
    () => [
      {
        header: 'Код (slug)',
        accessorKey: 'codeCol',
        cell: ({ row }) => (
          <div className="w-fit rounded border border-neutral-200/60 bg-neutral-50 px-2 py-1 font-mono text-xs font-bold text-neutral-600">
            {row.original.codeCol}
          </div>
        ),
      },
      {
        header: 'Назва характеристики',
        accessorKey: 'nameCol',
        cell: ({ row }) => (
          <span className="font-semibold text-neutral-900">{row.original.nameCol}</span>
        ),
      },
      {
        header: 'Одиниці',
        accessorKey: 'unitCol',
        cell: ({ row }) => (
          <span className="font-bold text-neutral-500">{row.original.unitCol}</span>
        ),
      },
      {
        header: 'Варіанти значень',
        accessorKey: 'optionsCol',
        cell: ({ row }) => {
          const opts = row.original.optionsCol;
          if (opts.length === 0)
            return <span className="text-xs text-neutral-400 italic">Текстове поле</span>;
          return (
            <div className="flex max-w-[320px] flex-wrap gap-1">
              {opts.slice(0, 3).map((o) => (
                <span
                  key={o}
                  className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700"
                >
                  {o}
                </span>
              ))}
              {opts.length > 3 && (
                <span className="self-center px-1 text-[10px] font-bold text-neutral-400">
                  +{opts.length - 3}
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: 'Редагувати',
        accessorKey: 'editCol',
        cell: ({ row }) => {
          const rawAttr = attributes.find((a) => a.id === row.original.editCol);
          return (
            <button
              className="flex w-full cursor-pointer justify-center select-none"
              onClick={() => rawAttr && openEditModal(rawAttr)}
            >
              <Icon
                icon="edit"
                className="fill-inactive h-[25px] w-[25px] cursor-pointer transition-colors hover:fill-black"
              />
            </button>
          );
        },
      },
      {
        header: 'Видалити',
        accessorKey: 'deleteCol',
        cell: ({ row }) => (
          <button
            className="flex w-full cursor-pointer justify-center select-none"
            onClick={() => handleDelete(row.original.deleteCol, row.original.nameCol)}
          >
            <Icon
              icon="delete"
              className="fill-inactive h-[28px] w-[27px] cursor-pointer transition-colors hover:fill-black"
            />
          </button>
        ),
      },
    ],
    [attributes, handleDelete, openEditModal],
  );

  if (loading && attributes.length === 0) {
    return (
      <div className="py-10 text-center font-bold text-gray-500">Завантаження характеристик...</div>
    );
  }

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={data}
        headerColor="bg-blue-200"
        borderColor="border-gray-400"
      />
      <AttributeModalEdit
        isOpen={isEditOpen}
        closeModal={() => setIsEditOpen(false)}
        defaultValue={selectedAttribute}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default AttributesTable;
