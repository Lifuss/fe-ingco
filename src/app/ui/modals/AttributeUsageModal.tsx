'use client';

import React from 'react';
import Modal from 'react-modal';
import { AlertTriangle, ExternalLink, Package } from 'lucide-react';
import Link from 'next/link';

export type UsedProduct = {
  id: number;
  name: string;
  article: string;
  slug: string;
};

type AttributeUsageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  attributeName: string;
  usageCount: number;
  products: UsedProduct[];
};

export default function AttributeUsageModal({
  isOpen,
  onClose,
  attributeName,
  usageCount,
  products = [],
}: AttributeUsageModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(15, 15, 14, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '95%',
          maxWidth: '640px',
          maxHeight: '85vh',
          backgroundColor: '#FFFDFB',
          border: '1px solid #E5E3DD',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 25px 30px -5px rgb(0 0 0 / 0.15), 0 10px 12px -5px rgb(0 0 0 / 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <div className="flex flex-col h-full font-sans select-none overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-neutral-200/80 shrink-0">
          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-xs">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex flex-col gap-1 pr-6">
            <h3 className="font-display text-xl leading-snug font-bold text-neutral-900">
              Неможливо видалити характеристику
            </h3>
            <p className="text-sm text-neutral-600">
              Характеристика <span className="font-bold text-neutral-900">«{attributeName}»</span>{' '}
              використовується у <span className="font-bold text-amber-700">{usageCount}</span>{' '}
              {usageCount === 1 ? 'товарі' : usageCount < 5 ? 'товарах' : 'товарах'}.
            </p>
          </div>
        </div>

        {/* Subtitle instructions */}
        <div className="py-3 shrink-0">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Список товарів для опрацювання ({products.length} показується):
          </p>
        </div>

        {/* Scrollable list of products */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-1 divide-y divide-neutral-100">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="flex items-center justify-between gap-3 pt-2.5 first:pt-0 group hover:bg-neutral-50 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex shrink-0 items-center justify-center h-9 w-9 rounded-lg bg-neutral-100 border border-neutral-200/60 text-neutral-500">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-neutral-300/80 bg-neutral-100 text-neutral-700">
                      {prod.article}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-800 truncate group-hover:text-neutral-950">
                    {prod.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/${prod.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-2xs"
                  title="Відкрити картку товару на сайті"
                >
                  <span>На сайті</span>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                <Link
                  href={`/dashboard?query=${encodeURIComponent(prod.article)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-xs font-bold text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-2xs"
                  title="Шукати в таблиці адмінки"
                >
                  <span>В CRM</span>
                  <ExternalLink className="h-3.5 w-3.5 text-amber-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-200/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-400">
            Вилучіть або замініть характеристику у цих товарах перед її видаленням.
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-800 shadow-md"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </Modal>
  );
}
