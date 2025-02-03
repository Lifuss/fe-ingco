import type { MetadataRoute } from 'next';
import productSlugs from '@/lib/productSlugs.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const DOMAIN = 'https://ingco-service.win';
  const staticPagesList = [
    '/',
    '/auth/login',
    '/auth/register',
    '/home/contacts',
    '/home/support',
    '/retail/cart',
    '/retail/favorites',
    '/retail/history',
    '/service',
  ];

  const staticPages: MetadataRoute.Sitemap = staticPagesList.map((page) => {
    return {
      url: `${DOMAIN}${page}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: page === '/' ? 0.9 : 0.8,
    };
  });
  const dynamicPages: MetadataRoute.Sitemap = productSlugs.map(
    (productSlug) => {
      return {
        url: `${DOMAIN}/retail/${productSlug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    },
  );

  return [...staticPages, ...dynamicPages];
}
