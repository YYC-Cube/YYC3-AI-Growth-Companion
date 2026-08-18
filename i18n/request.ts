/**
 * next-intl v4 运行时配置（统一合并版新增）
 *
 * 由 next.config.ts 中的 createNextIntlPlugin() 默认加载（路径 ./i18n/request.ts）。
 * 显式映射两种语言的 messages 模块，避免动态 import 上下文的打包歧义。
 */

import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '../i18n';

const messageLoaders = {
  zh: () => import('../messages/zh.json'),
  en: () => import('../messages/en.json'),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
  };
});
