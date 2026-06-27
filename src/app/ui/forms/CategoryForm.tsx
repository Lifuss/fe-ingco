'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { Category, ProductAttribute } from '@/lib/types';

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
  selectedAttributeIds = [],
  setSelectedAttributeIds,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValue?: {
    id?: number;
    name: string;
    slug?: string | null;
    seoKeywords?: string | null;
    renderSort?: number;
    parentId?: number | null;
    showInMenu?: boolean;
  };
  selectedAttributeIds?: number[];
  setSelectedAttributeIds: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const rawCategoriesList = useAppSelector((state) => state.persistedMainReducer.categories);
  const categoriesList = useMemo(() => rawCategoriesList || [], [rawCategoriesList]);

  const [allAttributes, setAllAttributes] = useState<ProductAttribute[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/attributes`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllAttributes(data);
        }
      })
      .catch((err) => console.error('Failed to fetch attributes:', err));
  }, []);

  const defaultKeywords = useMemo(() => {
    if (defaultValue && defaultValue.seoKeywords) {
      return defaultValue.seoKeywords;
    }
    if (defaultValue && defaultValue.name) {
      return `${defaultValue.name}, купити ${defaultValue.name}, ${defaultValue.name} інгко, ${defaultValue.name} ingco, інструменти ingco, купити в Україні`;
    }
    return '';
  }, [defaultValue]);

  const hierarchyOptions = useMemo(
    () => getHierarchyOptions(categoriesList, defaultValue?.id),
    [categoriesList, defaultValue?.id],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-[340px] flex-col gap-4 font-sans md:min-w-[420px]"
    >
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
          Slug (ЧПУ URL)
        </span>
        <input
          type="text"
          name="slug"
          placeholder="Автогенерація"
          defaultValue={defaultValue && defaultValue.slug ? defaultValue.slug : ''}
          className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
        />
        <span className="text-xs text-neutral-400">
          Залиште порожнім для автоматичної генерації на основі назви.
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-sm font-bold tracking-wider text-neutral-700 uppercase">
          SEO Ключові слова (Keywords)
        </span>
        <input
          type="text"
          name="seoKeywords"
          placeholder="Наприклад: садові пили, акумуляторні пилки..."
          defaultValue={defaultKeywords}
          className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
        />
        <span className="text-xs text-neutral-400">
          Через кому. Якщо порожньо, використовується шаблон за замовчуванням.
        </span>
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

      <div className="mt-2 flex flex-col gap-2.5">
        <span className="block text-sm font-bold tracking-wider text-neutral-700 uppercase">
          Характеристики для фільтрації
        </span>
        {allAttributes.length === 0 ? (
          <span className="text-xs text-neutral-400 italic">
            Немає створених характеристик. Створіть їх спочатку в розділі «Характеристики».
          </span>
        ) : (
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-lg border border-neutral-200 bg-[#FAFAFF] p-3">
            {allAttributes.map((attr) => {
              const isChecked = selectedAttributeIds.includes(attr.id);
              return (
                <label
                  key={attr.id}
                  className="group flex cursor-pointer items-center gap-2.5 py-0.5 text-xs font-semibold text-neutral-700 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttributeIds([...selectedAttributeIds, attr.id]);
                      } else {
                        setSelectedAttributeIds(
                          selectedAttributeIds.filter((id) => id !== attr.id),
                        );
                      }
                    }}
                    className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                  <span className="transition-colors group-hover:text-neutral-950">
                    {attr.name}{' '}
                    <span className="font-mono text-[10px] font-bold text-neutral-400">
                      ({attr.code})
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <button className="bg-primary-500 hover:bg-primary-600 mt-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-bold tracking-wide text-white uppercase transition-colors">
        Підтвердити
      </button>
    </form>
  );
};

export default CategoryForm;
