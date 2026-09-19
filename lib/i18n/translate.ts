import type { TranslationKey } from '@/lib/i18n/resources';

/**
 * One language's strings, and the `t` that reads them.
 *
 * This module deliberately imports nothing but a type: it is shared with the
 * client, and pulling in `resources` here would drag all three locale files
 * into the browser bundle — which is what react-i18next used to do.
 */
export type Messages = Record<string, string>;

export type Translator = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

const PLACEHOLDER = /\{\{(\w+)\}\}/g;

export function createTranslator(messages: Messages): Translator {
  return (key, params) => {
    // A missing key renders as itself, the way i18next's default did — visible
    // in development, harmless in production.
    const template = messages[key] ?? key;
    if (!params) return template;

    return template.replace(PLACEHOLDER, (placeholder, name: string) =>
      name in params ? String(params[name]) : placeholder,
    );
  };
}
