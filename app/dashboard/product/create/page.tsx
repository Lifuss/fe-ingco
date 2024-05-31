'use client';
import { createProductThunk } from '@/lib/appState/dashboard/operations';
import { fetchCategoriesThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    dispatch(createProductThunk(formData))
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
      <div className="absolute left-10 top-10">
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-blue-300 p-2 text-lg transition-colors hover:bg-blue-500"
        >
          Назад
        </button>
      </div>
      <h1 className="mb-20 text-center text-4xl">Створення продукту</h1>

      <form
        className="flex flex-col items-center text-lg"
        onSubmit={handleSubmit}
      >
        <label>
          Найменування
          <input
            name="name"
            required
            placeholder="Найменування"
            className="mb-10 block w-[400px] rounded-lg p-2 text-lg focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </label>
        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <label className="mb-4">
              Фото
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-[150px] rounded-md p-2"
                onChange={handleImageChange}
                required
              />
              <Image
                src={imageUrl}
                className="block rounded-md"
                alt="product image"
                width="200"
                height="200"
              />
            </label>

            <label>
              Опис товару
              <textarea
                name="description"
                placeholder="Опис товару"
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
                placeholder="Артикль"
                className="block rounded-lg focus:bg-blue-100"
              />
            </label>

            <label>
              Категорія
              <select name="category" className="block rounded-lg">
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
                name="priceRetailRecommendation"
                placeholder="РРЦ грн"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              К-сть в наявності
              <input
                type="number"
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