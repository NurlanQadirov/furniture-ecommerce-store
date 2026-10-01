import { getT } from '@/lib/i18n/server';
import MaterialSelector from '@/components/home/atelier/MaterialSelector';
import FrameArchitecture from '@/components/home/atelier/FrameArchitecture';
import RoomTransformation from '@/components/home/atelier/RoomTransformation';

/**
 * Craft, made tangible: what the surfaces are, what is inside a seat, and how
 * a measured room becomes a furnished one.
 *
 * The section rides up over the hero's last frame (the negative top margin)
 * on rounded shoulders, and the frame card sits a step below the material
 * panel so the grid never reads as a spreadsheet.
 */
export default async function AtelierBento() {
  const t = await getT();

  return (
    <section
      id="atelier"
      aria-labelledby="atelier-title"
      className="relative z-10 -mt-[18svh] overflow-hidden rounded-t-[2rem] bg-lux-sand pb-28 pt-20 md:rounded-t-[3rem] md:pb-40 md:pt-28"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[2vw] top-0 select-none font-display text-[38vw] font-light leading-[0.8] text-lux-obsidian/[0.035] md:text-[22vw]"
      >
        02
      </span>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <header data-reveal="pending" className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="animate-item font-spec text-[10px] uppercase tracking-[0.28em] text-lux-stone md:text-[11px]">
              02 — {t('home_atelier_eyebrow')}
            </p>
            <h2 id="atelier-title" className="mt-5 overflow-hidden pb-2">
              <span className="animate-item reveal-mask block font-display text-[clamp(3rem,7vw,6.75rem)] font-light leading-[0.92] tracking-[-0.02em]">
                {t('home_atelier_title')}
              </span>
            </h2>
          </div>
          <p className="animate-item max-w-md text-[15px] leading-relaxed text-lux-obsidian/70 lg:col-span-4 lg:col-start-9 lg:pb-3">
            {t('home_atelier_desc')}
          </p>
        </header>

        <div
          data-reveal="pending"
          data-reveal-stagger="120"
          className="mt-14 grid gap-4 md:mt-20 md:gap-5 lg:grid-cols-12"
        >
          <div className="animate-item lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <MaterialSelector />
          </div>

          <div className="animate-item lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:mt-28">
            <FrameArchitecture />
          </div>

          <div className="animate-item flex min-h-[240px] flex-col justify-between rounded-[28px] bg-lux-cashmere p-7 lg:col-span-3 lg:col-start-1 lg:row-start-3">
            <p className="font-display text-6xl font-light tracking-[-0.02em]">FSC®</p>
            <p className="mt-8 text-sm leading-relaxed text-lux-obsidian/70">
              {t('home_stat_fsc')}
            </p>
          </div>

          <div className="animate-item relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[28px] bg-lux-moss p-7 text-lux-sand lg:col-span-4 lg:col-start-4 lg:row-start-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 300 24"
              className="w-full fill-none stroke-lux-brass"
              preserveAspectRatio="none"
            >
              <path
                d="M1 4v16M299 4v16M1 12h298M1 12l10-6M1 12l10 6M299 12l-10-6M299 12l-10 6"
                strokeWidth="1"
              />
            </svg>
            <p className="mt-6 font-display text-6xl font-light tracking-[-0.02em]">
              ±1 <span className="font-spec text-2xl tracking-normal">mm</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-lux-sand/75">
              {t('home_stat_tolerance')}
            </p>
          </div>

          <div className="animate-item mt-10 lg:col-span-12 lg:col-start-1 lg:row-start-4 lg:mt-20">
            <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-spec text-[10px] uppercase tracking-[0.28em] text-lux-stone md:text-[11px]">
                  03 — {t('home_room_eyebrow')}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2.25rem,4.4vw,4rem)] font-light leading-[1] tracking-[-0.015em]">
                  {t('home_room_title')}
                </h3>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-lux-obsidian/70 lg:col-span-4 lg:col-start-9">
                {t('home_room_desc')}
              </p>
            </div>
            <RoomTransformation />
          </div>
        </div>
      </div>
    </section>
  );
}
