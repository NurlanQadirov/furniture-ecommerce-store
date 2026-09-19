import { toLocalized, toNumber, toText } from '@/lib/store/coerce';
import { createId } from '@/lib/store/server';
import type {
  AddOn,
  AreaMaterial,
  CalculatorSettings,
  CounterTop,
  FixedModel,
  GlassOption,
  HardwareLevel,
  KitchenMaterial,
  MultiplierOption,
} from '@/lib/store/schema';

type Raw = Record<string, unknown>;

const rows = (value: unknown): Raw[] =>
  Array.isArray(value) ? (value.filter((item) => typeof item === 'object' && item) as Raw[]) : [];

const idOf = (row: Raw, prefix: string) => toText(row.id) || createId(prefix);

/**
 * Rebuilds the tariff tree from whatever the admin form posted.
 *
 * Every field is coerced and clamped rather than trusted: this endpoint is the
 * only way prices reach the public calculator, and a stray empty string would
 * otherwise turn into `NaN` in every estimate.
 */
export function normalizeCalculator(
  body: unknown,
  current: CalculatorSettings,
): CalculatorSettings {
  const raw = (body ?? {}) as Raw;
  const kitchen = (raw.kitchen ?? {}) as Raw;
  const wardrobe = (raw.wardrobe ?? {}) as Raw;
  const living = (raw.living ?? {}) as Raw;
  const fixed = (raw.fixed ?? {}) as Raw;

  const hardwareLevels = (value: unknown, fallback: HardwareLevel[]): HardwareLevel[] => {
    const parsed = rows(value).map<HardwareLevel>((row) => ({
      id: idOf(row, 'hw'),
      name: toLocalized(row.name),
      description: toLocalized(row.description),
      multiplier: toNumber(row.multiplier, 1, 0.1, 10),
    }));
    // A calculator with no hardware tier cannot produce a price at all.
    return parsed.length > 0 ? parsed : fallback;
  };

  const addOns = (value: unknown): AddOn[] =>
    rows(value).map<AddOn>((row) => ({
      id: idOf(row, 'add'),
      name: toLocalized(row.name),
      price: toNumber(row.price, 0, 0, 100_000),
      max: Math.round(toNumber(row.max, 1, 1, 50)),
    }));

  const areaMaterials = (value: unknown, fallback: AreaMaterial[]): AreaMaterial[] => {
    const parsed = rows(value).map<AreaMaterial>((row) => ({
      id: idOf(row, 'mat'),
      name: toLocalized(row.name),
      image: toText(row.image),
      pricePerM2: toNumber(row.pricePerM2, 0, 0, 100_000),
    }));
    return parsed.length > 0 ? parsed : fallback;
  };

  const multipliers = (
    value: unknown,
    fallback: MultiplierOption[],
    prefix: string,
  ): MultiplierOption[] => {
    const parsed = rows(value).map<MultiplierOption>((row) => ({
      id: idOf(row, prefix),
      name: toLocalized(row.name),
      multiplier: toNumber(row.multiplier, 1, 0.1, 10),
    }));
    return parsed.length > 0 ? parsed : fallback;
  };

  const kitchenMaterials = rows(kitchen.materials).map<KitchenMaterial>((row) => ({
    id: idOf(row, 'km'),
    name: toLocalized(row.name),
    image: toText(row.image),
    lowerPerM: toNumber(row.lowerPerM, 0, 0, 100_000),
    upperPerM: toNumber(row.upperPerM, 0, 0, 100_000),
  }));

  const counterTops = rows(kitchen.counterTops).map<CounterTop>((row) => ({
    id: idOf(row, 'ct'),
    name: toLocalized(row.name),
    image: toText(row.image),
    pricePerM: toNumber(row.pricePerM, 0, 0, 100_000),
  }));

  const glassOptions = rows(wardrobe.glassOptions).map<GlassOption>((row) => ({
    id: idOf(row, 'wg'),
    name: toLocalized(row.name),
    image: toText(row.image),
    pricePerM2: toNumber(row.pricePerM2, 0, 0, 100_000),
  }));

  const fixedModels = rows(fixed.models).map<FixedModel>((row) => ({
    id: idOf(row, 'fx'),
    name: toLocalized(row.name),
    description: toLocalized(row.description),
    image: toText(row.image),
    price: toNumber(row.price, 0, 0, 1_000_000),
  }));

  return {
    rangePercent: toNumber(raw.rangePercent, current.rangePercent, 0, 60),
    roundTo: Math.round(toNumber(raw.roundTo, current.roundTo, 1, 1000)),
    installationFee: toNumber(raw.installationFee, current.installationFee, 0, 100_000),
    deliveryFee: toNumber(raw.deliveryFee, current.deliveryFee, 0, 100_000),
    kitchen: {
      materials: kitchenMaterials.length > 0 ? kitchenMaterials : current.kitchen.materials,
      counterTops: counterTops.length > 0 ? counterTops : current.kitchen.counterTops,
      hardwareLevels: hardwareLevels(kitchen.hardwareLevels, current.kitchen.hardwareLevels),
      accessories: addOns(kitchen.accessories),
    },
    wardrobe: {
      materials: areaMaterials(wardrobe.materials, current.wardrobe.materials),
      doorTypes: multipliers(wardrobe.doorTypes, current.wardrobe.doorTypes, 'wd'),
      depthOptions: multipliers(wardrobe.depthOptions, current.wardrobe.depthOptions, 'wdp'),
      glassOptions: glassOptions.length > 0 ? glassOptions : current.wardrobe.glassOptions,
      interiorItems: addOns(wardrobe.interiorItems),
      hardwareLevels: hardwareLevels(wardrobe.hardwareLevels, current.wardrobe.hardwareLevels),
    },
    living: {
      materials: areaMaterials(living.materials, current.living.materials),
      modules: addOns(living.modules),
      hardwareLevels: hardwareLevels(living.hardwareLevels, current.living.hardwareLevels),
    },
    fixed: {
      models: fixedModels.length > 0 ? fixedModels : current.fixed.models,
    },
  };
}
