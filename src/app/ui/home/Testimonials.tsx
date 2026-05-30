'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

interface TestimonialItem {
  id: number;
  name: string;
  city: string;
  rating: number;
  date: string;
  text: string;
  tag: string;
  tagBg: string;
}

export default function Testimonials() {
  const reviews: TestimonialItem[] = [
    {
      id: 1,
      name: 'Олександр К.',
      city: 'Київ',
      rating: 5,
      date: '24.05.2026',
      text: 'Придбав дриль серії Standart для ремонту на балконі та збирання меблів. Інструмент лежить у руці як влитий. Потужності більше ніж достатньо, а ціна взагалі супер. Дуже задоволений покупкою!',
      tag: 'Побутове використання',
      tagBg: 'bg-neutral-100 text-neutral-600',
    },
    {
      id: 2,
      name: 'Дмитро М.',
      city: 'Львів',
      rating: 5,
      date: '18.05.2026',
      text: 'Акумуляторна лінійка P20S — це просто знахідка. Купив один акумулятор на 4Аг та зарядку, а до них вже три каркаси (болгарку, лобзик та шурупокрут). Працюють безвідмовно. Економія шалена!',
      tag: 'Екосистема P20S',
      tagBg: 'bg-amber-50 text-amber-800 border border-amber-200/50',
    },
    {
      id: 3,
      name: 'Сергій В.',
      city: 'Одеса',
      rating: 5,
      date: '10.05.2026',
      text: 'Був скептично налаштований через доступну вартість порівняно з іншими брендами, але офіційна гарантія та можливість забрати з магазину переконали. На місці протестував перфоратор — звір! Рекомендую.',
      tag: 'Професійна серія',
      tagBg: 'bg-primary-50 text-primary-700 border border-primary-100',
    },
  ];

  return (
    <section className="w-full px-5 md:px-[60px] pb-16 flex flex-col gap-8">
      {/* Header Block */}
      <div className="flex justify-between items-end border-b border-[#E5E3DD] pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
            ВІДГУКИ НАШИХ КЛІЄНТІВ
          </h2>
          <p className="font-sans text-neutral-500 text-sm">
            Думки реальних майстрів, які вже працюють інструментом INGCO
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-display font-semibold text-neutral-700 bg-white border border-[#CFCDC6] rounded-md px-4 py-2 text-sm select-none">
          <span className="text-amber-500 font-bold">★ 4.9 / 5</span>
          <span className="text-neutral-400">|</span>
          <span className="text-xs">На основі 1,240 відгуків</span>
        </div>
      </div>

      {/* Grid containing testimonial cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="group flex flex-col justify-between bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-500/20 transition-all duration-500 hover:translate-y-[-4px]"
          >
            {/* Header info inside card */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-neutral-800 text-base flex items-center gap-1.5">
                    {rev.name}
                    <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-green-100">
                      <ShieldCheck size={10} className="stroke-[3]" />
                      Перевірено
                    </span>
                  </span>
                  <span className="font-sans text-xs text-neutral-400">
                    м. {rev.city} • {rev.date}
                  </span>
                </div>

                {/* Tag */}
                <span className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded select-none ${rev.tagBg}`}>
                  {rev.tag}
                </span>
              </div>

              {/* Stars rendering */}
              <div className="flex gap-0.5">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" className="text-amber-500" />
                ))}
              </div>

              {/* Feedback text */}
              <p className="font-sans text-neutral-600 text-sm leading-relaxed italic">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            {/* Subtle bottom line for visual anchor */}
            <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center justify-between text-xs text-neutral-400">
              <span>Придбано офіційно</span>
              <span className="font-display font-semibold text-amber-600 group-hover:text-primary-500 transition-colors">
                INGCO Ukraine
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
