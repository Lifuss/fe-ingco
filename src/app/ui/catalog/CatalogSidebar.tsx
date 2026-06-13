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

  const rawProductsCategories = useAppSelector((state) => state.persistedMainReducer.categories) || [];
  const productsCategories = useMemo(() => {
    const explicitlyHiddenIds = new Set(
      rawProductsCategories.filter((c) => c.showInMenu === false).map((c) => c.id)
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
  const updateUrlParams = useCallback((updates: Record<string, string | null>) => {
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
  }, [searchParams, pathname, router]);

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

  const hasActiveFilters = activeCategoryId || urlMinPower || urlMaxPower || batteryChecked || mainsChecked;

  return (
    <aside className="w-full xl:w-[280px] shrink-0 font-sans flex flex-col gap-6">
      
      {/* Category Hierarchical block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm select-none">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Категорії</h2>
          {activeCategoryId && (
            <button
              onClick={() => updateUrlParams({ category: null })}
              className="text-xs text-primary-500 hover:text-primary-600 hover:underline font-medium"
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
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors mb-1 cursor-pointer"
                        >
                          <ChevronLeft size={14} className="stroke-[2.5]" />
                          <span>Назад до {parent?.name}</span>
                        </button>
                      );
                    })()
                  ) : (
                    <button
                      onClick={() => updateUrlParams({ category: null })}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors mb-1 cursor-pointer"
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
                      <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-[#FFF2EB] text-primary-600 font-bold text-sm">
                        <span>{activeNode.name}</span>
                      </div>
                      
                      <ul className="flex flex-col gap-2 pl-3 border-l border-gray-150 ml-2 mt-1">
                        {(() => {
                          const children = activeNode.children;
                          const hasMore = children.length > 6;
                          const visibleChildren = showAllSubcategories ? children : children.slice(0, 6);
                          
                          return (
                            <>
                              {visibleChildren.map((child) => (
                                <li key={child.id}>
                                  <button
                                    onClick={() => handleCategoryChange(String(child.id))}
                                    className="w-full text-left text-xs font-semibold text-gray-600 hover:text-primary-500 transition-colors flex items-center justify-between group py-0.5 cursor-pointer"
                                  >
                                    <span className="truncate pr-2">{child.name}</span>
                                    {child.count !== undefined && (
                                      <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded-full group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors shrink-0">
                                        {child.count}
                                      </span>
                                    )}
                                  </button>
                                </li>
                              ))}
                              
                              {hasMore && (
                                <button
                                  onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                                  className="text-[11px] font-bold text-primary-500 hover:text-primary-600 hover:underline text-left mt-1 flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{showAllSubcategories ? 'Приховати' : `Показати більше (+${children.length - 6})`}</span>
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
                  const parent = activeNode.parentId ? categoryTree.map.get(activeNode.parentId) : null;
                  listToRender = parent ? parent.children : categoryTree.roots;
                  highlightId = activeNode.id;
                  isNested = parent ? true : false;
                }

                const hasMore = listToRender.length > 6;
                const visibleList = showAllSubcategories ? listToRender : listToRender.slice(0, 6);

                return (
                  <ul className={`flex flex-col gap-2 ${isNested ? "pl-2" : ""}`}>
                    {visibleList.map((category) => {
                      const isSelected = category.id === highlightId;
                      const hasChildren = category.children.length > 0;
                      
                      return (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryChange(String(category.id))}
                            className={`w-full text-left text-xs transition-colors flex items-center justify-between group py-1 cursor-pointer rounded-lg px-2 ${
                              isSelected 
                                ? "bg-[#FFF2EB] text-primary-600 font-bold" 
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-950 font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate pr-2">
                              {hasChildren && !isSelected && (
                                <ChevronRight size={12} className="text-gray-400 group-hover:text-primary-500 shrink-0" />
                              )}
                              <span className="truncate">{category.name}</span>
                            </div>
                            {category.count !== undefined && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                                isSelected 
                                  ? "bg-primary-100 text-primary-600" 
                                  : "bg-gray-50 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors"
                              }`}>
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
                        className="text-[11px] font-bold text-primary-500 hover:text-primary-600 hover:underline text-left mt-1 pl-2 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showAllSubcategories ? 'Приховати' : `Показати більше (+${listToRender.length - 6})`}</span>
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Filter size={14} className="text-primary-500" />
          Технічні параметри
        </h2>

        {/* Power Min/Max Range */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Потужність (Вт)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Мін"
              value={minPowerInput}
              onChange={(e) => setMinPowerInput(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 placeholder-gray-400 font-medium"
            />
            <span className="text-gray-300">/</span>
            <input
              type="number"
              placeholder="Макс"
              value={maxPowerInput}
              onChange={(e) => setMaxPowerInput(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Power Source Checkboxes */}
        <div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Джерело живлення
          </h3>
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={batteryChecked}
                onChange={(e) => handlePowerSourceChange('battery', e.target.checked)}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-gray-300 accent-primary-500"
              />
              <span className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-gray-950 transition-colors">
                <Zap size={14} className="text-amber-500" />
                Акумулятор
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={mainsChecked}
                onChange={(e) => handlePowerSourceChange('mains', e.target.checked)}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-gray-300 accent-primary-500"
              />
              <span className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-gray-950 transition-colors">
                <Plug size={14} className="text-blue-500" />
                Мережа 220В
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* B2B Personal Manager Banner */}
      <div className="relative overflow-hidden bg-manager-gradient text-white rounded-2xl p-5 shadow-md flex flex-col gap-4">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-lg pointer-events-none" />

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 border border-primary-500/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-150">
              Персональний менеджер
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold tracking-wide">
              ДЛЯ B2B ПОКУПЦІВ
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Для оптових замовлень від <strong className="text-primary-400">50 000 грн</strong> зверніться до менеджера за персональними умовами.
        </p>

        <button
          onClick={() => setIsCallbackOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm tracking-wide"
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
