import ExportButton from '@/app/ui/ExportButton';
import React from 'react';

const Page = () => {
  return (
    <>
      <h1 className="mb-5 text-center text-2xl font-medium">
        Експорт ексель таблиці (.xlsx)
      </h1>
      <div className="grid grid-cols-3 gap-3">
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
    </>
  );
};

export default Page;
