'use client';

import Image from 'next/image';
import NovaPoshtaComponent from '@/app/ui/utils/NovaPoshta';

interface NovaPoshtaDeliveryProps {
  onCityChange: (city: string) => void;
  onWarehouseChange: (warehouse: string) => void;
  cityError?: string;
  warehouseError?: string;
}

export default function NovaPoshtaDelivery({
  onCityChange,
  onWarehouseChange,
  cityError,
  warehouseError,
}: NovaPoshtaDeliveryProps) {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-base font-medium text-neutral-900">Перевізник</h3>
      <div className="mb-2 w-fit rounded-full border border-gray-500 p-2">
        <Image
          src="/icons/Nova_Poshta_2019_ua.svg"
          alt="Nova Poshta"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <NovaPoshtaComponent
        onCityChange={onCityChange}
        onWarehouseChange={onWarehouseChange}
        cityError={cityError}
        warehouseError={warehouseError}
      />
    </div>
  );
}
