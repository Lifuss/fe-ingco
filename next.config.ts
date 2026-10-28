import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'be-ingco.store',
      },
      {
        protocol: 'https',
        hostname: 'api-ingco-service.win',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
  },
  // experimental flags disabled to avoid prerender errors
  // experimental: {
  //   optimizeCss: true,
  //   optimizePackageImports: ['lucide-react', 'react-toastify'],
  // },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.doubleclick.net https://*.googleadservices.com https://www.google.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://api-ingco-service.win https://be-ingco.store http://localhost:8080 https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://www.google.com.ua https://*.doubleclick.net https://*.googleadservices.com https://i.ytimg.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api-ingco-service.win https://be-ingco.store http://localhost:8080 https://api.monobank.ua https://api.novaposhta.ua https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.google.com https://www.google.com.ua https://*.doubleclick.net https://*.googleadservices.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
              "frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://*.doubleclick.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/export',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'page' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'query' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'category' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'sortValue' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'page' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'filters' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'sortValue' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'query' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'view' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'minPower' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'maxPower' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'battery' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/categories/:categorySlug',
        has: [{ type: 'query', key: 'mains' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow',
          },
        ],
      },
      {
        source: '/cart',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/favorites',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/history',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/home/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/:productSlug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/',
        permanent: true,
      },
      {
        source: '/shop/cart',
        destination: '/cart',
        permanent: true,
      },
      {
        source: '/shop/favorites',
        destination: '/favorites',
        permanent: true,
      },
      {
        source: '/shop/history',
        destination: '/history',
        permanent: true,
      },
      {
        source: '/shop/export',
        destination: '/export',
        permanent: true,
      },
      {
        source: '/shop/:productSlug',
        destination: '/:productSlug',
        permanent: true,
      },
      {
        source: '/retail',
        destination: '/',
        permanent: true,
      },
      {
        source: '/retail/cart',
        destination: '/cart',
        permanent: true,
      },
      {
        source: '/retail/favorites',
        destination: '/favorites',
        permanent: true,
      },
      {
        source: '/retail/history',
        destination: '/history',
        permanent: true,
      },
      {
        source: '/retail/:productSlug',
        destination: '/:productSlug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
