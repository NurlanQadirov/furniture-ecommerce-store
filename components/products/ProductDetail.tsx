'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import { useContactInfo, whatsappLink } from '@/components/providers/SiteDataProvider';
import { useLocalized } from '@/lib/i18n/localized';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';
import type { Category, Product } from '@/types';

interface ProductDetailProps {
  product: Product;
  category: Category | undefined;
  related: Product[];
}

export default function ProductDetail({ product, category, related }: ProductDetailProps) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const contact = useContactInfo();
  const containerRef = useSectionReveal<HTMLDivElement>({ scrollTrigger: false });

  // The main image always leads the gallery, extra photos follow it.
  const gallery = [product.mainImage, ...product.images].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] ?? gallery[0] ?? '';

  /** Wraps around, so the arrows never dead-end on the first or last photo. */
  const step = (delta: number) =>
    setActiveIndex((index) => (index + delta + gallery.length) % gallery.length);

  const name = loc(product.name);
  const enquiry = `Salam! "${name}" məhsulu ilə maraqlanıram.`;

  return (
    <div ref={containerRef} className="w-full max-w-[1100px] mx-auto px-4 py-12">
      <div className="mb-8 animate-item">
        <Link
          href={category ? `/products/${category.slug}` : '/products'}
          className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {category ? t('back_to_category') : t('back_to_categories')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="animate-item">
          <div className="relative rounded-lg overflow-hidden shadow-xl bg-custom-green aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage} alt={name} className="w-full h-full object-cover" />
            {product.featured && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-dark-green text-xs font-bold px-3 py-1 rounded-full shadow">
                <StarIcon className="h-4 w-4" />
                {t('featured_badge')}
              </span>
            )}

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t('previous_photo')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 backdrop-blur-sm text-dark-green shadow-lg flex items-center justify-center transition-all hover:bg-dark-green hover:text-white hover:scale-105"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t('next_photo')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 backdrop-blur-sm text-dark-green shadow-lg flex items-center justify-center transition-all hover:bg-dark-green hover:text-white hover:scale-105"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/85 backdrop-blur-sm px-3 py-1 text-xs font-bold text-dark-green shadow">
                  {activeIndex + 1} / {gallery.length}
                </span>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                {t('product_gallery')}
              </p>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={name}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      index === activeIndex
                        ? 'border-dark-green scale-[1.03]'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {category && (
            <Link
              href={`/products/${category.slug}`}
              className="text-xs uppercase tracking-widest text-dark-green font-bold animate-item hover:underline"
            >
              {loc(category.name)}
            </Link>
          )}
          <h1 className="font-serif text-5xl md:text-6xl text-dark-green mt-2 animate-item">
            {name}
          </h1>
          {typeof product.price === 'number' && (
            <p className="text-3xl text-custom-black font-bold my-4 animate-item">
              {product.price} {t('currency_azn')}
            </p>
          )}

          <div className="animate-item mt-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
              {t('product_description')}
            </h2>
            <p className="text-custom-black leading-7 whitespace-pre-line">
              {loc(product.description)}
            </p>
          </div>

          <div className="animate-item flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href={whatsappLink(contact.whatsapp, enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-dark-green text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <FaWhatsapp size={20} />
              {t('write_whatsapp')}
            </a>
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center gap-2 border-2 border-dark-green text-dark-green font-bold py-3 px-8 rounded-lg hover:bg-custom-green transition-all"
            >
              {t('calculator')}
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-4xl text-dark-green text-center mb-8 animate-item">
            {t('catalog_picks_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((item) => (
              <div key={item.id} className="animate-item">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
