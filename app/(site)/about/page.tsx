import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import { ORGANIZATION_ID, breadcrumbNode, graph, webPageNode } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { language, t } = await getSchemaContext();

  return pageMetadata({
    path: '/about',
    title: t('seo_about_title'),
    description: t('seo_about_description'),
    images: ['/team.jpg'],
    language,
    t,
  });
}

export default async function AboutPage() {
  const schema = await getSchemaContext();

  const pageGraph = graph([
    webPageNode(schema, {
      type: 'AboutPage',
      path: '/about',
      name: schema.t('about_page_title'),
      description: schema.t('seo_about_description'),
      image: '/team.jpg',
      mainEntity: ORGANIZATION_ID,
      hasBreadcrumb: true,
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('about'), path: '/about' },
      ],
      '/about',
    ),
  ]);

  return (
    <>
      <JsonLd id="mebeltech-about" data={pageGraph} />
      <AboutContent />
    </>
  );
}
