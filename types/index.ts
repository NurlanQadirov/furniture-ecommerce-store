import type { TranslationKey } from '@/lib/i18n/resources';

/** Supported interface languages. */
export type Language = 'az' | 'en' | 'ru';

/** A string that carries one variant per supported language. */
export type Localized = Record<Language, string>;

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

/**
 * A catalogue group — "Mətbəx mebeli", "Salon mebeli"… Managed from the admin
 * panel, so every visible string is localised data rather than an i18n key.
 */
export interface Category {
  id: string;
  /** URL segment used by `/products/[slug]`. */
  slug: string;
  name: Localized;
  description: Localized;
  /** Cover image shown on the category card. */
  image: string;
  /** Ascending sort key used across the catalogue. */
  order: number;
}

/** A single catalogue item, owned by exactly one category. */
export interface Product {
  id: string;
  categoryId: string;
  name: Localized;
  description: Localized;
  /** Card and hero image. */
  mainImage: string;
  /** Extra photos shown in the detail page gallery. */
  images: string[];
  /** Optional price in AZN; rendered only when present. */
  price?: number;
  /** Starred in the admin panel — surfaces on the home page. */
  featured: boolean;
  order: number;
  createdAt: string;
}

/** Contact details rendered in the header, footer, contact page and calculator. */
export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: Localized;
  instagram: string;
  /** Optional Google Maps embed URL for the contact page. */
  mapEmbedUrl: string;
}

/** A measurement request captured by the calculator. */
export interface Lead {
  id: string;
  name: string;
  phone: string;
  /** Human readable summary of the configuration that produced the estimate. */
  summary: string;
  estimateMin: number;
  estimateMax: number;
  createdAt: string;
}

export type { TranslationKey };
