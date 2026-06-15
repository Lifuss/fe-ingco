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
    <section className="flex w-full flex-col gap-8 px-5 pb-16 md:px-[60px]">
      {/* Header Block */}
      <div className="flex items-end justify-between border-b border-[#E5E3DD] pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl leading-tight font-bold text-neutral-900 md:text-3xl">
            Популярні категорії
          </h2>
          <p className="font-sans text-sm text-neutral-500">Знайдіть потрібний інструмент швидко</p>
        </div>
        <Link
          href="/?catalog=true"
          className="font-display hover:text-primary-500 hover:border-primary-500 cursor-pointer rounded-md border border-[#CFCDC6] px-4 py-2 text-xs font-semibold text-neutral-700 transition-all duration-300 select-none md:text-sm"
        >
          Всі категорії
        </Link>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-[#E5E3DD]/30 p-6 shadow-sm transition-all duration-500 select-none hover:shadow-md ${cat.span}`}
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
            <div className="relative z-10 flex w-full items-end justify-between gap-4 text-white">
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg leading-tight font-bold transition-colors group-hover:text-amber-400 md:text-xl lg:text-2xl">
                  {cat.title}
                </h3>
                {cat.subtitle && (
                  <p className="max-w-sm font-sans text-xs text-neutral-300 md:text-sm">
                    {cat.subtitle}
                  </p>
                )}
              </div>

              {/* Action arrow button */}
              <div className="group-hover:bg-primary-500 group-hover:border-primary-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:text-white">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
