import type { Language, LanguageOption } from '@/types';
import { az } from '@/lib/i18n/locales/az';
import { en } from '@/lib/i18n/locales/en';
import { ru } from '@/lib/i18n/locales/ru';

/** Every translation key available to `t()`, derived from the Azerbaijani source of truth. */
export type TranslationKey = keyof typeof az;

/** Shape every locale file has to satisfy, so locales can never drift apart. */
export type Translation = { [K in TranslationKey]: string };

export const defaultLanguage: Language = 'az';

export const supportedLanguages: Language[] = ['az', 'en', 'ru'];

export const languageOptions: LanguageOption[] = [
  { code: 'az', name: 'AZ' },
  { code: 'en', name: 'EN' },
  { code: 'ru', name: 'RU' },
];

export const resources: Record<Language, { translation: Translation }> = {
  az: { translation: az },
  en: { translation: en },
  ru: { translation: ru },
};
