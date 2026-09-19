import type { Metadata } from 'next';
import { Allura, Inter, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
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
});

export const metadata: Metadata = {
  title: 'Mebel Tech',
  description:
    'Evinizə və ofisinizə rahatlıq, funksionallıq və gözəllik gətirən müasir mebel həlləri.',
  icons: {
    icon: '/Logo2.png',
  },
};

/**
 * The catalogue, contact details and calculator tariffs all live in a JSON
 * store the owner edits at runtime, so nothing below this layout may be
 * captured into the build output.
 */
export const dynamic = 'force-dynamic';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="az"
      className={`${poppins.variable} ${allura.variable} ${inter.variable}`}
    >
      <body className="bg-white">{children}</body>
    </html>
  );
}
