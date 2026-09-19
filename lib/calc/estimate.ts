import type { AddOn, CalculatorSettings, RoomType } from '@/lib/store/schema';
import type { Localized } from '@/types';

/** Quantities keyed by add-on id; a missing key means zero. */
export type Quantities = Record<string, number>;

export interface KitchenInput {
  room: 'kitchen';
  lowerM: number;
  upperM: number;
  counterM: number;
  materialId: string;
  counterTopId: string;
  hardwareId: string;
  quantities: Quantities;
}

export interface WardrobeInput {
  room: 'wardrobe';
  width: number;
  height: number;
  materialId: string;
  doorTypeId: string;
  depthId: string;
  glassId: string;
  hardwareId: string;
  quantities: Quantities;
}

export interface LivingInput {
  room: 'living';
  width: number;
  height: number;
  materialId: string;
  hardwareId: string;
  quantities: Quantities;
}

export interface FixedInput {
  room: 'fixed';
  modelId: string;
  quantity: number;
}

export type CalculatorInput = KitchenInput | WardrobeInput | LivingInput | FixedInput;

export interface EstimateLine {
  /** i18n key for the row label. */
  labelKey: string;
  /** Localised option name appended to the label, when the row names an option. */
  name?: Localized;
  /** e.g. "3.5 m × 400" — already formatted, language independent. */
  detail?: string;
  amount: number;
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
  min: number;
  max: number;
  /** False when required options are missing — the UI keeps the result hidden. */
  valid: boolean;
}

const EMPTY: Estimate = { lines: [], total: 0, min: 0, max: 0, valid: false };

const round = (value: number) => Math.round(value * 100) / 100;

function roundTo(value: number, step: number, direction: 'down' | 'up'): number {
  if (step <= 0) return Math.round(value);
  const divided = value / step;
  return (direction === 'down' ? Math.floor(divided) : Math.ceil(divided)) * step;
}

/** Sums the chosen add-ons into one line per add-on that has a quantity. */
function addOnLines(catalogue: AddOn[], quantities: Quantities): EstimateLine[] {
  return catalogue.flatMap((addOn) => {
    const quantity = Math.max(0, Math.min(addOn.max, Math.floor(quantities[addOn.id] ?? 0)));
    if (quantity === 0) return [];
    return [
      {
        labelKey: 'calc_line_accessory',
        name: addOn.name,
        detail: quantity > 1 ? `${quantity} × ${addOn.price}` : undefined,
        amount: quantity * addOn.price,
      },
    ];
  });
}

/**
 * Turns a configuration into a price band.
 *
 * The shop never quotes an exact figure without measuring on site, so the
 * result is deliberately a range: the midpoint is the honest arithmetic and
 * `rangePercent` is the uncertainty the owner is willing to commit to.
 */
export function estimate(
  input: CalculatorInput,
  settings: CalculatorSettings,
): Estimate {
  const lines: EstimateLine[] = [];
  let carcass = 0;
  let extras = 0;
  let hardwareMultiplier = 1;
  let hardwareName: Localized | undefined;
  let chargeInstallation = true;

  if (input.room === 'kitchen') {
    const { kitchen } = settings;
    const material = kitchen.materials.find((item) => item.id === input.materialId);
    const counterTop = kitchen.counterTops.find((item) => item.id === input.counterTopId);
    const hardware = kitchen.hardwareLevels.find((item) => item.id === input.hardwareId);
    if (!material || !counterTop || !hardware) return EMPTY;
    if (input.lowerM <= 0 && input.upperM <= 0) return EMPTY;

    const lower = input.lowerM * material.lowerPerM;
    const upper = input.upperM * material.upperPerM;
    const top = input.counterM * counterTop.pricePerM;

    if (lower > 0) {
      lines.push({
        labelKey: 'calc_line_lower',
        name: material.name,
        detail: `${input.lowerM} m × ${material.lowerPerM}`,
        amount: round(lower),
      });
    }
    if (upper > 0) {
      lines.push({
        labelKey: 'calc_line_upper',
        name: material.name,
        detail: `${input.upperM} m × ${material.upperPerM}`,
        amount: round(upper),
      });
    }
    if (top > 0) {
      lines.push({
        labelKey: 'calc_line_counter',
        name: counterTop.name,
        detail: `${input.counterM} m × ${counterTop.pricePerM}`,
        amount: round(top),
      });
    }

    carcass = lower + upper + top;
    hardwareMultiplier = hardware.multiplier;
    hardwareName = hardware.name;
    const accessories = addOnLines(kitchen.accessories, input.quantities);
    extras = accessories.reduce((sum, line) => sum + line.amount, 0);
    lines.push(...accessories);
  } else if (input.room === 'wardrobe') {
    const { wardrobe } = settings;
    const material = wardrobe.materials.find((item) => item.id === input.materialId);
    const doorType = wardrobe.doorTypes.find((item) => item.id === input.doorTypeId);
    const depth = wardrobe.depthOptions.find((item) => item.id === input.depthId);
    const glass = wardrobe.glassOptions.find((item) => item.id === input.glassId);
    const hardware = wardrobe.hardwareLevels.find((item) => item.id === input.hardwareId);
    if (!material || !doorType || !depth || !glass || !hardware) return EMPTY;
    if (input.width <= 0 || input.height <= 0) return EMPTY;

    const area = round(input.width * input.height);
    const body = area * material.pricePerM2 * doorType.multiplier * depth.multiplier;
    const glassAmount = area * glass.pricePerM2;

    lines.push({
      labelKey: 'calc_line_facade',
      name: material.name,
      detail: `${area} m² × ${material.pricePerM2}`,
      amount: round(body),
    });
    lines.push({
      labelKey: 'calc_line_door_type',
      name: doorType.name,
      detail: `× ${doorType.multiplier}`,
      amount: 0,
    });
    if (glassAmount > 0) {
      lines.push({
        labelKey: 'calc_line_glass',
        name: glass.name,
        detail: `${area} m² × ${glass.pricePerM2}`,
        amount: round(glassAmount),
      });
    }

    carcass = body + glassAmount;
    hardwareMultiplier = hardware.multiplier;
    hardwareName = hardware.name;
    const interior = addOnLines(wardrobe.interiorItems, input.quantities);
    extras = interior.reduce((sum, line) => sum + line.amount, 0);
    lines.push(...interior);
  } else if (input.room === 'living') {
    const { living } = settings;
    const material = living.materials.find((item) => item.id === input.materialId);
    const hardware = living.hardwareLevels.find((item) => item.id === input.hardwareId);
    if (!material || !hardware) return EMPTY;
    if (input.width <= 0 || input.height <= 0) return EMPTY;

    const area = round(input.width * input.height);
    const body = area * material.pricePerM2;

    lines.push({
      labelKey: 'calc_line_facade',
      name: material.name,
      detail: `${area} m² × ${material.pricePerM2}`,
      amount: round(body),
    });

    carcass = body;
    hardwareMultiplier = hardware.multiplier;
    hardwareName = hardware.name;
    const modules = addOnLines(living.modules, input.quantities);
    extras = modules.reduce((sum, line) => sum + line.amount, 0);
    lines.push(...modules);
  } else {
    const model = settings.fixed.models.find((item) => item.id === input.modelId);
    if (!model) return EMPTY;

    const quantity = Math.max(1, Math.floor(input.quantity));
    carcass = model.price * quantity;
    lines.push({
      labelKey: 'calc_line_model',
      name: model.name,
      detail: quantity > 1 ? `${quantity} × ${model.price}` : undefined,
      amount: round(carcass),
    });
    // Ready models ship assembled — only delivery applies.
    chargeInstallation = false;
  }

  const hardwareAmount = carcass * (hardwareMultiplier - 1);
  if (hardwareAmount > 0 && hardwareName) {
    lines.push({
      labelKey: 'calc_line_hardware',
      name: hardwareName,
      detail: `× ${hardwareMultiplier}`,
      amount: round(hardwareAmount),
    });
  }

  const installation = chargeInstallation ? settings.installationFee : 0;
  if (installation > 0) {
    lines.push({ labelKey: 'calc_line_installation', amount: installation });
  }
  if (settings.deliveryFee > 0) {
    lines.push({ labelKey: 'calc_line_delivery', amount: settings.deliveryFee });
  }

  const total = carcass + hardwareAmount + extras + installation + settings.deliveryFee;
  const spread = total * (settings.rangePercent / 100);

  return {
    lines,
    total: round(total),
    min: Math.max(0, roundTo(total - spread, settings.roundTo, 'down')),
    max: roundTo(total + spread, settings.roundTo, 'up'),
    valid: total > 0,
  };
}
