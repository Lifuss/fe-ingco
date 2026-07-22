'use client';

import { useState } from 'react';
import AttributesTable from '../tables/AttributesTable';
import { AttributeModalCreate } from '@/app/ui/modals/AttributeModal';
import Search from '@/app/ui/search';
import { useSearchParams } from 'next/navigation';

const AttributesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-neutral-800 uppercase sm:text-3xl lg:text-4xl">
        Характеристики
      </h1>
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="w-72">
          <Search placeholder="Назва характеристики..." variant="dashboard" />
        </div>
        <AttributeModalCreate onSuccess={triggerRefresh} />
      </div>
      <AttributesTable refreshTrigger={refreshTrigger} onRefresh={triggerRefresh} query={query} />
    </div>
  );
};

export default AttributesPage;
