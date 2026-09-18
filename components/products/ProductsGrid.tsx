'use client';

import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

export default function ProductsGrid() {
  const { t } = useTranslation();
  const containerRef = useSectionReveal<HTMLDivElement>({ stagger: 0.15 });

  return (
    <div ref={containerRef} className="w-full max-w-[1100px] mx-auto px-4 py-16">
      <section className="text-center mb-12">
        <h1 className="font-serif text-5xl text-dark-green animate-item">
          {t('all_products_title')}
        </h1>
        <p className="mt-2 text-custom-black animate-item">{t('all_products_subtitle')}</p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsData.map((product) => (
          <div key={product.id} className="animate-item">
            <ProductCard product={product} />
          </div>
        ))}
      </section>
    </div>
  );
}
