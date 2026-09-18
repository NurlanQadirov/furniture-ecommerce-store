'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

export default function Philosophy() {
  const { t } = useTranslation();
  const sectionRef = useSectionReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="w-full bg-custom-black text-white py-24"
    >
      <div className="w-full max-w-[1100px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="animate-item">
          <h2 className="font-serif text-5xl text-white">{t('philosophy_title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">{t('philosophy_desc')}</p>
          <Link
            href="/about"
            className="inline-block mt-6 bg-white text-dark-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-all"
          >
            {t('about_us_more')}
          </Link>
        </div>
        <div className="animate-item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932"
            alt="Müasir İnteryer"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
