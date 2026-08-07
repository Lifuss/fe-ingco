'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

export interface SearchableSelectOption {
  id: string | number;
  label: string;
  sublabel?: string;
  isAction?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | number | null | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Оберіть...',
  emptyText = 'Нічого не знайдено',
  className = '',
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Currently selected option object
  const selectedOption = useMemo(() => {
    if (value === null || value === undefined || value === '') return null;
    return options.find((opt) => String(opt.id) === String(value)) || null;
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(q);
      const sublabelMatch = opt.sublabel ? opt.sublabel.toLowerCase().includes(q) : false;
      return labelMatch || sublabelMatch || opt.isAction;
    });
  }, [options, query]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionId: string | number) => {
    onChange(optionId);
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      setQuery('');
    } else {
      setIsOpen(true);
      setHighlightedIndex(0);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setQuery('');
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Box */}
      <div
        onClick={toggleDropdown}
        className={`flex min-h-[42px] w-full items-center justify-between gap-2 rounded-lg border bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold transition-all ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${
          isOpen
            ? 'border-amber-500 bg-white shadow-sm ring-2 ring-amber-500/20'
            : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        <div className="flex flex-1 items-center truncate pr-1">
          {selectedOption ? (
            <span
              className={`truncate ${
                selectedOption.isAction
                  ? 'font-bold text-amber-700'
                  : 'font-semibold text-neutral-800'
              }`}
            >
              {selectedOption.label}
              {selectedOption.sublabel && (
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  ({selectedOption.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="font-normal text-neutral-400">{placeholder}</span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 text-neutral-400">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
              title="Очистити"
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

      {/* Dropdown Options Popup */}
      {isOpen && !disabled && (
        <div className="absolute right-0 left-0 z-50 mt-1 max-h-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl transition-all">
          {/* Search Input Box */}
          <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/70 px-3 py-2">
            <Search size={14} className="shrink-0 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Пошук..."
              className="w-full border-none bg-transparent p-0 text-xs font-medium text-neutral-800 placeholder-neutral-400 outline-none focus:ring-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-0.5 text-neutral-400 hover:text-neutral-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List Options */}
          <div ref={listRef} className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs font-semibold text-neutral-400">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = selectedOption && String(selectedOption.id) === String(opt.id);
                const isHighlighted = index === highlightedIndex;

                if (opt.isAction) {
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(opt.id)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-lg border-t border-neutral-100 px-3 py-2 text-left text-xs font-bold transition-colors ${
                        isHighlighted
                          ? 'bg-amber-500/10 text-amber-900'
                          : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-amber-50 font-bold text-amber-900'
                        : isHighlighted
                          ? 'bg-neutral-100 text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-2">
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
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
