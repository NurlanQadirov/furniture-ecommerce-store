'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CalculatorIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

/** Pulls visitors from the home page into the estimator before they bounce. */
export default function CalculatorTeaser() {
  const { t } = useTranslation();
  const sectionRef = useSectionReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="w-full bg-custom-green py-20">
      <div className="w-full max-w-[1000px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center gap-8 animate-item">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-custom-green flex items-center justify-center">
            <CalculatorIcon className="h-10 w-10 text-dark-green" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-4xl text-dark-green">{t('calc_title')}</h2>
            <p className="mt-2 text-custom-black">{t('calc_subtitle')}</p>
            <p className="mt-2 text-sm text-gray-500">{t('calc_note')}</p>
          </div>
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center gap-2 bg-dark-green text-white font-bold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all group whitespace-nowrap"
          >
            {t('calc_show_result')}
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
