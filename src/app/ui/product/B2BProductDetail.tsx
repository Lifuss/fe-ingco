'use client';

import AddToCartButton from '@/app/ui/buttons/AddToCartButton';
import Breadcrumbs from '@/app/ui/Breadcrumbs';
import { Button } from '@/app/ui/buttons/button';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { addProductToCartThunk } from '@/lib/appState/user/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import JsBarcode from 'jsbarcode';
import { SearchX } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ProductSkeleton from '@/app/ui/skeletons/ProductSkeleton';

interface B2BProductDetailProps {
  productSlug: string;
}

const B2BProductDetail = ({ productSlug }: B2BProductDetailProps) => {
  const dispatch = useAppDispatch();
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const productLoading = useAppSelector((state) => state.persistedMainReducer.productLoading);
  const USD = useAppSelector(selectUSDRate);

  const wholesalePriceUah = Math.ceil((product?.priceBulk || product?.price || 0) * USD);

  const calculateMargin = (rrc: number) => {
    if (rrc <= 0) return 0;
    return Math.ceil(((rrc - wholesalePriceUah) / rrc) * 100);
  };

  const calculateProfit = (rrc: number) => {
    return rrc - wholesalePriceUah;
  };

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.barcode && barcodeRef.current) {
      JsBarcode(barcodeRef.current, product.barcode, {
        format: 'CODE128',
        width: 2,
        height: 30,
        margin: 0,
        fontSize: 11,
      });
    }
  }, [product]);

  const onAddToCart = async () => {
    if (!product) return;
    await dispatch(addProductToCartThunk({ productId: product.id, quantity })).unwrap();
    setQuantity(1);
  };

  if (productLoading) {
    return (
      <main className="min-h-[550px] px-[60px] pt-8">
        <ProductSkeleton />
      </main>
    );
  }

  if (!product || !product.id) {
    return (
      <main className="min-h-[550px] px-[60px] pt-8 flex h-[50vh] flex-col items-center justify-center gap-5">
        <SearchX size={52} />
        <h2 className="text-2xl">Продукт не знайдено</h2>
        <Button className="bg-orange-light hover:bg-orange-400" onClick={() => router.push('/')}>
          В каталог
        </Button>
      </main>
    );
  }

  const breadcrumbsItems = [
    { label: 'Каталог партнера', href: '/', preserveQuery: true },
    { label: product.name },
  ];

  return (
    <main className="min-h-[550px] px-[60px] pt-8">
        <Breadcrumbs items={breadcrumbsItems} />
        <section className="flex flex-col gap-4 pb-20 md:grid md:grid-cols-5 md:gap-10">
          {!isTablet && (
            <div>
              <h1 className="mb-2 text-center text-2xl">{product.name}</h1>
            </div>
          )}
          <div className="col-span-2">
            <Image
              src={product.image ? process.env.NEXT_PUBLIC_API + product.image : '/placeholder.webp'}
              alt={product.name}
              width={500}
              height={500}
              className="mb-6 max-h-[250px] w-full object-contain"
            />
            {product.barcode && (
              <div className="mt-2 mb-4 flex justify-center">
                <svg ref={barcodeRef}></svg>
              </div>
            )}
            <div>
              <h2 className="mb-2 text-center text-lg font-medium md:mb-5 md:text-2xl">
                Характеристики
              </h2>
              <ul className="text-sm lg:text-base">
                {product.characteristics.map((characteristic) => (
                  <li
                    className="flex justify-between gap-2"
                    key={characteristic._id ?? characteristic.name}
                  >
                    {characteristic.value !== '-' ? (
                      <>
                        <h3 className="font-medium">{characteristic.name}:</h3>
                        <p>{characteristic.value}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium">{characteristic.name}:</h3>
                        <p>+</p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-3 flex flex-col">
            {isTablet && (
              <div>
                <h1 className="text-xl lg:text-3xl">{product.name}</h1>
              </div>
            )}
            <div className="mt-2 mb-5 grid grid-cols-2 gap-5 md:mt-10 md:flex">
              <p className="flex flex-col text-xl md:text-2xl">
                <span>{product.price} $</span>
                <span>{wholesalePriceUah} грн</span>
              </p>

              <input
                type="number"
                value={quantity}
                className="ml-auto w-20 rounded-lg border border-gray-300 text-center text-lg"
                onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)}
              />

              <AddToCartButton
                productId={product.id}
                productName={product.name}
                price={wholesalePriceUah}
                onAddToCart={onAddToCart}
                className="col-span-2 bg-orange-400 hover:bg-orange-500"
              />
            </div>
            <div className="flex flex-col text-lg">
              <span>
                Рекомендована роздрібна ціна
                {!product.rrcSale ? `: ${product.priceRetailRecommendation} грн` : ': '}
              </span>
              {product.rrcSale ? (
                <div className="flex gap-2">
                  <span>Стандартний РРЦ - {product.priceRetailRecommendation} грн</span>
                  <span>|</span>
                  <span>Акційна РРЦ - {product.rrcSale} грн</span>
                </div>
              ) : null}
            </div>
            <p className="mb-5 text-lg">
              <div className={clsx('mt-2 flex', product.rrcSale ? 'flex-col' : 'gap-2')}>
                <div className="flex flex-col">
                  Маржинальний прибуток:
                  <span className="-mt-2 ml-1 align-top text-xs text-gray-500">
                    (без витрат на перевезення та інше)
                  </span>
                </div>
                {!product.rrcSale
                  ? `${calculateMargin(product.priceRetailRecommendation)}% (+${calculateProfit(product.priceRetailRecommendation)} ₴)`
                  : ''}
              </div>
              {product.rrcSale ? (
                <div className="flex gap-2">
                  <div>
                    <span>
                      Стандартна: {calculateMargin(product.priceRetailRecommendation)}%
                    </span>
                    <span>
                      {' = '}
                      {calculateProfit(product.priceRetailRecommendation)} грн
                    </span>
                  </div>
                  <span>|</span>
                  <div>
                    <span>
                      Акційна: {calculateMargin(product.rrcSale)}%
                    </span>
                    <span>
                      {' = '}
                      {calculateProfit(product.rrcSale)} грн
                    </span>
                  </div>
                </div>
              ) : null}
            </p>
            <div className="items-center mb-16 flex w-1/2 gap-5 rounded-lg">
              <p className="text-center text-xl">Перевізник:</p>
              <Image
                src="/icons/Nova_Poshta_2019_ua.svg"
                alt="Nova Poshta"
                width={100}
                height={50}
                className="object-contain"
              />
            </div>
            <h2 className="mb-2 text-center text-lg font-medium md:mb-5 md:text-2xl">Опис</h2>
            {product.description.split('\n').map((paragraph) => (
              <p key={paragraph} className="text-base md:text-xl">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </main>
  );
};

export default B2BProductDetail;
