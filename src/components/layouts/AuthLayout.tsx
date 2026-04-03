import { ReactNode } from 'react';
import { Toaster } from '../ui/sonner';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] relative">
      {children}
      <Toaster position="bottom-right" />
    </div>
  );
}
