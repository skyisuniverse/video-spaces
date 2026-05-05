import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import type { ReactNode } from 'react';

type Dictionary = Record<string, string>;

interface WithDictionaryProps<P = {}> {
  children: (dict: Dictionary) => ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function WithDictionary<P = {}>({
  children,
  params,
}: WithDictionaryProps<P>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <>{children(dict)}</>;
}