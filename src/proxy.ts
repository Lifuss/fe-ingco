import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  console.log('PROXY CHECK:', {
    pathname,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    role,
    cookiesKeys: Array.from(request.cookies.getAll()).map(c => c.name)
  });

  // 1. Dashboard protection: Admin only
  if (pathname.startsWith('/dashboard')) {
    if (!token || role !== 'admin') {
      console.warn('PROXY REDIRECTING FROM DASHBOARD:', { token: !!token, role });
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
