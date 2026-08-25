import { NextResponse } from 'next/server';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://ingcoua.com.ua';
const BACKEND_API = `${process.env.NEXT_PUBLIC_API}/api/products`;

interface Category {
  id: number;
  name: string;
}

interface Characteristic {
  code?: string;
  name?: string;
  value?: string | string[] | number | boolean | null;
  unit?: string | null;
  isMultiple?: boolean;
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

function escapeXml(str: unknown): string {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapCdata(str: unknown): string {
  const normalized = (str == null ? '' : String(str))
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
      const data = (await response.json()) as {
        products: (Omit<Product, 'category'> & {
          category?: Category | null;
          mainCategory?: Category | null;
        })[];
        total: number;
      };
      const fetchedProducts: Product[] = (data.products || []).map((p) => ({
        ...p,
        category: p.mainCategory || p.category || null,
      }));
      products = products.concat(fetchedProducts);

      if (fetchedProducts.length < limit || products.length >= data.total) {
        hasMore = false;
      } else {
        page++;
      }
    }

    const baseApi = process.env.NEXT_PUBLIC_API || '';

    const offers = products
      .map((product) => {
        const countInStock = Number(product.countInStock) || 0;
        const inStock = countInStock > 0;
        const available = inStock ? 'true' : 'false';
        const pictures: string[] = [];
        if (Array.isArray(product.images) && product.images.length > 0) {
          product.images.forEach((img) => {
            if (typeof img === 'string' && img.trim()) {
              const trimmed = img.trim();
              const url = trimmed.startsWith('http') ? trimmed : `${baseApi}${trimmed}`;
              pictures.push(`      <picture>${escapeXml(url)}</picture>`);
            }
          });
        } else if (typeof product.image === 'string' && product.image.trim()) {
          const trimmed = product.image.trim();
          const url = trimmed.startsWith('http') ? trimmed : `${baseApi}${trimmed}`;
          pictures.push(`      <picture>${escapeXml(url)}</picture>`);
        } else {
          pictures.push(`      <picture>${escapeXml(`${DOMAIN}/placeholder.webp`)}</picture>`);
        }
        const picturesXml = pictures.join('\n');

        const params: string[] = [];
        if (Array.isArray(product.characteristics) && product.characteristics.length > 0) {
          product.characteristics.forEach((char) => {
            if (!char || !char.name || char.value == null) return;
            if (Array.isArray(char.value)) {
              const valStr = char.value
                .map((v) => (v != null ? String(v).trim() : ''))
                .filter(Boolean)
                .join(', ');
              if (valStr) {
                params.push(
                  `      <param name="${escapeXml(char.name)}">${escapeXml(valStr)}</param>`,
                );
              }
            } else {
              const valStr = String(char.value).trim();
              if (valStr) {
                params.push(
                  `      <param name="${escapeXml(char.name)}">${escapeXml(valStr)}</param>`,
                );
              }
            }
          });
        }
        if (product.warranty) {
          params.push(
            `      <param name="Гарантія" unit="міс.">${escapeXml(product.warranty)}</param>`,
          );
        }
        const paramsXml = params.length ? '\n' + params.join('\n') : '';

        const barcodeXml = product.barcode
          ? `\n      <barcode>${escapeXml(product.barcode)}</barcode>`
          : '';

        const keywordsXml =
          product.seoKeywords && String(product.seoKeywords).trim()
            ? `\n      <keywords>${escapeXml(String(product.seoKeywords).trim())}</keywords>\n      <keywords_ua>${escapeXml(String(product.seoKeywords).trim())}</keywords_ua>`
            : '';

        const name = (product.name || '').trim();
        const article = (product.article || '').trim();

        const rrcSaleNum = product.rrcSale != null ? Number(product.rrcSale) : 0;
        const priceRetailRecNum = Number(product.priceRetailRecommendation) || 0;
        const hasSale = rrcSaleNum > 0 && rrcSaleNum < priceRetailRecNum;
        const displayPrice = hasSale ? rrcSaleNum : priceRetailRecNum;
        const oldPriceXml = hasSale ? `\n      <oldprice>${priceRetailRecNum}</oldprice>` : '';

        return `
    <offer id="${escapeXml(String(product.id))}" available="${available}" in_stock="${available}" selling_type="r">
      <name>${escapeXml(name)}</name>
      <name_ua>${escapeXml(name)}</name_ua>
      <url>${DOMAIN}/${escapeXml(product.slug || '')}</url>
      <price>${displayPrice}</price>${oldPriceXml}
      <currencyId>UAH</currencyId>
      <categoryId>${escapeXml(product.category ? String(product.category.id) : 'uncategorized')}</categoryId>
${picturesXml}
      <vendor>INGCO</vendor>
      <vendorCode>${escapeXml(article)}</vendorCode>
      <mpn>${escapeXml(article)}</mpn>${barcodeXml}
      <country>Китай</country>
      <quantity_in_stock>${countInStock}</quantity_in_stock>
      <description>${wrapCdata(product.description || '')}</description>
      <description_ua>${wrapCdata(product.description || '')}</description_ua>${keywordsXml}${paramsXml}
    </offer>`;
      })
      .join('');

    const categoriesMap = new Map<number, string>();
    products.forEach((p) => {
      if (p.category && p.category.id != null && p.category.name) {
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
