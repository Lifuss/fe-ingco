'use client';

import { Product } from '@/lib/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  addProductToCartThunk,
  addFavoriteProductThunk,
  deleteFavoriteProductThunk,
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
  handleDirectToProduct: _handleDirectToProduct,
  USDCurrency,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.persistedAuthReducer);
  const usdRate =
    useAppSelector((state) => state.persistedMainReducer.currencyRates.USD) || USDCurrency || 40;

  const isAuth = authState.isAuthenticated;
  const user = authState.user;
  const isB2BUser =
    authState.isB2b ||
    (user &&
      ((user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2B === true ||
        (user as unknown as { isB2b?: boolean; isB2B?: boolean }).isB2b === true));

  const [quantity, setQuantity] = useState(1);
  const [isOutOfStockOpen, setIsOutOfStockOpen] = useState(false);

  if (!product || !product.id) {
    return (
      <div className="relative flex justify-center rounded-2xl border-2 border-transparent bg-white p-4 shadow-md">
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
  const isNew = createdAt ? NOW - new Date(createdAt).getTime() < 60 * 24 * 60 * 60 * 1000 : false;

  // Calculate discount percent
  const discountPercent =
    priceRetailRecommendation > 0 && rrcSale
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
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
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
        }),
      );
      toast.success(`${quantity} шт. - ${name} додано в кошик`);
    }
  };

  const isFavorite = favoritesIdList.includes(id);

  return (
    <>
      <li
        className={clsx(
          'group relative mx-auto w-full max-w-[340px] font-sans',
          isB2BUser ? 'min-h-[430px]' : 'min-h-[380px]',
        )}
      >
        {/* Hover card container expanding downwards */}
        <div
          className={clsx(
            'hover:border-primary-500 absolute top-0 left-0 flex h-full w-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 ease-in-out hover:z-30 hover:h-auto hover:shadow-2xl',
            isB2BUser ? 'min-h-[430px]' : 'min-h-[380px]',
          )}
        >
          {/* Absolute link overlay for SEO and clickability */}
          <Link
            href={`/${slug}`}
            className="absolute inset-0 z-0 rounded-2xl"
            aria-label={name}
          />

          <div
            className="relative z-10 flex grow flex-col pointer-events-none"
          >
            {/* Image container */}
            <div className="relative mb-2 flex h-[180px] w-full shrink-0 items-center justify-center bg-white">
              {/* Top Left Badges */}
              <div className="pointer-events-none absolute top-0 left-0 z-10 flex flex-col gap-1">
                {!!(rrcSale && discountPercent > 0) && (
                  <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                    АКЦІЯ -{discountPercent}%
                  </span>
                )}
                {!!isNew && (
                  <span className="w-fit rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                    НОВИНКА
                  </span>
                )}
              </div>

              {/* Top Right Badges */}
              {countInStock <= 0 && (
                <div className="pointer-events-none absolute top-0 right-0 z-10">
                  <span className="rounded-md bg-gray-400 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow-sm">
                    НЕ В НАЯВНОСТІ
                  </span>
                </div>
              )}

              <Image
                src={image ? NEXT_PUBLIC_API + image : '/placeholder.webp'}
                alt={name}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                fill={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>

            {/* SKU / Article */}
            <div className="flex shrink-0 items-center justify-between">
              <span className="text-gray-450 font-mono text-[11px] tracking-wider">
                АРТИКУЛ: {article}
              </span>

              {/* Favorite Button */}
              <button
                onClick={handleFavClick}
                aria-label={`Додати ${name} до обраних`}
                className={clsx(
                  'relative z-20 cursor-pointer rounded-full p-1 transition-all hover:scale-110 pointer-events-auto',
                  isFavorite ? 'text-primary-500' : 'hover:text-primary-500 text-gray-400',
                )}
              >
                <Heart
                  size={18}
                  className={clsx(
                    'transition-colors',
                    isFavorite ? 'fill-primary-500 stroke-primary-500' : 'fill-none stroke-current',
                  )}
                />
              </button>
            </div>

            {/* Product Title */}
            <h3 className="line-clamp-2 h-[40px] shrink-0 text-sm leading-snug font-semibold text-gray-900">
              {name}
            </h3>

            {/* Technical characteristics: smooth transition fade in on hover */}
            {characteristics.length > 0 && (
              <div className="hidden max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:block group-hover:max-h-[180px] group-hover:opacity-100">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <table className="w-full border-collapse text-[11px]">
                    <tbody>
                      {characteristics
                        .filter(
                          (c) =>
                            c.value !== '-' &&
                            c.name.toLowerCase() !== 'артикул' &&
                            c.name.toLowerCase() !== 'артикль' &&
                            c.name.toLowerCase() !== 'sku' &&
                            c.name.toLowerCase() !== 'article',
                        )
                        .slice(0, 3)
                        .map((char, index) => (
                          <tr key={index} className="border-gray-150 border-b last:border-b-0">
                            <td className="py-0.5 font-medium text-gray-500">{char.name}</td>
                            <td className="py-0.5 text-right font-bold text-gray-900">
                              {char.value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Cart controls - sticky at bottom */}
          <div className="relative z-20 mt-auto shrink-0 border-t border-gray-100 pointer-events-auto">
            {countInStock > 0 ? (
              <div className="flex flex-col gap-2">
                {/* Price block */}
                <div>
                  {isB2BUser ? (
                    // B2B Pricing Structure
                    <div className="flex flex-col gap-0.5">
                      <span className="flex flex-col gap-0.5 text-[10px] font-bold tracking-wide text-gray-400 uppercase">
                        <span>
                          РРЦ: {priceRetailRecommendation.toLocaleString('uk-UA')}.00 ₴
                          {priceRetailRecommendation > wholesalePriceUah && (
                            <span className="ml-1.5 font-bold text-teal-600 normal-case">
                              (Маржа:{' '}
                              {Math.ceil(
                                ((priceRetailRecommendation - wholesalePriceUah) /
                                  priceRetailRecommendation) *
                                  100,
                              )}
                              % / +{priceRetailRecommendation - wholesalePriceUah} ₴)
                            </span>
                          )}
                        </span>
                        {!!(rrcSale && rrcSale > wholesalePriceUah) && (
                          <span className="font-bold text-red-500">
                            РРЦ Акція: {rrcSale.toLocaleString('uk-UA')}.00 ₴
                            <span className="ml-1.5 font-bold text-teal-600 normal-case">
                              (Маржа: {Math.ceil(((rrcSale - wholesalePriceUah) / rrcSale) * 100)}%
                              / +{rrcSale - wholesalePriceUah} ₴)
                            </span>
                          </span>
                        )}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-gray-900">
                          {wholesalePriceUah.toLocaleString('uk-UA')}.00 ₴
                        </span>
                      </div>
                      <span className="text-xs font-bold tracking-wide text-gray-400">
                        ${price.toFixed(2)} / од.
                      </span>
                    </div>
                  ) : (
                    // B2C / Retail Pricing Structure
                    <div className="flex items-baseline gap-2">
                      {rrcSale ? (
                        <>
                          <span className="text-primary-500 text-2xl font-extrabold">
                            {rrcSale.toLocaleString('uk-UA')}.00 ₴
                          </span>
                          <span className="text-xs font-semibold text-gray-400 line-through">
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
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-1">
                    <button
                      onClick={handleDecrease}
                      className="hover:text-primary-500 cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
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
                      className="w-10 [appearance:textfield] border-none bg-transparent text-center text-xs font-bold text-gray-900 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleIncrease}
                      className="hover:text-primary-500 cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Add To Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="bg-primary-500 hover:bg-primary-600 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                  >
                    <ShoppingCart size={14} className="fill-current" />В кошик
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
                className="hover:border-primary-500 hover:text-primary-500 w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-center text-xs font-bold text-gray-700 transition-all"
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
