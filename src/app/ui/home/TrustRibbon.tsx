'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, Truck, Store } from 'lucide-react';

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
    <section className="relative z-10 w-full px-5 md:px-[60px] -mt-8 md:-mt-12 pb-4">
      <div className="bg-white border border-[#E5E3DD] rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E3DD] p-4 md:py-3.5 md:px-6 gap-4 md:gap-0">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-2 md:px-6 py-2 transition-all duration-300 hover:translate-y-[-2px]"
          >
            {/* Icon Container with semantic primary soft bg */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 border border-primary-200/50 shrink-0">
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h3 className="font-display font-semibold text-neutral-800 text-sm md:text-base leading-tight">
                {item.title}
              </h3>
              <p className="font-sans text-neutral-500 text-xs md:text-sm">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
