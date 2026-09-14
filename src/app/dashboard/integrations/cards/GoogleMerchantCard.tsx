'use client';

import React from 'react';
import { useGetGmcStatusQuery, useSyncGmcProductsMutation } from '@/lib/appState/api/dashboardApi';
import { RefreshCw, CheckCircle2, AlertTriangle, ShoppingBag, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

export default function GoogleMerchantCard() {
  const { data: gmcStatus } = useGetGmcStatusQuery();
  const [syncGmc, { isLoading: gmcSyncLoading }] = useSyncGmcProductsMutation();

  const handleSync = () => {
    syncGmc()
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast.success(`Синхронізацію успішно завершено! Оновлено товарів: ${payload.count}`);
        } else {
          toast.error(`Помилка синхронізації GMC: ${payload.error || 'Невідома помилка'}`);
        }
      })
      .catch((err) => {
        const errorMsg =
          typeof err === 'string'
            ? err
            : err?.message || err?.data?.message || 'Не вдалося виконати запит';
        toast.error(`Помилка підключення: ${errorMsg}`);
      });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Ще не запускалось';
    try {
      return new Date(dateStr).toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-xs">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  Google Merchant Center
                </h3>
                {gmcStatus?.configured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Активно
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Потрібне налаштування
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Автоматична синхронізація каталогу для товарної реклами Google Shopping через Content API v1.
              </p>
            </div>
          </div>

          <a
            href="https://merchants.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            GMC Кабінет
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </a>
        </div>

        {/* Sync trigger and stats */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-neutral-50 p-4 sm:grid-cols-3">
          <div>
            <span className="block text-xs font-medium text-neutral-500">Merchant ID</span>
            <span className="text-sm font-semibold text-neutral-800">
              {gmcStatus?.merchantId || 'Не вказано'}
            </span>
          </div>
          <div>
            <span className="block text-xs font-medium text-neutral-500">Останнє оновлення</span>
            <span className="text-sm font-semibold text-neutral-800">
              {formatDate(gmcStatus?.lastSyncAt ?? null)}
            </span>
          </div>
          <div>
            <span className="block text-xs font-medium text-neutral-500">Оновлено товарів</span>
            <span className="text-sm font-semibold text-neutral-800">
              {gmcStatus?.totalSynced ?? 0} шт.
            </span>
          </div>
        </div>

        {gmcStatus?.lastError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <strong>Помилка останнього виклику:</strong> {gmcStatus.lastError}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-neutral-100 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-500">
            Пряма синхронізація залишків і цін в обліковий запис Google
          </span>

          <button
            type="button"
            onClick={handleSync}
            disabled={gmcSyncLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${gmcSyncLoading ? 'animate-spin' : ''}`} />
            {gmcSyncLoading ? 'Синхронізація...' : 'Синхронізувати зараз'}
          </button>
        </div>
      </div>
    </div>
  );
}
