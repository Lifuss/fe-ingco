import { Metadata } from 'next';
import { Product } from './types';

export const SITE_URL = 'https://ingco-service.win';
export const SITE_NAME = 'INGCO Ukraine';
export const DEFAULT_DESCRIPTION =
  'INGCO – професійні інструменти для будівництва та ремонту. Купуйте якісні електроінструменти гуртом та в роздріб в Україні. Доставка по всій країні!';

export interface BaseMetadataOptions {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateBaseMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = '/site-card.webp',
  noindex = false,
  nofollow = false,
}: BaseMetadataOptions): Metadata {
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return {
    title,
    description,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: 'uk_UA',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export interface ProductMetadataOptions {
  product: Product;
  slug: string;
  price?: number;
  isB2B?: boolean;
}

export function generateProductMetadata({
  product,
  slug,
  price,
  isB2B = false,
}: ProductMetadataOptions): Metadata {
  const productPrice =
    price || product.rrcSale || product.priceRetailRecommendation;
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`;
  const pageUrl = `${SITE_URL}/${slug}`;
  const title = `${product.name} - ${product.article} | INGCO`;
  const description = `${product.name} - ${product.article}. ${product.description.substring(0, 150)}... ${isB2B ? 'Купити гуртом' : 'Купити в Україні з доставкою'}.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${product.article}, INGCO, електроінструменти, ${isB2B ? 'гурт' : 'роздріб'}, купити в Україні`,
    openGraph: {
      title,
      description: `${product.name} - ${product.article}. ${isB2B ? 'Купити гуртом' : 'Купити в Україні з доставкою'}.`,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: 'uk_UA',
      type: 'product',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${product.name} - ${product.article}. ${isB2B ? 'Купити гуртом' : 'Купити в Україні'}.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
    other: {
      'product:price:amount': productPrice?.toString() || '',
      'product:price:currency': 'UAH',
    },
  };
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  noindex = false,
  nofollow = false,
}: PageMetadataOptions): Metadata {
  return generateBaseMetadata({
    title,
    description,
    url: path,
    noindex,
    nofollow,
  });
}
