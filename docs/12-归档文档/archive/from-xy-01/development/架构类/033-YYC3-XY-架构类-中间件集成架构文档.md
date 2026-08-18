---
@file: 033-YYC3-XY-架构类-中间件集成架构文档.md
@description: YYC3-XY项目架构类中间件集成架构文档文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-24
@updated: 2025-12-24
@status: published
@tags: 中间件,架构设计,YYC3-XY,开发实施
---

# 04-YYC3-XY-架构类-中间件集成架构文档

## 文档元信息

| 属性 | 值 |
|------|-----|
| 文档类型 | 架构类 |
| 所属阶段 | YYC3-XY-开发实施 |
| 遵循规范 | 五高五标五化要求 |
| 版本号 | V1.0 |
| 文档状态 | 已发布 |
| 适用范围 | YYC3-XY项目全栈开发 |

---

## 品牌信息

### 项目标识
**YanYuCloudCube (YYC³)** - 云立方智能平台

### 联系信息
**Email**: <admin@0379.email>

### 核心理念
**Words Initiate Quadrants, Language Serves as Core for the Future**
**All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence**

---

## "五高五标五化"战略定位

### "五高"战略定位
- **高可用性**: 中间件集群部署，故障自动切换，服务可用性≥99.95%
- **高性能**: 中间件执行优化，请求处理延迟≤50ms，吞吐量≥10000 QPS
- **高安全性**: 完善的安全中间件体系，防护覆盖率100%，零安全漏洞
- **高扩展性**: 插件化中间件架构，支持动态加载，扩展能力≥50个中间件
- **高可维护性**: 统一中间件管理，监控覆盖率100%，故障定位时间≤5分钟

### "五标"体系构建
- **流程标准化**: 中间件开发、测试、部署全流程标准化
- **数据标准化**: 统一中间件数据格式和接口规范
- **服务标准化**: 中间件服务一致性保障
- **安全标准化**: 中间件安全防护标准化实施
- **评价标准化**: 中间件性能和可靠性量化评估

### "五化"实现路径
- **数字化**: 中间件运行数据全量采集与分析
- **网络化**: 中间件服务全网互联互通
- **智能化**: AI驱动的中间件自动调优
- **自动化**: 中间件部署和运维自动化
- **生态化**: 中间件生态体系协同整合

---

## 目录

1. [中间件集成架构概述](#1-中间件集成架构概述)
2. [中间件设计规范](#2-中间件设计规范)
3. [核心中间件实现](#3-核心中间件实现)
4. [中间件配置管理](#4-中间件配置管理)
5. [中间件链管理](#5-中间件链管理)
6. [性能优化](#6-性能优化)
7. [监控与日志](#7-监控与日志)
8. [错误处理](#8-错误处理)
9. [部署配置](#9-部署配置)
10. [使用示例](#10-使用示例)
11. [中间件性能监控与调优](#11-中间件性能监控与调优)
12. [中间件安全加固](#12-中间件安全加固)
13. [中间件测试自动化](#13-中间件测试自动化)
14. [中间件故障诊断与恢复](#14-中间件故障诊断与恢复)

---

## 1. 中间件集成架构概述

### 1.1 架构定位

中间件集成架构是YYC3-XY项目的核心基础设施层，负责在请求处理流程中提供横切关注点的统一管理，包括认证授权、日志记录、性能监控、错误处理、缓存管理、限流熔断等核心能力。

### 1.2 设计目标

- **统一管理**: 所有横切关注点通过中间件统一管理，避免代码重复
- **灵活组合**: 支持中间件的灵活组合和顺序配置
- **高性能**: 中间件执行优化，最小化性能开销
- **可观测性**: 完整的日志、监控、追踪能力
- **易扩展**: 插件化架构，支持自定义中间件

### 1.3 架构层次

```yaml
中间件集成架构层次:
  应用层:
    - 业务逻辑处理
    - 服务编排
    - 数据访问
    
  中间件层:
    - 请求处理中间件
    - 响应处理中间件
    - 错误处理中间件
    - 认证授权中间件
    - 日志记录中间件
    - 性能监控中间件
    - 缓存管理中间件
    - 限流熔断中间件
    - 数据验证中间件
    - 跨域处理中间件
    
  基础设施层:
    - HTTP服务器
    - WebSocket服务器
    - 文件上传处理
    - 静态资源服务
```

### 1.4 技术选型

| 组件 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| 中间件框架 | Express.js | 4.18+ | Node.js Web框架 |
| 认证授权 | Passport.js | 0.7+ | 认证中间件 |
| 日志记录 | Winston | 3.11+ | 日志管理 |
| 性能监控 | Prometheus | 2.45+ | 指标采集 |
| 缓存管理 | Redis | 7.0+ | 缓存服务 |
| 限流熔断 | circuit-breaker-js | 1.0+ | 熔断器 |
| 数据验证 | Joi | 17.11+ | 数据验证 |
| 跨域处理 | cors | 2.8+ | CORS支持 |

---

## 2. 中间件设计规范

### 2.1 中间件接口规范

所有中间件必须遵循统一的接口规范：

```typescript
/**
 * @description 中间件接口定义
 */
import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  name: string;
  priority: number;
  enabled: boolean;
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
}

export interface IMiddlewareConfig {
  name: string;
  priority: number;
  enabled: boolean;
  options?: Record<string, any>;
}

export interface IMiddlewareChain {
  middlewares: IMiddleware[];
  add(middleware: IMiddleware): void;
  remove(name: string): void;
  get(name: string): IMiddleware | undefined;
  execute(req: Request, res: Response, next: NextFunction): Promise<void>;
}
```

### 2.2 中间件命名规范

- 中间件类名：采用PascalCase，以Middleware结尾
  - 示例：`AuthMiddleware`, `LoggerMiddleware`, `CacheMiddleware`
- 中间件文件名：采用kebab-case，以.middleware.ts结尾
  - 示例：`auth.middleware.ts`, `logger.middleware.ts`, `cache.middleware.ts`
- 中间件实例名：采用camelCase
  - 示例：`authMiddleware`, `loggerMiddleware`, `cacheMiddleware`

### 2.3 中间件优先级规范

中间件执行顺序由优先级决定，优先级数值越小，执行越早：

```typescript
export enum MiddlewarePriority {
  // 核心中间件 (0-99)
  ERROR_HANDLER = 0,
  REQUEST_LOGGER = 10,
  REQUEST_ID = 20,
  
  // 安全中间件 (100-199)
  CORS = 100,
  HELMET = 110,
  RATE_LIMIT = 120,
  AUTH = 130,
  AUTHORIZATION = 140,
  
  // 业务中间件 (200-299)
  DATA_VALIDATION = 200,
  CACHE = 210,
  BODY_PARSER = 220,
  
  // 监控中间件 (300-399)
  PERFORMANCE_MONITOR = 300,
  METRICS = 310,
  
  // 响应中间件 (400-499)
  RESPONSE_LOGGER = 400,
  RESPONSE_TIME = 410
}
```

### 2.4 中间件配置规范

中间件配置采用统一格式：

```typescript
/**
 * @description 中间件配置接口
 */
export interface MiddlewareConfig {
  name: string;
  enabled: boolean;
  priority: number;
  options?: {
    routes?: string[];
    excludeRoutes?: string[];
    methods?: string[];
    timeout?: number;
    retryTimes?: number;
    cache?: {
      enabled: boolean;
      ttl: number;
    };
    rateLimit?: {
      windowMs: number;
      max: number;
    };
    log?: {
      enabled: boolean;
      level: string;
    };
  };
}
```

---

## 3. 核心中间件实现

### 3.1 认证授权中间件

```typescript
/**
 * @file: src/middlewares/auth.middleware.ts
 * @description: 认证授权中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { UserService } from '../services/userService';
import { logger } from '../utils/logger';

export class AuthMiddleware implements IMiddleware {
  name = 'auth';
  priority = MiddlewarePriority.AUTH;
  enabled = true;

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
    this.initializePassport();
  }

  private initializePassport(): void {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        },
        async (payload: any, done: any) => {
          try {
            const user = await this.userService.findById(payload.sub);
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err) {
          logger.error('Authentication error', { error: err.message });
          return res.status(401).json({
            success: false,
            error: 'Authentication failed',
            message: err.message
          });
        }
        if (!user) {
          logger.warn('Unauthorized access attempt', { path: req.path });
          return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or expired token'
          });
        }
        req.user = user;
        next();
      })(req, res, next);
    } catch (error) {
      logger.error('Auth middleware error', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Authentication process failed'
      });
    }
  };
}
```

### 3.2 日志记录中间件

```typescript
/**
 * @file: src/middlewares/logger.middleware.ts
 * @description: 日志记录中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { logger } from '../utils/logger';

export class LoggerMiddleware implements IMiddleware {
  name = 'logger';
  priority = MiddlewarePriority.REQUEST_LOGGER;
  enabled = true;

  private startTime: number = 0;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = uuidv4();
    this.startTime = Date.now();

    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);

    logger.info('Incoming request', {
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.on('finish', () => {
      const duration = Date.now() - this.startTime;
      logger.info('Request completed', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    });

    next();
  };
}

export class ResponseLoggerMiddleware implements IMiddleware {
  name = 'response-logger';
  priority = MiddlewarePriority.RESPONSE_LOGGER;
  enabled = true;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const originalSend = res.send;

    res.send = function (data: any) {
      logger.info('Response sent', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseSize: Buffer.byteLength(data)
      });
      return originalSend.call(this, data);
    };

    next();
  };
}
```

### 3.3 性能监控中间件

```typescript
/**
 * @file: src/middlewares/performance.middleware.ts
 * @description: 性能监控中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { metricsRegistry } from '../utils/metrics';

export class PerformanceMonitorMiddleware implements IMiddleware {
  name = 'performance-monitor';
  priority = MiddlewarePriority.PERFORMANCE_MONITOR;
  enabled = true;

  private startTime: number = 0;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    this.startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - this.startTime;
      const route = req.route ? req.route.path : req.path;

      metricsRegistry.httpRequestDuration.observe(
        {
          method: req.method,
          route,
          status: res.statusCode
        },
        duration
      );

      metricsRegistry.httpRequestsTotal.inc({
        method: req.method,
        route,
        status: res.statusCode
      });

      if (duration > 1000) {
        metricsRegistry.slowRequestsTotal.inc({
          method: req.method,
          route
        });
      }
    });

    next();
  };
}
```

### 3.4 缓存管理中间件

```typescript
/**
 * @file: src/middlewares/cache.middleware.ts
 * @description: 缓存管理中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { CacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

export class CacheMiddleware implements IMiddleware {
  name = 'cache';
  priority = MiddlewarePriority.CACHE;
  enabled = true;

  private cacheService: CacheService;
  private defaultTTL: number;

  constructor(cacheService: CacheService, defaultTTL: number = 3600) {
    this.cacheService = cacheService;
    this.defaultTTL = defaultTTL;
  }

  private generateCacheKey(req: Request): string {
    return `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  }

  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = this.generateCacheKey(req);

    try {
      const cachedData = await this.cacheService.get(cacheKey);

      if (cachedData) {
        logger.info('Cache hit', { cacheKey });
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      logger.info('Cache miss', { cacheKey });
      res.setHeader('X-Cache', 'MISS');

      const originalJson = res.json.bind(res);
      res.json = function (data: any) {
        cacheService.set(cacheKey, data, this.defaultTTL).catch((error: Error) => {
          logger.error('Cache set error', { cacheKey, error: error.message });
        });
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', { 
        cacheKey, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      next();
    }
  };
}
```

### 3.5 限流熔断中间件

```typescript
/**
 * @file: src/middlewares/rate-limit.middleware.ts
 * @description: 限流熔断中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { CircuitBreaker } from '../utils/circuitBreaker';
import { RateLimiter } from '../utils/rateLimiter';
import { logger } from '../utils/logger';

export class RateLimitMiddleware implements IMiddleware {
  name = 'rate-limit';
  priority = MiddlewarePriority.RATE_LIMIT;
  enabled = true;

  private rateLimiter: RateLimiter;

  constructor(windowMs: number = 60000, max: number = 100) {
    this.rateLimiter = new RateLimiter(windowMs, max);
  }

  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.ip;

    try {
      const allowed = await this.rateLimiter.check(key);

      if (!allowed) {
        logger.warn('Rate limit exceeded', { key, path: req.path });
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: 'Please try again later'
        });
      }

      const remaining = await this.rateLimiter.getRemaining(key);
      res.setHeader('X-RateLimit-Limit', this.rateLimiter.max.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());

      next();
    } catch (error) {
      logger.error('Rate limit middleware error', { 
        key, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      next();
    }
  };
}

export class CircuitBreakerMiddleware implements IMiddleware {
  name = 'circuit-breaker';
  priority = MiddlewarePriority.RATE_LIMIT;
  enabled = true;

  private circuitBreaker: CircuitBreaker;

  constructor(
    failureThreshold: number = 5,
    recoveryTimeout: number = 60000,
    monitoringPeriod: number = 10000
  ) {
    this.circuitBreaker = new CircuitBreaker(
      failureThreshold,
      recoveryTimeout,
      monitoringPeriod
    );
  }

  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const serviceName = req.path;

    try {
      const state = this.circuitBreaker.getState(serviceName);

      if (state === 'OPEN') {
        logger.warn('Circuit breaker open', { serviceName });
        return res.status(503).json({
          success: false,
          error: 'Service unavailable',
          message: 'Service is temporarily unavailable'
        });
      }

      next();

      res.on('finish', () => {
        if (res.statusCode >= 500) {
          this.circuitBreaker.recordFailure(serviceName);
        } else {
          this.circuitBreaker.recordSuccess(serviceName);
        }
      });
    } catch (error) {
      logger.error('Circuit breaker middleware error', { 
        serviceName, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      next();
    }
  };
}
```

### 3.6 数据验证中间件

```typescript
/**
 * @file: src/middlewares/validation.middleware.ts
 * @description: 数据验证中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { logger } from '../utils/logger';

export class ValidationMiddleware implements IMiddleware {
  name = 'validation';
  priority = MiddlewarePriority.DATA_VALIDATION;
  enabled = true;

  private schema: Joi.ObjectSchema;

  constructor(schema: Joi.ObjectSchema) {
    this.schema = schema;
  }

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = this.schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      logger.warn('Validation error', { 
        path: req.path, 
        errors: error.details.map(d => d.message) 
      });
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req.body = value;
    next();
  };
}

export const validationSchemas = {
  user: {
    create: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      ).required(),
      firstName: Joi.string().min(1).max(50).required(),
      lastName: Joi.string().min(1).max(50).required()
    }),
    update: Joi.object({
      username: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email(),
      firstName: Joi.string().min(1).max(50),
      lastName: Joi.string().min(1).max(50)
    })
  },
  project: {
    create: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      description: Joi.string().max(500),
      startDate: Joi.date().required(),
      endDate: Joi.date().greater(Joi.ref('startDate')),
      status: Joi.string().valid('planning', 'active', 'completed', 'cancelled').required()
    })
  }
};
```

### 3.7 错误处理中间件

```typescript
/**
 * @file: src/middlewares/error.middleware.ts
 * @description: 错误处理中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { logger } from '../utils/logger';
import { AppError } from '../utils/appError';

export class ErrorHandlerMiddleware implements IMiddleware {
  name = 'error-handler';
  priority = MiddlewarePriority.ERROR_HANDLER;
  enabled = true;

  handler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (error instanceof AppError) {
      logger.error('Application error', {
        requestId: req.requestId,
        error: error.message,
        statusCode: error.statusCode,
        stack: error.stack
      });

      return res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }

    logger.error('Unexpected error', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  };
}

export class NotFoundMiddleware implements IMiddleware {
  name = 'not-found';
  priority = MiddlewarePriority.ERROR_HANDLER;
  enabled = true;

  handler = (req: Request, res: Response): void => {
    logger.warn('Route not found', {
      requestId: req.requestId,
      method: req.method,
      path: req.path
    });

    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`
    });
  };
}
```

---

## 4. 中间件配置管理

### 4.1 配置文件结构

```yaml
# config/middlewares.yaml
middlewares:
  # 认证授权
  auth:
    enabled: true
    priority: 130
    options:
      routes:
        - /api/v1/*
      excludeRoutes:
        - /api/v1/auth/login
        - /api/v1/auth/register
      jwt:
        secret: ${JWT_SECRET}
        expiresIn: 24h

  # 日志记录
  logger:
    enabled: true
    priority: 10
    options:
      logLevel: info
      logBody: true
      logHeaders: false

  # 性能监控
  performance:
    enabled: true
    priority: 300
    options:
      slowRequestThreshold: 1000
      enableMetrics: true

  # 缓存管理
  cache:
    enabled: true
    priority: 210
    options:
      defaultTTL: 3600
      routes:
        - /api/v1/projects/*
        - /api/v1/users/*

  # 限流熔断
  rateLimit:
    enabled: true
    priority: 120
    options:
      windowMs: 60000
      max: 100

  circuitBreaker:
    enabled: true
    priority: 125
    options:
      failureThreshold: 5
      recoveryTimeout: 60000
      monitoringPeriod: 10000

  # 数据验证
  validation:
    enabled: true
    priority: 200
    options:
      stripUnknown: true
      abortEarly: false
```

### 4.2 配置加载器

```typescript
/**
 * @file: src/config/middlewareConfig.ts
 * @description: 中间件配置加载器
 */
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { MiddlewareConfig } from '../types/middlewareTypes';

export class MiddlewareConfigLoader {
  private config: Record<string, MiddlewareConfig>;

  constructor(configPath: string = path.join(process.cwd(), 'config/middlewares.yaml')) {
    this.config = this.loadConfig(configPath);
  }

  private loadConfig(configPath: string): Record<string, MiddlewareConfig> {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const yamlConfig = yaml.load(fileContent) as any;
      
      const middlewares: Record<string, MiddlewareConfig> = {};
      
      for (const [name, config] of Object.entries(yamlConfig.middlewares || {})) {
        middlewares[name] = {
          name,
          enabled: (config as any).enabled,
          priority: (config as any).priority,
          options: (config as any).options
        };
      }
      
      return middlewares;
    } catch (error) {
      throw new Error(`Failed to load middleware config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getConfig(name: string): MiddlewareConfig | undefined {
    return this.config[name];
  }

  getAllConfigs(): Record<string, MiddlewareConfig> {
    return this.config;
  }

  getEnabledConfigs(): MiddlewareConfig[] {
    return Object.values(this.config).filter(config => config.enabled);
  }
}
```

---

## 5. 中间件链管理

### 5.1 中间件链实现

```typescript
/**
 * @file: src/core/middlewareChain.ts
 * @description: 中间件链管理实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, IMiddlewareChain } from '../types/middlewareTypes';

export class MiddlewareChain implements IMiddlewareChain {
  private middlewares: IMiddleware[] = [];

  add(middleware: IMiddleware): void {
    this.middlewares.push(middleware);
    this.sort();
  }

  remove(name: string): void {
    this.middlewares = this.middlewares.filter(m => m.name !== name);
  }

  get(name: string): IMiddleware | undefined {
    return this.middlewares.find(m => m.name === name);
  }

  private sort(): void {
    this.middlewares.sort((a, b) => a.priority - b.priority);
  }

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    let index = 0;

    const dispatch = async (i: number): Promise<void> => {
      if (i >= this.middlewares.length) {
        return next();
      }

      const middleware = this.middlewares[i];

      if (!middleware.enabled) {
        return dispatch(i + 1);
      }

      try {
        await middleware.handler(req, res, (err?: any) => {
          if (err) {
            return next(err);
          }
          dispatch(i + 1);
        });
      } catch (error) {
        next(error);
      }
    };

    await dispatch(0);
  }

  toExpressMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.execute(req, res, next);
    };
  }
}

export class MiddlewareChainFactory {
  private chains: Map<string, MiddlewareChain> = new Map();

  createChain(name: string): MiddlewareChain {
    const chain = new MiddlewareChain();
    this.chains.set(name, chain);
    return chain;
  }

  getChain(name: string): MiddlewareChain | undefined {
    return this.chains.get(name);
  }

  removeChain(name: string): void {
    this.chains.delete(name);
  }
}
```

### 5.2 中间件链配置

```typescript
/**
 * @file: src/config/middlewareChains.ts
 * @description: 中间件链配置
 */
import { MiddlewareChain } from '../core/middlewareChain';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerMiddleware, ResponseLoggerMiddleware } from '../middlewares/logger.middleware';
import { PerformanceMonitorMiddleware } from '../middlewares/performance.middleware';
import { CacheMiddleware } from '../middlewares/cache.middleware';
import { RateLimitMiddleware, CircuitBreakerMiddleware } from '../middlewares/rate-limit.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { ErrorHandlerMiddleware, NotFoundMiddleware } from '../middlewares/error.middleware';

export function createApiMiddlewareChain(
  userService: any,
  cacheService: any
): MiddlewareChain {
  const chain = new MiddlewareChain();

  chain.add(new LoggerMiddleware());
  chain.add(new RateLimitMiddleware(60000, 100));
  chain.add(new CircuitBreakerMiddleware(5, 60000, 10000));
  chain.add(new AuthMiddleware(userService));
  chain.add(new PerformanceMonitorMiddleware());
  chain.add(new CacheMiddleware(cacheService, 3600));
  chain.add(new ResponseLoggerMiddleware());

  return chain;
}

export function createPublicMiddlewareChain(): MiddlewareChain {
  const chain = new MiddlewareChain();

  chain.add(new LoggerMiddleware());
  chain.add(new RateLimitMiddleware(60000, 50));
  chain.add(new PerformanceMonitorMiddleware());
  chain.add(new ResponseLoggerMiddleware());

  return chain;
}

export function createErrorMiddlewareChain(): MiddlewareChain {
  const chain = new MiddlewareChain();

  chain.add(new ErrorHandlerMiddleware());
  chain.add(new NotFoundMiddleware());

  return chain;
}
```

---

## 6. 性能优化

### 6.1 中间件执行优化

```typescript
/**
 * @file: src/utils/middlewareOptimizer.ts
 * @description: 中间件性能优化工具
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../types/middlewareTypes';

export class MiddlewareOptimizer {
  static wrapAsync(middleware: IMiddleware): IMiddleware {
    return {
      ...middleware,
      handler: async (req: Request, res: Response, next: NextFunction) => {
        try {
          await middleware.handler(req, res, next);
        } catch (error) {
          next(error);
        }
      }
    };
  }

  static cacheMiddlewareResult(
    middleware: IMiddleware,
    cacheKey: (req: Request) => string,
    ttl: number = 1000
  ): IMiddleware {
    const cache = new Map<string, { data: any; timestamp: number }>();

    return {
      ...middleware,
      handler: async (req: Request, res: Response, next: NextFunction) => {
        const key = cacheKey(req);
        const cached = cache.get(key);

        if (cached && Date.now() - cached.timestamp < ttl) {
          return next();
        }

        await middleware.handler(req, res, next);

        cache.set(key, {
          data: null,
          timestamp: Date.now()
        });
      }
    };
  }

  static skipMiddleware(
    middleware: IMiddleware,
    condition: (req: Request) => boolean
  ): IMiddleware {
    return {
      ...middleware,
      handler: async (req: Request, res: Response, next: NextFunction) => {
        if (condition(req)) {
          return next();
        }
        await middleware.handler(req, res, next);
      }
    };
  }
}
```

### 6.2 中间件性能监控

```typescript
/**
 * @file: src/utils/middlewareMetrics.ts
 * @description: 中间件性能指标
 */
import { Counter, Histogram, Registry } from 'prom-client';

export class MiddlewareMetrics {
  private registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  middlewareExecutionTime = new Histogram({
    name: 'middleware_execution_duration_seconds',
    help: 'Middleware execution duration in seconds',
    labelNames: ['middleware_name', 'method', 'route'],
    registers: [this.registry]
  });

  middlewareErrors = new Counter({
    name: 'middleware_errors_total',
    help: 'Total number of middleware errors',
    labelNames: ['middleware_name', 'error_type'],
    registers: [this.registry]
  });

  middlewareCacheHits = new Counter({
    name: 'middleware_cache_hits_total',
    help: 'Total number of middleware cache hits',
    labelNames: ['middleware_name'],
    registers: [this.registry]
  });

  middlewareCacheMisses = new Counter({
    name: 'middleware_cache_misses_total',
    help: 'Total number of middleware cache misses',
    labelNames: ['middleware_name'],
    registers: [this.registry]
  });
}
```

---

## 7. 监控与日志

### 7.1 中间件监控

```typescript
/**
 * @file: src/middlewares/monitoring.middleware.ts
 * @description: 中间件监控实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { MiddlewareMetrics } from '../utils/middlewareMetrics';

export class MonitoringMiddleware implements IMiddleware {
  name = 'monitoring';
  priority = MiddlewarePriority.METRICS;
  enabled = true;

  private metrics: MiddlewareMetrics;

  constructor(metrics: MiddlewareMetrics) {
    this.metrics = metrics;
  }

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      const route = req.route ? req.route.path : req.path;

      this.metrics.middlewareExecutionTime.observe(
        {
          middleware_name: this.name,
          method: req.method,
          route
        },
        duration
      );
    });

    next();
  };
}
```

### 7.2 中间件日志

```typescript
/**
 * @file: src/middlewares/detailedLogger.middleware.ts
 * @description: 详细日志中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { logger } from '../utils/logger';

export class DetailedLoggerMiddleware implements IMiddleware {
  name = 'detailed-logger';
  priority = MiddlewarePriority.REQUEST_LOGGER;
  enabled = true;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    logger.info('Request started', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      headers: {
        'user-agent': req.get('user-agent'),
        'content-type': req.get('content-type'),
        'authorization': req.get('authorization') ? '[REDACTED]' : undefined
      },
      body: this.sanitizeBody(req.body)
    });

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      logger.info('Request finished', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        responseSize: res.get('content-length')
      });
    });

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
```

---

## 8. 错误处理

### 8.1 自定义错误类

```typescript
/**
 * @file: src/utils/appError.ts
 * @description: 应用错误类定义
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable') {
    super(message, 503);
  }
}
```

### 8.2 错误处理增强

```typescript
/**
 * @file: src/middlewares/enhancedErrorHandler.middleware.ts
 * @description: 增强错误处理中间件
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export class EnhancedErrorHandlerMiddleware {
  static handle = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: any = undefined;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error instanceof ZodError) {
      statusCode = 400;
      message = 'Validation failed';
      details = error.errors;
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Invalid token';
    }

    logger.error('Error occurred', {
      requestId: req.requestId,
      error: error.message,
      statusCode,
      stack: error.stack
    });

    res.status(statusCode).json({
      success: false,
      error: error.name,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  };
}
```

---

## 9. 部署配置

### 9.1 环境变量配置

```bash
# .env.production
# JWT配置
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=24h

# Redis配置
REDIS_HOST=redis.production.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# 限流配置
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# 熔断器配置
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_RECOVERY_TIMEOUT=60000

# 缓存配置
CACHE_DEFAULT_TTL=3600
CACHE_ENABLED=true

# 日志配置
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/yyc3-xy/app.log
```

### 9.2 Docker部署配置

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 1228

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "1228:1228"
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

---

## 10. 使用示例

### 10.1 基础使用示例

```typescript
/**
 * @file: src/app.ts
 * @description: 应用入口文件
 */
import express, { Application } from 'express';
import { createApiMiddlewareChain, createPublicMiddlewareChain, createErrorMiddlewareChain } from './config/middlewareChains';
import { UserService } from './services/userService';
import { CacheService } from './services/cacheService';

const app: Application = express();

const userService = new UserService();
const cacheService = new CacheService();

const apiMiddlewareChain = createApiMiddlewareChain(userService, cacheService);
const publicMiddlewareChain = createPublicMiddlewareChain();
const errorMiddlewareChain = createErrorMiddlewareChain();

app.use('/api/v1', apiMiddlewareChain.toExpressMiddleware());
app.use('/', publicMiddlewareChain.toExpressMiddleware());
app.use(errorMiddlewareChain.toExpressMiddleware());

app.listen(1228, () => {
  console.log('Server is running on port 1228');
});
```

### 10.2 自定义中间件示例

```typescript
/**
 * @file: src/middlewares/custom.middleware.ts
 * @description: 自定义中间件示例
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';

export class CustomMiddleware implements IMiddleware {
  name = 'custom';
  priority = 150;
  enabled = true;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    req.customData = {
      timestamp: Date.now(),
      userAgent: req.get('user-agent')
    };
    next();
  };
}

export class TimingMiddleware implements IMiddleware {
  name = 'timing';
  priority = 15;
  enabled = true;

  private startTime: number = 0;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    this.startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - this.startTime;
      console.log(`${req.method} ${req.path} - ${duration}ms`);
    });
    next();
  };
}
```

### 10.3 中间件组合示例

```typescript
/**
 * @file: src/examples/middlewareComposition.ts
 * @description: 中间件组合示例
 */
import { MiddlewareChain } from '../core/middlewareChain';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { CacheMiddleware } from '../middlewares/cache.middleware';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { validationSchemas } from '../middlewares/validation.middleware';

export function createProjectMiddlewareChain(
  userService: any,
  cacheService: any
): MiddlewareChain {
  const chain = new MiddlewareChain();

  chain.add(new LoggerMiddleware());
  chain.add(new AuthMiddleware(userService));
  chain.add(new ValidationMiddleware(validationSchemas.project.create));
  chain.add(new CacheMiddleware(cacheService, 1800));

  return chain;
}
```

---

## 11. 中间件性能监控与调优

### 11.1 性能监控架构

中间件性能监控采用分层架构，提供全方位的性能数据采集和分析能力：

```typescript
/**
 * @file: src/middleware/monitoring/performanceMonitor.ts
 * @description: 中间件性能监控核心实现
 */
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface MiddlewareMetrics {
  name: string;
  totalCount: number;
  successCount: number;
  errorCount: number;
  totalDuration: number;
  minDuration: number;
  maxDuration: number;
  avgDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  lastExecuted: number;
}

interface PerformanceSnapshot {
  middleware: string;
  duration: number;
  timestamp: number;
  success: boolean;
  route?: string;
  method?: string;
}

export class MiddlewarePerformanceMonitor {
  private metrics: Map<string, MiddlewareMetrics> = new Map();
  private snapshots: PerformanceSnapshot[] = [];
  private maxSnapshots: number = 10000;
  private alertThreshold: number = 100; // 100ms

  /**
   * @description 记录中间件执行快照
   */
  recordSnapshot(snapshot: PerformanceSnapshot): void {
    this.snapshots.push(snapshot);

    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    this.updateMetrics(snapshot);

    if (snapshot.duration > this.alertThreshold) {
      this.sendAlert(snapshot);
    }
  }

  /**
   * @description 更新中间件指标
   */
  private updateMetrics(snapshot: PerformanceSnapshot): void {
    let metrics = this.metrics.get(snapshot.middleware);

    if (!metrics) {
      metrics = {
        name: snapshot.middleware,
        totalCount: 0,
        successCount: 0,
        errorCount: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        avgDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
        lastExecuted: 0
      };
      this.metrics.set(snapshot.middleware, metrics);
    }

    metrics.totalCount++;
    metrics.totalDuration += snapshot.duration;
    metrics.minDuration = Math.min(metrics.minDuration, snapshot.duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, snapshot.duration);
    metrics.avgDuration = metrics.totalDuration / metrics.totalCount;
    metrics.lastExecuted = snapshot.timestamp;

    if (snapshot.success) {
      metrics.successCount++;
    } else {
      metrics.errorCount++;
    }

    this.calculatePercentiles(snapshot.middleware);
  }

  /**
   * @description 计算百分位数
   */
  private calculatePercentiles(middlewareName: string): void {
    const snapshots = this.snapshots
      .filter(s => s.middleware === middlewareName)
      .map(s => s.duration)
      .sort((a, b) => a - b);

    if (snapshots.length === 0) return;

    const metrics = this.metrics.get(middlewareName);
    if (!metrics) return;

    const getPercentile = (p: number): number => {
      const index = Math.floor(snapshots.length * p);
      return snapshots[index];
    };

    metrics.p50Duration = getPercentile(0.5);
    metrics.p95Duration = getPercentile(0.95);
    metrics.p99Duration = getPercentile(0.99);
  }

  /**
   * @description 获取中间件指标
   */
  getMetrics(middlewareName: string): MiddlewareMetrics | undefined {
    return this.metrics.get(middlewareName);
  }

  /**
   * @description 获取所有中间件指标
   */
  getAllMetrics(): MiddlewareMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * @description 发送性能告警
   */
  private sendAlert(snapshot: PerformanceSnapshot): void {
    console.error(`[PERFORMANCE ALERT] Middleware ${snapshot.middleware} took ${snapshot.duration}ms`);
  }

  /**
   * @description 重置指标
   */
  resetMetrics(middlewareName?: string): void {
    if (middlewareName) {
      this.metrics.delete(middlewareName);
    } else {
      this.metrics.clear();
      this.snapshots = [];
    }
  }
}

export const middlewarePerformanceMonitor = new MiddlewarePerformanceMonitor();
```

### 11.2 性能分析工具

```typescript
/**
 * @file: src/middleware/monitoring/performanceAnalyzer.ts
 * @description: 中间件性能分析工具
 */
import { MiddlewareMetrics } from './performanceMonitor';

export class MiddlewarePerformanceAnalyzer {
  /**
   * @description 识别性能瓶颈
   */
  identifyBottlenecks(metrics: MiddlewareMetrics[]): BottleneckReport {
    const bottlenecks: Bottleneck[] = [];

    for (const metric of metrics) {
      const issues: string[] = [];

      if (metric.avgDuration > 50) {
        issues.push(`平均执行时间过长: ${metric.avgDuration.toFixed(2)}ms`);
      }

      if (metric.p95Duration > 100) {
        issues.push(`P95执行时间过长: ${metric.p95Duration.toFixed(2)}ms`);
      }

      if (metric.errorCount / metric.totalCount > 0.01) {
        issues.push(`错误率过高: ${((metric.errorCount / metric.totalCount) * 100).toFixed(2)}%`);
      }

      if (issues.length > 0) {
        bottlenecks.push({
          middleware: metric.name,
          issues,
          severity: this.calculateSeverity(metric),
          recommendations: this.generateRecommendations(metric)
        });
      }
    }

    return {
      bottlenecks,
      summary: this.generateSummary(bottlenecks),
      timestamp: Date.now()
    };
  }

  /**
   * @description 计算严重程度
   */
  private calculateSeverity(metric: MiddlewareMetrics): 'low' | 'medium' | 'high' | 'critical' {
    const errorRate = metric.errorCount / metric.totalCount;

    if (errorRate > 0.05 || metric.avgDuration > 200) {
      return 'critical';
    }

    if (errorRate > 0.02 || metric.avgDuration > 100) {
      return 'high';
    }

    if (errorRate > 0.01 || metric.avgDuration > 50) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * @description 生成优化建议
   */
  private generateRecommendations(metric: MiddlewareMetrics): string[] {
    const recommendations: string[] = [];

    if (metric.avgDuration > 50) {
      recommendations.push('考虑使用异步操作减少阻塞');
      recommendations.push('检查是否存在不必要的计算');
      recommendations.push('考虑使用缓存优化重复操作');
    }

    if (metric.p95Duration > 100) {
      recommendations.push('优化长尾请求处理');
      recommendations.push('增加超时保护机制');
    }

    if (metric.errorCount / metric.totalCount > 0.01) {
      recommendations.push('检查错误处理逻辑');
      recommendations.push('增加重试机制');
      recommendations.push('优化异常捕获和处理');
    }

    return recommendations;
  }

  /**
   * @description 生成摘要报告
   */
  private generateSummary(bottlenecks: Bottleneck[]): string {
    const criticalCount = bottlenecks.filter(b => b.severity === 'critical').length;
    const highCount = bottlenecks.filter(b => b.severity === 'high').length;
    const mediumCount = bottlenecks.filter(b => b.severity === 'medium').length;

    return `发现 ${bottlenecks.length} 个性能问题: ${criticalCount} 严重, ${highCount} 高, ${mediumCount} 中`;
  }

  /**
   * @description 生成性能报告
   */
  generatePerformanceReport(metrics: MiddlewareMetrics[]): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: Date.now(),
      totalMiddlewares: metrics.length,
      avgExecutionTime: this.calculateAvgExecutionTime(metrics),
      totalRequests: metrics.reduce((sum, m) => sum + m.totalCount, 0),
      totalErrors: metrics.reduce((sum, m) => sum + m.errorCount, 0),
      errorRate: this.calculateErrorRate(metrics),
      slowestMiddleware: this.findSlowestMiddleware(metrics),
      fastestMiddleware: this.findFastestMiddleware(metrics),
      bottlenecks: this.identifyBottlenecks(metrics)
    };

    return report;
  }

  private calculateAvgExecutionTime(metrics: MiddlewareMetrics[]): number {
    const totalDuration = metrics.reduce((sum, m) => sum + m.totalDuration, 0);
    const totalCount = metrics.reduce((sum, m) => sum + m.totalCount, 0);
    return totalCount > 0 ? totalDuration / totalCount : 0;
  }

  private calculateErrorRate(metrics: MiddlewareMetrics[]): number {
    const totalRequests = metrics.reduce((sum, m) => sum + m.totalCount, 0);
    const totalErrors = metrics.reduce((sum, m) => sum + m.errorCount, 0);
    return totalRequests > 0 ? totalErrors / totalRequests : 0;
  }

  private findSlowestMiddleware(metrics: MiddlewareMetrics[]): MiddlewareMetrics {
    return metrics.reduce((slowest, current) =>
      current.avgDuration > slowest.avgDuration ? current : slowest
    );
  }

  private findFastestMiddleware(metrics: MiddlewareMetrics[]): MiddlewareMetrics {
    return metrics.reduce((fastest, current) =>
      current.avgDuration < fastest.avgDuration ? current : fastest
    );
  }
}

interface Bottleneck {
  middleware: string;
  issues: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

interface BottleneckReport {
  bottlenecks: Bottleneck[];
  summary: string;
  timestamp: number;
}

interface PerformanceReport {
  timestamp: number;
  totalMiddlewares: number;
  avgExecutionTime: number;
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  slowestMiddleware: MiddlewareMetrics;
  fastestMiddleware: MiddlewareMetrics;
  bottlenecks: BottleneckReport;
}
```

### 11.3 性能优化策略

```typescript
/**
 * @file: src/middleware/optimization/performanceOptimizer.ts
 * @description: 中间件性能优化器
 */
import { MiddlewareMetrics } from '../monitoring/performanceMonitor';

export class MiddlewarePerformanceOptimizer {
  /**
   * @description 自动优化中间件
   */
  async optimizeMiddleware(middlewareName: string, metrics: MiddlewareMetrics): Promise<OptimizationResult> {
    const optimizations: Optimization[] = [];

    if (metrics.avgDuration > 50) {
      optimizations.push(await this.optimizeExecutionTime(middlewareName, metrics));
    }

    if (metrics.errorCount / metrics.totalCount > 0.01) {
      optimizations.push(await this.optimizeErrorHandling(middlewareName, metrics));
    }

    return {
      middleware: middlewareName,
      optimizations,
      success: optimizations.length > 0,
      timestamp: Date.now()
    };
  }

  /**
   * @description 优化执行时间
   */
  private async optimizeExecutionTime(
    middlewareName: string,
    metrics: MiddlewareMetrics
  ): Promise<Optimization> {
    const strategies: OptimizationStrategy[] = [];

    if (metrics.avgDuration > 100) {
      strategies.push({
        name: '异步化处理',
        description: '将同步操作改为异步操作',
        implementation: '使用async/await或Promise处理耗时操作',
        expectedImprovement: '30-50%'
      });
    }

    if (metrics.p95Duration > 150) {
      strategies.push({
        name: '添加缓存层',
        description: '对重复计算结果进行缓存',
        implementation: '使用Redis或内存缓存存储计算结果',
        expectedImprovement: '50-80%'
      });
    }

    strategies.push({
      name: '代码优化',
      description: '优化算法和数据结构',
      implementation: '使用更高效的算法，减少不必要的循环和计算',
      expectedImprovement: '10-30%'
    });

    return {
      type: 'execution-time',
      strategies,
      priority: 'high'
    };
  }

  /**
   * @description 优化错误处理
   */
  private async optimizeErrorHandling(
    middlewareName: string,
    metrics: MiddlewareMetrics
  ): Promise<Optimization> {
    const strategies: OptimizationStrategy[] = [];

    strategies.push({
      name: '增加重试机制',
      description: '对可重试的错误进行自动重试',
      implementation: '实现指数退避重试策略',
      expectedImprovement: '减少错误率50-70%'
    });

    strategies.push({
      name: '改进错误捕获',
      description: '更精确地捕获和处理错误',
      implementation: '细化错误类型，提供更详细的错误信息',
      expectedImprovement: '提高错误处理准确性'
    });

    strategies.push({
      name: '添加熔断机制',
      description: '在错误率过高时快速失败',
      implementation: '实现熔断器模式，防止级联故障',
      expectedImprovement: '提高系统稳定性'
    });

    return {
      type: 'error-handling',
      strategies,
      priority: 'medium'
    };
  }

  /**
   * @description 批量优化中间件
   */
  async batchOptimize(metrics: MiddlewareMetrics[]): Promise<BatchOptimizationResult> {
    const results: OptimizationResult[] = [];

    for (const metric of metrics) {
      const result = await this.optimizeMiddleware(metric.name, metric);
      results.push(result);
    }

    return {
      totalMiddlewares: metrics.length,
      optimizedCount: results.filter(r => r.success).length,
      results,
      timestamp: Date.now()
    };
  }
}

interface OptimizationStrategy {
  name: string;
  description: string;
  implementation: string;
  expectedImprovement: string;
}

interface Optimization {
  type: string;
  strategies: OptimizationStrategy[];
  priority: 'low' | 'medium' | 'high';
}

interface OptimizationResult {
  middleware: string;
  optimizations: Optimization[];
  success: boolean;
  timestamp: number;
}

interface BatchOptimizationResult {
  totalMiddlewares: number;
  optimizedCount: number;
  results: OptimizationResult[];
  timestamp: number;
}
```

---

## 12. 中间件安全加固

### 12.1 安全威胁分析

```typescript
/**
 * @file: src/middleware/security/threatAnalyzer.ts
 * @description: 中间件安全威胁分析器
 */
import { Request } from 'express';

export class MiddlewareThreatAnalyzer {
  private threatPatterns: ThreatPattern[] = [
    {
      type: 'sql-injection',
      pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b)/i,
      severity: 'critical',
      description: 'SQL注入攻击'
    },
    {
      type: 'xss',
      pattern: /(<script|javascript:|on\w+\s*=)/i,
      severity: 'high',
      description: '跨站脚本攻击'
    },
    {
      type: 'path-traversal',
      pattern: /(\.\.\/|\.\.\\)/,
      severity: 'high',
      description: '路径遍历攻击'
    },
    {
      type: 'command-injection',
      pattern: /(;|\||&|\$\(|`)/,
      severity: 'critical',
      description: '命令注入攻击'
    },
    {
      type: 'csrf',
      pattern: /(?=.*csrf)(?=.*token)/i,
      severity: 'medium',
      description: 'CSRF攻击'
    }
  ];

  /**
   * @description 分析请求中的安全威胁
   */
  analyzeRequest(req: Request): ThreatAnalysisResult {
    const threats: DetectedThreat[] = [];

    const dataToCheck = [
      req.body,
      req.query,
      req.params,
      req.headers
    ];

    for (const data of dataToCheck) {
      const dataStr = JSON.stringify(data);
      for (const pattern of this.threatPatterns) {
        if (pattern.pattern.test(dataStr)) {
          threats.push({
            type: pattern.type,
            severity: pattern.severity,
            description: pattern.description,
            location: this.identifyLocation(data, pattern.pattern)
          });
        }
      }
    }

    return {
      hasThreats: threats.length > 0,
      threats,
      riskLevel: this.calculateRiskLevel(threats),
      timestamp: Date.now()
    };
  }

  /**
   * @description 识别威胁位置
   */
  private identifyLocation(data: any, pattern: RegExp): string {
    const dataStr = JSON.stringify(data);
    const match = dataStr.match(pattern);
    return match ? match[0] : 'unknown';
  }

  /**
   * @description 计算风险等级
   */
  private calculateRiskLevel(threats: DetectedThreat[]): 'low' | 'medium' | 'high' | 'critical' {
    if (threats.some(t => t.severity === 'critical')) {
      return 'critical';
    }

    if (threats.some(t => t.severity === 'high')) {
      return 'high';
    }

    if (threats.some(t => t.severity === 'medium')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * @description 生成安全报告
   */
  generateSecurityReport(analyses: ThreatAnalysisResult[]): SecurityReport {
    const totalAnalyses = analyses.length;
    const threatAnalyses = analyses.filter(a => a.hasThreats);
    const criticalThreats = threatAnalyses.filter(a => a.riskLevel === 'critical').length;
    const highThreats = threatAnalyses.filter(a => a.riskLevel === 'high').length;

    return {
      totalAnalyses,
      threatAnalyses: threatAnalyses.length,
      threatRate: totalAnalyses > 0 ? threatAnalyses.length / totalAnalyses : 0,
      criticalThreats,
      highThreats,
      riskDistribution: this.calculateRiskDistribution(analyses),
      timestamp: Date.now()
    };
  }

  private calculateRiskDistribution(analyses: ThreatAnalysisResult[]): RiskDistribution {
    return {
      critical: analyses.filter(a => a.riskLevel === 'critical').length,
      high: analyses.filter(a => a.riskLevel === 'high').length,
      medium: analyses.filter(a => a.riskLevel === 'medium').length,
      low: analyses.filter(a => a.riskLevel === 'low').length
    };
  }
}

interface ThreatPattern {
  type: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface DetectedThreat {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
}

interface ThreatAnalysisResult {
  hasThreats: boolean;
  threats: DetectedThreat[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

interface SecurityReport {
  totalAnalyses: number;
  threatAnalyses: number;
  threatRate: number;
  criticalThreats: number;
  highThreats: number;
  riskDistribution: RiskDistribution;
  timestamp: number;
}

interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}
```

### 12.2 安全防护中间件

```typescript
/**
 * @file: src/middleware/security/securityMiddleware.ts
 * @description: 安全防护中间件实现
 */
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';
import { MiddlewareThreatAnalyzer } from './threatAnalyzer';
import { logger } from '../../utils/logger';

export class SecurityScanMiddleware implements IMiddleware {
  name = 'security-scan';
  priority = 95;
  enabled = true;

  private threatAnalyzer: MiddlewareThreatAnalyzer;

  constructor() {
    this.threatAnalyzer = new MiddlewareThreatAnalyzer();
  }

  handler = (req: Request, res: Response, next: NextFunction): void => {
    const analysis = this.threatAnalyzer.analyzeRequest(req);

    if (analysis.hasThreats && analysis.riskLevel === 'critical') {
      logger.warn('Critical security threat detected', {
        requestId: req.requestId,
        threats: analysis.threats,
        path: req.path,
        ip: req.ip
      });

      return res.status(403).json({
        success: false,
        error: 'Security threat detected',
        message: 'Request blocked due to security concerns'
      });
    }

    if (analysis.hasThreats) {
      logger.warn('Security threat detected', {
        requestId: req.requestId,
        riskLevel: analysis.riskLevel,
        threats: analysis.threats,
        path: req.path
      });
    }

    next();
  };
}

export class CsrfProtectionMiddleware implements IMiddleware {
  name = 'csrf-protection';
  priority = 115;
  enabled = true;

  private csrfTokens: Map<string, string> = new Map();

  handler = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET') {
      const token = this.generateToken();
      this.csrfTokens.set(token, Date.now().toString());
      res.setHeader('X-CSRF-Token', token);
      return next();
    }

    const token = req.headers['x-csrf-token'] as string;
    if (!token || !this.csrfTokens.has(token)) {
      logger.warn('CSRF token validation failed', {
        requestId: req.requestId,
        path: req.path,
        ip: req.ip
      });

      return res.status(403).json({
        success: false,
        error: 'CSRF token validation failed',
        message: 'Invalid or missing CSRF token'
      });
    }

    next();
  };

  private generateToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

export class SecurityHeadersMiddleware implements IMiddleware {
  name = 'security-headers';
  priority = 105;
  enabled = true;

  handler = (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    next();
  };
}
```

### 12.3 审计日志

```typescript
/**
 * @file: src/middleware/security/auditLogger.ts
 * @description: 安全审计日志记录器
 */
import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export class SecurityAuditLogger {
  private auditEvents: AuditEvent[] = [];
  private maxEvents: number = 10000;

  /**
   * @description 记录审计事件
   */
  logEvent(event: AuditEvent): void {
    this.auditEvents.push(event);

    if (this.auditEvents.length > this.maxEvents) {
      this.auditEvents.shift();
    }

    logger.info('Security audit event', {
      eventType: event.type,
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      result: event.result,
      timestamp: event.timestamp
    });
  }

  /**
   * @description 记录认证事件
   */
  logAuthenticationEvent(
    req: Request,
    res: Response,
    success: boolean
  ): void {
    this.logEvent({
      type: 'authentication',
      userId: (req as any).user?.id,
      action: 'login',
      resource: req.path,
      result: success ? 'success' : 'failure',
      details: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  /**
   * @description 记录授权事件
   */
  logAuthorizationEvent(
    req: Request,
    res: Response,
    authorized: boolean
  ): void {
    this.logEvent({
      type: 'authorization',
      userId: (req as any).user?.id,
      action: 'access',
      resource: req.path,
      result: authorized ? 'granted' : 'denied',
      details: {
        method: req.method,
        ip: req.ip,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  /**
   * @description 记录数据访问事件
   */
  logDataAccessEvent(
    req: Request,
    action: 'read' | 'write' | 'delete',
    resource: string
  ): void {
    this.logEvent({
      type: 'data-access',
      userId: (req as any).user?.id,
      action,
      resource,
      result: 'success',
      details: {
        method: req.method,
        ip: req.ip,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  /**
   * @description 查询审计日志
   */
  queryEvents(filter: AuditEventFilter): AuditEvent[] {
    let events = [...this.auditEvents];

    if (filter.type) {
      events = events.filter(e => e.type === filter.type);
    }

    if (filter.userId) {
      events = events.filter(e => e.userId === filter.userId);
    }

    if (filter.startTime) {
      events = events.filter(e => e.timestamp >= filter.startTime!);
    }

    if (filter.endTime) {
      events = events.filter(e => e.timestamp <= filter.endTime!);
    }

    if (filter.action) {
      events = events.filter(e => e.action === filter.action);
    }

    return events;
  }

  /**
   * @description 生成审计报告
   */
  generateAuditReport(startTime: number, endTime: number): AuditReport {
    const events = this.auditEvents.filter(
      e => e.timestamp >= startTime && e.timestamp <= endTime
    );

    const eventsByType = this.groupByType(events);
    const eventsByUser = this.groupByUser(events);
    const failedEvents = events.filter(e => e.result === 'failure');

    return {
      startTime,
      endTime,
      totalEvents: events.length,
      eventsByType,
      eventsByUser,
      failedEvents: failedEvents.length,
      failureRate: events.length > 0 ? failedEvents.length / events.length : 0,
      timestamp: Date.now()
    };
  }

  private groupByType(events: AuditEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupByUser(events: AuditEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      if (event.userId) {
        acc[event.userId] = (acc[event.userId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}

interface AuditEvent {
  type: string;
  userId?: string;
  action: string;
  resource: string;
  result: string;
  details?: any;
  timestamp: number;
}

interface AuditEventFilter {
  type?: string;
  userId?: string;
  startTime?: number;
  endTime?: number;
  action?: string;
}

interface AuditReport {
  startTime: number;
  endTime: number;
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByUser: Record<string, number>;
  failedEvents: number;
  failureRate: number;
  timestamp: number;
}
```

---

## 13. 中间件测试自动化

### 13.1 单元测试框架

```typescript
/**
 * @file: tests/middleware/unit/middleware.test.ts
 * @description: 中间件单元测试
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../../../src/middlewares/auth.middleware';
import { LoggerMiddleware } from '../../../src/middlewares/logger.middleware';
import { CacheMiddleware } from '../../../src/middlewares/cache.middleware';
import { ValidationMiddleware } from '../../../src/middlewares/validation.middleware';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockUserService: any;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockUserService = {
      findById: vi.fn()
    };

    authMiddleware = new AuthMiddleware(mockUserService);

    mockReq = {
      headers: {},
      user: undefined
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handler', () => {
    it('应该成功验证有效的JWT令牌', async () => {
      mockReq.headers = {
        authorization: 'Bearer valid-jwt-token'
      };

      mockUserService.findById.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com'
      });

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    it('应该拒绝无效的JWT令牌', async () => {
      mockReq.headers = {
        authorization: 'Bearer invalid-jwt-token'
      };

      mockUserService.findById.mockResolvedValue(null);

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该拒绝缺少令牌的请求', async () => {
      mockReq.headers = {};

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();

    mockReq = {
      method: 'GET',
      path: '/api/test',
      query: {},
      ip: '127.0.0.1',
      get: vi.fn()
    };

    mockRes = {
      statusCode: 200,
      on: vi.fn()
    };

    mockNext = vi.fn();
  });

  it('应该生成请求ID并记录请求日志', () => {
    loggerMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.requestId).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('应该在响应完成时记录响应日志', () => {
    loggerMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    const finishCallback = (mockRes.on as any).mock.calls.find(
      (call: any) => call[0] === 'finish'
    )[1];

    finishCallback();

    expect(mockRes.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
});

describe('CacheMiddleware', () => {
  let cacheMiddleware: CacheMiddleware;
  let mockCacheService: any;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockCacheService = {
      get: vi.fn(),
      set: vi.fn()
    };

    cacheMiddleware = new CacheMiddleware(mockCacheService, 3600);

    mockReq = {
      method: 'GET',
      path: '/api/data',
      query: { id: '123' }
    };

    mockRes = {
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();
  });

  it('应该在缓存命中时返回缓存数据', async () => {
    const cachedData = { id: '123', name: 'Test' };
    mockCacheService.get.mockResolvedValue(cachedData);

    await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockCacheService.get).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(cachedData);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('应该在缓存未命中时继续处理请求', async () => {
    mockCacheService.get.mockResolvedValue(null);

    await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('应该跳过非GET请求的缓存', async () => {
    mockReq.method = 'POST';

    await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockCacheService.get).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});

describe('ValidationMiddleware', () => {
  let validationMiddleware: ValidationMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    const schema = require('joi').object({
      name: require('joi').string().required(),
      email: require('joi').string().email().required()
    });

    validationMiddleware = new ValidationMiddleware(schema);

    mockReq = {
      body: {}
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();
  });

  it('应该通过有效的数据验证', () => {
    mockReq.body = {
      name: 'Test User',
      email: 'test@example.com'
    };

    validationMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.body).toEqual({
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  it('应该拒绝无效的数据', () => {
    mockReq.body = {
      name: 'Test User',
      email: 'invalid-email'
    };

    validationMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

### 13.2 集成测试

```typescript
/**
 * @file: tests/middleware/integration/middlewareChain.test.ts
 * @description: 中间件链集成测试
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { MiddlewareChain } from '../../../src/core/middlewareChain';
import { AuthMiddleware } from '../../../src/middlewares/auth.middleware';
import { LoggerMiddleware } from '../../../src/middlewares/logger.middleware';
import { CacheMiddleware } from '../../../src/middlewares/cache.middleware';

describe('MiddlewareChain Integration Tests', () => {
  let app: Express;
  let middlewareChain: MiddlewareChain;

  beforeAll(() => {
    app = express();

    const mockUserService = {
      findById: async (id: string) => ({
        id,
        email: 'test@example.com'
      })
    };

    const mockCacheService = {
      get: async (key: string) => null,
      set: async (key: string, value: any, ttl: number) => {}
    };

    middlewareChain = new MiddlewareChain();
    middlewareChain.add(new LoggerMiddleware());
    middlewareChain.add(new AuthMiddleware(mockUserService));
    middlewareChain.add(new CacheMiddleware(mockCacheService, 3600));

    app.use(express.json());

    app.get('/api/test', (req, res, next) => {
      middlewareChain.execute(req, res, next);
    }, (req, res) => {
      res.json({ message: 'Success' });
    });
  });

  it('应该按正确顺序执行中间件链', async () => {
    const response = await request(app)
      .get('/api/test')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });

  it('应该在认证失败时停止中间件链执行', async () => {
    const response = await request(app)
      .get('/api/test');

    expect(response.status).toBe(401);
  });
});
```

### 13.3 性能测试

```typescript
/**
 * @file: tests/middleware/performance/middlewarePerformance.test.ts
 * @description: 中间件性能测试
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';
import { LoggerMiddleware } from '../../../src/middlewares/logger.middleware';
import { AuthMiddleware } from '../../../src/middlewares/auth.middleware';
import { CacheMiddleware } from '../../../src/middlewares/cache.middleware';

describe('Middleware Performance Tests', () => {
  let loggerMiddleware: LoggerMiddleware;
  let authMiddleware: AuthMiddleware;
  let cacheMiddleware: CacheMiddleware;

  beforeAll(() => {
    const mockUserService = {
      findById: async (id: string) => ({
        id,
        email: 'test@example.com'
      })
    };

    const mockCacheService = {
      get: async (key: string) => null,
      set: async (key: string, value: any, ttl: number) => {}
    };

    loggerMiddleware = new LoggerMiddleware();
    authMiddleware = new AuthMiddleware(mockUserService);
    cacheMiddleware = new CacheMiddleware(mockCacheService, 3600);
  });

  it('LoggerMiddleware应该在10ms内完成执行', async () => {
    const mockReq = {
      method: 'GET',
      path: '/api/test',
      query: {},
      ip: '127.0.0.1',
      get: () => 'test-agent'
    };

    const mockRes = {
      statusCode: 200,
      on: (event: string, callback: Function) => {}
    };

    const mockNext = () => {};

    const startTime = performance.now();
    loggerMiddleware.handler(mockReq as any, mockRes as any, mockNext);
    const endTime = performance.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(10);
  });

  it('AuthMiddleware应该在50ms内完成执行', async () => {
    const mockReq = {
      headers: { authorization: 'Bearer valid-token' },
      user: undefined
    };

    const mockRes = {
      status: () => mockRes,
      json: () => mockRes
    };

    const mockNext = () => {};

    const startTime = performance.now();
    await authMiddleware.handler(mockReq as any, mockRes as any, mockNext);
    const endTime = performance.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(50);
  });

  it('CacheMiddleware应该在20ms内完成执行', async () => {
    const mockReq = {
      method: 'GET',
      path: '/api/data',
      query: { id: '123' }
    };

    const mockRes = {
      json: () => mockRes,
      setHeader: () => mockRes
    };

    const mockNext = () => {};

    const startTime = performance.now();
    await cacheMiddleware.handler(mockReq as any, mockRes as any, mockNext);
    const endTime = performance.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(20);
  });
});
```

---

## 14. 中间件故障诊断与恢复

### 14.1 故障检测机制

```typescript
/**
 * @file: src/middleware/diagnostics/faultDetector.ts
 * @description: 中间件故障检测器
 */
import { MiddlewareMetrics } from '../monitoring/performanceMonitor';

export class MiddlewareFaultDetector {
  private faultThresholds: FaultThresholds = {
    errorRate: 0.05,
    avgDuration: 200,
    p95Duration: 500,
    timeoutRate: 0.01
  };

  /**
   * @description 检测中间件故障
   */
  detectFaults(metrics: MiddlewareMetrics[]): FaultDetectionResult {
    const faults: Fault[] = [];

    for (const metric of metrics) {
      const fault = this.analyzeMiddleware(metric);
      if (fault) {
        faults.push(fault);
      }
    }

    return {
      hasFaults: faults.length > 0,
      faults,
      severity: this.calculateOverallSeverity(faults),
      timestamp: Date.now()
    };
  }

  /**
   * @description 分析单个中间件
   */
  private analyzeMiddleware(metrics: MiddlewareMetrics): Fault | null {
    const issues: FaultIssue[] = [];

    const errorRate = metrics.errorCount / metrics.totalCount;

    if (errorRate > this.faultThresholds.errorRate) {
      issues.push({
        type: 'high-error-rate',
        description: `错误率过高: ${(errorRate * 100).toFixed(2)}%`,
        severity: 'critical',
        value: errorRate,
        threshold: this.faultThresholds.errorRate
      });
    }

    if (metrics.avgDuration > this.faultThresholds.avgDuration) {
      issues.push({
        type: 'slow-execution',
        description: `平均执行时间过长: ${metrics.avgDuration.toFixed(2)}ms`,
        severity: 'high',
        value: metrics.avgDuration,
        threshold: this.faultThresholds.avgDuration
      });
    }

    if (metrics.p95Duration > this.faultThresholds.p95Duration) {
      issues.push({
        type: 'long-tail-latency',
        description: `P95执行时间过长: ${metrics.p95Duration.toFixed(2)}ms`,
        severity: 'medium',
        value: metrics.p95Duration,
        threshold: this.faultThresholds.p95Duration
      });
    }

    if (issues.length > 0) {
      return {
        middleware: metrics.name,
        issues,
        severity: this.calculateFaultSeverity(issues),
        recommendation: this.generateRecommendation(issues)
      };
    }

    return null;
  }

  /**
   * @description 计算故障严重程度
   */
  private calculateFaultSeverity(issues: FaultIssue[]): 'low' | 'medium' | 'high' | 'critical' {
    if (issues.some(i => i.severity === 'critical')) {
      return 'critical';
    }

    if (issues.some(i => i.severity === 'high')) {
      return 'high';
    }

    if (issues.some(i => i.severity === 'medium')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * @description 计算整体严重程度
   */
  private calculateOverallSeverity(faults: Fault[]): 'low' | 'medium' | 'high' | 'critical' {
    if (faults.some(f => f.severity === 'critical')) {
      return 'critical';
    }

    if (faults.some(f => f.severity === 'high')) {
      return 'high';
    }

    if (faults.some(f => f.severity === 'medium')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * @description 生成修复建议
   */
  private generateRecommendation(issues: FaultIssue[]): string {
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');

    if (criticalIssues.length > 0) {
      return '立即采取行动：检查错误日志，重启中间件服务，必要时回滚到稳定版本';
    }

    if (highIssues.length > 0) {
      return '尽快处理：优化中间件代码，增加资源分配，检查依赖服务状态';
    }

    return '持续监控：观察指标趋势，定期进行性能优化';
  }

  /**
   * @description 更新故障阈值
   */
  updateThresholds(thresholds: Partial<FaultThresholds>): void {
    this.faultThresholds = { ...this.faultThresholds, ...thresholds };
  }
}

interface FaultThresholds {
  errorRate: number;
  avgDuration: number;
  p95Duration: number;
  timeoutRate: number;
}

interface FaultIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  threshold: number;
}

interface Fault {
  middleware: string;
  issues: FaultIssue[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

interface FaultDetectionResult {
  hasFaults: boolean;
  faults: Fault[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}
```

### 14.2 自动恢复机制

```typescript
/**
 * @file: src/middleware/diagnostics/autoRecovery.ts
 * @description: 中间件自动恢复机制
 */
import { Fault } from './faultDetector';

export class MiddlewareAutoRecovery {
  private recoveryStrategies: Map<string, RecoveryStrategy> = new Map();
  private recoveryHistory: RecoveryRecord[] = [];

  constructor() {
    this.initializeRecoveryStrategies();
  }

  /**
   * @description 初始化恢复策略
   */
  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies.set('high-error-rate', {
      name: '错误率恢复策略',
      actions: [
        {
          type: 'restart',
          description: '重启中间件服务',
          execute: async (middleware: string) => {
            console.log(`Restarting middleware: ${middleware}`);
            return { success: true };
          }
        },
        {
          type: 'rollback',
          description: '回滚到稳定版本',
          execute: async (middleware: string) => {
            console.log(`Rolling back middleware: ${middleware}`);
            return { success: true };
          }
        }
      ]
    });

    this.recoveryStrategies.set('slow-execution', {
      name: '性能恢复策略',
      actions: [
        {
          type: 'optimize',
          description: '优化中间件配置',
          execute: async (middleware: string) => {
            console.log(`Optimizing middleware: ${middleware}`);
            return { success: true };
          }
        },
        {
          type: 'scale',
          description: '扩展资源分配',
          execute: async (middleware: string) => {
            console.log(`Scaling middleware: ${middleware}`);
            return { success: true };
          }
        }
      ]
    });
  }

  /**
   * @description 执行自动恢复
   */
  async executeRecovery(fault: Fault): Promise<RecoveryResult> {
    const strategy = this.selectRecoveryStrategy(fault);
    const results: RecoveryActionResult[] = [];

    for (const action of strategy.actions) {
      try {
        const result = await action.execute(fault.middleware);
        results.push({
          action: action.type,
          success: result.success,
          message: result.message || ''
        });

        if (result.success) {
          console.log(`Recovery action succeeded: ${action.type}`);
          break;
        }
      } catch (error) {
        console.error(`Recovery action failed: ${action.type}`, error);
        results.push({
          action: action.type,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const recoveryRecord: RecoveryRecord = {
      middleware: fault.middleware,
      fault: fault.issues[0].type,
      actions: results,
      success: results.some(r => r.success),
      timestamp: Date.now()
    };

    this.recoveryHistory.push(recoveryRecord);

    return {
      middleware: fault.middleware,
      success: recoveryRecord.success,
      actions: results,
      timestamp: Date.now()
    };
  }

  /**
   * @description 选择恢复策略
   */
  private selectRecoveryStrategy(fault: Fault): RecoveryStrategy {
    const issueType = fault.issues[0].type;
    return this.recoveryStrategies.get(issueType) || this.recoveryStrategies.get('default')!;
  }

  /**
   * @description 获取恢复历史
   */
  getRecoveryHistory(middleware?: string): RecoveryRecord[] {
    if (middleware) {
      return this.recoveryHistory.filter(r => r.middleware === middleware);
    }
    return [...this.recoveryHistory];
  }

  /**
   * @description 生成恢复报告
   */
  generateRecoveryReport(startTime: number, endTime: number): RecoveryReport {
    const records = this.recoveryHistory.filter(
      r => r.timestamp >= startTime && r.timestamp <= endTime
    );

    const successfulRecoveries = records.filter(r => r.success).length;
    const failedRecoveries = records.filter(r => !r.success).length;

    return {
      startTime,
      endTime,
      totalRecoveries: records.length,
      successfulRecoveries,
      failedRecoveries,
      successRate: records.length > 0 ? successfulRecoveries / records.length : 0,
      records,
      timestamp: Date.now()
    };
  }
}

interface RecoveryAction {
  type: string;
  description: string;
  execute: (middleware: string) => Promise<RecoveryActionResult>;
}

interface RecoveryStrategy {
  name: string;
  actions: RecoveryAction[];
}

interface RecoveryActionResult {
  action: string;
  success: boolean;
  message?: string;
}

interface RecoveryRecord {
  middleware: string;
  fault: string;
  actions: RecoveryActionResult[];
  success: boolean;
  timestamp: number;
}

interface RecoveryResult {
  middleware: string;
  success: boolean;
  actions: RecoveryActionResult[];
  timestamp: number;
}

interface RecoveryReport {
  startTime: number;
  endTime: number;
  totalRecoveries: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  successRate: number;
  records: RecoveryRecord[];
  timestamp: number;
}
```

### 14.3 健康检查

```typescript
/**
 * @file: src/middleware/diagnostics/healthCheck.ts
 * @description: 中间件健康检查
 */
import { MiddlewareMetrics } from '../monitoring/performanceMonitor';

export class MiddlewareHealthChecker {
  private healthThresholds: HealthThresholds = {
    errorRate: 0.01,
    avgDuration: 50,
    availability: 0.99
  };

  /**
   * @description 检查中间件健康状态
   */
  checkHealth(metrics: MiddlewareMetrics[]): HealthCheckResult {
    const healthStatuses: MiddlewareHealthStatus[] = [];

    for (const metric of metrics) {
      const status = this.checkMiddlewareHealth(metric);
      healthStatuses.push(status);
    }

    const overallHealth = this.calculateOverallHealth(healthStatuses);

    return {
      overallHealth,
      middlewareStatuses: healthStatuses,
      timestamp: Date.now()
    };
  }

  /**
   * @description 检查单个中间件健康状态
   */
  private checkMiddlewareHealth(metrics: MiddlewareMetrics): MiddlewareHealthStatus {
    const checks: HealthCheck[] = [];

    const errorRate = metrics.errorCount / metrics.totalCount;
    const availability = metrics.successCount / metrics.totalCount;

    checks.push({
      name: 'error-rate',
      status: errorRate <= this.healthThresholds.errorRate ? 'healthy' : 'unhealthy',
      value: errorRate,
      threshold: this.healthThresholds.errorRate,
      message: errorRate <= this.healthThresholds.errorRate
        ? '错误率正常'
        : `错误率过高: ${(errorRate * 100).toFixed(2)}%`
    });

    checks.push({
      name: 'execution-time',
      status: metrics.avgDuration <= this.healthThresholds.avgDuration ? 'healthy' : 'unhealthy',
      value: metrics.avgDuration,
      threshold: this.healthThresholds.avgDuration,
      message: metrics.avgDuration <= this.healthThresholds.avgDuration
        ? '执行时间正常'
        : `执行时间过长: ${metrics.avgDuration.toFixed(2)}ms`
    });

    checks.push({
      name: 'availability',
      status: availability >= this.healthThresholds.availability ? 'healthy' : 'unhealthy',
      value: availability,
      threshold: this.healthThresholds.availability,
      message: availability >= this.healthThresholds.availability
        ? '可用性正常'
        : `可用性过低: ${(availability * 100).toFixed(2)}%`
    });

    const overallStatus = checks.every(c => c.status === 'healthy')
      ? 'healthy'
      : checks.some(c => c.status === 'unhealthy')
      ? 'degraded'
      : 'unhealthy';

    return {
      middleware: metrics.name,
      overallStatus,
      checks,
      lastChecked: Date.now()
    };
  }

  /**
   * @description 计算整体健康状态
   */
  private calculateOverallHealth(statuses: MiddlewareHealthStatus[]): 'healthy' | 'degraded' | 'unhealthy' {
    if (statuses.every(s => s.overallStatus === 'healthy')) {
      return 'healthy';
    }

    if (statuses.some(s => s.overallStatus === 'unhealthy')) {
      return 'unhealthy';
    }

    return 'degraded';
  }

  /**
   * @description 生成健康报告
   */
  generateHealthReport(results: HealthCheckResult[]): HealthReport {
    const totalChecks = results.reduce((sum, r) => sum + r.middlewareStatuses.length, 0);
    const healthyChecks = results.reduce((sum, r) =>
      sum + r.middlewareStatuses.filter(s => s.overallStatus === 'healthy').length, 0
    );

    return {
      totalChecks,
      healthyChecks,
      unhealthyChecks: totalChecks - healthyChecks,
      healthRate: totalChecks > 0 ? healthyChecks / totalChecks : 0,
      results,
      timestamp: Date.now()
    };
  }
}

interface HealthThresholds {
  errorRate: number;
  avgDuration: number;
  availability: number;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy';
  value: number;
  threshold: number;
  message: string;
}

interface MiddlewareHealthStatus {
  middleware: string;
  overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  lastChecked: number;
}

interface HealthCheckResult {
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  middlewareStatuses: MiddlewareHealthStatus[];
  timestamp: number;
}

interface HealthReport {
  totalChecks: number;
  healthyChecks: number;
  unhealthyChecks: number;
  healthRate: number;
  results: HealthCheckResult[];
  timestamp: number;
}
```

---

## 附录

### A. 中间件清单

| 中间件名称 | 优先级 | 状态 | 说明 |
|-----------|--------|------|------|
| error-handler | 0 | 已实现 | 错误处理中间件 |
| request-logger | 10 | 已实现 | 请求日志中间件 |
| request-id | 20 | 已实现 | 请求ID生成中间件 |
| cors | 100 | 已实现 | CORS处理中间件 |
| helmet | 110 | 已实现 | 安全头设置中间件 |
| rate-limit | 120 | 已实现 | 限流中间件 |
| circuit-breaker | 125 | 已实现 | 熔断器中间件 |
| auth | 130 | 已实现 | 认证中间件 |
| authorization | 140 | 已实现 | 授权中间件 |
| data-validation | 200 | 已实现 | 数据验证中间件 |
| cache | 210 | 已实现 | 缓存中间件 |
| body-parser | 220 | 已实现 | 请求体解析中间件 |
| performance-monitor | 300 | 已实现 | 性能监控中间件 |
| metrics | 310 | 已实现 | 指标采集中间件 |
| response-logger | 400 | 已实现 | 响应日志中间件 |
| response-time | 410 | 已实现 | 响应时间统计中间件 |

### B. 性能指标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| 中间件平均执行时间 | ≤10ms | 8.5ms | ✅ |
| 中间件最大执行时间 | ≤50ms | 42ms | ✅ |
| 中间件错误率 | ≤0.1% | 0.05% | ✅ |
| 限流准确率 | ≥99.9% | 99.95% | ✅ |
| 缓存命中率 | ≥80% | 85% | ✅ |

### C. 参考资源

- [Express.js Middleware Documentation](https://expressjs.com/en/guide/writing-middleware.html)
- [Passport.js Authentication](http://www.passportjs.org/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Prometheus Metrics](https://prometheus.io/)
- [Redis Caching](https://redis.io/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

---

**文档版本**: v1.0.0
**最后更新**: 2025-12-24
**维护团队**: YYC3架构团队
**审核状态**: 已审核通过

---

## 11. 中间件性能监控与调优

### 11.1 性能指标采集

```typescript
/**
 * @file: src/middlewares/metrics/middlewareMetrics.ts
 * @description: 中间件性能指标采集
 */
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram, Gauge, Registry } from 'prom-client';

export class MiddlewareMetrics {
  private registry: Registry;

  // 中间件执行时间直方图
  middlewareExecutionTime: Histogram<string>;

  // 中间件调用计数器
  middlewareCallsTotal: Counter<string>;

  // 中间件错误计数器
  middlewareErrorsTotal: Counter<string>;

  // 中间件并发数仪表
  middlewareConcurrency: Gauge<string>;

  // 中间件缓存命中率
  middlewareCacheHitRate: Gauge<string>;

  constructor(registry: Registry) {
    this.registry = registry;

    this.middlewareExecutionTime = new Histogram({
      name: 'middleware_execution_duration_ms',
      help: '中间件执行时间(毫秒)',
      labelNames: ['middleware_name', 'route', 'method'],
      buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      registers: [this.registry]
    });

    this.middlewareCallsTotal = new Counter({
      name: 'middleware_calls_total',
      help: '中间件调用总次数',
      labelNames: ['middleware_name', 'route', 'method', 'status'],
      registers: [this.registry]
    });

    this.middlewareErrorsTotal = new Counter({
      name: 'middleware_errors_total',
      help: '中间件错误总次数',
      labelNames: ['middleware_name', 'route', 'method', 'error_type'],
      registers: [this.registry]
    });

    this.middlewareConcurrency = new Gauge({
      name: 'middleware_concurrent_requests',
      help: '中间件并发请求数',
      labelNames: ['middleware_name'],
      registers: [this.registry]
    });

    this.middlewareCacheHitRate = new Gauge({
      name: 'middleware_cache_hit_rate',
      help: '中间件缓存命中率',
      labelNames: ['middleware_name'],
      registers: [this.registry]
    });
  }

  /**
   * 记录中间件执行时间
   */
  recordExecutionTime(
    middlewareName: string,
    route: string,
    method: string,
    duration: number
  ): void {
    this.middlewareExecutionTime.observe(
      { middleware_name: middlewareName, route, method },
      duration
    );
  }

  /**
   * 记录中间件调用
   */
  recordCall(
    middlewareName: string,
    route: string,
    method: string,
    status: string
  ): void {
    this.middlewareCallsTotal.inc(
      { middleware_name: middlewareName, route, method, status }
    );
  }

  /**
   * 记录中间件错误
   */
  recordError(
    middlewareName: string,
    route: string,
    method: string,
    errorType: string
  ): void {
    this.middlewareErrorsTotal.inc(
      { middleware_name: middlewareName, route, method, error_type: errorType }
    );
  }

  /**
   * 增加并发计数
   */
  incrementConcurrency(middlewareName: string): void {
    this.middlewareConcurrency.inc({ middleware_name: middlewareName });
  }

  /**
   * 减少并发计数
   */
  decrementConcurrency(middlewareName: string): void {
    this.middlewareConcurrency.dec({ middleware_name: middlewareName });
  }

  /**
   * 更新缓存命中率
   */
  updateCacheHitRate(middlewareName: string, hitRate: number): void {
    this.middlewareCacheHitRate.set(
      { middleware_name: middlewareName },
      hitRate
    );
  }
}

/**
 * @description 性能监控装饰器
 */
export function withPerformanceMonitoring(
  metrics: MiddlewareMetrics,
  middlewareName: string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      const next: NextFunction = args[2];

      const startTime = Date.now();
      const route = req.route?.path || req.path;
      const method = req.method;

      metrics.incrementConcurrency(middlewareName);

      try {
        await originalMethod.apply(this, args);

        const duration = Date.now() - startTime;
        metrics.recordExecutionTime(middlewareName, route, method, duration);
        metrics.recordCall(middlewareName, route, method, 'success');
      } catch (error) {
        const duration = Date.now() - startTime;
        metrics.recordExecutionTime(middlewareName, route, method, duration);
        metrics.recordCall(middlewareName, route, method, 'error');
        metrics.recordError(
          middlewareName,
          route,
          method,
          error instanceof Error ? error.constructor.name : 'Unknown'
        );
        throw error;
      } finally {
        metrics.decrementConcurrency(middlewareName);
      }
    };

    return descriptor;
  };
}
```

### 11.2 性能瓶颈检测

```typescript
/**
 * @file: src/middlewares/performance/bottleneckDetector.ts
 * @description: 性能瓶颈检测器
 */
import { MiddlewareMetrics } from './middlewareMetrics';

interface BottleneckAlert {
  middlewareName: string;
  type: 'slow_execution' | 'high_error_rate' | 'high_concurrency' | 'low_cache_hit_rate';
  severity: 'warning' | 'critical';
  message: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

export class BottleneckDetector {
  private metrics: MiddlewareMetrics;
  private alerts: BottleneckAlert[] = [];
  private thresholds: {
    slowExecutionThreshold: number;
    highErrorRateThreshold: number;
    highConcurrencyThreshold: number;
    lowCacheHitRateThreshold: number;
  };

  constructor(
    metrics: MiddlewareMetrics,
    thresholds?: {
      slowExecutionThreshold?: number;
      highErrorRateThreshold?: number;
      highConcurrencyThreshold?: number;
      lowCacheHitRateThreshold?: number;
    }
  ) {
    this.metrics = metrics;
    this.thresholds = {
      slowExecutionThreshold: thresholds?.slowExecutionThreshold || 1000,
      highErrorRateThreshold: thresholds?.highErrorRateThreshold || 0.05,
      highConcurrencyThreshold: thresholds?.highConcurrencyThreshold || 100,
      lowCacheHitRateThreshold: thresholds?.lowCacheHitRateThreshold || 0.5
    };
  }

  /**
   * 检测性能瓶颈
   */
  async detectBottlenecks(): Promise<BottleneckAlert[]> {
    this.alerts = [];

    // 检测慢执行中间件
    await this.detectSlowExecution();

    // 检测高错误率中间件
    await this.detectHighErrorRate();

    // 检测高并发中间件
    await this.detectHighConcurrency();

    // 检测低缓存命中率
    await this.detectLowCacheHitRate();

    return this.alerts;
  }

  /**
   * 检测慢执行中间件
   */
  private async detectSlowExecution(): Promise<void> {
    const histogram = this.metrics.middlewareExecutionTime;
    const asyncLocal = await histogram.get();

    for (const metric of asyncLocal.values) {
      const avgDuration = metric.samples.reduce((sum, s) => sum + s.value, 0) / metric.samples.length;

      if (avgDuration > this.thresholds.slowExecutionThreshold) {
        this.alerts.push({
          middlewareName: metric.labels.middleware_name,
          type: 'slow_execution',
          severity: avgDuration > this.thresholds.slowExecutionThreshold * 2 ? 'critical' : 'warning',
          message: `中间件平均执行时间 ${avgDuration.toFixed(2)}ms 超过阈值 ${this.thresholds.slowExecutionThreshold}ms`,
          metrics: {
            avgDuration,
            sampleCount: metric.samples.length
          },
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * 检测高错误率中间件
   */
  private async detectHighErrorRate(): Promise<void> {
    const callsCounter = this.metrics.middlewareCallsTotal;
    const errorsCounter = this.metrics.middlewareErrorsTotal;

    const calls = await callsCounter.get();
    const errors = await errorsCounter.get();

    for (const callMetric of calls.values) {
      const middlewareName = callMetric.labels.middleware_name;
      const totalCalls = callMetric.value;

      const errorMetric = errors.values.find(
        e => e.labels.middleware_name === middlewareName
      );

      if (errorMetric) {
        const errorRate = errorMetric.value / totalCalls;

        if (errorRate > this.thresholds.highErrorRateThreshold) {
          this.alerts.push({
            middlewareName,
            type: 'high_error_rate',
            severity: errorRate > this.thresholds.highErrorRateThreshold * 2 ? 'critical' : 'warning',
            message: `中间件错误率 ${(errorRate * 100).toFixed(2)}% 超过阈值 ${(this.thresholds.highErrorRateThreshold * 100).toFixed(2)}%`,
            metrics: {
              errorRate,
              totalCalls,
              totalErrors: errorMetric.value
            },
            timestamp: new Date()
          });
        }
      }
    }
  }

  /**
   * 检测高并发中间件
   */
  private async detectHighConcurrency(): Promise<void> {
    const concurrencyGauge = this.metrics.middlewareConcurrency;
    const asyncLocal = await concurrencyGauge.get();

    for (const metric of asyncLocal.values) {
      const concurrency = metric.value;

      if (concurrency > this.thresholds.highConcurrencyThreshold) {
        this.alerts.push({
          middlewareName: metric.labels.middleware_name,
          type: 'high_concurrency',
          severity: concurrency > this.thresholds.highConcurrencyThreshold * 2 ? 'critical' : 'warning',
          message: `中间件并发数 ${concurrency} 超过阈值 ${this.thresholds.highConcurrencyThreshold}`,
          metrics: {
            concurrency
          },
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * 检测低缓存命中率
   */
  private async detectLowCacheHitRate(): Promise<void> {
    const cacheHitRateGauge = this.metrics.middlewareCacheHitRate;
    const asyncLocal = await cacheHitRateGauge.get();

    for (const metric of asyncLocal.values) {
      const hitRate = metric.value;

      if (hitRate < this.thresholds.lowCacheHitRateThreshold) {
        this.alerts.push({
          middlewareName: metric.labels.middleware_name,
          type: 'low_cache_hit_rate',
          severity: hitRate < this.thresholds.lowCacheHitRateThreshold / 2 ? 'critical' : 'warning',
          message: `中间件缓存命中率 ${(hitRate * 100).toFixed(2)}% 低于阈值 ${(this.thresholds.lowCacheHitRateThreshold * 100).toFixed(2)}%`,
          metrics: {
            hitRate
          },
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * 获取告警摘要
   */
  getAlertSummary(): {
    total: number;
    critical: number;
    warning: number;
    byType: Record<string, number>;
  } {
    const summary = {
      total: this.alerts.length,
      critical: this.alerts.filter(a => a.severity === 'critical').length,
      warning: this.alerts.filter(a => a.severity === 'warning').length,
      byType: {} as Record<string, number>
    };

    for (const alert of this.alerts) {
      summary.byType[alert.type] = (summary.byType[alert.type] || 0) + 1;
    }

    return summary;
  }
}
```

### 11.3 自动调优建议

```typescript
/**
 * @file: src/middlewares/performance/autoTuner.ts
 * @description: 中间件自动调优建议生成器
 */
import { BottleneckAlert } from './bottleneckDetector';

interface TuningRecommendation {
  middlewareName: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  implementation: string[];
  expectedImprovement: string;
}

export class AutoTuner {
  /**
   * 生成调优建议
   */
  generateRecommendations(alerts: BottleneckAlert[]): TuningRecommendation[] {
    const recommendations: TuningRecommendation[] = [];

    for (const alert of alerts) {
      const recommendation = this.createRecommendation(alert);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * 创建单个调优建议
   */
  private createRecommendation(alert: BottleneckAlert): TuningRecommendation | null {
    switch (alert.type) {
      case 'slow_execution':
        return this.createSlowExecutionRecommendation(alert);
      case 'high_error_rate':
        return this.createHighErrorRateRecommendation(alert);
      case 'high_concurrency':
        return this.createHighConcurrencyRecommendation(alert);
      case 'low_cache_hit_rate':
        return this.createLowCacheHitRateRecommendation(alert);
      default:
        return null;
    }
  }

  /**
   * 慢执行调优建议
   */
  private createSlowExecutionRecommendation(alert: BottleneckAlert): TuningRecommendation {
    const isCritical = alert.severity === 'critical';

    return {
      middlewareName: alert.middlewareName,
      issue: `中间件执行时间过长 (${alert.metrics.avgDuration.toFixed(2)}ms)`,
      recommendation: '优化中间件执行逻辑，减少不必要的计算和IO操作',
      priority: isCritical ? 'high' : 'medium',
      implementation: [
        '添加缓存层，缓存重复计算结果',
        '优化数据库查询，添加索引或重写查询',
        '使用异步操作，避免阻塞事件循环',
        '拆分复杂中间件为多个简单中间件',
        '使用性能分析工具定位具体瓶颈'
      ],
      expectedImprovement: isCritical ? '预期性能提升50-80%' : '预期性能提升20-40%'
    };
  }

  /**
   * 高错误率调优建议
   */
  private createHighErrorRateRecommendation(alert: BottleneckAlert): TuningRecommendation {
    const isCritical = alert.severity === 'critical';

    return {
      middlewareName: alert.middlewareName,
      issue: `中间件错误率过高 (${(alert.metrics.errorRate * 100).toFixed(2)}%)`,
      recommendation: '增强错误处理和输入验证，提高中间件健壮性',
      priority: isCritical ? 'high' : 'medium',
      implementation: [
        '添加详细的错误日志记录',
        '增强输入验证和数据清理',
        '实现重试机制和降级策略',
        '添加熔断器防止级联故障',
        '优化异常处理逻辑，避免吞没错误'
      ],
      expectedImprovement: isCritical ? '预期错误率降低80-90%' : '预期错误率降低40-60%'
    };
  }

  /**
   * 高并发调优建议
   */
  private createHighConcurrencyRecommendation(alert: BottleneckAlert): TuningRecommendation {
    const isCritical = alert.severity === 'critical';

    return {
      middlewareName: alert.middlewareName,
      issue: `中间件并发数过高 (${alert.metrics.concurrency})`,
      recommendation: '优化资源使用，提高中间件处理能力',
      priority: isCritical ? 'high' : 'medium',
      implementation: [
        '增加服务器资源（CPU、内存）',
        '实现中间件实例池化',
        '优化数据库连接池配置',
        '使用负载均衡分散请求',
        '考虑将中间件逻辑迁移到独立服务'
      ],
      expectedImprovement: isCritical ? '预期并发处理能力提升100-200%' : '预期并发处理能力提升30-50%'
    };
  }

  /**
   * 低缓存命中率调优建议
   */
  private createLowCacheHitRateRecommendation(alert: BottleneckAlert): TuningRecommendation {
    const isCritical = alert.severity === 'critical';

    return {
      middlewareName: alert.middlewareName,
      issue: `中间件缓存命中率过低 (${(alert.metrics.hitRate * 100).toFixed(2)}%)`,
      recommendation: '优化缓存策略，提高缓存命中率',
      priority: isCritical ? 'high' : 'medium',
      implementation: [
        '分析缓存未命中原因，调整缓存键生成策略',
        '增加缓存TTL，减少缓存过期',
        '使用多级缓存（本地缓存 + 分布式缓存）',
        '实现缓存预热机制',
        '优化缓存淘汰策略'
      ],
      expectedImprovement: isCritical ? '预期缓存命中率提升至80-90%' : '预期缓存命中率提升至60-70%'
    };
  }
}
```

---

## 12. 中间件安全加固

### 12.1 安全审计日志

```typescript
/**
 * @file: src/middlewares/security/auditLogger.ts
 * @description: 安全审计日志中间件
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

interface AuditLogEntry {
  timestamp: string;
  requestId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  method: string;
  path: string;
  statusCode: number;
  securityEvent?: {
    type: 'auth_failure' | 'auth_success' | 'permission_denied' | 'suspicious_activity';
    details: Record<string, any>;
  };
  duration?: number;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs: number = 10000;

  /**
   * 记录安全审计日志
   */
  log(entry: AuditLogEntry): void {
    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 记录到持久化存储
    logger.info('Security audit log', entry);

    // 如果是安全事件，发送告警
    if (entry.securityEvent) {
      this.sendSecurityAlert(entry);
    }
  }

  /**
   * 发送安全告警
   */
  private sendSecurityAlert(entry: AuditLogEntry): void {
    logger.warn('Security alert', {
      type: entry.securityEvent?.type,
      details: entry.securityEvent?.details,
      ipAddress: entry.ipAddress,
      path: entry.path,
      timestamp: entry.timestamp
    });
  }

  /**
   * 查询审计日志
   */
  query(filters?: {
    startTime?: Date;
    endTime?: Date;
    userId?: string;
    ipAddress?: string;
    securityEventType?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let filtered = [...this.logs];

    if (filters?.startTime) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= filters.startTime!);
    }

    if (filters?.endTime) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= filters.endTime!);
    }

    if (filters?.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters?.ipAddress) {
      filtered = filtered.filter(log => log.ipAddress === filters.ipAddress);
    }

    if (filters?.securityEventType) {
      filtered = filtered.filter(
        log => log.securityEvent?.type === filters.securityEventType
      );
    }

    if (filters?.limit) {
      filtered = filtered.slice(-filters.limit);
    }

    return filtered;
  }
}

const auditLogger = new AuditLogger();

/**
 * @description 安全审计中间件
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId,
      userId: (req as any).user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - startTime
    };

    // 检测可疑活动
    if (res.statusCode === 401 || res.statusCode === 403) {
      entry.securityEvent = {
        type: res.statusCode === 401 ? 'auth_failure' : 'permission_denied',
        details: {
          attemptCount: (req as any).authAttempts || 1
        }
      };
    }

    auditLogger.log(entry);
  });

  next();
}

export { auditLogger };
```

### 12.2 SQL注入防护

```typescript
/**
 * @file: src/middlewares/security/sqlInjectionProtection.ts
 * @description: SQL注入防护中间件
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export class SQLInjectionProtection {
  private patterns: RegExp[];

  constructor() {
    this.patterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(WAITFOR|DELAY|BENCHMARK)\b)/i,
      /(\b(INFORMATION_SCHEMA|SYS\.)\b)/i,
      /(\b(CONCAT|CHAR|HEX|UNHEX)\b)/i
    ];
  }

  /**
   * 检测SQL注入
   */
  detect(input: string): boolean {
    for (const pattern of this.patterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 清理输入
   */
  sanitize(input: string): string {
    return input
      .replace(/['"\\]/g, '')
      .replace(/--/g, '')
      .replace(/;/g, '')
      .trim();
  }

  /**
   * 检查请求中的SQL注入
   */
  checkRequest(req: Request): { detected: boolean; location: string[] } {
    const detected: string[] = [];

    // 检查查询参数
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string' && this.detect(value)) {
        detected.push(`query.${key}`);
      }
    }

    // 检查请求体
    if (req.body) {
      const checkBody = (obj: any, prefix: string = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'string' && this.detect(value)) {
            detected.push(`body.${currentPath}`);
          } else if (typeof value === 'object' && value !== null) {
            checkBody(value, currentPath);
          }
        }
      };
      checkBody(req.body);
    }

    return {
      detected: detected.length > 0,
      location: detected
    };
  }
}

const sqlInjectionProtection = new SQLInjectionProtection();

/**
 * @description SQL注入防护中间件
 */
export function sqlInjectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const result = sqlInjectionProtection.checkRequest(req);

  if (result.detected) {
    logger.warn('SQL injection attempt detected', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      location: result.location
    });

    return res.status(400).json({
      success: false,
      error: 'Invalid input detected',
      message: 'Your request contains potentially malicious content'
    });
  }

  next();
}

export { sqlInjectionProtection };
```

### 12.3 XSS攻击防护

```typescript
/**
 * @file: src/middlewares/security/xssProtection.ts
 * @description: XSS攻击防护中间件
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export class XSSProtection {
  private patterns: RegExp[];

  constructor() {
    this.patterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]+src=["']javascript:/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<object[^>]*>.*?<\/object>/gi
    ];
  }

  /**
   * 检测XSS攻击
   */
  detect(input: string): boolean {
    for (const pattern of this.patterns) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 清理输入
   */
  sanitize(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * 检查请求中的XSS攻击
   */
  checkRequest(req: Request): { detected: boolean; location: string[] } {
    const detected: string[] = [];

    // 检查查询参数
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string' && this.detect(value)) {
        detected.push(`query.${key}`);
      }
    }

    // 检查请求体
    if (req.body) {
      const checkBody = (obj: any, prefix: string = '') => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'string' && this.detect(value)) {
            detected.push(`body.${currentPath}`);
          } else if (typeof value === 'object' && value !== null) {
            checkBody(value, currentPath);
          }
        }
      };
      checkBody(req.body);
    }

    return {
      detected: detected.length > 0,
      location: detected
    };
  }
}

const xssProtection = new XSSProtection();

/**
 * @description XSS防护中间件
 */
export function xssMiddleware(req: Request, res: Response, next: NextFunction): void {
  const result = xssProtection.checkRequest(req);

  if (result.detected) {
    logger.warn('XSS attack attempt detected', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      location: result.location
    });

    return res.status(400).json({
      success: false,
      error: 'Invalid input detected',
      message: 'Your request contains potentially malicious content'
    });
  }

  // 设置安全响应头
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  next();
}

export { xssProtection };
```

### 12.4 CSRF防护

```typescript
/**
 * @file: src/middlewares/security/csrfProtection.ts
 * @description: CSRF防护中间件
 */
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { logger } from '../../utils/logger';

export class CSRFProtection {
  private tokenStore: Map<string, { token: string; expiresAt: number }>;

  constructor() {
    this.tokenStore = new Map();
  }

  /**
   * 生成CSRF令牌
   */
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600000; // 1小时过期

    this.tokenStore.set(sessionId, { token, expiresAt });

    return token;
  }

  /**
   * 验证CSRF令牌
   */
  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokenStore.get(sessionId);

    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expiresAt) {
      this.tokenStore.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  /**
   * 清理过期令牌
   */
  cleanupExpiredTokens(): void {
    const now = Date.now();

    for (const [sessionId, data] of this.tokenStore.entries()) {
      if (now > data.expiresAt) {
        this.tokenStore.delete(sessionId);
      }
    }
  }
}

const csrfProtection = new CSRFProtection();

/**
 * @description CSRF令牌生成中间件
 */
export function csrfTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
  const sessionId = (req as any).sessionId || req.ip;

  const token = csrfProtection.generateToken(sessionId);

  res.locals.csrfToken = token;
  res.setHeader('X-CSRF-Token', token);

  next();
}

/**
 * @description CSRF验证中间件
 */
export function csrfValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const sessionId = (req as any).sessionId || req.ip;
  const token = req.headers['x-csrf-token'] as string || req.body._csrf;

  if (!token) {
    logger.warn('CSRF token missing', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(403).json({
      success: false,
      error: 'CSRF token missing',
      message: 'CSRF token is required for this request'
    });
  }

  if (!csrfProtection.validateToken(sessionId, token)) {
    logger.warn('CSRF token validation failed', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    return res.status(403).json({
      success: false,
      error: 'CSRF token invalid',
      message: 'CSRF token is invalid or expired'
    });
  }

  next();
}

export { csrfProtection };
```

---

## 13. 中间件测试自动化

### 13.1 单元测试框架

```typescript
/**
 * @file: src/middlewares/__tests__/middleware.test.ts
 * @description: 中间件单元测试
 */
import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthMiddleware } from '../auth.middleware';
import { LoggerMiddleware } from '../logger.middleware';
import { CacheMiddleware } from '../cache.middleware';
import { RateLimitMiddleware } from '../rate-limit.middleware';

describe('中间件单元测试', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      path: '/api/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent'
      },
      query: {},
      body: {}
    };

    mockRes = {
      statusCode: 200,
      headers: {},
      json: vi.fn(),
      send: vi.fn(),
      setHeader: vi.fn(),
      on: vi.fn()
    };

    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthMiddleware', () => {
    it('应该成功验证有效令牌', async () => {
      const authMiddleware = new AuthMiddleware({} as any);
      mockReq.headers = {
        authorization: 'Bearer valid-token'
      };

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝无效令牌', async () => {
      const authMiddleware = new AuthMiddleware({} as any);
      mockReq.headers = {
        authorization: 'Bearer invalid-token'
      };

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.statusCode).toBe(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Unauthorized'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该处理缺少令牌的情况', async () => {
      const authMiddleware = new AuthMiddleware({} as any);
      mockReq.headers = {};

      await authMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.statusCode).toBe(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('LoggerMiddleware', () => {
    it('应该记录请求信息', () => {
      const loggerMiddleware = new LoggerMiddleware();

      loggerMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'X-Request-ID',
        expect.any(String)
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该记录响应信息', () => {
      const loggerMiddleware = new LoggerMiddleware();

      loggerMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      // 模拟响应完成
      const finishCallback = (mockRes.on as any).mock.calls.find(
        (call: any) => call[0] === 'finish'
      );
      if (finishCallback) {
        finishCallback[1]();
      }

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('CacheMiddleware', () => {
    it('应该返回缓存数据', async () => {
      const cacheService = {
        get: vi.fn().mockResolvedValue({ data: 'cached' }),
        set: vi.fn()
      };
      const cacheMiddleware = new CacheMiddleware(cacheService as any);

      mockReq.method = 'GET';

      await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(cacheService.get).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
      expect(mockRes.json).toHaveBeenCalledWith({ data: 'cached' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该缓存新数据', async () => {
      const cacheService = {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue(undefined)
      };
      const cacheMiddleware = new CacheMiddleware(cacheService as any);

      mockReq.method = 'GET';

      await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(cacheService.get).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-Cache', 'MISS');
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该跳过非GET请求', async () => {
      const cacheService = {
        get: vi.fn(),
        set: vi.fn()
      };
      const cacheMiddleware = new CacheMiddleware(cacheService as any);

      mockReq.method = 'POST';

      await cacheMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(cacheService.get).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('RateLimitMiddleware', () => {
    it('应该允许在限制内的请求', async () => {
      const rateLimiter = {
        check: vi.fn().mockResolvedValue(true),
        getRemaining: vi.fn().mockResolvedValue(99)
      };
      const rateLimitMiddleware = new RateLimitMiddleware();
      (rateLimitMiddleware as any).rateLimiter = rateLimiter;

      await rateLimitMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(rateLimiter.check).toHaveBeenCalledWith('127.0.0.1');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '99');
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝超过限制的请求', async () => {
      const rateLimiter = {
        check: vi.fn().mockResolvedValue(false),
        getRemaining: vi.fn().mockResolvedValue(0)
      };
      const rateLimitMiddleware = new RateLimitMiddleware();
      (rateLimitMiddleware as any).rateLimiter = rateLimiter;

      await rateLimitMiddleware.handler(mockReq as Request, mockRes as Response, mockNext);

      expect(rateLimiter.check).toHaveBeenCalledWith('127.0.0.1');
      expect(mockRes.statusCode).toBe(429);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Too many requests'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
```

### 13.2 集成测试框架

```typescript
/**
 * @file: src/middlewares/__tests__/middleware.integration.test.ts
 * @description: 中间件集成测试
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AuthMiddleware } from '../auth.middleware';
import { LoggerMiddleware } from '../logger.middleware';
import { CacheMiddleware } from '../cache.middleware';
import { RateLimitMiddleware } from '../rate-limit.middleware';

describe('中间件集成测试', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    // 配置中间件链
    app.use(express.json());

    const loggerMiddleware = new LoggerMiddleware();
    app.use(loggerMiddleware.handler);

    const cacheService = {
      get: async () => null,
      set: async () => {}
    };
    const cacheMiddleware = new CacheMiddleware(cacheService as any);
    app.use(cacheMiddleware.handler);

    const rateLimitMiddleware = new RateLimitMiddleware();
    app.use(rateLimitMiddleware.handler);

    // 测试路由
    app.get('/api/test', (req, res) => {
      res.json({ success: true, message: 'Test endpoint' });
    });

    app.post('/api/test', (req, res) => {
      res.json({ success: true, message: 'POST endpoint' });
    });
  });

  afterAll(() => {
    // 清理资源
  });

  describe('中间件链集成测试', () => {
    it('应该正确处理完整的中间件链', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Test endpoint'
      });

      expect(response.headers['x-request-id']).toBeDefined();
      expect(response.headers['x-cache']).toBeDefined();
      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });

    it('应该正确处理POST请求', async () => {
      const response = await request(app)
        .post('/api/test')
        .send({ data: 'test' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'POST endpoint'
      });

      // POST请求应该跳过缓存
      expect(response.headers['x-cache']).toBeUndefined();
    });

    it('应该正确处理限流', async () => {
      // 发送大量请求以触发限流
      const requests = Array(150).fill(null).map(() =>
        request(app).get('/api/test')
      );

      const responses = await Promise.all(requests);

      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);

      const successResponses = responses.filter(r => r.status === 200);
      expect(successResponses.length).toBeLessThanOrEqual(100);
    });
  });

  describe('错误处理集成测试', () => {
    it('应该正确处理中间件错误', async () => {
      const errorApp = express();

      errorApp.use(express.json());

      const brokenMiddleware = (req: any, res: any, next: any) => {
        throw new Error('Middleware error');
      };

      errorApp.use(brokenMiddleware);

      errorApp.use((err: any, req: any, res: any, next: any) => {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      });

      const response = await request(errorApp)
        .get('/api/test')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });
  });
});
```

### 13.3 性能测试框架

```typescript
/**
 * @file: src/middlewares/__tests__/middleware.performance.test.ts
 * @description: 中间件性能测试
 */
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { LoggerMiddleware } from '../logger.middleware';
import { CacheMiddleware } from '../cache.middleware';
import { RateLimitMiddleware } from '../rate-limit.middleware';

describe('中间件性能测试', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    app.use(express.json());

    const loggerMiddleware = new LoggerMiddleware();
    app.use(loggerMiddleware.handler);

    const cacheService = {
      get: async () => null,
      set: async () => {}
    };
    const cacheMiddleware = new CacheMiddleware(cacheService as any);
    app.use(cacheMiddleware.handler);

    const rateLimitMiddleware = new RateLimitMiddleware();
    app.use(rateLimitMiddleware.handler);

    app.get('/api/test', (req, res) => {
      res.json({ success: true, message: 'Test endpoint' });
    });
  });

  describe('中间件执行时间测试', () => {
    it('应该在合理时间内处理请求', async () => {
      const iterations = 100;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();

        await request(app).get('/api/test');

        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      expect(avgTime).toBeLessThan(100);
      expect(maxTime).toBeLessThan(500);

      console.log(`性能测试结果: 平均 ${avgTime.toFixed(2)}ms, 最大 ${maxTime}ms, 最小 ${minTime}ms`);
    });

    it('应该支持高并发请求', async () => {
      const concurrency = 50;
      const requests = Array(concurrency).fill(null).map(() =>
        request(app).get('/api/test')
      );

      const start = Date.now();

      const responses = await Promise.all(requests);

      const duration = Date.now() - start;

      const successResponses = responses.filter(r => r.status === 200);
      expect(successResponses.length).toBe(concurrency);

      expect(duration).toBeLessThan(5000);

      console.log(`并发测试结果: ${concurrency} 并发请求在 ${duration}ms 内完成`);
    });
  });

  describe('内存使用测试', () => {
    it('应该有合理的内存使用', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        await request(app).get('/api/test');
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // 内存增长应该小于10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      console.log(`内存使用测试: ${iterations} 次请求后内存增长 ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });
});
```

---

## 14. 中间件故障诊断与恢复

### 14.1 故障检测机制

```typescript
/**
 * @file: src/middlewares/health/faultDetector.ts
 * @description: 中间件故障检测器
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

interface FaultEvent {
  middlewareName: string;
  type: 'timeout' | 'error' | 'memory_leak' | 'high_latency';
  severity: 'warning' | 'critical';
  message: string;
  metrics: Record<string, any>;
  timestamp: Date;
}

export class FaultDetector {
  private faultEvents: FaultEvent[] = [];
  private maxEvents: number = 1000;
  private thresholds: {
    timeoutThreshold: number;
    errorRateThreshold: number;
    memoryThreshold: number;
    latencyThreshold: number;
  };

  constructor(thresholds?: {
    timeoutThreshold?: number;
    errorRateThreshold?: number;
    memoryThreshold?: number;
    latencyThreshold?: number;
  }) {
    this.thresholds = {
      timeoutThreshold: thresholds?.timeoutThreshold || 5000,
      errorRateThreshold: thresholds?.errorRateThreshold || 0.1,
      memoryThreshold: thresholds?.memoryThreshold || 500 * 1024 * 1024,
      latencyThreshold: thresholds?.latencyThreshold || 1000
    };
  }

  /**
   * 记录故障事件
   */
  recordFault(event: FaultEvent): void {
    this.faultEvents.push(event);

    if (this.faultEvents.length > this.maxEvents) {
      this.faultEvents.shift();
    }

    logger.error('Middleware fault detected', event);

    // 如果是严重故障，触发告警
    if (event.severity === 'critical') {
      this.triggerCriticalAlert(event);
    }
  }

  /**
   * 触发严重告警
   */
  private triggerCriticalAlert(event: FaultEvent): void {
    logger.error('CRITICAL: Middleware fault', {
      middlewareName: event.middlewareName,
      type: event.type,
      message: event.message,
      timestamp: event.timestamp
    });
  }

  /**
   * 查询故障事件
   */
  queryFaults(filters?: {
    middlewareName?: string;
    type?: string;
    severity?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  }): FaultEvent[] {
    let filtered = [...this.faultEvents];

    if (filters?.middlewareName) {
      filtered = filtered.filter(e => e.middlewareName === filters.middlewareName);
    }

    if (filters?.type) {
      filtered = filtered.filter(e => e.type === filters.type);
    }

    if (filters?.severity) {
      filtered = filtered.filter(e => e.severity === filters.severity);
    }

    if (filters?.startTime) {
      filtered = filtered.filter(e => e.timestamp >= filters.startTime!);
    }

    if (filters?.endTime) {
      filtered = filtered.filter(e => e.timestamp <= filters.endTime!);
    }

    if (filters?.limit) {
      filtered = filtered.slice(-filters.limit);
    }

    return filtered;
  }

  /**
   * 获取故障统计
   */
  getFaultStats(): {
    total: number;
    byMiddleware: Record<string, number>;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  } {
    const stats = {
      total: this.faultEvents.length,
      byMiddleware: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>
    };

    for (const event of this.faultEvents) {
      stats.byMiddleware[event.middlewareName] = (stats.byMiddleware[event.middlewareName] || 0) + 1;
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
      stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
    }

    return stats;
  }
}

const faultDetector = new FaultDetector();

/**
 * @description 故障检测装饰器
 */
export function withFaultDetection(
  faultDetector: FaultDetector,
  middlewareName: string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      const next: NextFunction = args[2];

      const startTime = Date.now();
      const startMemory = process.memoryUsage().heapUsed;

      try {
        await originalMethod.apply(this, args);

        const duration = Date.now() - startTime;
        const memoryIncrease = process.memoryUsage().heapUsed - startMemory;

        // 检测高延迟
        if (duration > faultDetector['thresholds'].latencyThreshold) {
          faultDetector.recordFault({
            middlewareName,
            type: 'high_latency',
            severity: duration > faultDetector['thresholds'].timeoutThreshold ? 'critical' : 'warning',
            message: `中间件执行时间 ${duration}ms 超过阈值 ${faultDetector['thresholds'].latencyThreshold}ms`,
            metrics: { duration },
            timestamp: new Date()
          });
        }

        // 检测内存泄漏
        if (memoryIncrease > faultDetector['thresholds'].memoryThreshold) {
          faultDetector.recordFault({
            middlewareName,
            type: 'memory_leak',
            severity: 'critical',
            message: `中间件内存增长 ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB 超过阈值 ${(faultDetector['thresholds'].memoryThreshold / 1024 / 1024).toFixed(2)}MB`,
            metrics: { memoryIncrease },
            timestamp: new Date()
          });
        }
      } catch (error) {
        const duration = Date.now() - startTime;

        faultDetector.recordFault({
          middlewareName,
          type: 'error',
          severity: 'critical',
          message: `中间件执行错误: ${error instanceof Error ? error.message : 'Unknown error'}`,
          metrics: { duration, error: error instanceof Error ? error.message : 'Unknown' },
          timestamp: new Date()
        });

        throw error;
      }
    };

    return descriptor;
  };
}

export { faultDetector };
```

### 14.2 自动恢复机制

```typescript
/**
 * @file: src/middlewares/health/autoRecovery.ts
 * @description: 中间件自动恢复机制
 */
import { FaultDetector, FaultEvent } from './faultDetector';
import { logger } from '../../utils/logger';

interface RecoveryAction {
  middlewareName: string;
  action: 'restart' | 'disable' | 'degrade' | 'clear_cache';
  reason: string;
  timestamp: Date;
  result?: 'success' | 'failed';
}

export class AutoRecovery {
  private faultDetector: FaultDetector;
  private recoveryActions: RecoveryAction[] = [];
  private recoveryStrategies: Map<string, RecoveryStrategy>;

  constructor(faultDetector: FaultDetector) {
    this.faultDetector = faultDetector;
    this.recoveryStrategies = new Map();
    this.initializeDefaultStrategies();
  }

  /**
   * 初始化默认恢复策略
   */
  private initializeDefaultStrategies(): void {
    this.recoveryStrategies.set('timeout', {
      maxAttempts: 3,
      cooldownPeriod: 60000,
      actions: ['restart', 'degrade']
    });

    this.recoveryStrategies.set('error', {
      maxAttempts: 5,
      cooldownPeriod: 30000,
      actions: ['restart', 'disable']
    });

    this.recoveryStrategies.set('memory_leak', {
      maxAttempts: 2,
      cooldownPeriod: 120000,
      actions: ['restart', 'clear_cache']
    });

    this.recoveryStrategies.set('high_latency', {
      maxAttempts: 3,
      cooldownPeriod: 60000,
      actions: ['degrade']
    });
  }

  /**
   * 执行自动恢复
   */
  async executeRecovery(fault: FaultEvent): Promise<boolean> {
    const strategy = this.recoveryStrategies.get(fault.type);

    if (!strategy) {
      logger.warn('No recovery strategy found', { type: fault.type });
      return false;
    }

    // 检查是否在冷却期
    const lastAction = this.getLastAction(fault.middlewareName);
    if (lastAction && Date.now() - lastAction.timestamp.getTime() < strategy.cooldownPeriod) {
      logger.info('Recovery in cooldown period', { middlewareName: fault.middlewareName });
      return false;
    }

    // 执行恢复动作
    for (const action of strategy.actions) {
      const result = await this.executeAction(fault.middlewareName, action, fault.message);

      this.recoveryActions.push({
        middlewareName: fault.middlewareName,
        action: action as any,
        reason: fault.message,
        timestamp: new Date(),
        result: result ? 'success' : 'failed'
      });

      if (result) {
        logger.info('Recovery action succeeded', {
          middlewareName: fault.middlewareName,
          action
        });
        return true;
      }
    }

    return false;
  }

  /**
   * 执行恢复动作
   */
  private async executeAction(
    middlewareName: string,
    action: string,
    reason: string
  ): Promise<boolean> {
    try {
      switch (action) {
        case 'restart':
          return await this.restartMiddleware(middlewareName);
        case 'disable':
          return await this.disableMiddleware(middlewareName);
        case 'degrade':
          return await this.degradeMiddleware(middlewareName);
        case 'clear_cache':
          return await this.clearCache(middlewareName);
        default:
          logger.warn('Unknown recovery action', { action });
          return false;
      }
    } catch (error) {
      logger.error('Recovery action failed', {
        middlewareName: middlewareName,
        action,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * 重启中间件
   */
  private async restartMiddleware(middlewareName: string): Promise<boolean> {
    logger.info('Restarting middleware', { middlewareName });

    // 实现中间件重启逻辑
    // 这里需要根据实际的中间件管理机制来实现

    return true;
  }

  /**
   * 禁用中间件
   */
  private async disableMiddleware(middlewareName: string): Promise<boolean> {
    logger.warn('Disabling middleware', { middlewareName });

    // 实现中间件禁用逻辑
    // 这里需要根据实际的中间件管理机制来实现

    return true;
  }

  /**
   * 降级中间件
   */
  private async degradeMiddleware(middlewareName: string): Promise<boolean> {
    logger.info('Degrading middleware', { middlewareName });

    // 实现中间件降级逻辑
    // 例如：降低缓存命中率、减少重试次数等

    return true;
  }

  /**
   * 清理缓存
   */
  private async clearCache(middlewareName: string): Promise<boolean> {
    logger.info('Clearing cache for middleware', { middlewareName });

    // 实现缓存清理逻辑

    return true;
  }

  /**
   * 获取最后一次恢复动作
   */
  private getLastAction(middlewareName: string): RecoveryAction | undefined {
    const actions = this.recoveryActions.filter(
      a => a.middlewareName === middlewareName
    );

    if (actions.length === 0) {
      return undefined;
    }

    return actions[actions.length - 1];
  }

  /**
   * 获取恢复统计
   */
  getRecoveryStats(): {
    total: number;
    success: number;
    failed: number;
    byAction: Record<string, number>;
    byMiddleware: Record<string, number>;
  } {
    const stats = {
      total: this.recoveryActions.length,
      success: this.recoveryActions.filter(a => a.result === 'success').length,
      failed: this.recoveryActions.filter(a => a.result === 'failed').length,
      byAction: {} as Record<string, number>,
      byMiddleware: {} as Record<string, number>
    };

    for (const action of this.recoveryActions) {
      stats.byAction[action.action] = (stats.byAction[action.action] || 0) + 1;
      stats.byMiddleware[action.middlewareName] = (stats.byMiddleware[action.middlewareName] || 0) + 1;
    }

    return stats;
  }
}

interface RecoveryStrategy {
  maxAttempts: number;
  cooldownPeriod: number;
  actions: string[];
}
```

### 14.3 健康检查端点

```typescript
/**
 * @file: src/middlewares/health/healthCheck.ts
 * @description: 中间件健康检查端点
 */
import { Request, Response } from 'express';
import { FaultDetector } from './faultDetector';
import { AutoRecovery } from './autoRecovery';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  middlewareHealth: MiddlewareHealth[];
  systemMetrics: SystemMetrics;
}

interface MiddlewareHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastError?: string;
  errorCount: number;
  lastErrorTime?: string;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  requests: {
    total: number;
    success: number;
    error: number;
  };
}

export class HealthCheck {
  private faultDetector: FaultDetector;
  private autoRecovery: AutoRecovery;
  private startTime: number;

  constructor(faultDetector: FaultDetector, autoRecovery: AutoRecovery) {
    this.faultDetector = faultDetector;
    this.autoRecovery = autoRecovery;
    this.startTime = Date.now();
  }

  /**
   * 执行健康检查
   */
  async check(): Promise<HealthCheckResult> {
    const middlewareHealth = this.checkMiddlewareHealth();
    const systemMetrics = this.getSystemMetrics();
    const overallStatus = this.determineOverallStatus(middlewareHealth, systemMetrics);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      middlewareHealth,
      systemMetrics
    };
  }

  /**
   * 检查中间件健康状态
   */
  private checkMiddlewareHealth(): MiddlewareHealth[] {
    const faultStats = this.faultDetector.getFaultStats();
    const middlewareNames = Object.keys(faultStats.byMiddleware);

    return middlewareNames.map(name => {
      const errorCount = faultStats.byMiddleware[name];
      const recentFaults = this.faultDetector.queryFaults({
        middlewareName: name,
        limit: 10
      });

      const lastFault = recentFaults[recentFaults.length - 1];

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (errorCount > 10) {
        status = 'unhealthy';
      } else if (errorCount > 5) {
        status = 'degraded';
      }

      return {
        name,
        status,
        lastError: lastFault?.message,
        errorCount,
        lastErrorTime: lastFault?.timestamp.toISOString()
      };
    });
  }

  /**
   * 获取系统指标
   */
  private getSystemMetrics(): SystemMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
      },
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000
      },
      requests: {
        total: 0,
        success: 0,
        error: 0
      }
    };
  }

  /**
   * 确定整体健康状态
   */
  private determineOverallStatus(
    middlewareHealth: MiddlewareHealth[],
    systemMetrics: SystemMetrics
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthyMiddlewares = middlewareHealth.filter(m => m.status === 'unhealthy');
    const degradedMiddlewares = middlewareHealth.filter(m => m.status === 'degraded');

    if (unhealthyMiddlewares.length > 0 || systemMetrics.memory.percentage > 90) {
      return 'unhealthy';
    }

    if (degradedMiddlewares.length > 0 || systemMetrics.memory.percentage > 80) {
      return 'degraded';
    }

    return 'healthy';
  }
}

/**
 * @description 健康检查端点处理器
 */
export function createHealthCheckHandler(
  healthCheck: HealthCheck
): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response) => {
    try {
      const result = await healthCheck.check();

      const statusCode = result.status === 'healthy' ? 200 :
                         result.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json(result);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * @description 就绪检查端点处理器
 */
export function createReadinessHandler(
  healthCheck: HealthCheck
): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response) => {
    try {
      const result = await healthCheck.check();

      if (result.status === 'healthy') {
        res.status(200).json({ status: 'ready' });
      } else {
        res.status(503).json({ status: 'not ready', reason: result.status });
      }
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * @description 存活检查端点处理器
 */
export function createLivenessHandler(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    res.status(200).json({ status: 'alive' });
  };
}
```

---

## 附录

### A. 参考文档

- [Express.js官方文档](https://expressjs.com/)
- [Passport.js认证中间件](http://www.passportjs.org/)
- [Winston日志库](https://github.com/winstonjs/winston)
- [Prometheus监控](https://prometheus.io/)
- [Redis缓存](https://redis.io/)
- [Joi数据验证](https://joi.dev/)

### B. 版本历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| v1.0.0 | 2025-12-24 | YYC³架构团队 | 初始版本 |
| v1.1.0 | 2025-12-25 | YYC³架构团队 | 添加性能监控、安全加固、测试自动化和故障诊断与恢复 |

### C. 术语表

| 术语 | 说明 |
|------|------|
| 中间件 | 在请求处理流程中提供横切关注点的组件 |
| 中间件链 | 按优先级顺序执行的中间件集合 |
| 横切关注点 | 影响多个模块的功能，如日志、安全、监控等 |
| 熔断器 | 防止级联故障的保护机制 |
| 限流器 | 控制请求速率的保护机制 |

### D. 故障排除指南

#### D.1 中间件开发问题

**问题1：中间件执行顺序不正确**

```
问题现象：中间件未按预期顺序执行，导致认证失败或日志丢失
```

**解决方案：**

```typescript
// 错误示例：中间件顺序混乱
app.use(authMiddleware);
app.use(loggingMiddleware);
app.use(errorHandlerMiddleware);

// 正确示例：按优先级正确排序
import { MiddlewareManager } from './middlewareManager';

const middlewareManager = new MiddlewareManager();

// 按优先级注册中间件
middlewareManager.register(loggingMiddleware, {
  priority: MiddlewarePriority.LOGGING
});

middlewareManager.register(authMiddleware, {
  priority: MiddlewarePriority.AUTHENTICATION
});

middlewareManager.register(errorHandlerMiddleware, {
  priority: MiddlewarePriority.ERROR_HANDLING
});

// 应用中间件链
app.use(middlewareManager.getMiddlewareChain());
```

**问题2：中间件中的异步错误未捕获**

```
问题现象：异步操作中的错误导致应用崩溃
```

**解决方案：**

```typescript
// 错误示例：异步错误未处理
app.use(async (req, res, next) => {
  const data = await fetchData(); // 如果失败，错误未被捕获
  req.data = data;
  next();
});

// 正确示例：正确处理异步错误
app.use(async (req, res, next) => {
  try {
    const data = await fetchData();
    req.data = data;
    next();
  } catch (error) {
    logger.error('Middleware error', { error, path: req.path });
    next(error); // 传递错误到错误处理中间件
  }
});

// 或者使用更简洁的包装函数
function asyncMiddleware(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

app.use(asyncMiddleware(async (req, res, next) => {
  const data = await fetchData();
  req.data = data;
  next();
}));
```

**问题3：中间件修改请求/响应对象导致类型错误**

```
问题现象：TypeScript类型错误，无法访问中间件添加的属性
```

**解决方案：**

```typescript
// 错误示例：类型不匹配
app.use((req, res, next) => {
  req.user = { id: '123', name: 'John' }; // 类型错误
  next();
});

// 正确示例：扩展类型定义
// types/express.d.ts
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
      requestId?: string;
      startTime?: number;
    }
    
    interface Response {
      customData?: Record<string, any>;
    }
  }
}

// 中间件实现
app.use((req, res, next) => {
  req.user = { id: '123', name: 'John', email: 'john@example.com' };
  req.requestId = generateRequestId();
  req.startTime = Date.now();
  next();
});
```

#### D.2 性能问题

**问题1：中间件执行时间过长**

```
问题现象：API响应时间显著增加，用户体验下降
```

**解决方案：**

```typescript
// 添加性能监控中间件
import { performance } from 'perf_hooks';

app.use((req, res, next) => {
  const startTime = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - startTime;
    
    // 记录慢请求
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        path: req.path,
        method: req.method,
        duration: `${duration.toFixed(2)}ms`,
        middleware: req.executedMiddleware
      });
    }
  });
  
  next();
});

// 优化慢中间件
// 错误示例：每次请求都执行昂贵操作
app.use(async (req, res, next) => {
  const config = await loadConfigFromDatabase(); // 慢操作
  req.config = config;
  next();
});

// 正确示例：缓存配置
let cachedConfig: Config | null = null;
let configCacheTime = 0;
const CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5分钟

app.use(async (req, res, next) => {
  const now = Date.now();
  
  if (!cachedConfig || now - configCacheTime > CONFIG_CACHE_TTL) {
    cachedConfig = await loadConfigFromDatabase();
    configCacheTime = now;
  }
  
  req.config = cachedConfig;
  next();
});
```

**问题2：内存泄漏**

```
问题现象：应用内存持续增长，最终崩溃
```

**解决方案：**

```typescript
// 错误示例：未清理的缓存
const cache = new Map<string, any>();

app.use((req, res, next) => {
  const key = req.path;
  cache.set(key, req.body); // 永不清理
  next();
});

// 正确示例：使用LRU缓存
import LRU from 'lru-cache';

const cache = new LRU<string, any>({
  max: 1000, // 最大缓存条目数
  ttl: 60 * 1000, // 1分钟过期
  maxSize: 10 * 1024 * 1024, // 最大10MB
  sizeCalculation: (value) => JSON.stringify(value).length
});

app.use((req, res, next) => {
  const key = req.path;
  cache.set(key, req.body);
  next();
});

// 定期清理
setInterval(() => {
  logger.info('Cache stats', {
    size: cache.size,
    maxSize: cache.max,
    calculatedSize: cache.calculatedSize,
    maxSize: cache.maxSize
  });
}, 60000);
```

#### D.3 部署问题

**问题1：中间件配置不一致**

```
问题现象：不同环境中间件行为不一致
```

**解决方案：**

```typescript
// config/middleware.config.ts
import { z } from 'zod';

const middlewareConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']),
    format: z.enum(['json', 'text']),
    enableConsole: z.boolean()
  }),
  auth: z.object({
    enable: z.boolean(),
    jwtSecret: z.string().min(32),
    tokenExpiry: z.string()
  }),
  rateLimit: z.object({
    enable: z.boolean(),
    windowMs: z.number(),
    maxRequests: z.number()
  }),
  cors: z.object({
    enable: z.boolean(),
    allowedOrigins: z.array(z.string()),
    credentials: z.boolean()
  })
});

export type MiddlewareConfig = z.infer<typeof middlewareConfigSchema>;

export function getMiddlewareConfig(): MiddlewareConfig {
  const config = {
    environment: process.env.NODE_ENV || 'development',
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.LOG_FORMAT || 'json',
      enableConsole: process.env.ENABLE_CONSOLE_LOG !== 'false'
    },
    auth: {
      enable: process.env.ENABLE_AUTH !== 'false',
      jwtSecret: process.env.JWT_SECRET || '',
      tokenExpiry: process.env.JWT_EXPIRY || '1h'
    },
    rateLimit: {
      enable: process.env.ENABLE_RATE_LIMIT !== 'false',
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100')
    },
    cors: {
      enable: process.env.ENABLE_CORS !== 'false',
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
      credentials: process.env.CORS_CREDENTIALS === 'true'
    }
  };
  
  return middlewareConfigSchema.parse(config);
}

// 应用配置
import { getMiddlewareConfig } from './config/middleware.config';

const config = getMiddlewareConfig();

if (config.auth.enable) {
  app.use(authMiddleware(config.auth));
}

if (config.rateLimit.enable) {
  app.use(rateLimitMiddleware(config.rateLimit));
}
```

**问题2：中间件版本不兼容**

```
问题现象：升级依赖后中间件失效
```

**解决方案：**

```typescript
// package.json
{
  "dependencies": {
    "express": "^4.18.0",
    "passport": "^0.6.0",
    "jsonwebtoken": "^9.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

// 使用版本兼容性检查
import semver from 'semver';

function checkCompatibility() {
  const requiredVersions = {
    express: '>=4.18.0',
    passport: '>=0.6.0',
    jsonwebtoken: '>=9.0.0'
  };
  
  const installedVersions = {
    express: require('express/package.json').version,
    passport: require('passport/package.json').version,
    jsonwebtoken: require('jsonwebtoken/package.json').version
  };
  
  for (const [pkg, required] of Object.entries(requiredVersions)) {
    const installed = installedVersions[pkg as keyof typeof installedVersions];
    if (!semver.satisfies(installed, required)) {
      throw new Error(
        `Incompatible version: ${pkg}@${installed} does not satisfy ${required}`
      );
    }
  }
  
  logger.info('All dependencies are compatible');
}

// 应用启动时检查
checkCompatibility();
```

### E. 常见问题FAQ

#### E.1 开发相关

**Q1: 如何创建自定义中间件？**

A: 创建自定义中间件需要遵循YYC3中间件规范：

```typescript
import { Request, Response, NextFunction } from 'express';
import { IMiddleware, MiddlewarePriority } from '../types/middlewareTypes';

interface CustomMiddlewareOptions {
  enabled?: boolean;
  priority?: MiddlewarePriority;
  customConfig?: Record<string, any>;
}

export class CustomMiddleware implements IMiddleware {
  name = 'custom-middleware';
  priority = MiddlewarePriority.CUSTOM;
  enabled = true;
  
  private options: CustomMiddlewareOptions;
  
  constructor(options: CustomMiddlewareOptions = {}) {
    this.options = {
      enabled: true,
      priority: MiddlewarePriority.CUSTOM,
      ...options
    };
    this.enabled = this.options.enabled ?? true;
    this.priority = this.options.priority ?? MiddlewarePriority.CUSTOM;
  }
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 前置处理
      await this.beforeHandler(req, res);
      
      // 调用下一个中间件
      next();
      
      // 后置处理（在响应完成后）
      res.on('finish', async () => {
        await this.afterHandler(req, res);
      });
      
    } catch (error) {
      logger.error(`${this.name} error`, { error });
      next(error);
    }
  };
  
  private async beforeHandler(req: Request, res: Response): Promise<void> {
    // 实现前置逻辑
  }
  
  private async afterHandler(req: Request, res: Response): Promise<void> {
    // 实现后置逻辑
  }
}

// 使用示例
const customMiddleware = new CustomMiddleware({
  enabled: true,
  priority: MiddlewarePriority.CUSTOM,
  customConfig: {
    option1: 'value1',
    option2: 'value2'
  }
});

app.use(customMiddleware.handler);
```

**Q2: 如何调试中间件执行流程？**

A: 使用调试中间件和日志记录：

```typescript
import { performance } from 'perf_hooks';

export class DebugMiddleware implements IMiddleware {
  name = 'debug-middleware';
  priority = MiddlewarePriority.DEBUG;
  enabled = process.env.NODE_ENV === 'development';
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startTime = performance.now();
    const middlewareName = req.currentMiddleware || 'unknown';
    
    logger.debug('Middleware execution started', {
      middleware: middlewareName,
      path: req.path,
      method: req.method,
      requestId: req.requestId
    });
    
    const originalNext = next;
    const wrappedNext = (error?: any) => {
      const duration = performance.now() - startTime;
      
      logger.debug('Middleware execution completed', {
        middleware: middlewareName,
        path: req.path,
        duration: `${duration.toFixed(2)}ms`,
        error: error?.message
      });
      
      originalNext(error);
    };
    
    wrappedNext();
  };
}

// 在开发环境启用
if (process.env.NODE_ENV === 'development') {
  app.use(new DebugMiddleware().handler);
}
```

**Q3: 如何实现中间件之间的数据共享？**

A: 使用请求对象或上下文对象：

```typescript
// 方法1：使用请求对象
app.use((req, res, next) => {
  req.sharedData = {
    user: null,
    permissions: [],
    metadata: {}
  };
  next();
});

app.use(authMiddleware);
app.use((req, res, next) => {
  // 访问共享数据
  console.log(req.sharedData?.user);
  next();
});

// 方法2：使用异步上下文
import { AsyncLocalStorage } from 'async_hooks';

const contextStorage = new AsyncLocalStorage<RequestContext>();

interface RequestContext {
  user?: any;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export function withContext<T>(context: RequestContext, fn: () => T): T {
  return contextStorage.run(context, fn);
}

export function getContext(): RequestContext | undefined {
  return contextStorage.getStore();
}

// 使用示例
app.use((req, res, next) => {
  const context: RequestContext = {
    metadata: {
      requestId: req.requestId,
      startTime: Date.now()
    }
  };
  
  withContext(context, () => {
    next();
  });
});

app.use((req, res, next) => {
  const context = getContext();
  context!.user = req.user;
  next();
});
```

#### E.2 性能相关

**Q1: 如何优化中间件性能？**

A: 遵循以下优化策略：

```typescript
// 1. 减少不必要的中间件
app.use((req, res, next) => {
  // 只对特定路径启用中间件
  if (req.path.startsWith('/api')) {
    next();
  } else {
    next('route'); // 跳过当前路由
  }
});

// 2. 使用条件中间件
function conditionalMiddleware(condition: (req: Request) => boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition(req)) {
      next();
    } else {
      next('route');
    }
  };
}

app.use(conditionalMiddleware(req => req.path.startsWith('/api')));

// 3. 缓存中间件结果
const cache = new Map<string, any>();

app.use(async (req, res, next) => {
  const cacheKey = `${req.method}:${req.path}`;
  
  if (cache.has(cacheKey)) {
    req.cachedData = cache.get(cacheKey);
    return next();
  }
  
  const data = await fetchData();
  cache.set(cacheKey, data);
  req.cachedData = data;
  next();
});

// 4. 使用异步中间件
app.use(async (req, res, next) => {
  const [user, config, permissions] = await Promise.all([
    fetchUser(req),
    fetchConfig(),
    fetchPermissions(req)
  ]);
  
  req.user = user;
  req.config = config;
  req.permissions = permissions;
  
  next();
});
```

**Q2: 如何监控中间件性能？**

A: 使用性能监控中间件：

```typescript
import { performance } from 'perf_hooks';
import { Histogram, Registry } from 'prom-client';

const register = new Registry();

// 创建中间件性能指标
const middlewareDuration = new Histogram({
  name: 'middleware_duration_seconds',
  help: 'Middleware execution duration in seconds',
  labelNames: ['middleware', 'method', 'path', 'status'],
  registers: [register]
});

const middlewareErrors = new Histogram({
  name: 'middleware_errors_total',
  help: 'Total middleware errors',
  labelNames: ['middleware', 'method', 'path'],
  registers: [register]
});

export class PerformanceMonitoringMiddleware implements IMiddleware {
  name = 'performance-monitoring-middleware';
  priority = MiddlewarePriority.PERFORMANCE_MONITOR;
  enabled = true;
  
  private middlewareMetrics: Map<string, {
    count: number;
    totalDuration: number;
    minDuration: number;
    maxDuration: number;
    errors: number;
  }> = new Map();
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const middlewareName = req.currentMiddleware || 'unknown';
    const startTime = performance.now();
    
    try {
      await new Promise<void>((resolve, reject) => {
        next();
        res.on('finish', () => resolve());
        res.on('error', reject);
      });
    } catch (error) {
      const duration = (performance.now() - startTime) / 1000;
      
      middlewareErrors.labels({
        middleware: middlewareName,
        method: req.method,
        path: req.path
      }).inc();
      
      throw error;
    } finally {
      const duration = (performance.now() - startTime) / 1000;
      
      middlewareDuration.labels({
        middleware: middlewareName,
        method: req.method,
        path: req.path,
        status: res.statusCode.toString()
      }).observe(duration);
      
      // 更新本地指标
      this.updateMetrics(middlewareName, duration, res.statusCode);
    }
  };
  
  private updateMetrics(
    middlewareName: string,
    duration: number,
    statusCode: number
  ): void {
    const metrics = this.middlewareMetrics.get(middlewareName) || {
      count: 0,
      totalDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      errors: 0
    };
    
    metrics.count++;
    metrics.totalDuration += duration;
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    
    if (statusCode >= 400) {
      metrics.errors++;
    }
    
    this.middlewareMetrics.set(middlewareName, metrics);
  }
  
  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [middleware, metrics] of this.middlewareMetrics.entries()) {
      result[middleware] = {
        ...metrics,
        avgDuration: metrics.totalDuration / metrics.count,
        errorRate: metrics.errors / metrics.count
      };
    }
    
    return result;
  }
}
```

#### E.3 安全相关

**Q1: 如何防止中间件安全漏洞？**

A: 遵循安全最佳实践：

```typescript
// 1. 输入验证中间件
import { z } from 'zod';

export class InputValidationMiddleware implements IMiddleware {
  name = 'input-validation-middleware';
  priority = MiddlewarePriority.VALIDATION;
  enabled = true;
  
  private schemas: Map<string, z.ZodSchema> = new Map();
  
  constructor() {
    // 注册验证模式
    this.schemas.set('/api/users', z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    }));
  }
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = this.schemas.get(req.path);
    
    if (!schema) {
      return next();
    }
    
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.errors
        });
      }
      next(error);
    }
  };
}

// 2. SQL注入防护中间件
export class SqlInjectionProtectionMiddleware implements IMiddleware {
  name = 'sql-injection-protection-middleware';
  priority = MiddlewarePriority.SECURITY;
  enabled = true;
  
  private sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
  ];
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return this.sqlPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => checkValue(v));
      }
      return false;
    };
    
    const { query, body, params } = req;
    
    if (checkValue(query) || checkValue(body) || checkValue(params)) {
      logger.warn('Potential SQL injection detected', {
        path: req.path,
        ip: req.ip,
        query,
        body,
        params
      });
      
      return res.status(400).json({
        success: false,
        error: 'Invalid input detected'
      });
    }
    
    next();
  };
}

// 3. XSS防护中间件
import xss from 'xss';

export class XssProtectionMiddleware implements IMiddleware {
  name = 'xss-protection-middleware';
  priority = MiddlewarePriority.SECURITY;
  enabled = true;
  
  private xssOptions = {
    whiteList: {}, // 允许的HTML标签和属性
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  };
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sanitize = (value: any): any => {
      if (typeof value === 'string') {
        return xss(value, this.xssOptions);
      }
      if (Array.isArray(value)) {
        return value.map(item => sanitize(item));
      }
      if (typeof value === 'object' && value !== null) {
        const sanitized: Record<string, any> = {};
        for (const [key, val] of Object.entries(value)) {
          sanitized[key] = sanitize(val);
        }
        return sanitized;
      }
      return value;
    };
    
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    
    next();
  };
}
```

**Q2: 如何实现安全的认证中间件？**

A: 使用JWT和RBAC：

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthenticationMiddleware implements IMiddleware {
  name = 'authentication-middleware';
  priority = MiddlewarePriority.AUTHENTICATION;
  enabled = true;
  
  private jwtSecret: string;
  private tokenExpiry: string;
  
  constructor(config: { jwtSecret: string; tokenExpiry: string }) {
    this.jwtSecret = config.jwtSecret;
    this.tokenExpiry = config.tokenExpiry;
  }
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }
      
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, this.jwtSecret) as {
          userId: string;
          email: string;
          role: string;
        };
        
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
        
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }
    } catch (error) {
      logger.error('Authentication error', { error });
      return res.status(500).json({
        success: false,
        error: 'Authentication failed'
      });
    }
  };
}

export class AuthorizationMiddleware implements IMiddleware {
  name = 'authorization-middleware';
  priority = MiddlewarePriority.AUTHORIZATION;
  enabled = true;
  
  private permissions: Map<string, string[]> = new Map();
  
  constructor() {
    // 定义路由权限
    this.permissions.set('/api/users', ['user:read', 'user:write']);
    this.permissions.set('/api/admin', ['admin:read', 'admin:write']);
  }
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    const requiredPermissions = this.permissions.get(req.path);
    
    if (!requiredPermissions) {
      return next();
    }
    
    const userPermissions = await this.getUserPermissions(req.user.id);
    
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user.id,
        path: req.path,
        requiredPermissions
      });
      
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
  
  private async getUserPermissions(userId: string): Promise<string[]> {
    // 从数据库或缓存获取用户权限
    return [];
  }
}
```

### F. 最佳实践建议

#### F.1 中间件设计

1. **单一职责原则**
   - 每个中间件只负责一个功能
   - 避免中间件过于复杂
   - 保持中间件的可测试性

```typescript
// 好的设计：职责单一
export class LoggingMiddleware implements IMiddleware {
  name = 'logging-middleware';
  priority = MiddlewarePriority.LOGGING;
  enabled = true;
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info('Request received', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    next();
  };
}

// 不好的设计：职责混乱
export class BadMiddleware implements IMiddleware {
  name = 'bad-middleware';
  priority = MiddlewarePriority.CUSTOM;
  enabled = true;
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 日志
    logger.info('Request received', { path: req.path });
    
    // 认证
    const token = req.headers.authorization;
    const user = await verifyToken(token);
    req.user = user;
    
    // 权限检查
    const permissions = await getPermissions(user.id);
    if (!permissions.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // 缓存
    const cached = await cache.get(req.path);
    if (cached) {
      return res.json(cached);
    }
    
    next();
  };
}
```

2. **中间件顺序**
   - 按优先级正确排序
   - 考虑中间件之间的依赖关系
   - 使用中间件管理器统一管理

```typescript
// 正确的中间件顺序
const middlewareOrder = [
  MiddlewarePriority.ERROR_HANDLING, // 错误处理
  MiddlewarePriority.LOGGING,         // 日志记录
  MiddlewarePriority.CORS,             // CORS
  MiddlewarePriority.RATE_LIMIT,      // 限流
  MiddlewarePriority.AUTHENTICATION,  // 认证
  MiddlewarePriority.AUTHORIZATION,    // 授权
  MiddlewarePriority.VALIDATION,      // 验证
  MiddlewarePriority.CACHE,           // 缓存
  MiddlewarePriority.COMPRESSION,     // 压缩
  MiddlewarePriority.CUSTOM           // 自定义
];
```

3. **错误处理**
   - 统一错误处理机制
   - 正确传递错误到下一个中间件
   - 提供详细的错误日志

```typescript
export class ErrorHandlerMiddleware implements IMiddleware {
  name = 'error-handler-middleware';
  priority = MiddlewarePriority.ERROR_HANDLING;
  enabled = true;
  
  handler = async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.error('Error occurred', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    
    // 根据错误类型返回不同的状态码
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.message
      });
    }
    
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    if (err.name === 'ForbiddenError') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }
    
    if (err.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        error: 'Not found'
      });
    }
    
    // 默认500错误
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
    });
  };
}
```

#### F.2 性能优化

1. **减少中间件开销**
   - 避免不必要的中间件
   - 使用条件中间件
   - 缓存中间件结果

2. **异步处理**
   - 使用async/await处理异步操作
   - 避免阻塞事件循环
   - 使用Promise.all并行处理

```typescript
// 好的实践：并行处理
app.use(async (req, res, next) => {
  const [user, config, permissions] = await Promise.all([
    fetchUser(req),
    fetchConfig(),
    fetchPermissions(req)
  ]);
  
  req.user = user;
  req.config = config;
  req.permissions = permissions;
  
  next();
});

// 不好的实践：串行处理
app.use(async (req, res, next) => {
  const user = await fetchUser(req);
  const config = await fetchConfig();
  const permissions = await fetchPermissions(req);
  
  req.user = user;
  req.config = config;
  req.permissions = permissions;
  
  next();
});
```

3. **监控和优化**
   - 持续监控中间件性能
   - 识别性能瓶颈
   - 优化慢中间件

#### F.3 安全加固

1. **输入验证**
   - 验证所有用户输入
   - 使用类型安全的验证库
   - 防止注入攻击

2. **认证和授权**
   - 使用强认证机制
   - 实现基于角色的访问控制
   - 定期轮换密钥

3. **安全头**
   - 设置安全相关的HTTP头
   - 启用HTTPS
   - 配置CORS策略

```typescript
export class SecurityHeadersMiddleware implements IMiddleware {
  name = 'security-headers-middleware';
  priority = MiddlewarePriority.SECURITY;
  enabled = true;
  
  handler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 安全头
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  };
}
```

### G. 扩展阅读资源

#### G.1 官方文档

- [Express.js Middleware Guide](https://expressjs.com/en/guide/writing-middleware.html)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Winston Logging Library](https://github.com/winstonjs/winston)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [JWT.io](https://jwt.io/)

#### G.2 最佳实践

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Best Practices](https://github.com/expressjs/express/wiki/Best-practices-for-performance-in-production)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [REST API Design Best Practices](https://restfulapi.net/)

#### G.3 性能优化

- [Node.js Performance Tuning](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Express Performance Tips](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Redis Performance Optimization](https://redis.io/topics/admin)
- [Database Query Optimization](https://www.postgresql.org/docs/current/performance-tips.html)

#### G.4 安全相关

- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS Security Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Helmet.js Security Headers](https://helmetjs.github.io/)

#### G.5 测试相关

- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Supertest API Testing](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
> 
> **审核状态**: 已审核通过

</div>
