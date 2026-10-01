'use client';

import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import { MATERIALS, type MaterialId } from '@/components/home/content';
import MaterialTexture from '@/components/home/atelier/MaterialTexture';

const FULL = 'circle(150% at 50% 50%)';

/**
 * Three surfaces, one panel. Choosing a swatch floods the panel with the new
 * material in a circle that grows from the swatch itself.
 *
 * All three textures stay mounted and stacked — the current one on top, the
 * one it replaces right under it — so a swap never re-renders a filter, it
 * only animates one layer's clip-path.
 */
export default function MaterialSelector() {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const swatchRefs = useRef<Partial<Record<MaterialId, HTMLButtonElement | null>>>({});
  const [current, setCurrent] = useState<MaterialId>('walnut');
  const [previous, setPrevious] = useState<MaterialId | null>(null);
  const [origin, setOrigin] = useState('50% 50%');

  const choose = (id: MaterialId, from?: HTMLElement | null) => {
    if (id === current) return;
    const panel = panelRef.current?.getBoundingClientRect();
    const swatch = from?.getBoundingClientRect();
    if (panel && swatch) {
      const x = ((swatch.left + swatch.width / 2 - panel.left) / panel.width) * 100;
      const y = ((swatch.top + swatch.height / 2 - panel.top) / panel.height) * 100;
      setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    }
    setPrevious(current);
    setCurrent(id);
  };

  // A radio group: arrows move the choice, and focus follows it.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = MATERIALS.findIndex((entry) => entry.id === current);
    const next = MATERIALS[(index + step + MATERIALS.length) % MATERIALS.length];
    if (!next) return;
    const button = swatchRefs.current[next.id];
    choose(next.id, button);
    button?.focus();
  };

  const material = MATERIALS.find((entry) => entry.id === current);
  if (!material) return null;

  return (
    <div
      ref={panelRef}
      className="relative isolate h-full min-h-[560px] overflow-hidden rounded-[28px] bg-lux-espresso text-lux-sand md:min-h-[640px]"
      data-cursor={t('home_cursor_explore')}
    >
      {MATERIALS.map((entry) => {
        const isCurrent = entry.id === current;
        return (
          <m.div
            key={entry.id}
            aria-hidden="true"
            className="absolute inset-0"
            style={{ zIndex: isCurrent ? 2 : entry.id === previous ? 1 : 0 }}
            initial={false}
            animate={{
              clipPath:
                isCurrent && previous
                  ? [`circle(0% at ${origin})`, `circle(150% at ${origin})`]
                  : FULL,
            }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          >
            <MaterialTexture material={entry.id} tone={entry.tone} />
          </m.div>
        );
      })}

      {/* Legibility over the light marble as much as the dark walnut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-lux-obsidian/90 via-lux-obsidian/30 to-lux-obsidian/20"
      />

      <div className="relative z-[4] flex h-full min-h-[inherit] flex-col justify-between p-6 md:p-9">
        <div className="flex items-start justify-between gap-6 font-spec text-[10px] uppercase tracking-[0.24em] text-lux-sand/80">
          <p>01 — {t('home_material_label')}</p>
          <p aria-hidden="true">
            {String(MATERIALS.indexOf(material) + 1).padStart(2, '0')} /{' '}
            {String(MATERIALS.length).padStart(2, '0')}
          </p>
        </div>

        <div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={material.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] font-light leading-[0.95] tracking-[-0.01em]">
                {t(material.name)}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-lux-sand/75 md:text-[15px]">
                {t(material.note)}
              </p>
              <dl className="mt-6 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-5 font-spec text-[10px] uppercase tracking-[0.14em]">
                {(
                  [
                    [t('home_spec_origin'), t(material.origin)],
                    [t('home_spec_thickness'), material.thickness],
                    [t('home_spec_finish'), t(material.finish)],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-lux-sand/45">{label}</dt>
                    <dd className="mt-1.5 normal-case tracking-normal text-lux-sand">{value}</dd>
                  </div>
                ))}
              </dl>
            </m.div>
          </AnimatePresence>

          <div
            role="radiogroup"
            aria-label={t('home_material_label')}
            onKeyDown={onKeyDown}
            className="mt-8 flex gap-3"
          >
            {MATERIALS.map((entry) => {
              const selected = entry.id === current;
              return (
                <button
                  key={entry.id}
                  ref={(node) => {
                    swatchRefs.current[entry.id] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t(entry.name)}
                  tabIndex={selected ? 0 : -1}
                  onClick={(event: MouseEvent<HTMLButtonElement>) =>
                    choose(entry.id, event.currentTarget)
                  }
                  className={`relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-offset-4 ring-offset-transparent transition-[box-shadow,transform] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-lux-amber ${
                    selected ? 'scale-100 ring-lux-sand' : 'scale-90 ring-white/25 hover:scale-95'
                  }`}
                >
                  <MaterialTexture material={entry.id} tone={entry.tone} />
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            {t('home_material_live', { name: t(material.name) })}
          </p>
        </div>
      </div>
    </div>
  );
}
