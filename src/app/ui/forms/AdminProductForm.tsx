'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import Icon from '../assets/Icon';
import { CircleHelp, ArrowLeft, Plus } from 'lucide-react';
import clsx from 'clsx';

const questionSvg = (
  <span>
    <CircleHelp size={16} className="text-neutral-400 hover:text-neutral-500 transition-colors" />
  </span>
);

type AdminProductFormProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
  characteristics: { name: string; value: string }[];
  setCharacteristics: React.Dispatch<React.SetStateAction<{ name: string; value: string }[]>>;
  characteristic: { name: string; value: string };
  setCharacteristic: React.Dispatch<React.SetStateAction<{ name: string; value: string }>>;
  categories: { _id: string; name: string }[];
  isEdit?: boolean;
  product?: Product;
};

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
}: AdminProductFormProps) => {
  const router = useRouter();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* Premium Dashboard Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center p-2 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 shadow-sm transition-all cursor-pointer select-none"
          title="Назад"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Панель керування</span>
          <h1 className="text-2xl font-display font-bold text-neutral-900 leading-tight">
            {isEdit ? 'Редагування продукту' : 'Створення продукту'}
          </h1>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" onSubmit={handleSubmit}>
        
        {/* Left column: Product Specs, Data, Characteristics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card 1: General Info */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 flex items-center gap-2">
              Основна інформація
            </h2>

            {/* Name input */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                <span>Найменування</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                defaultValue={product?.name}
                required
                placeholder="Введіть повну назву інструменту..."
                className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Grid rows for Category & Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                  <span>Артикул</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="article"
                  defaultValue={product?.article}
                  placeholder="Наприклад: HPET1103"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Категорія
                </label>
                <select
                  name="category"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2.5 text-sm text-neutral-800 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold cursor-pointer"
                  defaultValue={product?.category?._id}
                >
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Штрихкод
                </label>
                <input
                  type="text"
                  name="barcode"
                  defaultValue={product?.barcode}
                  placeholder="Штрихкод EAN-13"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Сортування (Пріоритет)
                </label>
                <input
                  type="number"
                  step={1}
                  name="sort"
                  defaultValue={product?.sort || 0}
                  placeholder="0"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Description textarea */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Опис товару
              </label>
              <textarea
                name="description"
                placeholder="Введіть детальний опис інструменту, його функцій та переваг..."
                defaultValue={product?.description}
                required
                className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all min-h-[120px] font-sans leading-relaxed"
              />
            </div>

          </div>

          {/* Card 2: Pricing & Stock */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 flex items-center gap-2">
              Ціноутворення та наявність
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Прихідна ціна ($)
                </label>
                <input
                  type="number"
                  name="enterPrice"
                  step="0.001"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  defaultValue={product?.enterPrice || 0}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                  <span>Ціна ($)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.001"
                  defaultValue={product?.price}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                  <span>РРЦ (₴)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  defaultValue={product?.priceRetailRecommendation}
                  name="priceRetailRecommendation"
                  placeholder="0"
                  step="0.1"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  РРЦ зі знижкою (₴)
                </label>
                <input
                  type="number"
                  name="rrcSale"
                  defaultValue={product?.rrcSale || 0}
                  step="0.001"
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                  <span>К-сть в наявності</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="countInStock"
                  defaultValue={product?.countInStock}
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  required
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Гарантія (міс)
                </label>
                <input
                  type="number"
                  step={1}
                  name="warranty"
                  defaultValue={product?.warranty || 24}
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
                  required
                />
              </div>
            </div>

          </div>

          {/* Card 3: Characteristics */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
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
            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-grow flex flex-col">
                <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Назва характеристики</label>
                <input
                  type="text"
                  name="characteristicName"
                  placeholder="Напруга, Вага, Потужність..."
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  value={characteristic.name}
                  onChange={(e) =>
                    setCharacteristic((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex-grow flex flex-col">
                <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Значення характеристики</label>
                <input
                  type="text"
                  name="characteristicDesc"
                  placeholder="20V, 1.5кг, 1400Вт..."
                  className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  value={characteristic.value}
                  onChange={(e) =>
                    setCharacteristic((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (characteristic.name.trim()) {
                    setCharacteristics((prev) => [...prev, characteristic]);
                    setCharacteristic({ name: '', value: '' });
                  }
                }}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center gap-1 shrink-0 h-9"
              >
                <Plus size={16} />
                <span>Додати</span>
              </button>
            </div>

            {/* Added list */}
            <div className="border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/30 mt-2">
              {characteristics.length > 0 ? (
                <div className="flex flex-col divide-y divide-neutral-100">
                  {characteristics.map((char, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors">
                      <div className="flex gap-2">
                        <span className="font-semibold text-neutral-500">{char.name}:</span>
                        <span className="font-semibold text-neutral-800">{char.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCharacteristics((prev) => prev.filter((_, index) => index !== i));
                        }}
                        className="text-neutral-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Видалити"
                      >
                        <Icon icon="delete" className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-xs text-neutral-400 font-medium">Характеристики відсутні</div>
              )}
            </div>

          </div>

        </div>

        {/* Right column: Image upload, SEO, Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
          
          {/* Card 4: Product Image */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
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
            <div className="flex flex-col gap-4 items-center">
              <div className="relative border-2 border-dashed border-neutral-200 rounded-xl p-4 w-full flex flex-col items-center justify-center bg-[#FAFAFF] hover:bg-neutral-50 hover:border-neutral-300 transition-colors cursor-pointer group">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center justify-center text-center gap-1.5 pointer-events-none select-none">
                  <Icon icon="edit" className="h-6 w-6 text-neutral-400 group-hover:text-neutral-500 fill-none stroke-current" />
                  <span className="text-xs font-semibold text-neutral-600 group-hover:text-neutral-700">Оберіть файл зображення</span>
                  <span className="text-[10px] text-neutral-400">Формат WEBP або PNG, до 2MB</span>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="w-[180px] h-[180px] border border-neutral-100 rounded-xl overflow-hidden p-2 bg-white flex items-center justify-center shadow-sm select-none">
                <Image
                  src={imageUrl || '/placeholder.webp'}
                  className="max-h-full w-auto object-contain rounded-lg"
                  alt={product?.name || 'Фото товару'}
                  width={180}
                  height={180}
                />
              </div>
            </div>

          </div>

          {/* Card 5: SEO settings */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
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
              <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1">
                Ключові слова (через кому + пробіл)
              </label>
              <textarea
                name="seoKeywords"
                defaultValue={product?.seoKeywords}
                placeholder="шуруповерт, акумуляторний інструмент, INGCO..."
                className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all min-h-[80px]"
              />
            </div>

          </div>

          {/* Card 6: Action buttons */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-display font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              Підтвердити
            </button>
            <button
              type="reset"
              className="w-full border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-display font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer bg-white text-xs uppercase tracking-wider"
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
