import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from './i18n-config';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().toLowerCase())
    .filter(Boolean);

  // Simple pure matcher (no external libs)
  for (const lang of languages) {
    const matched = i18n.locales.find((locale) =>
      lang === locale ||
      lang.startsWith(locale + '-') ||
      locale.startsWith(lang)
    );
    if (matched) return matched;
  }

  return i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};