/**
 * 统一中间件（合并版）：性能/缓存头 + 受控的 next-intl 语言路由
 *
 * 语言路由只作用于 [locale] 子树实际拥有的页面（/, /growth, /ai-chat
 * 及 /en 前缀路径）；其余根路由（settings/badges/profile 等）直接放行，
 * 由根布局的中文实现直出——否则 as-needed 重写会指向不存在的
 * /zh/<path> 导致 404（2026-08-19 修复的历史回归）。
 */

import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

/** [locale] 子树拥有的路由（相对根路径） */
const LOCALE_ROUTES = ['/', '/growth', '/ai-chat'];

function isLocaleRouted(pathname: string): boolean {
  // 显式语言前缀（/en、/zh/...）
  if (locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return true;
  }
  // 无前缀时仅 [locale] 子树拥有的页面参与语言路由
  return LOCALE_ROUTES.includes(pathname);
}

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  const start = Date.now();
  const response = isLocaleRouted(pathname)
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
