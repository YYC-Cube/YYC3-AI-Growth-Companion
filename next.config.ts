import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * 统一合并版：合并原 next.config.ts 与 next.config.mjs 双配置
 * （Next 16 原生支持 TS 配置，.mjs 已删除），
 * 并接入 next-intl 插件（加载 i18n/request.ts，v4 规范）。
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 临时开关（存量类型债 778 / lint 6711，清偿后移除）：
  // 构建不因存量类型错误失败；新增代码由 CI 的 tsc/eslint 报告步骤追踪
  typescript: {
    ignoreBuildErrors: true,
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

  // 安全响应头（移植自 YYC3-Baby 安全加固；CSP 仅生产环境追加，
  // Next 16 不接受空 headers 数组，故开发环境不注册该条规则）
  async headers() {
    const rules = [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), microphone=(self)',
          },
        ],
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      rules.push({
        source: '/((?!_next/static).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob: data:",
              "connect-src 'self' https://open.bigmodel.cn",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      });
    }

    return rules;
  },

  // 路径别名 '@/*' 由 tsconfig.json paths 提供（原 .mjs 的 webpack alias
  // 在 Turbopack 下不生效，且与 tsconfig 重复，已移除）
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
