'use client';

import React, { useState } from 'react';
import { Star, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { createReview } from '@/lib/api/reviews';
import { Product } from '@/lib/types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [pros, setPros] = useState<string>('');
  const [cons, setCons] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (images.length + selectedFiles.length > 3) {
      toast.warning('Ви можете додати не більше 3 фотографій');
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    selectedFiles.forEach((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`Файл ${file.name} не є зображенням (JPEG, PNG, WebP)`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Файл ${file.name} перевищує 5 МБ`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Будь ласка, напишіть текст відгуку');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        productId: product.id,
        rating,
        comment: comment.trim(),
        pros: pros.trim() || undefined,
        cons: cons.trim() || undefined,
        images,
      });

      toast.success('Дякуємо! Ваш відгук успішно опубліковано.');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Не вдалося зберегти відгук. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <h2 className="font-display mb-1 text-xl font-bold text-neutral-900 md:text-2xl">
          Залишити відгук
        </h2>
        <p className="mb-6 font-sans text-xs text-neutral-500 md:text-sm">
          {product.name} (арт. {product.article})
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 1. Rating input (1-5 stars) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-neutral-700 md:text-sm">
              Ваша оцінка товару <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 font-sans text-sm font-semibold text-neutral-700">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* 2. Review description (сам відгук) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="review-comment"
              className="font-sans text-xs font-semibold text-neutral-700 md:text-sm"
            >
              Ваш відгук <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поділіться враженнями від використання інструменту..."
              className="w-full rounded-xl border border-neutral-300 p-3 font-sans text-sm text-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              required
            />
          </div>

          {/* 3. Pros (Переваги) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="review-pros"
              className="font-sans text-xs font-semibold text-neutral-700 md:text-sm"
            >
              Переваги (що сподобалось)
            </label>
            <input
              id="review-pros"
              type="text"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="Наприклад: Потужний мотор, зручна рукоятка, довгий кабель"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 font-sans text-sm text-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          {/* 4. Cons (Недоліки) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="review-cons"
              className="font-sans text-xs font-semibold text-neutral-700 md:text-sm"
            >
              Недоліки (що не сподобалось)
            </label>
            <input
              id="review-cons"
              type="text"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="Наприклад: Трохи важкуватий вага"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 font-sans text-sm text-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          {/* 5. Photos (1-3 photos upload) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-neutral-700 md:text-sm">
              Фотографії товару (до 3 фото)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Попередній перегляд ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 text-neutral-500 transition-colors hover:border-amber-500 hover:bg-amber-50/20 hover:text-amber-600">
                  <Upload size={20} className="mb-1" />
                  <span className="font-sans text-[10px] font-medium">Додати</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="mt-4 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 font-sans text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Надсилання...' : 'Опублікувати відгук'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
