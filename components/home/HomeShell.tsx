'use client';

import { useRef, type ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import LuxuryCursor from '@/components/home/LuxuryCursor';

interface HomeShellProps {
  /** The home-only font variables from `components/home/fonts.ts`. */
  fontClassName: string;
  children: ReactNode;
}

/**
 * The home page's frame: its typefaces, its palette and its cursor.
 *
 * `LazyMotion` with `strict` keeps Framer Motion to the `m` components and the
 * DOM-animation feature set — the drag, layout and SVG-path code it would
 * otherwise bundle is never used here.
 */
export default function HomeShell({ fontClassName, children }: HomeShellProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  return (
    <LazyMotion features={domAnimation} strict>
      {/* `user`: transform animations snap straight to their end state for a
          visitor who asked for reduced motion; opacity still eases. */}
      <MotionConfig reducedMotion="user">
        <div
          ref={scopeRef}
          className={`${fontClassName} bg-lux-sand font-inter text-lux-obsidian antialiased [font-variant-numeric:lining-nums]`}
        >
          {children}
          <LuxuryCursor scopeRef={scopeRef} />
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
