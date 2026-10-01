'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * A media query as React state, safe to read during hydration.
 *
 * The server cannot know the visitor's pointer or motion preference, so it
 * renders `serverValue`; React then swaps in the real answer right after
 * hydration instead of reporting a mismatch.
 */
export default function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
