'use client';

import { useState } from 'react';
import { inputClass } from '@/components/admin/ui';
import type { Language, Localized } from '@/types';

const tabs: Array<{ code: Language; label: string }> = [
  { code: 'az', label: 'AZ' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
];

interface LocalizedInputProps {
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

/**
 * One field, three languages. Tabbed rather than stacked so a long product
 * description does not push the rest of the form off the screen — and the AZ
 * tab is filled first because every other language falls back to it.
 */
export default function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 5,
  placeholder,
}: LocalizedInputProps) {
  const [active, setActive] = useState<Language>('az');

  const update = (language: Language, text: string) =>
    onChange({ ...value, [language]: text });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</span>
        <div className="inline-flex bg-gray-100 rounded-full p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.code}
              type="button"
              onClick={() => setActive(tab.code)}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                active === tab.code
                  ? 'bg-dark-green text-white'
                  : value[tab.code]?.trim()
                    ? 'text-dark-green'
                    : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {multiline ? (
        <textarea
          value={value[active]}
          rows={rows}
          placeholder={placeholder}
          onChange={(event) => update(active, event.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={value[active]}
          placeholder={placeholder}
          onChange={(event) => update(active, event.target.value)}
          className={inputClass}
        />
      )}

      {active !== 'az' && !value[active]?.trim() && (
        <span className="block text-xs text-gray-400 mt-1">
          Boş qalsa, Azərbaycan dilindəki mətn göstəriləcək.
        </span>
      )}
    </div>
  );
}
