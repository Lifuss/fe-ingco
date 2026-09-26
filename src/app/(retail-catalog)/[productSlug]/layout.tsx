import { Metadata } from 'next';
import React from 'react';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/metadata';
import { getProductBySlug } from '@/lib/actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: 'Продукт не знайдено | INGCO',
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

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  const price = product ? product.rrcSale || product.priceRetailRecommendation || 0 : 0;
  const schemaData = product ? generateProductJsonLd(product, productSlug, price) : null;

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData, null, 2).replace(/</g, '\\u003c'),
          }}
        />
      )}
      {children}
    </>
  );
}
