'use client';
import B2BRegisterForm from '../forms/RegisterPartner-form';
import B2CRegisterForm from '../forms/RegisterClient-form';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

const SwitchRegisterForms = () => {
  const [isB2B, setIsB2B] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('isB2B')) {
      setIsB2B(true);
    }
  }, [searchParams]);

  const toggleForm = () => {
    setIsB2B(!isB2B);
  };

  return (
    <div>
      <button onClick={toggleForm} className="mx-auto mb-5 flex text-base">
        <span
          className={clsx(
            'cursor-pointer border-b-2 pr-2 transition-all duration-300 hover:border-black hover:text-black',
            { 'border-black text-black': !isB2B },
            { 'border-gray-300 text-gray-300': isB2B },
          )}
        >
          Клієнт
        </span>
        <span
          className={clsx(
            'cursor-pointer border-b-2 pl-2 transition-all duration-300 hover:border-black hover:text-black',
            { 'border-black text-black': isB2B },
            { 'border-gray-300 text-gray-300': !isB2B },
          )}
        >
          Партнер
        </span>
      </button>
      {isB2B ? <B2BRegisterForm /> : <B2CRegisterForm />}
    </div>
  );
};

export default SwitchRegisterForms;
