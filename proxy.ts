import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, getPathWithoutLocale, isLocale, type Locale } from './app/i18n';

const PUBLIC_FILE = /\.[^/]+$/;

function pickLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

function withLocaleHeader(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];

  if (maybeLocale && isLocale(maybeLocale)) {
    if (maybeLocale === defaultLocale) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getPathWithoutLocale(pathname);

      const response = NextResponse.redirect(redirectUrl, 308);
      response.cookies.set('NEXT_LOCALE', defaultLocale, { path: '/' });
      return response;
    }

    return withLocaleHeader(request, maybeLocale);
  }

  return withLocaleHeader(request, pickLocale(request));
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
