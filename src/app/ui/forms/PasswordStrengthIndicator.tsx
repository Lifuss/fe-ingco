'use client';

import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

export interface PasswordCriterion {
  id: string;
  label: string;
  isValid: boolean;
}

export interface PasswordStrengthIndicatorProps {
  password?: string;
  className?: string;
}

export function getPasswordCriteria(password: string = ''): PasswordCriterion[] {
  return [
    {
      id: 'length',
      label: 'Від 8 до 20 символів',
      isValid: password.length >= 8 && password.length <= 20,
    },
    {
      id: 'uppercase',
      label: 'Велика літера (A-Z)',
      isValid: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'Мала літера (a-z)',
      isValid: /[a-z]/.test(password),
    },
    {
      id: 'numberOrSymbol',
      label: 'Цифра або спецсимвол (0-9, #, $...)',
      isValid: /[0-9\W_]/.test(password),
    },
  ];
}

export default function PasswordStrengthIndicator({
  password = '',
  className,
}: PasswordStrengthIndicatorProps) {
  const criteria = useMemo(() => getPasswordCriteria(password), [password]);
  const score = useMemo(() => criteria.filter((c) => c.isValid).length, [criteria]);

  const strengthConfig = useMemo(() => {
    if (!password) {
      return {
        label: 'Введіть пароль',
        barColor: 'bg-gray-200',
        textColor: 'text-gray-400',
      };
    }
    switch (score) {
      case 1:
        return {
          label: 'Слабкий',
          barColor: 'bg-red-500',
          textColor: 'text-red-500',
        };
      case 2:
        return {
          label: 'Посередній',
          barColor: 'bg-amber-500',
          textColor: 'text-amber-500',
        };
      case 3:
        return {
          label: 'Достатній',
          barColor: 'bg-blue-500',
          textColor: 'text-blue-600',
        };
      case 4:
        return {
          label: 'Надійний',
          barColor: 'bg-emerald-500',
          textColor: 'text-emerald-600',
        };
      default:
        return {
          label: 'Дуже слабкий',
          barColor: 'bg-red-400',
          textColor: 'text-red-400',
        };
    }
  }, [password, score]);

  return (
    <div
      className={clsx(
        'mt-2 w-full space-y-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3',
        className,
      )}
    >
      {/* Progress Bar Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Надійність паролю:</span>
        <span
          className={clsx('font-semibold transition-colors duration-200', strengthConfig.textColor)}
        >
          {strengthConfig.label}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div
        className="grid grid-cols-4 gap-1.5"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
      >
        {[1, 2, 3, 4].map((step) => {
          const isFilled = password.length > 0 && score >= step;
          return (
            <div
              key={step}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                isFilled ? strengthConfig.barColor : 'bg-gray-200',
              )}
            />
          );
        })}
      </div>

      {/* Checklist bullet points */}
      <div className="grid grid-cols-1 gap-1.5 pt-0.5 text-xs sm:grid-cols-2">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'flex items-center gap-1.5 transition-colors duration-200',
              item.isValid ? 'font-medium text-emerald-700' : 'text-gray-500',
            )}
          >
            <span
              className={clsx(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                item.isValid ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400',
              )}
            >
              <Check size={11} strokeWidth={item.isValid ? 3 : 2} />
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
