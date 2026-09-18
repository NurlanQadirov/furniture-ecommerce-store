'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useSectionReveal } from '@/lib/hooks/useSectionReveal';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product | undefined;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { t } = useTranslation();
  const containerRef = useSectionReveal<HTMLDivElement>({ scrollTrigger: false });

  if (!product) {
    return <div className="text-center py-20">{t('product_not_found')}</div>;
  }

  return (
    <div ref={containerRef} className="w-full max-w-[1100px] mx-auto px-4 py-12">
      <div className="mb-8 animate-item">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {t('back_to_products')}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="animate-item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.photo}
            alt={t(product.titleKey)}
            className="w-full rounded-lg shadow-xl"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-6xl text-dark-green animate-item">
            {t(product.titleKey)}
          </h1>
          {product.price && (
            <p className="text-3xl text-custom-black font-bold my-4 animate-item">
              {product.price} AZN
            </p>
          )}
          <p className="text-custom-black leading-7 animate-item">{t(product.descKey)}</p>
          <div className="animate-item">
            <button className="bg-dark-green text-white font-bold py-3 px-8 mt-6 rounded-lg hover:bg-opacity-90 transition-all w-full md:w-auto self-start">
              {t('add_to_cart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
