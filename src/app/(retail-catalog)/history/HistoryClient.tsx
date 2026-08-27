'use client';
import HistoryTable from '@/app/ui/product/HistoryTable';
import { useIsB2B } from '@/lib/hooks';

const HistoryClient = () => {
  const isB2b = useIsB2B();

  return (
    <main className="mx-auto min-h-[550px] w-full max-w-[1680px] bg-white px-4 pt-8 md:px-8 lg:px-[60px]">
      <HistoryTable isRetail={!isB2b} />
    </main>
  );
};

export default HistoryClient;
