'use client';

import { useState, useEffect } from 'react';

interface CartQuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetQuantity?: (quantity: number) => void;
  disabled?: boolean;
  productName?: string;
}

export default function CartQuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  onSetQuantity,
  disabled = false,
  productName,
}: CartQuantityControlProps) {
  const [localValue, setLocalValue] = useState<string>(String(quantity));

  useEffect(() => {
    setLocalValue(String(quantity));
  }, [quantity]);

  const handleCommit = () => {
    const parsed = parseInt(localValue, 10);
    if (isNaN(parsed) || parsed < 1) {
      setLocalValue(String(quantity));
    } else if (parsed !== quantity && onSetQuantity) {
      onSetQuantity(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="font-table mx-auto flex h-8 w-[104px] items-center justify-between overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-xs shadow-inner">
      <button
        onClick={onDecrement}
        disabled={disabled || quantity <= 1}
        className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors select-none hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        aria-label={productName ? `Зменшити кількість для ${productName}` : 'Зменшити кількість'}
      >
        -
      </button>

      {onSetQuantity ? (
        <input
          type="number"
          min={1}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="h-full w-9 [appearance:textfield] bg-transparent text-center font-bold text-neutral-900 outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={productName ? `Кількість для ${productName}` : 'Кількість'}
        />
      ) : (
        <span className="w-8 text-center font-bold text-neutral-900 select-none">{quantity}</span>
      )}

      <button
        onClick={onIncrement}
        disabled={disabled}
        className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors select-none hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        aria-label={productName ? `Збільшити кількість для ${productName}` : 'Збільшити кількість'}
      >
        +
      </button>
    </div>
  );
}
