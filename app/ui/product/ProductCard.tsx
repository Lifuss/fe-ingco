import { Product } from '@/lib/types';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import { Heart } from 'lucide-react';
import Icon from '../assets/Icon';

interface ProductCardProps {
  product: Product;
  listType: 'partner' | 'retail';
  favoritesIdList: string[];
  handleDirectToProduct: (id: string) => void;
  handleCartClick: (id: string, productName: string) => void;
  handleFavoriteClick: (id: string) => void;
  USDCurrency?: number;
}

const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

const ProductCard = ({
  product,
  listType,
  favoritesIdList,
  handleDirectToProduct,
  handleCartClick,
  handleFavoriteClick,
  USDCurrency,
}: ProductCardProps) => {
  if (!product || !product._id) {
    return (
      <div
        className={clsx(
          'relative flex justify-center rounded-2xl border-2 border-transparent p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:border-[#FACC15] hover:shadow-lg',
        )}
      >
        <h3>Сталась помилка завантаження товару</h3>
      </div>
    );
  }

  const {
    countInStock,
    rrcSale,
    _id,
    article,
    name,
    image,
    characteristics,
    priceRetailRecommendation,
    price,
    description,
  } = product;

  let splitDesc = description.split('\n');
  if (splitDesc.length > 3) {
    splitDesc = splitDesc.slice(0, 3);
  }
  return (
    <li
      className={clsx(
        'relative flex flex-col justify-between rounded-2xl border-2 border-transparent p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:border-[#FACC15] hover:shadow-lg',
        countInStock <= 0 && 'pointer-events-none opacity-40',
      )}
    >
      <div
        className="grow cursor-pointer"
        onClick={() => handleDirectToProduct(_id)}
      >
        <div className="relative h-[150px] w-full">
          {rrcSale && listType === 'retail' ? (
            <div className="absolute -top-2 left-0 z-10 w-[3rem] rounded-md bg-red-500">
              <p className="text-center text-sm text-white">Акція</p>
            </div>
          ) : null}
          <Image
            src={NEXT_PUBLIC_API + image}
            alt={name}
            className="mx-auto h-full w-auto object-contain"
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        <h3 className="flex justify-between text-xs font-medium text-[#FACC15]">
          {article}
          {countInStock <= 0 && (
            <p className="text-xs font-semibold text-black">
              Немає в наявності
            </p>
          )}
        </h3>
        <h4
          className={clsx(
            ' font-medium',
            name.length > 50 ? 'text-xs' : 'text-sm',
          )}
        >
          {name}
        </h4>
        <ul className="h-[50px] text-xs text-secondary">
          {characteristics.length ? (
            characteristics.slice(0, 3).map((item) => {
              const name = item.name.trim();
              const value = item.value.trim();

              return item.value !== '-' ? (
                <li key={item._id} className="inline-flex w-full gap-1">
                  <span className="truncate">{name}:</span>
                  <span className="truncate">{value}</span>
                </li>
              ) : (
                <li key={item._id} className="inline-flex gap-1">
                  <span className="truncate">{name}</span>
                </li>
              );
            })
          ) : (
            <li className="inline-flex gap-1">
              {splitDesc.map((desc, index) => (
                <span key={index} className="truncate">
                  {desc}
                </span>
              ))}
            </li>
          )}
        </ul>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleFavoriteClick.bind(null, _id)}
          aria-label={`Додати ${name} до обраних`}
          data-favorite={_id}
          className={clsx(
            'stroke-black text-white transition-all hover:scale-125 focus:scale-125',
            favoritesIdList.includes(_id) ? ' fill-orange-500' : 'fill-white ',
          )}
        >
          <Heart size={24} className="fill-inherit stroke-inherit stroke-1" />
        </button>

        {listType === 'retail' ? (
          <div className="flex items-center justify-end">
            <div
              className="border-r border-black pr-1 text-base font-medium"
              onClick={() => handleDirectToProduct(_id)}
            >
              {rrcSale ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs line-through">
                    {priceRetailRecommendation} грн
                  </span>
                  <span className="pl-1 text-orangeLight">{rrcSale} грн</span>
                </div>
              ) : (
                priceRetailRecommendation + ' грн'
              )}
            </div>
            <button
              className="fill-black pl-1 transition-all hover:scale-125 hover:fill-orange-500 focus:scale-125"
              onClick={() => handleCartClick(_id, name)}
              aria-label={`Додати ${name} в кошик`}
            >
              <Icon
                icon="cart"
                className="h-6 w-6 fill-black hover:fill-orange-500"
              />
            </button>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-end">
            <p
              className="flex flex-col border-r border-black pr-1 text-sm font-medium"
              onClick={() => {
                handleDirectToProduct(_id);
              }}
            >
              <span>{price} $</span>
              {USDCurrency ? (
                <span>{Math.ceil(price * USDCurrency)} грн</span>
              ) : null}
            </p>
            <button
              className="fill-black pl-1 hover:fill-orange-500"
              onClick={() => handleCartClick(_id, name)}
            >
              <Icon
                icon="cart"
                className="h-6 w-6 fill-black hover:fill-orange-500"
              />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default ProductCard;
