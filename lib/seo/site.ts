import { defaultLanguage, supportedLanguages } from '@/lib/i18n/languages';
import type { Language } from '@/types';

/**
 * Where the site answers from, and how one page is addressed in three
 * languages.
 *
 * The language is a cookie, not a path segment, so every page has exactly one
 * URL no matter which language a visitor reads it in. That is fine for people
 * and useless for crawlers: `hreflang` has to point at URLs that actually
 * differ, and a bot carries no cookie. `?lang=` is the addressable form of the
 * same choice — `proxy.ts` turns the parameter into the request language, so
 * `/products?lang=ru` really does answer in Russian.
 *
 * Azerbaijani is the default and keeps the bare URL, which is also `x-default`.
 */

const FALLBACK_ORIGIN = 'https://mebeltech.az';

/** Strips a trailing slash and anything after the origin, so joins stay clean. */
function normalizeOrigin(value: string | undefined): string {
  if (!value?.trim()) return FALLBACK_ORIGIN;
  try {
    return new URL(value.trim()).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export const SITE_URL = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_NAME = 'Mebeltech';

/** The query parameter, and the header `proxy.ts` forwards it in. */
export const LANGUAGE_QUERY = 'lang';
export const LANGUAGE_HEADER = 'x-mebeltech-language';

/** OpenGraph wants a full locale, not the bare language code. */
export const ogLocales: Record<Language, string> = {
  az: 'az_AZ',
  en: 'en_US',
  ru: 'ru_RU',
};

/** `hreflang` values, which are region-less on purpose: the audience is one country. */
export const hrefLangs: Record<Language, string> = {
  az: 'az',
  en: 'en',
  ru: 'ru',
};

/**
 * `/products` → `https://…/products`; `/` → `https://…` with no trailing slash.
 *
 * The root is bare on purpose: Next strips the trailing slash when it resolves
 * a canonical against `metadataBase`, so anything that spells the home page
 * differently — the sitemap, an `hreflang` target — would disagree with the
 * canonical Next actually emits, which is exactly what an audit flags.
 */
export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  if (path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * A stable IRI for one schema.org node. Unlike `absoluteUrl` the root keeps its
 * slash here, so an `@id` never reads as `https://host#thing`.
 */
export function nodeId(path: string, fragment: string): string {
  return `${path === '/' ? `${SITE_URL}/` : absoluteUrl(path)}#${fragment}`;
}

/** The addressable URL of one page in one language. Azerbaijani keeps the bare path. */
export function localizedUrl(path: string, language: Language): string {
  if (language === defaultLanguage) return absoluteUrl(path);
  // `https://host?lang=en` is legal but Next normalises it to `https://host/?…`;
  // spelling it out keeps the alternate and the canonical byte-identical.
  const base = path === '/' ? `${SITE_URL}/` : absoluteUrl(path);
  return `${base}${base.includes('?') ? '&' : '?'}${LANGUAGE_QUERY}=${language}`;
}

/**
 * The `alternates` block every page hands to the Metadata API: a
 * self-referencing canonical plus the full `hreflang` cluster.
 */
export function alternatesFor(path: string, language: Language) {
  const languages = Object.fromEntries([
    ...supportedLanguages.map((code) => [hrefLangs[code], localizedUrl(path, code)]),
    ['x-default', absoluteUrl(path)],
  ]);

  return { canonical: localizedUrl(path, language), languages };
}

/** Turns an admin-entered image path into something a crawler can fetch. */
export function absoluteImageUrl(src: string | undefined): string | undefined {
  if (!src?.trim()) return undefined;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return absoluteUrl(src.startsWith('/') ? src : `/${src}`);
}

/** The social preview used wherever a page has no picture of its own. */
export const defaultOgImage = absoluteUrl('/furniture.jpg');

/**
 * Descriptions are cut to what a search result actually shows, on a word
 * boundary, so a snippet never ends mid-word with Google's own ellipsis.
 */
export function clampDescription(value: string, max = 160): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
