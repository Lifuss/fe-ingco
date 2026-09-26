import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBasket,
  Handshake,
  ShieldCheck,
  BatteryCharging,
  Award,
  Clock,
} from 'lucide-react';

const stats = [
  {
    icon: Clock,
    value: '15+ років',
    label: 'Світовий досвід бренду',
  },
  {
    icon: BatteryCharging,
    value: '580+ моделей',
    label: 'На єдиному акумуляторі 20V',
  },
  {
    icon: Award,
    value: '50+ країн',
    label: 'Довіряють інструменту INGCO',
  },
  {
    icon: ShieldCheck,
    value: 'До 24 міс.',
    label: 'Офіційна гарантія та сервіс',
  },
];

const Hero = () => {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-6 pb-12 md:px-[60px] md:pt-10 md:pb-16 lg:pb-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        {/* Left Column: Heading & CTAs */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Офіційний імпортер в Україні
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl 2xl:text-6xl">
            Надійний інструмент <span className="text-amber-600">INGCO</span> для будь-яких завдань
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Постачаємо сертифікований електро- та ручний інструмент світового бренду в Україну.
            Прямі поставки із заводу, авторизований сервісний центр та перевірена якість для
            професіоналів і домашніх майстрів.
          </p>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-neutral-900 shadow-sm transition-all hover:bg-amber-400 hover:shadow-md focus:ring-2 focus:ring-amber-500 focus:outline-none sm:w-auto"
            >
              <ShoppingBasket size={20} className="shrink-0" />
              <span>Каталог інструментів</span>
            </Link>

            <Link
              href="/about-us/partnership"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-base font-semibold text-neutral-800 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-md focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:w-auto"
            >
              <Handshake size={20} className="shrink-0 text-amber-600" />
              <span>Умови співпраці</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Showcase & Stats */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg">
            <Image
              src="/homeSlider/hero1.webp"
              width={720}
              height={420}
              alt="Лінійка акумуляторного та ручного інструменту INGCO"
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 text-white">
              <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                Акумуляторна платформа 20V P20S
              </span>
              <p className="text-sm font-medium text-neutral-200">
                Єдиний акумулятор для сотень різних інструментів
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ icon: IconComponent, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-neutral-200/80 bg-white p-3 text-center shadow-xs"
              >
                <IconComponent size={20} className="mb-1 text-amber-500" />
                <span className="text-sm font-bold text-neutral-900 md:text-base">{value}</span>
                <span className="text-[11px] leading-tight text-neutral-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
