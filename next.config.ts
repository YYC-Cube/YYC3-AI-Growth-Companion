import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * 统一合并版：合并原 next.config.ts 与 next.config.mjs 双配置
 * （Next 16 原生支持 TS 配置，.mjs 已删除），
 * 并接入 next-intl 插件（加载 i18n/request.ts，v4 规范）。
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 配置 Turbopack 根目录，消除 workspace root warning
  experimental: {
    turbo: {
      root: __dirname,
    },
  },

  // 图片：沿用 .mjs 的 unoptimized 策略（避免远程图片优化器依赖）
  images: {
    unoptimized: true,
  },

  compress: true,
  poweredByHeader: false,

  // 配置环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: 'YYC³ 智能守护系统',
    NEXT_PUBLIC_APP_VERSION: '3.0.0',
  },

  // 配置Turbopack
  turbopack: {},

  // 路径别名 '@/*' 由 tsconfig.json paths 提供（原 .mjs 的 webpack alias
  // 在 Turbopack 下不生效，且与 tsconfig 重复，已移除）
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
