import { getProductBySlug } from '@/lib/actions';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

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

  return <ProductPageClient initialProduct={product} productSlug={productSlug} />;
}
