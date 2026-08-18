/**
 * @file model-provider.ts
 * @description 统一的 AI 模型 Provider 工厂（真实 AI 接入，Phase 3a）
 *
 * 消除全家族遗留的字符串 model 用法（`model: 'openai/gpt-4o-mini'` 在缺少
 * Gateway 配置时必然抛错）。所有真实模型调用统一经由此模块获取 provider 实例。
 *
 * 配置解析顺序（服务端环境变量）：
 * 1. OPENAI_API_KEY（可选 OPENAI_BASE_URL / OPENAI_MODEL）→ OpenAI 官方或兼容端点
 * 2. AI_API_KEY + AI_BASE_URL（可选 AI_MODEL）→ 任意 OpenAI 兼容网关
 *    （如自建代理 api.0379.email/v1、BigModel 等）
 *
 * 未配置任何密钥时 getModel() 返回 null，调用方应降级到本地 Mock 回复。
 */

import { createOpenAI } from '@ai-sdk/openai';

let cached: {
  model: ReturnType<ReturnType<typeof createOpenAI>>;
  name: string;
  source: 'openai' | 'gateway';
} | null = null;

function resolveProvider() {
  if (cached) return cached;

  const openaiKey = process.env['OPENAI_API_KEY'];
  if (openaiKey) {
    const openai = createOpenAI({
      apiKey: openaiKey,
      baseURL: process.env['OPENAI_BASE_URL'] || undefined,
    });
    const modelName = process.env['OPENAI_MODEL'] || 'gpt-4o-mini';
    cached = { model: openai(modelName), name: modelName, source: 'openai' };
    return cached;
  }

  const gatewayKey = process.env['AI_API_KEY'];
  const gatewayBase = process.env['AI_BASE_URL'];
  if (gatewayKey && gatewayBase) {
    const gateway = createOpenAI({
      apiKey: gatewayKey,
      baseURL: gatewayBase,
    });
    const modelName = process.env['AI_MODEL'] || 'gpt-4o-mini';
    cached = { model: gateway(modelName), name: modelName, source: 'gateway' };
    return cached;
  }

  return null;
}

/** 是否已配置真实模型 Provider（用于健康检查与降级判断） */
export function hasModelProvider(): boolean {
  return resolveProvider() !== null;
}

/**
 * 获取真实模型实例。
 * @returns 未配置密钥时返回 null，调用方必须降级处理。
 */
export function getModel() {
  const resolved = resolveProvider();
  return resolved ? resolved.model : null;
}

/** 当前生效的模型名（未配置时返回 'mock'） */
export function getModelName(): string {
  return resolveProvider()?.name ?? 'mock';
}

/** 配置来源（未配置时返回 'mock'） */
export function getModelSource(): 'openai' | 'gateway' | 'mock' {
  return resolveProvider()?.source ?? 'mock';
}
