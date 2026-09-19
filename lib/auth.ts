/**
 * Minimal single-owner admin session.
 *
 * The panel has exactly one user — the workshop owner — so there is no user
 * table: a password from the environment is exchanged for an HMAC-signed cookie.
 * Web Crypto is used (rather than `node:crypto`) so the same helpers run in the
 * Edge middleware and in the Node route handlers.
 */

export const ADMIN_COOKIE = 'mebeltech_admin';

/** Seven days — long enough that the owner is not re-typing the password weekly. */
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'mebeltech2024';
}

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? `${getAdminPassword()}::mebeltech-session`;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Builds the cookie value for a freshly authenticated session. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${await sign(String(expiresAt))}`;
}

/** Constant-time-ish comparison; both sides are hex of the same length. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const separator = token.lastIndexOf('.');
  if (separator < 1) return false;

  const expiresAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  return safeEqual(signature, await sign(expiresAt));
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
