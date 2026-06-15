'use client';

import React from 'react';
import { ShieldCheck, Truck, Store } from 'lucide-react';

export default function TrustRibbon() {
  const items = [
    {
      icon: <ShieldCheck size={24} className="text-primary-500" />,
      title: 'Офіційна гарантія',
      description: 'Гарантійне обслуговування до 24 місяців.',
    },
    {
      icon: <Truck size={24} className="text-primary-500" />,
      title: 'Відправка в той же день',
      description: 'При замовленні до 15:00.',
    },
    {
      icon: <Store size={24} className="text-primary-500" />,
      title: 'Мережа магазинів',
      description: 'Можливість самовивозу та тестування інструменту.',
    },
  ];

  return (
    <section className="relative z-10 -mt-8 w-full px-5 pb-4 md:-mt-12 md:px-[60px]">
      <div className="grid grid-cols-1 gap-4 divide-y divide-[#E5E3DD] rounded-lg border border-[#E5E3DD] bg-white p-4 shadow-sm md:grid-cols-3 md:gap-0 md:divide-x md:divide-y-0 md:px-6 md:py-3.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-2 py-2 transition-all duration-300 hover:translate-y-[-2px] md:px-6"
          >
            {/* Icon Container with semantic primary soft bg */}
            <div className="bg-primary-50 border-primary-200/50 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border">
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-sm leading-tight font-semibold text-neutral-800 md:text-base">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-neutral-500 md:text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
