import Image from 'next/image';
import ToBackButton from '../ToBackButton';
import { ChangeEvent, FormEvent } from 'react';
import { Product } from '@/lib/types';
import Icon from '../assets/Icon';
import { CircleHelp } from 'lucide-react';

const questionSvg = (
  <span>
    <CircleHelp size={20} className="text-gray-400" />
  </span>
);

type AdminProductFormProps = {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
  characteristics: { name: string; value: string }[];
  setCharacteristics: React.Dispatch<
    React.SetStateAction<{ name: string; value: string }[]>
  >;
  characteristic: { name: string; value: string };
  setCharacteristic: React.Dispatch<
    React.SetStateAction<{ name: string; value: string }>
  >;
  categories: { _id: string; name: string }[];
  isEdit?: boolean;
  product?: Product;
};

const AdminProductForm = ({
  handleSubmit,
  handleImageChange,
  imageUrl,
  characteristics,
  setCharacteristics,
  characteristic,
  setCharacteristic,
  categories,
  isEdit = false,
  product,
}: AdminProductFormProps) => {
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
            defaultValue={product?.name}
            required
            placeholder="Найменування"
            className="mb-4 block w-[500px] rounded-lg p-2 text-lg focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 2xl:mb-10"
          />
        </label>
        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <label className="w-[250px]">
              <div className="flex justify-between">
                <div>
                  <span className="text-red-600">*</span>
                  <h3 className="inline">Фото</h3>
                </div>
                <span
                  className="cursor-help"
                  title="рекомендований формат webp + оптимізація на сайтах по типу squoosh.app (якість зжимання 80-90%)"
                >
                  {questionSvg}
                </span>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full rounded-md p-2"
                onChange={handleImageChange}
              />
              <Image
                src={imageUrl || '/placeholder.webp'}
                className="block rounded-md"
                alt={product?.name || 'Фото товару'}
                width={250}
                height={250}
              />
            </label>

            <label>
              <div className="flex justify-between">
                <div>
                  <h3 className="inline">Опис товару</h3>
                </div>
              </div>
              <textarea
                name="description"
                placeholder="Опис товару"
                defaultValue={product?.description}
                required
                className="block min-h-[150px] w-full rounded-lg p-2 focus:bg-blue-100"
              />
            </label>
            <label>
              <div className="flex justify-between">
                <div>
                  <h3 className="inline">
                    Ключові слова через кому+пробіл (SEO)
                  </h3>
                </div>
                <span
                  className="cursor-help"
                  title="Приклад ключових слів для товару: акумуляторний шуруповерт, шуруповерт P20S, INGCO шуруповерт, шуруповерт з акумулятором 20В, інструмент для закручування шурупів, бездротовий шуруповерт, шуруповерт з зарядним пристроєм, шуруповерт з 2 акумуляторами, шуруповерт для дому, шуруповерт з аксесуарами"
                >
                  {questionSvg}
                </span>
              </div>
              <input
                type="text"
                name="seoKeywords"
                defaultValue={product?.seoKeywords}
                placeholder="Ключові слова"
                className="block w-full rounded-lg focus:bg-blue-100"
              />
            </label>
            <label>
              <div className="flex justify-between">
                <div>
                  <h3 className="inline">Характеристики</h3>
                </div>
                <span
                  className="cursor-help"
                  title="Якщо потрібна суто лиш назва, то в значені хар-ки прописуємо мінус ( - )
                  В картці роздрібного магазину відображається тільки перші 3
                  характеристики і в них обмеження на 25 символів. Варіант на якому важлива інформація обрізається: 'Номінальна напруга (В): 220-240' &gt; 'Номінальна напруга (В): 2...' Більш описовий варіант: 'Напруга (В): 220-240 (Номінальна)' &gt; 'Напруга (В): 220-240 (Н..' *Це не стосується модальних вікон(при кліку на картку) там повний опис без обрізань"
                >
                  {questionSvg}
                </span>
              </div>

              <div className="mb-2 flex">
                <input
                  type="text"
                  name="characteristicName"
                  placeholder="назва хар-ки"
                  className="block w-[140px] rounded-s-md focus:bg-blue-100"
                  value={characteristic.name}
                  onChange={(e) =>
                    setCharacteristic((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  name="characteristicDesc"
                  placeholder="значення хар-ки"
                  className="block rounded-e-md focus:bg-blue-100"
                  value={characteristic.value}
                  onChange={(e) =>
                    setCharacteristic((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setCharacteristics((prev) => [...prev, characteristic]);
                  setCharacteristic({ name: '', value: '' });
                }}
                className="rounded-lg bg-green-400 p-2 transition-colors hover:bg-green-500"
              >
                Додати
              </button>
            </label>
            <ul className="list-disc pl-5">
              {characteristics.map((char, i) => (
                <li key={i} className="relative">
                  {char.name}: {char.value}
                  <div className="absolute right-0 top-0">
                    <button
                      type="button"
                      onClick={() => {
                        setCharacteristics((prev) =>
                          prev.filter((_, index) => index !== i),
                        );
                      }}
                    >
                      <Icon
                        icon="delete"
                        className="h-5 w-5 cursor-pointer fill-nonActive transition-colors hover:fill-red-700"
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              <span className="text-red-600">*</span>Артикль
              <input
                type="text"
                name="article"
                defaultValue={product?.article}
                placeholder="Артикль"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>

            <label>
              Категорія
              <select
                name="category"
                className="block rounded-lg"
                defaultValue={product?.category?._id}
              >
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="enterPrice">
              Прихідна ціна $
              <input
                type="number"
                name="enterPrice"
                step="0.001"
                placeholder="Прихідна ціна"
                className="block rounded-lg focus:bg-blue-100"
                defaultValue={product?.enterPrice}
              />
            </label>
            <label htmlFor="price">
              <span className="text-red-600">*</span>Ціна $
              <input
                type="number"
                name="price"
                step="0.001"
                defaultValue={product?.price}
                placeholder="Ціна $"
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>

            <label>
              <span className="text-red-600">*</span>РРЦ ₴
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
              РРЦ зі знижкою ₴
              <input
                type="number"
                name="rrcSale"
                defaultValue={product?.rrcSale}
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
                defaultValue={product?.countInStock}
                className="block rounded-lg focus:bg-blue-100"
                required
                placeholder="Кількість"
              />
            </label>
            <label>
              Гарантія(міс)
              <input
                type="number"
                step={1}
                name="warranty"
                defaultValue={product?.warranty}
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              Сортування
              <input
                type="number"
                step={1}
                name="sort"
                defaultValue={product?.sort}
                className="block rounded-lg focus:bg-blue-100"
                required
              />
            </label>
            <label>
              Штрихкод
              <input
                type="text"
                name="barcode"
                defaultValue={product?.barcode}
                className="block rounded-lg focus:bg-blue-100"
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

export default AdminProductForm;
