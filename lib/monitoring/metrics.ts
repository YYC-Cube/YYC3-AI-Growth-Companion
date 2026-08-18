/**
 * @file metrics.ts
 * @description Prometheus 指标注册中心（统一合并版新增，Phase 3b 监控接线）
 *
 * 使既有 monitoring/prometheus.yml 的抓取目标（/api/metrics）真正可用。
 * 业务计数器在 API 路由中递增；默认指标（CPU/内存/事件循环）自动采集。
 */

import { Registry, collectDefaultMetrics, Counter } from 'prom-client';

export const registry = new Registry();

collectDefaultMetrics({ register: registry });

/** AI 聊天请求计数（含降级标记） */
export const aiChatRequestsTotal = new Counter({
  name: 'yyc3_ai_chat_requests_total',
  help: 'Total AI chat requests',
  labelNames: ['role', 'source'] as const,
  registers: [registry],
});

/** 徽章 API 请求计数 */
export const badgesRequestsTotal = new Counter({
  name: 'yyc3_badges_requests_total',
  help: 'Total badge API requests',
  labelNames: ['action'] as const,
  registers: [registry],
});

/** 徽章解锁计数 */
export const badgesUnlockedTotal = new Counter({
  name: 'yyc3_badges_unlocked_total',
  help: 'Total badges unlocked',
  registers: [registry],
});
