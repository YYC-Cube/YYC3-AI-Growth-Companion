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

import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
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

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 - 页面走丢了</title></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:system-ui;background:#fff3e0">
<div style="text-align:center;padding:2rem">
  <div style="font-size:4rem;margin-bottom:1rem">🔍</div>
  <h1 style="font-size:3.5rem;font-weight:bold;margin:0 0 .5rem">404</h1>
  <h2 style="font-size:1.25rem;font-weight:600;margin:0 0 1rem;color:#555">页面走丢了</h2>
  <p style="color:#777;margin-bottom:2rem">小语找不到这个页面呢，要不要回到首页看看？</p>
  <a href="/" style="display:inline-block;padding:.75rem 2rem;background:linear-gradient(to right,#f472b6,#a78bfa);color:#fff;border-radius:9999px;text-decoration:none">回到首页</a>
</div>
</body></html>`;

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
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Response-Time': `${Date.now() - start}ms`,
      },
    });
  }

  const response = NextResponse.next();
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
