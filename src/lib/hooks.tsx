import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '@/lib/appState/store';
import React, { useCallback, useEffect } from 'react';
import { trackProductClickThunk } from './appState/main/operations';
import Slider from 'react-slick';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useProductStats = () => {
  const dispatch = useAppDispatch();

  const logProductClick = useCallback(
    (productId: number) => {
      dispatch(trackProductClickThunk(productId));
    },
    [dispatch],
  );

  return { logProductClick };
};

interface SliderWithState {
  innerSlider?: {
    state?: {
      currentSlide?: number;
    };
  };
}

export const useSliderMouseWheel = (
  sliderRef: React.RefObject<Slider | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  productCount: number
) => {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const slider = sliderRef.current;
      if (!slider) return;

      let slidesToShow = 4;
      if (window.innerWidth < 480) {
        slidesToShow = 1;
      } else if (window.innerWidth < 768) {
        slidesToShow = 2;
      } else if (window.innerWidth < 1300) {
        slidesToShow = 3;
      }

      const isInfinite = productCount > slidesToShow;
      if (!isInfinite) {
        // If all slides fit on screen, let page scroll normally
        return;
      }

      // Only intercept horizontal scrolling/swipe (deltaX) to let standard vertical scrolling move the page normally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        const currentSlide = (slider as unknown as SliderWithState).innerSlider?.state?.currentSlide ?? 0;
        const isAtStart = currentSlide === 0;
        const isAtEnd = currentSlide >= productCount - slidesToShow;
        const isScrollingLeft = e.deltaX < 0;
        const isScrollingRight = e.deltaX > 0;

        if ((isScrollingLeft && isAtStart) || (isScrollingRight && isAtEnd)) {
          return;
        }

        e.preventDefault();
        if (e.deltaX > 0) {
          slider.slickNext();
        } else {
          slider.slickPrev();
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [sliderRef, containerRef, productCount]);
};

