'use client';

import AdminProductForm from '@/app/ui/forms/AdminProductForm';
import { getProductByIdThunk } from '@/lib/appState/main/operations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { productId } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxProduct = useAppSelector((state) =>
    state.persistedMainReducer.products.find((p) => String(p.id) === productId),
  );

  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!reduxProduct);

  const product = reduxProduct || fetchedProduct;

  useEffect(() => {
    if (reduxProduct) return;

    let isMounted = true;

    dispatch(getProductByIdThunk(productId))
      .unwrap()
      .then((data: Product) => {
        if (isMounted) {
          if (data && data.id) {
            setFetchedProduct(data);
            setIsLoading(false);
          } else {
            throw new Error('Товар не знайдено');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error('Товар не знайдено');
          if (typeof window !== 'undefined') {
            localStorage.removeItem(`ingco_product_edit_draft_${productId}`);
          }
          router.push('/dashboard');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, productId, reduxProduct, router]);

  if (isLoading && !product) {
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
