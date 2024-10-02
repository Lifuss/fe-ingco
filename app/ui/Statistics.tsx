'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CategoryPieChart from './diagrams/PieChart';
import { Button } from './buttons/button';

const getLastWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const Statistics = () => {
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([getLastWeekDate(), new Date()]);
  const [startDate, endDate] = dateRange;

  const handleSubmit = () => {
    if (startDate && endDate) {
      console.log(
        `Період вибору: з ${startDate.toLocaleDateString('uk-UA')} по ${endDate.toLocaleDateString('uk-UA')}`,
      );
    }
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-3 flex justify-end gap-3">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update as [Date, Date])}
          dateFormat="dd.MM.yyyy"
          placeholderText="Виберіть діапазон дат"
          className="w-[250px] text-lg"
        />
        <Button className="text-white" onClick={handleSubmit}>
          Показати статистику
        </Button>
      </div>
      <section>
        <CategoryPieChart dateRange={dateRange} />
      </section>
    </div>
  );
};

export default Statistics;
