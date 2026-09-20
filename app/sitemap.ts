import type { MetadataRoute } from 'next';
import { supportedLanguages } from '@/lib/i18n/languages';
import { absoluteImageUrl, absoluteUrl, hrefLangs, localizedUrl } from '@/lib/seo/site';
import { getCategories, getProducts, getStoreModifiedAt } from '@/lib/store/server';
import type { Language } from '@/types';

/**
 * The catalogue is editable at runtime, so the sitemap has to be built per
 * request rather than frozen into the bundle at deploy time.
 */
export const dynamic = 'force-dynamic';

interface RouteInput {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  images?: (string | undefined)[];
}

/**
 * One `<url>` per page *per language*, each carrying the whole `hreflang`
 * cluster including itself.
 *
 * Listing a page once with its translations attached is the common shortcut and
 * it is wrong: Google treats the alternates as a set that every member has to
 * declare, so a version that never appears as its own `<loc>` is a version it
 * will not reconcile.
 */
function expand(route: RouteInput): MetadataRoute.Sitemap {
  const languages = Object.fromEntries([
    ...supportedLanguages.map((code) => [hrefLangs[code], localizedUrl(route.path, code)]),
    ['x-default', absoluteUrl(route.path)],
  ]);

  const images = (route.images ?? [])
    .map(absoluteImageUrl)
    .filter((image): image is string => Boolean(image));

  return supportedLanguages.map((language: Language) => ({
    url: localizedUrl(route.path, language),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: { languages },
    ...(images.length > 0 ? { images } : {}),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, storeModifiedAt] = await Promise.all([
    getCategories(),
    getProducts(),
    getStoreModifiedAt(),
  ]);

  const counts = products.reduce<Record<string, number>>((totals, product) => {
    totals[product.categoryId] = (totals[product.categoryId] ?? 0) + 1;
    return totals;
  }, {});

  const routes: RouteInput[] = [
    {
      path: '/',
      lastModified: storeModifiedAt,
      changeFrequency: 'weekly',
      priority: 1,
      images: ['/furniture.jpg'],
    },
    {
      path: '/products',
      lastModified: storeModifiedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: categories.slice(0, 5).map((category) => category.image),
    },
    {
      path: '/calculator',
      lastModified: storeModifiedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { path: '/about', lastModified: storeModifiedAt, changeFrequency: 'yearly', priority: 0.5, images: ['/team.jpg'] },
    { path: '/contact', lastModified: storeModifiedAt, changeFrequency: 'monthly', priority: 0.7 },

    ...categories.map((category) => ({
      path: `/products/${category.slug}`,
      lastModified: storeModifiedAt,
      changeFrequency: 'weekly' as const,
      // An empty category is a thin page; it stays in the sitemap but does not
      // claim the same weight as one with a catalogue behind it.
      priority: (counts[category.id] ?? 0) > 0 ? 0.8 : 0.4,
      images: [category.image],
    })),

    ...products.map((product) => ({
      path: `/product/${product.id}`,
      // The store records when a product was added, not when it was edited, so
      // this is the later of the two dates it can actually stand behind.
      lastModified: new Date(
        Math.max(new Date(product.createdAt).getTime() || 0, 0) || storeModifiedAt.getTime(),
      ),
      changeFrequency: 'monthly' as const,
      priority: product.featured ? 0.8 : 0.7,
      images: [product.mainImage, ...product.images],
    })),
  ];

  return routes.flatMap(expand);
}
