import Link from 'next/link';
import MagneticLink from '@/components/home/MagneticLink';
import { getT } from '@/lib/i18n/server';
import type { TranslationKey } from '@/lib/i18n/resources';

const PROMISES: [TranslationKey, TranslationKey][] = [
  ['quality_title', 'quality_desc'],
  ['delivery_title', 'delivery_desc'],
  ['warranty_title', 'warranty_desc'],
];

/** The close of the page: one clear ask, and the promises that back it. */
export default async function Commission() {
  const t = await getT();

  return (
    <section
      id="commission"
      aria-labelledby="commission-title"
      className="relative z-10 -mt-12 overflow-hidden rounded-t-[2rem] bg-lux-obsidian pb-20 pt-24 text-lux-sand md:rounded-t-[3rem] md:pb-28 md:pt-36"
    >
      {/* The hero's arch, returned as a hairline. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 580"
        className="pointer-events-none absolute -right-24 top-16 h-[110%] w-auto fill-none stroke-lux-brass/25 md:right-[4%]"
      >
        <path
          d="M1 579V200a199 199 0 0 1 398 0v379"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M41 579V210a159 159 0 0 1 318 0v369"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div data-reveal="pending" className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="animate-item font-spec text-[10px] uppercase tracking-[0.28em] text-lux-brass md:text-[11px]">
          05 — {t('home_commission_eyebrow')}
        </p>
        <h2 id="commission-title" className="mt-6 overflow-hidden pb-3">
          <span className="animate-item reveal-mask block max-w-[16ch] font-display text-[clamp(3rem,8.4vw,8.75rem)] font-light leading-[0.92] tracking-[-0.025em]">
            {t('home_commission_title')}
          </span>
        </h2>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <p className="animate-item max-w-lg text-base leading-relaxed text-lux-sand/70 lg:col-span-5">
            {t('home_commission_desc')}
          </p>
          <div className="animate-item flex flex-wrap gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end">
            <MagneticLink href="/contact" variant="solid-light" cursor={t('home_cursor_explore')}>
              {t('home_cta_bespoke')}
            </MagneticLink>
            <MagneticLink href="/calculator" variant="outline-light" cursor={t('home_cursor_view')}>
              {t('calc_title')}
            </MagneticLink>
          </div>
        </div>

        <div className="animate-item mt-20 grid border-t border-white/10 md:mt-28 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/calculator"
            className="group border-b border-white/10 py-8 pr-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-amber md:border-r lg:border-b-0"
          >
            <p className="font-spec text-[10px] tracking-[0.2em] text-lux-amber">00</p>
            <p className="mt-4 font-display text-2xl">
              {t('home_measure_title')}
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-lux-sand/60">
              {t('home_measure_desc')}
            </p>
          </Link>
          {PROMISES.map(([title, desc], index) => (
            <div
              key={title}
              className="border-b border-white/10 py-8 pr-6 md:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0 [&:nth-child(2)]:md:border-r-0 lg:[&:nth-child(2)]:border-r"
            >
              <p className="font-spec text-[10px] tracking-[0.2em] text-lux-sand/40">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-4 font-display text-2xl">{t(title)}</p>
              <p className="mt-2 text-sm leading-relaxed text-lux-sand/60">{t(desc)}</p>
            </div>
          ))}
        </div>

        <Link
          href="/about"
          className="animate-item mt-14 inline-flex items-center gap-3 font-spec text-[11px] uppercase tracking-[0.22em] text-lux-sand/60 transition-colors hover:text-lux-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-amber"
        >
          {t('about_us_more')}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
