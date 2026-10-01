'use client';

import Link from 'next/link';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Variant = 'solid-light' | 'outline-light' | 'solid-dark' | 'outline-dark';

const VARIANTS: Record<Variant, string> = {
  // On dark grounds.
  'solid-light': 'bg-lux-sand text-lux-obsidian hover:bg-lux-brass hover:text-lux-obsidian',
  'outline-light':
    'border border-lux-sand/35 text-lux-sand hover:border-lux-sand hover:bg-lux-sand hover:text-lux-obsidian',
  // On light grounds.
  'solid-dark': 'bg-lux-obsidian text-lux-sand hover:bg-lux-moss',
  'outline-dark':
    'border border-lux-obsidian/25 text-lux-obsidian hover:border-lux-obsidian hover:bg-lux-obsidian hover:text-lux-sand',
};

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** Caption the custom cursor shows over this link. */
  cursor?: string;
  /** How far the button leans toward the pointer, as a share of the offset. */
  strength?: number;
  className?: string;
}

/**
 * A call to action that leans toward the pointer and springs back.
 *
 * The button's box is measured once on entry, not on every move, so tracking
 * the pointer never forces a layout. Touch and pen input are ignored: there is
 * no hover to respond to, only a tap that should land where it was aimed.
 */
export default function MagneticLink({
  href,
  children,
  variant = 'solid-dark',
  cursor,
  strength = 0.3,
  className = '',
}: MagneticLinkProps) {
  const box = useRef<DOMRect | null>(null);
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const x = useSpring(pullX, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(pullY, { stiffness: 220, damping: 16, mass: 0.4 });
  // The label travels a little further than its pill, which reads as depth.
  const labelX = useTransform(x, (value) => value * 0.35);
  const labelY = useTransform(y, (value) => value * 0.35);

  const enter = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse') return;
    box.current = event.currentTarget.getBoundingClientRect();
  };

  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse' || !box.current) return;
    const { left, top, width, height } = box.current;
    pullX.set((event.clientX - (left + width / 2)) * strength);
    pullY.set((event.clientY - (top + height / 2)) * strength);
  };

  const leave = () => {
    box.current = null;
    pullX.set(0);
    pullY.set(0);
  };

  return (
    <m.span
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <Link
        href={href}
        data-cursor={cursor}
        className={`group inline-flex min-h-[52px] items-center gap-3 rounded-full px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lux-amber ${VARIANTS[variant]}`}
      >
        <m.span className="inline-flex items-center gap-3" style={{ x: labelX, y: labelY }}>
          {children}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 10"
            className="h-2.5 w-6 fill-none stroke-current transition-transform duration-500 ease-out group-hover:translate-x-1"
          >
            <path d="M0 5h22M18 1l4 4-4 4" strokeWidth="1.2" />
          </svg>
        </m.span>
      </Link>
    </m.span>
  );
}
