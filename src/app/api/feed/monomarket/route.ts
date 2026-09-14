import { NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API || 'http://localhost:8080').replace(/\/$/, '');

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/monomarket/xml`, {
      next: { revalidate: 10800 }, // 180 minutes (3 hours)
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const xml = await res.text();

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('Failed to generate / fetch monomarket XML feed:', error);
    return new NextResponse('Failed to generate feed', { status: 500 });
  }
}
