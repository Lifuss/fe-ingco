'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export interface MultiSelectOption {
  id: number | string;
  label: string;
  sublabel?: string;
  depth?: number;
}

interface MultiSelectAutocompleteProps {
  options: MultiSelectOption[];
  selectedIds: (number | string)[];
  onChange: (newSelectedIds: (number | string)[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export default function MultiSelectAutocomplete({
  options,
  selectedIds,
  onChange,
  placeholder = 'Введіть назву для пошуку...',
  emptyText = 'Нічого не знайдено',
  className = '',
}: MultiSelectAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter unselected options based on query
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((option) => {
      const matchesSearch =
        !q ||
        option.label.toLowerCase().includes(q) ||
        (option.sublabel && option.sublabel.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [options, query]);

  // Selected options array
  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(selectedIds.map(String));
    return options.filter((opt) => selectedSet.has(String(opt.id)));
  }, [options, selectedIds]);

  const handleSelect = (optionId: number | string) => {
    if (selectedIds.map(String).includes(String(optionId))) {
      onChange(selectedIds.filter((id) => String(id) !== String(optionId)));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const handleRemove = (e: React.MouseEvent, optionId: number | string) => {
    e.stopPropagation();
    onChange(selectedIds.filter((id) => String(id) !== String(optionId)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && query === '' && selectedIds.length > 0) {
      // Remove last tag on backspace if search query is empty
      const lastId = selectedIds[selectedIds.length - 1];
      onChange(selectedIds.filter((id) => String(id) !== String(lastId)));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search & Badges Box */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex max-h-[140px] min-h-[44px] w-full cursor-text flex-wrap items-center gap-1.5 overflow-y-auto rounded-xl border bg-[#FAFAFF] px-3 py-2 text-sm transition-all ${
          isOpen
            ? 'border-amber-500 bg-white shadow-sm ring-2 ring-amber-500/20'
            : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        {/* Render Badges */}
        {selectedOptions.map((opt) => (
          <span
            key={opt.id}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-900 transition-colors select-none hover:bg-amber-500/20"
          >
            <span>{opt.label}</span>
            {opt.sublabel && (
              <span className="text-[10px] font-normal text-amber-700">({opt.sublabel})</span>
            )}
            <button
              type="button"
              onClick={(e) => handleRemove(e, opt.id)}
              className="ml-0.5 rounded p-0.5 text-amber-700 hover:bg-amber-500/30 hover:text-amber-950 focus:outline-none"
              title="Видалити"
            >
              <X size={12} className="stroke-[2.5]" />
            </button>
          </span>
        ))}

        {/* Input */}
        <div className="flex min-w-[120px] flex-1 items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedIds.length === 0 ? placeholder : ''}
            className="w-full border-none bg-transparent p-0 text-sm font-medium text-neutral-800 placeholder-neutral-400 outline-none focus:ring-0"
          />
        </div>

        {/* Icon Trigger & Clear All */}
        <div className="flex shrink-0 items-center gap-2 text-neutral-400">
          {selectedOptions.length > 5 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline"
              title="Очистити всі обрані"
            >
              Очистити всі ({selectedOptions.length})
            </button>
          )}
          {query && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuery('');
              }}
              className="p-0.5 hover:text-neutral-600"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl transition-all">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs font-semibold text-neutral-400">
              {emptyText}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredOptions.map((opt) => {
                const isSelected = selectedIds.map(String).includes(String(opt.id));
                const depthPadding = opt.depth ? `${opt.depth * 14}px` : '0px';

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-amber-50 font-bold text-amber-900'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <div
                      style={{ paddingLeft: depthPadding }}
                      className="flex items-center gap-1.5 truncate pr-2"
                    >
                      {opt.depth && opt.depth > 0 ? (
                        <span className="font-mono text-neutral-400">└─</span>
                      ) : null}
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="font-mono text-[10px] text-neutral-400">
                          ({opt.sublabel})
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={14} className="shrink-0 stroke-[2.5] text-amber-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
