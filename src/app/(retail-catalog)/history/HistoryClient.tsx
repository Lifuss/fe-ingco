'use client';
import HistoryTable from '@/app/ui/product/HistoryTable';
import { useAppSelector } from '@/lib/hooks';

const HistoryClient = () => {
  const { isB2b } = useAppSelector((state) => state.persistedAuthReducer);

  return (
    <main className="min-h-[550px] w-full bg-white px-[60px] pt-8">
      <HistoryTable isRetail={!isB2b} />
    </main>
  );
};

export default HistoryClient;
