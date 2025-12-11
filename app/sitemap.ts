import type { MetadataRoute } from 'next';
import productSlugs from '@/lib/productSlugs.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const DOMAIN = 'https://ingco-service.win';
  const currentDate = new Date().toISOString();

  const staticPagesList = [
    {
      url: '/',
      priority: 1.0,
      changeFrequency: 'daily' as const,
      lastModified: currentDate,
    },
    {
      url: '/home',
      priority: 0.9,
      changeFrequency: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      url: '/retail',
      priority: 0.9,
      changeFrequency: 'daily' as const,
      lastModified: currentDate,
    },
    {
      url: '/shop',
      priority: 0.9,
      changeFrequency: 'daily' as const,
      lastModified: currentDate,
    },
    {
      url: '/auth/login',
      priority: 0.3,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/auth/register',
      priority: 0.3,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/home/contacts',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/home/support',
      priority: 0.6,
      changeFrequency: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      url: '/retail/cart',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/retail/favorites',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/retail/history',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPagesList.map((page) => {
    return {
      url: `${DOMAIN}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    };
  });

  const dynamicRetailPages: MetadataRoute.Sitemap = productSlugs.map(
    (productSlug) => {
      return {
        url: `${DOMAIN}/retail/${productSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    },
  );
// Because shop is B2B, we don't need to index it, it only worsen
  // const dynamicShopPages: MetadataRoute.Sitemap = productSlugs.map(
  //   (productSlug) => {
  //     return {
  //       url: `${DOMAIN}/shop/${productSlug}`,
  //       lastModified: currentDate,
  //       changeFrequency: 'weekly',
  //       priority: 0.8,
  //     };
  //   },
  // );

  return [...staticPages, ...dynamicRetailPages];
}
