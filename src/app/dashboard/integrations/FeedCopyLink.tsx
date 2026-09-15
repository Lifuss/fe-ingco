'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

interface FeedCopyLinkProps {
  title: string;
  description?: string;
  format: 'XML' | 'JSON' | 'XLSX';
  path: string;
  recommendedFrequency?: string;
}

const FORMAT_BADGE_STYLES: Record<string, string> = {
  XML: 'bg-amber-100 text-amber-800 border-amber-300',
  JSON: 'bg-blue-100 text-blue-800 border-blue-300',
  XLSX: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export default function FeedCopyLink({
  title,
  description,
  format,
  path,
  recommendedFrequency,
}: FeedCopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const origin = isClient && typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = origin ? `${origin}${path}` : path;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success(`Посилання скопійовано: ${title}`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Не вдалося скопіювати посилання');
    }
  };

  const badgeStyle =
    FORMAT_BADGE_STYLES[format] || 'bg-neutral-100 text-neutral-800 border-neutral-300';

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${badgeStyle}`}
          >
            {format}
          </span>
          <span className="text-sm font-semibold text-neutral-900">{title}</span>
        </div>

        {recommendedFrequency && (
          <span className="text-xs text-neutral-400">Оновлення: {recommendedFrequency}</span>
        )}
      </div>

      {description && <p className="text-xs text-neutral-500">{description}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          title="Натисніть, щоб скопіювати посилання"
          className="group flex flex-1 items-center justify-between gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left font-mono text-xs text-neutral-700 shadow-2xs transition-all hover:border-amber-400 hover:bg-amber-50/30 active:scale-[0.99]"
        >
          <span className="truncate select-all">{fullUrl}</span>
          <span className="flex shrink-0 items-center gap-1 font-sans text-xs font-medium text-neutral-500 group-hover:text-amber-600">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-600">Скопійовано!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>Скопіювати</span>
              </>
            )}
          </span>
        </button>

        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          title="Відкрити фід у новій вкладці"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-2xs transition-all hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
