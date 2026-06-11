'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { ShieldCheck, Zap, Plug, Filter, Phone } from 'lucide-react';
import CallbackModal from '../modals/CallbackModal';
import { useDebounce } from 'use-debounce';

const CatalogSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const productsCategories = useAppSelector((state) => state.persistedMainReducer.categories) || [];

  // Callback Modal State
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  // Read URL search params
  const activeCategoryId = searchParams.get('category') || '';
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
      
      {/* Category Checkboxes block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Категорії</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-primary-500 hover:text-primary-600 hover:underline font-medium"
            >
              Скинути
            </button>
          )}
        </div>
        
        <ul className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-1">
          {productsCategories.map((category) => {
            const isChecked = activeCategoryId === String(category.id);
            return (
              <li key={category.id} className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer w-full group py-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryChange(String(category.id))}
                    className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 border-gray-300 accent-primary-500"
                  />
                  <span className={`text-sm transition-colors group-hover:text-gray-950 ${isChecked ? 'text-gray-950 font-semibold' : 'text-gray-600'}`}>
                    {category.name}
                  </span>
                  {category.count !== undefined && (
                    <span className="ml-auto text-xs text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded-full">
                      ({category.count})
                    </span>
                  )}
                </label>
              </li>
            );
          })}
          {productsCategories.length === 0 && (
            <span className="text-xs text-gray-400">Категорії завантажуються...</span>
          )}
        </ul>
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
