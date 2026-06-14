'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import Icon from '../assets/Icon';
import { CircleHelp, ArrowLeft, Plus } from 'lucide-react';

const questionSvg = (
  <span>
    <CircleHelp size={16} className="text-neutral-400 transition-colors hover:text-neutral-500" />
  </span>
);

import { Category } from '@/lib/types';
import { apiIngco } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';

type AdminProductFormProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
  characteristics: any[];
  setCharacteristics: React.Dispatch<React.SetStateAction<any[]>>;
  characteristic: any;
  setCharacteristic: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  isEdit?: boolean;
  product?: Product;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<number[]>>;
};

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

const AdminProductForm = ({
  handleSubmit,
  handleImageChange,
  imageUrl,
  characteristics,
  setCharacteristics,
  characteristic,
  setCharacteristic,
  categories,
  product,
  isEdit = false,
  selectedCategoryIds,
  setSelectedCategoryIds,
}: AdminProductFormProps) => {
  const router = useRouter();

  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | ''>(
    () => product?.mainCategory?.id || product?.category?.id || '',
  );
  const [availableAttributes, setAvailableAttributes] = useState<any[]>([]);
  const [selectedAttrCode, setSelectedAttrCode] = useState<string>('');
  const [isAddingNewOption, setIsAddingNewOption] = useState<boolean>(false);
  const [newOptionValue, setNewOptionValue] = useState<string>('');

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
    } else {
      setAvailableAttributes([]);
    }
  }, [selectedMainCategoryId]);

  const sortedCategories = useMemo(() => getSortedHierarchy(categories), [categories]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 font-sans">
      {/* Premium Dashboard Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
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
                  onChange={(e) => setSelectedMainCategoryId(e.target.value ? Number(e.target.value) : '')}
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
              <div className="flex flex-grow flex-col min-w-[200px]">
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
                        setCharacteristic((prev: any) => ({
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
                      className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer text-xs font-semibold underline"
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

              <div className="flex flex-grow flex-col min-w-[200px]">
                <label className="mb-1 text-[10px] font-bold text-neutral-400 uppercase">
                  Значення характеристики
                </label>
                {characteristic.options && characteristic.options.length > 0 ? (
                  isAddingNewOption ? (
                    <div className="flex items-center gap-2 w-full">
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
                              setCharacteristic((prev: any) => ({
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
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer shrink-0 text-xs"
                      >
                        Зберегти
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewOption(false);
                          setNewOptionValue('');
                          setCharacteristic((prev: any) => ({ ...prev, value: '' }));
                        }}
                        className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer shrink-0 text-xs"
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
                          setCharacteristic((prev: any) => ({ ...prev, value: val }));
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
                      placeholder={
                        characteristic.unit ? `Наприклад: 20` : `20V, 1.5кг, 1400Вт...`
                      }
                      className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] pl-3.5 pr-12 py-2 text-sm transition-all focus:bg-white focus:outline-none"
                      value={characteristic.value}
                      onChange={(e) =>
                        setCharacteristic((prev: any) => ({ ...prev, value: e.target.value }))
                      }
                    />
                    {characteristic.unit && (
                      <span className="absolute right-3 pointer-events-none select-none bg-[#FAFAFF] px-1 font-bold text-xs text-neutral-400">
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
                    const suffix = characteristic.unit && !characteristic.value.endsWith(characteristic.unit) ? ` ${characteristic.unit}` : '';
                    setCharacteristics((prev) => [
                      ...prev,
                      {
                        code: characteristic.code || characteristic.name.toLowerCase().replace(/\s+/g, '_'),
                        name: characteristic.name.trim(),
                        value: characteristic.value.trim() + suffix,
                        unit: characteristic.unit || null,
                      }
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
                          {char.value} {char.unit && !char.value.endsWith(char.unit) ? char.unit : ''}
                        </span>
                      </div>
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
          {/* Card 4: Product Image */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-neutral-800 uppercase">
                Зображення товару
              </h2>
              <span
                className="cursor-help"
                title="Рекомендований формат: WebP (для кращого стиснення) з якістю 80-90%."
              >
                {questionSvg}
              </span>
            </div>

            {/* Premium Uploader Dropzone */}
            <div className="flex flex-col items-center gap-4">
              <div className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-[#FAFAFF] p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImageChange}
                />
                <div className="pointer-events-none flex flex-col items-center justify-center gap-1.5 text-center select-none">
                  <Icon
                    icon="edit"
                    className="h-6 w-6 fill-none stroke-current text-neutral-400 group-hover:text-neutral-500"
                  />
                  <span className="text-xs font-semibold text-neutral-600 group-hover:text-neutral-700">
                    Оберіть файл зображення
                  </span>
                  <span className="text-[10px] text-neutral-400">Формат WEBP або PNG, до 2MB</span>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-white p-2 shadow-sm select-none">
                <Image
                  src={imageUrl || '/placeholder.webp'}
                  className="h-auto max-h-full w-auto rounded-lg object-contain"
                  alt={product?.name || 'Фото товару'}
                  width={180}
                  height={180}
                />
              </div>
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
              type="reset"
              className="font-display flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-neutral-700 uppercase transition-all hover:border-neutral-400"
            >
              Скинути
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
