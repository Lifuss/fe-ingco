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
import Icon from '../assets/Icon';
import { X } from 'lucide-react';

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
            <X size={24} absoluteStrokeWidth className="cursor-pointer" />
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
                    <Icon
                      icon="cart"
                      className="h-8 w-8 fill-black hover:fill-orange-500"
                    />
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
