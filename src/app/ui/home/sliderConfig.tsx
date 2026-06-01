import React from 'react';
import { Settings } from 'react-slick';
import { PrevArrow, NextArrow } from './SliderArrows';

/**
 * Generates reusable React Slick slider configuration settings with premium defaults.
 * Supports clean overrides and handles deep merging of responsive settings automatically.
 * 
 * @param productCount Total number of products in the slider list
 * @param overrides Optional Settings override object (e.g. autoplay, autoplaySpeed, custom infinite)
 */
export const getSliderSettings = (productCount: number, overrides: Partial<Settings> = {}): Settings => {
  // Respect custom infinite overrides if provided, otherwise default to productCount boundaries
  const getInfiniteValue = (limit: number) => {
    return overrides.infinite !== undefined ? overrides.infinite : productCount > limit;
  };

  const baseSettings: Settings = {
    dots: true,
    infinite: getInfiniteValue(4),
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: productCount > 4,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: Math.min(3, productCount),
          slidesToScroll: 1,
          infinite: getInfiniteValue(3),
          swipeToSlide: true,
          arrows: productCount > 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, productCount),
          slidesToScroll: 1,
          infinite: getInfiniteValue(3),
          swipeToSlide: true,
          arrows: productCount > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, productCount),
          slidesToScroll: 1,
          infinite: getInfiniteValue(2),
          swipeToSlide: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: getInfiniteValue(1),
          swipeToSlide: true,
          arrows: false,
        },
      },
    ],
  };

  // Base merge
  const mergedSettings = {
    ...baseSettings,
    ...overrides,
  };

  // If there are responsive overrides, safely merge settings inside responsive array items
  if (overrides.responsive && baseSettings.responsive) {
    mergedSettings.responsive = baseSettings.responsive.map((baseItem) => {
      const overrideItem = overrides.responsive?.find((item) => item.breakpoint === baseItem.breakpoint);
      if (overrideItem) {
        const mergedItemSettings = 
          typeof baseItem.settings === 'object' && typeof overrideItem.settings === 'object'
            ? { ...baseItem.settings, ...overrideItem.settings }
            : overrideItem.settings !== undefined ? overrideItem.settings : baseItem.settings;

        return {
          ...baseItem,
          ...overrideItem,
          settings: mergedItemSettings,
        };
      }
      return baseItem;
    });
  }

  return mergedSettings;
};
