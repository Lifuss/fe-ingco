'use client';
import Modal from 'react-modal';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  addProductToCartThunk,
  addProductToRetailCartThunk,
} from '@/lib/appState/user/operation';
import { useState } from 'react';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { toast } from 'react-toastify';

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ModalProduct = ({
  product,
  isOpen,
  closeModal,
  isRetail = false,
}: {
  product: Product | null;
  isOpen: boolean;
  closeModal: () => void;
  isRetail?: boolean;
}) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      ariaHideApp={false}
    >
      {product && (
        <div className="relative w-[750px] text-lg">
          <button className="absolute right-0 top-0" onClick={closeModal}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-black transition-colors hover:fill-orange-500"
            >
              <path d="M20.616 0L12 8.616L3.384 0L0 3.384L8.616 12L0 20.616L3.384 24L12 15.384L20.616 24L24 20.616L15.384 12L24 3.384L20.616 0Z" />
            </svg>
          </button>
          <h2 className="mx-auto mb-5 px-6 text-center text-2xl font-medium">
            {product.name}
          </h2>
          <div className="grid grid-cols-3">
            <div className="col-span-1 border-r-2 border-black pr-10">
              <div className="relative mb-10 h-[150px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API}${product.image}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between">
                {!isRetail ? (
                  <div>
                    <p title="Ціна в дол. амер. за 1 одиницю">
                      Ціна $: {product.price}
                    </p>
                    <p title="Рекомендована роздрібна ціна в грн">
                      РРЦ: {product.priceRetailRecommendation} грн
                    </p>
                  </div>
                ) : product.rrcSale ? (
                  <div className="flex flex-col items-end">
                    <span className="text-xs line-through">
                      {product.priceRetailRecommendation} грн
                    </span>
                    <span>
                      Ціна:{' '}
                      <span className="pl-1 text-orangeLight">
                        {product.rrcSale} грн
                      </span>
                    </span>
                  </div>
                ) : (
                  'Ціна: ' + product.priceRetailRecommendation + ' грн'
                )}
                <div className="flex items-center gap-3">
                  {!isRetail && (
                    <div className="flex gap-1 text-2xl">
                      <button
                        onClick={() => setProductQuantity(productQuantity - 1)}
                      >
                        -
                      </button>
                      <p>{productQuantity}</p>
                      <button
                        onClick={() => setProductQuantity(productQuantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!isRetail) {
                        if (productQuantity > 0) {
                          dispatch(
                            addProductToCartThunk({
                              productId: product._id,
                              quantity: productQuantity,
                            }),
                          )
                            .unwrap()
                            .then(() => {
                              toast.success(`${product.name} додано в кошик`);
                            });
                        } else {
                          toast.error('Кількість товару не може бути менше 1');
                        }
                      } else {
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
                      }
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      className="fill-black hover:fill-orange-500"
                    >
                      <path d="M35.7068 9.98438C35.6036 9.83783 35.4667 9.71821 35.3077 9.6356C35.1486 9.553 34.972 9.50982 34.7928 9.5097H10.9169L9.1096 3.2772C8.40085 0.823013 6.71669 0.558075 6.02594 0.558075H1.207C0.589344 0.558075 0.0898438 1.05814 0.0898438 1.6752C0.0898438 2.29226 0.589906 2.79229 1.20697 2.79229H6.02534C6.17778 2.79229 6.64297 2.79229 6.96025 3.8886L13.1776 26.7379C13.3126 27.22 13.7519 27.5529 14.253 27.5529H29.4394C29.9108 27.5529 30.3315 27.2576 30.4908 26.8138L35.8435 11.0048C35.9667 10.6622 35.9155 10.2808 35.7068 9.98438H35.7068ZM28.6532 25.3193H15.101L11.5448 11.7445H33.2045L28.6532 25.3193ZM26.4376 29.8171C24.884 29.8171 23.6251 31.076 23.6251 32.6296C23.6251 34.1832 24.884 35.4421 26.4376 35.4421C27.9912 35.4421 29.2501 34.1832 29.2501 32.6296C29.2501 31.076 27.9912 29.8171 26.4376 29.8171ZM16.3126 29.8171C14.759 29.8171 13.5001 31.076 13.5001 32.6296C13.5001 34.1832 14.759 35.4421 16.3126 35.4421C17.8662 35.4421 19.1251 34.1832 19.1251 32.6296C19.1251 31.076 17.8662 29.8171 16.3126 29.8171Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-2 min-w-[200px] pl-4 text-base">
              <div className="mb-2 flex flex-wrap justify-between">
                <p>
                  <span className="font-medium">Артикул:</span>{' '}
                  {product.article}
                </p>
                <p>
                  <span className="font-medium">Категорія:</span>{' '}
                  {product.category?.name}
                </p>
              </div>
              <div className="">
                {product.description.split('\n').map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              {product.characteristics.length > 0 && (
                <p className="mt-2 text-center">
                  <span className="font-medium">Характеристики</span>
                </p>
              )}

              <div className="flex flex-col gap-2">
                {product.characteristics?.map((item) =>
                  item.value !== '-' ? (
                    <div key={item._id}>
                      <p>
                        <span className=" font-medium">{item.name}:</span>{' '}
                        {item.value}
                      </p>
                    </div>
                  ) : (
                    <div key={item._id}>
                      <p>
                        <span className=" font-medium">{item.name}</span>
                      </p>
                    </div>
                  ),
                )}
                {product.warranty ? (
                  <p className="">
                    <span className="font-medium">Гарантія:</span>{' '}
                    {product.warranty} міс.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalProduct;
