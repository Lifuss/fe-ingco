'use client';

export type PaymentMethod = 'CARD' | 'CASH' | 'ENTERPRISE';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  allowedMethods?: PaymentMethod[];
  errorMessage?: string;
}

const ALL_METHODS: { id: PaymentMethod; title: string; description: string }[] = [
  {
    id: 'CARD',
    title: 'Оплата карткою онлайн',
    description: 'Безпечна оплата карткою через інтернет-еквайринг',
  },
  {
    id: 'CASH',
    title: 'Оплата при отриманні',
    description:
      'Накладений платіж у відділенні перевізника (присутня додаткова комісія перевізника)',
  },
  {
    id: 'ENTERPRISE',
    title: 'Безготівковий розрахунок (IBAN)',
    description: 'Оплата за виставленим рахунком-фактурою для юридичних осіб / ФОП',
  },
];

export default function PaymentMethodSelector({
  value,
  onChange,
  allowedMethods,
  errorMessage,
}: PaymentMethodSelectorProps) {
  const options = allowedMethods
    ? ALL_METHODS.filter((m) => allowedMethods.includes(m.id))
    : ALL_METHODS;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-base font-medium text-neutral-900">Спосіб оплати</span>
      <div className="flex flex-col gap-2">
        {options.map((method) => {
          const isSelected = value === method.id;
          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                isSelected ? 'border-amber-500 bg-amber-50/40' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethodRadio"
                value={method.id}
                checked={isSelected}
                onChange={() => onChange(method.id)}
                className="mt-1 accent-amber-500"
              />
              <div>
                <div className="font-medium text-gray-900">{method.title}</div>
                <div className="text-xs text-gray-500">{method.description}</div>
              </div>
            </label>
          );
        })}
      </div>
      {errorMessage && <span className="text-xs text-rose-600">{errorMessage}</span>}
    </div>
  );
}
