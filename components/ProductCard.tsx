'use client';

import SiteImage from '@/components/SiteImage';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { useLocalized, useT } from '@/components/providers/TranslationProvider';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** Hides the star even on a featured product — used inside the home picks. */
  showFeaturedBadge?: boolean;
}

export default function ProductCard({
  product,
  showFeaturedBadge = true,
}: ProductCardProps) {
  const t = useT();
  const loc = useLocalized();
  const name = loc(product.name);

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden group"
    >
      <div className="relative overflow-hidden h-64 bg-custom-green">
        <SiteImage
          src={product.mainImage}
          alt={name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        {showFeaturedBadge && product.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-dark-green text-xs font-bold px-3 py-1 rounded-full shadow">
            <StarIcon className="h-4 w-4" />
            {t('featured_badge')}
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-custom-black">{name}</h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{loc(product.description)}</p>
        {typeof product.price === 'number' && (
          <p className="text-dark-green font-serif text-2xl mt-auto pt-3">
            {product.price} {t('currency_azn')}
          </p>
        )}
      </div>
    </Link>
  );
}
