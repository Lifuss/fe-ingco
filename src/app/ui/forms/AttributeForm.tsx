'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface AttributeFormProps {
  handleSubmit: (data: {
    code: string;
    name: string;
    unit?: string;
    options?: string[];
  }) => void;
  defaultValue?: {
    id?: number;
    code: string;
    name: string;
    unit?: string | null;
    options?: string[] | null;
  };
}

const AttributeForm = ({ handleSubmit, defaultValue }: AttributeFormProps) => {
  const [name, setName] = useState(defaultValue?.name || '');
  const [code, setCode] = useState(defaultValue?.code || '');
  const [unit, setUnit] = useState(defaultValue?.unit || '');
  const [options, setOptions] = useState<string[]>(defaultValue?.options || []);
  const [newOption, setNewOption] = useState('');
  const [isManualCode, setIsManualCode] = useState(!!defaultValue?.code);

  const getSlugified = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ\s_]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  };

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    handleSubmit({
      code: code.trim(),
      name: name.trim(),
      unit: unit.trim() || undefined,
      options: options.length > 0 ? options : undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 font-sans min-w-[360px] md:min-w-[450px]">
      <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-100 pb-2.5">
        {defaultValue ? 'Редагувати характеристику' : 'Створити характеристику'}
      </h3>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Назва характеристики *</span>
        <input
          type="text"
          required
          placeholder="Наприклад: Напруга акумулятора"
          value={name}
          onChange={(e) => {
            const newName = e.target.value;
            setName(newName);
            if (!isManualCode && !defaultValue?.code) {
              setCode(getSlugified(newName));
            }
          }}
          className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Унікальний код (slug) *</span>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="battery_voltage"
            value={code}
            disabled={!!defaultValue}
            onChange={(e) => {
              setCode(e.target.value);
              setIsManualCode(true);
            }}
            className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isManualCode && !defaultValue && (
            <button
              type="button"
              onClick={() => {
                setIsManualCode(false);
                setCode(getSlugified(name));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-primary-500 hover:underline font-bold"
            >
              Скинути авто-код
            </button>
          )}
        </div>
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Одиниці виміру (якщо є)</span>
        <input
          type="text"
          placeholder="Наприклад: В, Вт, мм, Ач"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Офіційні значення (Опції)</span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Нове значення (наприклад: 20V)"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOption();
              }
            }}
            className="flex-grow rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
          />
          <button
            type="button"
            onClick={handleAddOption}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3.5 rounded-lg text-sm font-semibold transition-all border border-neutral-200 cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus size={16} />
            <span>Додати</span>
          </button>
        </div>

        {options.length > 0 && (
          <div className="mt-2 border border-neutral-100 rounded-lg p-2.5 bg-neutral-50 max-h-32 overflow-y-auto flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <span
                key={opt}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 text-xs font-bold rounded-lg text-neutral-700 shadow-sm"
              >
                <span>{opt}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-neutral-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-neutral-100">
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer text-sm uppercase tracking-wide"
        >
          Зберегти
        </button>
      </div>
    </form>
  );
};

export default AttributeForm;
