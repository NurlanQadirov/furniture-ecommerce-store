import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

/**
 * The two families only the home page sets type in.
 *
 * Declared here rather than in the root layout so their CSS and preload hints
 * ride on `/` alone: the catalogue, calculator and admin never pay for them.
 * Both cover `latin-ext` (ə, ğ, ş) and `cyrillic`, so all three languages land
 * on the intended face instead of a fallback. The geometric sans is the Inter
 * the root layout already loads.
 */
export const displayFont = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  // Not preloaded. Three subsets in two styles are six files, ~190 KB, and
  // as preloads they all went out at the highest priority — on a slow phone
  // connection ahead of the hero photograph, which is the page's largest
  // paint. Left to the (inlined) stylesheet, the browser fetches only the
  // subsets and styles the visible text actually uses; the metric-matched
  // fallback holds the headline's shape until then.
  preload: false,
});

export const specFont = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400'],
  variable: '--font-spec',
  display: 'swap',
  // Spec labels are small and never above the fold's headline; let them
  // arrive behind the display face and the hero photograph.
  preload: false,
});
