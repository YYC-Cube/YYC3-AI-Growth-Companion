/**
 * 统一中间件（合并版）：next-intl 语言路由 + 性能/缓存头
 *
 * - /api/*：不做语言路由，仅设置 Cache-Control: no-store
 * - 页面请求：经 next-intl 处理（localePrefix: 'as-needed'，
 *   默认语言 zh 无前缀，/en 前缀路由英文），并附加 X-Response-Time
 */

import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  const start = Date.now();
  const response = handleI18nRouting(request);
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  return response;
}

export const config = {
  matcher: [
    // 匹配所有路径（含 /api），排除静态资源；/api 由上方分支只加缓存头、不做语言路由
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
