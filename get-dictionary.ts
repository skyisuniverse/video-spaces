import 'server-only';
import type { Locale } from '@/i18n-config';

// All supported locales must be listed here
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  de: () => import('@/dictionaries/de.json').then((module) => module.default),
} as const;

// Fallback to English if locale is missing or invalid
export const getDictionary = async (locale: Locale): Promise<any> => {
  // Safe access with fallback
  const loader = dictionaries[locale] ?? dictionaries.en;

  if (!loader) {
    // This should never happen if you have at least 'en'
    throw new Error(`No dictionary found for locale: ${locale}`);
  }

  return loader();
};