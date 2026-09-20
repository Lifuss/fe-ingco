'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface GalleryItem {
  type: 'image' | 'video';
  url: string;
  className?: string;
}

interface ProductLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryItem[];
  initialIndex?: number;
  productTitle?: string;
  productArticle?: string;
  onIndexChange?: (index: number) => void;
}

export default function ProductLightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productTitle = '',
  productArticle = '',
  onIndexChange,
}: ProductLightboxModalProps) {
  // Filter only image types for the lightbox
  const photoImages = images.filter((item) => item.type === 'image');

  const [currentIndex, setCurrentIndex] = useState(() => {
    const targetUrl = images[initialIndex]?.url;
    const photoIdx = photoImages.findIndex((item) => item.url === targetUrl);
    return photoIdx >= 0 ? photoIdx : 0;
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef<number>(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const resetZoom = useCallback(() => {
    setIsZoomed(false);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const changeSlide = useCallback(
    (newIndex: number) => {
      resetZoom();
      setCurrentIndex(newIndex);
      const targetUrl = photoImages[newIndex]?.url;
      const originalIdx = images.findIndex((item) => item.url === targetUrl);
      onIndexChange?.(originalIdx >= 0 ? originalIdx : newIndex);
    },
    [images, photoImages, resetZoom, onIndexChange],
  );

  const handlePrev = useCallback(() => {
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : photoImages.length - 1;
    changeSlide(nextIdx);
  }, [currentIndex, photoImages.length, changeSlide]);

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex < photoImages.length - 1 ? currentIndex + 1 : 0;
    changeSlide(nextIdx);
  }, [currentIndex, photoImages.length, changeSlide]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => {
      if (prev) setPanOffset({ x: 0, y: 0 });
      return !prev;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Drag & Pan handlers
  const startDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialPanRef.current = { ...panOffset };
  };

  const updatePan = (clientX: number, clientY: number) => {
    setPanOffset({
      x: initialPanRef.current.x + (clientX - dragStartRef.current.x),
      y: initialPanRef.current.y + (clientY - dragStartRef.current.y),
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isZoomed) {
      updatePan(e.clientX, e.clientY);
    }
  };

  // Touch handlers for mobile (swipe left/right, swipe down to close, double-tap to zoom, pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();

    // Double-tap detection
    if (now - lastTapRef.current < 300) {
      toggleZoom();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };

    if (isZoomed) {
      startDrag(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isZoomed && isDragging) {
      updatePan(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed) {
      endDrag();
      return;
    }

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Quick swipe down to close (vertical distance > 90px and mostly vertical)
    if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5 && dt < 400) {
      onClose();
      return;
    }

    // Horizontal swipe next / prev
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2 && dt < 400) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!isOpen || photoImages.length === 0) return null;

  const currentImage = photoImages[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white backdrop-blur-md transition-opacity duration-200 select-none"
      onMouseUp={endDrag}
    >
      {/* Header Bar */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6">
        <div className="flex items-center gap-3">
          {productArticle && (
            <span className="rounded bg-neutral-800 px-2 py-1 font-mono text-xs text-neutral-300">
              {productArticle}
            </span>
          )}
          <span className="text-sm font-medium text-neutral-300">
            {currentIndex + 1} з {photoImages.length}
          </span>
          {productTitle && (
            <span className="hidden max-w-[400px] truncate text-sm font-semibold text-neutral-400 md:inline-block">
              {productTitle}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleZoom}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white"
            title={isZoomed ? 'Зменшити' : 'Збільшити (2.5x)'}
            aria-label={isZoomed ? 'Зменшити' : 'Збільшити'}
          >
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-200 transition-colors hover:bg-red-500/80 hover:text-white"
            title="Закрити (Esc)"
            aria-label="Закрити"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-12"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Navigation arrow Left (desktop & tablet) */}
        {photoImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hover:bg-primary-500 absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-neutral-900/70 text-white shadow-lg backdrop-blur-xs transition-all hover:scale-110 sm:flex"
            aria-label="Попереднє фото"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Center Product Image */}
        <div
          className={`relative flex h-full w-full items-center justify-center transition-transform ${
            isDragging ? 'cursor-grabbing duration-0' : 'duration-200'
          } ${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'}`}
          onClick={() => {
            if (!isDragging) toggleZoom();
          }}
          style={{
            transform: isZoomed
              ? `scale(2.5) translate(${panOffset.x / 2.5}px, ${panOffset.y / 2.5}px)`
              : 'scale(1) translate(0px, 0px)',
          }}
        >
          <Image
            src={currentImage.url || '/placeholder-image.jpg'}
            alt={productTitle || 'Фото товару'}
            width={1200}
            height={1200}
            className="max-h-[72vh] max-w-[92vw] object-contain select-none md:max-h-[78vh] md:max-w-[85vw]"
            priority
            draggable={false}
          />
        </div>

        {/* Navigation arrow Right (desktop & tablet) */}
        {photoImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hover:bg-primary-500 absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-neutral-900/70 text-white shadow-lg backdrop-blur-xs transition-all hover:scale-110 sm:flex"
            aria-label="Наступне фото"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Thumbnails Strip (Bottom) */}
      <div className="flex h-20 shrink-0 items-center justify-center px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {photoImages.length > 1 && (
          <div className="scrollbar-none flex max-w-full items-center gap-2 overflow-x-auto rounded-xl bg-neutral-900/60 px-2 py-1 backdrop-blur-xs">
            {photoImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => changeSlide(idx)}
                className={`relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-white/10 p-1 transition-all md:h-14 md:w-14 ${
                  currentIndex === idx
                    ? 'border-primary-500 ring-primary-500/50 ring-2'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Фото ${idx + 1}`}
              >
                <Image
                  src={img.url || '/placeholder-image.jpg'}
                  alt={`Мініатюра ${idx + 1}`}
                  width={60}
                  height={60}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
