'use client';
import ToBackButton from '@/app/ui/ToBackButton';
import {
  createProductThunk,
  updateProductThunk,
} from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';

type PageProps = {
  params: {
    productId: string;
  };
};

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const categories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  const product: Product | undefined = useAppSelector((state) =>
    state.persistedMainReducer.products.find(
      (product) => product._id === params.productId,
    ),
  );

  useEffect(() => {
    if (product && product.image) {
      setImageUrl(`${process.env.NEXT_PUBLIC_API}${product.image}`);
    }
  }, [product]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
    if (!product) {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    if (data.image === 'undefined') {
      formData.delete('image');
    }
    dispatch(updateProductThunk({ formData, productId: params.productId }))
      .unwrap()
      .then(() => {
        router.back();
      });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <ToBackButton />
      <h1 className="mb-6 text-center text-4xl 2xl:mb-20">
        Створення продукту
      </h1>

      <form
        className="flex flex-col items-center text-lg"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Найменування</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          id="name"
          placeholder="Найменування"
          className="mb-4 block w-[400px] rounded-lg p-2 text-lg focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 2xl:mb-10"
        />
        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <label>
              Фото
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-[150px] rounded-md p-2"
                onChange={handleImageChange}
              />
              <Image
                src={imageUrl}
                className="block rounded-md"
                alt="Фото товару"
                width="200"
                height="200"
              />
            </label>

            <label>
              Опис товару
              <textarea
                name="description"
                placeholder="Опис товару"
                defaultValue={product?.description}
                required
                className="block min-h-[150px] rounded-lg p-2 focus:bg-blue-100"
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Артикль
              <input
                type="text"
                name="article"
                defaultValue={product?.article}
                placeholder="Артикль"
                className="block rounded-lg focus:bg-blue-100"
              />
            </label>

            <label>
              Категорія
              <select
                name="category"
                className="block rounded-lg"
                defaultValue={product?.category._id}
              >
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="price">
              Ціна
              <input
                type="number"
                step="0.001"
                defaultValue={product?.price}
                name="price"
                placeholder="Ціна $"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>

            <label>
              Ціна опт.
              <input
                type="number"
                defaultValue={product?.priceBulk}
                step="0.001"
                name="priceBulk"
                className="block rounded-lg focus:bg-blue-100"
                placeholder="Ціна опт. $"
                required
              />
            </label>
            <label>
              РРЦ
              <input
                type="number"
                defaultValue={product?.priceRetailRecommendation}
                name="priceRetailRecommendation"
                placeholder="РРЦ грн"
                step="0.1"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              К-сть в наявності
              <input
                type="number"
                defaultValue={product?.countInStock}
                name="countInStock"
                className="block rounded-lg focus:bg-blue-100"
                required
                placeholder="Кількість"
              />
            </label>
            <div className="mt-10 flex flex-col gap-2">
              <button
                type="submit"
                className="rounded-lg bg-green-400 p-2 transition-colors hover:bg-green-500"
              >
                Підтвердити
              </button>
              <button
                className="rounded-lg bg-red-200 p-2 transition-colors hover:bg-red-400"
                type="reset"
              >
                Скинути
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Page;
