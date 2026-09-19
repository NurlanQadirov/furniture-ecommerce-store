import Image from 'next/image';

/**
 * A `fill` image for catalogue content, safe against any URL the panel holds.
 *
 * Product and category pictures are whatever the owner typed into the admin
 * panel: an upload under `/uploads`, an Unsplash link, or some other host
 * entirely. `next/image` refuses a host that is not in `next.config.ts`, and
 * would answer 400 instead of showing the photo — so anything it cannot
 * optimise falls back to a plain `<img>`, which is exactly what this site
 * used to serve everywhere.
 *
 * Keep this list in step with `images.remotePatterns` in `next.config.ts`.
 */
const OPTIMIZABLE_HOSTS = ['images.unsplash.com'];

function canOptimize(src: string): boolean {
  // Uploads and anything else served from this site.
  if (src.startsWith('/')) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

interface SiteImageProps {
  src: string;
  alt: string;
  /** Passed straight to next/image; describes the rendered width per breakpoint. */
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function SiteImage({
  src,
  alt,
  sizes,
  className = 'object-cover',
  priority = false,
}: SiteImageProps) {
  if (!canOptimize(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
  );
}
