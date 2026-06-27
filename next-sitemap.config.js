/* eslint-disable @typescript-eslint/no-require-imports */
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ingcoua.com.ua',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  autoLastmod: true,
  exclude: [
    '/dashboard*',
    '/api*',
    '/_next*',
    '/service*',
    '/auth*',
    '/cart',
    '/favorites',
    '/history',
    '/retail*',
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '*.json', '/service/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const apiBase = process.env.NEXT_PUBLIC_API;
    console.log('--- Sitemap generation apiBase:', apiBase);
    if (!apiBase) return [];

    try {
      const limit = 100;
      let page = 1;
      /** @type {Array<{ slug?: string, updatedAt?: string }>} */
      let allProducts = [];
      let hasMore = true;

      while (hasMore) {
        console.log(`--- Fetching page ${page} of products...`);
        const res = await fetch(
          `${apiBase}/api/products?page=${page}&limit=${limit}&isRetail=true`,
        );
        if (!res.ok) {
          console.log(`--- Product fetch failed with status: ${res.status}`);
          break;
        }

        const data =
          /** @type {{ products?: Array<{ slug?: string, updatedAt?: string }>, total?: number }} */ (
            await res.json()
          );

        const products = Array.isArray(data.products) ? data.products : [];
        console.log(`--- Fetched ${products.length} products`);
        allProducts = allProducts.concat(products);

        const total = typeof data.total === 'number' ? data.total : 0;
        if (products.length < limit || allProducts.length >= total) {
          hasMore = false;
        } else {
          page++;
        }
      }

      console.log(`--- Total products collected: ${allProducts.length}`);

      const productPaths = allProducts
        .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
        .map((p) => ({
          loc: `${config.siteUrl}/${p.slug}`,
          lastmod: p.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }));

      // Fetch categories
      let categoryPaths = [];
      try {
        console.log('--- Fetching categories...');
        const catRes = await fetch(`${apiBase}/api/categories`);
        if (catRes.ok) {
          /** @type {Array<{ slug?: string, updatedAt?: string }>} */
          const categories = await catRes.json();
          console.log(`--- Fetched ${categories.length} categories`);
          categoryPaths = categories
            .filter((c) => typeof c.slug === 'string' && c.slug.length > 0)
            .map((c) => ({
              loc: `${config.siteUrl}/categories/${c.slug}`,
              lastmod: c.updatedAt || new Date().toISOString(),
              changefreq: 'weekly',
              priority: 0.9,
            }));
        } else {
          console.log(`--- Category fetch failed with status: ${catRes.status}`);
        }
      } catch (err) {
        console.error('Failed to fetch categories for sitemap:', err);
      }

      console.log(`--- Returning ${categoryPaths.length + productPaths.length} additional paths`);
      return categoryPaths.concat(productPaths);
    } catch (_error) {
      console.error('--- Sitemap additionalPaths main error:', _error);
      return [];
    }
  },
};
