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
    '/shop/cart',
    '/shop/favorites',
    '/shop/history',
    '/shop/export',
    '/shop/table',
  ];
  console.log(productSlugs);

  const staticPages: MetadataRoute.Sitemap = staticPagesList.map((page) => {
    return {
      url: `${DOMAIN}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    };
  });
  const dynamicPages: MetadataRoute.Sitemap = productSlugs.map(
    (productSlug) => {
      return {
        url: `${DOMAIN}/retail/${productSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    },
  );

  return [...staticPages, ...dynamicPages];
}
