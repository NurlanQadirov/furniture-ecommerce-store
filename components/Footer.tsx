import Image from 'next/image';
import Link from 'next/link';
import { getLanguage, getT } from '@/lib/i18n/server';
import { pickLocalized } from '@/lib/i18n/localized';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getContact } from '@/lib/store/server';
import { whatsappLink } from '@/lib/contact';
import type { Localized } from '@/types';

const menuLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/products', labelKey: 'products' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/about', labelKey: 'about' },
  { href: '/contact', labelKey: 'contact' },
] as const;

export default async function Footer() {
  const t = await getT();
  const contact = await getContact();
  // The server resolves the language once; `loc` keeps the call sites unchanged.
  const language = await getLanguage();
  const loc = (value: Localized | undefined) => pickLocalized(value, language);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-custom-black text-white pt-16 pb-8">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" aria-label={`${t('alt_logo')} — ${t('home')}`}>
              <Image
                src="/Logo2.png"
                alt={t('alt_logo')}
                width={500}
                height={500}
                className="h-10 w-auto bg-white p-2 rounded-md"
              />
            </Link>
            <p className="text-sm text-gray-400">{t('footer_desc')}</p>
          </div>
          <nav aria-label={t('aria_footer_nav')}>
            <h2 className="text-lg font-bold mb-4">{t('footer_menu')}</h2>
            <ul className="space-y-2">
              {menuLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="text-lg font-bold mb-4">{t('footer_contact_info')}</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('footer_address_label')}</span>
                <span>{loc(contact.address)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('phone_label')}:</span>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  aria-label={t('aria_call', { phone: contact.phone })}
                  className="hover:text-white"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('email_label')}:</span>
                <a
                  href={`mailto:${contact.email}`}
                  aria-label={t('aria_email', { email: contact.email })}
                  className="hover:text-white"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('aria_instagram')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={whatsappLink(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('aria_whatsapp')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaWhatsapp size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>{t('footer_copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
