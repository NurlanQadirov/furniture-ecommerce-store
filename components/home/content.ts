import type { TranslationKey } from '@/lib/i18n/resources';

/**
 * Everything the home page showcase *says* about the furniture, kept apart
 * from the code that animates it.
 *
 * Hotspot coordinates are fractions of the source photograph (0–1 from the
 * top-left corner), not of the screen: `coverBoxStyle` sizes each photo's box
 * so those fractions land on the same sofa at any viewport.
 *
 * The specifications are showroom copy — dimensions, densities, certifications.
 * They must match what the workshop actually builds before this ships; FSC® in
 * particular is a licensed claim.
 */

export type SceneId = 'salon' | 'loft' | 'nook';

export interface Hotspot {
  id: string;
  /** Position on the photograph, as fractions of its width and height. */
  x: number;
  y: number;
  /** Which side of the dot the specification card opens on (desktop). */
  side: 'left' | 'right';
  /** Scroll-progress window in which the hotspot opens on its own. */
  window?: [number, number];
  /** Off-centre hotspots fall outside a phone's crop of a landscape photo. */
  desktopOnly?: boolean;
  name: TranslationKey;
  material: TranslationKey;
  origin: TranslationKey;
  /** Width × depth × height in millimetres, or a diameter (Ø) and height. */
  dimensions: string;
}

export interface Scene {
  id: SceneId;
  src: string;
  /** Width / height of the source file, so the box crops exactly like it. */
  aspect: number;
  /** The point of the photo a narrow viewport keeps centred. */
  focus: { x: number; y: number };
  alt: TranslationKey;
  caption: TranslationKey;
  hotspots: Hotspot[];
}

export const SCENES: Record<SceneId, Scene> = {
  salon: {
    id: 'salon',
    src: '/furniture.jpg',
    aspect: 2560 / 1440,
    focus: { x: 0.62, y: 0.66 },
    alt: 'home_scene1_alt',
    caption: 'home_scene1_caption',
    hotspots: [
      {
        id: 'salon-table',
        x: 0.553,
        y: 0.775,
        side: 'left',
        window: [0.05, 0.125],
        name: 'home_hs_salon_table',
        material: 'home_hs_salon_table_material',
        origin: 'home_hs_salon_table_origin',
        dimensions: 'Ø 900 × 450',
      },
      {
        id: 'salon-sofa',
        x: 0.69,
        y: 0.665,
        side: 'right',
        window: [0.125, 0.2],
        name: 'home_hs_salon_sofa',
        material: 'home_hs_salon_sofa_material',
        origin: 'home_hs_salon_sofa_origin',
        dimensions: '2840 × 1650 × 780',
      },
      {
        id: 'salon-chair',
        x: 0.19,
        y: 0.69,
        side: 'right',
        desktopOnly: true,
        name: 'home_hs_salon_chair',
        material: 'home_hs_salon_chair_material',
        origin: 'home_hs_salon_chair_origin',
        dimensions: '720 × 780 × 760',
      },
    ],
  },
  loft: {
    id: 'loft',
    src: '/furniture2.jpg',
    aspect: 2560 / 1706,
    focus: { x: 0.56, y: 0.72 },
    alt: 'home_scene2_alt',
    caption: 'home_scene2_caption',
    hotspots: [
      {
        id: 'loft-table',
        x: 0.545,
        y: 0.81,
        side: 'left',
        window: [0.43, 0.5],
        name: 'home_hs_loft_table',
        material: 'home_hs_loft_table_material',
        origin: 'home_hs_loft_table_origin',
        dimensions: '1200 × 700 × 400',
      },
      {
        id: 'loft-sofa',
        x: 0.67,
        y: 0.73,
        side: 'right',
        window: [0.5, 0.56],
        name: 'home_hs_loft_sofa',
        material: 'home_hs_loft_sofa_material',
        origin: 'home_hs_loft_sofa_origin',
        dimensions: '2200 × 920 × 820',
      },
      {
        id: 'loft-lamp',
        x: 0.298,
        y: 0.435,
        side: 'right',
        window: [0.56, 0.6],
        desktopOnly: true,
        name: 'home_hs_loft_lamp',
        material: 'home_hs_loft_lamp_material',
        origin: 'home_hs_loft_lamp_origin',
        dimensions: '300 × 300 × 1650',
      },
    ],
  },
  nook: {
    id: 'nook',
    src: '/furniture3.jpg',
    aspect: 1706 / 2560,
    focus: { x: 0.45, y: 0.72 },
    alt: 'home_scene3_alt',
    caption: 'home_scene3_caption',
    hotspots: [
      {
        id: 'nook-tables',
        x: 0.4,
        y: 0.72,
        side: 'right',
        window: [0.69, 0.735],
        name: 'home_hs_nook_tables',
        material: 'home_hs_nook_tables_material',
        origin: 'home_hs_nook_tables_origin',
        dimensions: 'Ø 600 × 420',
      },
      {
        id: 'nook-pouf',
        x: 0.79,
        y: 0.82,
        side: 'left',
        window: [0.735, 0.78],
        name: 'home_hs_nook_pouf',
        material: 'home_hs_nook_pouf_material',
        origin: 'home_hs_nook_pouf_origin',
        dimensions: 'Ø 550 × 400',
      },
    ],
  },
};

export const ALL_HOTSPOTS: Hotspot[] = Object.values(SCENES).flatMap((scene) => scene.hotspots);

/**
 * The hero's choreography, in fractions of its scroll distance. Every moving
 * part reads its range from here, so retiming a beat is a one-line change.
 */
export const TIMELINE = {
  introOut: [0, 0.07],
  salonZoom: [0, 0.4],
  salonHotspots: [0.03, 0.05, 0.19, 0.22],
  portalIn: [0.2, 0.26],
  portalGrow: [0.26, 0.42],
  loftZoom: [0.42, 0.68],
  loftHotspots: [0.42, 0.44, 0.59, 0.61],
  nookRise: [0.6, 0.7],
  nookSettle: [0.6, 0.78],
  nookHotspots: [0.68, 0.7, 0.77, 0.79],
  nookFrame: [0.79, 0.89],
  closeIn: [0.84, 0.91],
} as const;

export type MaterialId = 'leather' | 'walnut' | 'marble';

export interface Material {
  id: MaterialId;
  name: TranslationKey;
  note: TranslationKey;
  origin: TranslationKey;
  finish: TranslationKey;
  thickness: string;
  /** Swatch ring and the spec readout's accent. */
  tone: string;
}

export const MATERIALS: Material[] = [
  {
    id: 'leather',
    name: 'home_mat_leather',
    note: 'home_mat_leather_note',
    origin: 'home_mat_leather_origin',
    finish: 'home_mat_leather_finish',
    thickness: '1.3 mm',
    tone: '#8A4B2A',
  },
  {
    id: 'walnut',
    name: 'home_mat_walnut',
    note: 'home_mat_walnut_note',
    origin: 'home_mat_walnut_origin',
    finish: 'home_mat_walnut_finish',
    thickness: '20 mm',
    tone: '#4A3424',
  },
  {
    id: 'marble',
    name: 'home_mat_marble',
    note: 'home_mat_marble_note',
    origin: 'home_mat_marble_origin',
    finish: 'home_mat_marble_finish',
    thickness: '20 mm',
    tone: '#CFC8BE',
  },
];

export type LayerId = 'cover' | 'feather' | 'foam' | 'springs' | 'frame';

export interface SeatLayer {
  id: LayerId;
  name: TranslationKey;
  spec: TranslationKey;
}

/** Top to bottom, the way the seat is upholstered. */
export const SEAT_LAYERS: SeatLayer[] = [
  { id: 'cover', name: 'home_layer_cover', spec: 'home_layer_cover_spec' },
  {
    id: 'feather',
    name: 'home_layer_feather',
    spec: 'home_layer_feather_spec',
  },
  { id: 'foam', name: 'home_layer_foam', spec: 'home_layer_foam_spec' },
  {
    id: 'springs',
    name: 'home_layer_springs',
    spec: 'home_layer_springs_spec',
  },
  { id: 'frame', name: 'home_layer_frame', spec: 'home_layer_frame_spec' },
];
