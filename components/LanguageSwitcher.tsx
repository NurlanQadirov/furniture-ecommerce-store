'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { languageOptions } from '@/lib/i18n/languages';
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE } from '@/lib/i18n/cookie';
import { useLanguage, useT } from '@/components/providers/TranslationProvider';
import type { SwitcherSize } from '@/types';

interface LanguageSwitcherProps {
  size?: SwitcherSize;
}

export default function LanguageSwitcher({ size = 'default' }: LanguageSwitcherProps) {
  const router = useRouter();
  const t = useT();
  const language = useLanguage();
  const [, startTransition] = useTransition();

  /**
   * The language lives in a cookie so the server can render in it. Writing it
   * and refreshing re-renders the tree server-side, which is what replaced
   * i18next's client-side `changeLanguage`.
   */
  const selectLanguage = (code: string) => {
    document.cookie = `${LANGUAGE_COOKIE}=${code};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`;
    startTransition(() => router.refresh());
  };

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
    <div role="group" aria-label={t('aria_language_switcher')} className={containerStyle}>
      {languageOptions.map((lang) => (
        <button
          key={lang.code}
          type="button"
          lang={lang.code}
          onClick={() => selectLanguage(lang.code)}
          aria-label={t('aria_select_language', { language: lang.name })}
          aria-current={language === lang.code ? 'true' : undefined}
          className={`${buttonStyle} font-bold rounded-full transition-colors duration-300 ${
            language === lang.code ? activeButtonStyle : inactiveButtonStyle
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
