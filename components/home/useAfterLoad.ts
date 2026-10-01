'use client';

import { useEffect, useState } from 'react';

/**
 * True once the page has loaded and the main thread has gone idle, or as soon
 * as the visitor starts scrolling, whichever comes first.
 *
 * For what the first screen does not show but the first scroll will: the
 * later rooms of the hero. Requested at page start they shared a phone's
 * bandwidth with the first room's photograph, which is the page's largest
 * paint, and pushed it seconds later.
 */
export default function useAfterLoad(enabled = true): boolean {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const done = () => setReady(true);
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(done, { timeout: 2000 });
      } else {
        timer = setTimeout(done, 200);
      }
    };

    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
    window.addEventListener('scroll', done, { once: true, passive: true });

    return () => {
      window.removeEventListener('load', whenIdle);
      window.removeEventListener('scroll', done);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [enabled]);

  return ready;
}
