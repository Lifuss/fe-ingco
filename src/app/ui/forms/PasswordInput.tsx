'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={twMerge(
            clsx(
              'border-input-border block w-full rounded-2xl border py-[16px] pr-12 pl-4 text-base outline-2 transition-colors placeholder:text-gray-500',
              error && 'border-red-500 focus:border-red-500',
              className,
            ),
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff size={20} className="stroke-[1.75]" />
          ) : (
            <Eye size={20} className="stroke-[1.75]" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
