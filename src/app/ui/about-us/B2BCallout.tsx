import React from 'react';
import Link from 'next/link';
import { Handshake, ArrowRight } from 'lucide-react';

const B2BCallout = () => {
  return (
    <section className="mb-14 px-5 md:mb-20 md:px-[60px]" aria-labelledby="b2b-heading">
      <div className="mx-auto max-w-[1440px] rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 p-8 shadow-sm md:p-12">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Handshake size={28} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                B2B & Дистриб&apos;юція
              </span>
              <h2
                id="b2b-heading"
                className="text-xl font-bold text-neutral-900 md:text-2xl lg:text-3xl"
              >
                Бажаєте стати партнером або дилером INGCO?
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
                Пропонуємо спеціальні оптові ціни, програми дропшипінгу, швидке відвантаження зі
                складу в Україні та повний сервісний супровід вашого бізнесу.
              </p>
            </div>
          </div>

          <Link
            href="/about-us/partnership"
            className="group flex shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <span>Умови партнерства</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default B2BCallout;
