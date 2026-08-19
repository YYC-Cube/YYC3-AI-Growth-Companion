/**
 * 统一中间件（合并版）：性能/缓存头 + 受控的 next-intl 语言路由 + 未知路由 404
 *
 * 语言路由只作用于显式语言前缀（/en、/zh/...）——英文用户经 [locale]
 * 子树的国际化镜像页访问；无前缀的根路径一律放行，由根目录的**完整版**
 * 页面直出。此前曾把 / 与 /growth 也交给语言路由，导致被 [locale] 的
 * 超简化镜像页遮蔽（首页/成长页渲染成空壳，2026-08-19 二次修复）。
 *
 * 2026-08-19 新增：对不匹配任何已知页面路由的路径返回 404，防止 [locale]
 * 动态段将未知单段路径当作 locale 参数匹配后返回 200。
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
  return locales.some(
    l => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

/** 已知的根级页面路由（不含 API 和静态资源） */
const knownRootRoutes = new Set([
  '/',
  '/settings',
  '/growth',
  '/growth/assessment',
  '/videos',
  '/profile',
  '/schedule',
  '/messages',
  '/courses',
  '/interactions',
  '/curriculum',
  '/homework',
  '/badges',
  '/children',
  '/books',
  '/ai-creative',
  '/activities',
  '/ai-chat',
]);

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // API 路由：跳过语言检测，设置 no-cache
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  const start = Date.now();

  // 显式 locale 前缀（/en、/zh/...）→ 交给 next-intl 处理
  if (hasLocalePrefix(pathname)) {
    const response = handleI18nRouting(request);
    response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
    return response;
  }

  // 非 locale 前缀：校验是否为已知路由，未知路径返回 404
  const normalizedPath = pathname === '' ? '/' : pathname;
  if (!knownRootRoutes.has(normalizedPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/404.html';
    const response = NextResponse.redirect(url);
    response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
