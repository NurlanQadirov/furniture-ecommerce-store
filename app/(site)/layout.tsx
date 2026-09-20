import type { ReactNode } from 'react';
import Header from '@/components/Header';
import RevealObserver from '@/components/RevealObserver';
import Footer from '@/components/Footer';
import TranslationProvider from '@/components/providers/TranslationProvider';
import SiteDataProvider from '@/components/providers/SiteDataProvider';
import JsonLd from '@/components/seo/JsonLd';
import { getSchemaContext } from '@/lib/seo/context';
import {
  graph,
  localBusinessNode,
  offerCatalogNode,
  organizationNode,
  webSiteNode,
} from '@/lib/seo/jsonld';
import { getCategories, getContact, getProducts } from '@/lib/store/server';
import { getLanguage, getMessagesFor } from '@/lib/i18n/server';

interface SiteLayoutProps {
  children: ReactNode;
}

/** The public-facing shell: translations, contact data, header and footer. */
export default async function SiteLayout({ children }: SiteLayoutProps) {
  const [contact, language, schema, categories, products] = await Promise.all([
    getContact(),
    getLanguage(),
    getSchemaContext(),
    getCategories(),
    getProducts(),
  ]);

  const counts = products.reduce<Record<string, number>>((totals, product) => {
    totals[product.categoryId] = (totals[product.categoryId] ?? 0) + 1;
    return totals;
  }, {});

  /**
   * The identity graph, on every public page rather than only the home page.
   *
   * An answer engine rarely enters through `/`: it lands on a product or a
   * category from a search result and has to be able to tell, from that page
   * alone, who sells the thing, where they are and what else they make. The
   * page-level graphs then reference these nodes by `@id` instead of repeating
   * them.
   */
  const identity = graph([
    organizationNode(schema, categories),
    localBusinessNode(schema, products),
    webSiteNode(schema),
    categories.length > 0 ? offerCatalogNode(schema, categories, counts) : undefined,
  ]);

  return (
    <TranslationProvider language={language} messages={getMessagesFor(language)}>
      <SiteDataProvider contact={contact}>
        <div className="w-full font-sans text-custom-black bg-white">
          <JsonLd id="mebeltech-identity" data={identity} />
          {/* Reveals hide their items until the observer runs, so a visitor
              without JavaScript has to be handed them back. */}
          <noscript>
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '[data-reveal="pending"] .animate-item{opacity:1;transform:none}',
              }}
            />
          </noscript>
          <RevealObserver />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </SiteDataProvider>
    </TranslationProvider>
  );
}
