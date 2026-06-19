'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface AttributeFormProps {
  handleSubmit: (data: { code: string; name: string; unit?: string; options?: string[] }) => void;
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
    <form
      onSubmit={onSubmit}
      className="flex min-w-[360px] flex-col gap-4 font-sans md:min-w-[450px]"
    >
      <h3 className="border-b border-neutral-100 pb-2.5 text-lg font-bold text-neutral-800">
        {defaultValue ? 'Редагувати характеристику' : 'Створити характеристику'}
      </h3>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Назва характеристики *
        </span>
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
          className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Унікальний код (slug) *
        </span>
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
            className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          {isManualCode && !defaultValue && (
            <button
              type="button"
              onClick={() => {
                setIsManualCode(false);
                setCode(getSlugified(name));
              }}
              className="text-primary-500 absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold hover:underline"
            >
              Скинути авто-код
            </button>
          )}
        </div>
      </label>

      <label className="flex flex-col gap-1">
        <span className="block text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Одиниці виміру (якщо є)
        </span>
        <input
          type="text"
          placeholder="Наприклад: В, Вт, мм, Ач"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="focus:border-primary-500 w-full rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="block text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Офіційні значення (Опції)
        </span>
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
            className="focus:border-primary-500 flex-grow rounded-lg border border-neutral-200 bg-[#FAFAFF] px-3.5 py-2 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddOption}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 px-3.5 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-200"
          >
            <Plus size={16} />
            <span>Додати</span>
          </button>
        </div>

        {options.length > 0 && (
          <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
            {options.map((opt, idx) => (
              <span
                key={opt}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 shadow-sm"
              >
                <span>{opt}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="cursor-pointer text-neutral-400 hover:text-rose-500"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3 border-t border-neutral-100 pt-3">
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase transition-colors"
        >
          Зберегти
        </button>
      </div>
    </form>
  );
};

export default AttributeForm;
