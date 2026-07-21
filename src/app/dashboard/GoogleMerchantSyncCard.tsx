'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchGmcStatusThunk, syncGmcProductsThunk } from '@/lib/appState/dashboard/operations';
import { RefreshCw, CheckCircle2, AlertTriangle, ShoppingBag } from 'lucide-react';

export default function GoogleMerchantSyncCard() {
  const dispatch = useAppDispatch();
  const { gmcStatus, gmcSyncLoading } = useAppSelector((state) => state.dashboardSlice);

  useEffect(() => {
    dispatch(fetchGmcStatusThunk());
  }, [dispatch]);

  const handleSync = () => {
    dispatch(syncGmcProductsThunk());
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
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-neutral-900">Google Merchant Center</h3>
              {gmcStatus?.configured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Активно
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Потрібне налаштування `.env`
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              Синхронізація товарного каталогу з рекламою Google Shopping через Merchant API
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={gmcSyncLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${gmcSyncLoading ? 'animate-spin' : ''}`} />
          {gmcSyncLoading ? 'Синхронізація...' : 'Синхронізувати зараз'}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-neutral-50 p-3.5 sm:grid-cols-3">
        <div>
          <span className="block text-xs font-medium text-neutral-500">Merchant ID</span>
          <span className="text-sm font-semibold text-neutral-800">
            {gmcStatus?.merchantId || 'Не вказано'}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-neutral-500">Останнє завантаження</span>
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
  );
}
