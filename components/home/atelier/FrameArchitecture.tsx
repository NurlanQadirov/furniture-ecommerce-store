'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { m, useInView } from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import { SEAT_LAYERS, type LayerId } from '@/components/home/content';

/** What each layer looks like, as flat CSS fills seen in isometric. */
const SLAB_FILL: Record<LayerId, CSSProperties> = {
  cover: {
    background: 'repeating-linear-gradient(45deg, #ddd3c6 0 2px, #cfc4b5 2px 4px), #d8cdbf',
  },
  feather: {
    background:
      'radial-gradient(circle at 30% 35%, rgba(255,255,255,0.85), transparent 55%), radial-gradient(#ffffff 1px, transparent 1.6px) 0 0 / 10px 10px, #ece5dc',
  },
  foam: {
    background:
      'radial-gradient(rgba(120,72,10,0.35) 1.2px, transparent 1.8px) 0 0 / 8px 8px, linear-gradient(135deg, #e9c37a, #d79e45)',
  },
  springs: {
    background:
      'radial-gradient(circle, transparent 5px, #b08d57 5.5px 7px, transparent 7.6px) 0 0 / 22px 22px, #26221e',
  },
  frame: {
    background:
      'repeating-linear-gradient(90deg, #6b4a2f 0 7px, #7d5839 7px 15px, #5d3f29 15px 19px)',
  },
};

/** Lifted apart (exploded) versus nearly touching (assembled), in px of depth. */
const GAP_OPEN = 46;
const GAP_CLOSED = 12;

/**
 * The seat cushion, taken apart.
 *
 * Five flat layers in an isometric 3D stack; hovering, focusing or tapping a
 * layer in the list lifts it out and dims the others. The stack separates on
 * its own the first time the card comes into view, so a phone visitor sees
 * the idea without having to find the toggle.
 */
export default function FrameArchitecture() {
  const t = useT();
  const stackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stackRef, { once: true, amount: 0.6 });
  const [exploded, setExploded] = useState(false);
  const [active, setActive] = useState<LayerId | null>(null);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setExploded(true), 350);
    return () => window.clearTimeout(timer);
  }, [inView]);

  const open = exploded || active !== null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-lux-obsidian p-6 text-lux-sand md:p-9">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1 basis-56">
          <p className="font-spec text-[10px] uppercase tracking-[0.24em] text-lux-brass">
            02 — {t('home_frame_eyebrow')}
          </p>
          <h3 className="mt-3 font-display text-[clamp(2rem,3vw,2.9rem)] font-light leading-[1.02]">
            {t('home_frame_title')}
          </h3>
        </div>
        <button
          type="button"
          aria-pressed={exploded}
          onClick={() => setExploded((value) => !value)}
          className="shrink-0 rounded-full border border-white/20 px-4 py-2 font-spec text-[10px] uppercase tracking-[0.18em] text-lux-sand/80 transition-colors hover:border-lux-sand hover:text-lux-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-amber"
        >
          {t('home_frame_explode')}
        </button>
      </div>

      <div
        ref={stackRef}
        aria-hidden="true"
        className="relative mb-6 mt-20 h-[290px] [perspective:1400px] md:mt-10 md:h-[340px]"
        data-cursor={t('home_cursor_explore')}
      >
        <div className="absolute left-1/2 top-[58%] h-0 w-0 [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-38deg)]">
          {SEAT_LAYERS.map((layer, index) => {
            const depth = SEAT_LAYERS.length - 1 - index;
            const isActive = active === layer.id;
            const dimmed = active !== null && !isActive;
            return (
              <m.div
                key={layer.id}
                className={`absolute left-[-110px] top-[-80px] h-[160px] w-[220px] rounded-[18px] transition-opacity duration-500 md:left-[-130px] md:top-[-92px] md:h-[184px] md:w-[260px] ${
                  isActive
                    ? 'shadow-[0_0_0_2px_#b08d57,0_14px_0_-2px_rgba(0,0,0,0.5)]'
                    : 'shadow-[0_10px_0_-2px_rgba(0,0,0,0.45)]'
                } ${dimmed ? 'opacity-30' : 'opacity-100'}`}
                style={SLAB_FILL[layer.id]}
                initial={false}
                animate={{
                  z: depth * (open ? GAP_OPEN : GAP_CLOSED) + (isActive ? 22 : 0),
                }}
                transition={{
                  type: 'spring',
                  stiffness: 160,
                  damping: 20,
                  mass: 0.8,
                }}
              >
                {layer.id === 'frame' && (
                  <span className="absolute inset-[18px] rounded-[8px] bg-lux-obsidian/85" />
                )}
              </m.div>
            );
          })}
        </div>
      </div>

      <p className="font-spec text-[10px] uppercase tracking-[0.2em] text-lux-sand/45">
        {t('home_frame_hint')}
      </p>
      <ol className="mt-3 divide-y divide-white/10 border-y border-white/10">
        {SEAT_LAYERS.map((layer, index) => {
          const isActive = active === layer.id;
          return (
            <li key={layer.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onPointerEnter={(event) => event.pointerType === 'mouse' && setActive(layer.id)}
                onPointerLeave={(event) => event.pointerType === 'mouse' && setActive(null)}
                onFocus={() => setActive(layer.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isActive ? null : layer.id)}
                className="grid w-full grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-amber"
              >
                <span
                  className={`font-spec text-[10px] transition-colors ${isActive ? 'text-lux-amber' : 'text-lux-sand/40'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span
                    className={`block text-sm transition-colors md:text-[15px] ${isActive ? 'text-lux-sand' : 'text-lux-sand/75'}`}
                  >
                    {t(layer.name)}
                  </span>
                  <span
                    className={`grid font-spec text-[10.5px] leading-snug text-lux-sand/55 transition-[grid-template-rows,opacity] duration-500 ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-1.5">{t(layer.spec)}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
