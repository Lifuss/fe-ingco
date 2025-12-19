import { Metadata } from 'next';
import { generateProductMetadata } from '@/lib/metadata';
import { getProductBySlug } from '@/lib/actions';

export async function generateMetadata({
  params,
}: {
  params: { productSlug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.productSlug);

  if (!product) {
    return {
      title: 'Продукт не знайдено | INGCO',
      description: 'Продукт не знайдено',
    };
  }

  return generateProductMetadata({
    product,
    slug: `shop/${params.productSlug}`,
    price: product.price,
    isB2B: true,
  });
}

export default function ShopProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
