import { getLanguage, getT } from '@/lib/i18n/server';
import { pickLocalized } from '@/lib/i18n/localized';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getContact } from '@/lib/store/server';
import { whatsappLink } from '@/lib/contact';
import type { Localized } from '@/types';

export default async function ContactContent() {
  const t = await getT();
  const contact = await getContact();
  // The server resolves the language once; `loc` keeps the call sites unchanged.
  const language = await getLanguage();
  const loc = (value: Localized | undefined) => pickLocalized(value, language);

  return (
    <section data-reveal="pending" data-reveal-duration="1200" data-reveal-start="80" className="bg-custom-green py-24">
      <div className="w-full max-w-[700px] mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="font-serif text-6xl text-dark-green animate-item">
            {t('contact_page_title')}
          </h1>
          <p className="mt-4 text-lg text-custom-black animate-item">
            {t('contact_page_subtitle')}
          </p>
        </header>
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl space-y-8 animate-item">
          <div className="flex items-start gap-4">
            <MapPinIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t('our_address')}</h2>
              <p>{loc(contact.address)}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <PhoneIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t('phone_label')}</h2>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                aria-label={t('aria_call', { phone: contact.phone })}
                className="hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <EnvelopeIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">{t('email_label')}</h2>
              <a
                href={`mailto:${contact.email}`}
                aria-label={t('aria_email', { email: contact.email })}
                className="hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {contact.whatsapp && (
              <a
                href={whatsappLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('aria_whatsapp')}
                className="inline-flex items-center gap-2 bg-dark-green text-white font-bold px-5 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              >
                <FaWhatsapp size={20} />
                {t('write_whatsapp')}
              </a>
            )}
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('aria_instagram')}
                className="inline-flex items-center gap-2 border-2 border-dark-green text-dark-green font-bold px-5 py-3 rounded-lg hover:bg-custom-green transition-all"
              >
                <FaInstagram size={20} />
                Instagram
              </a>
            )}
          </div>

          {contact.mapEmbedUrl && (
            <div className="mt-8 rounded-lg overflow-hidden border-2 border-gray-200">
              <iframe
                title={t('aria_map')}
                src={contact.mapEmbedUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
