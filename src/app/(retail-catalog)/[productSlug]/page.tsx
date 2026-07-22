import { getProductBySlug } from '@/lib/actions';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

type PageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;
  const isAdmin = role === 'admin' || role === 'ADMIN';

  return (
    <ProductPageClient initialProduct={product} productSlug={productSlug} isAdminServer={isAdmin} />
  );
}
