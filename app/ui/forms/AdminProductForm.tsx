import Image from 'next/image';
import ToBackButton from '../ToBackButton';
import { ChangeEvent, FormEvent } from 'react';
import { Product } from '@/lib/types';

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
              Ключові слова через кому (SEO)
              <input
                type="text"
                name="seoKeywords"
                defaultValue={product?.seoKeywords}
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
                      <svg
                        className="cursor-pointer fill-[#667085] transition-colors
            hover:fill-black"
                        width="20"
                        height="20"
                        viewBox="0 0 27 28"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.833 4.99996V5.33329H16.1663V4.99996C16.1663 4.29272 15.8854 3.61444 15.3853 3.11434C14.8852 2.61424 14.2069 2.33329 13.4997 2.33329C12.7924 2.33329 12.1142 2.61424 11.6141 3.11434C11.114 3.61444 10.833 4.29272 10.833 4.99996ZM9.16634 5.33329V4.99996C9.16634 3.85069 9.62289 2.74849 10.4355 1.93583C11.2482 1.12317 12.3504 0.666626 13.4997 0.666626C14.6489 0.666626 15.7511 1.12317 16.5638 1.93583C17.3765 2.74849 17.833 3.85069 17.833 4.99996V5.33329H25.333C25.554 5.33329 25.766 5.42109 25.9223 5.57737C26.0785 5.73365 26.1663 5.94561 26.1663 6.16663C26.1663 6.38764 26.0785 6.5996 25.9223 6.75588C25.766 6.91216 25.554 6.99996 25.333 6.99996H23.3883L22.055 22.904C21.9537 24.1117 21.4024 25.2373 20.5102 26.0577C19.6181 26.8781 18.4503 27.3334 17.2383 27.3333H9.76101C8.54914 27.3332 7.38152 26.8778 6.48954 26.0575C5.59756 25.2371 5.0463 24.1116 4.94501 22.904L3.61167 6.99996H1.66634C1.44533 6.99996 1.23337 6.91216 1.07709 6.75588C0.920805 6.5996 0.833008 6.38764 0.833008 6.16663C0.833008 5.94561 0.920805 5.73365 1.07709 5.57737C1.23337 5.42109 1.44533 5.33329 1.66634 5.33329H9.16634ZM6.60567 22.7646C6.67204 23.5558 7.03321 24.2933 7.61761 24.8307C8.20202 25.3682 8.96702 25.6666 9.76101 25.6666H17.2383C18.0324 25.6667 18.7976 25.3685 19.3822 24.831C19.9667 24.2935 20.328 23.556 20.3943 22.7646L21.7157 6.99996H5.28367L6.60567 22.7646ZM11.833 11.5C11.833 11.3905 11.8115 11.2822 11.7696 11.1811C11.7277 11.08 11.6663 10.9881 11.5889 10.9107C11.5115 10.8333 11.4197 10.7719 11.3186 10.7301C11.2175 10.6882 11.1091 10.6666 10.9997 10.6666C10.8902 10.6666 10.7819 10.6882 10.6808 10.7301C10.5797 10.7719 10.4878 10.8333 10.4104 10.9107C10.333 10.9881 10.2717 11.08 10.2298 11.1811C10.1879 11.2822 10.1663 11.3905 10.1663 11.5V21.1666C10.1663 21.2761 10.1879 21.3844 10.2298 21.4855C10.2717 21.5866 10.333 21.6785 10.4104 21.7559C10.4878 21.8333 10.5797 21.8946 10.6808 21.9365C10.7819 21.9784 10.8902 22 10.9997 22C11.1091 22 11.2175 21.9784 11.3186 21.9365C11.4197 21.8946 11.5115 21.8333 11.5889 21.7559C11.6663 21.6785 11.7277 21.5866 11.7696 21.4855C11.8115 21.3844 11.833 21.2761 11.833 21.1666V11.5ZM15.9997 10.6666C16.4597 10.6666 16.833 11.04 16.833 11.5V21.1666C16.833 21.3876 16.7452 21.5996 16.5889 21.7559C16.4327 21.9122 16.2207 22 15.9997 22C15.7787 22 15.5667 21.9122 15.4104 21.7559C15.2541 21.5996 15.1663 21.3876 15.1663 21.1666V11.5C15.1663 11.04 15.5397 10.6666 15.9997 10.6666Z" />
                      </svg>
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
                defaultValue={product?.category._id}
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
              <span className="text-red-600">*</span>РРЦ
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
              РРЦ зі знижкою
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
