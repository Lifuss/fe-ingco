import { Metadata } from 'next';
import { Product } from './types';
import { getEffectiveRetailPrice } from './utils';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ingcoua.com.ua';
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
  keywords?: string;
}

export function generateBaseMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = '/site-card.webp',
  noindex = false,
  nofollow = false,
  keywords,
}: BaseMetadataOptions): Metadata {
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return {
    title,
    description,
    keywords,
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
      languages: {
        'uk-UA': pageUrl,
      },
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
  const productPrice = price || getEffectiveRetailPrice(product);
  const article = (product.article || '').trim();

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`
    : `${SITE_URL}/placeholder.webp`;
  const pageUrl = `${SITE_URL}/${slug}`;
  const title = `${product.name} - ${article} | INGCO`;

  // Clean description without extra whitespace, HTML tags, or awkward breaks
  const rawDesc = (product.description || '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const maxDescLen = 100;
  const snippet = rawDesc.length > maxDescLen ? `${rawDesc.substring(0, maxDescLen)}...` : rawDesc;
  const actionText = isB2B ? 'Купити гуртом' : 'Купити в Україні з доставкою';
  const description =
    `${product.name} - ${article}. ${snippet ? `${snippet} ` : ''}${actionText}.`.trim();

  return {
    title,
    description,
    keywords: `${product.name}, ${article}, INGCO, електроінструменти, ${isB2B ? 'гурт' : 'роздріб'}, купити в Україні`,
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
          alt: product.name,
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
      languages: {
        'uk-UA': pageUrl,
      },
    },
    other: {
      'product:price:amount': productPrice?.toString() || '',
      'product:price:currency': 'UAH',
      'product:availability': product.countInStock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': 'INGCO',
      'product:retailer_item_id': article,
    },
  };
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  noindex = false,
  nofollow = false,
  keywords,
}: PageMetadataOptions): Metadata {
  return generateBaseMetadata({
    title,
    description,
    url: path,
    noindex,
    nofollow,
    keywords,
  });
}

export function generateProductJsonLd(product: Product, slug?: string, priceOverride?: number) {
  const images: string[] =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API || ''}${img}`,
        )
      : product.image
        ? [
            product.image.startsWith('http')
              ? product.image
              : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`,
          ]
        : [`${SITE_URL}/placeholder.webp`];

  const article = (product.article || '').trim();
  const productSlug = slug || product.slug || '';
  const productPrice =
    priceOverride !== undefined
      ? priceOverride
      : Number(getEffectiveRetailPrice(product) || product.priceRetailRecommendation || 0);

  const cleanDescription = (product.description || product.name)
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim();

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description:
      cleanDescription ||
      `Купити ${product.name} за вигідною ціною в інтернет-магазині INGCO Ukraine.`,
    sku: article,
    mpn: article,
    brand: {
      '@type': 'Brand',
      name: 'INGCO',
    },
    offers: {
      '@type': 'Offer',
      url: productSlug ? `${SITE_URL}/${productSlug}` : SITE_URL,
      priceCurrency: 'UAH',
      price: productPrice,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    ...(product.reviewCount && product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.averageRating || 0),
            reviewCount: Number(product.reviewCount),
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
