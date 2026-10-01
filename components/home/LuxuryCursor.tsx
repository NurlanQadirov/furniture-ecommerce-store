'use client';

import { useEffect, useState, type RefObject } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import useMediaQuery from '@/components/home/useMediaQuery';

type Mode = 'hidden' | 'idle' | 'link' | 'label';

interface LuxuryCursorProps {
  /** The element the custom cursor replaces the system one inside. */
  scopeRef: RefObject<HTMLElement | null>;
}

/**
 * A brass ring that trails the pointer, and a caption beside it over anything
 * carrying `data-cursor="…"` — "Explore craft" on a material, "View specs" on
 * a product.
 *
 * It accompanies the system cursor rather than replacing it: hiding the real
 * pointer cost every link its hand, and some browsers kept it hidden after
 * the mouse had left the home page's content for the footer.
 *
 * Mouse only: on touch there is no pointer to follow, and a visitor who asked
 * for reduced motion keeps the system cursor. Position is written to motion
 * values, never to React state, so following the mouse re-renders nothing;
 * only crossing into a different kind of target does.
 */
export default function LuxuryCursor({ scopeRef }: LuxuryCursorProps) {
  const enabled = useMediaQuery(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 480, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 480, damping: 40, mass: 0.5 });

  useEffect(() => {
    const scope = scopeRef.current;
    if (!enabled || !scope) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target as Element;
      const labelled = target.closest<HTMLElement>('[data-cursor]');
      if (labelled?.dataset.cursor) {
        setLabel(labelled.dataset.cursor);
        setMode('label');
        return;
      }
      setMode(target.closest('a, button, [role="slider"]') ? 'link' : 'idle');
    };

    const leave = () => setMode('hidden');

    scope.addEventListener('pointermove', move, { passive: true });
    scope.addEventListener('pointerover', over, { passive: true });
    scope.addEventListener('pointerleave', leave);

    return () => {
      scope.removeEventListener('pointermove', move);
      scope.removeEventListener('pointerover', over);
      scope.removeEventListener('pointerleave', leave);
    };
  }, [enabled, scopeRef, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]" data-mode={mode}>
      <m.div className="absolute left-0 top-0 will-change-transform" style={{ x: ringX, y: ringY }}>
        <span
          className={`absolute -left-5 -top-5 h-10 w-10 rounded-full border border-lux-sand shadow-[0_0_0_1px_rgba(15,14,12,0.35)] transition-[transform,opacity] duration-300 ease-out ${
            mode === 'hidden' || mode === 'label'
              ? 'scale-50 opacity-0'
              : mode === 'link'
                ? 'scale-[1.6] opacity-100'
                : 'scale-100 opacity-100'
          }`}
        />
        {/* Below and right of the pointer, so the caption never hides the
            system cursor it accompanies. */}
        <span
          className={`absolute left-6 top-6 origin-top-left whitespace-nowrap rounded-full bg-lux-obsidian px-4 py-2 font-spec text-[10px] uppercase tracking-[0.22em] text-lux-sand shadow-[0_8px_30px_rgba(15,14,12,0.35)] transition-[transform,opacity] duration-300 ease-out ${
            mode === 'label' ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          {label}
        </span>
      </m.div>
    </div>
  );
}
