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
        className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-full"
        aria-label="Інформація про розрахунок суми"
      >
        <Info className="h-4 w-4" />
      </button>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-900 text-white text-xs rounded-xl shadow-lg z-50 pointer-events-none transition-all border border-neutral-800 font-normal normal-case leading-normal text-left">
          Сума = кількість × ціна.
          Для гривневого еквіваленту використовується курс USD Монобанку.
        </div>
      )}
    </div>
  );
}
