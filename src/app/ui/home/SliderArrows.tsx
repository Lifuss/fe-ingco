import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CustomArrowProps {
  onClick?: () => void;
}

/**
 * Custom previous arrow for React Slick slider carousels.
 * Can be reused across any slide carousels requiring consistent UI navigation buttons.
 */
export function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="focus:ring-primary-500 absolute top-1/2 left-[-14px] z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E5E3DD] bg-white text-neutral-600 shadow-md transition-colors hover:bg-neutral-50 focus:ring-2 focus:outline-none active:bg-neutral-100"
      aria-label="Попередній слайд"
    >
      <ChevronLeft size={18} className="stroke-[2.5]" />
    </button>
  );
}

/**
 * Custom next arrow for React Slick slider carousels.
 * Can be reused across any slide carousels requiring consistent UI navigation buttons.
 */
export function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      className="focus:ring-primary-500 absolute top-1/2 right-[-14px] z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E5E3DD] bg-white text-neutral-600 shadow-md transition-colors hover:bg-neutral-50 focus:ring-2 focus:outline-none active:bg-neutral-100"
      aria-label="Наступний слайд"
    >
      <ChevronRight size={18} className="stroke-[2.5]" />
    </button>
  );
}
