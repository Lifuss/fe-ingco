import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // 1. Dashboard protection: Admin only
  if (pathname.startsWith('/dashboard')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Shop protection: Authenticated users only
  if (pathname.startsWith('/shop')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/shop/:path*'],
};
