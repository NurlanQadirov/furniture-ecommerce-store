/**
 * Shared between the server (which reads the cookie during the render) and the
 * switcher (which writes it). Kept in its own module so the client does not
 * import `server.ts`, which pulls in `next/headers` and every locale.
 */
export const LANGUAGE_COOKIE = 'lang';

/** A year: the choice should outlive the session, as the old storage key did. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
