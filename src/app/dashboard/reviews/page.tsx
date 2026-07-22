'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, CheckCircle, Trash2, Eye, EyeOff, Search, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminReviews, deleteReview, toggleApproveReview } from '@/lib/api/reviews';
import { Review } from '@/lib/types';

export default function ReviewsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams?.get('page')) || 1;
  const searchParam = searchParams?.get('search') || '';
  const ratingParam = searchParams?.get('rating') ? Number(searchParams?.get('rating')) : undefined;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchParam);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const loadAdminReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminReviews({
        page: pageParam,
        limit: 15,
        search: searchParam,
        rating: ratingParam,
      });
      setReviews(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Не вдалося завантажити відгуки');
    } finally {
      setIsLoading(false);
    }
  }, [pageParam, searchParam, ratingParam]);

  useEffect(() => {
    loadAdminReviews();
  }, [loadAdminReviews]);

  const updateFilters = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleToggleApprove = async (id: number) => {
    try {
      const updated = await toggleApproveReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: updated.isApproved } : r)),
      );
      toast.success(updated.isApproved ? 'Відгук зроблено видимим' : 'Відгук приховано з сайту');
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Помилка зміни статусу відгуку');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви дійсно бажаєте видалити цей відгук остаточно?')) return;

    setDeletingId(id);
    try {
      await deleteReview(id);
      toast.success('Відгук успішно видалено');
      loadAdminReviews();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || 'Не вдалося видалити відгук');
    } finally {
      setDeletingId(null);
    }
  };

  const getFullImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API || '';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900 md:text-3xl">
            Модерація відгуків ({total})
          </h1>
          <p className="font-sans text-xs text-neutral-500 md:text-sm">
            Управління відгуками покупців та фотографіями товарів
          </p>
        </div>

        {/* Search and Filters Form */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Пошук по тексту, товару або автору..."
              className="w-64 rounded-xl border border-neutral-300 bg-white py-2 pr-3 pl-9 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none md:w-80 md:text-sm"
            />
            <Search size={16} className="absolute left-3 text-neutral-400" />
          </form>

          {/* Rating filter select */}
          <select
            value={ratingParam || ''}
            onChange={(e) =>
              updateFilters({
                rating: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 focus:border-amber-500 focus:outline-none md:text-sm"
          >
            <option value="">Всі оцінки</option>
            <option value="5">5 зірок</option>
            <option value="4">4 зірки</option>
            <option value="3">3 зірки</option>
            <option value="2">2 зірки</option>
            <option value="1">1 зірка</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left font-sans text-xs md:text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-600 uppercase">
            <tr>
              <th className="p-4">Товар</th>
              <th className="p-4">Автор</th>
              <th className="p-4">Оцінка</th>
              <th className="p-4">Текст відгуку</th>
              <th className="p-4">Статус</th>
              <th className="p-4 text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-800">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin text-amber-500" />
                    Завантаження відгуків...
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-neutral-400">
                  Відгуків не знайдено
                </td>
              </tr>
            ) : (
              reviews.map((review) => {
                const userName = review.user
                  ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() ||
                    'Покупець'
                  : 'Покупець';

                return (
                  <tr key={review.id} className="transition-colors hover:bg-neutral-50/80">
                    {/* Product */}
                    <td className="max-w-[220px] p-4">
                      {review.product ? (
                        <Link
                          href={`/${review.product.slug}`}
                          target="_blank"
                          className="group flex items-center gap-3"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getFullImageUrl(review.product.image)}
                              alt={review.product.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-semibold text-neutral-900 group-hover:text-amber-600">
                              {review.product.name}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              арт. {review.product.article}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <span className="text-neutral-400">Товар видалено</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900">{userName}</span>
                        {review.user?.email && (
                          <span className="text-[11px] text-neutral-400">{review.user.email}</span>
                        )}
                        {review.isVerifiedBuyer && (
                          <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <CheckCircle size={10} /> Покупець
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-amber-500">{review.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-200'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Comment & Pros/Cons & Photos */}
                    <td className="max-w-xs p-4 md:max-w-md">
                      <div className="flex flex-col gap-2">
                        <p className="line-clamp-3 text-xs whitespace-pre-line text-neutral-800">
                          {review.comment}
                        </p>
                        {review.pros && (
                          <div className="text-[11px] text-emerald-700">
                            <span className="font-semibold">Переваги:</span> {review.pros}
                          </div>
                        )}
                        {review.cons && (
                          <div className="text-[11px] text-rose-700">
                            <span className="font-semibold">Недоліки:</span> {review.cons}
                          </div>
                        )}

                        {/* Thumbnails */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {review.images.map((img, i) => {
                              const src = getFullImageUrl(img);
                              return (
                                <button
                                  key={i}
                                  onClick={() => setLightboxImg(src)}
                                  className="h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 hover:ring-2 hover:ring-amber-500"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={src}
                                    alt="Фото"
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      {review.isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          <Eye size={12} /> Опубліковано
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">
                          <EyeOff size={12} /> Приховано
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleApprove(review.id)}
                          className={`rounded-lg p-2 transition-colors ${
                            review.isApproved
                              ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={review.isApproved ? 'Приховати відгук' : 'Опублікувати відгук'}
                        >
                          {review.isApproved ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="rounded-lg bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                          title="Видалити відгук"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateFilters({ page: p })}
              className={`h-9 w-9 rounded-xl font-sans text-xs font-semibold transition-all ${
                p === pageParam
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox photo view */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-neutral-800 shadow-lg hover:bg-neutral-100"
            >
              <X size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg}
              alt="Фото відгуку"
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
