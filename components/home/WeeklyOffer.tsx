'use client';

import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import SiteImage from '@/components/SiteImage';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ArrowIcon from '@/components/ArrowIcon';
import { useLocalized } from '@/lib/i18n/localized';
import type { Product } from '@/types';

const CLIP_VISIBLE = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
const CLIP_HIDDEN = 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)';

/*
 * The card swap, formerly two GSAP timelines. The Web Animations API sequences
 * it natively — GSAP's `'<0.4'` offsets are plain delays here — so the 112 KB
 * library is not shipped for one transition. Durations and easings are the ones
 * the timelines used: 0.7s on sine.out going out, sine.in coming back.
 */
const PHASE_MS = 700;
const EASE_OUT = 'cubic-bezier(0.39, 0.575, 0.565, 1)';
const EASE_IN = 'cubic-bezier(0.47, 0, 0.745, 0.715)';

/** The masks park above and below the panel and sweep across it to cover the card. */
const MASK_TOP = {
  parked: 'translateY(-100%) scaleY(1)',
  crossed: 'translateY(100%) scaleY(1.4)',
};
const MASK_BOTTOM = {
  parked: 'translateY(100%) scaleY(1)',
  crossed: 'translateY(-100%) scaleY(1.4)',
};

interface WeeklyOfferProps {
  /** Rotated through by the "next" control; starred products come first. */
  products: Product[];
}

export default function WeeklyOffer({ products }: WeeklyOfferProps) {
  const { t } = useTranslation();
  const loc = useLocalized();

  const [currentNum, setCurrentNum] = useState(0);
  const currentCard = useMemo(() => products[currentNum], [products, currentNum]);

  const cardInfoTitleRef = useRef<HTMLHeadingElement>(null);
  const cardInfoDescRef = useRef<HTMLParagraphElement>(null);
  const mask1Ref = useRef<HTMLDivElement>(null);
  const mask2Ref = useRef<HTMLDivElement>(null);

  const running = useRef<Animation[]>([]);
  const busy = useRef(false);

  /**
   * Plays one half of the swap: `cover` sweeps the masks over the card and
   * clips the copy away, `clear` sweeps them back out once the next product has
   * rendered underneath.
   */
  const play = useCallback((phase: 'cover' | 'clear') => {
    const mask1 = mask1Ref.current;
    const mask2 = mask2Ref.current;
    const title = cardInfoTitleRef.current;
    const desc = cardInfoDescRef.current;
    if (!mask1 || !mask2 || !title || !desc) return Promise.resolve();

    const covering = phase === 'cover';
    const easing = covering ? EASE_OUT : EASE_IN;

    const animate = (
      element: HTMLElement,
      property: 'transform' | 'clipPath',
      from: string,
      to: string,
      delay: number,
    ) =>
      element.animate([{ [property]: from }, { [property]: to }], {
        duration: PHASE_MS,
        delay,
        easing,
        // Holds the end state, so the masks stay put while the card swaps.
        fill: 'forwards',
      });

    running.current.forEach((animation) => animation.cancel());
    running.current = covering
      ? [
          animate(mask1, 'transform', MASK_TOP.parked, MASK_TOP.crossed, 0),
          animate(mask2, 'transform', MASK_BOTTOM.parked, MASK_BOTTOM.crossed, 0),
          animate(title, 'clipPath', CLIP_VISIBLE, CLIP_HIDDEN, 400),
          animate(desc, 'clipPath', CLIP_VISIBLE, CLIP_HIDDEN, 700),
        ]
      : [
          animate(mask1, 'transform', MASK_TOP.crossed, MASK_TOP.parked, 0),
          animate(mask2, 'transform', MASK_BOTTOM.crossed, MASK_BOTTOM.parked, 0),
          animate(title, 'clipPath', CLIP_HIDDEN, CLIP_VISIBLE, 200),
          animate(desc, 'clipPath', CLIP_HIDDEN, CLIP_VISIBLE, 500),
        ];

    // A cancelled animation rejects; that only happens when a newer phase has
    // already taken over, so there is nothing to handle.
    return Promise.all(running.current.map((animation) => animation.finished)).then(
      () => undefined,
      () => undefined,
    );
  }, []);

  const handleNextCard = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const nextCard = () => setCurrentNum((prevNum) => (prevNum + 1) % products.length);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nextCard();
      return;
    }

    // The GSAP timeline ignored a second click while it ran; keep that.
    if (busy.current) return;
    busy.current = true;
    await play('cover');
    nextCard();
    await play('clear');
    busy.current = false;
  };

  if (!currentCard) return null;

  return (
    <section data-reveal="pending" id="weekly-offer" className="w-full bg-white py-24">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl text-dark-green animate-item">
            {t('weekly_offer_title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-lg overflow-hidden animate-item">
          <div className="relative grid grid-rows-3 p-8 order-2 md:order-1 md:h-auto">
            {/* An <h3> under the section's <h2>: the page's only <h1> is the
                hero headline, and product names are <h3> in the cards too. */}
            <h3
              ref={cardInfoTitleRef}
              className="font-serif text-6xl md:text-8xl text-dark-green self-center"
              style={{ clipPath: CLIP_VISIBLE }}
            >
              {loc(currentCard.name)}
            </h3>
            <p
              ref={cardInfoDescRef}
              className="text-sm font-bold self-center leading-6"
              style={{ clipPath: CLIP_VISIBLE }}
            >
              {loc(currentCard.description)}
            </p>
            <Link
              href={`/product/${currentCard.id}`}
              // Pinned to the same inset as the "next" control in the image
              // panel, so on desktop the two buttons sit on one line.
              className="flex items-center gap-x-3 font-serif text-xl text-dark-green bg-custom-green px-6 py-2 rounded-full shadow-md transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group self-center justify-self-end md:absolute md:bottom-[5%] md:right-[8%]"
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
            {products.length > 1 && (
            <a
              href="#"
              onClick={handleNextCard}
              className="absolute bottom-[5%] right-[8%] z-10 flex items-center gap-x-3 font-serif text-2xl text-dark-green bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-dark-green hover:text-white hover:shadow-lg hover:scale-105 group"
            >
              <p>{t('next')}</p>
              <ArrowIcon className="stroke-dark-green stroke-2 transition-all duration-300 group-hover:stroke-white group-hover:translate-x-1" />
            </a>
            )}
            <SiteImage
              src={currentCard.mainImage}
              alt={loc(currentCard.name)}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
