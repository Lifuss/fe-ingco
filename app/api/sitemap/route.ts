import { NextResponse } from 'next/server';

const DOMAIN = 'https://ingco-service.win';
const BACKEND_API = `${process.env.NEXT_PUBLIC_API}/api/products/ids`;

export async function GET() {
  try {
    const response = await fetch(BACKEND_API);
    const { productIds } = await response.json();
    const staticPages = [
      '/',
      '/auth/login',
      '/auth/register',
      '/home/contacts',
      '/home/support',
      '/retail/cart',
      '/retail/favorites',
      '/retail/history',
      '/service',
      '/shop/cart',
      '/shop/favorites',
      '/shop/history',
      '/shop/export',
      '/shop/table',
    ];

    const dynamicUrls = productIds
      .map((id: string) => {
        return `
          <url>
            <loc>${DOMAIN}/retail/${id}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
          <url>
            <loc>${DOMAIN}/shop/${id}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })
      .join('');

    const staticSitemap = staticPages
      .map((page) => {
        return `
        <url>
          <loc>${DOMAIN}${page}</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      `;
      })
      .join('');

    const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticSitemap}
      ${dynamicUrls}
    </urlset>
  `;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return new NextResponse('Failed to generate sitemap', {
      status: 500,
    });
  }
}
