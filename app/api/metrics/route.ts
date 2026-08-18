/**
 * @file route.ts
 * @description Prometheus 指标端点（统一合并版新增，Phase 3b 监控接线）
 *
 * GET /api/metrics 返回 Prometheus 文本格式指标。
 * 对应 monitoring/prometheus.yml 的 metrics_path: /api/metrics 抓取配置。
 */

import { registry } from '@/lib/monitoring/metrics';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const metrics = await registry.metrics();
  return new Response(metrics, {
    headers: {
      'Content-Type': registry.contentType,
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}
