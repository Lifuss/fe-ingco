import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    const parsed = JSON.parse(decodedJson);
    return typeof parsed.role === 'string' ? parsed.role.toLowerCase() : null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const rawRole = request.cookies.get('role')?.value?.toLowerCase();
  const tokenRole = getRoleFromToken(token);
  const effectiveRole = rawRole || tokenRole;

  console.log('PROXY CHECK:', {
    pathname,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    rawRole,
    tokenRole,
    effectiveRole,
    cookiesKeys: Array.from(request.cookies.getAll()).map((c) => c.name),
  });

  // 1. Dashboard protection: Admin only
  if (pathname.startsWith('/dashboard')) {
    if (!token || effectiveRole !== 'admin') {
      console.warn('PROXY REDIRECTING FROM DASHBOARD:', { token: !!token, effectiveRole });
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Export protection: Authenticated users only
  if (pathname.startsWith('/export')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/export/:path*'],
};
