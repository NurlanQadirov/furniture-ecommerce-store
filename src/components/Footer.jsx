import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/Logo2.png';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-custom-black text-white pt-16 pb-8">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4 md:col-span-1">
            <Link to="/"><img src={logo} alt="Mebeltech Logo" className="h-10 w-auto bg-white p-2 rounded-md" /></Link>
            <p className="text-sm text-gray-400">{t('footer_desc')}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer_menu')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">{t('products')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer_contact_info')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start"><span className="font-bold w-16">{t('footer_address_label')}</span><span>{t('footer_address_value')}</span></li>
              <li className="flex items-start"><span className="font-bold w-16">{t('phone_label')}:</span><span>{t('footer_phone_value')}</span></li>
              <li className="flex items-start"><span className="font-bold w-16">{t('email_label')}:</span><span>{t('footer_email_value')}</span></li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaWhatsapp size={24} />
              </a>
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

export default Footer;