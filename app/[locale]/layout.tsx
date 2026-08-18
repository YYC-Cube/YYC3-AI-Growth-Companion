/**
 * YYC³ AI小语智能成长守护系统 - 国际化布局（统一合并版接线）
 *
 * 变更：接入 NextIntlClientProvider（next-intl v4），[locale] 路由下的
 * useTranslations/getTranslations 现已可用；语言检测与路由由 middleware
 * 的 next-intl 中间件处理。根路由（无 [locale] 段）保持中文直出。
 */

import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'YYC³ AI小语 - 智能成长守护系统',
    template: '%s | YYC³ AI小语',
  },
  description: '0-22岁全周期AI智能成长守护平台',
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
          rel='stylesheet'
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <div className='min-h-screen bg-sky-50'>{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
