import type { Localized } from '@/types';

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/**
 * Normalises whatever the admin form posted into a complete `Localized`.
 * Missing translations fall back to the Azerbaijani text so the site never
 * shows a blank name to an English or Russian visitor.
 */
export function toLocalized(value: unknown, fallback?: Localized): Localized {
  const source = (value ?? {}) as Partial<Record<string, unknown>>;
  const az = asString(source.az) || fallback?.az || '';
  return {
    az,
    en: asString(source.en) || fallback?.en || az,
    ru: asString(source.ru) || fallback?.ru || az,
  };
}

export function toText(value: unknown, fallback = ''): string {
  const text = asString(value);
  return text || fallback;
}

/** Clamps a posted number, falling back when it is missing or unparseable. */
export function toNumber(value: unknown, fallback = 0, min = 0, max = 1_000_000): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

/** Keeps only the non-empty strings of a posted array — used for image lists. */
export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}
