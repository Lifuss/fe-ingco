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

    const productPrice = product.rrcSale || product.priceRetailRecommendation;
    const imageUrl = product.image.startsWith('http')
      ? product.image
      : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.article,
      mpn: product.article,
      gtin: product.barcode || undefined,
      brand: {
        '@type': 'Brand',
        name: 'INGCO',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'INGCO',
      },
      category: product.category?.name || 'Електроінструменти',
      image: imageUrl,
      offers: {
        '@type': 'Offer',
        price: productPrice,
        priceCurrency: 'UAH',
        availability:
          product.countInStock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
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
        itemCondition: 'https://schema.org/NewCondition',
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

  const generateBreadcrumbSchema = () => {
    if (!product) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Головна',
          item: 'https://ingco-service.win',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Каталог роздріб',
          item: 'https://ingco-service.win/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `https://ingco-service.win/${params.productSlug}`,
        },
      ],
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
          {generateProductSchema() && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateProductSchema(), null, 2),
              }}
            />
          )}
          {generateBreadcrumbSchema() && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateBreadcrumbSchema(), null, 2),
              }}
            />
          )}
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
