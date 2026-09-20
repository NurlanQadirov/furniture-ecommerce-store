import { getLanguage, getT } from '@/lib/i18n/server';
import { pickLocalized } from '@/lib/i18n/localized';
import { getContact } from '@/lib/store/server';
import type { SchemaContext } from '@/lib/seo/jsonld';

/**
 * Assembles what every schema builder needs. Server-only: it reaches the JSON
 * store, so it must stay out of anything the edge runtime loads.
 */
export async function getSchemaContext(): Promise<SchemaContext> {
  const [language, t, contact] = await Promise.all([getLanguage(), getT(), getContact()]);

  return {
    language,
    t,
    contact,
    loc: (value) => pickLocalized(value, language),
  };
}
