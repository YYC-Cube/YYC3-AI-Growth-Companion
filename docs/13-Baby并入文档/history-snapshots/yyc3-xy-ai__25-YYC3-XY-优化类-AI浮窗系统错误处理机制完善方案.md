# YYC³-XY-AI浮窗系统 - 错误处理机制完善方案

> **YYC³（YanYu Cloud Cube）**
> **标语**：万象归元于云枢 | 深栈智启新纪元
> **英文**：*All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era*

---

**文档版本**：1.0.0
**创建日期**：2026-01-20
**作者**：YYC³团队
**适用范围**：YYC³ AI小语智能成长守护系统 - AI浮窗系统

---

## 📋 目录

- [📜 优化摘要](#-优化摘要)
- [🎯 优化目标](#-优化目标)
- [🔍 现状分析](#-现状分析)
- [🛡️ 错误分类体系](#-错误分类体系)
- [🔧 统一错误处理架构](#-统一错误处理架构)
- [🚨 错误恢复策略](#-错误恢复策略)
- [📊 错误监控与分析](#-错误监控与分析)
- [🎨 用户友好的错误提示](#-用户友好的错误提示)
- [🧪 测试方案](#-测试方案)
- [📊 实施计划](#-实施计划)

---

## 📜 优化摘要

本优化方案针对AI浮窗系统的错误处理机制进行全面完善，建立统一的错误分类、捕获、处理、恢复和监控体系。通过智能化的错误恢复策略和用户友好的错误提示，提升系统的稳定性和用户体验。

---

## 🎯 优化目标

### 主要目标

1. **全面覆盖**：捕获所有可能的错误类型
2. **智能恢复**：自动恢复常见错误
3. **用户友好**：提供清晰、可操作的错误提示
4. **实时监控**：实时监控和分析错误
5. **持续改进**：基于错误数据持续优化系统

### 具体指标

| 指标 | 当前 | 目标 | 优先级 |
|------|------|------|--------|
| 错误捕获率 | 70% | 95%+ | 高 |
| 自动恢复率 | 30% | 70%+ | 高 |
| 错误恢复时间 | N/A | <5s | 高 |
| 用户理解度 | 60% | 90%+ | 中 |
| 错误重复率 | 40% | <20% | 中 |

---

## 🔍 现状分析

### 现有错误处理

```typescript
try {
  await someOperation();
} catch (error) {
  console.error('Error:', error);
  alert('发生错误，请稍后重试');
}
```

### 存在的问题

1. **错误捕获不全面**：
   - 缺少对Promise错误的捕获
   - 缺少对异步错误的捕获
   - 缺少对资源加载错误的捕获

2. **错误分类不清晰**：
   - 所有错误统一处理，没有区分严重程度
   - 缺少错误上下文信息
   - 缺少错误追踪机制

3. **错误恢复能力弱**：
   - 大部分错误需要用户手动处理
   - 缺少自动重试机制
   - 缺少降级方案

4. **用户提示不友好**：
   - 错误信息过于技术化
   - 缺少可操作的建议
   - 缺少错误状态的可视化

5. **监控和分析不足**：
   - 缺少错误日志收集
   - 缺少错误统计分析
   - 缺少错误趋势预测

---

## 🛡️ 错误分类体系

### 错误类型定义

```typescript
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  UI = 'ui',
  DATA = 'data',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  SYSTEM = 'system',
  USER = 'user',
}

export enum ErrorRecoveryType {
  AUTO = 'auto',
  USER_ACTION = 'user_action',
  RESTART = 'restart',
  MANUAL = 'manual',
}

export interface ErrorContext {
  timestamp: Date;
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  userAgent: string;
  url: string;
  deviceInfo: DeviceInfo;
  additionalData?: Record<string, any>;
}

export interface ErrorEntry {
  id: string;
  type: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  stackTrace?: string;
  context: ErrorContext;
  recoveryType: ErrorRecoveryType;
  recoveryAttempts: number;
  recovered: boolean;
  recoveryTime?: number;
  userNotified: boolean;
}

export interface DeviceInfo {
  os: string;
  browser: string;
  screen: { width: number; height: number };
  language: string;
  timezone: string;
}
```

### 自定义错误类

```typescript
export class BaseError extends Error {
  public readonly id: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly recoveryType: ErrorRecoveryType;
  public readonly context: ErrorContext;
  public readonly recoverable: boolean;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    recoveryType: ErrorRecoveryType,
    context: ErrorContext,
    recoverable: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.id = generateErrorId();
    this.category = category;
    this.severity = severity;
    this.recoveryType = recoveryType;
    this.context = context;
    this.recoverable = recoverable;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NetworkError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    statusCode?: number
  ) {
    super(
      message,
      ErrorCategory.NETWORK,
      statusCode && statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      ErrorRecoveryType.AUTO,
      context,
      true
    );
  }
}

export class APIError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    statusCode: number
  ) {
    super(
      message,
      ErrorCategory.API,
      statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      statusCode >= 500 ? ErrorRecoveryType.AUTO : ErrorRecoveryType.USER_ACTION,
      context,
      statusCode < 500
    );
  }
}

export class UIError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    component?: string
  ) {
    super(
      message,
      ErrorCategory.UI,
      ErrorSeverity.LOW,
      ErrorRecoveryType.AUTO,
      { ...context, component },
      true
    );
  }
}

export class DataError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    recoverable: boolean = true
  ) {
    super(
      message,
      ErrorCategory.DATA,
      recoverable ? ErrorSeverity.MEDIUM : ErrorSeverity.HIGH,
      recoverable ? ErrorRecoveryType.AUTO : ErrorRecoveryType.USER_ACTION,
      context,
      recoverable
    );
  }
}

export class PerformanceError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    metric: string,
    threshold: number,
    actual: number
  ) {
    super(
      message,
      ErrorCategory.PERFORMANCE,
      ErrorSeverity.LOW,
      ErrorRecoveryType.AUTO,
      { ...context, additionalData: { metric, threshold, actual } },
      true
    );
  }
}

export class SecurityError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.SECURITY,
      ErrorSeverity.CRITICAL,
      ErrorRecoveryType.MANUAL,
      context,
      false
    );
  }
}

export class SystemError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext,
    recoverable: boolean = false
  ) {
    super(
      message,
      ErrorCategory.SYSTEM,
      recoverable ? ErrorSeverity.HIGH : ErrorSeverity.CRITICAL,
      recoverable ? ErrorRecoveryType.RESTART : ErrorRecoveryType.MANUAL,
      context,
      recoverable
    );
  }
}

export class UserError extends BaseError {
  constructor(
    message: string,
    context: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.USER,
      ErrorSeverity.LOW,
      ErrorRecoveryType.USER_ACTION,
      context,
      true
    );
  }
}

function generateErrorId(): string {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## 🔧 统一错误处理架构

### 错误处理器核心

```typescript
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorEntry[] = [];
  private errorListeners: Set<(error: ErrorEntry) => void> = new Set();
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private maxLogSize: number = 1000;
  private retryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
  };

  private constructor() {
    this.setupGlobalErrorHandlers();
    this.initializeRecoveryStrategies();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleResourceError, true);
  }

  private handleGlobalError = (event: ErrorEvent): void => {
    const error = event.error || new Error(event.message);
    const context = this.createContext();
    const baseError = this.wrapError(error, context);

    this.handleError(baseError);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason || new Error('Unhandled Promise Rejection');
    const context = this.createContext();
    const baseError = this.wrapError(error, context);

    this.handleError(baseError);
  };

  private handleResourceError = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLImageElement || target instanceof HTMLScriptElement) {
      const error = new Error(`Failed to load resource: ${target.src || target.href}`);
      const context = this.createContext();
      const baseError = this.wrapError(error, context);

      this.handleError(baseError);
    }
  };

  private createContext(): ErrorContext {
    return {
      timestamp: new Date(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      deviceInfo: this.getDeviceInfo(),
    };
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      os: this.detectOS(),
      browser: this.detectBrowser(),
      screen: { width: window.screen.width, height: window.screen.height },
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private wrapError(error: unknown, context: ErrorContext): BaseError {
    if (error instanceof BaseError) {
      return error;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('fetch')) {
        return new NetworkError(error.message, context);
      }

      if (message.includes('api') || message.includes('request')) {
        return new APIError(error.message, context, 500);
      }

      if (message.includes('security') || message.includes('unauthorized')) {
        return new SecurityError(error.message, context);
      }

      return new SystemError(error.message, context, true);
    }

    return new SystemError(String(error), context, true);
  }

  public async handleError(error: BaseError): Promise<void> {
    const entry: ErrorEntry = {
      id: error.id,
      type: error.name,
      category: error.category,
      severity: error.severity,
      message: error.message,
      stackTrace: error.stack,
      context: error.context,
      recoveryType: error.recoveryType,
      recoveryAttempts: 0,
      recovered: false,
      userNotified: false,
    };

    this.addToLog(entry);
    this.notifyListeners(entry);

    if (error.recoverable) {
      await this.attemptRecovery(entry);
    }

    if (!entry.recovered) {
      await this.notifyUser(entry);
    }

    await this.reportError(entry);
  }

  private addToLog(entry: ErrorEntry): void {
    this.errorLog.push(entry);

    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    this.persistLog();
  }

  private async persistLog(): Promise<void> {
    try {
      const logs = this.errorLog.slice(-100);
      localStorage.setItem('error_log', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to persist error log:', error);
    }
  }

  private notifyListeners(entry: ErrorEntry): void {
    this.errorListeners.forEach(listener => listener(entry));
  }

  private async attemptRecovery(entry: ErrorEntry): Promise<void> {
    const strategy = this.recoveryStrategies.get(entry.type);

    if (!strategy) {
      return;
    }

    const startTime = Date.now();

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      entry.recoveryAttempts = attempt;

      try {
        const success = await strategy.execute(entry);

        if (success) {
          entry.recovered = true;
          entry.recoveryTime = Date.now() - startTime;
          break;
        }
      } catch (error) {
        console.error(`Recovery attempt ${attempt} failed:`, error);
      }

      if (attempt < this.retryConfig.maxAttempts) {
        const delay = this.calculateRetryDelay(attempt);
        await this.delay(delay);
      }
    }
  }

  private calculateRetryDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async notifyUser(entry: ErrorEntry): Promise<void> {
    entry.userNotified = true;

    const message = this.getUserFriendlyMessage(entry);
    const actions = this.getUserActions(entry);

    showUserNotification({
      type: 'error',
      title: '发生错误',
      message,
      actions,
      duration: entry.severity === ErrorSeverity.CRITICAL ? 0 : 5000,
    });
  }

  private getUserFriendlyMessage(entry: ErrorEntry): string {
    const messages: Record<ErrorCategory, string> = {
      [ErrorCategory.NETWORK]: '网络连接出现问题，请检查您的网络设置',
      [ErrorCategory.API]: '服务暂时不可用，请稍后重试',
      [ErrorCategory.UI]: '界面显示出现问题，正在尝试修复',
      [ErrorCategory.DATA]: '数据加载出现问题，正在重新加载',
      [ErrorCategory.PERFORMANCE]: '系统运行缓慢，正在优化',
      [ErrorCategory.SECURITY]: '检测到安全风险，请联系管理员',
      [ErrorCategory.SYSTEM]: '系统出现问题，正在尝试恢复',
      [ErrorCategory.USER]: '操作无法完成，请检查输入',
    };

    return messages[entry.category] || '发生未知错误';
  }

  private getUserActions(entry: ErrorEntry): UserAction[] {
    const actions: UserAction[] = [];

    if (entry.recoveryType === ErrorRecoveryType.USER_ACTION) {
      actions.push({
        label: '重试',
        action: () => this.retryOperation(entry),
      });
    }

    if (entry.category === ErrorCategory.NETWORK) {
      actions.push({
        label: '检查网络',
        action: () => window.open('chrome://net-internals'),
      });
    }

    if (entry.severity === ErrorSeverity.HIGH || entry.severity === ErrorSeverity.CRITICAL) {
      actions.push({
        label: '联系支持',
        action: () => window.open('mailto:support@yyc3.ai'),
      });
    }

    return actions;
  }

  private async retryOperation(entry: ErrorEntry): Promise<void> {
    entry.recoveryAttempts = 0;
    await this.attemptRecovery(entry);
  }

  private async reportError(entry: ErrorEntry): Promise<void> {
    if (entry.severity === ErrorSeverity.CRITICAL) {
      await this.sendToServer(entry);
    }

    if (entry.severity === ErrorSeverity.HIGH) {
      await this.sendToAnalytics(entry);
    }
  }

  private async sendToServer(entry: ErrorEntry): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to report error to server:', error);
    }
  }

  private async sendToAnalytics(entry: ErrorEntry): Promise<void> {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: entry.message,
          fatal: entry.severity === ErrorSeverity.CRITICAL,
        });
      }
    } catch (error) {
      console.error('Failed to report error to analytics:', error);
    }
  }

  public addListener(listener: (error: ErrorEntry) => void): void {
    this.errorListeners.add(listener);
  }

  public removeListener(listener: (error: ErrorEntry) => void): void {
    this.errorListeners.delete(listener);
  }

  public getErrorLog(): ErrorEntry[] {
    return [...this.errorLog];
  }

  public clearLog(): void {
    this.errorLog = [];
    localStorage.removeItem('error_log');
  }

  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies.set('NetworkError', new NetworkRecoveryStrategy());
    this.recoveryStrategies.set('APIError', new APIRecoveryStrategy());
    this.recoveryStrategies.set('UIError', new UIRecoveryStrategy());
    this.recoveryStrategies.set('DataError', new DataRecoveryStrategy());
    this.recoveryStrategies.set('PerformanceError', new PerformanceRecoveryStrategy());
  }
}

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

interface RecoveryStrategy {
  execute(entry: ErrorEntry): Promise<boolean>;
}

interface UserAction {
  label: string;
  action: () => void;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

function showUserNotification(notification: {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actions: UserAction[];
  duration?: number;
}): void {
  const notificationElement = document.createElement('div');
  notificationElement.className = 'error-notification';
  notificationElement.innerHTML = `
    <div class="error-notification-content">
      <h3>${notification.title}</h3>
      <p>${notification.message}</p>
      <div class="error-notification-actions">
        ${notification.actions.map(action => `
          <button class="error-notification-action">${action.label}</button>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(notificationElement);

  notification.actions.forEach(action => {
    const button = notificationElement.querySelector(`button:contains("${action.label}")`);
    if (button) {
      button.addEventListener('click', () => {
        action.action();
        document.body.removeChild(notificationElement);
      });
    }
  });

  if (notification.duration) {
    setTimeout(() => {
      if (document.body.contains(notificationElement)) {
        document.body.removeChild(notificationElement);
      }
    }, notification.duration);
  }
}
```

---

## 🚨 错误恢复策略

### 网络错误恢复

```typescript
export class NetworkRecoveryStrategy implements RecoveryStrategy {
  public async execute(entry: ErrorEntry): Promise<boolean> {
    try {
      const isOnline = navigator.onLine;

      if (!isOnline) {
        await this.waitForNetwork();
      }

      const response = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-cache',
      });

      return response.ok;
    } catch (error) {
      console.error('Network recovery failed:', error);
      return false;
    }
  }

  private async waitForNetwork(): Promise<void> {
    return new Promise(resolve => {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);

      setTimeout(() => {
        window.removeEventListener('online', handleOnline);
        resolve();
      }, 30000);
    });
  }
}
```

### API错误恢复

```typescript
export class APIRecoveryStrategy implements RecoveryStrategy {
  private cache: Map<string, any> = new Map();

  public async execute(entry: ErrorEntry): Promise<boolean> {
    const cacheKey = this.getCacheKey(entry);

    if (this.cache.has(cacheKey)) {
      return true;
    }

    try {
      const response = await this.retryRequest(entry);

      if (response.ok) {
        const data = await response.json();
        this.cache.set(cacheKey, data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('API recovery failed:', error);
      return false;
    }
  }

  private getCacheKey(entry: ErrorEntry): string {
    return `${entry.context.url}_${entry.context.action}`;
  }

  private async retryRequest(entry: ErrorEntry): Promise<Response> {
    const url = entry.context.url;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Retry-Count': entry.recoveryAttempts.toString(),
      },
    };

    return await fetch(url, options);
  }
}
```

### UI错误恢复

```typescript
export class UIRecoveryStrategy implements RecoveryStrategy {
  public async execute(entry: ErrorEntry): Promise<boolean> {
    try {
      if (entry.context.component) {
        await this.reloadComponent(entry.context.component);
      } else {
        await this.reloadPage();
      }

      return true;
    } catch (error) {
      console.error('UI recovery failed:', error);
      return false;
    }
  }

  private async reloadComponent(componentName: string): Promise<void> {
    const event = new CustomEvent('reload-component', {
      detail: { componentName },
    });

    window.dispatchEvent(event);
  }

  private async reloadPage(): Promise<void> {
    window.location.reload();
  }
}
```

### 数据错误恢复

```typescript
export class DataRecoveryStrategy implements RecoveryStrategy {
  public async execute(entry: ErrorEntry): Promise<boolean> {
    try {
      const backupData = await this.loadBackup();

      if (backupData) {
        await this.restoreData(backupData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Data recovery failed:', error);
      return false;
    }
  }

  private async loadBackup(): Promise<any> {
    try {
      const backup = localStorage.getItem('data_backup');
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      return null;
    }
  }

  private async restoreData(data: any): Promise<void> {
    const event = new CustomEvent('restore-data', { detail: data });
    window.dispatchEvent(event);
  }
}
```

### 性能错误恢复

```typescript
export class PerformanceRecoveryStrategy implements RecoveryStrategy {
  public async execute(entry: ErrorEntry): Promise<boolean> {
    try {
      await this.clearCache();
      await this.optimizeResources();
      return true;
    } catch (error) {
      console.error('Performance recovery failed:', error);
      return false;
    }
  }

  private async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    localStorage.clear();
    sessionStorage.clear();
  }

  private async optimizeResources(): Promise<void> {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (img.loading !== 'lazy') {
        img.loading = 'lazy';
      }
    });
  }
}
```

---

## 📊 错误监控与分析

### 错误监控仪表板

```typescript
export class ErrorMonitor {
  private errorHandler: ErrorHandler;
  private metrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByCategory: {},
    errorsBySeverity: {},
    errorsByType: {},
    recoveryRate: 0,
    averageRecoveryTime: 0,
  };

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
    this.setupMonitoring();
  }

  private setupMonitoring(): void {
    this.errorHandler.addListener(this.updateMetrics.bind(this));
    setInterval(this.analyzeTrends.bind(this), 60000);
  }

  private updateMetrics(entry: ErrorEntry): void {
    this.metrics.totalErrors++;

    this.metrics.errorsByCategory[entry.category] =
      (this.metrics.errorsByCategory[entry.category] || 0) + 1;

    this.metrics.errorsBySeverity[entry.severity] =
      (this.metrics.errorsBySeverity[entry.severity] || 0) + 1;

    this.metrics.errorsByType[entry.type] =
      (this.metrics.errorsByType[entry.type] || 0) + 1;

    if (entry.recovered) {
      const recoveredErrors = Object.values(this.metrics.errorsByCategory).reduce((a, b) => a + b, 0);
      this.metrics.recoveryRate = recoveredErrors / this.metrics.totalErrors;

      if (entry.recoveryTime) {
        this.metrics.averageRecoveryTime =
          (this.metrics.averageRecoveryTime + entry.recoveryTime) / 2;
      }
    }
  }

  private analyzeTrends(): void {
    const recentErrors = this.errorHandler.getErrorLog().slice(-100);
    const errorPatterns = this.detectPatterns(recentErrors);

    if (errorPatterns.length > 0) {
      this.alertPatterns(errorPatterns);
    }
  }

  private detectPatterns(errors: ErrorEntry[]): ErrorPattern[] {
    const patterns: ErrorPattern[] = [];

    const typeFrequency = this.calculateFrequency(errors, 'type');
    const categoryFrequency = this.calculateFrequency(errors, 'category');

    for (const [type, count] of Object.entries(typeFrequency)) {
      if (count > 5) {
        patterns.push({
          type: 'recurring',
          description: `Error type "${type}" occurred ${count} times`,
          severity: 'medium',
          recommendation: 'Investigate root cause and implement permanent fix',
        });
      }
    }

    for (const [category, count] of Object.entries(categoryFrequency)) {
      if (count > 10) {
        patterns.push({
          type: 'category-spike',
          description: `Error category "${category}" spike detected`,
          severity: 'high',
          recommendation: 'Check system health and resource availability',
        });
      }
    }

    return patterns;
  }

  private calculateFrequency(errors: ErrorEntry[], field: keyof ErrorEntry): Record<string, number> {
    const frequency: Record<string, number> = {};

    errors.forEach(error => {
      const value = String(error[field]);
      frequency[value] = (frequency[value] || 0) + 1;
    });

    return frequency;
  }

  private alertPatterns(patterns: ErrorPattern[]): void {
    patterns.forEach(pattern => {
      console.warn(`Error Pattern Detected: ${pattern.description}`);
    });
  }

  public getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorsByType: Record<string, number>;
  recoveryRate: number;
  averageRecoveryTime: number;
}

interface ErrorPattern {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}
```

---

## 🎨 用户友好的错误提示

### 错误提示组件

```typescript
import React from 'react';
import { AlertTriangle, RefreshCw, X, HelpCircle } from 'lucide-react';

interface ErrorNotificationProps {
  error: ErrorEntry;
  onRetry?: () => void;
  onDismiss?: () => void;
  onContactSupport?: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onRetry,
  onDismiss,
  onContactSupport,
}) => {
  const severityColors = {
    [ErrorSeverity.LOW]: 'bg-blue-50 border-blue-200 text-blue-800',
    [ErrorSeverity.MEDIUM]: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    [ErrorSeverity.HIGH]: 'bg-orange-50 border-orange-200 text-orange-800',
    [ErrorSeverity.CRITICAL]: 'bg-red-50 border-red-200 text-red-800',
  };

  const severityIcons = {
    [ErrorSeverity.LOW]: <AlertTriangle size={20} />,
    [ErrorSeverity.MEDIUM]: <AlertTriangle size={20} />,
    [ErrorSeverity.HIGH]: <AlertTriangle size={20} />,
    [ErrorSeverity.CRITICAL]: <AlertTriangle size={20} />,
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border shadow-lg ${severityColors[error.severity]} z-50`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {severityIcons[error.severity]}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold mb-1">发生错误</h3>
          <p className="text-sm mb-2">{getUserFriendlyMessage(error)}</p>

          {error.recoveryAttempts > 0 && (
            <p className="text-xs mb-2">
              已尝试恢复 {error.recoveryAttempts} 次
              {error.recovered ? ' - 已成功恢复' : ' - 仍在尝试'}
            </p>
          )}

          <div className="flex space-x-2">
            {error.recoverable && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white border rounded-md hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                <span className="text-sm">重试</span>
              </button>
            )}

            {error.severity === ErrorSeverity.HIGH && onContactSupport && (
              <button
                onClick={onContactSupport}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white border rounded-md hover:bg-gray-50 transition-colors"
              >
                <HelpCircle size={16} />
                <span className="text-sm">联系支持</span>
              </button>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white border rounded-md hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                <span className="text-sm">关闭</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getUserFriendlyMessage(error: ErrorEntry): string {
  const messages: Record<ErrorCategory, string> = {
    [ErrorCategory.NETWORK]: '网络连接出现问题，请检查您的网络设置',
    [ErrorCategory.API]: '服务暂时不可用，请稍后重试',
    [ErrorCategory.UI]: '界面显示出现问题，正在尝试修复',
    [ErrorCategory.DATA]: '数据加载出现问题，正在重新加载',
    [ErrorCategory.PERFORMANCE]: '系统运行缓慢，正在优化',
    [ErrorCategory.SECURITY]: '检测到安全风险，请联系管理员',
    [ErrorCategory.SYSTEM]: '系统出现问题，正在尝试恢复',
    [ErrorCategory.USER]: '操作无法完成，请检查输入',
  };

  return messages[error.category] || '发生未知错误';
}
```

---

## 🧪 测试方案

### 错误处理测试

```typescript
describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearLog();
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const error = new NetworkError('Network error', errorHandler.createContext());
      await errorHandler.handleError(error);

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0].category).toBe(ErrorCategory.NETWORK);
    });

    it('should handle API errors', async () => {
      const error = new APIError('API error', errorHandler.createContext(), 500);
      await errorHandler.handleError(error);

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0].category).toBe(ErrorCategory.API);
    });

    it('should attempt recovery for recoverable errors', async () => {
      const error = new NetworkError('Network error', errorHandler.createContext());
      await errorHandler.handleError(error);

      const log = errorHandler.getErrorLog();
      expect(log[0].recoveryAttempts).toBeGreaterThan(0);
    });
  });

  describe('Recovery Strategies', () => {
    it('should recover from network errors', async () => {
      const strategy = new NetworkRecoveryStrategy();
      const entry: ErrorEntry = {
        id: 'test',
        type: 'NetworkError',
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        message: 'Network error',
        context: errorHandler.createContext(),
        recoveryType: ErrorRecoveryType.AUTO,
        recoveryAttempts: 0,
        recovered: false,
        userNotified: false,
      };

      const result = await strategy.execute(entry);
      expect(result).toBeDefined();
    });
  });
});
```

---

## 📊 实施计划

### 第一阶段：错误分类和捕获（1周）

**任务**：
1. 定义错误类型和分类
2. 实现自定义错误类
3. 设置全局错误处理器
4. 测试错误捕获

**验收标准**：
- 所有错误类型定义完成
- 全局错误捕获正常工作
- 测试覆盖率>90%

### 第二阶段：错误恢复策略（1周）

**任务**：
1. 实现各种恢复策略
2. 实现重试机制
3. 实现降级方案
4. 测试恢复功能

**验收标准**：
- 所有恢复策略实现完成
- 自动恢复率>70%
- 测试覆盖率>90%

### 第三阶段：错误监控和分析（1周）

**任务**：
1. 实现错误监控仪表板
2. 实现错误趋势分析
3. 实现错误报告功能
4. 测试监控功能

**验收标准**：
- 监控仪表板正常工作
- 错误趋势分析准确
- 错误报告功能正常

### 第四阶段：用户友好的错误提示（1周）

**任务**：
1. 实现错误提示组件
2. 优化错误消息
3. 实现用户操作按钮
4. 测试用户体验

**验收标准**：
- 错误提示组件美观易用
- 错误消息清晰易懂
- 用户操作流畅

---

## 📞 联系信息

- **项目主页**: <https://github.com/YY-Nexus/yyc3-xy-ai>
- **问题反馈**: <https://github.com/YY-Nexus/yyc3-xy-ai/issues>
- **邮箱**: <admin@0379.email>
- **官网**: <https://yyc3.ai>

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！**

Made with ❤️ by YYC³ Team

**言启象限 | 语枢未来**
**万象归元于云枢 | 深栈智启新纪元**

</div>
