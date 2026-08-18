/**
 * 内置 i18n-core（自研零依赖国际化基础设施）冒烟测试
 */

import { describe, it, expect } from 'bun:test';
import { I18nEngine, formatRelativeTime, interpolate, LRUCache } from '../../lib/i18n-core';

describe('i18n-core（内置一方模块）', () => {
  it('引擎可实例化并翻译内置语言', () => {
    const engine = new I18nEngine({ locale: 'zh-CN' });
    expect(typeof engine.t).toBe('function');
    engine.setLocale('en');
    expect(engine.getLocale()).toBe('en');
  });

  it('interpolate 插值', () => {
    expect(interpolate('你好 {name}', { name: '小语' })).toContain('小语');
  });

  it('formatRelativeTime 相对时间', () => {
    const out = formatRelativeTime(-60, 'zh-CN');
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });

  it('LRUCache 基础行为', () => {
    const cache = new LRUCache<string>({ maxSize: 2 });
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    expect(cache.get('a')).toBeNull();
    expect(cache.get('c')).toBe('3');
  });
});
