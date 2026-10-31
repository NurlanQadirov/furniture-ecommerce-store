import type { Category, ContactInfo, Product } from '@/types';

/** Everything the site renders that the owner can edit from `/admin`. */
export interface SiteStore {
  /**
   * ISO time the content — categories, products, contact — last changed.
   * Set by `mutateStore`. Absent in stores written before it existed.
   */
  contentModifiedAt?: string;
  categories: Category[];
  products: Product[];
  contact: ContactInfo;
}
