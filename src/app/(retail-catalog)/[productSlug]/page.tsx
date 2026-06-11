'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import JsBarcode from 'jsbarcode';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import {
  SearchX,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Receipt,
  Play,
  Info,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Zap,
  RotateCw,
  Plus,
  Minus
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getProductBySlugThunk, fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import {
  addProductToCartThunk,
  addFavoriteProductThunk,
  deleteFavoriteProductThunk
} from '@/lib/appState/user/operation';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import Breadcrumbs from '~/ui/Breadcrumbs';
import CatalogSidebar from '~/ui/catalog/CatalogSidebar';
import ConsultationModal from '~/ui/modals/ConsultationModal';
import ProductSkeleton from '~/ui/skeletons/ProductSkeleton';
import ProductCard from '@/app/ui/product/ProductCard';

type PageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { productSlug } = use(params);

  // Redux state
  const { isAuthenticated, isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const products = useAppSelector((state) => state.persistedMainReducer.products || []);
  const productLoading = useAppSelector((state) => state.persistedMainReducer.productLoading);
  const categories = useAppSelector((state) => state.persistedMainReducer.categories);
  const isAuth = useAppSelector((state) => state.persistedAuthReducer.isAuthenticated);
  const favoritesState = useAppSelector((state) => state.persistedAuthReducer.user?.favorites || []);
  const favoritesIdList = favoritesState.map((p: unknown) => typeof p === 'object' && p !== null ? (p as { id: number }).id : Number(p));
  const usdRate = useAppSelector((state) => state.persistedMainReducer.currencyRates.USD) || 40;
  const wholesalePriceUah = product ? Math.ceil((product.priceBulk || product.price || 0) * usdRate) : 0;

  // UI state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [activeSection, setActiveSection] = useState('about-product');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

  // Fetch product data on load
  useEffect(() => {
    dispatch(getProductBySlugThunk(productSlug));
  }, [dispatch, productSlug]);

  // Fetch related products for cross-sell recommendations
  useEffect(() => {
    if (product?.category?.id) {
      dispatch(
        fetchMainTableDataThunk({
          page: 1,
          limit: 5,
          isRetail: true,
          category: String(product.category.id),
          query: '',
          sortValue: 'default',
        })
      );
    }
  }, [dispatch, product?.category?.id]);
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

  if (productLoading) {
    return (
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14 bg-white">
        <CatalogSidebar />
        <div className="min-h-[550px] w-full">
          <ProductSkeleton />
        </div>
      </main>
    );
  }
  if (!product || !product.id) {
    return (
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14 bg-white">
        <CatalogSidebar />
        <div className="min-h-[550px] w-full">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-5">
            <SearchX size={52} className="text-neutral-400" />
            <h2 className="text-2xl font-display font-semibold text-neutral-800">Продукт не знайдено</h2>
            <button
              className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-md transition-all cursor-pointer"
              onClick={() => router.push('/')}
            >
              В каталог
            </button>
          </div>
        </div>
      </main>
    );
  }

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
        })
      ).unwrap();
    } else {
      const { price: _price, priceBulk: _priceBulk, ...normalizeProduct } = product;
      await Promise.resolve(
        dispatch(
          addProductToLocalStorageCart({
            productId: normalizeProduct,
            quantity: qty,
            id: product.id,
          })
        )
      );
    }
    toast.success(`Товар додано до кошика (${qty} шт.)`);
  };

  // Qty helpers
  const incrementQty = () => setQuantity((prev) => (typeof prev === 'number' ? prev + 1 : 1));
  const decrementQty = () => setQuantity((prev) => (typeof prev === 'number' && prev > 1 ? prev - 1 : 1));
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
  const electroCategory = categories?.find(c => c.name?.toLowerCase().includes('електроінструмент'));
  if (electroCategory) {
    breadcrumbsItems.push({ label: electroCategory.name, href: `/?category=${electroCategory.id}` });
  } else {
    breadcrumbsItems.push({ label: 'Електроінструмент', href: '/' });
  }
  if (product.category?.name && !product.category.name.toLowerCase().includes('електроінструмент')) {
    breadcrumbsItems.push({ label: product.category.name, href: `/?category=${product.category.id}` });
  }
  breadcrumbsItems.push({ label: product.article || product.name });
  const primaryImageUrl = product.image ? process.env.NEXT_PUBLIC_API + product.image : '/placeholder.webp';
  // Mock alternative angles
  const galleryImages = [
    { type: 'image', url: primaryImageUrl, className: 'object-contain' },
    { type: 'image', url: primaryImageUrl, className: 'object-contain scale-125' }, // Zoom view
    { type: 'image', url: primaryImageUrl, className: 'object-contain scale-95 rotate-3' }, // Angle view
    { type: 'video', url: '/icons/video-play-mock', isPlay: true }
  ];

  // Specific badges parser
  const getSpecValue = (names: string[], defaultValue: string) => {
    const found = product.characteristics?.find((char) =>
      names.some((name) => char.name?.toLowerCase().includes(name))
    );
    return found ? found.value : defaultValue;
  };
  const voltage = getSpecValue(['напруга', 'вольт', 'акб'], '20V');
  const speed = getSpecValue(['оберт', 'обор', 'холодний', 'швидкість'], '1350 об/хв');
  const impactForce = getSpecValue(['сила удару', 'енергія удару', 'джоул'], '2.0 Дж');

  // Bold brand keywords parser
  const parseDescription = (text: string) => {
    if (!text) return '';
    const parsed = text.split('\n').map((paragraph, i) => {
      // Bold "INGCO" and article codes
      let html = paragraph;
      html = html.replace(/(ingco)/gi, '<strong>INGCO</strong>');
      if (product.article) {
        const regex = new RegExp(`(${product.article})`, 'gi');
        html = html.replace(regex, '<strong>$1</strong>');
      }
      return (
        <p key={i} className="mb-4 text-base text-neutral-700 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
    return parsed;
  };

  // Battery link resolver
  const batteryCategory = categories?.find(c => c.name?.toLowerCase().includes('акумулятор') || c.name?.toLowerCase().includes('зарядн'));
  const batteryLink = batteryCategory ? `/?category=${batteryCategory.id}` : '/?query=акумулятор';

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
        behavior: 'smooth'
      });
    }
  };

  // Filter out the current product from recommendations
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <main className="flex flex-col gap-4 px-4 md:px-[60px] pt-8 bg-neutral-50 min-h-[600px]">
        {/* Dynamic breadcrumbs */}
        <div className="max-w-[1440px] w-full mx-auto">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* ScrollSpy Tabs navigation */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 -mx-4 md:-mx-[60px] px-4 md:px-[60px] shadow-sm">
          <div className="flex gap-6 md:gap-10 overflow-x-auto py-3.5 scrollbar-none max-w-[1440px] mx-auto">
            {[
              { id: 'about-product', label: 'Про товар' },
              { id: 'specifications', label: 'Характеристики' },
              { id: 'description', label: 'Опис' },
              { id: 'reviews', label: 'Відгуки та питання' },
              { id: 'cross-sell', label: 'Купують разом' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`font-display text-sm md:text-base font-semibold cursor-pointer pb-1 transition-all relative border-b-2 whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'text-primary border-primary font-bold'
                    : 'text-neutral-500 border-transparent hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row 2xl:gap-14 max-w-[1440px] w-full mx-auto py-6">
          <CatalogSidebar />
          
          <div className="w-full flex flex-col gap-10">
            {/* Section 1: Hero Block (Hero & Buy Box) */}
            <section id="about-product" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
              
              {/* Left Column: Gallery & Micro Features */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Product Name Title on Mobile */}
                {!isTablet && (
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold font-display text-neutral-900 leading-tight mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="bg-neutral-200 text-neutral-700 font-mono text-[11px] px-2 py-0.5 rounded">
                        Артикул: {product.article}
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Media Box */}
                <div className="aspect-square w-full bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-center relative shadow-sm overflow-hidden select-none">
                  
                  {/* Badges absolute top-left */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    <span className="bg-neutral-900 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded shadow-sm tracking-wide uppercase select-none">
                      PRO SERIES
                    </span>
                    <span className="bg-brand-cyan text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded shadow-sm tracking-wide uppercase select-none">
                      P20S SYSTEM
                    </span>
                  </div>

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
                      className="w-full h-full flex flex-col items-center justify-center bg-neutral-100/50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform duration-300">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                      <span className="font-display font-semibold text-neutral-800 text-sm">Дивитися відеоогляд</span>
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
                      className={`aspect-square w-full rounded-xl bg-white border flex items-center justify-center p-2 transition-all cursor-pointer ${
                        item.type !== 'video' && activeImageIndex === idx
                          ? 'border-primary shadow-sm bg-primary-50/20 ring-1 ring-primary'
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
                        <div className="flex flex-col items-center justify-center text-neutral-500 hover:text-primary gap-1">
                          <Play size={24} className="stroke-[2.5]" />
                          <span className="text-[10px] font-bold tracking-wider uppercase">Відео</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Specific layout short badges */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-primary-50/40 border border-primary-100/60 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm">
                    <Zap className="text-primary-500 stroke-[2.5]" size={20} />
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">Напруга</span>
                    <span className="text-sm font-bold text-neutral-900 font-display">{voltage}</span>
                  </div>
                  <div className="bg-primary-50/40 border border-primary-100/60 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm">
                    <RotateCw className="text-primary-500 stroke-[2.5]" size={20} />
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">Обороти</span>
                    <span className="text-sm font-bold text-neutral-900 font-display">{speed}</span>
                  </div>
                  <div className="bg-primary-50/40 border border-primary-100/60 rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm">
                    <Sparkles className="text-primary-500 stroke-[2.5]" size={20} />
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold">Сила удару</span>
                    <span className="text-sm font-bold text-neutral-900 font-display">{impactForce}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Buy Box Card */}
              <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-[128px] bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                  
                  {/* Name Header and Wishlist on Desktop */}
                  {isTablet && (
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1.5">
                        <h1 className="text-xl md:text-2xl font-bold font-display text-neutral-900 leading-tight">
                          {product.name}
                        </h1>
                        <div className="w-fit bg-neutral-100 text-neutral-500 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                          Артикул: {product.article}
                        </div>
                      </div>
                      
                      <button
                        onClick={handleFavoriteClick}
                        className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                          isFavorite
                            ? 'bg-red-50 text-red-500 border-red-200 shadow-sm'
                            : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:text-neutral-700 hover:bg-neutral-100'
                        }`}
                        title={isFavorite ? "Вилучити з обраного" : "Додати в обране"}
                      >
                        <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                      </button>
                    </div>
                  )}

                  {/* Stock Availability */}
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-green-600">
                      В наявності ({product.countInStock > 50 ? '>50 шт.' : `${product.countInStock} шт.`})
                    </span>
                  </div>

                  {/* Price and Counter Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                    <div className="flex flex-col">
                      {isB2b ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-neutral-400 font-semibold uppercase">Ціна партнера</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-display text-neutral-900">
                              {wholesalePriceUah.toLocaleString('uk-UA')} ₴
                            </span>
                          </div>
                          <span className="text-xs font-bold text-neutral-400 tracking-wide">
                            ${(product.priceBulk || product.price || 0).toFixed(2)} / од.
                          </span>
                          <div className="mt-2 flex flex-col gap-1 text-[11px] font-semibold text-neutral-500">
                            <span>
                              РРЦ: {product.priceRetailRecommendation.toLocaleString('uk-UA')} ₴
                              {product.priceRetailRecommendation > wholesalePriceUah && (
                                <span className="text-teal-600 font-bold ml-1.5">
                                  (Маржа: {Math.ceil(((product.priceRetailRecommendation - wholesalePriceUah) / product.priceRetailRecommendation) * 100)}% / +{product.priceRetailRecommendation - wholesalePriceUah} ₴)
                                </span>
                              )}
                            </span>
                            {!!(product.rrcSale && product.rrcSale > wholesalePriceUah) && (
                              <span className="text-red-500 font-bold">
                                РРЦ Акція: {product.rrcSale.toLocaleString('uk-UA')} ₴
                                <span className="text-teal-600 font-bold ml-1.5">
                                  (Маржа: {Math.ceil(((product.rrcSale - wholesalePriceUah) / product.rrcSale) * 100)}% / +{product.rrcSale - wholesalePriceUah} ₴)
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-neutral-400 font-semibold uppercase">Ціна</span>
                          <div className="flex items-baseline gap-2">
                            {product.rrcSale ? (
                              <>
                                <span className="text-2xl font-bold font-display text-primary">
                                  {product.rrcSale.toLocaleString('uk-UA')} ₴
                                </span>
                                <span className="text-sm text-neutral-400 line-through">
                                  {product.priceRetailRecommendation.toLocaleString('uk-UA')} ₴
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold font-display text-neutral-900">
                                {product.priceRetailRecommendation.toLocaleString('uk-UA')} ₴
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quantity counter */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-neutral-400 font-semibold uppercase mr-1">Кількість</span>
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-inner h-10 w-[120px]">
                        <button
                          onClick={decrementQty}
                          className="w-10 h-full flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-500 cursor-pointer"
                          type="button"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          onChange={handleQtyInputChange}
                          onBlur={handleQtyBlur}
                          className="w-10 h-full text-center bg-transparent outline-none font-sans font-semibold text-neutral-900 border-none p-0 text-sm focus:ring-0"
                        />
                        <button
                          onClick={incrementQty}
                          className="w-10 h-full flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-500 cursor-pointer"
                          type="button"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-display font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all cursor-pointer text-base select-none"
                  >
                    <ShoppingCart size={20} fill="currentColor" />
                    <span>Додати до кошика</span>
                  </button>

                  {/* Wishlist toggle for mobile */}
                  {!isTablet && (
                    <button
                      onClick={handleFavoriteClick}
                      className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer font-sans text-sm font-semibold ${
                        isFavorite
                          ? 'bg-red-50 text-red-500 border-red-200'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
                      <span>{isFavorite ? 'В обраному' : 'Додати в обране'}</span>
                    </button>
                  )}

                  {/* Trust triggers */}
                  <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
                    <div className="flex items-start gap-3">
                      <Truck className="text-brand-cyan stroke-[2.2] shrink-0 mt-0.5" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-neutral-800">Відправка сьогодні</span>
                        <span className="text-[11px] text-neutral-500">При замовленні до 16:00</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-brand-cyan stroke-[2.2] shrink-0 mt-0.5" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-neutral-800">Гарантія {product.warranty || 24} міс.</span>
                        <span className="text-[11px] text-neutral-500">Офіційний сервісний центр</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <RotateCcw className="text-brand-cyan stroke-[2.2] shrink-0 mt-0.5" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-neutral-800">Повернення 14 днів</span>
                        <span className="text-[11px] text-neutral-500">Безпроблемний обмін згідно закону</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Receipt className="text-brand-cyan stroke-[2.2] shrink-0 mt-0.5" size={18} />
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-bold text-neutral-800">Безготівковий розрахунок</span>
                        <span className="text-[11px] text-neutral-500">З ПДВ для юридичних осіб</span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation trigger */}
                  <button
                    onClick={() => setIsConsultModalOpen(true)}
                    className="w-full mt-1 border border-neutral-300 hover:border-neutral-500 text-neutral-700 font-sans font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer text-sm bg-white"
                  >
                    Отримати консультацію
                  </button>
                </div>
              </div>

            </section>

            {/* Section 2: Detailed Specifications */}
            <section id="specifications" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-900 mb-6 pb-2 border-b border-neutral-200">
                Детальні технічні характеристики
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Table Left */}
                <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex flex-col divide-y divide-neutral-100">
                    {product.characteristics?.length > 0 ? (
                      product.characteristics.map((char, index) => (
                        <div
                          key={char._id || index}
                          className={`flex justify-between px-5 py-3.5 text-sm md:text-base ${
                            index % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'
                          }`}
                        >
                          <span className="text-neutral-500 font-medium font-sans pr-4">{char.name}</span>
                          <span className="text-neutral-900 font-semibold font-sans text-right">
                            {char.value === '-' ? '+' : char.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-neutral-400">Характеристики відсутні</div>
                    )}
                  </div>
                </div>

                {/* Configuration Alert Banner Right */}
                <div className="lg:col-span-5 bg-amber-50/60 border border-amber-200/50 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 border border-amber-200 rounded-full text-amber-600 shrink-0">
                      <Info size={20} className="stroke-[2.5]" />
                    </div>
                    <h3 className="font-display font-bold text-base text-neutral-900 leading-tight">
                      Комплектація (Без АКБ та ЗП)
                    </h3>
                  </div>
                  
                  <p className="font-sans text-xs md:text-sm text-neutral-600 leading-relaxed">
                    Увага! Дана модель інструменту постачається <strong>без акумуляторної батареї та зарядного пристрою</strong>. 
                    Ви можете використовувати сумісні АКБ INGCO серії <strong>P20S</strong>, які є у вашому арсеналі, або придбати їх окремо.
                  </p>

                  <button
                    onClick={() => router.push(batteryLink)}
                    className="w-fit text-primary font-display font-bold text-xs md:text-sm flex items-center gap-1.5 hover:underline cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <span>Переглянути сумісні акумулятори</span>
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </section>

            {/* Section 3: Description */}
            <section id="description" className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-900 mb-6 pb-2 border-b border-neutral-200">
                Опис
              </h2>
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
                {product.description ? (
                  parseDescription(product.description)
                ) : (
                  <p className="text-neutral-400 text-center py-4">Опис відсутній</p>
                )}
              </div>
            </section>

            {/* Section 4: Reviews Section */}
            <section id="reviews" className="scroll-mt-24">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-neutral-200">
                <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-900">
                  Відгуки та питання
                </h2>
                <button 
                  onClick={() => toast.info('Напишіть нам у підтримку, щоб залишити відгук!')}
                  className="border border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50 text-neutral-700 font-sans font-semibold text-xs md:text-sm py-2 px-3 md:px-4 rounded-lg transition-all cursor-pointer bg-white"
                >
                  Залишити відгук
                </button>
              </div>

              {/* Empty state reviews layout */}
              <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center text-center gap-4 shadow-inner">
                <div className="w-14 h-14 bg-neutral-200/50 rounded-full flex items-center justify-center text-neutral-400 border border-neutral-200 shadow-sm">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base md:text-lg text-neutral-800 mb-1">
                    Поки що немає відгуків про цей товар
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Будьте першим, хто залишить відгук або запитання! Ваша думка допоможе іншим покупцям зробити правильний вибір.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Cross-sell Recommendations */}
            <section id="cross-sell" className="scroll-mt-24 pb-12">
              <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-900 mb-6 pb-2 border-b border-neutral-200">
                Купують разом
              </h2>

              {relatedProducts.length === 0 ? (
                /* 4 skeletons horizontal block */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Image placeholder */}
                        <div className="w-full aspect-square bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-2 border-neutral-200/60 border-t-neutral-400 animate-spin"></div>
                        </div>
                        
                        {/* Title block */}
                        <div className="flex flex-col gap-1.5 py-1">
                          <div className="h-3.5 bg-neutral-200 rounded-md animate-pulse w-11/12"></div>
                          <div className="h-3.5 bg-neutral-200 rounded-md animate-pulse w-3/4"></div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-neutral-100">
                        {/* Price block */}
                        <div className="h-4 bg-neutral-200 rounded-md animate-pulse w-1/2"></div>
                        
                        {/* Button CTA */}
                        <div className="h-9 bg-neutral-200/80 rounded-lg animate-pulse w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 list-none p-0 m-0">
                  {relatedProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      listType="retail"
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
          }
        }}
        ariaHideApp={false}
      >
        <button
          onClick={() => setIsVideoModalOpen(false)}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors cursor-pointer bg-black/40 p-2 rounded-full z-50 hover:bg-black/60 shadow"
          aria-label="Закрити відео"
        >
          <X size={18} />
        </button>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/y918y-PqKLI?autoplay=1"
          title="INGCO Power Tools Presentation"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
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
