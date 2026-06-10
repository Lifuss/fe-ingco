'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_IDS } from '@/lib/constants';
import { useAppSelector } from '@/lib/hooks';

export default function CategoryGrid() {
  const categoriesList = useAppSelector((state) => state.persistedMainReducer.categories) || [];

  const getCategoryIdByName = (name: string, fallback: string) => {
    const matched = categoriesList.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return matched ? String(matched.id) : fallback;
  };

  const categories = [
    {
      id: 1,
      title: 'Акумуляторний інструмент',
      subtitle: 'Один акумулятор для понад 150 інструментів',
      image: '/categories/accum.webp',
      href: `/?category=${getCategoryIdByName('Акумуляторний інструмент', CATEGORY_IDS.BATTERY_TOOL)}`,
      span: 'lg:col-span-2 lg:row-span-2 h-[350px] lg:h-[464px]',
    },
    {
      id: 2,
      title: 'Ручний інструмент',
      subtitle: '',
      image: '/categories/handtools.webp',
      href: `/?category=${getCategoryIdByName('Ручний інструмент', CATEGORY_IDS.HAND_TOOL)}`,
      span: 'h-[220px]',
    },
    {
      id: 3,
      title: 'Вимірювальні прилади',
      subtitle: '',
      image: '/categories/measuretools.webp',
      href: '/?query=лазер',
      span: 'h-[220px]',
    },
    {
      id: 4,
      title: 'Мережевий електроінструмент',
      subtitle: '',
      image: '/categories/powertools.webp',
      href: `/?category=${getCategoryIdByName('Мережевий електроінструмент', CATEGORY_IDS.POWER_TOOL)}`,
      span: 'md:col-span-2 h-[220px]',
    },
  ];

  return (
    <section className="w-full px-5 md:px-[60px] pb-16 flex flex-col gap-8">
      {/* Header Block */}
      <div className="flex justify-between items-end border-b border-[#E5E3DD] pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
            Популярні категорії
          </h2>
          <p className="font-sans text-neutral-500 text-sm">
            Знайдіть потрібний інструмент швидко
          </p>
        </div>
        <Link
          href="/?catalog=true"
          className="font-display font-semibold text-neutral-700 hover:text-primary-500 border border-[#CFCDC6] hover:border-primary-500 rounded-md px-4 py-2 transition-all duration-300 text-xs md:text-sm select-none cursor-pointer"
        >
          Всі категорії
        </Link>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#E5E3DD]/30 transition-all duration-500 flex flex-col justify-end p-6 select-none cursor-pointer ${cat.span}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 text-white flex justify-between items-end w-full gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-lg md:text-xl lg:text-2xl leading-tight group-hover:text-amber-400 transition-colors">
                  {cat.title}
                </h3>
                {cat.subtitle && (
                  <p className="font-sans text-neutral-300 text-xs md:text-sm max-w-sm">
                    {cat.subtitle}
                  </p>
                )}
              </div>

              {/* Action arrow button */}
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-300 shrink-0">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
