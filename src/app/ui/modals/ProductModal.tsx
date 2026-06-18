'use client';
import Modal from 'react-modal';
import { useAppDispatch } from '@/lib/hooks';
import { addProductToCartThunk } from '@/lib/appState/user/operation';
import { useState } from 'react';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Icon from '../assets/Icon';
import { X } from 'lucide-react';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(15, 15, 14, 0.4)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    padding: 0,
    overflow: 'visible',
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
        <div className="animate-fade-in relative max-h-[92vh] w-full max-w-[850px] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-5 text-neutral-800 shadow-2xl md:w-[800px]">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            onClick={closeModal}
            aria-label="Закрити"
          >
            <X size={20} />
          </button>

          {/* Top badges for Category & Article */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            {product.category?.name && (
              <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-neutral-700">
                {product.category.name}
              </span>
            )}
            <span className="rounded-md border border-amber-200/50 bg-amber-50 px-2.5 py-1 text-amber-800">
              АРТИКУЛ: {product.article}
            </span>
          </div>

          {/* Product Title */}
          <h2 className="mb-5 pr-8 text-xl leading-snug font-bold text-neutral-900 md:text-2xl">
            {product.name}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Left Column: Image, Price and Cart Actions */}
            <div className="flex flex-col md:col-span-5">
              {/* Image Container */}
              <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                <Image
                  src={
                    product.image
                      ? `${process.env.NEXT_PUBLIC_API}${product.image}`
                      : '/placeholder.webp'
                  }
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  className="transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>

              {/* Price & Purchase controls card */}
              <div className="mt-4 flex flex-grow flex-col justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                {/* Pricing Info */}
                <div>
                  {!isRetail ? (
                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                        Ціна:
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-neutral-950">
                          ${product.price}
                        </span>
                        <span className="text-xs font-medium text-neutral-400">за одиницю</span>
                      </div>
                      <div className="mt-2 w-fit rounded bg-neutral-200/50 px-2 py-1 text-xs font-medium text-neutral-500">
                        РРЦ:{' '}
                        <span className="font-semibold text-neutral-800">
                          {product.priceRetailRecommendation} грн
                        </span>
                      </div>
                    </div>
                  ) : product.rrcSale ? (
                    <div>
                      <div className="mb-0.5 text-xs text-neutral-400 line-through">
                        {product.priceRetailRecommendation} грн
                      </div>
                      <div className="text-primary-600 text-2xl font-bold">
                        {product.rrcSale} <span className="text-sm font-semibold">грн</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                        Роздрібна ціна:
                      </div>
                      <div className="text-2xl font-bold text-neutral-950">
                        {product.priceRetailRecommendation}{' '}
                        <span className="text-sm font-semibold">грн</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Counter & Add to Cart Action */}
                <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200/60 pt-3">
                  {!isRetail && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                        Кількість:
                      </span>
                      <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => setProductQuantity(Math.max(0, productQuantity - 1))}
                          className="cursor-pointer px-3 py-1.5 font-bold text-neutral-500 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={productQuantity}
                          onChange={(e) =>
                            setProductQuantity(Math.max(0, parseInt(e.target.value) || 0))
                          }
                          className="w-12 [appearance:textfield] bg-transparent text-center text-sm font-bold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setProductQuantity(productQuantity + 1)}
                          className="cursor-pointer px-3 py-1.5 font-bold text-neutral-500 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const qty = !isRetail ? productQuantity : 1;
                      if (qty > 0) {
                        dispatch(
                          addProductToCartThunk({
                            productId: product.id,
                            quantity: qty,
                            isRetail,
                          }),
                        )
                          .unwrap()
                          .then(() => {
                            toast.success(`${product.name} додано в кошик`);
                          });
                      } else {
                        toast.error('Кількість товару не може бути менше 1');
                      }
                    }}
                    className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white shadow-sm transition-all duration-150 hover:shadow-md"
                  >
                    <Icon icon="cart" className="h-5 w-5 fill-white" />
                    <span className="text-sm">Додати в кошик</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Description & Characteristics */}
            <div className="flex flex-col justify-between gap-4 text-sm md:col-span-7">
              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="mb-1.5 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    Опис
                  </h3>
                  <div className="max-h-[140px] overflow-y-auto pr-1 leading-relaxed text-neutral-600">
                    {product.description.split('\n').map((item, index) => (
                      <p key={index} className="mb-1 last:mb-0">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Characteristics */}
              {product.characteristics && product.characteristics.length > 0 && (
                <div>
                  <h3 className="mb-1.5 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    Характеристики
                  </h3>
                  <div className="max-h-[240px] overflow-hidden overflow-y-auto rounded-xl border border-neutral-100 bg-neutral-50/50 pr-1">
                    <div className="divide-y divide-neutral-100">
                      {product.characteristics.map((item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="flex items-baseline justify-between gap-4 px-3 py-2 text-xs transition-colors hover:bg-neutral-100/50"
                        >
                          <span className="shrink-0 font-medium text-neutral-500">{item.name}</span>
                          {item.value !== '-' ? (
                            <span className="text-right font-semibold text-neutral-900">
                              {item.value}
                            </span>
                          ) : (
                            <span className="font-medium text-neutral-400">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Warranty block */}
              {product.warranty && (
                <div className="flex w-fit items-center gap-2 rounded-lg border border-blue-100/50 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
                  <span>Гарантія: {product.warranty} міс.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalProduct;
