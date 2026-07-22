'use client';

import React from 'react';
import { Star, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
  onImageClick: (url: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onImageClick }) => {
  const userName = review.user
    ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Покупець'
    : 'Покупець';

  const formattedDate = new Date(review.createdAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getFullImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API || '';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-neutral-300">
      {/* Author Info & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-bold text-neutral-900">{userName}</span>
          {review.isVerifiedBuyer && (
            <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-sans text-[11px] font-semibold text-emerald-700">
              <CheckCircle size={12} className="text-emerald-600" />
              Підтверджений покупець
            </span>
          )}
        </div>
        <span className="font-sans text-xs text-neutral-400">{formattedDate}</span>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}
          />
        ))}
      </div>

      {/* Main Review Text */}
      <p className="font-sans text-sm leading-relaxed whitespace-pre-line text-neutral-800">
        {review.comment}
      </p>

      {/* Pros & Cons Chips */}
      {(review.pros || review.cons) && (
        <div className="mt-1 flex flex-col gap-2 rounded-xl bg-neutral-50/80 p-3 text-xs">
          {review.pros && (
            <div className="flex items-start gap-2 text-neutral-700">
              <span className="flex shrink-0 items-center gap-1 font-semibold text-emerald-600">
                <ThumbsUp size={14} /> Переваги:
              </span>
              <span>{review.pros}</span>
            </div>
          )}
          {review.cons && (
            <div className="flex items-start gap-2 text-neutral-700">
              <span className="flex shrink-0 items-center gap-1 font-semibold text-rose-600">
                <ThumbsDown size={14} /> Недоліки:
              </span>
              <span>{review.cons}</span>
            </div>
          )}
        </div>
      )}

      {/* Attached Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {review.images.map((imgUrl, idx) => {
            const fullUrl = getFullImageUrl(imgUrl);
            return (
              <button
                key={idx}
                onClick={() => onImageClick(fullUrl)}
                className="group relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 transition-all hover:opacity-90 hover:ring-2 hover:ring-amber-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fullUrl}
                  alt={`Фото відгуку ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
