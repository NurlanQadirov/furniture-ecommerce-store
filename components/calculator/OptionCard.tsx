'use client';

import SiteImage from '@/components/SiteImage';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

interface OptionCardProps {
  title: string;
  subtitle?: ReactNode;
  image?: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * A picture-first radio. Customers choose materials by how they look — "akril"
 * means nothing to most of them — so the image carries the card and the name
 * only confirms the choice.
 */
export default function OptionCard({
  title,
  subtitle,
  image,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative text-left rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white ${
        selected
          ? 'border-dark-green shadow-lg'
          : 'border-gray-200 hover:border-dark-green/40 hover:shadow-md'
      }`}
    >
      {image && (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-custom-green">
          <SiteImage
            src={image}
            alt={title}
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <p className="font-bold text-sm text-custom-black leading-snug">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1 leading-snug">{subtitle}</p>}
      </div>
      {selected && (
        <CheckCircleIcon className="absolute top-2 right-2 h-6 w-6 text-dark-green drop-shadow" />
      )}
    </button>
  );
}
