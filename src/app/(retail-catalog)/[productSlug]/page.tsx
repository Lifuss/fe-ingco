import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/serverData';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/metadata';
import ProductPageClient from './ProductPageClient';

type PageProps = {
  params: Promise<{
    productSlug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: 'Продукт не знайдено',
      description: 'Продукт не знайдено',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateProductMetadata({
    product,
    slug: productSlug,
    price: product.rrcSale || product.priceRetailRecommendation,
    isB2B: false,
  });
}

export default async function Page({ params }: PageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  const categoryId = product.category?.id ? String(product.category.id) : '';
  const relatedProducts = categoryId ? await getRelatedProducts(categoryId, 5) : [];

  const price = product.rrcSale || product.priceRetailRecommendation || 0;
  const schemaData = generateProductJsonLd(product, productSlug, price);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 2).replace(/</g, '\\u003c'),
        }}
      />
      <ProductPageClient
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
        productSlug={productSlug}
      />
    </>
  );
}
