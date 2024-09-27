'use client';

import { Button } from '@/app/ui/buttons/button';
import { getProductByIdThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { useEffect } from 'react';
import novaPoshtaSVG from '@/public/icons/Nova_Poshta_2019_ua.svg';
import Head from 'next/head';
import { addProductToRetailCartThunk } from '@/lib/appState/user/operation';
import { toast } from 'react-toastify';
import { addProductToLocalStorageCart } from '@/lib/appState/user/slice';
import { useRouter } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

type PageProps = {
  params: {
    productId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.persistedMainReducer.product);
  const isAuth = useAppSelector(
    (state) => state.persistedAuthReducer.isAuthenticated,
  );
  const router = useRouter();
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' });

  useEffect(() => {
    dispatch(getProductByIdThunk(params.productId));
  }, [dispatch, params.productId]);

  const handleCartClick = () => {
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
      const { price, priceBulk, ...normalizeProduct } = product;
      dispatch(
        addProductToLocalStorageCart({
          productId: normalizeProduct,
          quantity: 1,
          _id: product._id,
        }),
      );

      toast.success(`${product.name} додано в кошик`);
    }
  };

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
            className="mb-10 max-h-[250px] w-full object-contain"
          />

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
            <Button className="bg-orange-400" onClick={() => handleCartClick()}>
              В кошик
            </Button>
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
