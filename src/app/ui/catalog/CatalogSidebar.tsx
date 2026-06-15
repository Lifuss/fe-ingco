'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { ShieldCheck, Zap, Plug, Filter, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import CallbackModal from '../modals/CallbackModal';
import { useDebounce } from 'use-debounce';
import { Category } from '@/lib/types';

const CatalogSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawProductsCategories =
    useAppSelector((state) => state.persistedMainReducer.categories) || [];
  const productsCategories = useMemo(() => {
    const explicitlyHiddenIds = new Set(
      rawProductsCategories.filter((c) => c.showInMenu === false).map((c) => c.id),
    );
    return rawProductsCategories.filter((c) => {
      if (c.showInMenu === false) return false;
      let currentParentId = c.parentId;
      while (currentParentId) {
        if (explicitlyHiddenIds.has(currentParentId)) {
          return false;
        }
        const parent = rawProductsCategories.find((pc) => pc.id === currentParentId);
        currentParentId = parent ? parent.parentId : null;
      }
      return true;
    });
  }, [rawProductsCategories]);

  interface SidebarCategoryNode extends Category {
    children: SidebarCategoryNode[];
  }

  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  // Callback Modal State
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  // Read URL search params
  const activeCategoryId = searchParams.get('category') || '';

  useEffect(() => {
    setShowAllSubcategories(false);
  }, [activeCategoryId]);

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
  const urlMinPower = searchParams.get('minPower') || '';
  const urlMaxPower = searchParams.get('maxPower') || '';
  const batteryChecked = searchParams.get('battery') === 'true';
  const mainsChecked = searchParams.get('mains') === 'true';

  // Local state for inputs (for smoother typing before debouncing)
  const [minPowerInput, setMinPowerInput] = useState(urlMinPower);
  const [maxPowerInput, setMaxPowerInput] = useState(urlMaxPower);

  // Debounce power values to prevent spamming updates while typing
  const [debouncedMinPower] = useDebounce(minPowerInput, 500);
  const [debouncedMaxPower] = useDebounce(maxPowerInput, 500);

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

      const targetPath = pathname === '/favorites' ? '/favorites' : '/';
      router.replace(`${targetPath}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategoriesThunk(''));
  }, [dispatch]);

  // Update inputs if URL changes externally
  useEffect(() => {
    setMinPowerInput(urlMinPower);
  }, [urlMinPower]);

  useEffect(() => {
    setMaxPowerInput(urlMaxPower);
  }, [urlMaxPower]);

  // Trigger search params update when debounced inputs or checkboxes change
  useEffect(() => {
    if (debouncedMinPower === urlMinPower && debouncedMaxPower === urlMaxPower) {
      return;
    }
    updateUrlParams({
      minPower: debouncedMinPower,
      maxPower: debouncedMaxPower,
    });
  }, [debouncedMinPower, debouncedMaxPower, urlMinPower, urlMaxPower, updateUrlParams]);

  // Category select handler
  const handleCategoryChange = (categoryId: string) => {
    if (activeCategoryId === categoryId) {
      // Uncheck
      updateUrlParams({ category: null });
    } else {
      // Check
      updateUrlParams({ category: categoryId });
    }
  };

  const handlePowerSourceChange = (source: 'battery' | 'mains', checked: boolean) => {
    updateUrlParams({ [source]: checked ? 'true' : null });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setMinPowerInput('');
    setMaxPowerInput('');
    const params = new URLSearchParams();
    if (searchParams.get('query')) {
      params.set('query', searchParams.get('query') || '');
    }
    const targetPath = pathname === '/favorites' ? '/favorites' : '/';
    router.replace(`${targetPath}?${params.toString()}`);
  };

  const hasActiveFilters =
    activeCategoryId || urlMinPower || urlMaxPower || batteryChecked || mainsChecked;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 font-sans xl:w-[280px]">
      {/* Category Hierarchical block */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm select-none">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-sm font-bold tracking-wider text-gray-900 uppercase">Категорії</h2>
          {activeCategoryId && (
            <button
              onClick={() => updateUrlParams({ category: null })}
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
                      onClick={() => updateUrlParams({ category: null })}
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
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
          <Filter size={14} className="text-primary-500" />
          Технічні параметри
        </h2>

        {/* Power Min/Max Range */}
        <div className="mb-5">
          <h3 className="mb-2.5 text-xs font-bold tracking-wider text-gray-700 uppercase">
            Потужність (Вт)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Мін"
              value={minPowerInput}
              onChange={(e) => setMinPowerInput(e.target.value)}
              className="focus:border-primary-500 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium placeholder-gray-400 focus:outline-none"
            />
            <span className="text-gray-300">/</span>
            <input
              type="number"
              placeholder="Макс"
              value={maxPowerInput}
              onChange={(e) => setMaxPowerInput(e.target.value)}
              className="focus:border-primary-500 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Power Source Checkboxes */}
        <div>
          <h3 className="mb-2.5 text-xs font-bold tracking-wider text-gray-700 uppercase">
            Джерело живлення
          </h3>
          <div className="flex flex-col gap-2.5">
            <label className="group flex cursor-pointer items-center gap-3 py-0.5">
              <input
                type="checkbox"
                checked={batteryChecked}
                onChange={(e) => handlePowerSourceChange('battery', e.target.checked)}
                className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 rounded border-gray-300"
              />
              <span className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors group-hover:text-gray-950">
                <Zap size={14} className="text-amber-500" />
                Акумулятор
              </span>
            </label>

            <label className="group flex cursor-pointer items-center gap-3 py-0.5">
              <input
                type="checkbox"
                checked={mainsChecked}
                onChange={(e) => handlePowerSourceChange('mains', e.target.checked)}
                className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 rounded border-gray-300"
              />
              <span className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors group-hover:text-gray-950">
                <Plug size={14} className="text-blue-500" />
                Мережа 220В
              </span>
            </label>
          </div>
        </div>
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
