'use client';

import Image from 'next/image';
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import { SCENES } from '@/components/home/content';
import { coverBoxSizes, coverBoxStyle } from '@/components/home/coverBox';

const ROOM = SCENES.salon;
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -5,
  ArrowDown: -5,
  ArrowRight: 5,
  ArrowUp: 5,
  PageDown: -20,
  PageUp: 20,
};

/**
 * The plan we draw after measuring, dragged across into the room we deliver.
 *
 * The divide is two opposite translations of the same value — the plan's
 * window slides right while its contents slide left by as much — so dragging
 * moves composited layers instead of re-clipping, and re-painting, the photo.
 */
export default function RoomTransformation() {
  const t = useT();
  const frameRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const box = useRef<DOMRect | null>(null);
  const touched = useRef(false);
  const inView = useInView(frameRef, { once: true, amount: 0.5 });

  const position = useMotionValue(50);
  const eased = useSpring(position, {
    stiffness: 420,
    damping: 42,
    mass: 0.35,
  });
  const windowX = useTransform(eased, (value) => `${value - 100}%`);
  const contentX = useTransform(eased, (value) => `${100 - value}%`);

  // The slider's value is announced from the DOM, not React state, so a drag
  // re-renders nothing.
  useMotionValueEvent(position, 'change', (value) => {
    handleRef.current?.setAttribute('aria-valuenow', String(Math.round(value)));
  });

  // One slow sweep the first time the room is seen, to show it can be dragged.
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sweep = animate(position, [50, 26, 72, 50], {
      duration: 2.8,
      delay: 0.5,
      ease: 'easeInOut',
    });
    return () => sweep.stop();
  }, [inView, position]);

  const setFromPointer = (clientX: number) => {
    if (!box.current) return;
    const ratio = (clientX - box.current.left) / box.current.width;
    position.set(Math.min(100, Math.max(0, ratio * 100)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    position.stop();
    box.current = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event.clientX);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = position.get();
    let next: number | null = null;
    const step = KEY_STEP[event.key];
    if (step !== undefined) next = current + step;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 100;
    if (next === null) return;
    event.preventDefault();
    position.stop();
    position.set(Math.min(100, Math.max(0, next)));
  };

  const photo = (
    <Image src={ROOM.src} alt="" fill sizes={coverBoxSizes(ROOM.aspect)} className="object-cover" />
  );

  return (
    <m.div
      ref={frameRef}
      className="relative aspect-[4/5] select-none overflow-hidden rounded-[28px] bg-lux-linen [container-type:size] [touch-action:pan-y] sm:aspect-[16/10] lg:aspect-[21/10]"
      // Transform only: a clip-path or blend here would repaint the whole
      // photograph on every frame of the entrance.
      initial={{ y: 56, scale: 0.96 }}
      whileInView={{ y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      data-cursor={t('home_cursor_drag')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {/* Furnished: the room as delivered. */}
      <div style={coverBoxStyle(ROOM.aspect, ROOM.focus)}>
        <Image
          src={ROOM.src}
          alt={t(ROOM.alt)}
          fill
          sizes={coverBoxSizes(ROOM.aspect)}
          className="object-cover"
        />
      </div>

      {/* Plan: the same room as a drawing, revealed from the left. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{ x: windowX }}
      >
        <m.div className="absolute inset-0 will-change-transform" style={{ x: contentX }}>
          <div style={coverBoxStyle(ROOM.aspect, ROOM.focus)}>
            <div className="absolute inset-0 brightness-[1.12] contrast-[1.08] grayscale">
              {photo}
            </div>
            <div className="absolute inset-0 bg-[#f1ebe3]/60" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,14,12,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(15,14,12,0.07)_1px,transparent_1px)] bg-[size:3.2%_5.6%]" />
            <PlanAnnotations />
          </div>
        </m.div>
      </m.div>

      {/* The divide and its handle. */}
      <m.div
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ x: windowX }}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-lux-sand shadow-[0_0_24px_rgba(15,14,12,0.35)]" />
        <div
          ref={handleRef}
          role="slider"
          tabIndex={0}
          aria-label={t('home_room_slider')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext={`${t('home_room_before')} / ${t('home_room_after')}`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute right-0 top-1/2 grid h-14 w-14 -translate-y-1/2 translate-x-1/2 cursor-ew-resize place-items-center rounded-full bg-lux-sand text-lux-obsidian shadow-[0_10px_40px_rgba(15,14,12,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-amber"
        >
          <svg aria-hidden="true" viewBox="0 0 28 12" className="h-3 w-7 fill-none stroke-current">
            <path d="M5 1 1 6l4 5M23 1l4 5-4 5M1 6h26" strokeWidth="1.2" />
          </svg>
        </div>
      </m.div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-lux-obsidian/85 px-3 py-1.5 font-spec text-[10px] uppercase tracking-[0.2em] text-lux-sand md:left-6 md:top-6">
        {t('home_room_before')}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-lux-sand/90 px-3 py-1.5 font-spec text-[10px] uppercase tracking-[0.2em] text-lux-obsidian md:right-6 md:top-6">
        {t('home_room_after')}
      </span>
    </m.div>
  );
}

/**
 * Dimension lines over the plan, in the photograph's own pixel space (2560 ×
 * 1440) so they stay on the sofa and table at any crop. The figures match the
 * hotspot specs for the same pieces.
 */
function PlanAnnotations() {
  const ink = '#0F0E0C';
  const accent = '#B45309';
  const label = {
    fontFamily: 'var(--font-spec), ui-monospace, monospace',
    fontSize: 30,
    letterSpacing: 2,
  };

  return (
    <svg
      viewBox="0 0 2560 1440"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <g stroke={ink} strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none">
        {/* Sofa width */}
        <path d="M960 700H2368M960 680v40M2368 680v40" vectorEffect="non-scaling-stroke" />
        {/* Sofa height */}
        <path d="M2420 770V1232M2400 770h40M2400 1232h40" vectorEffect="non-scaling-stroke" />
        {/* Ceiling height */}
        <path d="M150 40V1200M130 40h40M130 1200h40" vectorEffect="non-scaling-stroke" />
        {/* Room width along the floor */}
        <path d="M70 1390H2490M70 1370v40M2490 1370v40" vectorEffect="non-scaling-stroke" />
      </g>
      <ellipse
        cx="1414"
        cy="1050"
        rx="250"
        ry="44"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="10 8"
        vectorEffect="non-scaling-stroke"
      />
      <g fill={ink} style={label}>
        <text x="1664" y="680" textAnchor="middle">
          2840
        </text>
        <text x="2470" y="1010" textAnchor="middle" transform="rotate(-90 2470 1010)">
          780
        </text>
        <text x="200" y="620" textAnchor="middle" transform="rotate(-90 200 620)">
          H 2950
        </text>
        <text x="1280" y="1374" textAnchor="middle">
          5400
        </text>
      </g>
      <text x="1414" y="1130" textAnchor="middle" fill={accent} style={label}>
        Ø 900
      </text>
    </svg>
  );
}
