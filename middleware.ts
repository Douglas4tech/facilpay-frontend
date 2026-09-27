import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
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
