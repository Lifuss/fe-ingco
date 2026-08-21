import { getProductBySlug, getRelatedProducts } from '@/lib/serverData';
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

  const categoryId = product.category?.id ? String(product.category.id) : '';
  const relatedProducts = categoryId ? await getRelatedProducts(categoryId, 5) : [];

  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value;
  const isAdmin = role === 'admin' || role === 'ADMIN';

  return (
    <ProductPageClient
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
      productSlug={productSlug}
      isAdminServer={isAdmin}
    />
  );
}
