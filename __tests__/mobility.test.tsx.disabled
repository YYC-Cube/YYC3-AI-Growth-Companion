/**
 * @file mobility.test.ts
 * @description YYC³ AI浮窗系统移动性引擎测试
 * @module __tests__
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MobilityEngine, {
  type Location,
  type Device,
  type Platform,
  type MobilityContext,
  type MobilityState,
  type MobilityMetrics,
} from '@/lib/mobility/MobilityEngine';

describe('MobilityEngine', () => {
  let mobilityEngine: MobilityEngine;

  beforeEach(() => {
    mobilityEngine = MobilityEngine.getInstance();
  });

  afterEach(async () => {
    await mobilityEngine.reset();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const context = mobilityEngine.getCurrentContext();
      expect(context).not.toBeNull();
      expect(context?.currentLocation).toBeDefined();
      expect(context?.currentDevice).toBeDefined();
      expect(context?.currentPlatform).toBeDefined();
    });

    it('should emit initialized event', async () => {
      const initializedPromise = new Promise<MobilityContext>((resolve) => {
        mobilityEngine.once('initialized', (context: MobilityContext) => {
          resolve(context);
        });
      });

      const context = await initializedPromise;
      expect(context).toBeDefined();
    });
  });

  describe('Context Detection', () => {
    it('should detect current location', async () => {
      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentLocation.type).toBe('virtual');
    });

    it('should detect current device', async () => {
      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentDevice.id).toBeDefined();
      expect(context?.currentDevice.type).toMatch(/mobile|tablet|desktop|iot/);
    });

    it('should detect current platform', async () => {
      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentPlatform.type).toBe('web');
    });
  });

  describe('Move Operations', () => {
    it('should move to a new location', async () => {
      const targetLocation: Location = {
        type: 'virtual',
        path: '/new-location',
      };

      const movePromise = new Promise<void>((resolve) => {
        mobilityEngine.once('transition-completed', () => {
          resolve();
        });
      });

      await mobilityEngine.moveTo(targetLocation);
      await movePromise;

      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentLocation.path).toBe('/new-location');
    });

    it('should move to a new device', async () => {
      const targetDevice: Device = {
        id: 'test-device-1',
        type: 'mobile',
        name: 'Test Device',
        os: 'iOS',
        osVersion: '15.0',
        capabilities: {
          screenSize: { width: 375, height: 667 },
          touchSupport: true,
          microphone: true,
          camera: true,
          networkSpeed: 'fast',
          storage: 64,
          memory: 4,
          cpuCores: 4,
        },
        status: 'online',
        lastSeen: Date.now(),
      };

      const movePromise = new Promise<void>((resolve) => {
        mobilityEngine.once('transition-completed', () => {
          resolve();
        });
      });

      await mobilityEngine.moveTo(targetDevice);
      await movePromise;

      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentDevice.id).toBe('test-device-1');
    });

    it('should move to a new platform', async () => {
      const targetPlatform: Platform = {
        type: 'mobile',
        name: 'Mobile Platform',
        version: '1.0.0',
        features: ['touch', 'mobile'],
      };

      const movePromise = new Promise<void>((resolve) => {
        mobilityEngine.once('transition-completed', () => {
          resolve();
        });
      });

      await mobilityEngine.moveTo(targetPlatform);
      await movePromise;

      const context = mobilityEngine.getCurrentContext();
      expect(context?.currentPlatform.type).toBe('mobile');
    });

    it('should emit move progress events', async () => {
      const progressEvents: number[] = [];

      mobilityEngine.on('move-progress', (state: MobilityState) => {
        progressEvents.push(state.moveProgress);
      });

      const targetLocation: Location = {
        type: 'virtual',
        path: '/test-location',
      };

      await mobilityEngine.moveTo(targetLocation);

      expect(progressEvents.length).toBeGreaterThan(0);
      expect(progressEvents).toContain(33);
      expect(progressEvents).toContain(66);
      expect(progressEvents).toContain(100);
    });

    it('should not allow concurrent moves', async () => {
      const targetLocation: Location = {
        type: 'virtual',
        path: '/test-location',
      };

      await mobilityEngine.moveTo(targetLocation);

      await expect(mobilityEngine.moveTo(targetLocation)).rejects.toThrow('Already moving');
    });
  });

  describe('State Management', () => {
    it('should serialize state', async () => {
      const serialized = await mobilityEngine.serializeState();
      expect(typeof serialized).toBe('string');

      const parsed = JSON.parse(serialized);
      expect(parsed.context).toBeDefined();
      expect(parsed.moveState).toBeDefined();
      expect(parsed.metrics).toBeDefined();
    });

    it('should deserialize state', async () => {
      const originalContext = mobilityEngine.getCurrentContext();
      const serialized = await mobilityEngine.serializeState();

      await mobilityEngine.reset();
      expect(mobilityEngine.getCurrentContext()).toBeNull();

      await mobilityEngine.deserializeState(serialized);

      const restoredContext = mobilityEngine.getCurrentContext();
      expect(restoredContext).not.toBeNull();
      expect(restoredContext?.currentLocation).toEqual(originalContext?.currentLocation);
    });

    it('should emit state-restored event', async () => {
      const serialized = await mobilityEngine.serializeState();

      const restoredPromise = new Promise<MobilityContext>((resolve) => {
        mobilityEngine.once('state-restored', (context: MobilityContext) => {
          resolve(context);
        });
      });

      await mobilityEngine.deserializeState(serialized);
      const context = await restoredPromise;

      expect(context).toBeDefined();
    });
  });

  describe('Metrics', () => {
    it('should track successful moves', async () => {
      const targetLocation: Location = {
        type: 'virtual',
        path: '/test-location',
      };

      await mobilityEngine.moveTo(targetLocation);

      const metrics = mobilityEngine.getMetrics();
      expect(metrics.totalMoves).toBe(1);
      expect(metrics.successfulMoves).toBe(1);
      expect(metrics.failedMoves).toBe(0);
    });

    it('should track failed moves', async () => {
      const invalidLocation: Location = {
        type: 'invalid' as any,
        path: '/invalid',
      };

      try {
        await mobilityEngine.moveTo(invalidLocation);
      } catch (error) {
      }

      const metrics = mobilityEngine.getMetrics();
      expect(metrics.totalMoves).toBe(1);
      expect(metrics.successfulMoves).toBe(0);
      expect(metrics.failedMoves).toBe(1);
    });

    it('should calculate average move time', async () => {
      const targetLocation: Location = {
        type: 'virtual',
        path: '/test-location',
      };

      await mobilityEngine.moveTo(targetLocation);

      const metrics = mobilityEngine.getMetrics();
      expect(metrics.averageMoveTime).toBeGreaterThan(0);
    });
  });

  describe('Reset', () => {
    it('should reset engine state', async () => {
      const targetLocation: Location = {
        type: 'virtual',
        path: '/test-location',
      };

      await mobilityEngine.moveTo(targetLocation);

      await mobilityEngine.reset();

      const metrics = mobilityEngine.getMetrics();
      expect(metrics.totalMoves).toBe(0);
      expect(metrics.successfulMoves).toBe(0);
      expect(metrics.failedMoves).toBe(0);
    });

    it('should emit reset event', async () => {
      const resetPromise = new Promise<MobilityContext>((resolve) => {
        mobilityEngine.once('reset', (context: MobilityContext) => {
          resolve(context);
        });
      });

      await mobilityEngine.reset();
      const context = await resetPromise;

      expect(context).toBeDefined();
    });
  });
});
