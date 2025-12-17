'use client';

import AddToCartButton from '@/app/ui/AddToCartButton';
import Breadcrumbs from '@/app/ui/Breadcrumbs';
import { Button } from '@/app/ui/buttons/button';
import { getProductBySlugThunk } from '@/lib/appState/main/operations';
import { addProductToRetailCartThunk } from '@/lib/appState/user/operation';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import novaPoshtaSVG from '@/public/icons/Nova_Poshta_2019_ua.svg';
import JsBarcode from 'jsbarcode';
import { SearchX } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import CategoriesSidebar from '~/ui/CategoriesSidebar';
import Header from '~/ui/home/Header';
import Footer from '~/ui/Footer';

type PageProps = {
  params: {
    productSlug: string;
  };
};

const Page = ({ params }: PageProps) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const isAuth = useAppSelector(
    (state) => state.persistedAuthReducer.isAuthenticated,
  );
  const router = useRouter();
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

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

  const onAddToCart = async () => {
    if (isAuth) {
      await dispatch(
        addProductToRetailCartThunk({
          productId: product._id,
          quantity: 1,
        }),
      ).unwrap();
    } else {
      const { price, priceBulk, ...normalizeProduct } = product;
      await Promise.resolve(
        dispatch(
          addProductToLocalStorageCart({
            productId: normalizeProduct,
            quantity: 1,
            _id: product._id,
          }),
        ),
      );
    }
  };

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
        price: product.rrcSale || product.priceRetailRecommendation,
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
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitCode: 'DAY',
        },
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
    { label: 'Каталог роздріб', href: '/', preserveQuery: true },
    { label: product.name },
  ];

  return product ? (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px] w-full">
          <Head>
            <title>{`${product.name} - ${product.article} | INGCO Україна`}</title>
            <meta
              name="description"
              content={`${product.name} - ${product.article}. ${product.description.substring(0, 150)}... Купити в Україні з доставкою.`}
            />
            <meta
              name="keywords"
              content={`${product.name}, ${product.article}, INGCO, електроінструменти, купити в Україні`}
            />
            <meta
              property="og:title"
              content={`${product.name} - ${product.article} | INGCO`}
            />
            <meta
              property="og:description"
              content={`${product.name} - ${product.article}. Купити в Україні з доставкою.`}
            />
            <meta
              property="og:image"
              content={process.env.NEXT_PUBLIC_API + product.image}
            />
            <meta property="og:type" content="product" />
            <meta
              property="product:price:amount"
              content={
                product.rrcSale?.toString() ||
                product.priceRetailRecommendation?.toString()
              }
            />
            <meta property="product:price:currency" content="UAH" />
            <link
              rel="canonical"
              href={`https://ingco-service.win/${params.productSlug}`}
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
                className="mb-10 max-h-[250px] w-full object-contain"
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
                          <h3 className="font-medium">
                            {characteristic.name}:
                          </h3>
                          <p>{characteristic.value}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium">
                            {characteristic.name}:
                          </h3>
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
                {product.rrcSale ? (
                  <div className="flex flex-col items-end">
                    <span className="text-lg line-through">
                      {product.priceRetailRecommendation} грн
                    </span>
                    <span className="pl-1 text-2xl text-orangeLight">
                      {product.rrcSale} грн
                    </span>
                  </div>
                ) : (
                  <p className="text-2xl">
                    {product.priceRetailRecommendation} грн
                  </p>
                )}
                <AddToCartButton
                  productId={product._id}
                  productName={product.name}
                  price={product.rrcSale || product.priceRetailRecommendation}
                  onAddToCart={onAddToCart}
                  className="bg-orange-400 hover:bg-orange-500"
                />
              </div>
              <div className="it ems-center mb-5 flex w-1/2 gap-5 rounded-lg md:mb-20">
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
        </div>
      </main>
      <Footer />
    </>
  ) : (
    <>
      <Header />
      <main className="flex flex-col gap-4 px-[60px] pt-8 xl:flex-row 2xl:gap-14">
        <CategoriesSidebar />
        <div className="min-h-[550px] w-full">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-5">
            <SearchX size={52} />
            <h2 className="text-2xl">Продукт не знайдено</h2>

            <Button
              className="bg-orangeLight hover:bg-orange-400"
              onClick={() => router.push('/')}
            >
              В каталог
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
