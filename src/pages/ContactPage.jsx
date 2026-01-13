import React, { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';

function ContactPage() {
  const { t } = useTranslation();
  const comp = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        opacity: 0, y: 60, duration: 1.2, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: comp.current, start: "top 80%", toggleActions: "play none none none", once: true, },
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="bg-custom-green py-24">
      <div className="w-full max-w-[700px] mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-6xl text-dark-green animate-item">{t('contact_page_title')}</h1>
          <p className="mt-4 text-lg text-custom-black animate-item">{t('contact_page_subtitle')}</p>
        </div>
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl space-y-8 animate-item">
          <div className="flex items-start gap-4">
            <MapPinIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold">{t('our_address')}</h3>
              <p>{t('footer_address_value')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <PhoneIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold">{t('phone_label')}</h3>
              <p>{t('footer_phone_value')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <EnvelopeIcon className="h-8 w-8 text-dark-green mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold">{t('email_label')}</h3>
              <p>{t('footer_email_value')}</p>
            </div>
          </div>
          <div className="mt-8 rounded-lg overflow-hidden border-2 border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.748348274363!2d49.85175631539423!3d40.36987327940175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d079efb5163%3A0xc202bfd8e906324!2sNizami%20St%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1673883343343!5m2!1sen!2s"
              width="100%" height="350" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;