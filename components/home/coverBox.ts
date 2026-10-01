import type { CSSProperties } from 'react';

/**
 * The box a photograph fills when it has to cover its container, as CSS.
 *
 * `object-fit: cover` crops a photo somewhere the page cannot see, so anything
 * pinned to the furniture in it — hotspots, dimension lines — drifts as the
 * viewport changes shape. Instead the photo gets a box with its own aspect
 * ratio, sized to cover the container and slid so `focus` stays centred where
 * the crop allows. Children positioned in percentages of this box therefore
 * sit on the same pixel of the photo at every size.
 *
 * Lengths are in container query units, so the container must declare
 * `container-type: size`.
 */
export function coverBoxStyle(aspect: number, focus: { x: number; y: number }): CSSProperties {
  const width = `max(100cqw, 100cqh * ${aspect})`;
  const height = `(${width} / ${aspect})`;

  return {
    position: 'absolute',
    width,
    height: `calc${height}`,
    left: `clamp(100cqw - ${width}, 50cqw - ${width} * ${focus.x}, 0px)`,
    top: `clamp(100cqh - ${height}, 50cqh - ${height} * ${focus.y}, 0px)`,
  };
}

/** `sizes` for a photo inside `coverBoxStyle`: wider than the viewport on tall screens. */
export function coverBoxSizes(aspect: number): string {
  const ratio = `${Math.round(aspect * 1000)}/1000`;
  return `(max-aspect-ratio: ${ratio}) ${Math.ceil(aspect * 100)}vh, 100vw`;
}
