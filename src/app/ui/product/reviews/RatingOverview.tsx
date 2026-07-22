'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { ReviewStats } from '@/lib/types';

interface RatingOverviewProps {
  stats: ReviewStats;
  selectedRating: number | undefined;
  onSelectRating: (rating: number | undefined) => void;
}

export const RatingOverview: React.FC<RatingOverviewProps> = ({
  stats,
  selectedRating,
  onSelectRating,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Big Rating Summary & Histogram */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-12 md:p-8">
        {/* Rating Big Number */}
        <div className="flex flex-col items-center justify-center border-neutral-100 md:col-span-4 md:border-r md:pr-6">
          <div className="font-display text-4xl font-extrabold text-neutral-900 md:text-5xl">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="my-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={
                  star <= Math.round(stats.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-200'
                }
              />
            ))}
          </div>
          <span className="font-sans text-xs text-neutral-500">
            Загальний рейтинг ({stats.totalCount} відгуків)
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex flex-col justify-center gap-2 md:col-span-8">
          {[5, 4, 3, 2, 1].map((starsKey) => {
            const count =
              stats.ratingBreakdown[starsKey as keyof typeof stats.ratingBreakdown] || 0;
            const percent = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
            const isSelected = selectedRating === starsKey;

            return (
              <button
                key={starsKey}
                onClick={() => onSelectRating(isSelected ? undefined : starsKey)}
                className={`flex items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-neutral-50 ${
                  isSelected ? 'bg-amber-50/70 font-semibold' : ''
                }`}
              >
                <span className="flex w-12 items-center gap-1 font-sans text-xs text-neutral-600">
                  {starsKey} <Star size={12} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right font-sans text-xs text-neutral-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectRating(undefined)}
          className={`rounded-xl px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
            selectedRating === undefined
              ? 'bg-neutral-900 text-white'
              : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Всі відгуки ({stats.totalCount})
        </button>
        {[5, 4, 3, 2, 1].map((r) => {
          const cnt = stats.ratingBreakdown[r as keyof typeof stats.ratingBreakdown] || 0;
          if (cnt === 0) return null;
          const isSelected = selectedRating === r;

          return (
            <button
              key={r}
              onClick={() => onSelectRating(isSelected ? undefined : r)}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-500 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {r}{' '}
              <Star
                size={12}
                className={isSelected ? 'fill-white' : 'fill-amber-400 text-amber-400'}
              />{' '}
              ({cnt})
            </button>
          );
        })}
      </div>
    </div>
  );
};
