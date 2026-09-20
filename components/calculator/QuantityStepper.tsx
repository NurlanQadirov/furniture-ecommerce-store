'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useT } from '@/components/providers/TranslationProvider';

interface QuantityStepperProps {
  label: string;
  price: number;
  currency: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

/** Add-on row: a checkbox when `max` is 1, a counter otherwise. */
export default function QuantityStepper({
  label,
  price,
  currency,
  value,
  max,
  onChange,
}: QuantityStepperProps) {
  const t = useT();
  const isToggle = max <= 1;
  const clamp = (next: number) => Math.max(0, Math.min(max, next));

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border-2 p-4 transition-colors ${
        value > 0 ? 'border-dark-green bg-custom-green/40' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="min-w-0">
        <p className="font-bold text-sm text-custom-black">{label}</p>
        <p className="text-xs text-gray-500">
          {price} {currency}
        </p>
      </div>

      {isToggle ? (
        <button
          type="button"
          role="switch"
          aria-checked={value > 0}
          aria-label={label}
          onClick={() => onChange(value > 0 ? 0 : 1)}
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
            value > 0 ? 'bg-dark-green' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
              value > 0 ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            aria-label={t('aria_decrease', { name: label })}
            onClick={() => onChange(clamp(value - 1))}
            disabled={value === 0}
            className="h-8 w-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-dark-green disabled:opacity-40 hover:border-dark-green transition-colors"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-bold tabular-nums">{value}</span>
          <button
            type="button"
            aria-label={t('aria_increase', { name: label })}
            onClick={() => onChange(clamp(value + 1))}
            disabled={value >= max}
            className="h-8 w-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-dark-green disabled:opacity-40 hover:border-dark-green transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
