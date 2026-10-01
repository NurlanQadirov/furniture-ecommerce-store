'use client';

import Image from 'next/image';
import { m, type MotionValue } from 'framer-motion';
import { useT } from '@/components/providers/TranslationProvider';
import { ALL_HOTSPOTS, type Scene } from '@/components/home/content';
import { coverBoxSizes, coverBoxStyle } from '@/components/home/coverBox';
import { HotspotPin } from '@/components/home/hero/Hotspot';

interface SceneLayerProps {
  scene: Scene;
  /** The first scene is the page's largest paint; the others load right behind it. */
  priority?: boolean;
  /** The camera's dolly into the room, applied around the scene's focus. */
  boxScale?: MotionValue<number>;
  counterScale?: MotionValue<number>;
  hotspotOpacity?: MotionValue<number>;
  hotspotVisibility?: MotionValue<string>;
  showHotspots?: boolean;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
}

/** One room of the walk-through: its photograph and the pins on its furniture. */
export default function SceneLayer({
  scene,
  priority = false,
  boxScale,
  counterScale,
  hotspotOpacity,
  hotspotVisibility,
  showHotspots = true,
  activeId,
  onHover,
  onToggle,
}: SceneLayerProps) {
  const t = useT();

  return (
    <m.div
      className="will-change-transform"
      style={{
        ...coverBoxStyle(scene.aspect, scene.focus),
        scale: boxScale,
        transformOrigin: `${scene.focus.x * 100}% ${scene.focus.y * 100}%`,
      }}
    >
      <Image
        src={scene.src}
        alt={t(scene.alt)}
        fill
        sizes={coverBoxSizes(scene.aspect)}
        priority={priority}
        // The later rooms must be decoded before the scroll reaches them, but
        // never at the expense of the first: React preloads every eager image
        // it renders, so these ask for the lowest priority.
        loading={priority ? undefined : 'eager'}
        fetchPriority={priority ? undefined : 'low'}
        className="object-cover"
      />
      {showHotspots && (
        <m.div
          className="absolute inset-0"
          style={{ opacity: hotspotOpacity, visibility: hotspotVisibility }}
        >
          {scene.hotspots.map((hotspot) => (
            <HotspotPin
              key={hotspot.id}
              hotspot={hotspot}
              index={ALL_HOTSPOTS.indexOf(hotspot)}
              open={activeId === hotspot.id}
              counterScale={counterScale}
              onHover={onHover}
              onToggle={onToggle}
            />
          ))}
        </m.div>
      )}
    </m.div>
  );
}
