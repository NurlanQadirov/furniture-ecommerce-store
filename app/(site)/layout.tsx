import type { ReactNode } from 'react';
import Header from '@/components/Header';
import RevealObserver from '@/components/RevealObserver';
import Footer from '@/components/Footer';
import I18nProvider from '@/components/providers/I18nProvider';
import SiteDataProvider from '@/components/providers/SiteDataProvider';
import { getContact } from '@/lib/store/server';

interface SiteLayoutProps {
  children: ReactNode;
}

/** The public-facing shell: translations, contact data, header and footer. */
export default async function SiteLayout({ children }: SiteLayoutProps) {
  const contact = await getContact();

  return (
    <I18nProvider>
      <SiteDataProvider contact={contact}>
        <div className="w-full font-sans text-custom-black bg-white">
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
    </I18nProvider>
  );
}
