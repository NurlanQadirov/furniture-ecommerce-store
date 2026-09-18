'use client';

import { useTranslation } from 'react-i18next';
import { languageOptions } from '@/lib/i18n/resources';
import type { SwitcherSize } from '@/types';

interface LanguageSwitcherProps {
  size?: SwitcherSize;
}

export default function LanguageSwitcher({ size = 'default' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const containerStyle =
    size === 'small'
      ? 'inline-flex bg-dark-green rounded-full p-1'
      : 'inline-flex bg-gray-200 rounded-full p-1';

  const buttonStyle =
    size === 'small' ? 'px-2 py-0.5 text-xs min-w-[28px]' : 'px-3 py-1 text-sm min-w-[36px]';

  const activeButtonStyle =
    size === 'small' ? 'bg-white text-dark-green' : 'bg-dark-green text-white';

  const inactiveButtonStyle =
    size === 'small' ? 'text-gray-200 hover:bg-white/20' : 'text-gray-600 hover:bg-gray-300';

  return (
    <div className={containerStyle}>
      {languageOptions.map((lang) => (
        <button
          key={lang.code}
          onClick={() => {
            void i18n.changeLanguage(lang.code);
          }}
          className={`${buttonStyle} font-bold rounded-full transition-colors duration-300 ${
            i18n.language.startsWith(lang.code) ? activeButtonStyle : inactiveButtonStyle
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
