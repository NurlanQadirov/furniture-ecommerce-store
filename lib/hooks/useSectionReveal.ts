'use client';

import { useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface SectionRevealOptions {
  /** Tween duration in seconds. */
  duration?: number;
  /** Delay between each `.animate-item` in seconds. */
  stagger?: number;
  /** ScrollTrigger `start` value. */
  start?: string;
  /** When false the reveal plays immediately instead of on scroll. */
  scrollTrigger?: boolean;
}

/**
 * Fades every `.animate-item` inside the returned scope up into place — the
 * reveal the Vite app ran from `useLayoutEffect` + `gsap.context`.
 *
 * `useGSAP` scopes the animation to the returned ref and reverts it on unmount,
 * which keeps ScrollTriggers from leaking across Next.js client-side navigations.
 */
export function useSectionReveal<T extends HTMLElement = HTMLDivElement>({
  duration = 0.8,
  stagger = 0.2,
  start = 'top 85%',
  scrollTrigger = true,
}: SectionRevealOptions = {}): RefObject<T | null> {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('.animate-item', scope.current);
      if (items.length === 0) return;

      gsap.from(items, {
        opacity: 0,
        y: 60,
        duration,
        ease: 'power3.out',
        stagger,
        ...(scrollTrigger
          ? {
              scrollTrigger: {
                trigger: scope.current,
                start,
                toggleActions: 'play none none none',
                once: true,
              },
            }
          : {}),
      });
    },
    { scope, dependencies: [duration, stagger, start, scrollTrigger] },
  );

  return scope;
}
