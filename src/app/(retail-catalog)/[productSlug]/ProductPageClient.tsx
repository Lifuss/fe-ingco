'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import JsBarcode from 'jsbarcode';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Play,
  Info,
  Plus,
  Minus,
  Pencil,
  Phone,
} from 'lucide-react';
import { getSpecIcon, shouldShowBatteryWarning } from '@/lib/productUtils';
import { isProductOnSale } from '@/lib/utils';

import { getYoutubeEmbedUrl } from '@/lib/utils';
import { generateProductJsonLd } from '@/lib/metadata';

import { useGetCategoriesQuery } from '@/lib/appState/api/categoriesApi';
import { useGetProductBySlugQuery, useGetProductsQuery } from '@/lib/appState/api/productsApi';
import { useAppDispatch, useAppSelector, useIsB2B } from '@/lib/hooks';
import { selectUSDRate } from '@/lib/appState/main/selectors';

import {
  addProductToCartThunk,
  addFavoriteProductThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import Breadcrumbs from '~/ui/Breadcrumbs';
import { ProductReviewsSection } from '~/ui/product/ProductReviewsSection';
import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import ConsultationModal from '~/ui/modals/ConsultationModal';
import ProductSkeleton from '~/ui/skeletons/ProductSkeleton';
import ProductCard from '@/app/ui/product/ProductCard';
import { Product } from '@/lib/types';

type ProductPageClientProps = {
  initialProduct: Product;
  initialRelatedProducts?: Product[];
  productSlug: string;
  isAdminServer?: boolean;
};

export default function ProductPageClient({
  initialProduct,
  initialRelatedProducts = [],
  productSlug,
  isAdminServer = false,
}: ProductPageClientProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Redux & Auth state
  const isB2b = useIsB2B();

  const user = useAppSelector((state) => state.persistedAuthReducer.user);
  const isAdminClient = isClient && (user?.role === 'ADMIN' || user?.role === 'admin');
  const isAdmin = Boolean(isAdminServer || isAdminClient);

  const { data: queriedProduct } = useGetProductBySlugQuery(productSlug);
  // Use initialProduct as fallback to ensure zero layout shift during SSR/Hydration
  const product = queriedProduct || initialProduct;

  const { data: categories = [] } = useGetCategoriesQuery('');
  const isAuth = useAppSelector((state) => state.persistedAuthReducer.isAuthenticated);
  const favoritesState = useAppSelector(
    (state) => state.persistedAuthReducer.user?.favorites || [],
  );
  const favoritesIdList = favoritesState.map((p: unknown) =>
    typeof p === 'object' && p !== null ? (p as { id: number }).id : Number(p),
  );
  const usdRate = useAppSelector(selectUSDRate);

  // Client-side B2B related products query
  const { data: b2bRelatedData } = useGetProductsQuery(
    {
      page: 1,
      limit: 5,
      isRetail: false,
      category: product?.category?.id ? String(product.category.id) : undefined,
      sortValue: 'default',
    },
    { skip: !isB2b || !product?.category?.id },
  );

  // UI state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [activeSection, setActiveSection] = useState('about-product');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

  useEffect(() => {
    if (product?.barcode && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, product.barcode, {
          format: 'CODE128',
          width: 1.8,
          height: 32,
          margin: 0,
          fontSize: 10,
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    }
  }, [product]);

  // ScrollSpy using IntersectionObserver
  useEffect(() => {
    if (!product) return;
    const sections = ['about-product', 'specifications', 'description', 'reviews', 'cross-sell'];

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-60px 0px -50% 0px',
      threshold: 0.1,
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [product]);

  if (!product || !product.id) {
    return (
      <main className="flex flex-col gap-4 bg-white px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CatalogSidebar />
        <div className="min-h-[550px] w-full">
          <ProductSkeleton />
        </div>
      </main>
    );
  }

  const wholesalePriceUah = Math.ceil((product.price || 0) * usdRate);
  const isOnSale = isProductOnSale(product);

  // Favorite toggle
  const isFavorite = favoritesIdList.includes(product.id);
  const handleFavoriteClick = () => {
    if (!isAuth) {
      toast.info('Будь ласка, увійдіть, щоб додавати товари до обраного.');
      return;
    }
    if (isFavorite) {
      dispatch(deleteFavoriteProductThunk(product.id));
      toast.success('Товар вилучено з обраного');
    } else {
      dispatch(addFavoriteProductThunk(product.id));
      toast.success('Товар додано до обраного');
    }
  };

  // Add to cart with custom quantity
  const handleAddToCart = async () => {
    const qty = typeof quantity === 'number' ? quantity : 1;
    if (isAuth) {
      await dispatch(
        addProductToCartThunk({
          productId: product.id,
          quantity: qty,
          isRetail: !isB2b,
        }),
      ).unwrap();
    } else {
      const { price: _price, priceBulk: _priceBulk, ...normalizeProduct } = product;
      await Promise.resolve(
        dispatch(
          addProductToLocalStorageCart({
            productId: normalizeProduct,
            quantity: qty,
            id: product.id,
          }),
        ),
      );
    }
    toast.success(`Товар додано до кошика (${qty} шт.)`);
  };

  // Qty helpers
  const incrementQty = () => setQuantity((prev) => (typeof prev === 'number' ? prev + 1 : 1));
  const decrementQty = () =>
    setQuantity((prev) => (typeof prev === 'number' && prev > 1 ? prev - 1 : 1));
  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setQuantity('');
    } else {
      const num = Number(val);
      setQuantity(num < 1 ? 1 : num);
    }
  };
  const handleQtyBlur = () => {
    if (quantity === '') {
      setQuantity(1);
    }
  };

  // Breadcrumbs
  const breadcrumbsItems: { label: string; href?: string }[] = [
    { label: isB2b ? 'Каталог партнера' : 'Головна', href: '/' },
  ];
  const electroCategory = categories?.find((c) =>
    c.name?.toLowerCase().includes('електроінструмент'),
  );
  if (electroCategory) {
    breadcrumbsItems.push({
      label: electroCategory.name,
      href: `/?category=${electroCategory.id}`,
    });
  } else {
    breadcrumbsItems.push({ label: 'Електроінструмент', href: '/' });
  }
  if (
    product.category?.name &&
    !product.category.name.toLowerCase().includes('електроінструмент')
  ) {
    breadcrumbsItems.push({
      label: product.category.name,
      href: `/?category=${product.category.id}`,
    });
  }
  breadcrumbsItems.push({ label: product.article || product.name });

  const galleryImages: { type: 'image' | 'video'; url: string; className: string }[] = [];

  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      galleryImages.push({
        type: 'image',
        url: img.startsWith('http') ? img : process.env.NEXT_PUBLIC_API + img,
        className: 'object-contain',
      });
    });
  } else if (product.image) {
    galleryImages.push({
      type: 'image',
      url: product.image.startsWith('http')
        ? product.image
        : process.env.NEXT_PUBLIC_API + product.image,
      className: 'object-contain',
    });
  } else {
    galleryImages.push({
      type: 'image',
      url: '/placeholder.webp',
      className: 'object-contain',
    });
  }

  if (product.videoUrl) {
    galleryImages.push({
      type: 'video',
      url: product.videoUrl,
      className: '',
    });
  }

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 60; // Account for sticky menu
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Filter out the current product from recommendations
  const baseRelated =
    (isB2b && b2bRelatedData?.products ? b2bRelatedData.products : null) ?? initialRelatedProducts;
  const relatedProducts =
    baseRelated && baseRelated.length > 0
      ? baseRelated.filter((p) => p.id !== product.id).slice(0, 4)
      : [];

  return (
    <>
      <main className="flex min-h-[600px] flex-col gap-4 bg-neutral-50 px-4 pt-8 md:px-[60px]">
        {/* Dynamic breadcrumbs */}
        <div className="mx-auto w-full max-w-[1680px]">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* ScrollSpy Tabs navigation */}
        <div className="sticky top-0 z-40 -mx-4 border-b border-neutral-200 bg-white px-4 shadow-sm md:-mx-[60px] md:px-[60px]">
          <div className="scrollbar-none mx-auto flex max-w-[1680px] gap-6 overflow-x-auto py-3.5 md:gap-10">
            {[
              { id: 'about-product', label: 'Про товар' },
              { id: 'specifications', label: 'Характеристики' },
              { id: 'description', label: 'Опис' },
              { id: 'reviews', label: 'Відгуки та питання' },
              { id: 'cross-sell', label: 'Купують разом' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`font-display relative cursor-pointer border-b-2 pb-1 text-sm font-semibold whitespace-nowrap transition-all md:text-base ${
                  activeSection === tab.id
                    ? 'text-primary border-primary font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 py-6 xl:flex-row 2xl:gap-14">
          <CatalogSidebar />

          <div className="flex w-full flex-col gap-10">
            {/* Section 1: Hero Block (Hero & Buy Box) */}
            <section
              id="about-product"
              className="grid scroll-mt-24 grid-cols-1 gap-8 lg:grid-cols-12"
            >
              {/* Left Column: Gallery & Micro Features */}
              <div className="flex flex-col gap-6 lg:col-span-7">
                {/* Product Name Title on Mobile */}
                <div className="block lg:hidden">
                  <h1 className="font-display mb-2 text-xl leading-tight font-bold text-neutral-900 md:text-2xl">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
                      Артикул: {product.article}
                    </span>
                    {isAdmin && (
                      <Link
                        href={`/dashboard/product/edit/${product.id}`}
                        className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 font-sans text-xs font-bold text-amber-800 transition-colors hover:bg-amber-200"
                        title="Редагувати в адмінці"
                      >
                        <Pencil size={12} />
                        <span>Редагувати в адмінці</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Main Media Box */}
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm select-none">
                  {/* Badges absolute top-left */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      {product.badges.map((badge) => (
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

                  {galleryImages[activeImageIndex].type === 'image' ? (
                    <Image
                      src={galleryImages[activeImageIndex].url || '/placeholder-image.jpg'}
                      alt={product.name}
                      width={500}
                      height={500}
                      className={`max-h-[350px] w-auto object-contain transition-transform duration-300 ${galleryImages[activeImageIndex].className}`}
                      priority
                    />
                  ) : (
                    <div
                      onClick={() => setIsVideoModalOpen(true)}
                      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl bg-neutral-100/50 transition-colors hover:bg-neutral-100"
                    >
                      <div className="bg-primary-500 shadow-primary-500/20 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-105">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                      <span className="font-display text-sm font-semibold text-neutral-800">
                        Дивитися відеоогляд
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 gap-3 select-none">
                  {galleryImages.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.type === 'video') {
                          setIsVideoModalOpen(true);
                        } else {
                          setActiveImageIndex(idx);
                        }
                      }}
                      className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded-xl border bg-white p-2 transition-all ${
                        item.type !== 'video' && activeImageIndex === idx
                          ? 'border-primary bg-primary-50/20 ring-primary shadow-sm ring-1'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {item.type === 'image' ? (
                        <Image
                          src={item.url || '/placeholder-image.jpg'}
                          alt={`Thumbnail ${idx}`}
                          width={80}
                          height={80}
                          className={`max-h-full w-auto object-contain ${item.className}`}
                        />
                      ) : (
                        <div className="hover:text-primary flex flex-col items-center justify-center gap-1 text-neutral-500">
                          <Play size={24} className="stroke-[2.5]" />
                          <span className="text-[10px] font-bold tracking-wider uppercase">
                            Відео
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Specific layout short badges */}
                {product.characteristics && product.characteristics.length > 0 && (
                  <div
                    className={`grid gap-3 text-center ${
                      product.characteristics.slice(0, 3).length === 1
                        ? 'mx-auto max-w-[180px] grid-cols-1'
                        : product.characteristics.slice(0, 3).length === 2
                          ? 'mx-auto max-w-[360px] grid-cols-2'
                          : 'grid-cols-3'
                    }`}
                  >
                    {product.characteristics.slice(0, 3).map((char, index) => (
                      <div
                        key={char.code || index}
                        className="bg-primary-50/40 border-primary-100/60 flex min-h-[90px] flex-col items-center justify-center gap-1.5 rounded-xl border p-3 shadow-sm"
                      >
                        {getSpecIcon(char.name, char.code)}
                        <span
                          className="max-w-full truncate text-[10px] font-semibold text-neutral-500 uppercase"
                          title={char.name}
                        >
                          {char.name}
                        </span>
                        <span
                          className="font-display max-w-full truncate text-xs font-bold text-neutral-900 md:text-sm"
                          title={Array.isArray(char.value) ? char.value.join(', ') : char.value}
                        >
                          {Array.isArray(char.value) ? char.value.join(', ') : char.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Buy Box Card */}
              <div className="relative lg:col-span-5">
                <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-[128px]">
                  {/* Name Header and Wishlist on Desktop */}
                  <div className="hidden items-start justify-between gap-4 lg:flex">
                    <div className="flex flex-col gap-1.5">
                      <h2 className="font-display text-xl leading-tight font-bold text-neutral-900 md:text-2xl">
                        {product.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="w-fit rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-500">
                          Артикул: {product.article}
                        </div>
                        {isAdmin && (
                          <Link
                            href={`/dashboard/product/edit/${product.id}`}
                            className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 font-sans text-xs font-bold text-amber-800 transition-colors hover:bg-amber-200"
                            title="Редагувати в адмінці"
                          >
                            <Pencil size={12} />
                            <span>Редагувати в адмінці</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleFavoriteClick}
                      className={`cursor-pointer rounded-full border p-2.5 transition-all ${
                        isFavorite
                          ? 'border-red-200 bg-red-50 text-red-500 shadow-sm'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
                      }`}
                      title={isFavorite ? 'Вилучити з обраного' : 'Додати в обране'}
                    >
                      <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Stock Availability */}
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                    <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500">
                      <span className="h-1 w-1 rounded-full bg-white"></span>
                    </span>
                    <span className="text-xs font-semibold text-green-600 md:text-sm">
                      В наявності (
                      {product.countInStock > 50 ? '>50 шт.' : `${product.countInStock} шт.`})
                    </span>
                  </div>

                  {/* Price and Counter Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                    <div className="flex flex-col">
                      {isB2b ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-neutral-400 uppercase">
                            Ціна партнера
                          </span>
                          {wholesalePriceUah > 0 && (product.price || 0) > 0 ? (
                            <>
                              <div className="flex items-baseline gap-2">
                                <span className="font-display text-2xl font-bold text-neutral-900">
                                  {Math.round(wholesalePriceUah).toLocaleString('uk-UA')} ₴
                                </span>
                              </div>
                              <span className="text-xs font-bold tracking-wide text-neutral-400">
                                ${Number(product.price || 0).toFixed(2)} / од.
                              </span>
                              <div className="mt-2 flex flex-col gap-1 text-[11px] font-semibold text-neutral-500">
                                <span>
                                  РРЦ:{' '}
                                  {Math.round(
                                    product.priceRetailRecommendation || 0,
                                  ).toLocaleString('uk-UA')}{' '}
                                  ₴
                                  {product.priceRetailRecommendation > wholesalePriceUah && (
                                    <span className="ml-1.5 font-bold text-teal-600">
                                      (Маржа:{' '}
                                      {Math.ceil(
                                        ((product.priceRetailRecommendation - wholesalePriceUah) /
                                          product.priceRetailRecommendation) *
                                          100,
                                      )}
                                      % / +
                                      {Math.round(
                                        product.priceRetailRecommendation - wholesalePriceUah,
                                      ).toLocaleString('uk-UA')}{' '}
                                      ₴)
                                    </span>
                                  )}
                                </span>
                                {isOnSale &&
                                  product.rrcSale &&
                                  product.rrcSale > wholesalePriceUah && (
                                    <span className="font-bold text-red-500">
                                      РРЦ Акція:{' '}
                                      {Math.round(product.rrcSale).toLocaleString('uk-UA')} ₴
                                      <span className="ml-1.5 font-bold text-teal-600">
                                        (Маржа:{' '}
                                        {Math.ceil(
                                          ((product.rrcSale - wholesalePriceUah) /
                                            product.rrcSale) *
                                            100,
                                        )}
                                        % / +
                                        {Math.round(
                                          product.rrcSale - wholesalePriceUah,
                                        ).toLocaleString('uk-UA')}{' '}
                                        ₴)
                                      </span>
                                    </span>
                                  )}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col gap-1 py-1">
                              <span className="font-display text-2xl font-bold text-amber-600">
                                Ціна за запитом
                              </span>
                              {product.priceRetailRecommendation > 0 && (
                                <span className="text-xs font-semibold text-neutral-500">
                                  РРЦ:{' '}
                                  {Math.round(product.priceRetailRecommendation).toLocaleString(
                                    'uk-UA',
                                  )}{' '}
                                  ₴
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-semibold text-neutral-400 uppercase">
                            Ціна
                          </span>
                          <div className="flex items-baseline gap-2">
                            {isOnSale && product.rrcSale && product.rrcSale > 0 ? (
                              <>
                                <span className="font-display text-primary text-2xl font-bold">
                                  {Math.round(product.rrcSale).toLocaleString('uk-UA')} ₴
                                </span>
                                {product.priceRetailRecommendation > 0 && (
                                  <span className="text-sm text-neutral-400 line-through">
                                    {Math.round(
                                      product.priceRetailRecommendation || 0,
                                    ).toLocaleString('uk-UA')}{' '}
                                    ₴
                                  </span>
                                )}
                              </>
                            ) : product.priceRetailRecommendation > 0 ? (
                              <span className="font-display text-2xl font-bold text-neutral-900">
                                {Math.round(product.priceRetailRecommendation || 0).toLocaleString(
                                  'uk-UA',
                                )}{' '}
                                ₴
                              </span>
                            ) : (
                              <span className="font-display text-2xl font-bold text-amber-600">
                                Ціна за запитом
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quantity counter */}
                    {(isB2b
                      ? wholesalePriceUah > 0 && (product.price || 0) > 0
                      : (isOnSale && product.rrcSale
                          ? product.rrcSale
                          : product.priceRetailRecommendation || 0) > 0) && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="mr-1 text-xs font-semibold text-neutral-400 uppercase">
                          Кількість
                        </span>
                        <div className="flex h-10 w-[120px] items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-inner">
                          <button
                            onClick={decrementQty}
                            className="flex h-full w-10 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200"
                            type="button"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="text"
                            value={quantity}
                            onChange={handleQtyInputChange}
                            onBlur={handleQtyBlur}
                            className="h-full w-10 border-none bg-transparent p-0 text-center font-sans text-sm font-semibold text-neutral-900 outline-none focus:ring-0"
                          />
                          <button
                            onClick={incrementQty}
                            className="flex h-full w-10 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200"
                            type="button"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart CTA */}
                  {(
                    isB2b
                      ? wholesalePriceUah > 0 && (product.price || 0) > 0
                      : (isOnSale && product.rrcSale
                          ? product.rrcSale
                          : product.priceRetailRecommendation || 0) > 0
                  ) ? (
                    <button
                      onClick={handleAddToCart}
                      className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 font-display shadow-primary-500/10 hover:shadow-primary-500/20 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all select-none"
                    >
                      <ShoppingCart size={20} fill="currentColor" />
                      <span>Додати до кошика</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsConsultModalOpen(true)}
                      className="font-display flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-amber-500 bg-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all select-none hover:bg-amber-600 active:bg-amber-700"
                    >
                      <Phone size={20} />
                      <span>Уточнити ціну</span>
                    </button>
                  )}

                  {/* Wishlist toggle for mobile */}
                  {!isTablet && (
                    <button
                      onClick={handleFavoriteClick}
                      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 font-sans text-sm font-semibold transition-all ${
                        isFavorite
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
                      <span>{isFavorite ? 'В обраному' : 'Додати в обране'}</span>
                    </button>
                  )}

                  {/* Trust triggers */}
                  <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
                    <div className="flex items-start gap-3">
                      <Truck className="text-brand-cyan mt-0.5 shrink-0 stroke-[2.2]" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-800 md:text-sm">
                          Відправка сьогодні
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          При замовленні до 16:00
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        className="text-brand-cyan mt-0.5 shrink-0 stroke-[2.2]"
                        size={18}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-800 md:text-sm">
                          {product.warranty === 0
                            ? 'Без гарантії (витратний матеріал)'
                            : `Гарантія ${product.warranty ?? 24} міс.`}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Офіційний сервісний центр
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <RotateCcw
                        className="text-brand-cyan mt-0.5 shrink-0 stroke-[2.2]"
                        size={18}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-800 md:text-sm">
                          Повернення 14 днів
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Безпроблемний обмін згідно закону
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Receipt className="text-brand-cyan mt-0.5 shrink-0 stroke-[2.2]" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-800 md:text-sm">
                          Безготівковий розрахунок
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          З ПДВ для юридичних осіб
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation trigger */}
                  <button
                    onClick={() => setIsConsultModalOpen(true)}
                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-sans text-sm font-semibold text-neutral-700 transition-all hover:border-neutral-500"
                  >
                    Отримати консультацію
                  </button>
                </div>
              </div>
            </section>

            {/* Section 2: Detailed Specifications */}
            <section id="specifications" className="scroll-mt-24">
              <h2 className="font-display mb-6 border-b border-neutral-200 pb-2 text-xl font-bold text-neutral-900 md:text-2xl">
                Детальні технічні характеристики
              </h2>

              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Table Left */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:col-span-7">
                  <div className="flex flex-col divide-y divide-neutral-100">
                    {product.characteristics?.length > 0 ? (
                      product.characteristics.map((char, index) => (
                        <div
                          key={`${char.name}-${index}`}
                          className={`flex items-start justify-between gap-4 px-4 py-2 text-sm md:px-5 md:py-2.5 ${
                            index % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'
                          }`}
                        >
                          <span className="max-w-[40%] shrink-0 pr-4 font-sans font-medium text-neutral-500">
                            {char.name}
                          </span>
                          {Array.isArray(char.value) ? (
                            <ul className="flex flex-col items-start gap-1.5 text-left">
                              {char.value.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 font-sans font-semibold text-neutral-900"
                                >
                                  <span className="bg-primary-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : typeof char.value === 'string' &&
                            (char.value.includes('\n') || char.value.includes(';')) ? (
                            <ul className="flex flex-col items-start gap-1.5 text-left">
                              {char.value
                                .split(/[;\n]/)
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 font-sans font-semibold text-neutral-900"
                                  >
                                    <span className="bg-primary-500 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <span className="text-right font-sans font-semibold text-neutral-900">
                              {char.value === '-' ? '+' : char.value}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-neutral-400">
                        Характеристики відсутні
                      </div>
                    )}
                  </div>
                </div>

                {/* Configuration Alert Banner Right */}
                {shouldShowBatteryWarning(product) && (
                  <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/50 bg-amber-50/60 p-6 shadow-sm lg:col-span-5">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 rounded-full border border-amber-200 bg-amber-100 p-2 text-amber-600">
                        <Info size={20} className="stroke-[2.5]" />
                      </div>
                      <h3 className="font-display text-base leading-tight font-bold text-neutral-900">
                        Комплектація (Без АКБ та ЗП)
                      </h3>
                    </div>

                    <p className="font-sans text-xs leading-relaxed text-neutral-600 md:text-sm">
                      Увага! Дана модель інструменту постачається{' '}
                      <strong>без акумуляторної батареї та зарядного пристрою</strong>. Ви можете
                      використовувати сумісні АКБ INGCO серії <strong>P20S</strong>, які є у вашому
                      арсеналі, або придбати їх окремо.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Product Description */}
            <section id="description" className="scroll-mt-24">
              <h2 className="font-display mb-6 border-b border-neutral-200 pb-2 text-xl font-bold text-neutral-900 md:text-2xl">
                Опис
              </h2>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                {product.description ? (
                  <div
                    className="font-sans text-sm leading-relaxed whitespace-pre-line text-neutral-700 md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: product.description.includes('<p>')
                        ? product.description
                        : product.description.replace(/\r\n|\n/g, '<br />'),
                    }}
                  />
                ) : (
                  <p className="text-center text-sm font-semibold text-neutral-400">
                    Опис для даного товару відсутній
                  </p>
                )}
              </div>
            </section>

            {/* Section 4: Reviews Section */}
            <ProductReviewsSection product={product} />

            {/* Schema.org JSON-LD for Google SEO Rich Snippets */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateProductJsonLd(product)),
              }}
            />

            {/* Section 5: Cross-sell Recommendations */}
            <section id="cross-sell" className="scroll-mt-24 pb-12">
              <h2 className="font-display mb-6 border-b border-neutral-200 pb-2 text-xl font-bold text-neutral-900 md:text-2xl">
                Купують разом
              </h2>

              {relatedProducts.length === 0 ? (
                /* 4 skeletons horizontal block */
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Image placeholder */}
                        <div className="flex aspect-square w-full animate-pulse items-center justify-center rounded-xl bg-neutral-100">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200/60 border-t-neutral-400"></div>
                        </div>

                        {/* Title block */}
                        <div className="flex flex-col gap-1.5 py-1">
                          <div className="h-3.5 w-11/12 animate-pulse rounded-md bg-neutral-200"></div>
                          <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-neutral-200"></div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-3">
                        {/* Price block */}
                        <div className="h-4 w-1/2 animate-pulse rounded-md bg-neutral-200"></div>

                        {/* Button CTA */}
                        <div className="h-9 w-full animate-pulse rounded-lg bg-neutral-200/80"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-4">
                  {relatedProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      listType={isB2b ? 'partner' : 'retail'}
                      favoritesIdList={favoritesIdList}
                      handleDirectToProduct={(id, slug) => router.push(`/${slug}`)}
                    />
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Consultation Request Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        closeModal={() => setIsConsultModalOpen(false)}
        productName={product.name}
        productArticle={product.article}
      />

      {/* Video Modal Overlay */}
      <Modal
        isOpen={isVideoModalOpen}
        onRequestClose={() => setIsVideoModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(15, 15, 14, 0.85)',
            zIndex: 99999,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '800px',
            aspectRatio: '16/9',
            padding: '0',
            backgroundColor: '#000',
            border: 'none',
            borderRadius: '16px',
            overflow: 'hidden',
          },
        }}
        ariaHideApp={false}
      >
        <button
          onClick={() => setIsVideoModalOpen(false)}
          className="absolute top-3 right-3 z-50 cursor-pointer rounded-full bg-black/40 p-2 text-white/70 shadow transition-colors hover:bg-black/60 hover:text-white"
          aria-label="Закрити відео"
        >
          <X size={18} />
        </button>
        <iframe
          width="100%"
          height="100%"
          src={getYoutubeEmbedUrl(product.videoUrl || '')}
          title={product.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        ></iframe>
      </Modal>
    </>
  );
}

// Custom Close icon for react-modal close trigger
const X = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
