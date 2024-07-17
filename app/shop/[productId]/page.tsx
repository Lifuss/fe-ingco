'use client';

import { Button } from '@/app/ui/buttons/button';
import { getProductByIdThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import novaPoshtaSVG from '@/public/icons/Nova_Poshta_2019_ua.svg';
import Head from 'next/head';
import {
  addProductToCartThunk,
  addProductToRetailCartThunk,
} from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import { useRouter } from 'next/navigation';
import { SearchX } from 'lucide-react';

type PageProps = {
  params: {
    productId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const { USD } = useAppSelector(
    (state) => state.persistedMainReducer.currencyRates,
  );
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log(params.productId);
    dispatch(getProductByIdThunk(params.productId));
  }, [dispatch, params.productId]);

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

  return product ? (
    <>
      <Head>
        <title>{'INGCO' + ' ' + product.article}</title>
        <meta name="description" content={product.name} />
        <meta name="keywords" content={product.seoKeywords} />
      </Head>
      <section className="grid grid-cols-5 gap-10 pb-20">
        <div className="col-span-2">
          <Image
            src={process.env.NEXT_PUBLIC_API + product.image}
            alt={product.name}
            width={500}
            height={500}
            className="mb-10 w-full object-contain"
          />

          <div>
            <h2 className="mb-5 text-center text-2xl">Характеристики</h2>
            <ul className="">
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
          <div>
            <h1 className="text-3xl">{product.name}</h1>
          </div>

          <div className="mb-5 mt-10 flex gap-5">
            <p className="flex flex-col text-2xl">
              <span>{product.price} $</span>
              <span>{Math.ceil(product.price * USD)} грн</span>
            </p>

            <input
              type="number"
              value={quantity}
              className="w-20 rounded-lg border border-gray-300"
              onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)}
            />

            <Button
              className="bg-orange-400 hover:bg-orange-500"
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
            Маржинальний прибуток{' '}
            <span className="align-top text-xs text-gray-500">
              (без витрат на перевезення та інше)
            </span>
            :{' '}
            {Math.ceil(
              ((product.priceRetailRecommendation - product.price * USD) /
                product.priceRetailRecommendation) *
                100,
            )}
            % |{' '}
            {product.priceRetailRecommendation - Math.ceil(product.price * USD)}{' '}
            грн
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
          <h2 className="mb-4 text-2xl">Опис</h2>
          {product.description.split('\n').map((paragraph) => (
            <p key={paragraph} className="text-xl">
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
