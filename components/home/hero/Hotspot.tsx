'use client';

import { m, type MotionValue } from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import type { Hotspot } from '@/components/home/content';

interface HotspotSpecsProps {
  hotspot: Hotspot;
  /** Position in the whole walk-through, for the "N° 03" index. */
  index: number;
}

/** The specification sheet a hotspot opens: name, material, origin, size. */
export function HotspotSpecs({ hotspot, index }: HotspotSpecsProps) {
  const t = useT();
  const rows: [string, string][] = [
    [t('home_spec_material'), t(hotspot.material)],
    [t('home_spec_origin'), t(hotspot.origin)],
    [t('home_spec_dimensions'), hotspot.dimensions],
  ];

  return (
    <>
      <p className="font-spec text-[10px] uppercase tracking-[0.24em] text-lux-brass">
        N° {String(index + 1).padStart(2, '0')}
      </p>
      <p className="mt-2 font-display text-[1.65rem] font-normal leading-[1.1]">
        {t(hotspot.name)}
      </p>
      <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 font-spec text-[10.5px] leading-snug">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[6.75rem_1fr] gap-3">
            <dt className="uppercase tracking-[0.14em] text-lux-sand/45">{label}</dt>
            <dd className="text-lux-sand/90">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

interface HotspotPinProps {
  hotspot: Hotspot;
  index: number;
  open: boolean;
  /** Cancels the scene's zoom so the pin and its card stay the same size. */
  counterScale?: MotionValue<number>;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

/**
 * A glowing `+` pinned to a piece of furniture.
 *
 * It opens on its own while the scroll passes its window, on hover, on
 * keyboard focus, or on a tap — whichever the visitor has. On desktop the
 * card opens beside the pin; phones show the same sheet in the hero's dock.
 */
export function HotspotPin({
  hotspot,
  index,
  open,
  counterScale,
  onHover,
  onToggle,
}: HotspotPinProps) {
  const t = useT();
  const name = t(hotspot.name);
  const cardId = `hotspot-${hotspot.id}`;
  const opensRight = hotspot.side === 'right';

  return (
    <m.div
      className={`absolute ${hotspot.desktopOnly ? 'hidden md:block' : ''} ${open ? 'z-20' : 'z-10'}`}
      style={{
        left: `${hotspot.x * 100}%`,
        top: `${hotspot.y * 100}%`,
        x: '-50%',
        y: '-50%',
        scale: counterScale,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={t('home_hotspot_open', { name })}
        data-cursor={t('home_cursor_specs')}
        onPointerEnter={(event) => event.pointerType === 'mouse' && onHover(hotspot.id)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && onHover(null)}
        onFocus={() => onHover(hotspot.id)}
        onBlur={() => onHover(null)}
        onClick={() => onToggle(hotspot.id)}
        className="relative grid h-11 w-11 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lux-amber"
      >
        <span
          aria-hidden="true"
          className="absolute inset-1 rounded-full border border-lux-amber/80 motion-safe:animate-lux-pulse"
        />
        <span
          aria-hidden="true"
          className={`relative grid h-7 w-7 place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-500 ${
            open
              ? 'border-lux-amber bg-lux-amber text-lux-obsidian shadow-[0_0_0_6px_rgba(217,119,6,0.2),0_0_36px_rgba(217,119,6,0.6)]'
              : 'border-lux-sand/80 bg-lux-obsidian/45 text-lux-sand shadow-[0_0_24px_rgba(253,251,247,0.35)]'
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            className={`h-3 w-3 transition-transform duration-500 ease-out ${open ? 'rotate-45' : ''}`}
          >
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </button>

      <div
        id={cardId}
        className={`pointer-events-none absolute top-1/2 hidden w-[17.5rem] md:block ${
          opensRight ? 'left-full pl-5' : 'right-full pr-5'
        } transition-[opacity,transform,visibility] duration-500 ease-out ${
          open
            ? 'visible -translate-y-1/2 translate-x-0 opacity-100'
            : `invisible -translate-y-1/2 opacity-0 ${opensRight ? '-translate-x-3' : 'translate-x-3'}`
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1/2 h-px w-5 bg-lux-amber ${opensRight ? 'left-0' : 'right-0'}`}
        />
        <div className="rounded-2xl border border-white/10 bg-lux-obsidian/95 p-5 text-lux-sand shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <HotspotSpecs hotspot={hotspot} index={index} />
        </div>
      </div>
    </m.div>
  );
}
