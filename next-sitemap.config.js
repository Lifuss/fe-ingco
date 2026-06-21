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
    if (!apiBase) return [];

    try {
      const limit = 100;
      let page = 1;
      /** @type {Array<{ slug?: string, updatedAt?: string }>} */
      let allProducts = [];
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `${apiBase}/api/products?page=${page}&limit=${limit}&isRetail=true`,
        );
        if (!res.ok) break;

        const data =
          /** @type {{ products?: Array<{ slug?: string, updatedAt?: string }>, total?: number }} */ (
            await res.json()
          );

        const products = Array.isArray(data.products) ? data.products : [];
        allProducts = allProducts.concat(products);

        const total = typeof data.total === 'number' ? data.total : 0;
        if (products.length < limit || allProducts.length >= total) {
          hasMore = false;
        } else {
          page++;
        }
      }

      return allProducts
        .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
        .map((p) => ({
          loc: `${config.siteUrl}/${p.slug}`,
          lastmod: p.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }));
    } catch (_error) {
      return [];
    }
  },
};
