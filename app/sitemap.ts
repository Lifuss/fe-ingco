import type { MetadataRoute } from 'next';
import { Product } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMAIN = 'https://ingco-service.win';
  const currentDate = new Date().toISOString();
  const BACKEND_API = `${process.env.NEXT_PUBLIC_API}/api/products`;

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
      url: '/cart',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/favorites',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/history',
      priority: 0.2,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/offer',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/privacy',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/terms',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/returns',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/shipping',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      url: '/legal/cookies',
      priority: 0.4,
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

  let dynamicRetailPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${BACKEND_API}?limit=10000&isRetail=true`, {
      next: { revalidate: 86400 },
    });

    if (response.ok) {
      const { products } = (await response.json()) as { products: Product[] };
      
      dynamicRetailPages = products
        .filter((product) => product.slug)
        .map((product) => {
          return {
            url: `${DOMAIN}/${product.slug}`,
            lastModified: product.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          };
        });
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return [...staticPages, ...dynamicRetailPages];
}
