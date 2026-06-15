'use client';

import { useAppSelector } from '@/lib/hooks';
import { Category } from '@/lib/types';
import React, { useMemo } from 'react';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function getHierarchyOptions(categories: Category[], excludeId?: number) {
  const map = new Map<number, CategoryNode>();
  categories.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  const excludedIds = new Set<number>();
  if (excludeId) {
    excludedIds.add(excludeId);
    const checkQueue = [excludeId];
    while (checkQueue.length > 0) {
      const currentId = checkQueue.shift()!;
      categories.forEach((c) => {
        if (c.parentId === currentId) {
          excludedIds.add(c.id);
          checkQueue.push(c.id);
        }
      });
    }
  }

  const roots: CategoryNode[] = [];
  categories.forEach((c) => {
    if (excludedIds.has(c.id)) return;
    const node = map.get(c.id)!;
    if (c.parentId && !excludedIds.has(c.parentId)) {
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

  const flatten = (
    nodes: CategoryNode[],
    depth = 0,
  ): { id: number; name: string; depth: number }[] => {
    const result: { id: number; name: string; depth: number }[] = [];
    nodes.forEach((node) => {
      result.push({ id: node.id, name: node.name, depth });
      result.push(...flatten(node.children, depth + 1));
    });
    return result;
  };

  return flatten(roots);
}

const CategoryForm = ({
  handleSubmit,
  defaultValue,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValue?: {
    id?: number;
    name: string;
    renderSort?: number;
    parentId?: number | null;
    showInMenu?: boolean;
  };
}) => {
  const rawCategoriesList = useAppSelector((state) => state.persistedMainReducer.categories);
  const categoriesList = useMemo(() => rawCategoriesList || [], [rawCategoriesList]);

  const hierarchyOptions = useMemo(
    () => getHierarchyOptions(categoriesList, defaultValue?.id),
    [categoriesList, defaultValue?.id],
  );

  return (
    <form onSubmit={handleSubmit} className="flex min-w-[320px] flex-col gap-4 font-sans">
      <label className="flex flex-col gap-1">
        <span className="block text-sm font-bold tracking-wider text-neutral-700 uppercase">
          Назва категорії
        </span>
        <input
          type="text"
          name="name"
          required
          placeholder="Назва"
          defaultValue={defaultValue && defaultValue.name}
          className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-sm font-bold tracking-wider text-neutral-700 uppercase">
          Батьківська категорія
        </span>
        <select
          name="parentId"
          defaultValue={defaultValue?.parentId ?? ''}
          className="focus:border-primary-500 w-full cursor-pointer rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
        >
          <option value="">Немає (Коренева)</option>
          {hierarchyOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {'\u00A0'.repeat(cat.depth * 4)}
              {cat.depth > 0 ? '└─ ' : ''}
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex cursor-pointer items-center gap-3 py-1 select-none">
        <input
          type="checkbox"
          name="showInMenu"
          defaultChecked={defaultValue ? defaultValue.showInMenu !== false : true}
          className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
        />
        <span className="text-sm font-bold tracking-wider text-neutral-700 uppercase">
          Відображати в меню каталогу
        </span>
      </label>

      <button className="bg-primary-500 hover:bg-primary-600 mt-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-bold tracking-wide text-white uppercase transition-colors">
        Підтвердити
      </button>
    </form>
  );
};

export default CategoryForm;
