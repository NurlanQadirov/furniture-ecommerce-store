'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import { ALL_HOTSPOTS, SCENES, TIMELINE } from '@/components/home/content';
import MagneticLink from '@/components/home/MagneticLink';
import SceneLayer from '@/components/home/hero/SceneLayer';
import { HotspotSpecs } from '@/components/home/hero/Hotspot';
import useMediaQuery from '@/components/home/useMediaQuery';
import { SITE_NAME } from '@/lib/seo/site';

/* -------------------------------------------------------------------------- */
/* Curves                                                                     */
/* -------------------------------------------------------------------------- */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const segment = (p: number, [start, end]: readonly [number, number]) =>
  clamp01((p - start) / (end - start));

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeInQuad = (t: number) => t * t;

/**
 * A camera move between two magnifications.
 *
 * Interpolating the logarithm rather than the scale keeps the apparent speed
 * constant: 1→2 and 4→8 feel like the same push, which is what makes a long
 * zoom read as walking forward instead of accelerating into the wall.
 */
const dolly = (from: number, to: number, t: number) =>
  Math.exp(lerp(Math.log(from), Math.log(to), t));

/** The share of the stage the closing frame shrinks the last room to. */
const FRAME_SCALE = 0.5;

/** Fades something in and out across a `[in, full, hold, out]` window. */
function useBand(progress: MotionValue<number>, range: readonly number[]) {
  const opacity = useTransform(progress, [...range], [0, 1, 1, 0]);
  const visibility = useTransform(opacity, (value): string =>
    value > 0.01 ? 'visible' : 'hidden',
  );
  return { opacity, visibility };
}

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function IntroCopy({ style }: { style?: MotionStyle }) {
  const t = useT();
  // Moved, never faded. The headline is a candidate for the page's largest
  // paint, and the calls to action must be visible in the server HTML: an
  // opacity ramp would hide both until hydration, or for good without JS.
  const rise = (delay: number) => ({
    initial: { y: 28 },
    animate: { y: 0 },
    transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <m.div className="absolute inset-x-0 bottom-0 z-20" style={style}>
      <div className="bg-gradient-to-t from-lux-obsidian/85 via-lux-obsidian/55 to-transparent pb-8 pt-40 md:pb-14 md:pt-56">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <m.p
            {...rise(0.05)}
            className="font-spec text-[10px] uppercase tracking-[0.28em] text-lux-sand/75 md:text-[11px]"
          >
            {t('home_hero_eyebrow')}
          </m.p>
          <m.h1
            {...rise(0)}
            className="mt-4 max-w-[13ch] font-display text-[clamp(2.75rem,7.4vw,7.25rem)] font-light leading-[0.94] tracking-[-0.02em] text-lux-sand"
          >
            {t('home_hero_title')}
          </m.h1>
          <div className="mt-7 flex flex-col gap-7 md:mt-10 md:flex-row md:items-end md:justify-between">
            <m.p
              {...rise(0.35)}
              className="max-w-md text-sm leading-relaxed text-lux-sand/80 md:text-base"
            >
              {t('home_hero_lede')}
            </m.p>
            <m.div {...rise(0.5)} className="flex flex-wrap gap-3">
              <MagneticLink href="/products" variant="solid-light" cursor={t('home_cursor_view')}>
                {t('goToCatalog')}
              </MagneticLink>
              <MagneticLink
                href="/contact"
                variant="outline-light"
                cursor={t('home_cursor_explore')}
              >
                {t('home_cta_bespoke')}
              </MagneticLink>
            </m.div>
          </div>
        </div>
      </div>
    </m.div>
  );
}

/**
 * Where the site header turns transparent and light: everywhere over the hero
 * except its last stretch, which the next section slides up to cover.
 */
function HeaderOverlayZone() {
  return (
    <div
      data-header-overlay
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 bottom-[18svh]"
    />
  );
}

/** Which pin is open: one the scroll reached, one under the pointer, or one tapped. */
function useHotspotFocus() {
  const [autoId, setAutoId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  return {
    activeId: pinnedId ?? hoverId ?? autoId,
    setAutoId: (id: string | null) => {
      setAutoId(id);
      // A tap holds a card open only until the scroll moves on to the next one.
      setPinnedId(null);
    },
    onHover: setHoverId,
    onToggle: (id: string) => setPinnedId((current) => (current === id ? null : id)),
  };
}

/* -------------------------------------------------------------------------- */
/* The scroll-driven walk-through                                             */
/* -------------------------------------------------------------------------- */

function ScrollHero() {
  const t = useT();
  const isDesktop = useMediaQuery('(min-width: 768px)', true);
  const { activeId, setAutoId, onHover, onToggle } = useHotspotFocus();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const autoRef = useRef<string | null>(null);
  const desktopRef = useRef(isDesktop);
  /** How far the arch must grow before its straight sides clear the stage. */
  const coverScale = useRef(8);

  useEffect(() => {
    desktopRef.current = isDesktop;
  }, [isDesktop]);

  useEffect(() => {
    const stage = stageRef.current;
    const portal = portalRef.current;
    if (!stage || !portal) return;

    const measure = () => {
      // offsetWidth ignores transforms, so this is the arch at rest.
      const w = portal.offsetWidth;
      const h = portal.offsetHeight;
      if (!w || h <= w) return;
      // Width has to span the stage; height is counted from where the
      // semicircular top meets the sides, so no curve is left on screen.
      coverScale.current = Math.max(stage.clientWidth / w, stage.clientHeight / (h - w)) * 1.04;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // The section is pulled up under the (transparent) site header, so it
  // starts at the very top of the document.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  // A critically damped spring between the wheel and the camera: trackpad
  // jitter and coarse mouse-wheel steps both arrive as one continuous glide.
  const progress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 34,
    mass: 0.32,
    restDelta: 0.0001,
  });

  useMotionValueEvent(progress, 'change', (p) => {
    // Written straight to the DOM: a per-frame number is not React state.
    if (counterRef.current) {
      counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
    }
    const reached = ALL_HOTSPOTS.find(
      (hotspot) =>
        hotspot.window &&
        p >= hotspot.window[0] &&
        p < hotspot.window[1] &&
        (desktopRef.current || !hotspot.desktopOnly),
    );
    const id = reached?.id ?? null;
    if (id !== autoRef.current) {
      autoRef.current = id;
      setAutoId(id);
    }
  });

  /* I — the salon: a slow push toward the sofa, dimming as the arch opens. */
  const salonScale = useTransform(progress, (p) =>
    dolly(1, 1.8, easeInOutSine(segment(p, TIMELINE.salonZoom))),
  );
  const salonCounter = useTransform(salonScale, (s) => 1 / s);
  const salonShade = useTransform(
    progress,
    [TIMELINE.portalIn[0], TIMELINE.portalGrow[1]],
    [0, 0.65],
  );
  const salonVisibility = useTransform(progress, (p): string =>
    p <= TIMELINE.portalGrow[1] + 0.01 ? 'visible' : 'hidden',
  );
  const salonPins = useBand(progress, TIMELINE.salonHotspots);

  /* II — the loft, seen through an arch that grows until it is the room. */
  const portalOpacity = useTransform(progress, [...TIMELINE.portalIn], [0, 1]);
  const portalScale = useTransform(progress, (p) => {
    const appear = lerp(0.72, 1, easeOutCubic(segment(p, TIMELINE.portalIn)));
    return appear * dolly(1, coverScale.current, easeInQuad(segment(p, TIMELINE.portalGrow)));
  });
  // The room inside the arch starts a little closer and settles back, so
  // stepping through has parallax instead of a flat wipe.
  const portalDepth = useTransform(progress, (p) =>
    lerp(1.4, 1, easeOutCubic(segment(p, [TIMELINE.portalIn[0], TIMELINE.portalGrow[1]]))),
  );
  // The inner layer undoes the arch's scale, so the photograph is never
  // resampled up eight times — only its window is.
  const portalInner = useTransform(
    [portalDepth, portalScale],
    ([depth = 1, scale = 1]: number[]) => depth / scale,
  );
  const portalOutline = useTransform(progress, [0.2, 0.24, 0.29, 0.34], [0, 1, 1, 0]);
  const portalVisibility = useTransform(progress, (p): string =>
    p >= TIMELINE.portalIn[0] && p <= TIMELINE.nookRise[1] + 0.01 ? 'visible' : 'hidden',
  );
  const loftScale = useTransform(progress, (p) =>
    dolly(1, 1.3, easeInOutSine(segment(p, TIMELINE.loftZoom))),
  );
  const loftCounter = useTransform(loftScale, (s) => 1 / s);
  const loftShade = useTransform(progress, [...TIMELINE.nookRise], [0, 0.55]);
  const loftPins = useBand(progress, TIMELINE.loftHotspots);

  /* III — the nook rises like a panel, then steps back into a frame. */
  const nookY = useTransform(
    progress,
    (p) => `${(1 - easeOutCubic(segment(p, TIMELINE.nookRise))) * 100}%`,
  );
  const nookScale = useTransform(progress, (p) =>
    lerp(1.18, 1, easeOutCubic(segment(p, TIMELINE.nookSettle))),
  );
  const nookCounter = useTransform(nookScale, (s) => 1 / s);
  const nookFrame = useTransform(progress, (p) =>
    lerp(1, FRAME_SCALE, easeInOutCubic(segment(p, TIMELINE.nookFrame))),
  );
  const nookVisibility = useTransform(progress, (p): string =>
    p >= TIMELINE.nookRise[0] ? 'visible' : 'hidden',
  );
  const nookPins = useBand(progress, TIMELINE.nookHotspots);

  /* Copy that enters and leaves with the camera. */
  const introOpacity = useTransform(progress, [...TIMELINE.introOut], [1, 0]);
  const introY = useTransform(progress, [...TIMELINE.introOut], [0, -48]);
  const introVisibility = useTransform(introOpacity, (o): string =>
    o > 0.01 ? 'visible' : 'hidden',
  );
  const closeOpacity = useTransform(progress, [...TIMELINE.closeIn], [0, 1]);
  const closeY = useTransform(progress, [...TIMELINE.closeIn], [32, 0]);
  const closeVisibility = useTransform(closeOpacity, (o): string =>
    o > 0.01 ? 'visible' : 'hidden',
  );
  const captions = [
    {
      key: SCENES.salon.caption,
      band: useBand(progress, [0.07, 0.1, 0.19, 0.22]),
    },
    {
      key: SCENES.loft.caption,
      band: useBand(progress, [0.42, 0.45, 0.58, 0.61]),
    },
    {
      key: SCENES.nook.caption,
      band: useBand(progress, [0.69, 0.72, 0.78, 0.81]),
    },
  ];

  const activeHotspot = ALL_HOTSPOTS.find((hotspot) => hotspot.id === activeId);
  const pinHandlers = { activeId, onHover, onToggle };

  return (
    <section
      ref={sectionRef}
      aria-label={t('home_hero_aria')}
      className="relative -mt-[72px] h-[440svh] bg-lux-obsidian"
    >
      <HeaderOverlayZone />
      <div
        ref={stageRef}
        className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-lux-obsidian [container-type:size]"
      >
        {/* I — The salon */}
        <m.div className="absolute inset-0" style={{ visibility: salonVisibility }}>
          <SceneLayer
            scene={SCENES.salon}
            priority
            boxScale={salonScale}
            counterScale={salonCounter}
            hotspotOpacity={salonPins.opacity}
            hotspotVisibility={salonPins.visibility}
            {...pinHandlers}
          />
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-lux-obsidian"
            style={{ opacity: salonShade }}
          />
        </m.div>

        {/* II — The loft, through the arch */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] aspect-[1/1.45] w-[min(46cqw,34cqh)] rounded-t-full border border-lux-brass will-change-transform"
          style={{
            x: '-50%',
            y: '-50%',
            scale: portalScale,
            opacity: portalOutline,
          }}
        />
        <m.div
          ref={portalRef}
          className="absolute left-1/2 top-1/2 aspect-[1/1.45] w-[min(46cqw,34cqh)] overflow-hidden rounded-t-full will-change-transform"
          style={{
            x: '-50%',
            y: '-50%',
            scale: portalScale,
            opacity: portalOpacity,
            visibility: portalVisibility,
          }}
        >
          <m.div
            className="absolute left-1/2 top-1/2 h-[100cqh] w-[100cqw] will-change-transform"
            style={{ x: '-50%', y: '-50%', scale: portalInner }}
          >
            <SceneLayer
              scene={SCENES.loft}
              boxScale={loftScale}
              counterScale={loftCounter}
              hotspotOpacity={loftPins.opacity}
              hotspotVisibility={loftPins.visibility}
              {...pinHandlers}
            />
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-lux-obsidian"
              style={{ opacity: loftShade }}
            />
          </m.div>
        </m.div>

        {/* III — The nook, rising and then framed */}
        <m.div
          className="absolute inset-0 overflow-hidden rounded-[28px] will-change-transform [transform-origin:50%_6%] md:[transform-origin:95%_50%]"
          style={{ y: nookY, scale: nookFrame, visibility: nookVisibility }}
        >
          <SceneLayer
            scene={SCENES.nook}
            boxScale={nookScale}
            counterScale={nookCounter}
            hotspotOpacity={nookPins.opacity}
            hotspotVisibility={nookPins.visibility}
            {...pinHandlers}
          />
        </m.div>

        {/* IV — The close: the room steps back and the offer steps in */}
        <m.div
          className="absolute inset-x-0 bottom-0 top-[55%] z-20 flex flex-col justify-center px-5 md:inset-y-0 md:right-auto md:w-[45%] md:px-10 lg:px-16"
          style={{
            opacity: closeOpacity,
            y: closeY,
            visibility: closeVisibility,
          }}
        >
          <p className="font-spec text-[10px] uppercase tracking-[0.28em] text-lux-brass md:text-[11px]">
            {t('home_scene4_caption')}
          </p>
          <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.1rem,4.4vw,4.5rem)] font-light leading-[1] tracking-[-0.015em] text-lux-sand md:mt-5">
            {t('home_hero_close_title')}
          </h2>
          <p className="mt-5 hidden max-w-md text-base leading-relaxed text-lux-sand/70 sm:block">
            {t('home_hero_close_desc')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 md:mt-9 md:gap-3">
            <MagneticLink href="/contact" variant="solid-light" cursor={t('home_cursor_explore')}>
              {t('home_cta_bespoke')}
            </MagneticLink>
            <MagneticLink href="/products" variant="outline-light" cursor={t('home_cursor_view')}>
              {t('goToCatalog')}
            </MagneticLink>
          </div>
        </m.div>

        <IntroCopy
          style={{
            opacity: introOpacity,
            y: introY,
            visibility: introVisibility,
          }}
        />

        {/* Instrument panel: where you are, how far in, which room */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-lux-obsidian/60 to-transparent" />
          <div className="absolute left-5 top-[88px] font-spec text-[10px] uppercase tracking-[0.24em] text-lux-sand/80 md:left-10 md:top-[104px]">
            <p>
              {SITE_NAME} — {t('home_hud_location')}
            </p>
            <p className="mt-1 text-lux-sand/45">40.4093° N · 49.8671° E</p>
          </div>
          <div className="absolute right-5 top-[88px] font-spec text-[10px] tracking-[0.24em] text-lux-sand/80 md:right-10 md:top-[104px]">
            <span ref={counterRef}>000</span>
            <span className="text-lux-sand/40"> / 100</span>
          </div>
          <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 font-spec text-[9px] text-lux-sand/50 sm:flex md:right-10">
            <span>I</span>
            <div className="relative h-40 w-px bg-lux-sand/20">
              <m.div
                className="absolute inset-0 origin-top bg-lux-amber"
                style={{ scaleY: progress }}
              />
            </div>
            <span>IV</span>
          </div>
          {captions.map(({ key, band }) => (
            <m.p
              key={key}
              className="absolute bottom-5 left-5 font-display text-xl italic text-lux-sand md:bottom-10 md:left-10 md:text-3xl"
              style={{ opacity: band.opacity, visibility: band.visibility }}
            >
              {t(key)}
            </m.p>
          ))}
          <m.div
            className="absolute bottom-10 right-10 hidden flex-col items-center gap-3 md:flex"
            style={{ opacity: introOpacity }}
          >
            <span className="font-spec text-[10px] uppercase tracking-[0.24em] text-lux-sand/70 [writing-mode:vertical-rl]">
              {t('home_scroll_cue')}
            </span>
            <span className="relative h-14 w-px overflow-hidden bg-lux-sand/20">
              <span className="absolute inset-0 bg-lux-sand motion-safe:animate-lux-scroll" />
            </span>
          </m.div>
        </div>

        {/* Phones: the open pin's sheet docks at the top, clear of the furniture */}
        <div className="absolute inset-x-3 top-[128px] z-40 md:hidden" aria-live="polite">
          <AnimatePresence mode="wait">
            {activeHotspot && (
              <m.div
                key={activeHotspot.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-lux-obsidian/95 p-5 text-lux-sand shadow-2xl"
              >
                <HotspotSpecs hotspot={activeHotspot} index={ALL_HOTSPOTS.indexOf(activeHotspot)} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Reduced motion                                                             */
/* -------------------------------------------------------------------------- */

/**
 * For a visitor who asked for less motion: the first room, the headline and
 * the two calls to action, with no scroll-linked camera at all.
 */
function StillHero() {
  const t = useT();
  const noop = () => undefined;

  return (
    <section
      aria-label={t('home_hero_aria')}
      className="relative -mt-[72px] h-svh min-h-[560px] overflow-hidden bg-lux-obsidian [container-type:size]"
    >
      <HeaderOverlayZone />
      <SceneLayer
        scene={SCENES.salon}
        priority
        showHotspots={false}
        activeId={null}
        onHover={noop}
        onToggle={noop}
      />
      <IntroCopy />
    </section>
  );
}

export default function SpatialHero() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return reduceMotion ? <StillHero /> : <ScrollHero />;
}
