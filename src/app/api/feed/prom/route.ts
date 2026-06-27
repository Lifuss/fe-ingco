import { NextResponse } from 'next/server';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://ingcoua.com.ua';
const BACKEND_API = `${process.env.NEXT_PUBLIC_API}/api/products`;

interface Category {
  id: number;
  name: string;
}

interface Characteristic {
  name: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  article: string;
  description: string;
  price: number;
  priceRetailRecommendation: number;
  rrcSale?: number;
  countInStock: number;
  image: string;
  images?: string[];
  category: Category | null;
  characteristics?: Characteristic[];
  warranty?: number;
  barcode?: string;
  seoKeywords?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapCdata(str: string): string {
  const normalized = (str || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${normalized}]]>`;
}

function formatPromDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export async function GET() {
  try {
    const limit = 100;
    let page = 1;
    let products: Product[] = [];
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`${BACKEND_API}?page=${page}&limit=${limit}&isRetail=true`, {
        next: { revalidate: 86400 },
      });
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      const data = (await response.json()) as { products: Product[]; total: number };
      const fetchedProducts = data.products || [];
      products = products.concat(fetchedProducts);

      if (fetchedProducts.length < limit || products.length >= data.total) {
        hasMore = false;
      } else {
        page++;
      }
    }

    const offers = products
      .map((product) => {
        const inStock = product.countInStock > 0;
        const available = inStock ? 'true' : 'false';
        const pictures: string[] = [];
        if (product.images && product.images.length > 0) {
          product.images.forEach((img) => {
            const url = img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API || ''}${img}`;
            pictures.push(`      <picture>${escapeXml(url)}</picture>`);
          });
        } else if (product.image) {
          const url = product.image.startsWith('http')
            ? product.image
            : `${process.env.NEXT_PUBLIC_API || ''}${product.image}`;
          pictures.push(`      <picture>${escapeXml(url)}</picture>`);
        } else {
          pictures.push(`      <picture>${escapeXml(`${DOMAIN}/placeholder.webp`)}</picture>`);
        }
        const picturesXml = pictures.join('\n');

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
          params.push(`      <param name="Гарантія" unit="міс.">${product.warranty}</param>`);
        }
        const paramsXml = params.length ? '\n' + params.join('\n') : '';

        const barcodeXml = product.barcode
          ? `\n      <barcode>${escapeXml(product.barcode)}</barcode>`
          : '';

        const keywordsXml = product.seoKeywords?.trim()
          ? `\n      <keywords>${escapeXml(product.seoKeywords.trim())}</keywords>\n      <keywords_ua>${escapeXml(product.seoKeywords.trim())}</keywords_ua>`
          : '';

        const name = product.name.trim();
        const article = product.article.trim();

        const rrcSaleNum = product.rrcSale != null ? Number(product.rrcSale) : 0;
        const priceRetailRecNum = Number(product.priceRetailRecommendation);
        const hasSale =
          rrcSaleNum > 0 &&
          rrcSaleNum < priceRetailRecNum;
        const displayPrice = hasSale ? rrcSaleNum : priceRetailRecNum;
        const oldPriceXml = hasSale
          ? `\n      <oldprice>${priceRetailRecNum}</oldprice>`
          : '';

        return `
    <offer id="${escapeXml(String(product.id))}" available="${available}" in_stock="${available}" selling_type="r">
      <name>${escapeXml(name)}</name>
      <name_ua>${escapeXml(name)}</name_ua>
      <url>${DOMAIN}/${escapeXml(product.slug)}</url>
      <price>${displayPrice}</price>${oldPriceXml}
      <currencyId>UAH</currencyId>
      <categoryId>${escapeXml(product.category ? String(product.category.id) : 'uncategorized')}</categoryId>
${picturesXml}
      <vendor>INGCO</vendor>
      <vendorCode>${escapeXml(article)}</vendorCode>
      <mpn>${escapeXml(article)}</mpn>${barcodeXml}
      <country>Китай</country>
      <quantity_in_stock>${product.countInStock}</quantity_in_stock>
      <description>${wrapCdata(product.description || '')}</description>
      <description_ua>${wrapCdata(product.description || '')}</description_ua>${keywordsXml}${paramsXml}
    </offer>`;
      })
      .join('');

    const categoriesMap = new Map<number, string>();
    products.forEach((p) => {
      if (p.category) {
        categoriesMap.set(p.category.id, p.category.name);
      }
    });

    const categories = Array.from(categoriesMap.entries())
      .map(
        ([id, name]) =>
          `      <category id="${escapeXml(String(id))}">${escapeXml(name)}</category>`,
      )
      .join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${formatPromDate(new Date())}">
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
    console.error('Failed to generate Prom.ua feed:', error);
    return new NextResponse('Failed to generate feed', { status: 500 });
  }
}
