import type { ReactNode } from 'react';
import { i18n, type Locale } from '@/i18n-config';
import ClientRootLayout from './ClientRootLayout';
import { getDictionary } from '@/get-dictionary';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js expects string here — we cast safely below
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Safe cast — generateStaticParams guarantees only "en" | "de"
  const locale = lang as Locale;

  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <ClientRootLayout dict={dict}>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}