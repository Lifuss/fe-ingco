import ExportButton from '@/app/ui/ExportButton';
import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <section className='mb-10 flex flex-col gap-1'>
      <h1 className="mb-5 text-center text-2xl font-medium col-span-2">Експорт товарів</h1>
      <div className='col-span-1'>
        <h2 className="mb-5 text-center text-xl font-medium">
          Eксель таблиці (.xlsx)
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <ExportButton sheetType="price" title="Прайс" />
            <h2 className="text-center text-xl font-medium">
              Прайс таблиця для візуального ознайомлення
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <ExportButton sheetType="prom" title="Шаблон для prom.ua" />
            <h2 className="text-center text-xl font-medium">
              Таблиці для імпроту для prom.ua
            </h2>
          </div>
        </div>
      </div>

      {/* Delimiter between table and XML feed blocks */}
      <div className="w-full flex justify-center my-4">
        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
      </div>

      <div className='col-span-1'>
        <h2 className="mb-5 text-center text-xl font-medium" title='XML фіди (.xml) оновлюються щодня'>
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
            <h2 className="text-center text-xl font-medium">
              YML(XML) фід для імпорту товарів у prom.ua{' '}
              (<Link
                className='text-blue-500 underline text-sm'
                href="https://support.prom.ua/hc/uk/articles/360004963538-%D0%86%D0%BC%D0%BF%D0%BE%D1%80%D1%82-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-YML-%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82-%D1%84%D0%B0%D0%B9%D0%BB%D1%83"
                target="_blank"
                rel="noopener noreferrer"
              >
                Детальніше про формат
              </Link>)
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
