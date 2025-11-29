import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/spaces', request.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/spaces', request.url));
  }

  // Admin routes are currently disabled - all users have same access

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/booking/:path*', '/dashboard/:path*', '/admin/:path*', '/spaces/:path*', '/api/bookings/:path*'],
};