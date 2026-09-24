'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  TableProperties,
  Search,
  Save,
  RotateCcw,
  Check,
  Filter,
  AlertTriangle,
  Loader2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetProductsQuery,
  useQuickUpdateProductMutation,
  useBatchQuickUpdateProductMutation,
} from '@/lib/appState/api/productsApi';
import { useGetCategoriesQuery } from '@/lib/appState/api/categoriesApi';
import { Product } from '@/lib/types';
import clsx from 'clsx';

// ==========================================
// Types
// ==========================================

interface DraftProduct {
  name: string;
  priceRetailRecommendation: number;
  rrcSale: number;
  countInStock: number;
}

type TabType = 'all' | 'invalid' | 'draft' | 'outOfStock';

// ==========================================
// Main Component
// ==========================================

export default function ProductSheetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <ProductSheetsContent />
    </Suspense>
  );
}

function ProductSheetsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-bound filters
  const searchQuery = searchParams?.get('q') || '';
  const selectedCategory = searchParams?.get('cat') || 'all';
  const activeTab = (searchParams?.get('tab') as TabType) || 'all';
  const currentPage = Math.max(1, Number(searchParams?.get('page')) || 1);
  const pageSizeParam = searchParams?.get('pageSize') || '50';
  const pageSize = pageSizeParam === 'all' ? 1000 : Number(pageSizeParam);

  // Drafts state: product.id -> DraftProduct
  const [drafts, setDrafts] = useState<Record<number, DraftProduct>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  // Image preview modal state
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  // RTK Query: fetch all products (up to 500) for instant table performance
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({
    page: 1,
    limit: 500,
    isRetail: false,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  const [quickUpdateProduct] = useQuickUpdateProductMutation();
  const [batchQuickUpdateProduct, { isLoading: isBatchSaving }] =
    useBatchQuickUpdateProductMutation();

  const allProducts = useMemo(() => productsData?.products || [], [productsData]);

  // URL State helpers
  const updateUrlParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      Object.entries(updates).forEach(([key, val]) => {
        if (
          val === null ||
          val === '' ||
          (key === 'cat' && val === 'all') ||
          (key === 'tab' && val === 'all')
        ) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Beforeunload protection against accidental tab closure with unsaved edits
  const dirtyCount = Object.keys(drafts).length;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirtyCount]);

  // Batch Save all dirty items
  const handleBatchSave = useCallback(async () => {
    const entries = Object.entries(drafts);
    if (entries.length === 0) return;

    // Pre-validation: ensure no items exceed 100 chars
    const invalidItems = entries.filter(([, draft]) => draft.name.length > 100);
    if (invalidItems.length > 0) {
      toast.error(
        `Неможливо зберегти: ${invalidItems.length} товар(ів) мають назву довшу за 100 символів. Скоротіть їх перед збереженням.`,
      );
      updateUrlParam({ tab: 'invalid', page: '1' });
      return;
    }

    try {
      const items = entries.map(([idStr, draft]) => ({
        id: Number(idStr),
        data: {
          name: draft.name.trim(),
          priceRetailRecommendation: Number(draft.priceRetailRecommendation),
          rrcSale: Number(draft.rrcSale),
          countInStock: Number(draft.countInStock),
        },
      }));

      const res = await batchQuickUpdateProduct({ items }).unwrap();
      setDrafts({});
      toast.success(`Успішно оновлено ${res.updatedCount} товарів!`);
    } catch {
      toast.error('Помилка при збереженні змін');
    }
  }, [drafts, updateUrlParam, batchQuickUpdateProduct]);

  // Keyboard shortcut: Ctrl+S / Cmd+S for batch save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirtyCount > 0 && !isBatchSaving) {
          handleBatchSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dirtyCount, isBatchSaving, handleBatchSave]);

  // Update specific field in drafts
  const handleFieldChange = (
    product: Product,
    field: keyof DraftProduct,
    value: string | number,
  ) => {
    setDrafts((prev) => {
      const currentDraft: DraftProduct = prev[product.id] || {
        name: product.name,
        priceRetailRecommendation: Number(product.priceRetailRecommendation) || 0,
        rrcSale: Number(product.rrcSale) || 0,
        countInStock: Number(product.countInStock) || 0,
      };

      const updatedDraft: DraftProduct = {
        ...currentDraft,
        [field]: value,
      };

      // Check if draft matches server product exactly
      const isOriginal =
        updatedDraft.name === product.name &&
        Number(updatedDraft.priceRetailRecommendation) ===
          Number(product.priceRetailRecommendation || 0) &&
        Number(updatedDraft.rrcSale) === Number(product.rrcSale || 0) &&
        Number(updatedDraft.countInStock) === Number(product.countInStock || 0);

      if (isOriginal) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }

      return {
        ...prev,
        [product.id]: updatedDraft,
      };
    });
  };

  // Revert single product draft
  const handleResetRow = (productId: number) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  // Revert all unsaved drafts
  const handleResetAll = () => {
    if (dirtyCount === 0) return;
    setDrafts({});
    toast.info('Всі незбережені зміни скинуто');
  };

  // Save single row
  const handleSaveRow = async (product: Product) => {
    const draft = drafts[product.id];
    if (!draft) return;

    if (draft.name.length > 100) {
      toast.error(
        `Назва товару "${product.article}" перевищує 100 символів (${draft.name.length}/100)`,
      );
      return;
    }

    if (draft.name.trim().length < 2) {
      toast.error(`Назва товару "${product.article}" занадто коротка`);
      return;
    }

    setSavingId(product.id);
    try {
      await quickUpdateProduct({
        id: product.id,
        data: {
          name: draft.name.trim(),
          priceRetailRecommendation: Number(draft.priceRetailRecommendation),
          rrcSale: Number(draft.rrcSale),
          countInStock: Number(draft.countInStock),
        },
      }).unwrap();

      setDrafts((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });

      toast.success(`Товар ${product.article} успішно збережено`);
    } catch {
      toast.error(`Не вдалося зберегти товар ${product.article}`);
    } finally {
      setSavingId(null);
    }
  };

  // Keyboard Enter handler for row saving
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, product: Product) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      handleSaveRow(product);
    }
  };

  // Helper stats across full catalog
  const { totalInvalidCount, totalOutOfStockCount } = useMemo(() => {
    let invalid = 0;
    let outOfStock = 0;

    for (const p of allProducts) {
      const currentName = drafts[p.id]?.name ?? p.name;
      const currentStock = drafts[p.id]?.countInStock ?? p.countInStock;

      if (currentName.length > 100) invalid++;
      if (Number(currentStock) <= 0) outOfStock++;
    }

    return { totalInvalidCount: invalid, totalOutOfStockCount: outOfStock };
  }, [allProducts, drafts]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Text search (article or name)
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase().trim();
        const articleMatch = product.article.toLowerCase().includes(queryLower);
        const nameMatch = (drafts[product.id]?.name ?? product.name)
          .toLowerCase()
          .includes(queryLower);
        if (!articleMatch && !nameMatch) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const catId = Number(selectedCategory);
        const matchesCategory =
          product.category?.id === catId ||
          product.mainCategory?.id === catId ||
          product.categories?.some((c) => c.id === catId);
        if (!matchesCategory) return false;
      }

      // 3. Tab filter
      const currentName = drafts[product.id]?.name ?? product.name;
      const currentStock = drafts[product.id]?.countInStock ?? product.countInStock;
      const isDirty = product.id in drafts;

      if (activeTab === 'invalid') {
        return currentName.length > 100;
      }
      if (activeTab === 'draft') {
        return isDirty;
      }
      if (activeTab === 'outOfStock') {
        return Number(currentStock) <= 0;
      }

      return true;
    });
  }, [allProducts, searchQuery, selectedCategory, activeTab, drafts]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, safePage, pageSize]);

  return (
    <div className="w-full max-w-full space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-neutral-950 shadow-sm">
              <TableProperties className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl">
              Швидкий редактор
            </h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Пакетне та швидке редагування назв, цін та залишків. Контроль довжини назви для
            monoмаркету (до 100 символів).
          </p>
        </div>

        {/* Global Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            <span>Всього товарів: {allProducts.length}</span>
          </div>

          {dirtyCount > 0 && (
            <div className="inline-flex animate-pulse items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Незбережених: {dirtyCount}</span>
            </div>
          )}

          {totalInvalidCount > 0 && (
            <button
              onClick={() => updateUrlParam({ tab: 'invalid', page: '1' })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 shadow-2xs transition-colors hover:bg-red-100"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
              <span>Потребують скорочення: {totalInvalidCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Action Bar & Filter Toolbar */}
      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        {/* Row 1: Search, Category, and Action Buttons */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Пошук за артикулом або назвою..."
                value={searchQuery}
                onChange={(e) => updateUrlParam({ q: e.target.value, page: '1' })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2 pr-3 pl-9 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => updateUrlParam({ q: null, page: '1' })}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="relative sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => updateUrlParam({ cat: e.target.value, page: '1' })}
                className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50/50 py-2 pr-8 pl-3 text-sm text-neutral-800 transition-colors focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              >
                <option value="all">Всі категорії ({allProducts.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          {/* Action Buttons: Batch Save & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAll}
              disabled={dirtyCount === 0 || isBatchSaving}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3.5 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-neutral-400/20 focus:outline-none',
                dirtyCount === 0
                  ? 'cursor-not-allowed bg-neutral-100 text-neutral-400'
                  : 'bg-white text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900',
              )}
              title="Скинути всі незбережені зміни"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Скинути</span>
            </button>

            <button
              onClick={handleBatchSave}
              disabled={dirtyCount === 0 || isBatchSaving}
              className={clsx(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-amber-500/40 focus:outline-none',
                dirtyCount === 0
                  ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                  : 'bg-amber-500 text-neutral-950 shadow-amber-500/20 hover:bg-amber-400',
              )}
              title="Зберегти всі незбережені зміни (Ctrl+S)"
            >
              {isBatchSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Зберегти зміни {dirtyCount > 0 ? `(${dirtyCount})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Tabs Filter & Page Size */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => updateUrlParam({ tab: 'all', page: '1' })}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900',
              )}
            >
              Всі товари ({allProducts.length})
            </button>

            <button
              onClick={() => updateUrlParam({ tab: 'invalid', page: '1' })}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'invalid'
                  ? 'bg-red-600 text-white shadow-xs'
                  : totalInvalidCount > 0
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              )}
            >
              {totalInvalidCount > 0 && <AlertTriangle size={12} />}
              <span>Назва &gt; 100 симв. ({totalInvalidCount})</span>
            </button>

            <button
              onClick={() => updateUrlParam({ tab: 'draft', page: '1' })}
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'draft'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : dirtyCount > 0
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              )}
            >
              <span>Змінені ({dirtyCount})</span>
            </button>

            <button
              onClick={() => updateUrlParam({ tab: 'outOfStock', page: '1' })}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                activeTab === 'outOfStock'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900',
              )}
            >
              Немає на складі ({totalOutOfStockCount})
            </button>
          </div>

          {/* Page Size & Result summary */}
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span>Знайдено: {totalItems}</span>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1">
              <span>Показувати:</span>
              {(['50', '100', 'all'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateUrlParam({ pageSize: size, page: '1' })}
                  className={clsx(
                    'rounded px-2 py-0.5 font-medium transition-colors',
                    pageSizeParam === size
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                  )}
                >
                  {size === 'all' ? 'Всі' : size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-800">
            <thead className="border-b border-neutral-200 bg-neutral-100/90 text-xs font-bold tracking-wider text-neutral-600 uppercase">
              <tr>
                <th className="w-12 px-3 py-3 text-center">#</th>
                <th className="w-14 px-2 py-3 text-center">Фото</th>
                <th className="w-36 px-3 py-3">Артикул</th>
                <th className="min-w-[340px] px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span>Назва товару</span>
                    <span className="text-[11px] font-normal text-neutral-500 lowercase">
                      (ліміт monoмаркету: 100 симв.)
                    </span>
                  </div>
                </th>
                <th className="w-28 px-3 py-3 text-right">РРЦ, ₴</th>
                <th className="w-28 px-3 py-3 text-right">Акція, ₴</th>
                <th className="w-24 px-3 py-3 text-right">Склад, шт</th>
                <th className="w-24 px-3 py-3 text-center">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isProductsLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                      <p className="text-sm">Завантаження товарів...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                      <Search className="h-8 w-8 text-neutral-300" />
                      <p className="font-semibold text-neutral-700">Товарів не знайдено</p>
                      <p className="text-xs text-neutral-400">
                        Спробуйте змінити фільтри або параметри пошуку
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, idx) => {
                  const draft = drafts[product.id];
                  const isDirty = Boolean(draft);

                  const nameValue = draft?.name ?? product.name;
                  const priceRecValue =
                    draft?.priceRetailRecommendation ?? product.priceRetailRecommendation;
                  const rrcSaleValue = draft?.rrcSale ?? product.rrcSale ?? 0;
                  const stockValue = draft?.countInStock ?? product.countInStock;

                  const nameLength = nameValue.length;
                  const isLengthInvalid = nameLength > 100;
                  const isRowSaving = savingId === product.id;

                  const globalIndex = (safePage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={product.id}
                      className={clsx(
                        'transition-colors',
                        isDirty
                          ? 'border-l-4 border-l-amber-500 bg-amber-50/60 hover:bg-amber-50/90'
                          : isLengthInvalid
                            ? 'border-l-4 border-l-red-500 bg-red-50/60 hover:bg-red-50/90'
                            : 'hover:bg-neutral-50/80',
                      )}
                    >
                      {/* Index */}
                      <td className="px-3 py-2 text-center text-xs text-neutral-400">
                        {globalIndex}
                      </td>

                      {/* Image Thumbnail */}
                      <td className="px-2 py-2 text-center">
                        <ProductThumbnail
                          product={product}
                          onPreview={() =>
                            setPreviewImage({
                              src: getProductImageUrl(product.image),
                              alt: product.name,
                            })
                          }
                        />
                      </td>

                      {/* Article Badge & Store Link */}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/dashboard/product/edit/${product.id}`}
                            className="font-mono text-xs font-semibold text-neutral-800 transition-colors hover:text-amber-600 hover:underline"
                            title="Редагувати в повній формі"
                          >
                            {product.article}
                          </Link>
                          {product.slug && (
                            <a
                              href={`/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 transition-colors hover:text-blue-600"
                              title="Переглянути товар у магазині"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Name input with live character counter */}
                      <td className="px-3 py-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={nameValue}
                            onChange={(e) => handleFieldChange(product, 'name', e.target.value)}
                            onKeyDown={(e) => handleInputKeyDown(e, product)}
                            className={clsx(
                              'w-full rounded-lg border py-1.5 pr-20 pl-2.5 text-xs transition-colors focus:ring-2 focus:outline-none',
                              isLengthInvalid
                                ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500/20'
                                : isDirty
                                  ? 'border-amber-300 bg-white text-neutral-900 focus:border-amber-500 focus:ring-amber-500/20'
                                  : 'border-neutral-200 bg-neutral-50/40 text-neutral-800 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20',
                            )}
                          />

                          {/* Live Character Counter Badge */}
                          <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
                            <span
                              className={clsx(
                                'inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                                nameLength <= 80
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : nameLength <= 100
                                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                                    : 'animate-pulse border-red-400 bg-red-100 font-bold text-red-700',
                              )}
                            >
                              {nameLength} / 100
                            </span>
                          </div>
                        </div>
                        {isLengthInvalid && (
                          <p className="mt-1 text-[11px] font-medium text-red-600">
                            Перевищено ліміт monoмаркету на {nameLength - 100} симв.
                          </p>
                        )}
                      </td>

                      {/* Retail Recommended Price (РРЦ) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={priceRecValue}
                          onChange={(e) =>
                            handleFieldChange(
                              product,
                              'priceRetailRecommendation',
                              Math.max(0, Number(e.target.value) || 0),
                            )
                          }
                          onKeyDown={(e) => handleInputKeyDown(e, product)}
                          className={clsx(
                            'w-24 rounded-lg border px-2 py-1.5 text-right text-xs font-semibold transition-colors focus:ring-2 focus:outline-none',
                            isDirty
                              ? 'border-amber-300 bg-white focus:border-amber-500 focus:ring-amber-500/20'
                              : 'border-neutral-200 bg-neutral-50/40 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20',
                          )}
                        />
                      </td>

                      {/* Promo Sale Price (Акція) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={rrcSaleValue}
                          onChange={(e) =>
                            handleFieldChange(
                              product,
                              'rrcSale',
                              Math.max(0, Number(e.target.value) || 0),
                            )
                          }
                          onKeyDown={(e) => handleInputKeyDown(e, product)}
                          className={clsx(
                            'w-24 rounded-lg border px-2 py-1.5 text-right text-xs font-semibold transition-colors focus:ring-2 focus:outline-none',
                            Number(rrcSaleValue) > 0
                              ? 'border-red-200 bg-red-50/30 font-bold text-red-600'
                              : 'text-neutral-500',
                            isDirty
                              ? 'border-amber-300 bg-white focus:border-amber-500 focus:ring-amber-500/20'
                              : 'border-neutral-200 bg-neutral-50/40 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20',
                          )}
                        />
                      </td>

                      {/* Stock Count (Склад) */}
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={stockValue}
                          onChange={(e) =>
                            handleFieldChange(
                              product,
                              'countInStock',
                              Math.max(0, Math.floor(Number(e.target.value) || 0)),
                            )
                          }
                          onKeyDown={(e) => handleInputKeyDown(e, product)}
                          className={clsx(
                            'w-20 rounded-lg border px-2 py-1.5 text-right text-xs font-semibold transition-colors focus:ring-2 focus:outline-none',
                            Number(stockValue) <= 0
                              ? 'bg-neutral-100 text-neutral-400'
                              : 'text-emerald-700',
                            isDirty
                              ? 'border-amber-300 bg-white focus:border-amber-500 focus:ring-amber-500/20'
                              : 'border-neutral-200 bg-neutral-50/40 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20',
                          )}
                        />
                      </td>

                      {/* Row Actions */}
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isDirty ? (
                            <>
                              <button
                                onClick={() => handleSaveRow(product)}
                                disabled={isLengthInvalid || isRowSaving}
                                className={clsx(
                                  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus:outline-none',
                                  isLengthInvalid
                                    ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                                    : 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-500',
                                )}
                                title={
                                  isLengthInvalid
                                    ? 'Скоротіть назву до 100 символів для збереження'
                                    : 'Зберегти цей товар (Enter)'
                                }
                              >
                                {isRowSaving ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleResetRow(product.id)}
                                disabled={isRowSaving}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                                title="Скинути зміни для цього товару"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-neutral-400">Збережено</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50/50 px-4 py-3 sm:flex-row">
            <span className="text-xs text-neutral-500">
              Сторінка {safePage} з {totalPages} (показано{' '}
              {Math.min(totalItems, (safePage - 1) * pageSize + 1)}–
              {Math.min(totalItems, safePage * pageSize)} з {totalItems})
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateUrlParam({ page: String(safePage - 1) })}
                disabled={safePage <= 1}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                  safePage <= 1
                    ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400'
                    : 'border-neutral-200 bg-white text-neutral-700 shadow-2xs hover:bg-neutral-50',
                )}
              >
                <ChevronLeft size={14} />
                <span>Попередня</span>
              </button>

              <button
                onClick={() => updateUrlParam({ page: String(safePage + 1) })}
                disabled={safePage >= totalPages}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                  safePage >= totalPages
                    ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400'
                    : 'border-neutral-200 bg-white text-neutral-700 shadow-2xs hover:bg-neutral-50',
                )}
              >
                <span>Наступна</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal for Product Image */}
      {previewImage && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-neutral-100 p-1.5 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-800"
            >
              <X size={18} />
            </button>
            <div className="relative mx-auto h-80 w-80 sm:h-96 sm:w-96">
              <Image
                src={previewImage.src}
                alt={previewImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 320px, 384px"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-center text-xs font-semibold text-neutral-700">
              {previewImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Subcomponents & Helpers
// ==========================================

function ProductThumbnail({ product, onPreview }: { product: Product; onPreview: () => void }) {
  const imgSrc = getProductImageUrl(product.image);

  return (
    <div
      onClick={onPreview}
      className="group relative mx-auto h-9 w-9 cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 transition-transform hover:scale-110"
      title="Натисніть для перегляду"
    >
      <Image src={imgSrc} alt={product.name} fill className="object-contain" sizes="36px" />
    </div>
  );
}

function getProductImageUrl(image?: string | null): string {
  if (!image) return '/placeholder.webp';
  if (image.startsWith('http')) return image;
  const baseUrl = process.env.NEXT_PUBLIC_API || '';
  return `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
}
