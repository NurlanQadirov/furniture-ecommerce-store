import type { Language, LanguageOption } from '@/types';

/**
 * The language list, kept apart from `resources.ts` on purpose.
 *
 * `resources.ts` imports all three locale files, so anything a client component
 * touches must not import from it — the switcher only needs these codes, not
 * every string in every language.
 */
export const defaultLanguage: Language = 'az';

export const supportedLanguages: Language[] = ['az', 'en', 'ru'];

export const languageOptions: LanguageOption[] = [
  { code: 'az', name: 'AZ' },
  { code: 'en', name: 'EN' },
  { code: 'ru', name: 'RU' },
];
