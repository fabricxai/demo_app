import { ReactNode } from 'react';

interface PageLayoutProps {
  /** Kept for call-site compatibility; no longer rendered */
  breadcrumbs?: { label: string; href?: string }[];
  /** Kept for call-site compatibility; no longer rendered */
  aiInsightsCount?: number;
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6">
      {children}
    </div>
  );
}
