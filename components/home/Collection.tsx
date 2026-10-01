import Link from 'next/link';
import SiteImage from '@/components/SiteImage';
import MagneticLink from '@/components/home/MagneticLink';
import { getLanguage, getT } from '@/lib/i18n/server';
import { pickLocalized } from '@/lib/i18n/localized';
import type { Product } from '@/types';

/** Grid placement and crop per slot: one tall lead, two beside it, one wide. */
const SLOTS = [
  {
    cell: 'lg:col-span-7 lg:row-span-2',
    frame: 'aspect-[4/5] lg:aspect-auto lg:flex-1 lg:min-h-[520px]',
    sizes: '(min-width: 1024px) 56vw, 100vw',
  },
  {
    cell: 'lg:col-span-5',
    frame: 'aspect-[4/3]',
    sizes: '(min-width: 1024px) 40vw, 100vw',
  },
  {
    cell: 'lg:col-span-5',
    frame: 'aspect-[4/3]',
    sizes: '(min-width: 1024px) 40vw, 100vw',
  },
  {
    cell: 'lg:col-span-8 lg:col-start-3 lg:mt-10',
    frame: 'aspect-[16/9]',
    sizes: '(min-width: 1024px) 64vw, 100vw',
  },
];

interface CollectionProps {
  /** Starred in the admin panel, or the newest products before anything is starred. */
  products: Product[];
}

/** The live catalogue, set as an editorial spread rather than a product grid. */
export default async function Collection({ products }: CollectionProps) {
  if (products.length === 0) return null;

  const [t, language] = await Promise.all([getT(), getLanguage()]);
  const picks = products.slice(0, SLOTS.length);

  return (
    <section
      id="collection"
      aria-labelledby="collection-title"
      className="relative z-10 -mt-12 rounded-t-[2rem] bg-lux-cashmere pb-28 pt-20 md:rounded-t-[3rem] md:pb-40 md:pt-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header
          data-reveal="pending"
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="animate-item font-spec text-[10px] uppercase tracking-[0.28em] text-lux-stone md:text-[11px]">
              04 — {t('home_collection_eyebrow')}
            </p>
            <h2 id="collection-title" className="mt-5 overflow-hidden pb-2">
              <span className="animate-item reveal-mask block font-display text-[clamp(2.75rem,6vw,5.75rem)] font-light leading-[0.95] tracking-[-0.02em]">
                {t('catalog_picks_title')}
              </span>
            </h2>
            <p className="animate-item mt-4 max-w-md text-[15px] leading-relaxed text-lux-obsidian/70">
              {t('catalog_picks_subtitle')}
            </p>
          </div>
          <div className="animate-item">
            <MagneticLink href="/products" variant="outline-dark" cursor={t('home_cursor_view')}>
              {t('goToCatalog')}
            </MagneticLink>
          </div>
        </header>

        <div
          data-reveal="pending"
          data-reveal-stagger="140"
          className="mt-14 grid gap-x-5 gap-y-12 md:mt-20 lg:grid-cols-12"
        >
          {picks.map((product, index) => {
            const slot = SLOTS[index];
            if (!slot) return null;
            const name = pickLocalized(product.name, language);
            return (
              <article key={product.id} className={`animate-item ${slot.cell}`}>
                <Link
                  href={`/product/${product.id}`}
                  aria-label={t('aria_view_product', { name })}
                  data-cursor={t('home_cursor_specs')}
                  className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-amber"
                >
                  <div
                    className={`relative overflow-hidden rounded-[24px] bg-lux-linen ${slot.frame}`}
                  >
                    <SiteImage
                      src={product.mainImage}
                      alt={t('alt_product', { name })}
                      sizes={slot.sizes}
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-lux-sand/90 px-3 py-1.5 font-spec text-[10px] tracking-[0.18em] text-lux-obsidian">
                      N° {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-6 border-b border-lux-obsidian/10 pb-5">
                    <h3 className="font-display text-[1.75rem] font-normal leading-tight md:text-[2rem]">
                      {name}
                    </h3>
                    {typeof product.price === 'number' && (
                      <p className="whitespace-nowrap font-spec text-xs tracking-[0.12em] text-lux-obsidian/60">
                        {product.price} {t('currency_azn')}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
