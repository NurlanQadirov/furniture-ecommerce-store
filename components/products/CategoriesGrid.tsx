'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLocalized } from '@/lib/i18n/localized';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';
import type { Category } from '@/types';

interface CategoriesGridProps {
  categories: Category[];
  /** How many products sit in each category, keyed by category id. */
  counts: Record<string, number>;
}

export default function CategoriesGrid({ categories, counts }: CategoriesGridProps) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const containerRef = useSectionReveal<HTMLDivElement>({ stagger: 0.12 });

  return (
    <div ref={containerRef} className="w-full max-w-[1100px] mx-auto px-4 py-16">
      <section className="text-center mb-12">
        <h1 className="font-serif text-5xl text-dark-green animate-item">
          {t('categories_title')}
        </h1>
        <p className="mt-2 text-custom-black animate-item">{t('categories_subtitle')}</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products/${category.slug}`}
            className="animate-item group relative block h-72 rounded-lg overflow-hidden shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt={loc(category.name)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-custom-black/90 via-custom-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-custom-green/90">
                {t('category_product_count', { count: counts[category.id] ?? 0 })}
              </p>
              <h2 className="font-serif text-4xl mt-1">{loc(category.name)}</h2>
              <p className="text-sm text-gray-200 mt-2 line-clamp-2">
                {loc(category.description)}
              </p>
              {/* Same script face as the "details" / "next" calls to action. */}
              <span className="mt-3 inline-flex items-center gap-2 font-serif text-xl text-custom-green">
                {t('view_category')}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
