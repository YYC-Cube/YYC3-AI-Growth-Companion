/**
 * @file PerformanceOptimizer.ts
 * @description YYC³ AI浮窗系统性能优化器 - 算法复杂度优化与内存管理
 * @module lib/performance
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  rss: number;
  heapUsedPercentage: number;
  timestamp: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  cleanupInterval: number;
  enableCompression: boolean;
  enablePersistence: boolean;
  persistencePath?: string;
}

export interface OptimizationMetrics {
  totalOptimizations: number;
  memorySaved: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  averageMemoryUsage: number;
  peakMemoryUsage: number;
  optimizationTime: number;
}

export interface PerformanceOptimizerConfig {
  enableMemoryOptimization: boolean;
  enableCacheOptimization: boolean;
  enableAlgorithmOptimization: boolean;
  enableDataCompression: boolean;
  enableLazyLoading: boolean;
  maxMemoryUsage: number;
  memoryCheckInterval: number;
  cacheConfig: CacheConfig;
  compressionThreshold: number;
  lazyLoadThreshold: number;
}

export class PerformanceOptimizer extends EventEmitter {
  private static instance: PerformanceOptimizer;
  private config: PerformanceOptimizerConfig;
  private metrics: OptimizationMetrics;
  private memoryMonitor: MemoryMonitor;
  private cacheManager: CacheManager;
  private algorithmOptimizer: AlgorithmOptimizer;
  private dataCompressor: DataCompressor;
  private lazyLoader: LazyLoader;
  private memoryCheckTimer: NodeJS.Timeout | null = null;

  private constructor(config?: Partial<PerformanceOptimizerConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.metrics = this.initializeMetrics();
    this.memoryMonitor = new MemoryMonitor(this.config);
    this.cacheManager = new CacheManager(this.config.cacheConfig);
    this.algorithmOptimizer = new AlgorithmOptimizer(this.config);
    this.dataCompressor = new DataCompressor(this.config);
    this.lazyLoader = new LazyLoader(this.config);
    this.initialize();
  }

  static getInstance(config?: Partial<PerformanceOptimizerConfig>): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(config);
    }
    return PerformanceOptimizer.instance;
  }

  private initializeConfig(config?: Partial<PerformanceOptimizerConfig>): PerformanceOptimizerConfig {
    return {
      enableMemoryOptimization: true,
      enableCacheOptimization: true,
      enableAlgorithmOptimization: true,
      enableDataCompression: true,
      enableLazyLoading: true,
      maxMemoryUsage: 512 * 1024 * 1024,
      memoryCheckInterval: 30000,
      cacheConfig: {
        maxSize: 1000,
        maxAge: 3600000,
        cleanupInterval: 300000,
        enableCompression: true,
        enablePersistence: false,
      },
      compressionThreshold: 1024,
      lazyLoadThreshold: 100,
      ...config,
    };
  }

  private initializeMetrics(): OptimizationMetrics {
    return {
      totalOptimizations: 0,
      memorySaved: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheHitRate: 0,
      averageMemoryUsage: 0,
      peakMemoryUsage: 0,
      optimizationTime: 0,
    };
  }

  private initialize(): void {
    if (this.config.enableMemoryOptimization) {
      this.startMemoryMonitoring();
    }

    this.emit('initialized', this.metrics);
  }

  private startMemoryMonitoring(): void {
    if (this.memoryCheckTimer) {
      clearInterval(this.memoryCheckTimer);
    }

    this.memoryCheckTimer = setInterval(async () => {
      const memoryStats = this.memoryMonitor.getMemoryStats();

      if (memoryStats.heapUsed > this.config.maxMemoryUsage) {
        await this.optimizeMemory();
      }

      this.updateMemoryMetrics(memoryStats);
    }, this.config.memoryCheckInterval);
  }

  public async optimizeMemory(): Promise<void> {
    const startTime = Date.now();

    this.emit('optimization-started', { type: 'memory', timestamp: startTime });

    try {
      const memoryBefore = this.memoryMonitor.getMemoryStats();

      await this.cacheManager.cleanup();
      await this.algorithmOptimizer.optimize();

      const memoryAfter = this.memoryMonitor.getMemoryStats();
      const memorySaved = memoryBefore.heapUsed - memoryAfter.heapUsed;

      this.metrics.totalOptimizations++;
      this.metrics.memorySaved += memorySaved;

      const optimizationTime = Date.now() - startTime;
      this.metrics.optimizationTime = (this.metrics.optimizationTime * (this.metrics.totalOptimizations - 1) + optimizationTime) / this.metrics.totalOptimizations;

      this.emit('optimization-completed', {
        type: 'memory',
        memorySaved,
        optimizationTime,
      });
    } catch (error) {
      this.emit('optimization-failed', { type: 'memory', error });
      throw error;
    }
  }

  private updateMemoryStats(memoryStats: MemoryStats): void {
    this.metrics.averageMemoryUsage = (this.metrics.averageMemoryUsage * (this.metrics.totalOptimizations) + memoryStats.heapUsed) / (this.metrics.totalOptimizations + 1);
    this.metrics.peakMemoryUsage = Math.max(this.metrics.peakMemoryUsage, memoryStats.heapUsed);
  }

  public getCache<T>(key: string): T | undefined {
    const value = this.cacheManager.get<T>(key);

    if (value !== undefined) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    this.updateCacheMetrics();

    return value;
  }

  public setCache<T>(key: string, value: T, ttl?: number): void {
    this.cacheManager.set(key, value, ttl);
  }

  public deleteCache(key: string): void {
    this.cacheManager.delete(key);
  }

  public clearCache(): void {
    this.cacheManager.clear();
  }

  private updateCacheMetrics(): void {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    this.metrics.cacheHitRate = total > 0 ? this.metrics.cacheHits / total : 0;
  }

  public async compressData<T>(data: T): Promise<Uint8Array> {
    if (!this.config.enableDataCompression) {
      throw new Error('Data compression is disabled');
    }

    return await this.dataCompressor.compress(data);
  }

  public async decompressData<T>(compressed: Uint8Array): Promise<T> {
    if (!this.config.enableDataCompression) {
      throw new Error('Data compression is disabled');
    }

    return await this.dataCompressor.decompress<T>(compressed);
  }

  public async lazyLoad<T>(loader: () => Promise<T>, key: string): Promise<T> {
    if (!this.config.enableLazyLoading) {
      return await loader();
    }

    return await this.lazyLoader.load(loader, key);
  }

  public optimizeAlgorithm<T>(algorithm: (data: T[]) => T[], data: T[]): T[] {
    if (!this.config.enableAlgorithmOptimization) {
      return algorithm(data);
    }

    return this.algorithmOptimizer.optimizeAlgorithm(algorithm, data);
  }

  public getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }

  public getMemoryStats(): MemoryStats {
    return this.memoryMonitor.getMemoryStats();
  }

  public getCacheStats(): { size: number; hits: number; misses: number; hitRate: number } {
    return this.cacheManager.getStats();
  }

  public getConfig(): PerformanceOptimizerConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<PerformanceOptimizerConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.cacheManager.clear();
    this.metrics = this.initializeMetrics();
    this.emit('reset', this.metrics);
  }
}

class MemoryMonitor {
  constructor(private config: PerformanceOptimizerConfig) {}

  getMemoryStats(): MemoryStats {
    const memoryUsage = process.memoryUsage();

    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      arrayBuffers: memoryUsage.arrayBuffers,
      rss: memoryUsage.rss,
      heapUsedPercentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      timestamp: Date.now(),
    };
  }

  getMemoryUsagePercentage(): number {
    const stats = this.getMemoryStats();
    return stats.heapUsedPercentage;
  }

  isMemoryUsageHigh(): boolean {
    const stats = this.getMemoryStats();
    return stats.heapUsed > this.config.maxMemoryUsage;
  }
}

class CacheManager<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: CacheConfig) {
    this.config = config;
    this.startCleanupTimer();
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    entry.accessCount++;
    entry.lastAccess = Date.now();

    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const size = this.calculateSize(value);

    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
      size,
    };

    this.cache.set(key, entry);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.maxAge) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < lruTime) {
        lruTime = entry.lastAccess;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 0;
    }
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  getStats(): { size: number; hits: number; misses: number; hitRate: number } {
    let hits = 0;
    let misses = 0;

    for (const entry of this.cache.values()) {
      hits += entry.accessCount;
    }

    const total = hits + misses;
    const hitRate = total > 0 ? hits / total : 0;

    return {
      size: this.cache.size,
      hits,
      misses,
      hitRate,
    };
  }
}

class AlgorithmOptimizer {
  constructor(private config: PerformanceOptimizerConfig) {}

  optimize(): Promise<void> {
    return Promise.resolve();
  }

  optimizeAlgorithm<T>(algorithm: (data: T[]) => T[], data: T[]): T[] {
    if (data.length < this.config.lazyLoadThreshold) {
      return algorithm(data);
    }

    return this.optimizedAlgorithm(algorithm, data);
  }

  private optimizedAlgorithm<T>(algorithm: (data: T[]) => T[], data: T[]): T[] {
    const chunkSize = 1000;
    const chunks: T[][] = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    const results: T[] = [];

    for (const chunk of chunks) {
      const chunkResults = algorithm(chunk);
      results.push(...chunkResults);
    }

    return results;
  }
}

class DataCompressor {
  constructor(private config: PerformanceOptimizerConfig) {}

  async compress<T>(data: T): Promise<Uint8Array> {
    const jsonString = JSON.stringify(data);

    if (jsonString.length < this.config.compressionThreshold) {
      return new TextEncoder().encode(jsonString);
    }

    return this.lzwCompress(jsonString);
  }

  async decompress<T>(compressed: Uint8Array): Promise<T> {
    const jsonString = new TextDecoder().decode(compressed);
    return JSON.parse(jsonString) as T;
  }

  private lzwCompress(input: string): Uint8Array {
    const dictionary: Record<string, number> = {};
    const data = [];
    let dictSize = 256;
    let w = '';

    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }

    for (let i = 0; i < input.length; i++) {
      const c = input.charAt(i);
      const wc = w + c;

      if (dictionary.hasOwnProperty(wc)) {
        w = wc;
      } else {
        data.push(dictionary[w]);
        dictionary[wc] = dictSize++;
        w = c;
      }
    }

    if (w !== '') {
      data.push(dictionary[w]);
    }

    return new Uint8Array(data);
  }
}

class LazyLoader {
  private cache: Map<string, Promise<unknown>> = new Map();
  private config: PerformanceOptimizerConfig;

  constructor(config: PerformanceOptimizerConfig) {
    this.config = config;
  }

  async load<T>(loader: () => Promise<T>, key: string): Promise<T> {
    const cached = this.cache.get(key);

    if (cached) {
      return cached as Promise<T>;
    }

    const promise = loader();
    this.cache.set(key, promise);

    try {
      const result = await promise;
      return result;
    } catch (error) {
      this.cache.delete(key);
      throw error;
    }
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export default PerformanceOptimizer;
