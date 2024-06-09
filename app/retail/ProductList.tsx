'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
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

export type rawData = {
  article: string;
  name: string;
  category: string;
  image: string;
  price: string;
  priceRetailRecommendation: string;
  countInStock: number;
  _id: string;
};

// This is a table wrapper component that fetches data from the server and displays it in a table.
const ProductList = ({ isFavoritePage = false }) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState({});

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
    currencyRates: { USD },
  } = state.persistedMainReducer;
  let favorites: Product[] = state.persistedAuthReducer.user.favorites;
  const favoritesList = favorites.map((product) => product._id);

  let page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;
  page = !page || page < 1 ? 1 : page;

  let query = searchParams.get('query') || '';
  let category = searchParams.get('category') || '';

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
      productsData = productsData.filter((product) =>
        product.category.name.toLowerCase().includes(category.toLowerCase()),
      );
    }
    productsData = productsData.slice((page - 1) * 10, page * 10);
  }

  useEffect(() => {
    if (!isFavoritePage) {
      dispatch(fetchMainTableDataThunk({ page, query, category }));
    }
  }, [dispatch, page, query, category, isFavoritePage]);

  function handleFavoriteClick(id: string) {
    if (favoritesList.includes(id)) {
      dispatch(deleteFavoriteProductThunk(id));
    } else {
      dispatch(addFavoriteProductThunk(id));
    }
  }

  // ref to store quantities
  const quantitiesRef = useRef<Record<string, number>>({});
  const handleQuantityChange = (id: string, value: string) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: value };
      quantitiesRef.current = updated; // update ref
      return updated; // update state
    });
  };

  const handleCartClick = (id: string, productName: string) => {
    if (quantitiesRef.current[id] > 0) {
      dispatch(
        addProductToCartThunk({
          productId: id,
          quantity: quantitiesRef.current[id],
        }),
      )
        .unwrap()
        .then(() => {
          toast.success(`${productName} додано в кошик`);
        });
      quantitiesRef.current[id] = 0;
    } else {
      toast.warning('Введіть кількість товару');
    }
  };

  const totalPage = isFavoritePage
    ? Math.ceil(favorites.length / 10)
    : totalPages;

  return (
    <>
      {products.length === 0 ? (
        <div className="grid place-items-center">
          <h2 className="w-1/2 text-center text-3xl">
            По вибраним параметрам товару більше не знайдено
          </h2>
        </div>
      ) : (
        <>
          <div className="relative w-full 2xl:w-4/5">
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

export default ProductList;
