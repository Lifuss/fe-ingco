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
    <div className="w-4/5">
      <h1 className="mb-10 text-4xl font-bold tracking-wider text-neutral-800 uppercase">
        Характеристики
      </h1>
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="w-72">
          <Search placeholder="Назва характеристики..." />
        </div>
        <AttributeModalCreate onSuccess={triggerRefresh} />
      </div>
      <AttributesTable refreshTrigger={refreshTrigger} onRefresh={triggerRefresh} query={query} />
    </div>
  );
};

export default AttributesPage;
