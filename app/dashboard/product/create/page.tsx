'use client';
import ToBackButton from '@/app/ui/ToBackButton';
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
      <ToBackButton />
      <h1 className="mb-6 text-center text-4xl 2xl:mb-20">
        Створення продукту
      </h1>

      <form
        className="flex flex-col items-center text-lg"
        onSubmit={handleSubmit}
      >
        <label>
          <span className="text-red-600">*</span>Найменування
          <input
            name="name"
            required
            placeholder="Найменування"
            className="mb-4 block w-[500px] rounded-lg p-2 text-lg focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 2xl:mb-10"
          />
        </label>
        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <label className="w-[250px]">
              <span className="text-red-600">*</span>Фото
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full rounded-md p-2"
                onChange={handleImageChange}
                required
              />
              <div className="relative h-[200px] w-full shrink-0">
                <Image
                  src={imageUrl}
                  className="block rounded-md"
                  alt="Фото товару"
                  layout="fill"
                  objectFit="contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            </label>

            <label>
              <span className="text-red-600">*</span>Опис товару{' '}
              <span className="text-sm text-gray-400">
                1 хар-ка на рядок (enter або shift+enter)
              </span>
              <textarea
                name="description"
                placeholder="Опис товару"
                required
                className="block min-h-[150px] w-full rounded-lg p-2 focus:bg-blue-100"
              />
              <div className="mt-2 w-full text-sm text-gray-400 hover:text-gray-700">
                <p>
                  В картці роздрібного магазину відображається тільки перші 3
                  характеристики і в них обмеження на 25 символів, нижче
                  приклади
                </p>
                <p>
                  Варіант на якому важлива інформація обрізається: <br />{' '}
                  "Номінальна напруга (В): 220-240" &gt; "Номінальна напруга
                  (В): 2...",
                </p>
                <p>
                  Більш описовий варіант: <br /> "Напруга (В): 220-240
                  (Номінальна)" &gt; "Напруга (В): 220-240 (Н.."
                </p>
                <p className="mt-1">
                  *Це не стосується модальних вікон(при кліку на картку) там
                  повний опис без обрізань
                </p>
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              <span className="text-red-600">*</span>Артикль
              <input
                type="text"
                name="article"
                placeholder="Артикль"
                className="block rounded-lg focus:bg-blue-100"
                required
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
              <span className="text-red-600">*</span>Ціна
              <input
                type="number"
                name="price"
                step="0.001"
                placeholder="Ціна $"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              <span className="text-red-600">*</span>РРЦ
              <input
                type="number"
                name="priceRetailRecommendation"
                placeholder="РРЦ грн"
                step="0.1"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              РРЦ зі знижкою
              <input
                type="number"
                name="rrcSale"
                step="0.001"
                className="block rounded-lg focus:bg-blue-100"
                placeholder="Ціна зі знижкою"
              />
            </label>

            <label>
              <span className="text-red-600">*</span>К-сть в наявності
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
