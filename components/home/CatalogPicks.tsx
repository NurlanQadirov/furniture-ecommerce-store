import Link from 'next/link';
import { getT } from '@/lib/i18n/server';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

interface CatalogPicksProps {
  /** Products the owner starred in the admin panel. */
  products: Product[];
}

export default async function CatalogPicks({ products }: CatalogPicksProps) {
  const t = await getT();

  if (products.length === 0) return null;

  return (
    <section data-reveal="pending" id="catalog-picks" className="w-full bg-white py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl text-dark-green animate-item">
            {t('catalog_picks_title')}
          </h2>
          <p className="mt-2 text-custom-black animate-item">{t('catalog_picks_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div className="animate-item" key={product.id}>
              <ProductCard product={product} showFeaturedBadge={false} />
            </div>
          ))}
        </div>
        <div className="text-center mt-12 animate-item">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-serif text-xl text-dark-green bg-custom-green px-8 py-3 rounded-full shadow-md transition-all duration-300 hover:bg-dark-green hover:text-white hover:scale-105 group"
          >
            {t('goToCatalog')}
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
