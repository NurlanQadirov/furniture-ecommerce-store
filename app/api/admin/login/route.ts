import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminEmail,
  getAdminPassword,
  normalizeEmail,
} from '@/lib/auth';

/**
 * Marks the session cookie Secure only when the request really arrived over
 * HTTPS — behind nginx that is what X-Forwarded-Proto reports. Keying this off
 * NODE_ENV instead would hand a Secure cookie to a site still served on a
 * plain-HTTP port, and the browser would never send it back.
 */
function isHttps(request: NextRequest): boolean {
  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded) return forwarded.split(',')[0]?.trim() === 'https';
  return request.nextUrl.protocol === 'https:';
}

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  const matches =
    Boolean(email) &&
    Boolean(password) &&
    normalizeEmail(email as string) === getAdminEmail() &&
    password === getAdminPassword();

  if (!matches) {
    // A deliberate pause blunts brute-forcing of the single shared account.
    await new Promise((resolve) => setTimeout(resolve, 600));
    // One message for both fields, so a wrong password cannot be told apart
    // from a wrong address.
    return NextResponse.json(
      { error: 'E-poçt və ya şifrə yanlışdır' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps(request),
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
