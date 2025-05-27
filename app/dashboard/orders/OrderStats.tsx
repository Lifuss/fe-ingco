'use client';
import React from 'react';
import { OrderStatusEnum } from '@/lib/types';

const OrderStats = ({
  dataToStats,
}: {
  dataToStats: Record<OrderStatusEnum, number>;
}) => {
  return (
    <ul className="grid w-full grid-cols-3 gap-x-2 gap-y-[2px]">
      {Object.entries(dataToStats).map(([status, count]) => (
        <li
          key={status}
          className="rounded-md border-2 border-gray-300 p-1 text-xs"
        >
          <p className="whitespace-nowrap">
            {status}: {count}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default OrderStats;
