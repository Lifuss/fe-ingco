'use client';

import { fetchExcelFileThunk } from '@/lib/appState/main/operations';
import { useAppDispatch } from '@/lib/hooks';
import clsx from 'clsx';
import React, { useState } from 'react';

type ExportButtonProps = {
  sheetType: string;
  title: string;
};

const ExportButton = ({ sheetType, title }: ExportButtonProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const saveExcel = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const blob = await dispatch(fetchExcelFileThunk(sheetType)).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date();
      a.download = `ingco_${sheetType}#${date.toLocaleDateString('uk-UA')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      className={clsx(
        'rounded-md p-2 text-lg font-medium transition-colors duration-300 ease-in-out',
        isLoading
          ? 'bg-gray-300'
          : 'bg-orangeLight hover:bg-orange-400 hover:text-white',
      )}
      onClick={() => saveExcel()}
    >
      {isLoading ? (
        <p className="relative">
          Формується...{' '}
          <span className="absolute -top-1 right-0 text-xs text-gray-500">
            (1-15сек)
          </span>
        </p>
      ) : (
        title
      )}
    </button>
  );
};

export default ExportButton;
