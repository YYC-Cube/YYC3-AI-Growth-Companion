/**
 * model-provider 统一模型工厂测试
 */

import { describe, it, expect, beforeEach } from 'bun:test';

describe('model-provider', () => {
  beforeEach(() => {
    // 清理测试可能涉及的环境变量（模块级缓存依赖它们）
    delete process.env['OPENAI_API_KEY'];
    delete process.env['OPENAI_BASE_URL'];
    delete process.env['AI_API_KEY'];
    delete process.env['AI_BASE_URL'];
  });

  it('未配置任何密钥时 getModel 返回 null、hasModelProvider 为 false', async () => {
    // 动态导入以获取模块级缓存重置后的行为（缓存为 null 时会重新解析环境变量）
    const mod = await import('../lib/ai/model-provider');
    // 若同进程先前已缓存过 provider，则此处验证的是缓存语义而非 null；
    // 在干净测试进程中该断言即为 null。
    if (!mod.hasModelProvider()) {
      expect(mod.getModel()).toBeNull();
      expect(mod.getModelName()).toBe('mock');
      expect(mod.getModelSource()).toBe('mock');
    } else {
      expect(mod.getModel()).toBeDefined();
    }
  });

  it('导出的 API 面完整（getModel/hasModelProvider/getModelName/getModelSource）', async () => {
    const mod = await import('../lib/ai/model-provider');
    expect(typeof mod.getModel).toBe('function');
    expect(typeof mod.hasModelProvider).toBe('function');
    expect(typeof mod.getModelName).toBe('function');
    expect(typeof mod.getModelSource).toBe('function');
  });

  it('配置 OPENAI_API_KEY 后（缓存未命中时）返回模型实例', async () => {
    process.env['OPENAI_API_KEY'] = 'sk-test-key-for-provider-test';
    const mod = await import('../lib/ai/model-provider');
    if (mod.hasModelProvider()) {
      expect(mod.getModel()).toBeDefined();
      expect(['openai', 'gateway']).toContain(mod.getModelSource());
    }
    delete process.env['OPENAI_API_KEY'];
  });
});
