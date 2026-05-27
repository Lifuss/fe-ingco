import ExportButton from '@/app/ui/ExportButton';
import Link from 'next/link';
import React from 'react';

const priceColumns = [
  'Код_Товару',
  'Назва_Позиції',
  'Опис',
  'Ціна (USD)',
  'Валюта',
  'РРЦ (UAH)',
  'Валюта РРЦ',
  'Наявність',
  'Кількість',
  'Фото (зображення)',
];

const promColumns = [
  'Код_Товару',
  'Назва_Позиції',
  'Назва_Позиції_укр',
  'Пошукові_запити',
  'Пошукові_запити_укр',
  'Опис',
  'Опис_укр',
  'Тип_товару',
  'Ціна',
  'Валюта',
  'Одиниця_виміру',
  'Мінімальний_обсяг_замовлення',
  'Оптова_ціна',
  'Мінімальне_замовлення_опт',
  'Посилання_зображення',
  'Наявність',
  'Кількість',
  'Номер_групи',
  'Назва_групи',
  'Посилання_підрозділу',
  'Можливість_поставки',
  'Термін_поставки',
  'Спосіб_пакування',
  'Спосіб_пакування_укр',
  'Унікальний_ідентифікатор',
  'Ідентифікатор_товару',
  'Ідентифікатор_підрозділу',
  'Ідентифікатор_групи',
  'Виробник',
  'Країна_виробник',
  'Знижка',
  'ID_групи_різновидів',
  'Особисті_нотатки',
  'Продукт_на_сайті',
  'Термін_дії_знижки_від',
  'Термін_дії_знижки_до',
  'Ціна_від',
  'Ярлик',
  'HTML_заголовок',
  'HTML_заголовок_укр',
  'HTML_опис',
  'HTML_опис_укр',
  'Код_маркування_(GTIN)',
  'Номер_пристрою_(MPN)',
  'Вага,кг',
  'Ширина,см',
  'Висота,см',
  'Довжина,см',
  'Де_знаходиться_товар',
];

function ColumnPreview({ columns }: { columns: string[] }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Колонки таблиці ({columns.length})
      </p>
      <div className="flex max-h-36 flex-wrap gap-1 overflow-y-auto">
        {columns.map((col, i) => (
          <span
            key={i}
            className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-xs text-gray-700"
          >
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <section className="mb-10 flex flex-col gap-1">
      <h1 className="col-span-2 mb-5 text-center text-2xl font-medium">
        Експорт товарів
      </h1>
      <div className="col-span-1">
        <h2 className="mb-5 text-center text-xl font-medium">
          Eксель таблиці (.xlsx)
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <ExportButton sheetType="price" title="Прайс" />
            <p className="text-center text-sm text-gray-500">
              Прайс таблиця для візуального ознайомлення
            </p>
            <ColumnPreview columns={priceColumns} />
          </div>
          <div className="flex flex-col gap-2">
            <ExportButton sheetType="prom" title="Шаблон для prom.ua" />
            <p className="text-center text-sm text-gray-500">
              Таблиця для імпорту на prom.ua
            </p>
            <ColumnPreview columns={promColumns} />
          </div>
        </div>
      </div>

      <div className="my-4 flex w-full justify-center">
        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
      </div>

      <div className="col-span-1">
        <h2
          className="mb-5 text-center text-xl font-medium"
          title="XML фіди (.xml) оновлюються щодня"
        >
          XML фіди (оновлюються щодня)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Link
              href="/api/feed/prom"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-orangeLight p-2 text-center text-lg font-medium transition-colors duration-300 ease-in-out hover:bg-orange-400 hover:text-white"
            >
              XML фід для prom.ua
            </Link>
            <p className="text-center text-sm text-gray-500">
              YML(XML) фід для імпорту товарів у prom.ua{' '}
              (
              <Link
                className="text-sm text-blue-500 underline"
                href="https://support.prom.ua/hc/uk/articles/360004963538-%D0%86%D0%BC%D0%BF%D0%BE%D1%80%D1%82-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-YML-%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82-%D1%84%D0%B0%D0%B9%D0%BB%D1%83"
                target="_blank"
                rel="noopener noreferrer"
              >
                Детальніше про формат
              </Link>
              )
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
