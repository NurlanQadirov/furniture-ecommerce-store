import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/auth';

/** Route handlers re-check the session — middleware only guards the pages. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const unauthorized = () =>
  NextResponse.json({ error: 'unauthorized' }, { status: 401 });

export const notFound = (message = 'not found') =>
  NextResponse.json({ error: message }, { status: 404 });
