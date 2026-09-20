import Link from 'next/link';
import { getLanguage, getT } from '@/lib/i18n/server';
import { pickLocalized } from '@/lib/i18n/localized';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import ProductCard from '@/components/ProductCard';
import type { Category, Product, Localized } from '@/types';

interface CategoryProductsProps {
  category: Category;
  products: Product[];
}

export default async function CategoryProducts({ category, products }: CategoryProductsProps) {
  const t = await getT();
  // The server resolves the language once; `loc` keeps the call sites unchanged.
  const language = await getLanguage();
  const loc = (value: Localized | undefined) => pickLocalized(value, language);

  return (
    <div data-reveal="pending" data-reveal-stagger="120" className="w-full max-w-[1100px] mx-auto px-4 py-12">
      <nav aria-label={t('aria_breadcrumb')} className="mb-8 animate-item">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {t('back_to_categories')}
        </Link>
      </nav>

      <header className="text-center mb-12">
        <h1 className="font-serif text-5xl text-dark-green animate-item">
          {loc(category.name)}
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-custom-black animate-item">
          {loc(category.description)}
        </p>
      </header>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-16 animate-item">
          {t('no_products_in_category')}
        </p>
      ) : (
        <>
          {/* The page jumped straight from its <h1> to the <h3> inside every
              product card. This restores the missing level for a screen reader
              and for anything that reads the outline; `sr-only` keeps it out of
              the layout entirely. */}
          <h2 className="sr-only">
            {t('aria_category_products', { name: loc(category.name) })}
          </h2>
          <section
            aria-label={t('aria_category_products', { name: loc(category.name) })}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <article key={product.id} className="animate-item">
                <ProductCard product={product} />
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
