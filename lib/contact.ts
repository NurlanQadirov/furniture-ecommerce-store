/**
 * Lives outside `SiteDataProvider` because that module is `'use client'`: a
 * server component importing a function from there would get a client
 * reference, not the function.
 */

/** Builds a `wa.me` deep link, stripping everything but digits from the number. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}
