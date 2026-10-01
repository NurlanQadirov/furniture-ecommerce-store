import type { Metadata } from 'next';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  breadcrumbNode,
  calculatorAppNode,
  graph,
  pricingCatalogNode,
  serviceNode,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { nodeId } from '@/lib/seo/site';
import type { Translator } from '@/lib/i18n/translate';
import type { CalculatorSettings } from '@/lib/store/schema';
import { getCalculatorSettings, getCategories } from '@/lib/store/server';

/** The cheapest option the owner has priced, or nothing if none is. */
function lowest(prices: number[]): number | undefined {
  const priced = prices.filter((price) => price > 0);
  return priced.length > 0 ? Math.min(...priced) : undefined;
}

/**
 * "Prices: kitchen units from 260 AZN per running metre, wardrobes from…"
 *
 * The wizard only shows its rates once someone clicks through it, so the
 * snippet is the one place a searcher — or an answer engine — can read them
 * without running it. Read from the live settings, so it follows every edit
 * the owner makes in the panel.
 */
function startingRates(settings: CalculatorSettings, t: Translator): string {
  const rates = [
    ['seo_rate_kitchen', lowest(settings.kitchen.materials.map((item) => item.lowerPerM))],
    ['seo_rate_wardrobe', lowest(settings.wardrobe.materials.map((item) => item.pricePerM2))],
    ['seo_rate_living', lowest(settings.living.materials.map((item) => item.pricePerM2))],
    ['seo_rate_fixed', lowest(settings.fixed.models.map((item) => item.price))],
  ] as const;

  const parts = rates
    .filter(([, price]) => price !== undefined)
    .map(([key, price]) => t(key, { price: price as number }));

  return parts.length > 0 ? t('seo_calculator_rates', { rates: parts.join(', ') }) : '';
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ language, t }, settings] = await Promise.all([
    getSchemaContext(),
    getCalculatorSettings(),
  ]);

  return pageMetadata({
    path: '/calculator',
    title: t('seo_calculator_title'),
    description: [startingRates(settings, t), t('seo_calculator_description')]
      .filter(Boolean)
      .join(' '),
    language,
    t,
  });
}

export default async function CalculatorPage() {
  const [settings, schema, categories] = await Promise.all([
    getCalculatorSettings(),
    getSchemaContext(),
    getCategories(),
  ]);

  const pageGraph = graph([
    webPageNode(schema, {
      path: '/calculator',
      name: schema.t('calc_title'),
      description: schema.t('seo_calculator_description'),
      mainEntity: nodeId('/calculator', 'app'),
      hasBreadcrumb: true,
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('calculator'), path: '/calculator' },
      ],
      '/calculator',
    ),
    calculatorAppNode(schema, settings),
    // The service the rates belong to, and the rates themselves: the one page
    // where both are in full, so the price list is never a dangling reference.
    serviceNode(schema, categories),
    pricingCatalogNode(schema, settings),
  ]);

  return (
    <div className="bg-gray-50">
      <JsonLd id="mebeltech-calculator" data={pageGraph} />
      <CalculatorWizard settings={settings} />
    </div>
  );
}
