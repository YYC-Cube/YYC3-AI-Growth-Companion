/**
 * YYC³ AI小语智能成长守护系统 - 国际化常量配置
 *
 * 统一合并版说明：原文件默认导出 next-intl v3 风格的 getRequestConfig
 * （`({ locale })` 参数在 v4 中已更名 requestLocale，属死配置），
 * 现拆分为：本文件仅保留共享常量，运行时配置移至 i18n/request.ts（v4 规范）。
 */

// 支持的语言
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh';

// 语言映射
export const localeNames = {
  zh: '中文',
  en: 'English',
} as const;
