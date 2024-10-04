'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProductClicksPieChart from './diagrams/PieChart';
import { Button } from './buttons/button';
import UserActivityChart from './diagrams/UserActivityChart';

const getLastWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const Statistics = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    getLastWeekDate(),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;

  const [tempDateRange, setTempDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([getLastWeekDate(), new Date()]);
  const [tempStartDate, tempEndDate] = tempDateRange;

  // Підтвердження діапазону дат при натисканні кнопки
  const handleSubmit = () => {
    if (tempStartDate && tempEndDate) {
      setDateRange([tempStartDate, tempEndDate]);
      console.log(
        `Період вибору: з ${tempStartDate.toLocaleDateString('uk-UA')} по ${tempEndDate.toLocaleDateString('uk-UA')}`,
      );
    }
  };

  return (
    <div className="flex flex-col flex-wrap gap-2">
      <div className="flex justify-end gap-3">
        <label className="flex items-center gap-2 text-xl">
          Період
          <DatePicker
            selectsRange
            startDate={tempStartDate}
            endDate={tempEndDate}
            onChange={(update) =>
              setTempDateRange(update as [Date | undefined, Date | undefined])
            }
            dateFormat="dd.MM.yyyy"
            placeholderText="Виберіть діапазон дат"
            className="w-[240px] text-center text-lg"
          />
        </label>
        <Button className="text-white" onClick={handleSubmit}>
          Показати статистику
        </Button>
      </div>
      <div className="border border-gray-200"></div>
      <section>
        <ProductClicksPieChart startDate={startDate} endDate={endDate} />
      </section>
      <section>
        <UserActivityChart endDate={endDate} startDate={startDate} />
      </section>
    </div>
  );
};

export default Statistics;
