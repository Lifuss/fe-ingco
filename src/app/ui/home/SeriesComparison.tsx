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
  addProductToRetailCartThunk, 
  addProductToCartThunk,
  addFavoriteProductThunk, 
  deleteFavoriteProductThunk 
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
  const isB2BUser = authState.isB2b || (user && ((user as any).isB2B === true || (user as any).isB2b === true));
  const favorites: Product[] = [...(authState.user?.favorites || [])];
  const favoritesIdList = favorites.map((p) => typeof p === 'string' ? p : p._id);



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
      if (favoritesIdList.includes(product._id)) {
        dispatch(deleteFavoriteProductThunk(product._id));
        toast.info(`${product.name} видалено з обраного`);
      } else {
        dispatch(addFavoriteProductThunk(product._id));
        toast.success(`${product.name} додано в обране`);
      }
    } else {
      toast.error('Для додавання в обране потрібно увійти в профіль');
    }
  };

  const handleCartClick = (product: Product) => {
    if (isAuth) {
      if (isB2BUser) {
        dispatch(
          addProductToCartThunk({
            productId: product._id,
            quantity: 1,
          }),
        )
          .unwrap()
          .then(() => {
            toast.success(`${product.name} додано в кошик`);
          });
      } else {
        dispatch(
          addProductToRetailCartThunk({
            productId: product._id,
            quantity: 1,
          }),
        )
          .unwrap()
          .then(() => {
            toast.success(`${product.name} додано в кошик`);
          });
      }
    } else {
      const { price: _price, priceBulk: _priceBulk, ...restProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: restProduct,
          quantity: 1,
          _id: product._id,
        }),
      );
      toast.success(`${product.name} додано в кошик`);
    }
  };

  useSliderMouseWheel(standartSliderRef, standartContainerRef, standartProducts.length);
  useSliderMouseWheel(industrialSliderRef, industrialContainerRef, industrialProducts.length);

  return (
    <section className="w-full px-5 md:px-[60px] pb-16 flex flex-col gap-10">
      {/* Title Block */}
      <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
        <h2 className="font-display font-bold text-2xl md:text-4xl text-neutral-900 leading-tight">
          Професійне рішення чи надійність для дому?
        </h2>
        <p className="font-sans text-neutral-500 text-sm md:text-base leading-relaxed">
          Оберіть інструмент, який відповідає вашим завданням. Від інтенсивного промислового використання до надійного помічника вдома.
        </p>
      </div>

      {/* Series Columns Wrapper */}
      <div className="flex flex-col gap-14">
        {/* STANDART Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-5 justify-between bg-white border border-[#E5E3DD] rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-500/20">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-neutral-400 select-none">
                  STANDART
                </span>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
                  Для дому та майстерні
                </h3>
              </div>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                Оптимальне співвідношення ціни та якості для періодичних робіт, ремонту вдома чи невеликих майстерень.
              </p>
              <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Легка та ергономічна конструкція</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Доступна ціна</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Гарантія 1 рік</span>
                </li>
              </ul>
            </div>
            <Link
              href="/?catalog=true&query=standart"
              className="font-display font-semibold text-neutral-900 hover:text-primary-500 transition-colors mt-4 inline-flex items-center gap-1 text-sm md:text-base cursor-pointer"
            >
              Дивитись серію Standart ➔
            </Link>
          </div>

          {/* Product Carousel (Right) */}
          <div ref={standartContainerRef} className="lg:col-span-8 relative px-4 cursor-grab select-none active:cursor-grabbing">
            {standartProducts.length > 0 ? (
              <Slider ref={standartSliderRef} {...getSliderSettings(standartProducts.length)}>
                {standartProducts.map((product) => (
                  <div key={product._id} className="px-2 py-3 h-full">
                    <ProductCarouselCard
                      product={product}
                      badge="STANDART"
                      badgeBg="bg-neutral-100 text-neutral-600"
                      isFav={favoritesIdList.includes(product._id)}
                      onFavClick={() => handleFavoriteClick(product)}
                      onCartClick={() => handleCartClick(product)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center text-neutral-400 py-10">
                Завантаження товарів серії Standart...
              </div>
            )}
          </div>
        </div>

        {/* INDUSTRIAL Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-5 justify-between bg-white border border-[#E5E3DD] rounded-2xl p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-500/20">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-amber-600 select-none">
                  INDUSTRIAL
                </span>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
                  Для професіоналів
                </h3>
              </div>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                Інструмент, розроблений для тривалих та екстремальних навантажень. Посилена конструкція, висока зносостійкість та ідеальний результат роботи.
              </p>
              <ul className="flex flex-col gap-3 font-sans text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Тривала безперервна робота</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Захист двигуна та вузлів</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>Гарантія 2 роки</span>
                </li>
              </ul>
            </div>
            <Link
              href="/?catalog=true&query=industrial"
              className="font-display font-semibold text-neutral-900 hover:text-primary-500 transition-colors mt-4 inline-flex items-center gap-1 text-sm md:text-base cursor-pointer"
            >
              Дивитись серію Industrial ➔
            </Link>
          </div>

          {/* Product Carousel (Right) */}
          <div ref={industrialContainerRef} className="lg:col-span-8 relative px-4 cursor-grab select-none active:cursor-grabbing">
            {industrialProducts.length > 0 ? (
              <Slider ref={industrialSliderRef} {...getSliderSettings(industrialProducts.length)}>
                {industrialProducts.map((product) => (
                  <div key={product._id} className="px-2 py-3 h-full">
                    <ProductCarouselCard
                      product={product}
                      badge="INDUSTRIAL"
                      badgeBg="bg-amber-100 text-amber-800"
                      isFav={favoritesIdList.includes(product._id)}
                      onFavClick={() => handleFavoriteClick(product)}
                      onCartClick={() => handleCartClick(product)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center text-neutral-400 py-10">
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

function ProductCarouselCard({ product, badge, badgeBg, isFav, onFavClick, onCartClick }: ProductCardProps) {
  const router = useRouter();
  const apiBaseUrl = 'https://api-ingco-service.win';
  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${apiBaseUrl}${product.image}`)
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
      className="group relative flex flex-col justify-between h-full bg-white border border-[#E5E3DD] rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 hover:scale-[1.01] cursor-pointer overflow-hidden"
    >
      {/* Top action/tag ribbon */}
      <div className="flex justify-between items-center z-10">
        <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded uppercase select-none ${badgeBg}`}>
          {badge}
        </span>
        <button
          onClick={onFavClick}
          className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer ${isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-600'}`}
          aria-label="Додати в обране"
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-[150px] my-3 overflow-hidden rounded flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain w-auto max-h-[140px] transition-transform duration-300 group-hover:scale-105"
        />
        {/* Sale Tag */}
        {isSale && (
          <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded select-none">
            Акція
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        {/* Availability */}
        <div className="flex items-center gap-1.5 font-sans text-xs">
          <span className={`w-2 h-2 rounded-full ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}>
            {product.countInStock > 0 ? 'В наявності' : 'Немає в наявності'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/${product.slug}`} className="font-display font-semibold text-neutral-800 text-sm line-clamp-2 min-h-[40px] hover:text-primary-500 transition-colors">
          {product.name}
        </Link>

        {/* Pricing & Add to Cart */}
        <div className="flex justify-between items-center mt-2 border-t border-neutral-50 pt-3">
          <div className="flex flex-col">
            {!!originalPrice && (
              <span className="font-sans text-xs text-neutral-400 line-through">
                {originalPrice} ₴
              </span>
            )}
            <span className="font-display font-bold text-lg text-neutral-900">
              {price} ₴
            </span>
          </div>

          <button
            onClick={onCartClick}
            className="p-2.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-md shadow-orange-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Додати в кошик"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
