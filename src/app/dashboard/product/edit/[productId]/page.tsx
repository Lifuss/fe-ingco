'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { productId } = use(params);
  const router = useRouter();
  const product = useAppSelector((state) =>
    state.persistedMainReducer.products.find((p) => String(p.id) === productId),
  );

  useEffect(() => {
    if (!product) {
      router.back();
    }
  }, [product, router]);

  if (!product) return null;

  return <AdminProductForm isEdit product={product} />;
};

export default Page;
