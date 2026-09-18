import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from '@/types';
import { defaultLanguage, resources, supportedLanguages } from '@/lib/i18n/resources';

/** Storage key kept from the Vite app so returning visitors keep their choice. */
export const LANGUAGE_STORAGE_KEY = 'i18nextLng';

let instance: I18nInstance | null = null;

/**
 * Returns the shared i18next instance, creating it on first use.
 *
 * It is initialised with an explicit `lng` so the server render and the first
 * client render always agree (no hydration mismatch). The stored/browser
 * language is applied straight after mount — see `I18nProvider`.
 */
export function getI18n(): I18nInstance {
  if (instance) return instance;

  const i18n = createInstance();

  i18n.use(initReactI18next).init({
    debug: false,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    resources,
    react: {
      useSuspense: false,
    },
  });

  instance = i18n;
  return i18n;
}

/** Maps a raw locale tag (`en-US`, `ru`) onto a supported language. */
export function matchLanguage(tag: string | null | undefined): Language | null {
  if (!tag) return null;
  const normalized = tag.toLowerCase();
  return supportedLanguages.find((lng) => normalized.startsWith(lng)) ?? null;
}

/**
 * Client-side language detection mirroring the `i18next-browser-languagedetector`
 * defaults the Vite app relied on: the cached choice first, then the browser's
 * preferred languages, then the fallback.
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage;

  try {
    const cached = matchLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (cached) return cached;
  } catch {
    // localStorage can throw in private mode — fall through to navigator.
  }

  const navigatorLanguages: readonly string[] =
    window.navigator.languages ?? [window.navigator.language];

  for (const tag of navigatorLanguages) {
    const matched = matchLanguage(tag);
    if (matched) return matched;
  }

  return defaultLanguage;
}

/** Persists the active language, replacing the detector plugin's caching. */
export function persistLanguage(language: string): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage unavailable — the language still applies for this session.
  }
}
