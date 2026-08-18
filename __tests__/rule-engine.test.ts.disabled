/**
 * @file rule-engine.test.ts
 * @description YYC³ AI浮窗系统规则引擎测试
 * @module __tests__
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import RuleEngine, {
  type Rule,
  type RuleCondition,
  type RuleAction,
  type RuleContext,
  type RuleEvaluationResult,
  type RuleExecutionResult,
  type RuleConflict,
} from '@/lib/rules/RuleEngine';

describe('RuleEngine', () => {
  let ruleEngine: RuleEngine;

  beforeEach(() => {
    ruleEngine = RuleEngine.getInstance();
  });

  afterEach(async () => {
    await ruleEngine.reset();
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      const stats = ruleEngine.getStatistics();
      expect(stats.totalRules).toBeGreaterThan(0);
      expect(stats.enabledRules).toBeGreaterThan(0);
    });

    it('should load default rules', () => {
      const rules = ruleEngine.getAllRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.every(r => r.id && r.name && r.conditions && r.actions)).toBe(true);
    });

    it('should emit initialized event', () => {
      const initializedPromise = new Promise((resolve) => {
        ruleEngine.once('initialized', resolve);
      });

      return expect(initializedPromise).resolves.toBeDefined();
    });
  });

  describe('Rule Management', () => {
    it('should add a new rule', () => {
      const newRule: Rule = {
        id: 'test-rule-1',
        name: 'Test Rule',
        description: 'Test rule for unit testing',
        category: 'custom',
        conditions: {
          id: 'cond-test',
          type: 'simple',
          field: 'environment.device.type',
          operator: 'eq',
          value: 'mobile',
        },
        actions: [
          {
            id: 'action-test',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: { test: true },
            priority: 5,
          },
        ],
        priority: 5,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      ruleEngine.addRule(newRule);

      const retrievedRule = ruleEngine.getRule('test-rule-1');
      expect(retrievedRule).toBeDefined();
      expect(retrievedRule?.id).toBe('test-rule-1');
      expect(retrievedRule?.name).toBe('Test Rule');
    });

    it('should update an existing rule', () => {
      const ruleId = 'rule-mobile-optimization';
      const updates = {
        name: 'Updated Mobile Optimization',
        priority: 15,
      };

      ruleEngine.updateRule(ruleId, updates);

      const updatedRule = ruleEngine.getRule(ruleId);
      expect(updatedRule?.name).toBe('Updated Mobile Optimization');
      expect(updatedRule?.priority).toBe(15);
    });

    it('should remove a rule', () => {
      const ruleId = 'rule-mobile-optimization';
      const initialCount = ruleEngine.getAllRules().length;

      ruleEngine.removeRule(ruleId);

      const finalCount = ruleEngine.getAllRules().length;
      expect(finalCount).toBe(initialCount - 1);
      expect(ruleEngine.getRule(ruleId)).toBeUndefined();
    });

    it('should enable a rule', () => {
      const ruleId = 'rule-mobile-optimization';
      ruleEngine.disableRule(ruleId);

      let rule = ruleEngine.getRule(ruleId);
      expect(rule?.enabled).toBe(false);

      ruleEngine.enableRule(ruleId);

      rule = ruleEngine.getRule(ruleId);
      expect(rule?.enabled).toBe(true);
    });

    it('should disable a rule', () => {
      const ruleId = 'rule-mobile-optimization';
      ruleEngine.disableRule(ruleId);

      const rule = ruleEngine.getRule(ruleId);
      expect(rule?.enabled).toBe(false);
    });

    it('should throw error when updating non-existent rule', () => {
      expect(() => {
        ruleEngine.updateRule('non-existent-rule', { name: 'Updated' });
      }).toThrow('Rule not found: non-existent-rule');
    });

    it('should throw error when enabling non-existent rule', () => {
      expect(() => {
        ruleEngine.enableRule('non-existent-rule');
      }).toThrow('Rule not found: non-existent-rule');
    });

    it('should throw error when disabling non-existent rule', () => {
      expect(() => {
        ruleEngine.disableRule('non-existent-rule');
      }).toThrow('Rule not found: non-existent-rule');
    });
  });

  describe('Rule Evaluation', () => {
    it('should evaluate rules against context', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.ruleId && r.matched !== undefined)).toBe(true);
    });

    it('should match mobile optimization rule for mobile device', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const mobileRuleResult = results.find(r => r.ruleId === 'rule-mobile-optimization');

      expect(mobileRuleResult).toBeDefined();
      expect(mobileRuleResult?.matched).toBe(true);
    });

    it('should not match mobile optimization rule for desktop device', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'desktop' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const mobileRuleResult = results.find(r => r.ruleId === 'rule-mobile-optimization');

      expect(mobileRuleResult).toBeDefined();
      expect(mobileRuleResult?.matched).toBe(false);
    });

    it('should match low network optimization rule for slow network', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'desktop' },
          network: { speed: 'slow' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const networkRuleResult = results.find(r => r.ruleId === 'rule-low-network-optimization');

      expect(networkRuleResult).toBeDefined();
      expect(networkRuleResult?.matched).toBe(true);
    });

    it('should calculate confidence correctly', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);

      for (const result of results) {
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should skip disabled rules during evaluation', async () => {
      const ruleId = 'rule-mobile-optimization';
      ruleEngine.disableRule(ruleId);

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const mobileRuleResult = results.find(r => r.ruleId === ruleId);

      expect(mobileRuleResult).toBeUndefined();
    });
  });

  describe('Rule Execution', () => {
    it('should execute matched rules', async () => {
      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      const results = await ruleEngine.execute(context);

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.ruleId && r.actionId && r.success !== undefined)).toBe(true);
    });

    it('should update rule statistics after execution', async () => {
      const ruleId = 'rule-mobile-optimization';
      const initialStats = ruleEngine.getRule(ruleId)?.statistics;

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      await ruleEngine.execute(context);

      const updatedStats = ruleEngine.getRule(ruleId)?.statistics;
      expect(updatedStats?.triggeredCount).toBeGreaterThan(initialStats?.triggeredCount || 0);
      expect(updatedStats?.executedCount).toBeGreaterThan(initialStats?.executedCount || 0);
    });

    it('should handle execution errors gracefully', async () => {
      const failingRule: Rule = {
        id: 'test-failing-rule',
        name: 'Failing Rule',
        description: 'Rule that fails during execution',
        category: 'custom',
        conditions: {
          id: 'cond-test',
          type: 'simple',
          field: 'test',
          operator: 'eq',
          value: 'test',
        },
        actions: [
          {
            id: 'action-fail',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: { fail: true },
            priority: 5,
          },
        ],
        priority: 5,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      ruleEngine.addRule(failingRule);

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: { test: 'test' },
        user: {},
        system: {},
        history: [],
      };

      const results = await ruleEngine.execute(context);

      const failingResult = results.find(r => r.ruleId === 'test-failing-rule');
      expect(failingResult).toBeDefined();
    });
  });

  describe('Conflict Detection', () => {
    it('should detect priority conflicts', async () => {
      const rule1: Rule = {
        id: 'test-rule-1',
        name: 'Test Rule 1',
        description: 'Test rule 1',
        category: 'custom',
        conditions: {
          id: 'cond-1',
          type: 'simple',
          field: 'test',
          operator: 'eq',
          value: 'test',
        },
        actions: [
          {
            id: 'action-1',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {},
            priority: 10,
          },
        ],
        priority: 10,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      const rule2: Rule = {
        id: 'test-rule-2',
        name: 'Test Rule 2',
        description: 'Test rule 2',
        category: 'custom',
        conditions: {
          id: 'cond-2',
          type: 'simple',
          field: 'test',
          operator: 'eq',
          value: 'test',
        },
        actions: [
          {
            id: 'action-2',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {},
            priority: 10,
          },
        ],
        priority: 10,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      ruleEngine.addRule(rule1);
      ruleEngine.addRule(rule2);

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: { test: 'test' },
        user: {},
        system: {},
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const matchedResults = results.filter(r => r.matched);

      expect(matchedResults.length).toBeGreaterThan(1);
    });

    it('should detect resource conflicts', async () => {
      const rule1: Rule = {
        id: 'test-rule-1',
        name: 'Test Rule 1',
        description: 'Test rule 1',
        category: 'custom',
        conditions: {
          id: 'cond-1',
          type: 'simple',
          field: 'test',
          operator: 'eq',
          value: 'test',
        },
        actions: [
          {
            id: 'action-1',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {},
            priority: 10,
          },
        ],
        priority: 10,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      const rule2: Rule = {
        id: 'test-rule-2',
        name: 'Test Rule 2',
        description: 'Test rule 2',
        category: 'custom',
        conditions: {
          id: 'cond-2',
          type: 'simple',
          field: 'test',
          operator: 'eq',
          value: 'test',
        },
        actions: [
          {
            id: 'action-2',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {},
            priority: 5,
          },
        ],
        priority: 5,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      };

      ruleEngine.addRule(rule1);
      ruleEngine.addRule(rule2);

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: { test: 'test' },
        user: {},
        system: {},
        history: [],
      };

      const results = await ruleEngine.evaluate(context);
      const matchedResults = results.filter(r => r.matched);

      expect(matchedResults.length).toBeGreaterThan(1);
    });
  });

  describe('Statistics', () => {
    it('should return correct statistics', () => {
      const stats = ruleEngine.getStatistics();

      expect(stats.totalRules).toBeGreaterThan(0);
      expect(stats.enabledRules).toBeGreaterThan(0);
      expect(stats.disabledRules).toBeGreaterThanOrEqual(0);
      expect(stats.totalTriggers).toBeGreaterThanOrEqual(0);
      expect(stats.totalExecutions).toBeGreaterThanOrEqual(0);
      expect(stats.totalFailures).toBeGreaterThanOrEqual(0);
      expect(stats.avgSuccessRate).toBeGreaterThanOrEqual(0);
      expect(stats.avgSuccessRate).toBeLessThanOrEqual(1);
    });

    it('should update statistics after rule execution', async () => {
      const initialStats = ruleEngine.getStatistics();

      const context: RuleContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'fast' },
          time: { isWorkHours: true },
        },
        user: {
          activity: 'active',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.5,
          memoryUsage: 0.3,
          performanceMode: 'balanced',
        },
        history: [],
      };

      await ruleEngine.execute(context);

      const updatedStats = ruleEngine.getStatistics();
      expect(updatedStats.totalTriggers).toBeGreaterThan(initialStats.totalTriggers);
      expect(updatedStats.totalExecutions).toBeGreaterThan(initialStats.totalExecutions);
    });
  });

  describe('Configuration', () => {
    it('should return current configuration', () => {
      const config = ruleEngine.getConfig();

      expect(config).toBeDefined();
      expect(config.maxHistorySize).toBeDefined();
      expect(config.evaluationTimeout).toBeDefined();
      expect(config.executionTimeout).toBeDefined();
      expect(config.conflictResolutionStrategy).toBeDefined();
    });

    it('should update configuration', () => {
      const updates = {
        maxHistorySize: 2000,
        evaluationTimeout: 10000,
      };

      ruleEngine.updateConfig(updates);

      const config = ruleEngine.getConfig();
      expect(config.maxHistorySize).toBe(2000);
      expect(config.evaluationTimeout).toBe(10000);
    });

    it('should emit config-updated event', () => {
      const configPromise = new Promise((resolve) => {
        ruleEngine.once('config-updated', resolve);
      });

      ruleEngine.updateConfig({ maxHistorySize: 2000 });

      return expect(configPromise).resolves.toBeDefined();
    });
  });

  describe('Reset', () => {
    it('should reset engine to initial state', async () => {
      const initialStats = ruleEngine.getStatistics();

      await ruleEngine.reset();

      const resetStats = ruleEngine.getStatistics();
      expect(resetStats.totalRules).toBe(initialStats.totalRules);
      expect(resetStats.totalTriggers).toBe(0);
      expect(resetStats.totalExecutions).toBe(0);
      expect(resetStats.totalFailures).toBe(0);
    });

    it('should emit reset event', async () => {
      const resetPromise = new Promise((resolve) => {
        ruleEngine.once('reset', resolve);
      });

      await ruleEngine.reset();

      return expect(resetPromise).resolves.toBeDefined();
    });
  });
});
