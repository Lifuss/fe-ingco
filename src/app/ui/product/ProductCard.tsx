'use client';

import { Product } from '@/lib/types';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  addProductToCartThunk, 
  addFavoriteProductThunk,
  deleteFavoriteProductThunk
} from '@/lib/appState/user/operation';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import { toast } from 'react-toastify';
import OutOfStockModal from '../modals/OutOfStockModal';

interface ProductCardProps {
  product: Product;
  listType: 'partner' | 'retail';
  favoritesIdList: number[];
  handleDirectToProduct: (id: number, slug: string) => void;
  handleCartClick?: (id: number, productName: string) => void; // kept for compatibility
  handleFavoriteClick?: (id: number) => void; // kept for compatibility
  USDCurrency?: number;
}

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API || '';
const NOW = Date.now();

const ProductCard = ({
  product,
  listType: _listType,
  favoritesIdList,
  handleDirectToProduct,
  USDCurrency,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const usdRate = useAppSelector((state) => state.persistedMainReducer.currencyRates.USD) || USDCurrency || 40;

  const isAuth = authState.isAuthenticated;
  const user = authState.user;
  const isB2BUser = authState.isB2b || (user && ((user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2B === true || (user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2b === true));

  const [quantity, setQuantity] = useState(1);
  const [isOutOfStockOpen, setIsOutOfStockOpen] = useState(false);

  if (!product || !product.id) {
    return (
      <div className="relative flex justify-center rounded-2xl border-2 border-transparent p-4 shadow-md bg-white">
        <h3 className="text-sm font-semibold text-gray-500">Сталась помилка завантаження товару</h3>
      </div>
    );
  }

  const {
    countInStock,
    rrcSale,
    id,
    article,
    name,
    image,
    characteristics = [],
    priceRetailRecommendation = 0,
    price = 0,
    priceBulk,
    slug,
    createdAt,
  } = product;
  
  // Check if item is new (within last 60 days)
  const isNew = createdAt ? (NOW - new Date(createdAt).getTime()) < 60 * 24 * 60 * 60 * 1000 : false;

  // Calculate discount percent
  const discountPercent = priceRetailRecommendation > 0 && rrcSale
    ? Math.round(((priceRetailRecommendation - rrcSale) / priceRetailRecommendation) * 100)
    : 0;

  // B2B Wholesale UAH price
  const wholesalePriceUah = Math.ceil((priceBulk || price) * usdRate);

  // Favorite toggle handler
  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuth) {
      toast.error('Для додавання в обране потрібно увійти в профіль');
      return;
    }
    if (favoritesIdList.includes(id)) {
      dispatch(deleteFavoriteProductThunk(id));
    } else {
      dispatch(addFavoriteProductThunk(id));
    }
  };

  // Quantity handlers
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setQuantity(val);
    }
  };

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuth) {
      dispatch(
        addProductToCartThunk({
          productId: id,
          quantity,
          isRetail: !isB2BUser,
        }),
      )
        .unwrap()
        .then(() => toast.success(`${quantity} шт. - ${name} додано в кошик`));
    } else {
      // Guest local cart
      const { price: _price, priceBulk: _priceBulk, ...restProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: restProduct,
          quantity,
          id,
        })
      );
      toast.success(`${quantity} шт. - ${name} додано в кошик`);
    }
  };

  const isFavorite = favoritesIdList.includes(id);

  return (
    <>
      <li className={clsx("relative group w-full max-w-[340px] mx-auto font-sans", isB2BUser ? "min-h-[430px]" : "min-h-[380px]")}>
        
        {/* Hover card container expanding downwards */}
        <div className={clsx("absolute top-0 left-0 w-full bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-primary-500 hover:z-30 flex flex-col justify-between h-full hover:h-auto", isB2BUser ? "min-h-[430px]" : "min-h-[380px]")}>
          
          <div className="grow cursor-pointer flex flex-col" onClick={() => handleDirectToProduct(id, slug)}>
            
            {/* Image container */}
            <div className="relative h-[180px] w-full mb-2 shrink-0 flex items-center justify-center bg-white">
              
              {/* Top Left Badges */}
              <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 pointer-events-none">
                {!!(rrcSale && discountPercent > 0) && (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-md tracking-wider shadow-sm uppercase">
                    АКЦІЯ -{discountPercent}%
                  </span>
                )}
                {!!isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-gray-900 rounded-md tracking-wider shadow-sm uppercase w-fit">
                    НОВИНКА
                  </span>
                )}
              </div>

              {/* Top Right Badges */}
              {countInStock <= 0 && (
                <div className="absolute top-0 right-0 z-10 pointer-events-none">
                  <span className="px-2 py-0.5 text-[9px] font-bold text-white bg-gray-400 rounded-md tracking-wider shadow-sm uppercase">
                    НЕ В НАЯВНОСТІ
                  </span>
                </div>
              )}

              <Image
                src={image ? NEXT_PUBLIC_API + image : '/placeholder.webp'}
                alt={name}
                className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                fill={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            {/* SKU / Article */}
            <div className="flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-gray-450 tracking-wider">
                АРТИКУЛ: {article}
              </span>
              
              {/* Favorite Button */}
              <button
                onClick={handleFavClick}
                aria-label={`Додати ${name} до обраних`}
                className={clsx(
                  'transition-all hover:scale-110 p-1 rounded-full cursor-pointer',
                  isFavorite ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500'
                )}
              >
                <Heart size={18} className={clsx('transition-colors', isFavorite ? 'fill-primary-500 stroke-primary-500' : 'fill-none stroke-current')} />
              </button>
            </div>

            {/* Product Title */}
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 h-[40px] shrink-0">
              {name}
            </h3>

            {/* Technical characteristics: smooth transition fade in on hover */}
            {characteristics.length > 0 && (
              <div className="hidden group-hover:block transition-all duration-300 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-[180px] overflow-hidden">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <table className="w-full text-[11px] border-collapse">
                    <tbody>
                      {characteristics.filter(c => c.value !== '-' && c.name.toLowerCase() !== 'артикул' && c.name.toLowerCase() !== 'артикль' && c.name.toLowerCase() !== 'sku' && c.name.toLowerCase() !== 'article').slice(0, 3).map((char, index) => (
                        <tr key={index} className="border-b border-gray-150 last:border-b-0">
                          <td className="py-0.5 text-gray-500 font-medium">{char.name}</td>
                          <td className="py-0.5 text-gray-900 font-bold text-right">{char.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Cart controls - sticky at bottom */}
          <div className="mt-auto border-t border-gray-100 shrink-0">
            {countInStock > 0 ? (
              <div className="flex flex-col gap-2">
                
                {/* Price block */}
                <div>
                  {isB2BUser ? (
                    // B2B Pricing Structure
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase flex flex-col gap-0.5">
                        <span>
                          РРЦ: {priceRetailRecommendation.toLocaleString('uk-UA')}.00 ₴
                          {priceRetailRecommendation > wholesalePriceUah && (
                            <span className="text-teal-600 font-bold ml-1.5 normal-case">
                              (Маржа: {Math.ceil(((priceRetailRecommendation - wholesalePriceUah) / priceRetailRecommendation) * 100)}% / +{priceRetailRecommendation - wholesalePriceUah} ₴)
                            </span>
                          )}
                        </span>
                        {!!(rrcSale && rrcSale > wholesalePriceUah) && (
                          <span className="text-red-500 font-bold">
                            РРЦ Акція: {rrcSale.toLocaleString('uk-UA')}.00 ₴
                            <span className="text-teal-600 font-bold ml-1.5 normal-case">
                              (Маржа: {Math.ceil(((rrcSale - wholesalePriceUah) / rrcSale) * 100)}% / +{rrcSale - wholesalePriceUah} ₴)
                            </span>
                          </span>
                        )}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-gray-900">
                          {wholesalePriceUah.toLocaleString('uk-UA')}.00 ₴
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400 tracking-wide">
                        ${price.toFixed(2)} / од.
                      </span>
                    </div>
                  ) : (
                    // B2C / Retail Pricing Structure
                    <div className="flex items-baseline gap-2">
                      {rrcSale ? (
                        <>
                          <span className="text-2xl font-extrabold text-primary-500">
                            {rrcSale.toLocaleString('uk-UA')}.00 ₴
                          </span>
                          <span className="text-xs text-gray-400 line-through font-semibold">
                            {priceRetailRecommendation.toLocaleString('uk-UA')}.00 ₴
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-extrabold text-gray-900">
                          {priceRetailRecommendation.toLocaleString('uk-UA')}.00 ₴
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom interactive action panel */}
                <div className="flex items-center gap-2">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-1">
                    <button
                      onClick={handleDecrease}
                      className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQtyChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 text-center bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleIncrease}
                      className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Add To Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart size={14} className="fill-current" />
                    В кошик
                  </button>

                </div>
              </div>
            ) : (
              // Out of Stock details button
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOutOfStockOpen(true);
                }}
                className="w-full py-2 px-4 border border-gray-300 hover:border-primary-500 hover:text-primary-500 text-gray-700 font-bold text-xs rounded-xl transition-all text-center cursor-pointer"
              >
                Детальніше
              </button>
            )}
          </div>
        </div>
      </li>

      {/* Out of Stock Information Dialog Modal */}
      <OutOfStockModal
        isOpen={isOutOfStockOpen}
        closeModal={() => setIsOutOfStockOpen(false)}
        productName={name}
        sku={article}
      />
    </>
  );
};

export default ProductCard;
