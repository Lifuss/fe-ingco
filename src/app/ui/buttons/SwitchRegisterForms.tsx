'use client';
import B2BRegisterForm from '../forms/RegisterPartner-form';
import B2CRegisterForm from '../forms/RegisterClient-form';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const QUERY_KEY = 'isB2B';

const SwitchRegisterForms = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isB2B, setIsB2B] = useState(
    () => searchParams?.get(QUERY_KEY) === 'true',
  );

  const select = (next: boolean) => {
    if (next === isB2B) return;
    setIsB2B(next);

    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (next) {
      params.set(QUERY_KEY, 'true');
    } else {
      params.delete(QUERY_KEY);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const tabClasses = (active: boolean, side: 'left' | 'right') =>
    clsx(
      'cursor-pointer border-b-2 transition-all duration-300 hover:border-black hover:text-black',
      side === 'left' ? 'pr-2' : 'pl-2',
      active ? 'border-black text-black' : 'border-gray-300 text-gray-300',
    );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Тип реєстрації"
        className="mx-auto mb-5 flex text-base justify-center"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isB2B}
          aria-controls="register-form-panel"
          onClick={() => select(false)}
          className={tabClasses(!isB2B, 'left')}
        >
          Клієнт
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isB2B}
          aria-controls="register-form-panel"
          onClick={() => select(true)}
          className={tabClasses(isB2B, 'right')}
        >
          Партнер
        </button>
      </div>
      <div id="register-form-panel" role="tabpanel">
        {isB2B ? <B2BRegisterForm /> : <B2CRegisterForm />}
      </div>
    </div>
  );
};

export default SwitchRegisterForms;
