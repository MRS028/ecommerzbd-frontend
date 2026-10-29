import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from '@/shared/components/ui/sonner';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </HelmetProvider>
  );
}