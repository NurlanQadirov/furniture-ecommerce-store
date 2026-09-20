import { cookies, headers } from 'next/headers';
import { LANGUAGE_COOKIE } from '@/lib/i18n/cookie';
import { defaultLanguage, supportedLanguages } from '@/lib/i18n/languages';
import { resources } from '@/lib/i18n/resources';
import { createTranslator, type Messages, type Translator } from '@/lib/i18n/translate';
import { LANGUAGE_HEADER } from '@/lib/seo/site';
import type { Language } from '@/types';

/**
 * Server-side language resolution.
 *
 * The choice used to live in `localStorage`, which the server cannot read: every
 * page was rendered in Azerbaijani and then re-rendered on the client for anyone
 * who wanted another language. A cookie is readable during the render, so the
 * first HTML a visitor receives is already in their language — and the client
 * needs neither i18next nor the other two locales to get there.
 */
export { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE } from '@/lib/i18n/cookie';

export function matchLanguage(tag: string | null | undefined): Language | null {
  if (!tag) return null;
  const normalized = tag.toLowerCase();
  return supportedLanguages.find((language) => normalized.startsWith(language)) ?? null;
}

/**
 * An explicit `?lang=` first, then the cookie, then what the browser asks for,
 * then Azerbaijani.
 *
 * The parameter reaches this function as a header `proxy.ts` set on the
 * request: layouts receive no `searchParams`, and the header is the only thing
 * both a layout and a page can read. It is what makes `hreflang` honest —
 * `/products?lang=ru` renders in Russian for a crawler that carries no cookie.
 */
export async function getLanguage(): Promise<Language> {
  const requestHeaders = await headers();

  const requested = matchLanguage(requestHeaders.get(LANGUAGE_HEADER));
  if (requested) return requested;

  const stored = matchLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value);
  if (stored) return stored;

  const acceptLanguage = requestHeaders.get('accept-language') ?? '';
  for (const part of acceptLanguage.split(',')) {
    // `az-AZ;q=0.9` — the tag is everything before the quality value.
    const matched = matchLanguage(part.split(';')[0]?.trim());
    if (matched) return matched;
  }

  return defaultLanguage;
}

export function getMessagesFor(language: Language): Messages {
  return resources[language].translation;
}

/** `const t = await getT();` inside a server component. */
export async function getT(): Promise<Translator> {
  return createTranslator(getMessagesFor(await getLanguage()));
}
