'use client';

import React from 'react';
import { ShoppingBag, FileSpreadsheet, ExternalLink, CheckCircle2 } from 'lucide-react';
import FeedCopyLink from '../FeedCopyLink';
import ExportButton from '@/app/ui/buttons/ExportButton';

export default function PromUaCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-xs">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">Prom.ua</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Активно
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Інтеграція з торговельним майданчиком Prom.ua через стандартний YML/XML фід та
                Excel-файли.
              </p>
            </div>
          </div>

          <a
            href="https://support.prom.ua/hc/uk/articles/360004963538"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Довідка Prom
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </a>
        </div>

        {/* XML Feed URL */}
        <div className="mt-5 flex flex-col gap-3">
          <FeedCopyLink
            title="Автоматичний YML (XML) фід"
            format="XML"
            path="/api/feed/prom"
            recommendedFrequency="раз на добу"
            description="Оновлення каталогу, цін та наявності товарів у форматі YML_Catalog для автоматичної синхронізації."
          />
        </div>
      </div>

      {/* Excel manual exports */}
      <div className="mt-5 border-t border-neutral-100 pt-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
          <FileSpreadsheet className="h-4 w-4 text-purple-600" />
          Ручний експорт файлів для імпорту в кабінеті Prom:
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <ExportButton sheetType="prom" title="Завантажити XLSX для Prom.ua" />
            <span className="text-center text-[11px] text-neutral-500">
              Шаблон зі 47 обов’язковими колонками Prom
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <ExportButton sheetType="price" title="Завантажити Прайс-лист" />
            <span className="text-center text-[11px] text-neutral-500">
              Прайс із фотографіями (USD та UAH)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
