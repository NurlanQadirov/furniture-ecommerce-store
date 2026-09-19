'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ProductCard from '@/components/ProductCard';
import { useLocalized } from '@/lib/i18n/localized';
import type { Category, Product } from '@/types';

interface CategoryProductsProps {
  category: Category;
  products: Product[];
}

export default function CategoryProducts({ category, products }: CategoryProductsProps) {
  const { t } = useTranslation();
  const loc = useLocalized();

  return (
    <div data-reveal="pending" data-reveal-stagger="120" className="w-full max-w-[1100px] mx-auto px-4 py-12">
      <div className="mb-8 animate-item">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {t('back_to_categories')}
        </Link>
      </div>

      <section className="text-center mb-12">
        <h1 className="font-serif text-5xl text-dark-green animate-item">
          {loc(category.name)}
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-custom-black animate-item">
          {loc(category.description)}
        </p>
      </section>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-16 animate-item">
          {t('no_products_in_category')}
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="animate-item">
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
