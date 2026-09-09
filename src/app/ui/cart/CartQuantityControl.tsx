'use client';

interface CartQuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  productName?: string;
}

export default function CartQuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  productName,
}: CartQuantityControlProps) {
  return (
    <div className="font-table mx-auto flex h-8 w-[100px] items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-xs shadow-inner select-none">
      <button
        onClick={onDecrement}
        disabled={disabled}
        className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        aria-label={productName ? `Зменшити кількість для ${productName}` : 'Зменшити кількість'}
      >
        -
      </button>
      <span className="w-8 text-center font-bold text-neutral-900">{quantity}</span>
      <button
        onClick={onIncrement}
        disabled={disabled}
        className="flex h-full w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        aria-label={productName ? `Збільшити кількість для ${productName}` : 'Збільшити кількість'}
      >
        +
      </button>
    </div>
  );
}
