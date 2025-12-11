import { NextResponse } from 'next/server';

const DOMAIN = 'https://ingco-service.win';
const BACKEND_API = `${process.env.NEXT_PUBLIC_API}/api/products`;

interface Category {
  _id: string;
  name: string;
}

interface Characteristic {
  name: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  article: string;
  description: string;
  price: number;
  priceRetailRecommendation: number;
  countInStock: number;
  image: string;
  category: Category | null;
  characteristics?: Characteristic[];
  warranty?: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API}?limit=10000&isRetail=true`, {
      next: { revalidate: 86400 },
    });
    const { products } = (await response.json()) as { products: Product[] };

    const offers = products
      .map((product) => {
        const available = product.countInStock > 0 ? 'true' : 'false';
        const imageUrl = product.image.startsWith('http')
          ? product.image
          : `${process.env.NEXT_PUBLIC_API}${product.image}`;

        const params: string[] = [];
        if (product.characteristics?.length) {
          product.characteristics.forEach((char) => {
            if (char.name && char.value) {
              params.push(
                `      <param name="${escapeXml(char.name)}">${escapeXml(char.value)}</param>`,
              );
            }
          });
        }
        if (product.warranty) {
          params.push(
            `      <param name="Гарантія">${product.warranty} міс.</param>`,
          );
        }
        const paramsXml = params.length ? '\n' + params.join('\n') : '';

        return `
    <offer id="${escapeXml(product._id)}" available="${available}">
      <url>${DOMAIN}/retail/${escapeXml(product.slug)}</url>
      <price>${product.priceRetailRecommendation}</price>
      <currencyId>UAH</currencyId>
      <categoryId>${product.category?._id || 'uncategorized'}</categoryId>
      <picture>${escapeXml(imageUrl)}</picture>
      <name>${escapeXml(product.name)}</name>
      <vendor>INGCO</vendor>
      <description>${escapeXml(product.description || '')}</description>
      <article>${escapeXml(product.article)}</article>${paramsXml}
    </offer>`;
      })
      .join('');

    const categoriesMap = new Map<string, string>();
    products.forEach((p) => {
      if (p.category) {
        categoriesMap.set(p.category._id, p.category.name);
      }
    });

    const categories = Array.from(categoriesMap.entries())
      .map(([id, name]) => {
        const categoryUrl = `${DOMAIN}/retail?category=${id}&amp;`;
        return `    <category id="${escapeXml(id)}" url="${categoryUrl}">${escapeXml(name)}</category>`;
      })
      .join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${new Date().toISOString().split('T')[0]}">
  <shop>
    <name>INGCO Ukraine</name>
    <company>INGCO</company>
    <url>${DOMAIN}</url>
    <currencies>
      <currency id="UAH" rate="1"/>
    </currencies>
    <categories>
${categories}
    </categories>
    <offers>${offers}
    </offers>
  </shop>
</yml_catalog>`;

    return new NextResponse(feed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Failed to generate feed:', error);
    return new NextResponse('Failed to generate feed', { status: 500 });
  }
}

