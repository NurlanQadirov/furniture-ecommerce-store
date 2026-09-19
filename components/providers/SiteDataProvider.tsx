'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ContactInfo } from '@/types';

const ContactContext = createContext<ContactInfo | null>(null);

interface SiteDataProviderProps {
  contact: ContactInfo;
  children: ReactNode;
}

/**
 * Carries the admin-managed contact details from the server layout down to the
 * client components that need them (header, footer, contact page, calculator)
 * without every one of them re-fetching the store.
 */
export default function SiteDataProvider({ contact, children }: SiteDataProviderProps) {
  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>;
}

export function useContactInfo(): ContactInfo {
  const contact = useContext(ContactContext);
  if (!contact) {
    throw new Error('useContactInfo must be used inside <SiteDataProvider>');
  }
  return contact;
}
