import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminPassword,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!password || password !== getAdminPassword()) {
    // A deliberate pause blunts brute-forcing of the single shared password.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: 'Şifrə yanlışdır' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
