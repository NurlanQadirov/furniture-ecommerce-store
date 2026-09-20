import type { Metadata } from 'next';
import { getLanguage, getMessagesFor } from '@/lib/i18n/server';
import { createTranslator, type Translator } from '@/lib/i18n/translate';
import { supportedLanguages } from '@/lib/i18n/languages';
import {
  SITE_NAME,
  SITE_URL,
  absoluteImageUrl,
  alternatesFor,
  clampDescription,
  defaultOgImage,
  localizedUrl,
  ogLocales,
} from '@/lib/seo/site';
import type { Language } from '@/types';

/**
 * One builder for every page's `generateMetadata`.
 *
 * Next merges metadata shallowly, so a page that declares `openGraph` replaces
 * the layout's copy of it wholesale rather than adding to it. Composing the
 * whole object here is what keeps the OpenGraph and Twitter cards — and the
 * `hreflang` cluster — from silently going missing on the pages that override
 * anything at all.
 */

export interface PageMetadataOptions {
  /** Route path, no origin and no language parameter: `/products/qarderob`. */
  path: string;
  title: string;
  description: string;
  /** Skips the `… | Mebeltech` template — used by the home page. */
  titleIsAbsolute?: boolean;
  /** Page-specific pictures; falls back to the hero photo. */
  images?: (string | undefined)[];
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  /** `article:published_time`, used by product pages. */
  publishedTime?: string;
  language?: Language;
  t?: Translator;
}

export async function pageMetadata(options: PageMetadataOptions): Promise<Metadata> {
  const language = options.language ?? (await getLanguage());
  const t = options.t ?? createTranslator(getMessagesFor(language));

  const description = clampDescription(options.description);
  const url = localizedUrl(options.path, language);

  const images = (options.images ?? [])
    .map(absoluteImageUrl)
    .filter((image): image is string => Boolean(image));
  const ogImages = (images.length > 0 ? images : [defaultOgImage]).slice(0, 4).map((image) => ({
    url: image,
    alt: options.title,
  }));

  // The title the card shows has to be the finished one: OpenGraph never sees
  // the layout's `%s | Mebeltech` template.
  const socialTitle = options.titleIsAbsolute
    ? options.title
    : `${options.title} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: options.titleIsAbsolute ? { absolute: options.title } : options.title,
    description,
    keywords: options.keywords ?? t('seo_keywords').split(',').map((word) => word.trim()),
    alternates: alternatesFor(options.path, language),
    openGraph: {
      type: options.type ?? 'website',
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url,
      locale: ogLocales[language],
      alternateLocale: supportedLanguages
        .filter((code) => code !== language)
        .map((code) => ogLocales[code]),
      images: ogImages,
      ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}
