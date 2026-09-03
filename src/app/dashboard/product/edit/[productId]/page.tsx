'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { useGetProductByIdQuery } from '@/lib/appState/api/productsApi';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import { toast } from 'react-toastify';

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { productId } = use(params);
  const router = useRouter();

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId);

  useEffect(() => {
    if (isError) {
      toast.error('Товар не знайдено');
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`ingco_product_edit_draft_${productId}`);
      }
      router.push('/dashboard');
    }
  }, [isError, productId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary-500 h-9 w-9 animate-spin" />
        <span className="font-sans text-sm font-semibold text-neutral-600">
          Завантаження даних товару...
        </span>
      </div>
    );
  }

  if (!product) return null;

  return <AdminProductForm isEdit product={product} />;
};

export default Page;
