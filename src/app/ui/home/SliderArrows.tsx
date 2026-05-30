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
      className="absolute left-[-14px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#E5E3DD] shadow-md hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#E5E3DD] shadow-md hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-neutral-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Наступний слайд"
    >
      <ChevronRight size={18} className="stroke-[2.5]" />
    </button>
  );
}
