'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { detectLanguage, getI18n, persistLanguage } from '@/lib/i18n/config';

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * Boots i18next for the client tree.
 *
 * The instance starts on the fallback language so the prerendered HTML and the
 * first client render always match; the visitor's stored (or browser) language
 * is applied immediately afterwards. The switch is queued as a task rather than
 * run inline in the effect because `useTranslation` binds its `languageChanged`
 * listener from an effect of its own — firing earlier would update the instance
 * without re-rendering the components reading from it.
 */
export default function I18nProvider({ children }: I18nProviderProps) {
  const [i18n] = useState(getI18n);

  useEffect(() => {
    // Subscribe before detecting, so the stored choice is read untouched and
    // every later switch is written back to localStorage.
    i18n.on('languageChanged', persistLanguage);

    const detected = detectLanguage();
    const timer = window.setTimeout(() => {
      if (detected === i18n.resolvedLanguage) {
        persistLanguage(detected);
      } else {
        void i18n.changeLanguage(detected);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      i18n.off('languageChanged', persistLanguage);
    };
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
