import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // The stylesheets were the page's only render-blocking requests: on a
    // throttled phone connection the first paint waited ~1.6 s for them.
    // Inlined into the HTML they arrive with the first response.
    inlineCss: true,
  },
  images: {
    // AVIF first: the hero photograph is the largest paint on a phone and
    // comes out roughly a third smaller than the WebP at the same quality.
    formats: ['image/avif', 'image/webp'],
    // The widest source asset is 2560px, so asking sharp for 3840 only
    // enlarges it — 40 KB more for no extra detail on retina desktops.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
