'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useParams } from 'next/navigation';

type Dictionary = Record<string, string>;

type NavigationContextValue = {
  localize: (href: string) => string;
  dict: Dictionary;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  children,
  dict,
}: {
  children: ReactNode;
  dict: Dictionary;
}) {
  const { lang } = useParams() as { lang: string };

  const getLocalizedHref = (href: string): string => {
    if (href === '/') return `/${lang}`;
    if (!href.startsWith('/')) href = '/' + href;
    if (href.startsWith(`/${lang}/`)) return href;
    return `/${lang}${href}`;
  };

  const value: NavigationContextValue = {
    localize: getLocalizedHref,
    dict,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};