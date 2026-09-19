import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Mebeltech — İdarə paneli',
  robots: { index: false, follow: false },
};

/**
 * Deliberately free of the public header and footer: the panel is a tool, not
 * a page of the site. The login screen and the panel supply their own chrome.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-panel font-inter text-custom-black antialiased">{children}</div>
  );
}
