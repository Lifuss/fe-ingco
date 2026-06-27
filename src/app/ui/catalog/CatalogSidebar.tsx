'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { ShieldCheck, Filter, Phone, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import CallbackModal from '../modals/CallbackModal';
import { Category, ProductAttribute } from '@/lib/types';

interface FilterAttribute extends ProductAttribute {
  activeValues: string[];
}

const CatalogSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawProductsCategories = useAppSelector((state) => state.persistedMainReducer.categories);
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);
  const productsCategories = useMemo(() => {
    const categories = rawProductsCategories || [];
    const explicitlyHiddenIds = new Set(
      categories.filter((c) => c.showInMenu === false).map((c) => c.id),
    );
    return categories.filter((c) => {
      if (c.showInMenu === false) return false;
      let currentParentId = c.parentId;
      while (currentParentId) {
        if (explicitlyHiddenIds.has(currentParentId)) {
          return false;
        }
        const parent = categories.find((pc) => pc.id === currentParentId);
        currentParentId = parent ? parent.parentId : null;
      }
      return true;
    });
  }, [rawProductsCategories]);

  interface SidebarCategoryNode extends Category {
    children: SidebarCategoryNode[];
  }

  // Read URL search params & route params
  const params = useParams<{ categorySlug?: string }>();
  const categorySlug = params?.categorySlug;

  const activeCategoryId = useMemo(() => {
    if (categorySlug && rawProductsCategories) {
      const cat = rawProductsCategories.find((c) => c.slug === categorySlug);
      return cat ? String(cat.id) : '';
    }
    return searchParams.get('category') || '';
  }, [categorySlug, rawProductsCategories, searchParams]);

  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [prevCategoryId, setPrevCategoryId] = useState(activeCategoryId);
  const [userToggledFilters, setUserToggledFilters] = useState<Record<string, boolean>>({});
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Callback Modal State
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  const categoryTree = useMemo(() => {
    const map = new Map<number, SidebarCategoryNode>();
    productsCategories.forEach((c) => {
      map.set(c.id, { ...c, children: [] });
    });

    const roots: SidebarCategoryNode[] = [];
    productsCategories.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (nodes: SidebarCategoryNode[]) => {
      nodes.sort((a, b) => a.renderSort - b.renderSort);
      nodes.forEach((n) => sortNodes(n.children));
    };
    sortNodes(roots);

    return { roots, map };
  }, [productsCategories]);

  const activeNode = useMemo(() => {
    if (!activeCategoryId) return null;
    return categoryTree.map.get(Number(activeCategoryId)) || null;
  }, [activeCategoryId, categoryTree]);
  const [dynamicFilters, setDynamicFilters] = useState<FilterAttribute[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const visibleFilters = useMemo(() => {
    if (showAllFilters) return dynamicFilters;

    const LIMIT = 8;
    return dynamicFilters.filter((filter, idx) => {
      const isSelectedAny = (selectedFilters[filter.code] || []).length > 0;
      return idx < LIMIT || isSelectedAny;
    });
  }, [dynamicFilters, selectedFilters, showAllFilters]);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [floatingWidget, setFloatingWidget] = useState<{
    visible: boolean;
    loading: boolean;
    count: number;
    top: number;
    left: number;
  }>({
    visible: false,
    loading: false,
    count: 0,
    top: 0,
    left: 0,
  });

  // Derived resets & syncing during render to avoid set-state-in-effect
  if (activeCategoryId !== prevCategoryId) {
    setPrevCategoryId(activeCategoryId);
    setShowAllSubcategories(false);
    setUserToggledFilters({});
    setShowAllFilters(false);
    if (!activeCategoryId) {
      setDynamicFilters([]);
    }
  }

  const urlFilters = searchParams.get('filters');
  const [prevUrlFilters, setPrevUrlFilters] = useState(urlFilters);
  if (urlFilters !== prevUrlFilters) {
    setPrevUrlFilters(urlFilters);
    let nextFilters = {};
    if (urlFilters) {
      try {
        nextFilters = JSON.parse(urlFilters);
      } catch {
        nextFilters = {};
      }
    }
    setSelectedFilters(nextFilters);
    setFloatingWidget((prev) => ({ ...prev, visible: false }));
  }

  // Fetch filters dynamically when category changes
  useEffect(() => {
    if (activeCategoryId) {
      fetch(`${process.env.NEXT_PUBLIC_API}/api/categories/${activeCategoryId}/filters`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDynamicFilters(data);
          }
        })
        .catch((err) => console.error('Failed to fetch category filters:', err));
    }
  }, [activeCategoryId]);

  // Helper to update URL params
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1'); // reset page on filter change

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const targetPath = pathname === '/favorites' ? '/favorites' : pathname;
      router.replace(`${targetPath}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategoriesThunk(''));
  }, [dispatch]);

  // Category select handler
  const handleCategoryChange = (categoryId: string) => {
    const selectedCat = rawProductsCategories?.find((c) => String(c.id) === categoryId);

    if (pathname === '/favorites') {
      if (activeCategoryId === categoryId) {
        updateUrlParams({ category: null, filters: null });
      } else {
        updateUrlParams({ category: categoryId, filters: null });
      }
      return;
    }

    if (activeCategoryId === categoryId) {
      router.push('/');
    } else {
      if (selectedCat?.slug) {
        router.push(`/categories/${selectedCat.slug}`);
      } else {
        router.push(`/?category=${categoryId}`);
      }
    }
  };

  // Checkbox toggle handler
  const handleCheckboxChange = async (
    code: string,
    value: string,
    checked: boolean,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextFilters = { ...selectedFilters };
    if (checked) {
      nextFilters[code] = [...(nextFilters[code] || []), value];
    } else {
      nextFilters[code] = (nextFilters[code] || []).filter((v) => v !== value);
      if (nextFilters[code].length === 0) {
        delete nextFilters[code];
      }
    }
    setSelectedFilters(nextFilters);

    // Calculate position relative to containerRef
    const checkboxEl = e.target;
    if (containerRef.current && checkboxEl) {
      const rect = checkboxEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const top = rect.top - containerRect.top + rect.height / 2;
      const left = rect.right - containerRect.left + 15;

      setFloatingWidget({
        visible: true,
        loading: true,
        count: 0,
        top,
        left,
      });
    }

    // Fetch matching count
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '1');
      if (activeCategoryId) params.set('category', activeCategoryId);
      const searchQuery = searchParams.get('query') || '';
      if (searchQuery) params.set('q', searchQuery);
      params.set('isRetail', String(!isB2b));
      if (Object.keys(nextFilters).length > 0) {
        params.set('filters', JSON.stringify(nextFilters));
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/products?${params.toString()}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      setFloatingWidget((prev) => ({
        ...prev,
        loading: false,
        count: data.total || 0,
      }));
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to prefetch count:', err);
        setFloatingWidget((prev) => ({
          ...prev,
          loading: false,
        }));
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'name' in err &&
        (err as { name?: string }).name !== 'AbortError'
      ) {
        console.error('Failed to prefetch count:', err);
        setFloatingWidget((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }
  };

  const handleApplyFilters = () => {
    const serialized =
      Object.keys(selectedFilters).length > 0 ? JSON.stringify(selectedFilters) : null;
    updateUrlParams({ filters: serialized });
    setFloatingWidget((prev) => ({ ...prev, visible: false }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedFilters({});
    updateUrlParams({ filters: null });
    setFloatingWidget((prev) => ({ ...prev, visible: false }));
  };

  const handleResetCategory = () => {
    if (pathname === '/favorites') {
      updateUrlParams({ category: null, filters: null });
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('filters'); // Filters are category-specific
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 font-sans xl:w-[280px]">
      {/* Category Hierarchical block */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm select-none">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Категорії</h2>
          {activeCategoryId && (
            <button
              onClick={handleResetCategory}
              className="text-primary-500 hover:text-primary-600 text-xs font-medium hover:underline"
            >
              Скинути
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {productsCategories.length === 0 ? (
            <span className="text-xs text-gray-400">Категорії завантажуються...</span>
          ) : (
            <div className="flex flex-col gap-2 font-sans">
              {/* Back links if a category is selected */}
              {activeNode && (
                <div className="mb-2">
                  {activeNode.parentId ? (
                    (() => {
                      const parent = categoryTree.map.get(activeNode.parentId);
                      return (
                        <button
                          onClick={() => handleCategoryChange(String(parent?.id))}
                          className="hover:text-primary-500 mb-1 flex cursor-pointer items-center gap-1.5 text-xs font-bold text-gray-500 transition-colors"
                        >
                          <ChevronLeft size={14} className="stroke-[2.5]" />
                          <span>Назад до {parent?.name}</span>
                        </button>
                      );
                    })()
                  ) : (
                    <button
                      onClick={handleResetCategory}
                      className="hover:text-primary-500 mb-1 flex cursor-pointer items-center gap-1.5 text-xs font-bold text-gray-500 transition-colors"
                    >
                      <ChevronLeft size={14} className="stroke-[2.5]" />
                      <span>Всі категорії</span>
                    </button>
                  )}
                </div>
              )}

              {/* Category Tree/List Rendering */}
              {(() => {
                let listToRender: SidebarCategoryNode[] = [];
                let highlightId: number | null = null;
                let isNested = false;

                if (!activeNode) {
                  // No category selected: show roots
                  listToRender = categoryTree.roots;
                } else if (activeNode.children.length > 0) {
                  // Parent selected: show the active parent and its children
                  return (
                    <div className="flex flex-col gap-2">
                      <div className="text-primary-600 flex items-center gap-2 rounded-lg bg-[#FFF2EB] px-2 py-1 text-sm font-bold">
                        <span>{activeNode.name}</span>
                      </div>

                      <ul className="border-gray-150 mt-1 ml-2 flex flex-col gap-2 border-l pl-3">
                        {(() => {
                          const children = activeNode.children;
                          const hasMore = children.length > 6;
                          const visibleChildren = showAllSubcategories
                            ? children
                            : children.slice(0, 6);

                          return (
                            <>
                              {visibleChildren.map((child) => (
                                <li key={child.id}>
                                  <button
                                    onClick={() => handleCategoryChange(String(child.id))}
                                    className="hover:text-primary-500 group flex w-full cursor-pointer items-center justify-between py-0.5 text-left text-xs font-semibold text-gray-600 transition-colors"
                                  >
                                    <span className="truncate pr-2">{child.name}</span>
                                    {child.count !== undefined && (
                                      <span className="group-hover:bg-primary-50 group-hover:text-primary-500 shrink-0 rounded-full bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 transition-colors">
                                        {child.count}
                                      </span>
                                    )}
                                  </button>
                                </li>
                              ))}

                              {hasMore && (
                                <button
                                  onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                                  className="text-primary-500 hover:text-primary-600 mt-1 flex cursor-pointer items-center gap-1 text-left text-[11px] font-bold hover:underline"
                                >
                                  <span>
                                    {showAllSubcategories
                                      ? 'Приховати'
                                      : `Показати більше (+${children.length - 6})`}
                                  </span>
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </ul>
                    </div>
                  );
                } else {
                  // Subcategory selected: show siblings, highlight active
                  const parent = activeNode.parentId
                    ? categoryTree.map.get(activeNode.parentId)
                    : null;
                  listToRender = parent ? parent.children : categoryTree.roots;
                  highlightId = activeNode.id;
                  isNested = parent ? true : false;
                }

                const hasMore = listToRender.length > 6;
                const visibleList = showAllSubcategories ? listToRender : listToRender.slice(0, 6);

                return (
                  <ul className={`flex flex-col gap-2 ${isNested ? 'pl-2' : ''}`}>
                    {visibleList.map((category) => {
                      const isSelected = category.id === highlightId;
                      const hasChildren = category.children.length > 0;

                      return (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryChange(String(category.id))}
                            className={`group flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-left text-xs transition-colors ${
                              isSelected
                                ? 'text-primary-600 bg-[#FFF2EB] font-bold'
                                : 'font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-950'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate pr-2">
                              {hasChildren && !isSelected && (
                                <ChevronRight
                                  size={12}
                                  className="group-hover:text-primary-500 shrink-0 text-gray-400"
                                />
                              )}
                              <span className="truncate">{category.name}</span>
                            </div>
                            {category.count !== undefined && (
                              <span
                                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'group-hover:bg-primary-50 group-hover:text-primary-500 bg-gray-50 text-gray-400 transition-colors'
                                }`}
                              >
                                {category.count}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}

                    {hasMore && (
                      <button
                        onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                        className="text-primary-500 hover:text-primary-600 mt-1 flex cursor-pointer items-center gap-1 pl-2 text-left text-[11px] font-bold hover:underline"
                      >
                        <span>
                          {showAllSubcategories
                            ? 'Приховати'
                            : `Показати більше (+${listToRender.length - 6})`}
                        </span>
                      </button>
                    )}
                  </ul>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Technical Parameters block */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
            <Filter size={14} className="text-primary-500" />
            Характеристики
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-primary-500 hover:text-primary-600 cursor-pointer text-xs font-medium hover:underline"
            >
              Скинути
            </button>
          )}
        </div>

        {dynamicFilters.length === 0 ? (
          <p className="py-4 text-center text-xs font-semibold text-neutral-400">
            {activeCategoryId
              ? 'Немає активних фільтрів для цієї категорії'
              : 'Оберіть категорію для фільтрації товарів'}
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {visibleFilters.map((filter, idx) => {
              const selectedValues = selectedFilters[filter.code] || [];
              const isSelectedAny = selectedValues.length > 0;
              const isDefaultExpanded = idx < 5 || isSelectedAny;
              const isExpanded =
                userToggledFilters[filter.code] !== undefined
                  ? userToggledFilters[filter.code]
                  : isDefaultExpanded;
              return (
                <div
                  key={filter.code}
                  className="flex flex-col border-b border-neutral-100/60 pb-3 last:border-b-0 last:pb-0"
                >
                  <h3
                    onClick={() =>
                      setUserToggledFilters((prev) => ({ ...prev, [filter.code]: !isExpanded }))
                    }
                    className="group/filter-title hover:text-primary-500 mb-2 flex cursor-pointer items-center justify-between text-xs font-bold tracking-wider text-gray-700 uppercase transition-colors select-none"
                  >
                    <span className="truncate pr-1">
                      {filter.name} {filter.unit ? `(${filter.unit})` : ''}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {isSelectedAny && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextFilters = { ...selectedFilters };
                            delete nextFilters[filter.code];
                            setSelectedFilters(nextFilters);
                            const serialized =
                              Object.keys(nextFilters).length > 0
                                ? JSON.stringify(nextFilters)
                                : null;
                            updateUrlParams({ filters: serialized });
                            setFloatingWidget((prev) => ({ ...prev, visible: false }));
                          }}
                          className="text-[10px] font-semibold text-rose-500 lowercase hover:text-rose-600"
                        >
                          скинути
                        </button>
                      )}
                      <ChevronDown
                        size={14}
                        className={`group-hover/filter-title:text-primary-500 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'text-primary-500 rotate-180' : ''
                        }`}
                      />
                    </div>
                  </h3>
                  {isExpanded && (
                    <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1 transition-all duration-200">
                      {filter.activeValues.map((val: string) => {
                        const isChecked = selectedValues.includes(val);
                        return (
                          <label
                            key={val}
                            className="group flex cursor-pointer items-center gap-2.5 py-0.5 select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleCheckboxChange(filter.code, val, e.target.checked, e)
                              }
                              className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
                            />
                            <span className="truncate text-xs font-semibold text-gray-600 transition-colors group-hover:text-gray-950">
                              {val}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {dynamicFilters.length > visibleFilters.length && (
              <button
                type="button"
                onClick={() => setShowAllFilters(true)}
                className="text-primary-500 hover:text-primary-600 mt-1 flex w-full cursor-pointer items-center justify-center gap-1 py-1.5 text-center text-xs font-bold transition-colors select-none"
              >
                Показати всі характеристики (+{dynamicFilters.length - visibleFilters.length})
              </button>
            )}
            {showAllFilters && dynamicFilters.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllFilters(false)}
                className="text-primary-500 hover:text-primary-600 mt-1 flex w-full cursor-pointer items-center justify-center gap-1 py-1.5 text-center text-xs font-bold transition-colors select-none"
              >
                Приховати характеристики
              </button>
            )}
          </div>
        )}

        {/* Floating Confirmation Widget */}
        {floatingWidget.visible && (
          <div
            style={{
              top: `${floatingWidget.top}px`,
              left: `${floatingWidget.left}px`,
            }}
            className="absolute z-50 flex -translate-y-1/2 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 shadow-xl transition-all duration-200"
          >
            {/* Arrow pointer */}
            <div className="absolute top-1/2 left-[-6px] h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b border-l border-neutral-200 bg-white"></div>

            <div className="relative flex items-center gap-2 text-xs font-semibold text-neutral-700">
              {floatingWidget.loading ? (
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="border-t-primary-500 h-3 w-3 animate-spin rounded-full border-2 border-neutral-300"></span>
                  <span>Шукаємо...</span>
                </div>
              ) : (
                <span>
                  Знайдено:{' '}
                  <strong className="text-primary-600 font-bold">{floatingWidget.count}</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={floatingWidget.loading}
              onClick={handleApplyFilters}
              className="bg-primary-500 hover:bg-primary-600 shrink-0 cursor-pointer rounded-lg px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase transition-colors select-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Показати
            </button>
          </div>
        )}
      </div>

      {/* B2B Personal Manager Banner */}
      <div className="bg-manager-gradient relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 text-white shadow-md">
        {/* Decorative elements */}
        <div className="bg-primary-500/10 pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full blur-xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-500/10 blur-lg" />

        <div className="flex items-start gap-3">
          <div className="bg-primary-500/20 text-primary-400 border-primary-500/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-gray-150 text-sm font-bold tracking-wider uppercase">
              Персональний менеджер
            </h3>
            <p className="text-[11px] font-semibold tracking-wide text-gray-400">
              ДЛЯ B2B ПОКУПЦІВ
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-gray-300">
          Для оптових замовлень від <strong className="text-primary-400">50 000 грн</strong>{' '}
          зверніться до менеджера за персональними умовами.
        </p>

        <button
          onClick={() => setIsCallbackOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition-colors"
        >
          <Phone size={12} className="fill-current" />
          Замовити дзвінок
        </button>
      </div>

      {/* Callback Dialog Modal */}
      <CallbackModal isOpen={isCallbackOpen} closeModal={() => setIsCallbackOpen(false)} />
    </aside>
  );
};

export default CatalogSidebar;
