'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Check, Heart, ShoppingCart } from 'lucide-react';
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

interface SeriesComparisonProps {
  products: Product[];
}

export default function SeriesComparison({ products }: SeriesComparisonProps) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.persistedAuthReducer);

  const standartSliderRef = React.useRef<Slider | null>(null);
  const industrialSliderRef = React.useRef<Slider | null>(null);
  const standartContainerRef = React.useRef<HTMLDivElement | null>(null);
  const industrialContainerRef = React.useRef<HTMLDivElement | null>(null);

  const isAuth = authState.isAuthenticated || false;
  const user = authState.user;
  const isB2BUser =
    authState.isB2b ||
    (user &&
      ((user as unknown as { isB2B?: boolean; isB2b?: boolean }).isB2B === true ||
        (user as unknown as { isB2B?: boolean; isB2b?: boolean }).isB2b === true));
  const favorites: Product[] = [...(authState.user?.favorites || [])];
  const favoritesIdList = favorites.map((p) => (typeof p === 'string' ? Number(p) : p.id));

  // Dynamic filter for Standart products (DIY/home)
  const standartProducts = products
    .filter((p) => {
      const art = p.article.trim().toUpperCase();
      const name = p.name.toUpperCase();
      return (
        (art.startsWith('CDLI') && !art.startsWith('CIDLI')) ||
        art.startsWith('ID') ||
        art.startsWith('HBT') ||
        art.startsWith('HPET') ||
        art.startsWith('HSMT') ||
        art.startsWith('HKTH') ||
        name.includes('STANDART') ||
        name.includes('ПОБУТОВ') ||
        p.priceRetailRecommendation < 2500
      );
    })
    .slice(0, 10);

  // Dynamic filter for Industrial products (Professional)
  const industrialProducts = products
    .filter((p) => {
      const art = p.article.trim().toUpperCase();
      const name = p.name.toUpperCase();
      return (
        art.startsWith('CIDLI') ||
        art.startsWith('CGTLI') ||
        art.startsWith('RGH') ||
        art.startsWith('AG26') ||
        art.startsWith('PDB') ||
        art.startsWith('VC14') ||
        art.startsWith('AC25') ||
        name.includes('INDUSTRIAL') ||
        name.includes('ПРОФЕСІЙН') ||
        p.priceRetailRecommendation >= 2500
      );
    })
    .slice(0, 10);

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

  useSliderMouseWheel(standartSliderRef, standartContainerRef, standartProducts.length);
  useSliderMouseWheel(industrialSliderRef, industrialContainerRef, industrialProducts.length);

  return (
    <section className="flex w-full flex-col gap-10 px-5 pb-16 md:px-[60px]">
      {/* Title Block */}
      <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
        <h2 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-4xl">
          Професійне рішення чи надійність для дому?
        </h2>
        <p className="font-sans text-sm leading-relaxed text-neutral-500 md:text-base">
          Оберіть інструмент, який відповідає вашим завданням. Від інтенсивного промислового
          використання до надійного помічника вдома.
        </p>
      </div>

      {/* Series Columns Wrapper */}
      <div className="flex flex-col gap-14">
        {/* STANDART Line */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Info Card (Left) */}
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5E3DD] bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-500/20 hover:shadow-md lg:col-span-4 lg:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-display text-xs font-bold tracking-wider text-neutral-400 uppercase select-none">
                  STANDART
                </span>
                <h3 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-3xl">
                  Для дому та майстерні
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-neutral-500">
                Оптимальне співвідношення ціни та якості для періодичних робіт, ремонту вдома чи
                невеликих майстерень.
              </p>
              <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Легка та ергономічна конструкція</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Доступна ціна</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Гарантія 1 рік</span>
                </li>
              </ul>
            </div>
            <Link
              href="/?catalog=true&query=standart"
              className="font-display hover:text-primary-500 mt-4 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-neutral-900 transition-colors md:text-base"
            >
              Дивитись серію Standart ➔
            </Link>
          </div>

          {/* Product Carousel (Right) */}
          <div
            ref={standartContainerRef}
            className="relative cursor-grab px-4 select-none active:cursor-grabbing lg:col-span-8"
          >
            {standartProducts.length > 0 ? (
              <Slider ref={standartSliderRef} {...getSliderSettings(standartProducts.length)}>
                {standartProducts.map((product) => (
                  <div key={product.id} className="h-full px-2 py-3">
                    <ProductCarouselCard
                      product={product}
                      badge="STANDART"
                      badgeBg="bg-neutral-100 text-neutral-600"
                      isFav={favoritesIdList.includes(product.id)}
                      onFavClick={() => handleFavoriteClick(product)}
                      onCartClick={() => handleCartClick(product)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="py-10 text-center text-neutral-400">
                Завантаження товарів серії Standart...
              </div>
            )}
          </div>
        </div>

        {/* INDUSTRIAL Line */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Info Card (Left) */}
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5E3DD] bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-500/20 hover:shadow-md lg:col-span-4 lg:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-display text-xs font-bold tracking-wider text-amber-600 uppercase select-none">
                  INDUSTRIAL
                </span>
                <h3 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-3xl">
                  Для професіоналів
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-neutral-500">
                Інструмент, розроблений для тривалих та екстремальних навантажень. Посилена
                конструкція, висока зносостійкість та ідеальний результат роботи.
              </p>
              <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Тривала безперервна робота</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Захист двигуна та вузлів</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-primary-50 text-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Гарантія 2 роки</span>
                </li>
              </ul>
            </div>
            <Link
              href="/?catalog=true&query=industrial"
              className="font-display hover:text-primary-500 mt-4 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-neutral-900 transition-colors md:text-base"
            >
              Дивитись серію Industrial ➔
            </Link>
          </div>

          {/* Product Carousel (Right) */}
          <div
            ref={industrialContainerRef}
            className="relative cursor-grab px-4 select-none active:cursor-grabbing lg:col-span-8"
          >
            {industrialProducts.length > 0 ? (
              <Slider ref={industrialSliderRef} {...getSliderSettings(industrialProducts.length)}>
                {industrialProducts.map((product) => (
                  <div key={product.id} className="h-full px-2 py-3">
                    <ProductCarouselCard
                      product={product}
                      badge="INDUSTRIAL"
                      badgeBg="bg-amber-100 text-amber-800"
                      isFav={favoritesIdList.includes(product.id)}
                      onFavClick={() => handleFavoriteClick(product)}
                      onCartClick={() => handleCartClick(product)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="py-10 text-center text-neutral-400">
                Завантаження товарів серії Industrial...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  badge: string;
  badgeBg: string;
  isFav: boolean;
  onFavClick: () => void;
  onCartClick: () => void;
}

function ProductCarouselCard({
  product,
  badge,
  badgeBg,
  isFav,
  onFavClick,
  onCartClick,
}: ProductCardProps) {
  const router = useRouter();
  const apiBaseUrl = 'https://api-ingco-service.win';
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${apiBaseUrl}${product.image}`
    : '/placeholder.webp';

  const isSale = !!(product.rrcSale && product.rrcSale > 0);
  const price = isSale ? product.rrcSale : product.priceRetailRecommendation;
  const originalPrice = isSale ? product.priceRetailRecommendation : null;

  const mouseCoords = React.useRef({ x: 0, y: 0 });
  const touchCoords = React.useRef({ x: 0, y: 0 });

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
        <span
          className={`rounded px-2 py-0.5 font-sans text-[10px] font-bold uppercase select-none ${badgeBg}`}
        >
          {badge}
        </span>
        <button
          onClick={onFavClick}
          className={`cursor-pointer rounded-full p-1.5 transition-colors hover:bg-neutral-100 ${isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-600'}`}
          aria-label="Додати в обране"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative my-3 flex h-[150px] w-full items-center justify-center overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={product.name}
          width={150}
          height={150}
          className="max-h-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {/* Sale Tag */}
        {isSale && (
          <span className="absolute bottom-1 left-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white select-none">
            Акція
          </span>
        )}
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
            onClick={onCartClick}
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
