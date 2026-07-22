'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/appState/store';
import { toast } from 'react-toastify';
import { Product, Review, ReviewStats } from '@/lib/types';
import { fetchProductReviews, checkCanUserReview } from '@/lib/api/reviews';
import { ReviewModal } from '../modals/ReviewModal';
import { RatingOverview } from './reviews/RatingOverview';
import { ReviewCard } from './reviews/ReviewCard';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { isAuthenticated } = useSelector((state: RootState) => state.persistedAuthReducer);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchProductReviews(product.id, {
        page,
        limit: 10,
        rating: selectedRating,
      });
      setReviews(res.data);
      setTotalPages(res.totalPages);
      setStats(res.stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [product.id, page, selectedRating]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleOpenModal = async () => {
    if (!isAuthenticated) {
      toast.info('Будь ласка, увійдіть у свій акаунт, щоб залишити відгук');
      return;
    }

    const check = await checkCanUserReview(product.id);
    if (check.canReview) {
      setIsModalOpen(true);
    } else {
      toast.warning(check.reason || 'Ви не можете залишити відгук про цей товар');
    }
  };

  return (
    <section id="reviews" className="scroll-mt-24">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-3">
        <div>
          <h2 className="font-display text-xl font-bold text-neutral-900 md:text-2xl">
            Відгуки та питання
          </h2>
          {stats && stats.totalCount > 0 && (
            <p className="font-sans text-xs text-neutral-500 md:text-sm">
              На основі {stats.totalCount}{' '}
              {stats.totalCount === 1 ? 'відгуку' : stats.totalCount < 5 ? 'відгуків' : 'відгуків'}
            </p>
          )}
        </div>
        <button
          onClick={handleOpenModal}
          className="cursor-pointer rounded-xl border border-amber-500 bg-amber-500 px-4 py-2.5 font-sans text-xs font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 md:px-5 md:text-sm"
        >
          Залишити відгук
        </button>
      </div>

      {/* Rating Overview & Histogram */}
      {stats && stats.totalCount > 0 && (
        <div className="mb-8">
          <RatingOverview
            stats={stats}
            selectedRating={selectedRating}
            onSelectRating={(r) => {
              setSelectedRating(r);
              setPage(1);
            }}
          />
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6"
            >
              <div className="mb-3 h-4 w-32 rounded bg-neutral-200" />
              <div className="mb-2 h-3 w-48 rounded bg-neutral-100" />
              <div className="h-16 w-full rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200/60 bg-neutral-50/60 p-10 text-center shadow-inner md:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-200/50 text-neutral-400 shadow-sm">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="font-display mb-1 text-base font-semibold text-neutral-800 md:text-lg">
              Поки що немає відгуків про цей товар
            </h3>
            <p className="mx-auto max-w-sm font-sans text-xs leading-relaxed text-neutral-500 md:text-sm">
              Будьте першим, хто залишить відгук! Ваша думка допоможе іншим покупцям зробити
              правильний вибір.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onImageClick={(url) => setLightboxImage(url)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-xl font-sans text-xs font-semibold transition-all ${
                p === page
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onSuccess={loadReviews}
      />

      {/* Lightbox Photo Modal */}
      {lightboxImage && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 rounded-full bg-white p-2 text-neutral-800 shadow-lg transition-colors hover:bg-neutral-100"
            >
              <X size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt="Перегляд фотографії"
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
