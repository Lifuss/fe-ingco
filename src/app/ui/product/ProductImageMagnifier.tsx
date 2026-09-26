'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { Badge } from '@/lib/types';

interface ProductImageMagnifierProps {
  src: string;
  alt: string;
  badges?: Badge[];
  priority?: boolean;
  className?: string;
  onOpenLightbox: () => void;
}

function canHover(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export default function ProductImageMagnifier({
  src,
  alt,
  badges,
  priority = false,
  className = '',
  onOpenLightbox,
}: ProductImageMagnifierProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (canHover()) setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transformOrigin = '50% 50%';
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !imageWrapperRef.current) return;
      if (!isHovered && canHover()) {
        setIsHovered(true);
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      imageWrapperRef.current.style.transformOrigin = `${x}% ${y}%`;
    },
    [isHovered],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenLightbox();
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Збільшити зображення товару"
      onClick={onOpenLightbox}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="group focus:ring-primary-500 relative mx-auto flex aspect-square w-full max-w-[580px] cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm select-none focus:ring-2 focus:outline-none md:p-4"
    >
      {/* Product Badges (top-left) */}
      {badges && badges.length > 0 && (
        <div className="pointer-events-none absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.id}
              style={{
                backgroundColor: badge.backgroundColor,
                color: badge.textColor,
              }}
              className="rounded px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm select-none md:text-xs"
            >
              {badge.name}
            </span>
          ))}
        </div>
      )}

      {/* Magnifier Action / Zoom Hint Badge (top-right) */}
      <div className="group-hover:border-primary-500 group-hover:text-primary-600 pointer-events-none absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-xs transition-transform duration-200 group-hover:scale-105">
        <ZoomIn size={14} className="stroke-[2.5]" />
        <span className="hidden text-[11px] font-medium sm:inline">Збільшити</span>
      </div>

      {/* Main Image with Inner Magnifier Transform */}
      <div
        ref={imageWrapperRef}
        className="pointer-events-none relative flex h-full w-full items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transform: isHovered ? 'scale(2.2)' : 'scale(1)',
          willChange: isHovered ? 'transform' : 'auto',
        }}
      >
        <Image
          src={src || '/placeholder-image.jpg'}
          alt={alt}
          width={800}
          height={800}
          sizes="(max-width: 1024px) 100vw, 580px"
          className={`h-full max-h-full w-full max-w-full object-contain transition-all ${className}`}
          priority={priority}
        />
      </div>
    </div>
  );
}
