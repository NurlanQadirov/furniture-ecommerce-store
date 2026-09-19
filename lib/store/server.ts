import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createDefaultStore } from '@/lib/store/defaults';
import type { SiteStore } from '@/lib/store/schema';
import type { Category, Lead, Product } from '@/types';

const STORE_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(STORE_DIR, 'store.json');

/**
 * Writes are serialised through this chain so two admin requests landing at the
 * same moment can never interleave a read-modify-write on the JSON file.
 */
let writeQueue: Promise<unknown> = Promise.resolve();

/** Fills in anything a hand-edited or older `store.json` is missing. */
function withDefaults(raw: Partial<SiteStore> | null): SiteStore {
  const defaults = createDefaultStore();
  if (!raw) return defaults;

  const store: SiteStore = {
    categories: raw.categories ?? defaults.categories,
    products: raw.products ?? defaults.products,
    contact: { ...defaults.contact, ...raw.contact },
    calculator: {
      ...defaults.calculator,
      ...raw.calculator,
      kitchen: { ...defaults.calculator.kitchen, ...raw.calculator?.kitchen },
      wardrobe: { ...defaults.calculator.wardrobe, ...raw.calculator?.wardrobe },
      living: { ...defaults.calculator.living, ...raw.calculator?.living },
      fixed: { ...defaults.calculator.fixed, ...raw.calculator?.fixed },
    },
    leads: raw.leads ?? [],
  };

  // A store written before ordering was per category (or hand-edited) can hold
  // duplicate positions. Normalising on read means the panel never shows two
  // products numbered the same, and the next write persists the fix.
  const categoryIds = new Set(store.products.map((product) => product.categoryId));
  categoryIds.forEach((categoryId) => resequenceCategory(store.products, categoryId));

  return store;
}

/** Reads the whole store, seeding `data/store.json` on first run. */
export async function readStore(): Promise<SiteStore> {
  try {
    const contents = await fs.readFile(STORE_FILE, 'utf8');
    return withDefaults(JSON.parse(contents) as Partial<SiteStore>);
  } catch {
    const seeded = createDefaultStore();
    await writeStore(seeded);
    return seeded;
  }
}

export async function writeStore(store: SiteStore): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

/** Read-modify-write against the single store file, one caller at a time. */
export async function mutateStore<T>(
  mutator: (store: SiteStore) => T | Promise<T>,
): Promise<T> {
  const run = writeQueue.then(async () => {
    const store = await readStore();
    const result = await mutator(store);
    await writeStore(store);
    return result;
  });

  // Keep the chain alive even when this mutation rejects.
  writeQueue = run.catch(() => undefined);
  return run;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getCategories(): Promise<Category[]> {
  const { categories } = await readStore();
  return [...categories].sort(byOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const { categories } = await readStore();
  return categories.find((category) => category.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await readStore();
  return [...products].sort(byOrder);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.categoryId === categoryId);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { products } = await readStore();
  return products.find((product) => product.id === id);
}

export async function getContact() {
  const { contact } = await readStore();
  return contact;
}

export async function getCalculatorSettings() {
  const { calculator } = await readStore();
  return calculator;
}

export async function getLeads(): Promise<Lead[]> {
  const { leads } = await readStore();
  return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Renumbers one category's products as 1, 2, 3… with no gaps or duplicates.
 *
 * The panel exposes `order` as a plain number, so typing a position another
 * product already holds would otherwise leave the two sharing it. Moving a
 * product therefore pushes the others along instead of overwriting them.
 */
export function resequenceCategory(
  products: Product[],
  categoryId: string,
  move?: { id: string; to: number },
): void {
  const items = products
    .filter((product) => product.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);

  if (move) {
    const index = items.findIndex((product) => product.id === move.id);
    const moved = index === -1 ? undefined : items[index];
    if (moved) {
      items.splice(index, 1);
      const target = Math.min(Math.max(1, Math.round(move.to)), items.length + 1);
      items.splice(target - 1, 0, moved);
    }
  }

  items.forEach((product, index) => {
    product.order = index + 1;
  });
}

/** Sentinel position meaning "put this at the end of its category". */
export const LAST_POSITION = Number.MAX_SAFE_INTEGER;

/** Short, collision-resistant enough for a single-owner catalogue. */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Turns a product or category name into a URL-safe slug, Azerbaijani letters included. */
export function slugify(value: string): string {
  const map: Record<string, string> = {
    ə: 'e', ı: 'i', ö: 'o', ü: 'u', ğ: 'g', ş: 's', ç: 'c',
    Ə: 'e', I: 'i', Ö: 'o', Ü: 'u', Ğ: 'g', Ş: 's', Ç: 'c',
  };

  return value
    .split('')
    .map((char) => map[char] ?? char)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
