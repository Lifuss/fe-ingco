import { useState } from 'react';
import { Info } from 'lucide-react';

export default function PricingTooltip() {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <button
        type="button"
        className="focus:ring-primary-500 rounded-full p-0.5 text-neutral-400 transition-colors hover:text-neutral-600 focus:ring-1 focus:outline-none"
        aria-label="Інформація про розрахунок суми"
      >
        <Info className="h-4 w-4" />
      </button>
      {visible && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-left text-xs leading-normal font-normal text-white normal-case shadow-lg transition-all">
          Сума = кількість × ціна. Для гривневого еквіваленту використовується курс USD Монобанку.
        </div>
      )}
    </div>
  );
}
