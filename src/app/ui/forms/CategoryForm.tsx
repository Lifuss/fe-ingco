'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { Category } from '@/lib/types';

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
    slug?: string | null;
    seoKeywords?: string | null;
    renderSort?: number;
    parentId?: number | null;
    showInMenu?: boolean;
  };
}) => {
  const rawCategoriesList = useAppSelector((state) => state.persistedMainReducer.categories);
  const categoriesList = useMemo(() => rawCategoriesList || [], [rawCategoriesList]);

  const [detectedFilters, setDetectedFilters] = useState<
    { code: string; name: string; unit?: string | null }[]
  >([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(Boolean(defaultValue?.id));
  const [filterSearchQuery, setFilterSearchQuery] = useState('');

  const filteredDetectedFilters = useMemo(() => {
    const q = filterSearchQuery.trim().toLowerCase();
    if (!q) return detectedFilters;
    return detectedFilters.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        (f.unit && f.unit.toLowerCase().includes(q)),
    );
  }, [detectedFilters, filterSearchQuery]);

  useEffect(() => {
    if (defaultValue?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API}/api/categories/${defaultValue.id}/filters`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDetectedFilters(data);
          }
        })
        .catch((err) => console.error('Failed to fetch category filters:', err))
        .finally(() => setIsLoadingFilters(false));
    }
  }, [defaultValue?.id]);

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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 font-sans">
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

      {/* Auto-detected Category Filters Informational Block */}
      {defaultValue?.id && (
        <div className="mt-1 flex min-h-[110px] flex-col gap-2 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 text-amber-900">
            <span className="text-xs font-bold tracking-wider uppercase">
              Автоматично виявлені фільтри {isLoadingFilters ? '' : `(${detectedFilters.length})`}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-medium text-neutral-600">
            Фільтри виводяться покупцям сайдбару автоматично на основі характеристик товарів у
            наявності.
          </p>

          {isLoadingFilters ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex flex-wrap gap-1.5 pt-1">
                <div className="h-6 w-20 animate-pulse rounded-lg bg-amber-200/50" />
                <div className="h-6 w-28 animate-pulse rounded-lg bg-amber-200/50" />
                <div className="h-6 w-16 animate-pulse rounded-lg bg-amber-200/50" />
                <div className="h-6 w-24 animate-pulse rounded-lg bg-amber-200/50" />
              </div>
            </div>
          ) : detectedFilters.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              {detectedFilters.length > 8 && (
                <input
                  type="text"
                  placeholder="Швидкий пошук фільтра за назвою або кодом..."
                  value={filterSearchQuery}
                  onChange={(e) => setFilterSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 placeholder-neutral-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
              )}
              <div className="scrollbar-thin flex max-h-[140px] flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-amber-200/50 bg-white/70 p-2">
                {filteredDetectedFilters.length > 0 ? (
                  filteredDetectedFilters.map((filter) => (
                    <span
                      key={filter.code}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-white px-2.5 py-1 text-xs font-bold text-neutral-800 shadow-xs select-none"
                    >
                      <span>{filter.name}</span>
                      {filter.unit && (
                        <span className="text-[10px] font-normal text-neutral-400">
                          ({filter.unit})
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-medium text-neutral-400 italic">
                    Фільтрів не знайдено за запитом «{filterSearchQuery}»
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-xs font-medium text-neutral-400 italic">
              У цій категорії поки немає товарів із характеристиками у наявності.
            </span>
          )}
        </div>
      )}

      <button className="bg-primary-500 hover:bg-primary-600 mt-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-bold tracking-wide text-white uppercase transition-colors">
        Підтвердити
      </button>
    </form>
  );
};

export default CategoryForm;
