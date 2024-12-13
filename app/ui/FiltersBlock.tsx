'use client';
import { setShopView } from '@/lib/appState/main/slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';
import { BetweenVerticalStart, Table2 } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

interface FilterBlockProps {
  listType: 'partner' | 'retail';
}

const FiltersBlock = ({ listType = 'retail' }: FilterBlockProps) => {
  const { shopView } = useAppSelector((state) => state.persistedMainReducer);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const params = useSearchParams();
  const productsCategories = useAppSelector(
    (state) => state.persistedMainReducer.categories,
  );

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
      const categoryId: string | null = params.get('category');
      if (categoryId) {
        title = productsCategories.find((val) => val._id === categoryId)
          ?.name as string;
      }
      break;
    default:
      pathname;
  }

  const liItemClassName =
    'h-fit  border border-gray-500 stroke-black text-xs md:px-2 md:py-1';
  return (
    <div className="mb-2 flex flex-col items-center justify-end gap-4">
      <h1 className="col-span-3 mb-2 text-center text-3xl md:mr-auto">
        {title}
      </h1>
      <div className="flex flex-col items-baseline justify-center">
        <h3 className="mr-2">Сортування:</h3>
        <ul className="flex">
          <li className="h-fit rounded-s-xl border border-gray-500 stroke-black text-xs md:px-2 md:py-1">
            <button type="button">за популярністю</button>
          </li>
          <li className={liItemClassName}>
            <button type="button">від дешевших</button>
          </li>
          <li className="h-fit  border border-gray-500 stroke-black text-xs md:px-2 md:py-1">
            <button type="button">від дорожчих</button>
          </li>
          <li className="h-fit rounded-e-xl border border-gray-500 stroke-black text-xs md:px-2 md:py-1">
            <button type="button">за назвою</button>
          </li>
        </ul>
      </div>
      {listType === 'partner' ? (
        <div className="flex items-center justify-center">
          <h3 className="mr-2">Відображення:</h3>
          <button
            onClick={() => dispatch(setShopView('table'))}
            className={clsx(
              'rounded-s-xl border border-gray-500 stroke-black px-2 py-1',
              shopView === 'table' ? 'bg-orange-300 stroke-white' : '',
            )}
          >
            <Table2 className="stroke-inherit" />
          </button>
          <button
            onClick={() => dispatch(setShopView('list'))}
            className={clsx(
              'rounded-e-xl border border-gray-500 stroke-black px-2 py-1',
              shopView === 'list' ? 'bg-orange-300 stroke-white' : '',
            )}
          >
            <BetweenVerticalStart className="stroke-inherit" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FiltersBlock;
