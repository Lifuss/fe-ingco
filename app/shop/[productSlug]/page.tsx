'use client';

import AddToCartButton from '@/app/ui/AddToCartButton';
import Breadcrumbs from '@/app/ui/Breadcrumbs';
import { Button } from '@/app/ui/buttons/button';
import { getProductBySlugThunk } from '@/lib/appState/main/operations';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { addProductToCartThunk } from '@/lib/appState/user/operation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import novaPoshtaSVG from '@/public/icons/Nova_Poshta_2019_ua.svg';
import clsx from 'clsx';
import JsBarcode from 'jsbarcode';
import { SearchX } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

type PageProps = {
  params: {
    productSlug: string;
  };
};

const Page = ({ params }: PageProps) => {
  const dispatch = useAppDispatch();
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const USD = useAppSelector(selectUSDRate);

  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProductBySlugThunk(params.productSlug));
  }, [dispatch, params.productSlug]);
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

  const handleCartClick = (id: string, productName: string) => {
    dispatch(
      addProductToCartThunk({
        productId: id,
        quantity,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success(`${quantity} шт. - ${productName} додано в кошик`);
        setQuantity(1);
      });
  };

  const onAddToCart = async () => {
    await dispatch(
      addProductToCartThunk({ productId: product._id, quantity }),
    ).unwrap();
    setQuantity(1);
  };

  // Product structured data
  const generateProductSchema = () => {
    if (!product) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.article,
      mpn: product.article,
      brand: {
        '@type': 'Brand',
        name: 'INGCO',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'INGCO',
      },
      category: 'Електроінструменти',
      image: process.env.NEXT_PUBLIC_API + product.image,
      offers: {
        '@type': 'Offer',
        price: Math.ceil(product.price * USD),
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'INGCO Ukraine',
          url: 'https://ingco-service.win',
        },
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150',
      },
      additionalProperty: product.characteristics.map((char) => ({
        '@type': 'PropertyValue',
        name: char.name,
        value: char.value,
      })),
    };
  };

  const searchParams = useSearchParams();
  const hasCategory = !!searchParams.get('category');
  const breadcrumbsItems = [
    { label: 'Каталог партнера', href: '/shop', preserveQuery: true },
    { label: product.name },
  ];

  if (!product) return <div>Loading...</div>;

  return product ? (
    <>
      <Head>
        <title>{`${product.name} - ${product.article} | INGCO Україна`}</title>
        <meta
          name="description"
          content={`${product.name} - ${product.article}. ${product.description.substring(0, 150)}... Купити гуртом в Україні.`}
        />
        <meta
          name="keywords"
          content={`${product.name}, ${product.article}, INGCO, електроінструменти, гурт, купити в Україні`}
        />
        <meta
          property="og:title"
          content={`${product.name} - ${product.article} | INGCO`}
        />
        <meta
          property="og:description"
          content={`${product.name} - ${product.article}. Купити гуртом в Україні.`}
        />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_API + product.image}
        />
        <meta property="og:type" content="product" />
        <meta
          property="product:price:amount"
          content={Math.ceil(product.price * USD).toString()}
        />
        <meta property="product:price:currency" content="UAH" />
        <link
          rel="canonical"
          href={`https://ingco-service.win/shop/${params.productSlug}`}
        />
        {generateProductSchema() && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateProductSchema(), null, 2),
            }}
          />
        )}
      </Head>
      <Breadcrumbs items={breadcrumbsItems} />
      <section className="flex flex-col gap-4 pb-20 md:grid md:grid-cols-5 md:gap-10">
        {!isTablet && (
          <div>
            <h1 className="mb-2 text-center text-2xl">{product.name}</h1>
          </div>
        )}
        <div className="col-span-2">
          <Image
            src={process.env.NEXT_PUBLIC_API + product.image}
            alt={product.name}
            width={500}
            height={500}
            className="mb-6 max-h-[250px] w-full object-contain"
          />
          {product.barcode && (
            <div className="mb-4 mt-2 flex justify-center">
              <svg ref={barcodeRef}></svg>
            </div>
          )}
          <div>
            <h2 className=" mb-2 text-center text-lg font-medium md:mb-5 md:text-2xl">
              Характеристики
            </h2>
            <ul className="text-sm lg:text-base">
              {product.characteristics.map((characteristic) => (
                <li
                  className="flex justify-between gap-2"
                  key={characteristic._id}
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
          <div className="mb-5 mt-2 grid grid-cols-2 gap-5 md:mt-10 md:flex">
            <p className="flex flex-col text-xl md:text-2xl">
              <span>{product.price} $</span>
              <span>{Math.ceil(product.price * USD)} грн</span>
            </p>

            <input
              type="number"
              value={quantity}
              className="ml-auto w-20 rounded-lg border border-gray-300 text-center text-lg"
              onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)}
            />

            <AddToCartButton
              productId={product._id}
              productName={product.name}
              price={Math.ceil(product.price * USD)}
              onAddToCart={onAddToCart}
              className="col-span-2 bg-orange-400 hover:bg-orange-500"
            />
          </div>
          <div className="flex flex-col text-lg">
            <span>
              Рекомендована роздрібна ціна
              {!product.rrcSale
                ? `: ${product.priceRetailRecommendation} грн`
                : ': '}
            </span>
            {product.rrcSale ? (
              <div className="flex gap-2">
                <span>
                  Стандартний РРЦ - {product.priceRetailRecommendation} грн
                </span>
                <span>|</span>
                <span>Акційна РРЦ - {product.rrcSale} грн</span>
              </div>
            ) : null}
          </div>
          <p className="mb-5 text-lg">
            <div
              className={clsx(
                'mt-2 flex',
                product.rrcSale ? 'flex-col' : 'gap-2',
              )}
            >
              <div className=" flex flex-col">
                Маржинальний прибуток:
                <span className="-mt-2 ml-1 align-top text-xs text-gray-500">
                  (без витрат на перевезення та інше)
                </span>
              </div>
              {!product.rrcSale
                ? `${Math.ceil(
                    ((product.priceRetailRecommendation - product.price * USD) /
                      product.priceRetailRecommendation) *
                      100,
                  )}%`
                : ''}
            </div>
            {product.rrcSale ? (
              <div className="flex gap-2">
                <div>
                  <span>
                    Стандартна:{' '}
                    {Math.ceil(
                      ((product.priceRetailRecommendation -
                        product.price * USD) /
                        product.priceRetailRecommendation) *
                        100,
                    ) + '%'}
                  </span>
                  <span>
                    {' = '}
                    {product.priceRetailRecommendation -
                      Math.ceil(product.price * USD)}{' '}
                    грн
                  </span>
                </div>
                <span>|</span>
                <div>
                  <span>
                    Акційна:{' '}
                    {Math.ceil(
                      ((product.rrcSale - product.price * USD) /
                        product.rrcSale) *
                        100,
                    ) + '%'}
                  </span>
                  <span>
                    {' = '}
                    {product.rrcSale - Math.ceil(product.price * USD)} грн
                  </span>
                </div>
              </div>
            ) : null}
          </p>
          <div className="it ems-center mb-16 flex w-1/2 gap-5 rounded-lg">
            <p className="text-center text-xl">Перевізник:</p>
            <Image
              src={novaPoshtaSVG}
              alt="Nova Poshta"
              width={100}
              height={50}
              objectFit="contain"
            />
          </div>
          <h2 className=" mb-2 text-center text-lg font-medium md:mb-5 md:text-2xl">
            Опис
          </h2>
          {product.description.split('\n').map((paragraph) => (
            <p key={paragraph} className="text-base md:text-xl">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  ) : (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-5">
      <SearchX size={52} />
      <h2 className="text-2xl">Продукт не знайдено</h2>

      <Button
        className="bg-orangeLight hover:bg-orange-400"
        onClick={() => router.push('/retail')}
      >
        В каталог
      </Button>
    </div>
  );
};

export default Page;
