'use client';

import React, { useState } from 'react';
import { Store, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';
import FeedCopyLink from '../FeedCopyLink';

const MONO_WHITELIST_IPS = [
  '13.53.52.37',
  '16.16.42.238',
  '13.50.222.109',
  '16.171.78.185',
  '13.48.150.45',
];

export default function MonomarketCard() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-xs">
              <Store className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">monoмаркет</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Готовий до підключення
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Офіційний маркетплейс від monobank. Підтримує роздільну схему контенту та динамічних
                цін.
              </p>
            </div>
          </div>

          <a
            href="https://seller.monomarket.ua/help"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Довідка mono
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </a>
        </div>

        {/* Feed URLs */}
        <div className="mt-5 flex flex-col gap-3">
          <FeedCopyLink
            title="Контентний XML-фід (Товари)"
            format="XML"
            path="/api/feed/monomarket"
            recommendedFrequency="кожні 3 години (180 хв)"
            description="Створення та модерація карток: назви, описи (CDATA), галерея фото, габарити (weight, height, width, length), вендор-код та баркод."
          />

          <FeedCopyLink
            title="Динамічний JSON-фід (Ціни та залишки)"
            format="JSON"
            path="/api/feed/monomarket/prices"
            recommendedFrequency="кожні 3 години (180 хв)"
            description="Оновлення цін, акцій (rrcSale), наявності (stock) та умов гарантії. Зв'язується через спільний code (артикул товару)."
          />
        </div>
      </div>

      {/* Accordion / Info Box */}
      <div className="mt-5 border-t border-neutral-100 pt-4">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-4 w-4 text-amber-500" />
            Технічні вимоги та IP Whitelist для контенту
          </span>
          {showDetails ? (
            <ChevronUp className="h-4 w-4 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          )}
        </button>

        {showDetails && (
          <div className="mt-3 rounded-xl border border-amber-200/60 bg-amber-50/50 p-3.5 text-xs text-neutral-700">
            <div className="mb-2 font-bold text-neutral-900">
              IP-адреси серверів monoмаркет для завантаження фотографій:
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {MONO_WHITELIST_IPS.map((ip) => (
                <span
                  key={ip}
                  className="rounded-md border border-amber-200 bg-white px-2 py-0.5 text-neutral-800 shadow-2xs"
                >
                  {ip}
                </span>
              ))}
            </div>

            <ul className="mt-3 list-disc space-y-1 pl-4 text-neutral-600">
              <li>
                <strong>Фільтрація:</strong> У фід потрапляють тільки нові товари в наявності
                (залишок &gt; 0) з наявним штрихкодом.
              </li>
              <li>
                <strong>Гарантія:</strong> Автоматично передається як виробнича гарантія (в
                місяцях).
              </li>
              <li>
                <strong>Розстрочка:</strong> По замовчуванню встановлено «Покупку частинами» до 6
                платежів.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
