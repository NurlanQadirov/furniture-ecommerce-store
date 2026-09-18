'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

export default function AboutContent() {
  const { t } = useTranslation();
  const containerRef = useSectionReveal<HTMLDivElement>({
    duration: 1,
    stagger: 0.3,
    start: 'top 80%',
  });

  return (
    <div ref={containerRef} className="bg-white py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-serif text-6xl text-dark-green animate-item">
            {t('about_page_title')}
          </h1>
          <p className="mt-4 text-lg text-custom-black max-w-3xl mx-auto animate-item">
            {t('about_page_subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-item">
            <Image
              src="/team.jpg"
              alt="Mebeltech Komandası"
              width={5616}
              height={3744}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
          <div className="text-custom-black animate-item">
            <h2 className="text-4xl font-bold text-dark-green">{t('our_story_title')}</h2>
            <p className="mt-6 text-lg leading-relaxed">{t('our_story_p1')}</p>
            <p className="mt-4 text-lg leading-relaxed">{t('our_story_p2')}</p>
            <Link
              href="/contact"
              className="inline-block mt-8 bg-dark-green text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all shadow-lg"
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
