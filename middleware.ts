/**
 * 统一中间件（合并版）：性能/缓存头 + 受控的 next-intl 语言路由
 *
 * 语言路由只作用于显式语言前缀（/en、/zh/...）——英文用户经 [locale]
 * 子树的国际化镜像页访问；无前缀的根路径一律放行，由根目录的**完整版**
 * 页面直出。此前曾把 / 与 /growth 也交给语言路由，导致被 [locale] 的
 * 超简化镜像页遮蔽（首页/成长页渲染成空壳，2026-08-19 二次修复）。
 */

import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

function hasLocalePrefix(pathname: string): boolean {
  return locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
}

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  const start = Date.now();
  const response = hasLocalePrefix(pathname)
    ? handleI18nRouting(request)
    : NextResponse.next();
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  return response;
}

export const config = {
  matcher: [
    // 页面：排除静态资源与一切带扩展名的文件路径（public/ 图片、favicon 等
    // 均绕过语言路由，否则会被 next-intl 当作页面处理导致 404）
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
