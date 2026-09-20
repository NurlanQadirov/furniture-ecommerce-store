import type { Metadata } from 'next';
import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  breadcrumbNode,
  calculatorAppNode,
  graph,
  webPageNode,
} from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';
import { nodeId } from '@/lib/seo/site';
import { getCalculatorSettings } from '@/lib/store/server';

export async function generateMetadata(): Promise<Metadata> {
  const { language, t } = await getSchemaContext();

  return pageMetadata({
    path: '/calculator',
    title: t('seo_calculator_title'),
    description: t('seo_calculator_description'),
    language,
    t,
  });
}

export default async function CalculatorPage() {
  const [settings, schema] = await Promise.all([
    getCalculatorSettings(),
    getSchemaContext(),
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
    calculatorAppNode(schema),
  ]);

  return (
    <div className="bg-gray-50">
      <JsonLd id="mebeltech-calculator" data={pageGraph} />
      <CalculatorWizard settings={settings} />
    </div>
  );
}
