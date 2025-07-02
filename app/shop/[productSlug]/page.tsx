'use client';

import { Button } from '@/app/ui/buttons/button';
import { getProductBySlugThunk } from '@/lib/appState/main/operations';
import { selectUSDRate } from '@/lib/appState/main/selectors';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import novaPoshtaSVG from '@/public/icons/Nova_Poshta_2019_ua.svg';
import Head from 'next/head';
import { addProductToCartThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import JsBarcode from 'jsbarcode';

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

  if (!product) return <div>Loading...</div>;

  return product ? (
    <>
      <Head>
        <title>{'INGCO' + ' ' + product.article}</title>
        <meta name="description" content={product.name} />
        <meta name="keywords" content={product.seoKeywords} />
      </Head>
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

            <Button
              className="col-span-2 bg-orange-400 hover:bg-orange-500"
              onClick={() => handleCartClick(product._id, product.name)}
            >
              В кошик
            </Button>
          </div>

          <p className="text-lg">
            Рекомендована роздрібна ціна: {product.priceRetailRecommendation}{' '}
            грн
          </p>
          <p className="mb-5 text-lg">
            Маржинальний прибуток :{' '}
            {Math.ceil(
              ((product.priceRetailRecommendation - product.price * USD) /
                product.priceRetailRecommendation) *
                100,
            )}
            % |{' '}
            {product.priceRetailRecommendation - Math.ceil(product.price * USD)}{' '}
            грн
            <span className="ml-1 align-top text-xs text-gray-500">
              (без витрат на перевезення та інше)
            </span>
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
