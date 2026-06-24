import { Metadata } from 'next';
import React from 'react';
import { generateProductMetadata, SITE_URL } from '@/lib/metadata';
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

  let schemaData = null;

  if (product) {
    const imageUrl = product.image
      ? product.image.startsWith('http')
        ? product.image
        : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`
      : `${SITE_URL}/placeholder.webp`;

    const price = product.rrcSale || product.priceRetailRecommendation || 0;

    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: imageUrl,
      description:
        product.description ||
        `Купити ${product.name} за вигідною ціною в інтернет-магазині INGCO Ukraine.`,
      sku: product.article,
      mpn: product.article,
      brand: {
        '@type': 'Brand',
        name: 'INGCO',
      },
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/${productSlug}`,
        priceCurrency: 'UAH',
        price: price,
        priceValidUntil: '2028-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability:
          product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'INGCO Ukraine',
          url: SITE_URL,
        },
      },
    };
  }

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData, null, 2),
          }}
        />
      )}
      {children}
    </>
  );
}
