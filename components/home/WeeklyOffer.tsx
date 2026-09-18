'use client';

import { useMemo, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ArrowIcon from '@/components/ArrowIcon';
import { productsData } from '@/data/products';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

const CLIP_VISIBLE = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
const CLIP_HIDDEN = 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)';

export default function WeeklyOffer() {
  const { t } = useTranslation();

  const [currentNum, setCurrentNum] = useState(0);
  const currentCard = useMemo(() => productsData[currentNum], [currentNum]);

  const cardInfoTitleRef = useRef<HTMLHeadingElement>(null);
  const cardInfoDescRef = useRef<HTMLParagraphElement>(null);
  const mask1Ref = useRef<HTMLDivElement>(null);
  const mask2Ref = useRef<HTMLDivElement>(null);

  const sectionRef = useSectionReveal<HTMLElement>();
  const { contextSafe } = useGSAP({ scope: sectionRef });

  const playReverse = contextSafe(() => {
    const mask1 = mask1Ref.current;
    const mask2 = mask2Ref.current;
    const title = cardInfoTitleRef.current;
    const desc = cardInfoDescRef.current;
    if (!mask1 || !mask2 || !title || !desc) return;

    gsap
      .timeline({ defaults: { duration: 0.7, ease: 'sine.in' } })
      .to(mask1, { yPercent: -100, scaleY: 1.4 })
      .to(mask2, { yPercent: 100, scaleY: 1.4 }, '<')
      .to(title, { clipPath: CLIP_VISIBLE }, '<0.2')
      .to(desc, { clipPath: CLIP_VISIBLE }, '<0.3');
  });

  const playFoward = contextSafe(() => {
    const mask1 = mask1Ref.current;
    const mask2 = mask2Ref.current;
    const title = cardInfoTitleRef.current;
    const desc = cardInfoDescRef.current;
    if (!mask1 || !mask2 || !title || !desc) return;

    gsap
      .timeline({
        defaults: { duration: 0.7, ease: 'sine.out' },
        onComplete: () => {
          setCurrentNum((prevNum) => (prevNum + 1) % productsData.length);
          playReverse();
        },
      })
      .to(mask1, { yPercent: 100, scaleY: 1.4 })
      .to(mask2, { yPercent: -100, scaleY: 1.4 }, '<')
      .to(title, { clipPath: CLIP_HIDDEN }, '<0.4')
      .to(desc, { clipPath: CLIP_HIDDEN }, '<0.3');
  });

  const handleNextCard = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    playFoward();
  };

  if (!currentCard) return null;

  return (
    <section ref={sectionRef} id="weekly-offer" className="w-full bg-white py-24">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl text-dark-green animate-item">
            {t('weekly_offer_title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-lg overflow-hidden animate-item">
          <div className="grid grid-rows-3 p-8 order-2 md:order-1 md:h-auto">
            <h1
              ref={cardInfoTitleRef}
              className="font-serif text-6xl md:text-8xl text-dark-green self-center"
              style={{ clipPath: CLIP_VISIBLE }}
            >
              {t(currentCard.titleKey)}
            </h1>
            <p
              ref={cardInfoDescRef}
              className="text-sm font-bold self-center leading-6"
              style={{ clipPath: CLIP_VISIBLE }}
            >
              {t(currentCard.descKey)}
            </p>
            <Link
              href={`/product/${currentCard.id}`}
              className="flex items-center gap-x-3 font-serif text-xl text-dark-green bg-custom-green px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group self-center justify-self-end"
            >
              <p>{t('details')}</p>
              <ArrowIcon className="stroke-dark-green transition-colors duration-300 group-hover:stroke-white" />
            </Link>
          </div>
          <div className="relative w-full h-full overflow-hidden order-1 md:order-2 min-h-[400px]">
            <div
              ref={mask1Ref}
              id="mask-1"
              className="absolute top-0 left-0 h-full w-1/2 bg-white z-[5] -translate-y-full"
            ></div>
            <div
              ref={mask2Ref}
              id="mask-2"
              className="absolute top-0 right-0 h-full w-1/2 bg-white z-[5] translate-y-full"
            ></div>
            <a
              href="#"
              onClick={handleNextCard}
              className="absolute bottom-[5%] right-[8%] z-10 flex items-center gap-x-3 font-serif text-2xl text-dark-green bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group"
            >
              <p>{t('next')}</p>
              <ArrowIcon className="stroke-dark-green stroke-2 transition-all duration-300 group-hover:stroke-white group-hover:translate-x-1" />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentCard.photo}
              alt={t(currentCard.titleKey)}
              className="block w-full h-full object-cover aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
