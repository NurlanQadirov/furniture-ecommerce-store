'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Runs every section reveal on the site from one observer.
 *
 * This replaces GSAP + ScrollTrigger, which cost 112 KB unminified for what is
 * only ever a staggered fade-up. Mounting it once in the layout — rather than
 * calling a hook per section — also means a section needs no client component
 * of its own: it just renders `data-reveal="pending"` with `.animate-item`
 * children. The matching transition lives in `globals.css`.
 *
 * Per-scope overrides, mirroring the old hook's options:
 *   data-reveal-stagger   ms between items          (default 200)
 *   data-reveal-duration  ms per item               (default 800, set in CSS)
 *   data-reveal-start     viewport % the scope's top must pass (default 85)
 *   data-reveal-now       reveal on mount, no scrolling required
 */
const DEFAULT_STAGGER_MS = 200;
const DEFAULT_START_PERCENT = 85;

function reveal(scope: HTMLElement): void {
  const stagger = Number(scope.dataset.revealStagger) || DEFAULT_STAGGER_MS;
  const duration = Number(scope.dataset.revealDuration);

  scope.querySelectorAll<HTMLElement>('.animate-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * stagger}ms`;
    if (duration) item.style.transitionDuration = `${duration}ms`;
  });

  scope.dataset.reveal = 'in';
}

export default function RevealObserver() {
  // Client-side navigation swaps in sections this effect has never seen.
  const pathname = usePathname();

  useEffect(() => {
    const scopes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal="pending"]'),
    );
    if (scopes.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      scopes.forEach(reveal);
      return;
    }

    // One observer per distinct start threshold — the margin is an observer
    // option, not a per-element one.
    const byStart = new Map<number, HTMLElement[]>();
    scopes.forEach((scope) => {
      if (scope.dataset.revealNow !== undefined) {
        reveal(scope);
        return;
      }
      const start = Number(scope.dataset.revealStart) || DEFAULT_START_PERCENT;
      byStart.set(start, [...(byStart.get(start) ?? []), scope]);
    });

    const observers = [...byStart.entries()].map(([start, group]) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          });
        },
        // `top 85%` meant: fire once the top edge is 85% of the way down the
        // viewport, which is the bottom 15% of it trimmed from the root box.
        { rootMargin: `0px 0px -${100 - start}% 0px` },
      );
      group.forEach((scope) => observer.observe(scope));
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [pathname]);

  return null;
}
