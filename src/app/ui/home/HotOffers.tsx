'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Heart, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '@/lib/types';
import { useAppDispatch, useAppSelector, useSliderMouseWheel } from '@/lib/hooks';
import {
  addProductToCartThunk,
  addFavoriteProductThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import { toast } from 'react-toastify';
import { getSliderSettings } from './sliderConfig';
import { CATEGORY_IDS } from '@/lib/constants';

interface HotOffersProps {
  products: Product[];
}

export default function HotOffers({ products }: HotOffersProps) {
  const [activeTab, setActiveTab] = useState<'popular' | 'p20s' | 'sets'>('popular');
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const categoriesList = useAppSelector((state) => state.persistedMainReducer.categories) || [];

  const batteryToolCategoryId = String(
    categoriesList.find((c) => c.name.toLowerCase() === 'акумуляторний інструмент')?.id ||
      CATEGORY_IDS.BATTERY_TOOL,
  );
  const p20sLineCategoryId = String(
    categoriesList.find(
      (c) =>
        c.name.toLowerCase().includes('p20s') ||
        c.name.toLowerCase().includes('акумуляторна лінійка p20s'),
    )?.id || CATEGORY_IDS.P20S_LINE,
  );

  const sliderRef = useRef<Slider | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic filter lists
  const popularOffers = products
    .filter((p) => (p.rrcSale && p.rrcSale > 0) || p.countInStock > 50)
    .slice(0, 10);

  const p20sOffers = products
    .filter((p) => {
      const catId = p.category?.id ? String(p.category.id) : '';
      const name = p.name.toLowerCase();
      return (
        catId === p20sLineCategoryId ||
        catId === batteryToolCategoryId ||
        name.includes('батарея') ||
        name.includes('акумулятор') ||
        name.includes('зарядн')
      );
    })
    .slice(0, 10);

  const setsOffers = products
    .filter((p) => {
      const name = p.name.toLowerCase();
      const art = p.article.trim().toUpperCase();
      return (
        name.includes('набір') ||
        name.includes('комплект') ||
        art.startsWith('AK') ||
        art.startsWith('HK')
      );
    })
    .slice(0, 10);

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'p20s':
        return p20sOffers;
      case 'sets':
        return setsOffers;
      default:
        return popularOffers;
    }
  };

  const activeProducts = getActiveProducts();

  useSliderMouseWheel(sliderRef, sliderContainerRef, activeProducts.length);

  const isAuth = authState.isAuthenticated || false;
  const user = authState.user;
  const isB2BUser =
    authState.isB2b ||
    (user &&
      ((user as unknown as { isB2B?: boolean; isB2b?: boolean }).isB2B === true ||
        (user as unknown as { isB2B?: boolean; isB2b?: boolean }).isB2b === true));
  const favorites: Product[] = [...(authState.user?.favorites || [])];
  const favoritesIdList = favorites.map((p) => (typeof p === 'string' ? Number(p) : p.id));

  const handleFavoriteClick = (product: Product) => {
    if (isAuth) {
      if (favoritesIdList.includes(product.id)) {
        dispatch(deleteFavoriteProductThunk(product.id));
        toast.info(`${product.name} видалено з обраного`);
      } else {
        dispatch(addFavoriteProductThunk(product.id));
        toast.success(`${product.name} додано в обране`);
      }
    } else {
      toast.error('Для додавання в обране потрібно увійти в профіль');
    }
  };

  const handleCartClick = (product: Product) => {
    if (isAuth) {
      dispatch(
        addProductToCartThunk({
          productId: product.id,
          quantity: 1,
          isRetail: !isB2BUser,
        }),
      )
        .unwrap()
        .then(() => {
          toast.success(`${product.name} додано в кошик`);
        });
    } else {
      const { price: _price, priceBulk: _priceBulk, ...restProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: restProduct,
          quantity: 1,
          id: product.id,
        }),
      );
      toast.success(`${product.name} додано в кошик`);
    }
  };

  const sliderSettings = getSliderSettings(activeProducts.length, {
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    infinite: true,
  });

  return (
    <section className="flex w-full flex-col gap-6 px-5 pb-16 md:px-[60px]">
      {/* Title & Tabs Block */}
      <div className="flex flex-col gap-4 border-b border-[#E5E3DD] pb-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-3xl">
            ГАРЯЧІ ПРОПОЗИЦІЇ
          </h2>
          <p className="font-sans text-sm text-neutral-500">Найкращі рішення для ваших проектів</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 select-none">
          <button
            onClick={() => setActiveTab('popular')}
            className={`font-display cursor-pointer rounded-md px-4 py-2 text-xs font-medium transition-all duration-300 md:text-sm ${
              activeTab === 'popular'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'border border-[#E5E3DD] bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Популярні товари
          </button>
          <button
            onClick={() => setActiveTab('p20s')}
            className={`font-display cursor-pointer rounded-md px-4 py-2 text-xs font-medium transition-all duration-300 md:text-sm ${
              activeTab === 'p20s'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'border border-[#E5E3DD] bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Акумулятори P20S
          </button>
          <button
            onClick={() => setActiveTab('sets')}
            className={`font-display cursor-pointer rounded-md px-4 py-2 text-xs font-medium transition-all duration-300 md:text-sm ${
              activeTab === 'sets'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'border border-[#E5E3DD] bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Професійні комплекти
          </button>
        </div>
      </div>

      {/* Slider Carousel Wrapper */}
      <div
        ref={sliderContainerRef}
        className="relative cursor-grab px-4 select-none active:cursor-grabbing"
      >
        {activeProducts.length > 0 ? (
          <Slider ref={sliderRef} {...sliderSettings}>
            {activeProducts.map((product) => (
              <div key={product.id} className="h-full px-2 py-3">
                <HotOfferCard
                  product={product}
                  activeTab={activeTab}
                  isFav={favoritesIdList.includes(product.id)}
                  onFavClick={handleFavoriteClick}
                  onCartClick={handleCartClick}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="w-full py-10 text-center text-neutral-400">
            Завантаження акційних пропозицій...
          </div>
        )}
      </div>
    </section>
  );
}

interface HotOfferCardProps {
  product: Product;
  activeTab: 'popular' | 'p20s' | 'sets';
  isFav: boolean;
  onFavClick: (product: Product) => void;
  onCartClick: (product: Product) => void;
}

function HotOfferCard({ product, activeTab, isFav, onFavClick, onCartClick }: HotOfferCardProps) {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API || 'https://api-ingco-service.win';
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${apiBaseUrl}${product.image}`
    : '/placeholder.webp';

  let isSale = !!(product.rrcSale && product.rrcSale > 0);
  let price = isSale ? product.rrcSale : product.priceRetailRecommendation;
  let originalPrice = isSale ? product.priceRetailRecommendation : null;

  if (!isSale && activeTab === 'popular' && product.priceRetailRecommendation > 100) {
    isSale = true;
    originalPrice = product.priceRetailRecommendation;
    price = Math.round(product.priceRetailRecommendation * 0.85); // 15% off
  }

  const isStandart =
    product.article.toUpperCase().startsWith('CDLI') &&
    !product.article.toUpperCase().startsWith('CIDLI');

  const mouseCoords = useRef({ x: 0, y: 0 });
  const touchCoords = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    const diffX = Math.abs(e.clientX - mouseCoords.current.x);
    const diffY = Math.abs(e.clientY - mouseCoords.current.y);
    if (diffX < 5 && diffY < 5) {
      router.push(`/${product.slug}`);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchCoords.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    if (e.changedTouches.length > 0) {
      const diffX = Math.abs(e.changedTouches[0].clientX - touchCoords.current.x);
      const diffY = Math.abs(e.changedTouches[0].clientY - touchCoords.current.y);
      if (diffX < 5 && diffY < 5) {
        router.push(`/${product.slug}`);
      }
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-[#E5E3DD] bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-lg"
    >
      {/* Top action/tag ribbon */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded px-2 py-0.5 font-sans text-[10px] font-bold uppercase select-none ${
              isStandart ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isStandart ? 'STANDART' : 'INDUSTRIAL'}
          </span>
          {isSale && (
            <span className="flex items-center gap-0.5 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-red-600 select-none">
              <Percent size={10} />
              Акція
            </span>
          )}
        </div>
        <button
          onClick={() => onFavClick(product)}
          className={`cursor-pointer rounded-full p-1.5 transition-colors hover:bg-neutral-100 ${isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-600'}`}
          aria-label="Додати в обране"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative my-2 flex h-[160px] w-full items-center justify-center overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={product.name}
          width={180}
          height={180}
          className="h-auto max-h-[150px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        {/* Availability */}
        <div className="flex items-center gap-1.5 font-sans text-xs">
          <span
            className={`h-2 w-2 rounded-full ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}>
            {product.countInStock > 0 ? 'В наявності' : 'Немає в наявності'}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/${product.slug}`}
          className="font-display hover:text-primary-500 line-clamp-2 min-h-[40px] text-sm font-semibold text-neutral-800 transition-colors"
        >
          {product.name}
        </Link>

        {/* Pricing & Add to Cart */}
        <div className="mt-2 flex items-center justify-between border-t border-neutral-50 pt-3">
          <div className="flex flex-col">
            {!!originalPrice && (
              <span className="font-sans text-xs text-neutral-400 line-through">
                {originalPrice} ₴
              </span>
            )}
            <span className="font-display text-lg font-bold text-neutral-900">{price} ₴</span>
          </div>

          <button
            onClick={() => onCartClick(product)}
            className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500 cursor-pointer rounded-full p-2.5 text-white shadow-md shadow-orange-500/10 transition-colors focus:ring-2 focus:outline-none"
            aria-label="Додати в кошик"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
