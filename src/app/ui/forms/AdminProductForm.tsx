'use client';

import { FormEvent, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Category,
  Product,
  ProductCharacteristic,
  CharacteristicState,
  ProductAttribute,
  Badge,
} from '@/lib/types';
import Icon from '../assets/Icon';
import {
  CircleHelp,
  ArrowLeft,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

const questionSvg = (
  <span>
    <CircleHelp size={16} className="text-neutral-400 transition-colors hover:text-neutral-500" />
  </span>
);

import { apiIngco } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import ConfirmModal from '@/app/ui/modals/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { createProductThunk, updateProductThunk } from '@/lib/appState/dashboard/operations';

type AdminProductFormProps = {
  isEdit?: boolean;
  product?: Product;
};

interface MediaItem {
  id: string;
  file?: File;
  previewUrl: string;
  isExisting: boolean;
  path?: string;
}

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function getSortedHierarchy(categories: Category[]): (Category & { depth: number })[] {
  if (!categories || categories.length === 0) return [];

  const map = new Map<number, CategoryNode>();
  categories.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  const roots: CategoryNode[] = [];
  categories.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId) {
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

  const flatten = (nodes: CategoryNode[], depth = 0): (Category & { depth: number })[] => {
    const result: (Category & { depth: number })[] = [];
    nodes.forEach((node) => {
      const { children, ...rest } = node;
      result.push({ ...rest, depth });
      result.push(...flatten(children, depth + 1));
    });
    return result;
  };

  return flatten(roots);
}

const AdminProductForm = ({ product, isEdit = false }: AdminProductFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.persistedMainReducer.categories);

  const [characteristics, setCharacteristics] = useState<ProductCharacteristic[]>(
    () => product?.characteristics || [],
  );
  const [characteristic, setCharacteristic] = useState<CharacteristicState>({
    code: '',
    name: '',
    value: '',
    unit: '',
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    () => product?.categories?.map((c) => c.id) || [],
  );

  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | ''>(
    () => product?.mainCategory?.id || product?.category?.id || '',
  );
  const [prevMainCategoryId, setPrevMainCategoryId] = useState<number | ''>(selectedMainCategoryId);
  const [availableAttributes, setAvailableAttributes] = useState<ProductAttribute[]>([]);
  const [selectedAttrCode, setSelectedAttrCode] = useState<string>('');
  const [isAddingNewOption, setIsAddingNewOption] = useState<boolean>(false);
  const [newOptionValue, setNewOptionValue] = useState<string>('');

  // Media files state
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);

  // Badges state
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<number[]>(
    () => product?.badges?.map((b) => b.id) || [],
  );
  const [newBadgeName, setNewBadgeName] = useState('');
  const [newBadgeBgColor, setNewBadgeBgColor] = useState('#000000');
  const [newBadgeTextColor, setNewBadgeTextColor] = useState('#ffffff');
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<Badge | null>(null);

  // Draft & LocalStorage state
  const draftKey = useMemo(
    () => (product?.id ? `ingco_product_edit_draft_${product.id}` : 'ingco_product_create_draft'),
    [product?.id],
  );

  const [draftData, setDraftData] = useState<Record<string, unknown> | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [hasDraft, setHasDraft] = useState<boolean>(() => draftData !== null);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(draftKey);
    }
    setHasDraft(false);
    setDraftData(null);
  };

  const handleRestoreDraft = () => {
    if (!draftData) return;
    if (Array.isArray(draftData.characteristics)) {
      setCharacteristics(draftData.characteristics as ProductCharacteristic[]);
    }
    if (Array.isArray(draftData.selectedCategoryIds)) {
      setSelectedCategoryIds(draftData.selectedCategoryIds as number[]);
    }
    if (draftData.selectedMainCategoryId !== undefined) {
      setSelectedMainCategoryId(draftData.selectedMainCategoryId as number | '');
    }
    if (Array.isArray(draftData.selectedBadgeIds)) {
      setSelectedBadgeIds(draftData.selectedBadgeIds as number[]);
    }
    toast.success('Чернетку відновлено');
  };

  const handleResetToInitial = () => {
    clearDraft();
    if (product) {
      setCharacteristics(product.characteristics || []);
      setSelectedCategoryIds(product.categories?.map((c) => c.id) || []);
      setSelectedMainCategoryId(product.mainCategory?.id || product.category?.id || '');
      setSelectedBadgeIds(product.badges?.map((b) => b.id) || []);
    }
    toast.info('Дані скинуто до початкового стану');
  };

  const handleCancelAndLeave = () => {
    clearDraft();
    router.back();
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/badges`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableBadges(data);
        }
      })
      .catch((err) => console.error('Failed to fetch badges:', err));
  }, []);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (product) {
      const initialImages =
        product.images && product.images.length > 0
          ? product.images
          : product.image
            ? [product.image]
            : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMediaFiles(
        initialImages.map((path, idx) => ({
          id: `existing-${idx}-${path}`,
          previewUrl: path.startsWith('http') ? path : process.env.NEXT_PUBLIC_API + path,
          isExisting: true,
          path: path,
        })),
      );
      setCharacteristics(product.characteristics || []);
      setSelectedCategoryIds(product.categories?.map((c) => c.id) || []);
      setSelectedMainCategoryId(product.mainCategory?.id || product.category?.id || '');
      setSelectedBadgeIds(product.badges?.map((b) => b.id) || []);
    }
  }, [product]);

  const handleDeleteBadge = (badge: Badge) => {
    setBadgeToDelete(badge);
  };

  const handleCreateBadge = async () => {
    const name = newBadgeName.trim();
    if (!name) {
      toast.warning('Назва бейджа не може бути порожньою');
      return;
    }
    try {
      const response = await apiIngco.post('/badges', {
        name,
        backgroundColor: newBadgeBgColor,
        textColor: newBadgeTextColor,
      });
      const createdBadge = response.data;
      setAvailableBadges((prev) =>
        [...prev, createdBadge].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setSelectedBadgeIds((prev) => [...prev, createdBadge.id]);

      // Reset form
      setNewBadgeName('');
      setNewBadgeBgColor('#000000');
      setNewBadgeTextColor('#ffffff');
      setIsAddingBadge(false);
      toast.success('Бейдж успішно створено');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Помилка створення бейджа';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const characteristicsArr = characteristics.map((c) => ({
      code: c.code || c.name.toLowerCase().replace(/\s+/g, '_'),
      value: c.value,
    }));

    formData.append('characteristics', JSON.stringify(characteristicsArr));
    formData.append('categoryIds', JSON.stringify(selectedCategoryIds));
    formData.append('badgeIds', JSON.stringify(selectedBadgeIds));
    formData.delete('characteristicName');
    formData.delete('characteristicDesc');
    formData.delete('image'); // Delete standard file field to avoid duplicates

    // Append images
    const existingPaths: string[] = [];
    mediaFiles.forEach((item) => {
      if (item.isExisting && item.path) {
        existingPaths.push(item.path);
      } else if (item.file) {
        formData.append('images', item.file);
      }
    });

    if (isEdit) {
      formData.append('existingImages', JSON.stringify(existingPaths));
    }

    try {
      if (isEdit && product) {
        await dispatch(updateProductThunk({ formData, productId: String(product.id) })).unwrap();
        toast.success('Продукт успішно оновлено');
      } else {
        const hasFiles = mediaFiles.length > 0;
        if (!hasFiles) {
          toast.error('Будь ласка, завантажте хоча б одне зображення');
          return;
        }
        await dispatch(createProductThunk(formData)).unwrap();
        toast.success('Продукт успішно створено');
      }
      clearDraft();
      router.back();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Помилка збереження';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  if (selectedMainCategoryId !== prevMainCategoryId) {
    setPrevMainCategoryId(selectedMainCategoryId);
    if (!selectedMainCategoryId) {
      setAvailableAttributes([]);
    }
  }

  useEffect(() => {
    if (selectedMainCategoryId) {
      fetch(`${process.env.NEXT_PUBLIC_API}/api/categories/${selectedMainCategoryId}/attributes`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailableAttributes(data);
          }
        })
        .catch((err) => console.error('Failed to fetch category attributes:', err));
    }
  }, [selectedMainCategoryId]);

  const moveCharacteristic = (index: number, direction: 'up' | 'down') => {
    setCharacteristics((prev) => {
      const newChars = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newChars.length) return prev;
      const temp = newChars[index];
      newChars[index] = newChars[targetIndex];
      newChars[targetIndex] = temp;
      return newChars;
    });
  };

  const sortedCategories = useMemo(() => getSortedHierarchy(categories), [categories]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 font-sans">
      {/* Premium Dashboard Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCancelAndLeave}
            className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-500 shadow-sm transition-all select-none hover:bg-neutral-50 hover:text-neutral-800"
            title="Назад"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
              Панель керування
            </span>
            <h1 className="font-display text-2xl leading-tight font-bold text-neutral-900">
              {isEdit ? 'Редагування продукту' : 'Створення продукту'}
            </h1>
          </div>
        </div>

        {isEdit && product?.slug && (
          <a
            href={`/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-900"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">Переглянути в магазині</span>
          </a>
        )}
      </div>

      {/* Unsaved draft alert banner */}
      {hasDraft && (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300/80 bg-amber-50/90 p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-amber-200/80 p-2.5 text-amber-800">
              <RotateCcw size={20} />
            </div>
            <div className="flex flex-col">
              <h4 className="font-display text-sm font-bold text-amber-950">
                Знайдено незбережену чернетку для цього товару
              </h4>
              <p className="font-sans text-xs text-amber-800">
                Ви можете відновити збережені зміни або очистити чернетку та повернутися до
                початкових даних.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 font-sans text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-700"
            >
              Відновити чернетку
            </button>
            <button
              type="button"
              onClick={() => {
                clearDraft();
                toast.info('Чернетку очищено');
              }}
              className="cursor-pointer rounded-xl border border-amber-300 bg-white px-4 py-2 font-sans text-xs font-semibold text-amber-900 transition-all hover:bg-amber-100"
            >
              Очистити
            </button>
          </div>
        </div>
      )}

      <form className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12" onSubmit={handleSubmit}>
        {/* Left column: Product Specs, Data, Characteristics */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Card 1: General Info */}
          <div className="flex flex-col gap-5 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-sm font-bold tracking-wider text-neutral-800 uppercase">
              Основна інформація
            </h2>

            {/* Name input */}
            <div className="flex flex-col">
              <label className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                <span>Найменування</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                defaultValue={product?.name}
                required
                placeholder="Введіть повну назву інструменту..."
                className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
              />
            </div>

            {/* Grid rows for Category & Specs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <span>Артикул</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="article"
                  defaultValue={product?.article}
                  placeholder="Наприклад: HPET1103"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Основна (Канонічна) категорія
                </label>
                <select
                  name="mainCategoryId"
                  className="focus:border-primary-500 w-full cursor-pointer rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
                  value={selectedMainCategoryId}
                  onChange={(e) =>
                    setSelectedMainCategoryId(e.target.value ? Number(e.target.value) : '')
                  }
                >
                  <option value="">Не обрано</option>
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {'\u00A0'.repeat(category.depth * 4)}
                      {category.depth > 0 ? '└─ ' : ''}
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checklist for additional categories */}
              <div className="col-span-1 mt-2 flex flex-col md:col-span-2">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <span>Додаткові категорії відображення</span>
                  <span
                    className="cursor-help"
                    title="Дозволяє товару відображатися в кількох розділах, наприклад в Акціях чи Топах продажів."
                  >
                    {questionSvg}
                  </span>
                </label>
                <div className="flex max-h-[200px] flex-col gap-2.5 overflow-y-auto rounded-xl border border-neutral-200 bg-[#FAFAFF] p-4 font-semibold shadow-inner">
                  {sortedCategories.map((category) => {
                    const isChecked = selectedCategoryIds.includes(category.id);
                    return (
                      <label
                        key={category.id}
                        className="group flex cursor-pointer items-center gap-3 py-0.5 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCategoryIds((prev) =>
                                prev.filter((id) => id !== category.id),
                              );
                            } else {
                              setSelectedCategoryIds((prev) => [...prev, category.id]);
                            }
                          }}
                          className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
                        />
                        <span
                          style={{ paddingLeft: `${category.depth * 16}px` }}
                          className={`text-sm transition-colors group-hover:text-gray-950 ${
                            isChecked ? 'font-semibold text-gray-950' : 'text-gray-600'
                          }`}
                        >
                          {category.depth > 0 && (
                            <span className="mr-1 font-mono text-neutral-400">└─</span>
                          )}
                          {category.name}
                        </span>
                      </label>
                    );
                  })}
                  {sortedCategories.length === 0 && (
                    <span className="text-xs text-neutral-400">Категорії відсутні</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Штрихкод
                </label>
                <input
                  type="text"
                  name="barcode"
                  defaultValue={product?.barcode}
                  placeholder="Штрихкод EAN-13"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Сортування (Пріоритет)
                </label>
                <input
                  type="number"
                  step={1}
                  name="sort"
                  defaultValue={product?.sort || 0}
                  placeholder="0"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description textarea */}
            <div className="flex flex-col">
              <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                Опис товару
              </label>
              <textarea
                name="description"
                placeholder="Введіть детальний опис інструменту, його функцій та переваг..."
                defaultValue={product?.description ?? ''}
                required
                className="focus:border-primary-500 min-h-[120px] w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 font-sans text-sm leading-relaxed text-neutral-700 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: Pricing & Stock */}
          <div className="flex flex-col gap-5 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-sm font-bold tracking-wider text-neutral-800 uppercase">
              Ціноутворення та наявність
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Прихідна ціна ($)
                </label>
                <input
                  type="number"
                  name="enterPrice"
                  step="0.001"
                  placeholder="0.00"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  defaultValue={product?.enterPrice || 0}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <span>Ціна ($)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.001"
                  defaultValue={product?.price}
                  placeholder="0.00"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <span>РРЦ (₴)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  defaultValue={product?.priceRetailRecommendation}
                  name="priceRetailRecommendation"
                  placeholder="0"
                  step="0.1"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  РРЦ зі знижкою (₴)
                </label>
                <input
                  type="number"
                  name="rrcSale"
                  defaultValue={product?.rrcSale || 0}
                  step="0.001"
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <span>К-сть в наявності</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="countInStock"
                  defaultValue={product?.countInStock}
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Гарантія (міс)
                </label>
                <input
                  type="number"
                  step={1}
                  name="warranty"
                  defaultValue={product?.warranty || 24}
                  className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 3: Characteristics */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-800 uppercase">
                Характеристики інструменту
              </h2>
              <span
                className="cursor-help"
                title="Якщо потрібна суто лиш назва, то в значені хар-ки прописуємо мінус ( - )
В картці роздрібного магазину відображається тільки перші 3 характеристики і в них обмеження на 25 символів."
              >
                {questionSvg}
              </span>
            </div>

            {/* Inputs inline */}
            <div className="flex flex-col items-end gap-3 md:flex-row">
              <div className="flex min-w-[200px] flex-grow flex-col">
                <label className="mb-1 text-[10px] font-bold text-neutral-400 uppercase">
                  Назва характеристики
                </label>
                {selectedAttrCode === '__custom__' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Назва нової характеристики..."
                      className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
                      value={characteristic.name}
                      onChange={(e) =>
                        setCharacteristic((prev: CharacteristicState) => ({
                          ...prev,
                          name: e.target.value,
                          code: e.target.value
                            ? e.target.value.toLowerCase().replace(/\s+/g, '_')
                            : '',
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAttrCode('');
                        setCharacteristic({ code: '', name: '', value: '', unit: '', options: [] });
                      }}
                      className="shrink-0 cursor-pointer text-xs font-semibold text-rose-500 underline hover:text-rose-700"
                    >
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <select
                    className="focus:border-primary-500 w-full cursor-pointer rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
                    value={selectedAttrCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setSelectedAttrCode(code);
                      setIsAddingNewOption(false);
                      setNewOptionValue('');
                      if (code === '__custom__') {
                        setCharacteristic({
                          code: '',
                          name: '',
                          value: '',
                          unit: '',
                          options: [],
                        });
                      } else {
                        const attr = availableAttributes.find((a) => a.code === code);
                        if (attr) {
                          setCharacteristic({
                            code: attr.code,
                            name: attr.name,
                            value: '',
                            unit: attr.unit || '',
                            options: attr.options || [],
                          });
                        } else {
                          setCharacteristic({
                            code: '',
                            name: '',
                            value: '',
                            unit: '',
                            options: [],
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Оберіть характеристику...</option>
                    {availableAttributes.map((attr) => (
                      <option key={attr.code} value={attr.code}>
                        {attr.name} {attr.unit ? `(${attr.unit})` : ''}
                      </option>
                    ))}
                    <option value="__custom__" className="text-primary-600 font-bold">
                      + Додати нову (якої немає в списку)...
                    </option>
                  </select>
                )}
              </div>

              <div className="flex min-w-[200px] flex-grow flex-col">
                <label className="mb-1 text-[10px] font-bold text-neutral-400 uppercase">
                  Значення характеристики
                </label>
                {characteristic.options && characteristic.options.length > 0 ? (
                  isAddingNewOption ? (
                    <div className="flex w-full items-center gap-2">
                      <input
                        type="text"
                        placeholder="Введіть нове значення..."
                        className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
                        value={newOptionValue}
                        onChange={(e) => setNewOptionValue(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = newOptionValue.trim();
                          if (!val) {
                            toast.warning('Значення не може бути порожнім');
                            return;
                          }
                          const attr = availableAttributes.find(
                            (a) => a.code === characteristic.code,
                          );
                          if (!attr) {
                            toast.error('Атрибут не знайдено');
                            return;
                          }
                          if (attr.options?.includes(val)) {
                            toast.warning('Таке значення вже існує');
                            return;
                          }
                          const updatedOptions = [...(attr.options || []), val];
                          apiIngco
                            .patch(`/attributes/${attr.id}`, { options: updatedOptions })
                            .then(() => {
                              setAvailableAttributes((prev) =>
                                prev.map((a) =>
                                  a.id === attr.id ? { ...a, options: updatedOptions } : a,
                                ),
                              );
                              setCharacteristic((prev: CharacteristicState) => ({
                                ...prev,
                                options: updatedOptions,
                                value: val,
                              }));
                              setIsAddingNewOption(false);
                              setNewOptionValue('');
                              toast.success('Значення успішно додано до шаблону');
                            })
                            .catch((err) => {
                              const msg =
                                err.response?.data?.message || 'Не вдалося зберегти нове значення';
                              toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                            });
                        }}
                        className="shrink-0 cursor-pointer rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-green-600"
                      >
                        Зберегти
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewOption(false);
                          setNewOptionValue('');
                          setCharacteristic((prev: CharacteristicState) => ({
                            ...prev,
                            value: '',
                          }));
                        }}
                        className="shrink-0 cursor-pointer rounded-lg bg-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-300"
                      >
                        Скасувати
                      </button>
                    </div>
                  ) : (
                    <select
                      className="focus:border-primary-500 w-full cursor-pointer rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm font-semibold text-neutral-800 transition-all focus:bg-white focus:outline-none"
                      value={characteristic.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__new_option__') {
                          setIsAddingNewOption(true);
                          setNewOptionValue('');
                        } else {
                          setCharacteristic((prev: CharacteristicState) => ({
                            ...prev,
                            value: val,
                          }));
                        }
                      }}
                    >
                      <option value="">Оберіть значення...</option>
                      {characteristic.options.map((opt: string) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                      <option value="__new_option__" className="text-primary-600 font-bold">
                        + Додати нове значення...
                      </option>
                    </select>
                  )
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={characteristic.unit ? `Наприклад: 20` : `20V, 1.5кг, 1400Вт...`}
                      className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] py-2 pr-12 pl-3.5 text-sm transition-all focus:bg-white focus:outline-none"
                      value={characteristic.value}
                      onChange={(e) =>
                        setCharacteristic((prev: CharacteristicState) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                    />
                    {characteristic.unit && (
                      <span className="pointer-events-none absolute right-3 bg-[#FAFAFF] px-1 text-xs font-bold text-neutral-400 select-none">
                        {characteristic.unit}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (characteristic.name.trim() && characteristic.value.trim()) {
                    setCharacteristics((prev) => [
                      ...prev,
                      {
                        code:
                          characteristic.code ||
                          characteristic.name.toLowerCase().replace(/\s+/g, '_'),
                        name: characteristic.name.trim(),
                        value: characteristic.value.trim(),
                        unit: characteristic.unit || null,
                      },
                    ]);
                    setCharacteristic({ code: '', name: '', value: '', unit: '', options: [] });
                    setSelectedAttrCode('');
                  }
                }}
                className="bg-primary-500 hover:bg-primary-600 flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/10 transition-all"
              >
                <Plus size={16} />
                <span>Додати</span>
              </button>
            </div>

            {/* Added list */}
            <div className="mt-2 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50/30">
              {characteristics.length > 0 ? (
                <div className="flex flex-col divide-y divide-neutral-100">
                  {characteristics.map((char, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex gap-2">
                        <span className="font-semibold text-neutral-500">{char.name}:</span>
                        <span className="font-semibold text-neutral-800">
                          {char.value}{' '}
                          {char.unit && !char.value.endsWith(char.unit) ? char.unit : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => moveCharacteristic(i, 'up')}
                          className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Перемістити вгору"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={i === characteristics.length - 1}
                          onClick={() => moveCharacteristic(i, 'down')}
                          className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Перемістити вниз"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCharacteristics((prev) => prev.filter((_, index) => index !== i));
                          }}
                          className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          title="Видалити"
                        >
                          <Icon icon="delete" className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-xs font-medium text-neutral-400">
                  Характеристики відсутні
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Image upload, SEO, Actions */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-4">
          {/* Card 4: Product Media */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-800 uppercase">
                Медіафайли товару
              </h2>
              <span
                className="cursor-help"
                title="Зображення зберігаються на сервері, відеоогляд додається як посилання на YouTube."
              >
                {questionSvg}
              </span>
            </div>

            {/* Video Url Field */}
            <div className="mb-2 flex flex-col">
              <label className="mb-1.5 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                Посилання на відеоогляд (YouTube)
              </label>
              <input
                type="url"
                name="videoUrl"
                defaultValue={product?.videoUrl || ''}
                placeholder="https://www.youtube.com/watch?v=..."
                className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
              />
            </div>

            {/* Premium Uploader Dropzone */}
            <div className="flex flex-col gap-4">
              <div className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-[#FAFAFF] p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newItems = files.map((file) => ({
                      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      file,
                      previewUrl: URL.createObjectURL(file),
                      isExisting: false,
                    }));
                    setMediaFiles((prev) => [...prev, ...newItems]);
                    e.target.value = ''; // Reset file input so same files can be re-selected
                  }}
                />
                <div className="pointer-events-none flex flex-col items-center justify-center gap-1.5 text-center select-none">
                  <Icon
                    icon="edit"
                    className="h-6 w-6 fill-none stroke-current text-neutral-400 group-hover:text-neutral-500"
                  />
                  <span className="text-xs font-semibold text-neutral-600 group-hover:text-neutral-700">
                    Оберіть зображення для галереї
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Можна обрати декілька файлів. До 5MB кожен.
                  </span>
                </div>
              </div>

              {/* Gallery Preview & Management Grid */}
              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
                  {mediaFiles.map((item, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={item.id}
                        className={`group relative flex flex-col items-center justify-between rounded-xl border bg-white p-2 shadow-sm transition-all ${
                          isFirst ? 'border-primary ring-primary/30 ring-1' : 'border-neutral-100'
                        }`}
                      >
                        {/* Image Wrapper */}
                        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50 p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.previewUrl}
                            className="h-auto max-h-full w-auto rounded-md object-contain"
                            alt="Preview"
                          />
                        </div>

                        {/* Badges */}
                        {isFirst && (
                          <span className="bg-primary absolute top-3 left-3 rounded px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
                            Головна
                          </span>
                        )}

                        {/* Controls */}
                        <div className="mt-2 flex w-full items-center justify-between gap-1 select-none">
                          <div className="flex gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                setMediaFiles((prev) => {
                                  const newList = [...prev];
                                  const temp = newList[idx];
                                  newList[idx] = newList[idx - 1];
                                  newList[idx - 1] = temp;
                                  return newList;
                                });
                              }}
                              className="cursor-pointer rounded border border-neutral-200 bg-white p-1 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                              title="Вліво"
                            >
                              <ChevronLeft size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === mediaFiles.length - 1}
                              onClick={() => {
                                setMediaFiles((prev) => {
                                  const newList = [...prev];
                                  const temp = newList[idx];
                                  newList[idx] = newList[idx + 1];
                                  newList[idx + 1] = temp;
                                  return newList;
                                });
                              }}
                              className="cursor-pointer rounded border border-neutral-200 bg-white p-1 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                              title="Вправо"
                            >
                              <ChevronRight size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setMediaFiles((prev) => {
                                const target = prev[idx];
                                if (!target.isExisting) {
                                  URL.revokeObjectURL(target.previewUrl);
                                }
                                return prev.filter((_, i) => i !== idx);
                              });
                            }}
                            className="cursor-pointer rounded border border-rose-100 bg-white p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                            title="Видалити"
                          >
                            <Icon icon="delete" className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-center">
                  <span className="text-xs font-semibold text-neutral-400">
                    Галерея зображень порожня
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card: Product Badges */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-800 uppercase">
                Бейджі товару
              </h2>
              <span
                className="cursor-help"
                title="Оберіть один або кілька бейджів для відображення на сторінці товару. Ви можете створити новий або видалити існуючий бейдж."
              >
                {questionSvg}
              </span>
            </div>

            {/* Checklist of badges */}
            <div className="flex max-h-[180px] flex-col gap-2.5 overflow-y-auto rounded-xl border border-neutral-200 bg-[#FAFAFF] p-3 shadow-inner">
              {availableBadges.map((badge) => {
                const isChecked = selectedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className="flex items-center justify-between py-1 transition-colors hover:bg-neutral-100/50"
                  >
                    <label className="group flex cursor-pointer items-center gap-3 select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedBadgeIds((prev) => prev.filter((id) => id !== badge.id));
                          } else {
                            setSelectedBadgeIds((prev) => [...prev, badge.id]);
                          }
                        }}
                        className="text-primary-500 focus:ring-primary-500 accent-primary-500 h-4 w-4 cursor-pointer rounded border-gray-300"
                      />
                      <span
                        style={{
                          backgroundColor: badge.backgroundColor,
                          color: badge.textColor,
                        }}
                        className="rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm select-none"
                      >
                        {badge.name}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteBadge(badge)}
                      className="cursor-pointer p-1 text-neutral-400 transition-all hover:text-rose-500"
                      title="Видалити бейдж"
                    >
                      <Icon icon="delete" className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                );
              })}
              {availableBadges.length === 0 && (
                <span className="py-2 text-center text-xs text-neutral-400">Бейджі відсутні</span>
              )}
            </div>

            {/* Create Badge Toggle / Form */}
            <div className="mt-2 border-t border-neutral-100 pt-3">
              {!isAddingBadge ? (
                <button
                  type="button"
                  onClick={() => setIsAddingBadge(true)}
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-100"
                >
                  <Plus size={14} />
                  <span>Створити новий бейдж</span>
                </button>
              ) : (
                <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 shadow-inner">
                  {/* Name field */}
                  <div className="flex flex-col">
                    <label className="mb-1 text-[10px] font-bold text-neutral-400 uppercase">
                      Назва бейджа
                    </label>
                    <input
                      type="text"
                      placeholder="Наприклад: АКЦІЯ"
                      value={newBadgeName}
                      onChange={(e) => setNewBadgeName(e.target.value)}
                      className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:outline-none"
                    />
                  </div>

                  {/* Preset styling selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">
                      Шаблони кольорів
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Чорний', bg: '#171717', text: '#ffffff' },
                        { label: 'Синій', bg: '#0284c7', text: '#ffffff' },
                        { label: 'Червоний', bg: '#dc2626', text: '#ffffff' },
                        { label: 'Зелений', bg: '#16a34a', text: '#ffffff' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setNewBadgeBgColor(preset.bg);
                            setNewBadgeTextColor(preset.text);
                          }}
                          className="cursor-pointer rounded border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold text-neutral-700 transition-all hover:bg-neutral-100"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors pickers */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <label className="mb-0.5 text-[9px] font-bold text-neutral-400 uppercase">
                        Колір фону
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={newBadgeBgColor}
                          onChange={(e) => setNewBadgeBgColor(e.target.value)}
                          className="h-7 w-8 cursor-pointer rounded border border-neutral-300 bg-transparent p-0"
                        />
                        <span className="font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          {newBadgeBgColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-0.5 text-[9px] font-bold text-neutral-400 uppercase">
                        Колір тексту
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={newBadgeTextColor}
                          onChange={(e) => setNewBadgeTextColor(e.target.value)}
                          className="border-neutral-350 h-7 w-8 cursor-pointer rounded border bg-transparent p-0"
                        />
                        <span className="font-mono text-[10px] font-bold text-neutral-600 uppercase">
                          {newBadgeTextColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preview box */}
                  <div className="mt-1 flex flex-col items-center justify-center gap-1 rounded-lg border border-neutral-100 bg-white py-2.5">
                    <span className="mb-1 text-[9px] font-bold text-neutral-400 uppercase select-none">
                      Попередній перегляд:
                    </span>
                    <span
                      style={{
                        backgroundColor: newBadgeBgColor,
                        color: newBadgeTextColor,
                      }}
                      className="rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm select-none"
                    >
                      {newBadgeName.trim() || 'БЕЙДЖ'}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateBadge}
                      className="flex-1 cursor-pointer rounded-lg bg-green-500 py-1.5 text-center text-xs font-bold text-white transition-colors hover:bg-green-600"
                    >
                      Створити
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBadgeName('');
                        setNewBadgeBgColor('#000000');
                        setNewBadgeTextColor('#ffffff');
                        setIsAddingBadge(false);
                      }}
                      className="flex-1 cursor-pointer rounded-lg bg-neutral-200 py-1.5 text-center text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-300"
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 5: SEO settings */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-800 uppercase">
                Пошукова оптимізація
              </h2>
              <span
                className="cursor-help"
                title="Ключові слова використовуються для внутрішнього пошуку сайту та для Google SEO."
              >
                {questionSvg}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-bold text-neutral-400 uppercase">
                Ключові слова (через кому + пробіл)
              </label>
              <textarea
                name="seoKeywords"
                defaultValue={product?.seoKeywords}
                placeholder="шуруповерт, акумуляторний інструмент, INGCO..."
                className="focus:border-primary-500 min-h-[80px] w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-700 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Card 6: Action buttons */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 font-display shadow-primary-500/10 hover:shadow-primary-500/20 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all"
            >
              Підтвердити
            </button>
            <button
              type="button"
              onClick={handleResetToInitial}
              className="font-display flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-neutral-700 uppercase transition-all hover:border-neutral-400"
            >
              Скинути до початкового стану
            </button>
          </div>
        </div>
      </form>

      <ConfirmModal
        isOpen={!!badgeToDelete}
        onClose={() => setBadgeToDelete(null)}
        onConfirm={async () => {
          if (!badgeToDelete) return;
          try {
            await apiIngco.delete(`/badges/${badgeToDelete.id}`);
            setAvailableBadges((prev) => prev.filter((b) => b.id !== badgeToDelete.id));
            setSelectedBadgeIds((prev) => prev.filter((id) => id !== badgeToDelete.id));
            toast.success('Бейдж успішно видалено');
          } catch (_err: unknown) {
            toast.error('Не вдалося видалити бейдж');
          }
        }}
        title="Видалення бейджа"
        message={
          badgeToDelete
            ? badgeToDelete._count?.products && badgeToDelete._count.products > 0
              ? `Увага! Бейдж "${badgeToDelete.name}" використовується у ${badgeToDelete._count.products} продуктах. Його видалення прибере його з усіх цих товарів. Ви впевнені, що хочете видалити?`
              : `Ви впевнені, що хочете видалити бейдж "${badgeToDelete.name}"?`
            : ''
        }
        confirmText="Видалити"
        type="danger"
      />
    </div>
  );
};

export default AdminProductForm;
