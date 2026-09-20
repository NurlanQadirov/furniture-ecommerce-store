import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth';
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE } from '@/lib/i18n/cookie';
import { supportedLanguages } from '@/lib/i18n/languages';
import { LANGUAGE_HEADER, LANGUAGE_QUERY } from '@/lib/seo/site';
import type { Language } from '@/types';

/** Guards the admin panel: API routes re-check the session themselves. */
async function guardAdmin(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const authenticated = await verifySessionToken(
    request.cookies.get(ADMIN_COOKIE)?.value,
  );

  if (!authenticated && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return null;
}

/**
 * Makes `?lang=` an addressable language.
 *
 * The switcher writes a cookie, which the server can read but a crawler never
 * sends — so without this every `hreflang` on the site would point at the same
 * Azerbaijani page. The parameter is forwarded to the render as a header (see
 * `getLanguage`) and mirrored into the cookie, so a shared `?lang=ru` link both
 * answers in Russian and keeps answering in Russian as the visitor clicks on.
 */
export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return (await guardAdmin(request)) ?? NextResponse.next();
  }

  const requested = request.nextUrl.searchParams.get(LANGUAGE_QUERY);
  const language = supportedLanguages.find(
    (code): code is Language => code === requested,
  );

  const headers = new Headers(request.headers);
  if (language) headers.set(LANGUAGE_HEADER, language);

  const response = NextResponse.next({ request: { headers } });
  if (language) {
    response.cookies.set(LANGUAGE_COOKIE, language, {
      path: '/',
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  // One URL answering in three languages would need `Vary: Cookie` in front of
  // any shared cache. Next rewrites `Vary` itself and every page under this
  // matcher is `force-dynamic`, so nothing between here and the browser is
  // allowed to store a response in the first place.
  return response;
}

export const config = {
  // Pages only: Next's own assets, uploaded photos, the API and anything with a
  // file extension (robots.txt, sitemap.xml, /Logo2.png…) need neither the
  // admin guard nor a language.
  matcher: ['/((?!_next/|api/|uploads/|.*\\.[^/]+$).*)'],
};
