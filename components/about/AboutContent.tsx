import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/lib/i18n/server';

export default async function AboutContent() {
  const t = await getT();

  return (
    <section data-reveal="pending" data-reveal-duration="1000" data-reveal-stagger="300" data-reveal-start="80" className="bg-white py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="font-serif text-6xl text-dark-green animate-item">
            {t('about_page_title')}
          </h1>
          <p className="mt-4 text-lg text-custom-black max-w-3xl mx-auto animate-item">
            {t('about_page_subtitle')}
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-item">
            <Image
              src="/team.jpg"
              alt={t('alt_team')}
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
              aria-label={`${t('contact_us')} — ${t('contact')}`}
              className="inline-block mt-8 bg-dark-green text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all shadow-lg"
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
