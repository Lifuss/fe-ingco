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
import { Heart, MousePointerClick, SquareMousePointer } from 'lucide-react';
import ShopList from './ShopList';
import FiltersBlock, { sortValueType } from '@/app/ui/FiltersBlock';
import { Column } from 'react-table';

type ShopTableRow = {
  codeCol: string;
  nameCol: string;
  photoCol: string;
  favoriteCol: boolean;
  priceCol: number;
  rrcCol: number;
  availableCol: boolean;
  _id: string;
  priceUahCol: number;
  product: Product;
};

const ShopTable = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { logProductClick } = useProductStats();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const {
    products,
    total,
    totalPages,
    currencyRates: { USD = 0 },
  } = state.persistedMainReducer;
  const favorites: Product[] = state.persistedAuthReducer.user.favorites;
  const favoritesList = favorites.map((product) => product._id);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const sortValue: sortValueType =
    (searchParams.get('sortValue') as sortValueType) || 'default';

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
      productsData = productsData.filter(
        (product) => product.category?.name === category,
      );
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
        }),
      );
    }
  }, [dispatch, page, query, category, isFavoritePage, sortValue]);

  const handleFavoriteClick = useCallback(
    (id: string) => {
      if (favoritesList.includes(id)) {
        dispatch(deleteFavoriteProductThunk(id));
      } else {
        dispatch(addFavoriteProductThunk(id));
      }
    },
    [dispatch, favoritesList],
  );

  // ref to store quantities
  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleCartClick = useCallback(
    (id: string, productName: string) => {
      if (quantities[id] > 0) {
        dispatch(
          addProductToCartThunk({
            productId: id,
            quantity: quantities[id],
          }),
        )
          .unwrap()
          .then(() => {
            toast.success(
              `${quantities[id]} шт. - ${productName} додано в кошик`,
            );
          });
        setQuantities((prev) => ({ ...prev, [id]: 0 }));
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
        setQuantities((prev) => ({ ...prev, [id]: 0 }));
      }
    },
    [dispatch, quantities, setQuantities],
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
      _id: product._id,
      priceUahCol: Math.ceil(product.price * USD),
      product,
    }));
  }, [productsData, USD]);

  const columns = useMemo<Column<ShopTableRow>[]>(
    () => [
      {
        Header: 'Артикль',
        accessor: 'codeCol', // accessor is the "key" in the data
      },
      {
        Header: (
          <p className="inline-flex items-center gap-2">
            Назва <MousePointerClick className="text-gray-400" />
          </p>
        ),
        accessor: 'nameCol',
        Cell: ({ row }) => (
          <button
            className="min-w-[250px] text-left transition-colors hover:text-blue-500"
            onClick={() => {
              setSelectedProduct(row.original.product);
              logProductClick(row.original.product._id);
              openModal();
            }}
          >
            {row.original.nameCol}
          </button>
        ),
      },
      {
        Header: (
          <p className="inline-flex items-center gap-1">
            Фото <SquareMousePointer className="text-gray-400" size={14} />
          </p>
        ),
        accessor: 'photoCol',
        Cell: ({ row }) => {
          return (
            <Image
              src={`${process.env.NEXT_PUBLIC_API}${row.original.photoCol}`}
              alt={row.original.nameCol}
              width={40}
              height={40}
              className="mx-auto h-11 w-11"
              loading="lazy"
              onMouseEnter={(e) => {
                const img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = `<img src="${process.env.NEXT_PUBLIC_API}${row.original.photoCol}" alt="${row.original.nameCol}" />`;
                img.style.top = `${e.clientY + 20}px`;
                img.style.left = `${e.clientX + 20}px`;
                img.classList.remove('hidden');
              }}
              onMouseOut={() => {
                const img = document.getElementById('image') as HTMLDivElement;
                img.innerHTML = '';
                img.classList.add('hidden');
              }}
            />
          );
        },
      },
      {
        Header: 'Улюблене',
        accessor: 'favoriteCol',
        Cell: ({ row }) => (
          <button
            onClick={() => handleFavoriteClick(row.original._id)}
            data-favorite={row.original._id}
            className={clsx(
              'px-2 py-1 text-white',
              favoritesList.includes(row.original._id)
                ? 'fill-orange-500 stroke-black'
                : 'fill-white stroke-black',
            )}
          >
            <Heart className="fill-inherit stroke-inherit stroke-1" size={30} />
          </button>
        ),
      },
      {
        Header: 'Ціна($)',
        accessor: 'priceCol',
      },
      {
        Header: 'Ціна(грн)',
        accessor: 'priceUahCol',
      },
      {
        Header: 'РРЦ(грн)',
        accessor: 'rrcCol',
      },
      {
        Header: 'К-сть',
        id: 'quantityCol',
        Cell: ({ row }) => (
          <input
            name={row.original._id}
            type="number"
            className="h-8 w-[70px] rounded-md p-1 text-center"
            onBlur={(e) => {
              handleQuantityChange(row.original._id, parseInt(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget;
                handleQuantityChange(row.original._id, parseInt(input.value));
                handleCartClick(row.original._id, row.original.nameCol);
              }
            }}
            defaultValue={quantities[row.original._id] || 0}
            placeholder="0"
          />
        ),
      },
      {
        Header: 'Кошик',
        id: 'cartCol',
        Cell: ({ row }) => (
          <button
            className="px-2 py-1 text-white transition-transform duration-200 hover:scale-110"
            onClick={() =>
              handleCartClick(row.original._id, row.original.nameCol)
            }
          >
            <Icon
              icon="cart"
              className="h-9 w-9 fill-black hover:fill-orange-500"
            />
          </button>
        ),
      },
    ],

    [
      favoritesList,
      handleCartClick,
      handleFavoriteClick,
      logProductClick,
      quantities,
    ],
  );

  const totalPage = isFavoritePage
    ? Math.ceil(favorites.length / 10)
    : totalPages;

  return (
    <>
      {products.length === 0 ? (
        <div className="pt-10">
          <TextPlaceholder
            title="Не знайдено 🥲"
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
            <FiltersBlock listType="partner" />
            <div
              className={`${state.persistedMainReducer.shopView === 'table' && 'max-h-[75vh] overflow-auto'}`}
            >
              {state.persistedMainReducer.shopView === 'table' ? (
                <Table<ShopTableRow> columns={columns} data={data} />
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

          <ModalProduct
            product={selectedProduct}
            closeModal={closeModal}
            isOpen={isModalOpen}
          />
        </>
      )}
    </>
  );
};

export default ShopTable;
