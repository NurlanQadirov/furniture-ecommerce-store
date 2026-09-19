'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useContactInfo, whatsappLink } from '@/components/providers/SiteDataProvider';
import { useLocalized } from '@/lib/i18n/localized';

const menuLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/products', labelKey: 'products' },
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/about', labelKey: 'about' },
  { href: '/contact', labelKey: 'contact' },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const contact = useContactInfo();
  const loc = useLocalized();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-custom-black text-white pt-16 pb-8">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4 md:col-span-1">
            <Link href="/">
              <Image
                src="/Logo2.png"
                alt="Mebeltech Logo"
                width={500}
                height={500}
                className="h-10 w-auto bg-white p-2 rounded-md"
              />
            </Link>
            <p className="text-sm text-gray-400">{t('footer_desc')}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer_menu')}</h3>
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
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer_contact_info')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('footer_address_label')}</span>
                <span>{loc(contact.address)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('phone_label')}:</span>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0">{t('email_label')}:</span>
                <a href={`mailto:${contact.email}`} className="hover:text-white">
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
                  aria-label="Instagram"
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
                  aria-label="WhatsApp"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaWhatsapp size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>{t('footer_copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
