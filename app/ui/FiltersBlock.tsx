'use client';
import { setShopView } from '@/lib/appState/main/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import { BetweenVerticalStart, Table2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FilterBlockProps {
  listType: 'partner' | 'retail';
}

export type sortValueType =
  | 'default'
  | 'popular'
  | 'cheep'
  | 'expensive'
  | 'popular'
  | 'name';

const liButtonsContent: { label: string; sortValue: sortValueType }[] = [
  { label: 'за популярністю', sortValue: 'popular' },
  { label: 'від дешевших', sortValue: 'cheep' },
  { label: 'від дорожчих', sortValue: 'expensive' },
  { label: 'за назвою', sortValue: 'name' },
];

const FiltersBlock = ({ listType = 'retail' }: FilterBlockProps) => {
  const { shopView } = useAppSelector((state) => state.persistedMainReducer);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );
  const [sort, setSort] = useState<sortValueType>('default');

  const params = new URLSearchParams(searchParams.toString());
  const getSortValue = params.get('sortValue') as sortValueType;

  useEffect(() => {
    if (getSortValue) setSort(getSortValue);
  }, [getSortValue]);

  const pathType = listType === 'retail' ? '/retail' : '/shop';
  let title = '';
  switch (pathname) {
    case `${pathType}/cart`:
      title = 'Кошик';
      break;
    case `${pathType}/favorites`:
      title = 'Обране';
      break;
    case `${pathType}/history`:
      title = 'Історія замовлень';
      break;
    case pathType:
      title = 'Каталог';
      const categoryId: string | null = searchParams.get('category');
      if (categoryId) {
        title = productsCategories.find((val) => val._id === categoryId)
          ?.name as string;
      }
      break;
    default:
      pathname;
  }

  const handleClickSortButtons = (sortValue: sortValueType) => {
    if (sort === sortValue) {
      setSort('default');
      params.set('sortValue', 'default');
    } else {
      setSort(sortValue);
      params.set('sortValue', sortValue);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-2 flex flex-col flex-wrap justify-end gap-4 md:flex-row md:items-center">
      <h1 className="col-span-3 mb-2 w-full text-center text-3xl">{title}</h1>
      <div className="flex w-full items-start justify-end lg:justify-end lg:gap-4">
        <div className="flex flex-col items-baseline justify-center lg:flex-row">
          <h3 className="mr-2">Сортування:</h3>
          <ul className="flex flex-col md:flex-row ">
            {liButtonsContent.map((item, i) => (
              <li
                key={item.sortValue}
                className={clsx(
                  'h-fit border border-gray-500 stroke-black px-2 py-2 text-center text-xs transition-all hover:scale-105 hover:font-semibold focus:scale-105',
                  i === 0 && 'max-[767px]:rounded-t-xl md:rounded-s-xl',
                  i === liButtonsContent.length - 1 &&
                    'max-[767px]:rounded-b-xl md:rounded-e-xl',
                  sort === item.sortValue && 'bg-orange-300',
                )}
              >
                <button
                  type="button"
                  onClick={() => handleClickSortButtons(item.sortValue)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {listType === 'partner' ? (
          <div className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-end ">
            <h3 className="mr-2 md:mr-0 md:w-full md:text-right lg:mr-2 lg:w-fit">
              Відображення:
            </h3>
            <button
              onClick={() => dispatch(setShopView('table'))}
              className={clsx(
                'border border-gray-500 stroke-black px-2 py-1 transition-transform hover:scale-105 focus:scale-105 max-[767px]:rounded-t-xl md:rounded-s-xl',
                shopView === 'table' && 'bg-orange-300',
              )}
              aria-label="Перемкнути вигляд каталогу на таблицю"
            >
              <Table2 className="stroke-inherit" />
            </button>
            <button
              onClick={() => dispatch(setShopView('list'))}
              className={clsx(
                'border border-gray-500 stroke-black px-2 py-1 transition-transform hover:scale-105 focus:scale-105 max-[767px]:rounded-b-xl md:rounded-e-xl',
                shopView === 'list' && 'bg-orange-300',
              )}
              aria-label="Перемкнути вигляд каталогу на список"
            >
              <BetweenVerticalStart className="stroke-inherit" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FiltersBlock;
