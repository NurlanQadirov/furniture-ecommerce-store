'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLanguage } from '@/lib/i18n/resources';
import type { Language, Localized } from '@/types';

/** Narrows an arbitrary i18next language tag onto a supported language. */
export function toLanguage(tag: string | undefined): Language {
  if (!tag) return defaultLanguage;
  if (tag.startsWith('en')) return 'en';
  if (tag.startsWith('ru')) return 'ru';
  return defaultLanguage;
}

/**
 * Picks a language variant from admin-authored content, falling back to
 * Azerbaijani (and then to any filled variant) so a half-translated product
 * never renders as an empty string.
 */
export function pickLocalized(
  value: Localized | undefined,
  language: string | undefined,
): string {
  if (!value) return '';
  const preferred = value[toLanguage(language)];
  if (preferred?.trim()) return preferred;
  if (value[defaultLanguage]?.trim()) return value[defaultLanguage];
  return Object.values(value).find((variant) => variant?.trim()) ?? '';
}

/** `const loc = useLocalized(); loc(product.name)` inside client components. */
export function useLocalized(): (value: Localized | undefined) => string {
  const { i18n } = useTranslation();
  const language = i18n.language;

  return useCallback((value: Localized | undefined) => pickLocalized(value, language), [
    language,
  ]);
}

/** An empty value of the shape every admin form starts from. */
export function emptyLocalized(): Localized {
  return { az: '', en: '', ru: '' };
}
