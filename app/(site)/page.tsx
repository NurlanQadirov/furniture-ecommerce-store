import type { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import WhyMebeltech from '@/components/home/WhyMebeltech';
import CatalogPicks from '@/components/home/CatalogPicks';
import CalculatorTeaser from '@/components/home/CalculatorTeaser';
import Philosophy from '@/components/home/Philosophy';
import WeeklyOffer from '@/components/home/WeeklyOffer';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  LOCAL_BUSINESS_ID,
  graph,
  productListNode,
  serviceNode,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { defaultOgImage } from '@/lib/seo/site';
import { getCategories, getFeaturedProducts, getProducts } from '@/lib/store/server';

export async function generateMetadata(): Promise<Metadata> {
  const { language, t } = await getSchemaContext();

  return pageMetadata({
    path: '/',
    title: t('seo_home_title'),
    titleIsAbsolute: true,
    description: t('seo_home_description'),
    images: ['/furniture.jpg', '/furniture2.jpg', '/furniture3.jpg'],
    language,
    t,
  });
}

export default async function HomePage() {
  const [featured, schema, categories] = await Promise.all([
    getFeaturedProducts(),
    getSchemaContext(),
    getCategories(),
  ]);

  // Fall back to the newest products so the home page is never empty before the
  // owner has starred anything in the admin panel.
  const picks = featured.length > 0 ? featured : (await getProducts()).slice(0, 6);

  const pageGraph = graph([
    webPageNode(schema, {
      path: '/',
      name: schema.t('seo_home_title'),
      description: schema.t('seo_home_description'),
      image: defaultOgImage,
      // The home page is primarily about the storefront itself, which is the
      // node a local-results panel or a "furniture shop in Baku" answer wants.
      mainEntity: LOCAL_BUSINESS_ID,
    }),
    serviceNode(schema, categories),
    picks.length > 0
      ? productListNode(schema, picks, '/', schema.t('catalog_picks_title'))
      : undefined,
  ]);

  return (
    <div>
      <JsonLd id="mebeltech-home" data={pageGraph} />
      <HeroSlider />
      <WhyMebeltech />
      <CatalogPicks products={picks.slice(0, 3)} />
      <CalculatorTeaser />
      <Philosophy />
      <WeeklyOffer products={picks} />
    </div>
  );
}
