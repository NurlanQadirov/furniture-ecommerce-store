import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { productsData } from '../data/products.js';
import HeroSlider from '../components/HeroSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CheckBadgeIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

function ArrowIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 10" className={`w-5 h-auto ${className}`}>
      <line x1="0" y1="5" x2="20" y2="5" />
      <line x1="15" y1="0" x2="20" y2="5" />
      <line x1="15" y1="10" x2="20" y2="5" />
    </svg>
  );
}

function HomePage() {
  const { t } = useTranslation();
  
  
  const [currentNum, setCurrentNum] = useState(0);
  const currentCard = useMemo(() => productsData[currentNum], [currentNum]);
  const cardInfoTitleRef = useRef(null);
  const cardInfoDescRef = useRef(null);
  const mask1Ref = useRef(null);
  const mask2Ref = useRef(null);
  
  const comp = useRef(null); 

  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const animateSection = (sectionSelector) => {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        const elementsToAnimate = section.querySelectorAll(".animate-item");
        
        gsap.from(elementsToAnimate, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      };

      animateSection("#why-mebeltech");
      animateSection("#catalog-picks");
      animateSection("#philosophy");
      animateSection("#weekly-offer");

    }, comp);

    return () => ctx.revert();
  }, []);


  const playReverse = () => {
    gsap.timeline({ defaults: { duration: 0.7, ease: "sine.in" } })
      .to(mask1Ref.current, { yPercent: -100, scaleY: 1.4 })
      .to(mask2Ref.current, { yPercent: 100, scaleY: 1.4 }, "<")
      .to(cardInfoTitleRef.current, { clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)` }, "<0.2")
      .to(cardInfoDescRef.current, { clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)` }, "<0.3");
  };

  const playFoward = () => {
    gsap.timeline({
      defaults: { duration: 0.7, ease: "sine.out" },
      onComplete: () => {
        setCurrentNum(prevNum => (prevNum + 1) % productsData.length);
        playReverse();
      }
    })
      .to(mask1Ref.current, { yPercent: 100, scaleY: 1.4 })
      .to(mask2Ref.current, { yPercent: -100, scaleY: 1.4 }, "<")
      .to(cardInfoTitleRef.current, { clipPath: `polygon(0 0, 100% 0, 100% 0%, 0% 0%)` }, "<0.4")
      .to(cardInfoDescRef.current, { clipPath: `polygon(0 0, 100% 0, 100% 0%, 0% 0%)` }, "<0.3");
  };

  const handleNextCard = (e) => {
    e.preventDefault();
    playFoward();
  };

  const featuredProducts = productsData.slice(0, 3);

  return (
    <div ref={comp}>
      <HeroSlider />

      <section id="why-mebeltech" className="w-full bg-custom-green py-24">
        <div className="w-full max-w-[1100px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-6xl text-dark-green animate-item">{t('whyMebeltech_title')}</h2>
            <p className="mt-4 text-lg text-custom-black max-w-3xl mx-auto animate-item">
              {t('whyMebeltech_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center animate-item"><CheckBadgeIcon className="h-12 w-12 text-dark-green" /><h3 className="font-bold text-xl mt-4">{t('quality_title')}</h3><p className="text-sm mt-2 text-gray-600">{t('quality_desc')}</p></div>
            <div className="flex flex-col items-center animate-item"><TruckIcon className="h-12 w-12 text-dark-green" /><h3 className="font-bold text-xl mt-4">{t('delivery_title')}</h3><p className="text-sm mt-2 text-gray-600">{t('delivery_desc')}</p></div>
            <div className="flex flex-col items-center animate-item"><ShieldCheckIcon className="h-12 w-12 text-dark-green" /><h3 className="font-bold text-xl mt-4">{t('warranty_title')}</h3><p className="text-sm mt-2 text-gray-600">{t('warranty_desc')}</p></div>
          </div>
        </div>
      </section>
      
      <section id="catalog-picks" className="w-full bg-white py-24">
        <div className="w-full max-w-[1100px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl text-dark-green animate-item">{t('catalog_picks_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div className="animate-item" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="w-full bg-custom-black text-white py-24">
          <div className="w-full max-w-[1100px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-item">
                  <h2 className="font-serif text-5xl text-white">{t('philosophy_title')}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-gray-300">
                      {t('philosophy_desc')}
                  </p>
                  <Link to="/about" className="inline-block mt-6 bg-white text-dark-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-all">
                      {t('about_us_more')}
                  </Link>
              </div>
              <div className="animate-item">
                  <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932" alt="Müasir İnteryer" className="rounded-lg shadow-lg" />
              </div>
          </div>
      </section>

      <section id="weekly-offer" className="w-full bg-white py-24">
        <div className="w-full max-w-[1000px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl text-dark-green animate-item">{t('weekly_offer_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-lg overflow-hidden animate-item">
            <div className="grid grid-rows-3 p-8 order-2 md:order-1 md:h-auto">
              <h1 ref={cardInfoTitleRef} className="font-serif text-6xl md:text-8xl text-dark-green self-center" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
                {t(currentCard.titleKey)}
              </h1>
              <p ref={cardInfoDescRef} className="text-sm font-bold self-center leading-6" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}>
                {t(currentCard.descKey)}
              </p>
              <a href={`/product/${currentCard.id}`} className="flex items-center gap-x-3 font-serif text-xl text-dark-green bg-custom-green px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group self-center justify-self-end">
                <p>{t('details')}</p>
                <ArrowIcon className="stroke-dark-green transition-colors duration-300 group-hover:stroke-white" />
              </a>
            </div>
            <div className="relative w-full h-full overflow-hidden order-1 md:order-2 min-h-[400px]">
              <div ref={mask1Ref} id="mask-1" className="absolute top-0 left-0 h-full w-1/2 bg-white z-[5] -translate-y-full"></div>
              <div ref={mask2Ref} id="mask-2" className="absolute top-0 right-0 h-full w-1/2 bg-white z-[5] translate-y-full"></div>
              <a href="#" onClick={handleNextCard} className="absolute bottom-[5%] right-[8%] z-10 flex items-center gap-x-3 font-serif text-2xl text-dark-green bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group">
                <p>{t('next')}</p>
                <ArrowIcon className="stroke-dark-green stroke-2 transition-all duration-300 group-hover:stroke-white group-hover:translate-x-1" />
              </a>
              <img src={currentCard.photo} alt={t(currentCard.titleKey)} className="block w-full h-full object-cover aspect-square" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;