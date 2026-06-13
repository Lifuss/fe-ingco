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

  const flatten = (nodes: CategoryNode[], depth = 0): { id: number; name: string; depth: number }[] => {
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
  defaultValue?: { id?: number; name: string; renderSort?: number; parentId?: number | null; showInMenu?: boolean };
}) => {
  const rawCategoriesList = useAppSelector((state) => state.persistedMainReducer.categories);
  const categoriesList = useMemo(() => rawCategoriesList || [], [rawCategoriesList]);

  const hierarchyOptions = useMemo(
    () => getHierarchyOptions(categoriesList, defaultValue?.id),
    [categoriesList, defaultValue?.id],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans min-w-[320px]">
      <label className="flex flex-col gap-1">
        <span className="block text-sm font-bold text-neutral-700 uppercase tracking-wider">Назва категорії</span>
        <input
          type="text"
          name="name"
          required
          placeholder="Назва"
          defaultValue={defaultValue && defaultValue.name}
          className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-sm font-bold text-neutral-700 uppercase tracking-wider">Батьківська категорія</span>
        <select
          name="parentId"
          defaultValue={defaultValue?.parentId ?? ''}
          className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold cursor-pointer"
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

      <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
        <input
          type="checkbox"
          name="showInMenu"
          defaultChecked={defaultValue ? defaultValue.showInMenu !== false : true}
          className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-gray-300 accent-primary-500 cursor-pointer"
        />
        <span className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
          Відображати в меню каталогу
        </span>
      </label>

      <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer text-sm uppercase tracking-wide mt-2">
        Підтвердити
      </button>
    </form>
  );
};

export default CategoryForm;
