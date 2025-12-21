/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ingco-service.win',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  autoLastmod: true,
  exclude: ['/dashboard*', '/api*', '/_next*', '/admin*', '/private*', '/service*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          '*.json',
          '/service/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/_next/', '/admin/', '/private/'],
      },
    ],
  },
  additionalPaths: async (config) => {
    const apiBase = process.env.NEXT_PUBLIC_API;
    if (!apiBase) return [];

    try {
      const res = await fetch(`${apiBase}/api/products?limit=10000&isRetail=true`);
      if (!res.ok) return [];

      const data = /** @type {{ products?: Array<{ slug?: string, updatedAt?: string }> }} */ (
        await res.json()
      );

      const products = Array.isArray(data.products) ? data.products : [];

      return products
        .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
        .map((p) => ({
          loc: `${config.siteUrl}/${p.slug}`,
          lastmod: p.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }));
    } catch {
      return [];
    }
  },
};


