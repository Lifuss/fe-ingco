'use client';

import { fetchExcelFileThunk } from '@/lib/appState/main/operations';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react';

type ExportButtonProps = {
  sheetType: string;
  title: string;
};

const ExportButton = ({ sheetType, title }: ExportButtonProps) => {
  const dispatch = useAppDispatch();

  const saveExcel = () => {
    dispatch(fetchExcelFileThunk(sheetType))
      .unwrap()
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date();
        a.download = `ingco_${sheetType}#${date.toLocaleDateString('uk-UA')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <button
      type="button"
      className="rounded-md bg-orangeLight p-2 text-lg font-medium transition-colors duration-300 ease-in-out hover:bg-orange-400 hover:text-white"
      onClick={() => saveExcel()}
    >
      {title}
    </button>
  );
};

export default ExportButton;
