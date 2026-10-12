'use client';

import B2BRegisterForm from '../forms/RegisterPartner-form';
import B2CRegisterForm from '../forms/RegisterClient-form';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, CheckCircle2, Info, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

const QUERY_KEY = 'isB2B';

export default function SwitchRegisterForms() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isB2B, setIsB2B] = useState(() =>
    searchParams ? searchParams.get(QUERY_KEY) === 'true' : false,
  );

  const select = (next: boolean) => {
    if (next === isB2B) return;
    setIsB2B(next);

    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (next) {
      params.set(QUERY_KEY, 'true');
    } else {
      params.delete(QUERY_KEY);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div>
      <p className="mb-2.5 text-center text-sm font-medium text-gray-600">
        Оберіть тип вашого облікового запису:
      </p>

      <div role="tablist" aria-label="Тип реєстрації" className="mb-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          role="tab"
          aria-selected={!isB2B}
          aria-controls="register-form-panel"
          onClick={() => select(false)}
          className={clsx(
            'relative flex cursor-pointer flex-col items-start rounded-2xl border-2 p-3.5 text-left transition-all duration-200',
            !isB2B
              ? 'border-orange-light bg-amber-50/60 text-black shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/60',
          )}
        >
          <div className="mb-1.5 flex w-full items-center justify-between">
            <span
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                !isB2B ? 'bg-orange-light text-black' : 'bg-gray-100 text-gray-500',
              )}
            >
              <ShoppingBag size={20} />
            </span>
            {!isB2B && <CheckCircle2 size={18} className="text-amber-600" />}
          </div>
          <span className="text-base font-bold text-gray-900">Клієнт</span>
          <span className="mt-0.5 text-xs leading-snug text-gray-500">
            Роздрібні покупки для особистого користування
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isB2B}
          aria-controls="register-form-panel"
          onClick={() => select(true)}
          className={clsx(
            'relative flex cursor-pointer flex-col items-start rounded-2xl border-2 p-3.5 text-left transition-all duration-200',
            isB2B
              ? 'border-orange-light bg-amber-50/60 text-black shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/60',
          )}
        >
          <div className="mb-1.5 flex w-full items-center justify-between">
            <span
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                isB2B ? 'bg-orange-light text-black' : 'bg-gray-100 text-gray-500',
              )}
            >
              <Briefcase size={20} />
            </span>
            {isB2B && <CheckCircle2 size={18} className="text-amber-600" />}
          </div>
          <span className="text-base font-bold text-gray-900">Партнер (B2B)</span>
          <span className="mt-0.5 text-xs leading-snug text-gray-500">
            Оптові ціни та співпраця для ФОП і компаній
          </span>
        </button>
      </div>

      <div
        className={clsx(
          'mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed',
          isB2B
            ? 'border-amber-200 bg-amber-50/80 text-amber-950'
            : 'border-gray-200 bg-gray-50 text-gray-600',
        )}
      >
        <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
        {isB2B ? (
          <div>
            <strong>Оптова реєстрація (B2B):</strong> вкажіть ваш код ЄДРПОУ. Після перевірки
            менеджером дані для входу в оптовий кабінет надійдуть вам на пошту.
          </div>
        ) : (
          <div>
            <strong>Роздрібний покупець:</strong> миттєва реєстрація для покупок на сайті. Бажаєте
            купувати оптом як бізнес?{' '}
            <button
              type="button"
              onClick={() => select(true)}
              className="cursor-pointer font-semibold text-amber-700 underline hover:text-amber-800"
            >
              Перейдіть у вкладку «Партнер (B2B)»
            </button>
          </div>
        )}
      </div>

      <div id="register-form-panel" role="tabpanel">
        {isB2B ? <B2BRegisterForm /> : <B2CRegisterForm />}
      </div>
    </div>
  );
}
