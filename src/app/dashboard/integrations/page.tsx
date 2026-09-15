import React from 'react';
import type { Metadata } from 'next';
import { Share2, Radio, CheckCircle } from 'lucide-react';
import MonomarketCard from './cards/MonomarketCard';
import PromUaCard from './cards/PromUaCard';
import GoogleMerchantCard from './cards/GoogleMerchantCard';

export const metadata: Metadata = {
  title: 'Інтеграції та товарні фіди | Dashboard INGCO',
  description: 'Управління зовнішніми товарними фідами та каналами збуту',
};

export default function IntegrationsPage() {
  return (
    <div className="w-full max-w-full space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-neutral-950 shadow-sm">
              <Share2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl">
              Інтеграції та товарні фіди
            </h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Централізований хаб для керування підключеними маркетплейсами, онлайн-фідами та
            автоматичною синхронізацією каталогу
          </p>
        </div>

        {/* Quick summary status badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
            <span>3 підключені сервіси</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs">
            <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
            <span>Кешування фідів: 180 хв</span>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* monoмаркет Card */}
        <MonomarketCard />

        {/* Prom.ua Card */}
        <PromUaCard />

        {/* Google Merchant Center Card (Full width or span 2) */}
        <div className="xl:col-span-2">
          <GoogleMerchantCard />
        </div>
      </div>
    </div>
  );
}
