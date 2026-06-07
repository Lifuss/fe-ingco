'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Heart, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '@/lib/types';
import { useAppDispatch, useAppSelector, useSliderMouseWheel } from '@/lib/hooks';
import { addProductToRetailCartThunk, addFavoriteProductThunk, deleteFavoriteProductThunk } from '@/lib/appState/user/operation';
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
  
  const sliderRef = useRef<Slider | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);

  // Dynamic filter lists
  const popularOffers = products
    .filter((p) => p.rrcSale && p.rrcSale > 0 || p.countInStock > 50)
    .slice(0, 10);

  const p20sOffers = products
    .filter((p) => {
      const catId = p.category?._id || '';
      const name = p.name.toLowerCase();
      return (
        catId === CATEGORY_IDS.P20S_LINE ||
        catId === CATEGORY_IDS.BATTERY_TOOL ||
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
  const favorites: Product[] = [...(authState.user?.favorites || [])];
  const favoritesIdList = favorites.map((p) => typeof p === 'string' ? p : p._id);



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

  const sliderSettings = getSliderSettings(activeProducts.length, { 
    autoplay: true, 
    autoplaySpeed: 4000, 
    speed: 600, 
    infinite: true 
  });

  return (
    <section className="w-full px-5 md:px-[60px] pb-16 flex flex-col gap-6">
      {/* Title & Tabs Block */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-[#E5E3DD] pb-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
            ГАРЯЧІ ПРОПОЗИЦІЇ
          </h2>
          <p className="font-sans text-neutral-500 text-sm">
            Найкращі рішення для ваших проектів
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 select-none">
          <button
            onClick={() => setActiveTab('popular')}
            className={`font-display font-medium text-xs md:text-sm px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
              activeTab === 'popular'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'bg-white text-neutral-600 border border-[#E5E3DD] hover:bg-neutral-50'
            }`}
          >
            Популярні товари
          </button>
          <button
            onClick={() => setActiveTab('p20s')}
            className={`font-display font-medium text-xs md:text-sm px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
              activeTab === 'p20s'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'bg-white text-neutral-600 border border-[#E5E3DD] hover:bg-neutral-50'
            }`}
          >
            Акумулятори P20S
          </button>
          <button
            onClick={() => setActiveTab('sets')}
            className={`font-display font-medium text-xs md:text-sm px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
              activeTab === 'sets'
                ? 'bg-primary-500 text-white shadow-md shadow-orange-500/10'
                : 'bg-white text-neutral-600 border border-[#E5E3DD] hover:bg-neutral-50'
            }`}
          >
            Професійні комплекти
          </button>
        </div>
      </div>

      {/* Slider Carousel Wrapper */}
      <div ref={sliderContainerRef} className="relative px-4 cursor-grab select-none active:cursor-grabbing">
        {activeProducts.length > 0 ? (
          <Slider ref={sliderRef} {...sliderSettings}>
            {activeProducts.map((product) => {
              const apiBaseUrl = 'https://api-ingco-service.win';
              const imageUrl = product.image
                ? (product.image.startsWith('http')
                  ? product.image
                  : `${apiBaseUrl}${product.image}`)
                : '/placeholder.webp';

              let isSale = product.rrcSale && product.rrcSale > 0;
              let price = isSale ? product.rrcSale : product.priceRetailRecommendation;
              let originalPrice = isSale ? product.priceRetailRecommendation : null;

              if (!isSale && activeTab === 'popular' && product.priceRetailRecommendation > 100) {
                isSale = true;
                originalPrice = product.priceRetailRecommendation;
                price = Math.round(product.priceRetailRecommendation * 0.85); // 15% off
              }

              const isFav = favoritesIdList.includes(product._id);
              const isStandart = product.article.toUpperCase().startsWith('CDLI') && !product.article.toUpperCase().startsWith('CIDLI');

              return (
                <div key={product._id} className="px-2 py-3 h-full">
                  <div className="group relative flex flex-col justify-between h-full bg-white border border-neutral-100 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-amber-500/20 transition-all duration-300 overflow-hidden">
                    {/* Top action/tag ribbon */}
                    <div className="flex justify-between items-center z-10">
                      <div className="flex gap-1.5 items-center">
                        <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded uppercase select-none ${
                          isStandart ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isStandart ? 'STANDART' : 'INDUSTRIAL'}
                        </span>
                        {isSale && (
                          <span className="flex items-center gap-0.5 bg-red-50 text-red-600 font-sans text-[10px] font-bold px-1.5 py-0.5 rounded select-none border border-red-200">
                            <Percent size={10} />
                            Акція
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleFavoriteClick(product)}
                        className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer ${isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-600'}`}
                        aria-label="Додати в обране"
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="relative w-full h-[160px] my-2 overflow-hidden rounded flex items-center justify-center">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain w-auto max-h-[150px] transition-transform duration-300 group-hover:scale-105"
                      />
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
                          {originalPrice && (
                            <span className="font-sans text-xs text-neutral-400 line-through">
                              {originalPrice} ₴
                            </span>
                          )}
                          <span className="font-display font-bold text-lg text-neutral-900">
                            {price} ₴
                          </span>
                        </div>

                        <button
                          onClick={() => handleCartClick(product)}
                          className="p-2.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-colors cursor-pointer shadow-md shadow-orange-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          aria-label="Додати в кошик"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="w-full text-center text-neutral-400 py-10">
            Завантаження акційних пропозицій...
          </div>
        )}
      </div>
    </section>
  );
}
