'use client';

import { useEffect, useRef, useState } from 'react';
import type { MaterialId } from '@/components/home/content';

/**
 * Material surfaces — pebbled hide, fumed walnut, veined marble — drawn by SVG
 * filters, but shown as bitmaps.
 *
 * Fractal noise is expensive: the walnut alone took ~270 ms to filter on a
 * desktop, and as inline SVG the browser ran the filter again on every repaint
 * of the panel — the reveal, each text swap, each hover. That was the freeze.
 * Now each texture is filtered exactly once, off the critical path, into a
 * canvas; every swatch and panel afterwards only copies pixels.
 */

/** Edge of the square master bitmap, in device pixels. */
const TEXTURE_SIZE = 896;

function textureMarkup(material: MaterialId): string {
  const open = `<svg xmlns="http://www.w3.org/2000/svg" width="${TEXTURE_SIZE}" height="${TEXTURE_SIZE}" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">`;
  return `${open}${BODIES[material]}</svg>`;
}

const BODIES: Record<MaterialId, string> = {
  // Pebbled grain lit into relief, over the broad mottling of a waxed hide.
  leather: `
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed="7" result="pebble"/>
        <feDiffuseLighting in="pebble" surfaceScale="2.2" lighting-color="#f4e2cc" result="relief">
          <feDistantLight azimuth="225" elevation="52"/>
        </feDiffuseLighting>
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="3" result="mottle"/>
        <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.9 0" result="tint"/>
        <feFlood flood-color="#7a3f22" result="hide"/>
        <feBlend in="tint" in2="hide" mode="multiply" result="base"/>
        <feBlend in="relief" in2="base" mode="multiply"/>
      </filter>
      <radialGradient id="sheen" cx="30%" cy="25%" r="85%">
        <stop offset="0" stop-color="#ffd9b0" stop-opacity="0.28"/>
        <stop offset="1" stop-color="#1a0d06" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="600" height="600" filter="url(#grain)"/>
    <rect width="600" height="600" fill="url(#sheen)"/>`,

  // Noise stretched along the board, gently warped, collapsed to one channel
  // (independent channels tint as rainbow) and mapped onto walnut browns.
  walnut: `
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.085" numOctaves="3" seed="11" result="figure"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="5" result="warp"/>
        <feDisplacementMap in="figure" in2="warp" scale="38" xChannelSelector="R" yChannelSelector="G" result="flow"/>
        <feColorMatrix in="flow" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="grey"/>
        <feComponentTransfer in="grey">
          <feFuncR type="table" tableValues="0.1 0.24 0.16 0.33 0.2 0.29"/>
          <feFuncG type="table" tableValues="0.065 0.155 0.1 0.215 0.13 0.19"/>
          <feFuncB type="table" tableValues="0.04 0.095 0.06 0.13 0.08 0.115"/>
          <feFuncA type="linear" slope="0" intercept="1"/>
        </feComponentTransfer>
      </filter>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f6d7b0" stop-opacity="0.16"/>
        <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.4"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" filter="url(#grain)"/>
    <rect width="600" height="600" fill="url(#sheen)"/>`,

  // \`turbulence\` folds the noise at zero into thin creases; mapping only its
  // low end to opacity turns those creases into grey and brass veins.
  marble: `
    <defs>
      <filter id="veins" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="turbulence" baseFrequency="0.0045 0.009" numOctaves="4" seed="23" result="noise"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="2" result="warp"/>
        <feDisplacementMap in="noise" in2="warp" scale="60" xChannelSelector="R" yChannelSelector="B" result="folded"/>
        <feColorMatrix in="folded" type="luminanceToAlpha" result="depth"/>
        <feComponentTransfer in="depth" result="vein">
          <feFuncA type="table" tableValues="0.95 0.55 0.12 0 0 0 0 0 0 0"/>
        </feComponentTransfer>
        <feFlood flood-color="#5f5a55"/>
        <feComposite in2="vein" operator="in"/>
      </filter>
      <filter id="gold" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="turbulence" baseFrequency="0.006 0.004" numOctaves="3" seed="41" result="noise"/>
        <feColorMatrix in="noise" type="luminanceToAlpha" result="depth"/>
        <feComponentTransfer in="depth" result="vein">
          <feFuncA type="table" tableValues="0.7 0.15 0 0 0 0 0 0 0 0"/>
        </feComponentTransfer>
        <feFlood flood-color="#b08d57"/>
        <feComposite in2="vein" operator="in"/>
      </filter>
      <filter id="cloud" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed="9"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.84  0 0 0 0 0.81  0 0 0 0.35 0"/>
      </filter>
    </defs>
    <rect width="600" height="600" fill="#f3efe9"/>
    <rect width="600" height="600" filter="url(#cloud)"/>
    <rect width="600" height="600" filter="url(#veins)" opacity="0.85"/>
    <rect width="600" height="600" filter="url(#gold)" opacity="0.55"/>`,
};

const textures = new Map<MaterialId, Promise<HTMLCanvasElement>>();
let queue: Promise<unknown> = Promise.resolve();

/**
 * Waits for the main thread to have nothing better to do. Safari has no
 * `requestIdleCallback`; a short timeout at least yields to pending input.
 */
const idle = () =>
  new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === 'function')
      window.requestIdleCallback(() => resolve());
    else setTimeout(resolve, 120);
  });

async function rasterize(material: MaterialId): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(new Blob([textureMarkup(material)], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No 2D canvas context');
    // The one expensive call: the filters run here, and never again.
    context.drawImage(image, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The filtered master bitmap for a material, rendered once per page load. */
function loadTexture(material: MaterialId): Promise<HTMLCanvasElement> {
  const cached = textures.get(material);
  if (cached) return cached;
  // One at a time, each in its own idle slot, so three filter passes never
  // pile up into a single long freeze.
  const job = queue.then(idle).then(() => rasterize(material));
  queue = job.catch(() => undefined);
  textures.set(material, job);
  return job;
}

interface MaterialTextureProps {
  material: MaterialId;
  /** Shown until the bitmap is ready, and if it never is. */
  tone: string;
  className?: string;
}

/** A material surface, cropped to cover its box like `object-fit: cover`. */
export default function MaterialTexture({ material, tone, className = '' }: MaterialTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const target = canvasRef.current;
    if (!target) return;
    let source: HTMLCanvasElement | null = null;
    let cancelled = false;

    const paint = () => {
      const context = target.getContext('2d');
      if (!source || !context) return;
      const { width, height } = target.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(width * ratio);
      const h = Math.round(height * ratio);
      if (target.width !== w || target.height !== h) {
        target.width = w;
        target.height = h;
      }
      const scale = Math.max(w / TEXTURE_SIZE, h / TEXTURE_SIZE);
      const sw = w / scale;
      const sh = h / scale;
      context.drawImage(
        source,
        (TEXTURE_SIZE - sw) / 2,
        (TEXTURE_SIZE - sh) / 2,
        sw,
        sh,
        0,
        0,
        w,
        h,
      );
    };

    loadTexture(material)
      .then((canvas) => {
        if (cancelled) return;
        source = canvas;
        paint();
        setReady(true);
      })
      // The tone underneath is an acceptable surface if filters are unavailable.
      .catch(() => undefined);

    const observer = new ResizeObserver(paint);
    observer.observe(target);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [material]);

  return (
    <div
      aria-hidden="true"
      className={`h-full w-full ${className}`}
      style={{ backgroundColor: tone }}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
