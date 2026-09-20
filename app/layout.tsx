import type { Metadata } from 'next';
import { Allura, Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
import { getLanguage, getMessagesFor } from '@/lib/i18n/server';
import { createTranslator } from '@/lib/i18n/translate';
import { SITE_NAME, SITE_URL } from '@/lib/seo/site';
import '@/app/globals.css';

/**
 * Same three families (and the same weights) the Vite app pulled from the
 * Google Fonts CDN, now self-hosted and exposed to Tailwind as CSS variables.
 * `latin-ext` carries the Azerbaijani glyphs (ə, ğ, ş…) and `cyrillic` the
 * Russian ones.
 */
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300'],
  variable: '--font-poppins',
  display: 'swap',
  // Poppins ships no Cyrillic: Russian copy has to reach the plain `sans-serif`
  // fallback the CDN version fell through to, not a metric-adjusted stand-in.
  adjustFontFallback: false,
});

const allura = Allura({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'swap',
  // Same reason as Poppins — Cyrillic headings must land on plain `serif`.
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  // Not preloaded, unlike the other two. Inter's three subset files are 148 KB
  // together — more than every other font here — and nothing on a phone's
  // first screen is set in it: the nav that uses it is `hidden md:flex`, and
  // the mobile menu that repeats it starts closed. Preloading it meant 148 KB
  // of high-priority requests racing the hero image on a slow connection.
  // Dropped from the preload list it still arrives whenever something is
  // actually painted in it, one subset at a time.
  preload: false,
});

/**
 * Site-wide defaults. Every public page then overrides the title, description
 * and social cards through `pageMetadata`, which also emits the `hreflang`
 * cluster; what stays here is what no page needs to restate.
 */
export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = createTranslator(getMessagesFor(language));

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('seo_home_title'),
      template: `%s | ${SITE_NAME}`,
    },
    description: t('seo_home_description'),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'furniture',
    referrer: 'origin-when-cross-origin',
    // The phone number and the Baku address are contact details, not accidents
    // of formatting: let the browser linkify them.
    formatDetection: { telephone: true, address: true, email: true },
    icons: {
      icon: '/Logo2.png',
      shortcut: '/Logo2.png',
      apple: '/Logo2.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

/**
 * The catalogue, contact details and calculator tariffs all live in a JSON
 * store the owner edits at runtime, so nothing below this layout may be
 * captured into the build output.
 */
export const dynamic = 'force-dynamic';

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // `lang` was pinned to Azerbaijani while the page below it rendered in
  // Russian or English, which mis-declares the document to screen readers,
  // to translation tooling and to every crawler that reads the attribute.
  const language = await getLanguage();

  return (
    <html
      lang={language}
      dir="ltr"
      className={`${poppins.variable} ${allura.variable} ${inter.variable}`}
    >
      <body className="bg-white">{children}</body>
    </html>
  );
}
