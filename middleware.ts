import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Seamlessly redirect root '/' to '/payments' dashboard
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/payments', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
