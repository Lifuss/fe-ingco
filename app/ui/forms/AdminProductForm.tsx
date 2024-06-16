import Image from 'next/image';
import ToBackButton from '../ToBackButton';
import { ChangeEvent, FormEvent } from 'react';

const questionSvg = (
  <span>
    <svg height="20px" width="20px" viewBox="0 0 302.967 302.967">
      <g>
        <g>
          <g>
            <path
              style={{ fill: '#010002' }}
              d="M151.483,302.967C67.956,302.967,0,235.017,0,151.483S67.956,0,151.483,0
				s151.483,67.956,151.483,151.483S235.017,302.967,151.483,302.967z M151.483,24.416c-70.066,0-127.067,57.001-127.067,127.067
				s57.001,127.067,127.067,127.067s127.067-57.001,127.067-127.067S221.555,24.416,151.483,24.416z"
            />
          </g>
          <g>
            <g>
              <path
                style={{ fill: '#010002' }}
                d="M116.586,118.12c1.795-4.607,4.297-8.588,7.511-11.961c3.225-3.389,7.114-6.016,11.667-7.898
					c4.547-1.904,9.633-2.845,15.262-2.845c7.261,0,13.32,0.995,18.183,2.997c4.857,1.996,8.768,4.482,11.738,7.441
					c2.964,2.97,5.091,6.168,6.369,9.584c1.273,3.432,1.915,6.636,1.915,9.595c0,4.901-0.642,8.947-1.915,12.118
					c-1.278,3.171-2.866,5.88-4.759,8.131c-1.898,2.252-3.987,4.172-6.293,5.755c-2.295,1.588-4.471,3.171-6.516,4.759
					c-2.045,1.583-3.862,3.394-5.445,5.439c-1.588,2.04-2.589,4.601-2.991,7.664v5.831H140.6v-6.908
					c0.305-4.395,1.153-8.072,2.529-11.036c1.382-2.964,2.991-5.499,4.83-7.598c1.844-2.089,3.786-3.911,5.836-5.445
					c2.04-1.539,3.927-3.073,5.673-4.591c1.73-1.545,3.144-3.225,4.221-5.069c1.071-1.833,1.556-4.15,1.452-6.908
					c0-4.705-1.148-8.18-3.454-10.427c-2.295-2.257-5.493-3.378-9.589-3.378c-2.758,0-5.134,0.533-7.131,1.605
					s-3.628,2.513-4.911,4.302c-1.278,1.795-2.225,3.894-2.834,6.288c-0.615,2.415-0.919,4.982-0.919,7.756h-22.55
					C113.85,127.785,114.791,122.732,116.586,118.12z M162.536,183.938v23.616h-24.09v-23.616H162.536z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
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
                required
              />
              <Image
                src={imageUrl || '/placeholder.webp'}
                className="block rounded-md"
                alt="Фото товару"
                width={250}
                height={250}
              />
            </label>

            <label>
              <div className="flex justify-between">
                <div>
                  {/* <span className="text-red-600">*</span> */}
                  <h3 className="inline">Опис товару</h3>
                </div>
                {/* <span
                  className="cursor-help"
                  title="рекомендований формат webp + оптимізація на сайтах по типу squoosh.app (якість зжимання 80-90%)"
                >
                  {questionSvg}
                </span> */}
              </div>
              {/* <span className="text-sm text-gray-400">
                1 хар-ка на рядок (enter або shift+enter)
              </span> */}
              <textarea
                name="description"
                placeholder="Опис товару"
                required
                className="block min-h-[150px] w-full rounded-lg p-2 focus:bg-blue-100"
              />
              {/* <div className="mt-2 w-full text-sm text-gray-400 hover:text-gray-700">
                <p>
                  В картці роздрібного магазину відображається тільки перші 3
                  характеристики і в них обмеження на 25 символів, нижче
                  приклади
                </p>
                <p>
                  Варіант на якому важлива інформація обрізається: <br />
                  <code>
                    Номінальна напруга (В): 220-240 &gt; Номінальна напруга (В):
                    2...
                  </code>
                </p>
                <p>
                  Більш описовий варіант: <br />{' '}
                  <code>
                    Напруга (В): 220-240 (Номінальна) &gt; Напруга (В): 220-240
                    (Н..
                  </code>
                </p>
                <p className="mt-1">
                  *Це не стосується модальних вікон(при кліку на картку) там
                  повний опис без обрізань
                </p>
              </div> */}
            </label>
            <label>
              Ключові слова через кому (SEO)
              <input
                type="text"
                name="seoKeywords"
                placeholder="Ключові слова"
                className="block rounded-lg focus:bg-blue-100"
              />
            </label>
            <label>
              <div className="flex justify-between">
                <div>
                  <span className="text-red-600">*</span>
                  <h3 className="inline">Характеристики</h3>
                </div>
                <span
                  className="cursor-help"
                  title="В картці роздрібного магазину відображається тільки перші 3
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
                <li key={i}>
                  {char.name}: {char.value}
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
            <label htmlFor="enterPrice">
              Прихідна ціна $
              <input
                type="number"
                name="enterPrice"
                step="0.001"
                placeholder="Прихідна ціна"
                className="block rounded-lg focus:bg-blue-100"
              />
            </label>
            <label htmlFor="price">
              <span className="text-red-600">*</span>Ціна $
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
            <label>
              Гарантія(міс)
              <input
                type="number"
                step={1}
                name="warranty"
                className="block rounded-lg focus:bg-blue-100"
                required
                defaultValue={0}
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
