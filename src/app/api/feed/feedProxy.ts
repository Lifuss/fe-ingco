import { NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API || 'http://localhost:8080').replace(/\/$/, '');

/**
 * Shared proxy helper for marketplace feeds.
 * Proxies requests to backend FeedsModule with 180-minute (3h) cache.
 */
export async function proxyFeed(backendPath: string, contentType: 'xml' | 'json') {
  try {
    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      next: { revalidate: 10800 }, // 180 minutes (3 hours)
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const isXml = contentType === 'xml';
    const body = isXml ? await res.text() : JSON.stringify(await res.json());

    return new NextResponse(body, {
      headers: {
        'Content-Type': isXml
          ? 'application/xml; charset=utf-8'
          : 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error(`Failed to fetch feed from ${backendPath}:`, error);
    return new NextResponse('Failed to generate feed', { status: 500 });
  }
}
