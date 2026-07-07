'use no memo';
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector, useProductStats } from '@/lib/hooks';
import { fetchMainTableDataThunk } from '@/lib/appState/main/operations';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/Pagination';
import {
  addFavoriteProductThunk,
  addProductToCartThunk,
  deleteFavoriteProductThunk,
} from '@/lib/appState/user/operation';
import clsx from 'clsx';
import Table from '@/app/ui/Table';
import ModalProduct from '@/app/ui/modals/ProductModal';
import { Product } from '@/lib/types';
import { toast } from 'react-toastify';
import TextPlaceholder from '@/app/ui/TextPlaceholder';
import Icon from '@/app/ui/assets/Icon';
import { Heart, MousePointerClick, SquareMousePointer, X } from 'lucide-react';
import Modal from 'react-modal';
import ShopList from './ShopList';
import FiltersBlock, { sortValueType } from '@/app/ui/catalog/FiltersBlock';
import { type ColumnDef } from '@tanstack/react-table';
import Loader from '../utils/Loader';

type ShopTableRow = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  favoriteCol: boolean;
  priceCol: number;
  rrcCol: number;
  availableCol: boolean;
  id: number;
  priceUahCol: number;
  product: Product;
};

const ShopTable = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const {
    products,
    total,
    totalPages,
    currencyRates: { USD = 0 },
    shopView,
    tableLoading,
  } = useAppSelector((state) => state.persistedMainReducer);
  const user = useAppSelector((state) => state.persistedAuthReducer.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const { logProductClick } = useProductStats();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPreviewModal = (src: string, alt: string) => {
    setPreviewImage({ src, alt });
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewImage(null);
  };

  const favorites: Product[] = user?.favorites || [];
  const favoritesList = favorites.map((product) => product.id);

  let page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const sortValue: sortValueType = (searchParams.get('sortValue') as sortValueType) || 'default';
  const filters = searchParams.get('filters') || '';

  let productsData = products;
  if (isFavoritePage) {
    productsData = favorites;
    if (query) {
      productsData = favorites.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.article.toLowerCase().includes(query.toLowerCase()),
      );
    }
    if (category) {
      productsData = productsData.filter((product) => product.category?.name === category);
    }
    productsData = productsData.slice((page - 1) * 10, page * 10);
  }

  useEffect(() => {
    if (!isFavoritePage) {
      dispatch(
        fetchMainTableDataThunk({
          page,
          query,
          category,
          isRetail: false,
          sortValue,
          filters,
        }),
      );
    }
  }, [dispatch, page, query, category, isFavoritePage, sortValue, filters]);

  const handleFavoriteClick = useCallback(
    (id: number) => {
      if (favoritesList.includes(id)) {
        dispatch(deleteFavoriteProductThunk(id));
      } else {
        dispatch(addFavoriteProductThunk(id));
      }
    },
    [dispatch, favoritesList],
  );

  const handleCartClick = useCallback(
    (id: number, productName: string) => {
      const input = document.getElementsByName(String(id))[0] as HTMLInputElement | undefined;
      const qty = input ? parseInt(input.value) || 0 : 0;

      if (qty > 0) {
        dispatch(
          addProductToCartThunk({
            productId: id,
            quantity: qty,
          }),
        )
          .unwrap()
          .then(() => {
            toast.success(`${qty} шт. - ${productName} додано в кошик`);
          });
        if (input) input.value = '';
      } else {
        dispatch(
          addProductToCartThunk({
            productId: id,
            quantity: 1,
          }),
        )
          .unwrap()
          .then(() => {
            toast.success(`1 шт. - ${productName} додано в кошик`);
          });
        if (input) input.value = '';
      }
    },
    [dispatch],
  );

  const data = useMemo<ShopTableRow[]>(() => {
    return productsData.map((product) => ({
      codeCol: product.article,
      nameCol: product.name,
      photoCol: product.image,
      favoriteCol: true,
      priceCol: product.price,
      rrcCol: product.priceRetailRecommendation,
      availableCol: product.countInStock <= 0,
      id: product.id,
      priceUahCol: Math.ceil(product.price * USD),
      product,
    }));
  }, [productsData, USD]);

  const columns = useMemo<ColumnDef<ShopTableRow>[]>(
    () => [
      {
        header: 'Артикль',
        accessorKey: 'codeCol', // accessor is the "key" in the data
      },
      {
        header: () => (
          <p className="inline-flex items-center gap-2">
            Назва <MousePointerClick className="text-gray-400" />
          </p>
        ),
        accessorKey: 'nameCol',
        cell: ({ row }) => (
          <button
            className="w-full min-w-[180px] text-left transition-colors hover:text-blue-500 lg:min-w-[220px] xl:min-w-[250px]"
            onClick={() => {
              setSelectedProduct(row.original.product);
              logProductClick(row.original.product.id);
              openModal();
            }}
          >
            {row.original.nameCol}
          </button>
        ),
      },
      {
        header: () => (
          <p className="inline-flex items-center gap-1">
            Фото <SquareMousePointer className="text-gray-400" size={14} />
          </p>
        ),
        accessorKey: 'photoCol',
        cell: ({ row }) => {
          const imgSrc = row.original.photoCol
            ? `${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`
            : '/placeholder.webp';
          return (
            <Image
              src={imgSrc}
              alt={row.original.nameCol || 'Зображення товару'}
              width={64}
              height={64}
              className="mx-auto h-11 w-11 cursor-pointer object-contain transition-transform hover:scale-105 min-[1440px]:h-16 min-[1440px]:w-16"
              loading="lazy"
              onClick={(e) => {
                e.stopPropagation();
                openPreviewModal(imgSrc, row.original.nameCol || 'Зображення товару');
              }}
              onMouseEnter={(e) => {
                const img = document.getElementById('image') as HTMLDivElement;
                if (img) {
                  const imgTag = document.createElement('img');
                  imgTag.src = imgSrc;
                  imgTag.alt = row.original.nameCol || 'Зображення товару';
                  img.replaceChildren(imgTag);
                  img.style.top = `${e.clientY + 20}px`;
                  img.style.left = `${e.clientX + 20}px`;
                  img.classList.remove('hidden');
                }
              }}
              onMouseOut={() => {
                const img = document.getElementById('image') as HTMLDivElement;
                if (img) {
                  img.replaceChildren();
                  img.classList.add('hidden');
                }
              }}
            />
          );
        },
      },
      {
        header: 'Улюблене',
        accessorKey: 'favoriteCol',
        cell: ({ row }) => (
          <button
            onClick={() => handleFavoriteClick(row.original.id)}
            data-favorite={row.original.id}
            className="mx-auto flex cursor-pointer items-center justify-center px-2 py-1 transition-transform duration-200 hover:scale-110"
          >
            <Heart
              className={clsx(
                'transition-colors duration-200',
                favoritesList.includes(row.original.id)
                  ? 'fill-primary-500 stroke-primary-500'
                  : 'fill-none stroke-neutral-400 hover:stroke-neutral-600',
              )}
              size={20}
            />
          </button>
        ),
      },
      {
        header: 'Ціна($)',
        accessorKey: 'priceCol',
      },
      {
        header: 'Ціна(грн)',
        accessorKey: 'priceUahCol',
      },
      {
        header: 'РРЦ(грн)',
        accessorKey: 'rrcCol',
      },
      {
        header: 'К-сть',
        id: 'quantityCol',
        cell: ({ row }) => (
          <input
            name={String(row.original.id)}
            type="number"
            className="focus:border-primary-500 font-table h-8 w-[70px] rounded-lg border border-neutral-200 bg-neutral-50/50 p-1 text-center text-xs font-semibold transition-colors focus:bg-white focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCartClick(row.original.id, row.original.nameCol);
              }
            }}
            placeholder="0"
          />
        ),
      },
      {
        header: 'Кошик',
        id: 'cartCol',
        cell: ({ row }) => (
          <button
            className="px-2 py-1 text-white transition-transform duration-200 hover:scale-110"
            onClick={() => handleCartClick(row.original.id, row.original.nameCol)}
          >
            <Icon icon="cart" className="h-9 w-9 fill-black hover:fill-orange-500" />
          </button>
        ),
      },
    ],

    [favoritesList, handleCartClick, handleFavoriteClick, logProductClick],
  );

  const totalPage = isFavoritePage ? Math.ceil(favorites.length / 10) : totalPages;

  return (
    <>
      {tableLoading && products.length === 0 ? (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4">
          <Loader size={48} className="text-primary-500" />
          <p className="font-semibold text-neutral-500">Завантаження товарів...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="pt-10">
          <TextPlaceholder
            title="Нічого не знайдено"
            text={
              isFavoritePage
                ? 'Ви ще не додали жодного товару або видалили наявні товари з обраного'
                : 'Спробуйте змінити параметри пошуку або категорії'
            }
            titleSize="4xl"
            textSize="xl"
          />
        </div>
      ) : (
        <>
          <div className="relative">
            {tableLoading && !isFavoritePage && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-100 bg-white p-5 shadow-md">
                  <Loader size={32} className="text-primary-500" />
                  <p className="text-sm font-semibold text-neutral-600">Оновлення...</p>
                </div>
              </div>
            )}
            <FiltersBlock listType="partner" />
            <div>
              {shopView === 'table' ? (
                <Table<ShopTableRow> columns={columns} data={data} scrollTrigger={page} />
              ) : (
                <ShopList
                  isFavoritePage={isFavoritePage}
                  favorites={favorites}
                  products={products}
                  totalPages={totalPages}
                />
              )}
            </div>
            <div className="absolute right-2 bottom-14 hidden md:block">
              {`${(page - 1) * 30 + 1} - ${(page - 1) * 30 + 30 > total ? total : (page - 1) * 30 + 30} з ${total}`}
            </div>
            <div className="mx-auto mt-5 w-fit pb-10">
              <Pagination totalPages={totalPage} />
            </div>
          </div>

          <ModalProduct product={selectedProduct} closeModal={closeModal} isOpen={isModalOpen} />

          <Modal
            isOpen={isPreviewModalOpen}
            onRequestClose={closePreviewModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 99999,
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
            }}
            ariaHideApp={false}
          >
            {previewImage && (
              <div className="animate-fade-in relative flex max-h-[90vh] max-w-[90vw] flex-col items-center overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
                <button
                  className="absolute top-4 right-4 z-50 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
                  onClick={closePreviewModal}
                >
                  <X size={20} />
                </button>
                <div className="relative h-[80vh] max-h-[600px] w-[80vw] max-w-[600px]">
                  <Image
                    src={previewImage.src}
                    alt={previewImage.alt}
                    layout="fill"
                    objectFit="contain"
                    sizes="(max-width: 600px) 100vw, 600px"
                    className="rounded-lg"
                  />
                </div>
                <div className="w-full rounded-b-xl border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-800">
                  {previewImage.alt}
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default ShopTable;
