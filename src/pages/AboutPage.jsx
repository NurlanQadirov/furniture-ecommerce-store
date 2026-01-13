import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';

function AboutPage() {
  const { t } = useTranslation();
  const comp = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        opacity: 0, y: 60, duration: 1, ease: "power3.out", stagger: 0.3,
        scrollTrigger: { trigger: comp.current, start: "top 80%", toggleActions: "play none none none", once: true, },
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="bg-white py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="text-center mb-16">
            <h1 className="font-serif text-6xl text-dark-green animate-item">{t('about_page_title')}</h1>
            <p className="mt-4 text-lg text-custom-black max-w-3xl mx-auto animate-item">{t('about_page_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-item">
            <img 
              src="/team.jpg"
              alt="Mebeltech Komandası"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
          <div className="text-custom-black animate-item">
            <h2 className="text-4xl font-bold text-dark-green">{t('our_story_title')}</h2>
            <p className="mt-6 text-lg leading-relaxed">{t('our_story_p1')}</p>
            <p className="mt-4 text-lg leading-relaxed">{t('our_story_p2')}</p>
            <Link 
              to="/contact"
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

export default AboutPage;