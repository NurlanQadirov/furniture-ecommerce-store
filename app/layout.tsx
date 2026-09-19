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
  // Not preloaded, unlike the other two. Inter's three subset files are 148 KB
  // together — more than every other font here — and nothing on a phone's
  // first screen is set in it: the nav that uses it is `hidden md:flex`, and
  // the mobile menu that repeats it starts closed. Preloading it meant 148 KB
  // of high-priority requests racing the hero image on a slow connection.
  // Dropped from the preload list it still arrives whenever something is
  // actually painted in it, one subset at a time.
  preload: false,
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
