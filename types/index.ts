import type { TranslationKey } from '@/lib/i18n/resources';

/** A single catalogue item. Copy lives in the translation files, not here. */
export interface Product {
  id: number;
  /** i18next key resolving to the product name. */
  titleKey: TranslationKey;
  /** i18next key resolving to the product description. */
  descKey: TranslationKey;
  photo: string;
  /** Optional price in AZN; rendered only when present. */
  price?: number;
}

/** Supported interface languages. */
export type Language = 'az' | 'en' | 'ru';

export interface LanguageOption {
  code: Language;
  name: string;
}

/** One slide of the home page hero carousel. */
export interface HeroSlide {
  img: string;
  title: string;
  desc: string;
  subtitle: string;
}

/** Size variants of the language switcher. */
export type SwitcherSize = 'default' | 'small';
