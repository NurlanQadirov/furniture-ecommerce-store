import type { Category, ContactInfo, Lead, Localized, Product } from '@/types';

/** The four estimating models the calculator knows how to run. */
export type RoomType = 'kitchen' | 'wardrobe' | 'living' | 'fixed';

export const roomTypes: RoomType[] = ['kitchen', 'wardrobe', 'living', 'fixed'];

interface OptionBase {
  id: string;
  name: Localized;
  /** Customers pick materials by sight, not by name — every option carries an image. */
  image: string;
}

/** Kitchens are sold by the running metre, split between lower and upper units. */
export interface KitchenMaterial extends OptionBase {
  lowerPerM: number;
  upperPerM: number;
}

/** Worktops are priced per running metre of lower units. */
export interface CounterTop extends OptionBase {
  pricePerM: number;
}

/** Hardware tier multiplies the carcass subtotal (ekonom 1.0 / standart 1.15 / premium 1.35). */
export interface HardwareLevel {
  id: string;
  name: Localized;
  description: Localized;
  multiplier: number;
}

/** A fixed-price add-on the customer can take 0..max of. */
export interface AddOn {
  id: string;
  name: Localized;
  price: number;
  /** Upper bound of the quantity stepper; 1 turns it into a checkbox. */
  max: number;
}

/** Facades priced per square metre — wardrobes, bedroom units, TV walls. */
export interface AreaMaterial extends OptionBase {
  pricePerM2: number;
}

/** Sliding vs hinged doors, standard vs shallow depth — pure multipliers. */
export interface MultiplierOption {
  id: string;
  name: Localized;
  multiplier: number;
}

/** Mirror / lacobel / glass inserts, charged over the facade area. */
export interface GlassOption extends OptionBase {
  pricePerM2: number;
}

export interface KitchenSettings {
  materials: KitchenMaterial[];
  counterTops: CounterTop[];
  hardwareLevels: HardwareLevel[];
  accessories: AddOn[];
}

export interface WardrobeSettings {
  materials: AreaMaterial[];
  doorTypes: MultiplierOption[];
  depthOptions: MultiplierOption[];
  glassOptions: GlassOption[];
  interiorItems: AddOn[];
  hardwareLevels: HardwareLevel[];
}

export interface LivingSettings {
  materials: AreaMaterial[];
  modules: AddOn[];
  hardwareLevels: HardwareLevel[];
}

/** Beds and chests are quoted per model, not per measurement. */
export interface FixedModel extends OptionBase {
  price: number;
  description: Localized;
}

export interface FixedSettings {
  models: FixedModel[];
}

export interface CalculatorSettings {
  /** Half-width of the quoted band, in percent. The result is always a range. */
  rangePercent: number;
  /** Rounding step applied to both ends of the band. */
  roundTo: number;
  installationFee: number;
  deliveryFee: number;
  kitchen: KitchenSettings;
  wardrobe: WardrobeSettings;
  living: LivingSettings;
  fixed: FixedSettings;
}

/** Everything the site renders that the owner can edit from `/admin`. */
export interface SiteStore {
  categories: Category[];
  products: Product[];
  contact: ContactInfo;
  calculator: CalculatorSettings;
  leads: Lead[];
}
