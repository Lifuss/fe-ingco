'use client';

import { useEffect, useMemo, useState } from 'react';
import Table from '@/app/ui/Table';
import { type ColumnDef } from '@tanstack/react-table';
import { apiIngco } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import Icon from '@/app/ui/assets/Icon';
import { AttributeModalEdit } from '@/app/ui/modals/AttributeModal';

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
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);

  const fetchAttributes = () => {
    setLoading(true);
    apiIngco.get('/attributes')
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
  };

  useEffect(() => {
    fetchAttributes();
  }, [refreshTrigger]);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Ви дійсно хочете видалити характеристику "${name}"?`)) {
      apiIngco.delete(`/attributes/${id}`)
        .then(() => {
          toast.success(`Характеристику "${name}" видалено`);
          onRefresh();
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Помилка видалення характеристики';
          toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        });
    }
  };

  const openEditModal = (attr: any) => {
    setSelectedAttribute(attr);
    setIsEditOpen(true);
  };

  const data = useMemo<AttributeTableRow[]>(
    () =>
      attributes
        .filter((attr) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (
            attr.name.toLowerCase().includes(q) ||
            attr.code.toLowerCase().includes(q)
          );
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
          <div className="font-mono text-xs font-bold text-neutral-600 bg-neutral-50 px-2 py-1 rounded border border-neutral-200/60 w-fit">
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
          if (opts.length === 0) return <span className="text-neutral-400 italic text-xs">Текстове поле</span>;
          return (
            <div className="flex flex-wrap gap-1 max-w-[320px]">
              {opts.slice(0, 3).map((o) => (
                <span key={o} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                  {o}
                </span>
              ))}
              {opts.length > 3 && (
                <span className="text-neutral-400 text-[10px] font-bold self-center px-1">
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
              className="flex w-full justify-center cursor-pointer select-none"
              onClick={() => openEditModal(rawAttr)}
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
            className="flex w-full justify-center cursor-pointer select-none"
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
    [attributes],
  );

  if (loading && attributes.length === 0) {
    return <div className="text-center py-10 font-bold text-gray-500">Завантаження характеристик...</div>;
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
