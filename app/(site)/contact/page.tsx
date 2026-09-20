import type { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import { LOCAL_BUSINESS_ID, breadcrumbNode, graph, webPageNode } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { language, t, loc, contact } = await getSchemaContext();

  return pageMetadata({
    path: '/contact',
    title: t('seo_contact_title'),
    // The address, phone and email belong in the snippet itself: a "furniture
    // shop in Baku, phone" query is answered without the click, which is the
    // outcome a local business wants.
    description: t('seo_contact_description', {
      address: loc(contact.address),
      phone: contact.phone,
      email: contact.email,
    }),
    language,
    t,
  });
}

export default async function ContactPage() {
  const schema = await getSchemaContext();

  const pageGraph = graph([
    webPageNode(schema, {
      type: 'ContactPage',
      path: '/contact',
      name: schema.t('contact_page_title'),
      description: schema.t('contact_page_subtitle'),
      mainEntity: LOCAL_BUSINESS_ID,
      hasBreadcrumb: true,
    }),
    breadcrumbNode(
      schema,
      [
        { name: schema.t('home'), path: '/' },
        { name: schema.t('contact'), path: '/contact' },
      ],
      '/contact',
    ),
  ]);

  return (
    <>
      <JsonLd id="mebeltech-contact" data={pageGraph} />
      <ContactContent />
    </>
  );
}
