'use client';

import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';

const featuredProducts = productsData.slice(0, 3);

export default function CatalogPicks() {
  const { t } = useTranslation();
  const sectionRef = useSectionReveal<HTMLElement>();

  return (
    <section ref={sectionRef} id="catalog-picks" className="w-full bg-white py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl text-dark-green animate-item">
            {t('catalog_picks_title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div className="animate-item" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
