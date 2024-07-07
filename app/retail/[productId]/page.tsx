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
  useEffect(() => {
    console.log(params.productId);
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

  return (
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
          <div className="it ems-center mb-20 flex w-1/2 gap-5 rounded-lg">
            <p className="text-center text-xl">Перевізник:</p>
            <Image
              src={novaPoshtaSVG}
              alt="Nova Poshta"
              width={100}
              height={50}
              objectFit="contain"
            />
          </div>

          {product.description.split('\n').map((paragraph) => (
            <p key={paragraph} className="text-xl">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
};

export default Page;
