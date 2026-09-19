import type { Language } from '@/types';
import { az } from '@/lib/i18n/locales/az';
import { en } from '@/lib/i18n/locales/en';
import { ru } from '@/lib/i18n/locales/ru';

/** Every translation key available to `t()`, derived from the Azerbaijani source of truth. */
export type TranslationKey = keyof typeof az;

/** Shape every locale file has to satisfy, so locales can never drift apart. */
export type Translation = { [K in TranslationKey]: string };

/**
 * All three languages. Server-only by convention: importing this from a client
 * component would ship every locale to the browser. Client code gets the active
 * language's strings through `TranslationProvider`.
 */
export const resources: Record<Language, { translation: Translation }> = {
  az: { translation: az },
  en: { translation: en },
  ru: { translation: ru },
};
