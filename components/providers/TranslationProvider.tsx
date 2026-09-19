'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { createTranslator, type Messages, type Translator } from '@/lib/i18n/translate';
import { pickLocalized } from '@/lib/i18n/localized';
import type { Language, Localized } from '@/types';

interface TranslationValue {
  language: Language;
  t: Translator;
}

const TranslationContext = createContext<TranslationValue | null>(null);

interface TranslationProviderProps {
  language: Language;
  /** Only the active language's strings, handed down by the server layout. */
  messages: Messages;
  children: ReactNode;
}

/**
 * Gives client components a `t` without shipping an i18n library.
 *
 * react-i18next cost 33 KB gzipped and bundled all three locales; the strings
 * for the one language in use arrive as a prop instead, and switching language
 * is a cookie plus `router.refresh()` rather than a client-side re-render.
 */
export default function TranslationProvider({
  language,
  messages,
  children,
}: TranslationProviderProps) {
  const value = useMemo(
    () => ({ language, t: createTranslator(messages) }),
    [language, messages],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

function useTranslationValue(): TranslationValue {
  const value = useContext(TranslationContext);
  if (!value) {
    throw new Error('Translations are only available inside <TranslationProvider>');
  }
  return value;
}

export function useT(): Translator {
  return useTranslationValue().t;
}

export function useLanguage(): Language {
  return useTranslationValue().language;
}

/** `const loc = useLocalized(); loc(product.name)` inside client components. */
export function useLocalized(): (value: Localized | undefined) => string {
  const { language } = useTranslationValue();
  return useCallback((value: Localized | undefined) => pickLocalized(value, language), [
    language,
  ]);
}
