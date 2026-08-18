/**
 * @file decision-engine.test.ts
 * @description YYC³ AI浮窗系统决策引擎测试
 * @module __tests__
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DecisionEngine, {
  type DecisionContext,
  type DecisionResult,
  type DecisionOption,
  type DecisionFactor,
  type DecisionFeature,
  type DecisionModel,
} from '@/lib/decision/DecisionEngine';

describe('DecisionEngine', () => {
  let decisionEngine: DecisionEngine;

  beforeEach(() => {
    decisionEngine = DecisionEngine.getInstance();
  });

  afterEach(async () => {
    await decisionEngine.reset();
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      const metrics = decisionEngine.getMetrics();
      expect(metrics.totalDecisions).toBe(0);
      expect(metrics.successfulDecisions).toBe(0);
      expect(metrics.failedDecisions).toBe(0);
    });

    it('should load default models', () => {
      const models = decisionEngine.getAllModels();
      expect(models.length).toBeGreaterThan(0);
      expect(models.every(m => m.id && m.name && m.version)).toBe(true);
    });

    it('should emit initialized event', () => {
      const initializedPromise = new Promise((resolve) => {
        decisionEngine.once('initialized', resolve);
      });

      return expect(initializedPromise).resolves.toBeDefined();
    });
  });

  describe('Feature Extraction', () => {
    it('should extract environment factors', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);
      expect(result.features).toBeDefined();
      expect(result.features.length).toBeGreaterThan(0);

      const environmentFeature = result.features.find(f => f.id === 'feature_environment');
      expect(environmentFeature).toBeDefined();
      expect(environmentFeature?.factors.length).toBeGreaterThan(0);
    });

    it('should extract user factors', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);
      const userFeature = result.features.find(f => f.id === 'feature_user');
      expect(userFeature).toBeDefined();
      expect(userFeature?.factors.length).toBeGreaterThan(0);
    });

    it('should extract system factors', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);
      const systemFeature = result.features.find(f => f.id === 'feature_system');
      expect(systemFeature).toBeDefined();
      expect(systemFeature?.factors.length).toBeGreaterThan(0);
    });

    it('should extract historical factors', async () => {
      const context: DecisionContext = {
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
        historical: [
          { timestamp: Date.now() - 1000, data: { test: 'data1' } },
          { timestamp: Date.now() - 2000, data: { test: 'data2' } },
        ],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);
      const historicalFeature = result.features.find(f => f.id === 'feature_historical');
      expect(historicalFeature).toBeDefined();
      expect(historicalFeature?.factors.length).toBeGreaterThan(0);
    });

    it('should extract predictive factors', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {
          load: 0.6,
          userActivity: 0.8,
          resourceDemand: 0.5,
        },
      };

      const result = await decisionEngine.decide(context);
      const predictiveFeature = result.features.find(f => f.id === 'feature_predictive');
      expect(predictiveFeature).toBeDefined();
      expect(predictiveFeature?.factors.length).toBeGreaterThan(0);
    });

    it('should normalize factor values correctly', async () => {
      const context: DecisionContext = {
        timestamp: Date.now(),
        environment: {
          device: { type: 'mobile' },
          network: { speed: 'slow' },
          time: { isWorkHours: false },
        },
        user: {
          activity: 'idle',
          preferences: { theme: 'light' },
          context: {},
        },
        system: {
          load: 0.8,
          memoryUsage: 0.7,
          performanceMode: 'power-saving',
        },
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      for (const feature of result.features) {
        for (const factor of feature.factors) {
          expect(factor.normalizedValue).toBeGreaterThanOrEqual(0);
          expect(factor.normalizedValue).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should calculate feature confidence correctly', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      for (const feature of result.features) {
        expect(feature.confidence).toBeGreaterThanOrEqual(0);
        expect(feature.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Decision Making', () => {
    it('should make a decision based on context', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.context).toEqual(context);
      expect(result.features).toBeDefined();
      expect(result.options).toBeDefined();
      expect(result.selectedOption).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.reasoning).toBeDefined();
      expect(result.alternatives).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should select option with highest confidence', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      expect(result.selectedOption.confidence).toBeGreaterThanOrEqual(0);
      expect(result.selectedOption.confidence).toBeLessThanOrEqual(1);

      for (const alternative of result.alternatives) {
        expect(result.selectedOption.confidence).toBeGreaterThanOrEqual(alternative.confidence);
      }
    });

    it('should generate reasoning for decision', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.length).toBeGreaterThan(0);
      expect(result.reasoning.every(r => typeof r === 'string')).toBe(true);
    });

    it('should estimate impact of options', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const result = await decisionEngine.decide(context);

      for (const option of result.options) {
        expect(option.expectedImpact).toBeDefined();
        expect(option.expectedImpact.performance).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.performance).toBeLessThanOrEqual(1);
        expect(option.expectedImpact.userExperience).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.userExperience).toBeLessThanOrEqual(1);
        expect(option.expectedImpact.resourceUsage).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.resourceUsage).toBeLessThanOrEqual(1);
        expect(option.expectedImpact.cost).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.cost).toBeLessThanOrEqual(1);
        expect(option.expectedImpact.reliability).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.reliability).toBeLessThanOrEqual(1);
        expect(option.expectedImpact.overall).toBeGreaterThanOrEqual(0);
        expect(option.expectedImpact.overall).toBeLessThanOrEqual(1);
      }
    });

    it('should emit decision-started event', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const startedPromise = new Promise((resolve) => {
        decisionEngine.once('decision-started', resolve);
      });

      decisionEngine.decide(context);

      return expect(startedPromise).resolves.toBeDefined();
    });

    it('should emit decision-completed event', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      const completedPromise = new Promise((resolve) => {
        decisionEngine.once('decision-completed', resolve);
      });

      await decisionEngine.decide(context);

      return expect(completedPromise).resolves.toBeDefined();
    });
  });

  describe('Model Management', () => {
    it('should get model by id', () => {
      const model = decisionEngine.getModel('model-default');
      expect(model).toBeDefined();
      expect(model?.id).toBe('model-default');
      expect(model?.name).toBeDefined();
      expect(model?.version).toBeDefined();
    });

    it('should get all models', () => {
      const models = decisionEngine.getAllModels();
      expect(models.length).toBeGreaterThan(0);
      expect(models.every(m => m.id && m.name && m.version)).toBe(true);
    });

    it('should add new model', () => {
      const newModel: DecisionModel = {
        id: 'model-test',
        name: 'Test Model',
        description: 'Test model for unit testing',
        version: '1.0.0',
        features: [],
        weights: new Map([
          ['performance', 0.2],
          ['userExperience', 0.3],
          ['resourceUsage', 0.2],
          ['cost', 0.15],
          ['reliability', 0.15],
        ]),
        threshold: 0.7,
        accuracy: 0.8,
        lastTrainedAt: Date.now(),
        trainingDataSize: 500,
      };

      decisionEngine.addModel(newModel);

      const retrievedModel = decisionEngine.getModel('model-test');
      expect(retrievedModel).toBeDefined();
      expect(retrievedModel?.id).toBe('model-test');
      expect(retrievedModel?.name).toBe('Test Model');
    });

    it('should update existing model', () => {
      const modelId = 'model-default';
      const updates = {
        name: 'Updated Default Model',
        accuracy: 0.9,
      };

      decisionEngine.updateModel(modelId, updates);

      const updatedModel = decisionEngine.getModel(modelId);
      expect(updatedModel?.name).toBe('Updated Default Model');
      expect(updatedModel?.accuracy).toBe(0.9);
    });

    it('should remove model', () => {
      const modelId = 'model-default';
      const initialCount = decisionEngine.getAllModels().length;

      decisionEngine.removeModel(modelId);

      const finalCount = decisionEngine.getAllModels().length;
      expect(finalCount).toBe(initialCount - 1);
      expect(decisionEngine.getModel(modelId)).toBeUndefined();
    });

    it('should throw error when updating non-existent model', () => {
      expect(() => {
        decisionEngine.updateModel('non-existent-model', { name: 'Updated' });
      }).toThrow('Model not found: non-existent-model');
    });

    it('should emit model-added event', () => {
      const newModel: DecisionModel = {
        id: 'model-test',
        name: 'Test Model',
        description: 'Test model for unit testing',
        version: '1.0.0',
        features: [],
        weights: new Map([
          ['performance', 0.2],
          ['userExperience', 0.3],
          ['resourceUsage', 0.2],
          ['cost', 0.15],
          ['reliability', 0.15],
        ]),
        threshold: 0.7,
        accuracy: 0.8,
        lastTrainedAt: Date.now(),
        trainingDataSize: 500,
      };

      const addedPromise = new Promise((resolve) => {
        decisionEngine.once('model-added', resolve);
      });

      decisionEngine.addModel(newModel);

      return expect(addedPromise).resolves.toBeDefined();
    });

    it('should emit model-updated event', () => {
      const updatedPromise = new Promise((resolve) => {
        decisionEngine.once('model-updated', resolve);
      });

      decisionEngine.updateModel('model-default', { name: 'Updated' });

      return expect(updatedPromise).resolves.toBeDefined();
    });

    it('should emit model-removed event', () => {
      const removedPromise = new Promise((resolve) => {
        decisionEngine.once('model-removed', resolve);
      });

      decisionEngine.removeModel('model-default');

      return expect(removedPromise).resolves.toBeDefined();
    });
  });

  describe('Metrics', () => {
    it('should return correct metrics', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      await decisionEngine.decide(context);

      const metrics = decisionEngine.getMetrics();
      expect(metrics.totalDecisions).toBeGreaterThan(0);
      expect(metrics.successfulDecisions).toBeGreaterThan(0);
      expect(metrics.failedDecisions).toBeGreaterThanOrEqual(0);
      expect(metrics.averageConfidence).toBeGreaterThanOrEqual(0);
      expect(metrics.averageConfidence).toBeLessThanOrEqual(1);
      expect(metrics.averageExecutionTime).toBeGreaterThan(0);
      expect(metrics.accuracy).toBeGreaterThanOrEqual(0);
      expect(metrics.accuracy).toBeLessThanOrEqual(1);
    });

    it('should update metrics after decision', async () => {
      const initialMetrics = decisionEngine.getMetrics();

      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      await decisionEngine.decide(context);

      const updatedMetrics = decisionEngine.getMetrics();
      expect(updatedMetrics.totalDecisions).toBeGreaterThan(initialMetrics.totalDecisions);
      expect(updatedMetrics.successfulDecisions).toBeGreaterThan(initialMetrics.successfulDecisions);
    });

    it('should track decision history', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      await decisionEngine.decide(context);

      const history = decisionEngine.getDecisionHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history.every(h => h.timestamp && h.result)).toBe(true);
    });

    it('should limit decision history', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      await decisionEngine.decide(context);

      const limitedHistory = decisionEngine.getDecisionHistory(1);
      expect(limitedHistory.length).toBe(1);
    });
  });

  describe('Configuration', () => {
    it('should return current configuration', () => {
      const config = decisionEngine.getConfig();

      expect(config).toBeDefined();
      expect(config.maxFeatures).toBeDefined();
      expect(config.maxOptions).toBeDefined();
      expect(config.minConfidence).toBeDefined();
      expect(config.enableLearning).toBeDefined();
      expect(config.enablePrediction).toBeDefined();
      expect(config.enableOptimization).toBeDefined();
    });

    it('should update configuration', () => {
      const updates = {
        maxFeatures: 15,
        maxOptions: 10,
        minConfidence: 0.8,
      };

      decisionEngine.updateConfig(updates);

      const config = decisionEngine.getConfig();
      expect(config.maxFeatures).toBe(15);
      expect(config.maxOptions).toBe(10);
      expect(config.minConfidence).toBe(0.8);
    });

    it('should emit config-updated event', () => {
      const configPromise = new Promise((resolve) => {
        decisionEngine.once('config-updated', resolve);
      });

      decisionEngine.updateConfig({ maxFeatures: 15 });

      return expect(configPromise).resolves.toBeDefined();
    });
  });

  describe('Reset', () => {
    it('should reset engine to initial state', async () => {
      const context: DecisionContext = {
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
        historical: [],
        predictive: {},
      };

      await decisionEngine.decide(context);

      await decisionEngine.reset();

      const metrics = decisionEngine.getMetrics();
      expect(metrics.totalDecisions).toBe(0);
      expect(metrics.successfulDecisions).toBe(0);
      expect(metrics.failedDecisions).toBe(0);
    });

    it('should emit reset event', async () => {
      const resetPromise = new Promise((resolve) => {
        decisionEngine.once('reset', resolve);
      });

      await decisionEngine.reset();

      return expect(resetPromise).resolves.toBeDefined();
    });
  });
});
