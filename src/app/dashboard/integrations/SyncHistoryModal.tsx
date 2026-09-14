'use client';

import React from 'react';
import Modal from 'react-modal';
import {
  SyncLogItem,
  SyncServiceType,
  useGetSyncLogsQuery,
} from '@/lib/appState/api/dashboardApi';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';

interface SyncHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: SyncServiceType;
  title?: string;
}

export default function SyncHistoryModal({
  isOpen,
  onClose,
  service = 'GOOGLE_MERCHANT',
  title = 'Історія синхронізацій Google Merchant',
}: SyncHistoryModalProps) {
  const { data: logs = [], isLoading, isFetching, refetch } = useGetSyncLogsQuery(
    { service, limit: 30 },
    { skip: !isOpen },
  );

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (log: SyncLogItem) => {
    switch (log.status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Успішно
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            Частково
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-600/20">
            <XCircle className="h-3.5 w-3.5" />
            Помилка
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            В процесі
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(15, 15, 14, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: '740px',
          maxHeight: '85vh',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '20px',
          padding: '0px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500">
              Журнал останніх запусків та деталі обробки
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 active:scale-98 disabled:opacity-50"
            title="Оновити список"
          >
            {isFetching ? 'Оновлення...' : 'Оновити'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
            <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
            <span className="mt-2 text-xs font-medium">Завантаження журналу...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
            <Clock className="h-9 w-9 stroke-1 text-neutral-300" />
            <p className="mt-2 text-sm font-semibold text-neutral-700">Журнал порожній</p>
            <p className="mt-1 text-xs text-neutral-500">
              Синхронізація ще не запускалася для даного сервісу.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const userName = log.user
                ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.login
                : log.triggeredBy === 'manual'
                  ? 'Вручну'
                  : 'Система';

              return (
                <div
                  key={log.id}
                  className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 transition-all hover:bg-neutral-50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(log)}
                      <span className="flex items-center gap-1 text-xs text-neutral-500">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      {log.durationMs != null && (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-600">
                          <Clock className="h-3 w-3 text-neutral-400" />
                          {(log.durationMs / 1000).toFixed(1)} с
                        </span>
                      )}
                      <span className="rounded-md bg-neutral-200/70 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                        {userName}
                      </span>
                    </div>
                  </div>

                  {/* Statistics counters */}
                  <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                    <div className="text-neutral-600">
                      Всього: <span className="font-bold text-neutral-900">{log.totalItems}</span>
                    </div>
                    <div className="text-emerald-700">
                      Успішно: <span className="font-bold">{log.successItems}</span>
                    </div>
                    {log.failedItems > 0 && (
                      <div className="text-red-600">
                        З помилкою: <span className="font-bold">{log.failedItems}</span>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {log.errorMessage && (
                    <div className="mt-2.5 rounded-lg border border-red-200 bg-red-50/80 p-2.5 text-xs text-red-700">
                      <span className="font-semibold">Помилка: </span>
                      {log.errorMessage}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-6 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Закрити
        </button>
      </div>
    </Modal>
  );
}