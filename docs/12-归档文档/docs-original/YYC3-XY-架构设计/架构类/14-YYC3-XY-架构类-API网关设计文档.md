---
@file: 14-YYC3-XY-架构类-API网关设计文档
@description: YYC³智能预测系统的API网关设计文档，遵循"五高五标五化"核心原则，提供统一入口、认证鉴权、限流防护、动态路由等功能。
@author: YYC³
@version: 1.0.0
@created: 2025-12-25
@updated: 2025-12-28
@status: published
@tags: [架构, API网关, 微服务, 五高五标五化, 系统设计]
---

# 14-YYC3-XY-架构类-API网关设计文档

---

## 一、架构概述

### 1.1 设计理念

YYC³智能预测系统的API网关是整个微服务架构的统一入口，遵循"五高五标五化"核心原则：

**五高（Five Highs）**：

- 高可用：多实例部署、健康检查、故障转移
- 高性能：连接池、缓存、异步处理
- 高安全：认证鉴权、限流防护、数据加密
- 高可扩展：插件化架构、动态路由、水平扩展
- 高可维护：配置管理、监控告警、日志追踪

**五标（Five Standards）**：

- 标准化：统一API规范、服务契约、错误码
- 规范化：代码规范、文档规范、流程规范
- 自动化：自动注册、自动发现、自动扩缩容
- 智能化：智能路由、自适应限流、预测性扩容
- 可视化：监控大屏、链路追踪、性能分析

**五化（Five Transformations）**：

- 流程化：标准化请求处理流程
- 文档化：完整的API文档、配置文档
- 工具化：完善的开发工具、测试工具
- 数字化：全链路数据采集、数字化决策
- 生态化：开放接口、插件生态

### 1.2 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层                                 │
│  Web前端 / 移动端 / 第三方应用                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API网关 (1229)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  入口层                                                   │  │
│  │  HTTP Server │ WebSocket Server │ Event Bus            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  中间件层                                                 │  │
│  │  认证鉴权 │ 限流 │ 日志 │ 监控 │ 错误处理               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  路由层                                                   │  │
│  │  路由匹配 │ 负载均衡 │ 熔断器 │ 重试机制                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  服务层                                                   │  │
│  │  服务发现 │ 服务注册 │ 健康检查 │ 配置管理               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  核心服务        │ │  API服务        │ │  支撑服务        │
│  AgenticCore     │ │  ToolAPI        │ │  ServiceDiscovery│
│  ToolManager     │ │  KnowledgeAPI   │ │  ConfigCenter    │
│  KnowledgeMgr    │ │  GoalAPI        │ │  Monitoring      │
│  GoalManager     │ │                 │ │  Logging         │
│  MetaLearning    │ │                 │ │                  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 1.3 核心功能

| 功能模块 | 职责 | 技术实现 |
|---------|------|---------|
| 路由管理 | 请求路由、路径匹配、参数解析 | Express Router |
| 负载均衡 | 服务实例选择、流量分配 | Round Robin / Least Connections |
| 熔断器 | 故障检测、熔断保护、自动恢复 | Circuit Breaker Pattern |
| 限流 | 请求频率控制、配额管理 | Token Bucket / Leaky Bucket |
| 认证鉴权 | JWT验证、权限检查 | JWT / RBAC |
| 监控 | 请求统计、性能指标 | Metrics Collection |
| 日志 | 请求日志、错误日志 | Winston / Pino |
| 服务发现 | 服务注册、健康检查 | Service Registry |

---

## 二、核心设计

### 2.1 网关配置

```typescript
export interface GatewayConfig {
  // 基础配置
  port: number                    // 网关端口
  host: string                    // 网关主机
  maxConnections: number           // 最大连接数
  requestTimeout: number          // 请求超时时间(ms)

  // 功能开关
  enableMetrics: boolean          // 启用指标收集
  enableCircuitBreaker: boolean   // 启用熔断器
  enableRateLimit: boolean        // 启用限流
  enableAuth: boolean             // 启用认证

  // 健康检查
  healthCheckInterval: number     // 健康检查间隔(ms)

  // 重试策略
  retryAttempts: number           // 重试次数
  retryDelay: number              // 重试延迟(ms)

  // 负载均衡
  loadBalancingStrategy: 'round_robin' | 'least_connections' | 'random'

  // 认证配置
  authentication?: {
    jwtSecret: string
    jwtExpiresIn: string
    apiKeyHeader: string
  }

  // 限流配置
  rateLimit?: {
    windowMs: number              // 时间窗口
    maxRequests: number           // 最大请求数
    skipSuccessfulRequests: boolean
  }

  // 熔断配置
  circuitBreaker?: {
    timeout: number               // 超时时间
    errorThreshold: number       // 错误阈值
    resetTimeout: number         // 重置超时
  }
}

const defaultConfig: GatewayConfig = {
  port: process.env.API_GATEWAY_PORT || 1229,
  host: process.env.API_GATEWAY_HOST || 'localhost',
  maxConnections: 1000,
  requestTimeout: 30000,
  enableMetrics: true,
  enableCircuitBreaker: true,
  enableRateLimit: true,
  enableAuth: true,
  healthCheckInterval: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  loadBalancingStrategy: 'round_robin',
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    apiKeyHeader: 'X-API-Key'
  },
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100,
    skipSuccessfulRequests: false
  },
  circuitBreaker: {
    timeout: 10000,
    errorThreshold: 0.5,
    resetTimeout: 60000
  }
}
```

### 2.2 服务注册

```typescript
export interface ServiceDefinition {
  id: string                      // 服务唯一标识
  name: string                    // 服务名称
  version: string                 // 服务版本
  host: string                    // 服务主机
  port: number                    // 服务端口
  protocol: 'http' | 'https' | 'grpc'  // 协议类型
  healthCheck: {
    path: string                  // 健康检查路径
    interval: number              // 检查间隔
    timeout: number               // 超时时间
    healthyThreshold: number      // 健康阈值
    unhealthyThreshold: number    // 不健康阈值
  }
  rateLimit?: {
    requestsPerSecond: number     // 每秒请求数
    burst: number                 // 突发请求数
  }
  metadata?: Record<string, any>  // 元数据
  tags?: string[]                 // 标签
}

export class APIGateway extends EventEmitter {
  private services: Map<string, ServiceDefinition> = new Map()
  private serviceRegistry: ServiceDiscovery
  private loadBalancer: LoadBalancer

  async registerService(service: ServiceDefinition): Promise<void> {
    try {
      // 1. 验证服务定义
      await this.validateService(service)

      // 2. 注册到服务发现
      await this.serviceRegistry.register(service)

      // 3. 存储服务定义
      this.services.set(service.id, service)

      // 4. 初始化熔断器
      if (this.config.enableCircuitBreaker) {
        await this.circuitBreaker.registerService(service.id)
      }

      // 5. 初始化限流
      if (this.config.enableRateLimit && service.rateLimit) {
        await this.rateLimiter.registerService(service.id, service.rateLimit)
      }

      // 6. 发送事件
      this.emit('serviceRegistered', { service })
      console.log(`✅ 服务 "${service.name}" 注册成功`)

    } catch (error) {
      this.emit('serviceRegistrationError', { service, error })
      throw error
    }
  }

  async deregisterService(serviceId: string): Promise<void> {
    try {
      // 1. 从服务发现注销
      await this.serviceRegistry.deregister(serviceId)

      // 2. 移除服务定义
      this.services.delete(serviceId)

      // 3. 清理熔断器
      if (this.config.enableCircuitBreaker) {
        await this.circuitBreaker.deregisterService(serviceId)
      }

      // 4. 清理限流
      if (this.config.enableRateLimit) {
        await this.rateLimiter.deregisterService(serviceId)
      }

      // 5. 发送事件
      this.emit('serviceDeregistered', { serviceId })
      console.log(`✅ 服务 "${serviceId}" 注销成功`)

    } catch (error) {
      this.emit('serviceDeregistrationError', { serviceId, error })
      throw error
    }
  }
}
```

### 2.3 路由管理

```typescript
export interface RouteDefinition {
  path: string                    // 路由路径
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'  // HTTP方法
  serviceId: string               // 目标服务ID
  targetPath?: string             // 目标路径
  middleware?: Middleware[]       // 中间件
  timeout?: number                // 超时时间
  cache?: {
    enabled: boolean
    ttl: number                   // 缓存时间
  }
  rateLimit?: {
    requestsPerMinute: number     // 每分钟请求数
  }
}

export class APIGateway extends EventEmitter {
  private routes: Map<string, RouteDefinition> = new Map()

  async registerRoute(route: RouteDefinition): Promise<void> {
    const routeKey = `${route.method}:${route.path}`

    // 验证服务是否存在
    if (!this.services.has(route.serviceId)) {
      throw new Error(`服务 "${route.serviceId}" 不存在`)
    }

    // 注册路由
    this.routes.set(routeKey, route)

    // 配置Express路由
    this.setupExpressRoute(route)

    this.emit('routeRegistered', { route })
    console.log(`✅ 路由 "${route.method} ${route.path}" 注册成功`)
  }

  private setupExpressRoute(route: RouteDefinition): void {
    const router = this.app[route.method.toLowerCase()](
      route.path,
      ...this.buildMiddleware(route),
      async (req: Request, res: Response) => {
        await this.handleRequest(req, res, route)
      }
    )
  }

  private buildMiddleware(route: RouteDefinition): Middleware[] {
    const middleware: Middleware[] = []

    // 1. 认证中间件
    if (this.config.enableAuth) {
      middleware.push(this.authMiddleware)
    }

    // 2. 限流中间件
    if (this.config.enableRateLimit) {
      middleware.push(this.rateLimitMiddleware)
    }

    // 3. 日志中间件
    middleware.push(this.loggingMiddleware)

    // 4. 路由特定中间件
    if (route.middleware) {
      middleware.push(...route.middleware)
    }

    return middleware
  }
}
```

### 2.4 负载均衡

```typescript
export enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  RANDOM = 'random',
  IP_HASH = 'ip_hash',
  WEIGHTED = 'weighted'
}

export interface LoadBalancerConfig {
  strategy: LoadBalancingStrategy
  healthCheck: boolean
  maxRetries: number
  retryDelay: number
}

export class LoadBalancer {
  private config: LoadBalancerConfig
  private serviceInstances: Map<string, ServiceInstance[]> = new Map()
  private currentRoundRobinIndex: Map<string, number> = new Map()
  private connectionCounts: Map<string, number> = new Map()

  constructor(config: LoadBalancerConfig) {
    this.config = config
  }

  selectInstance(serviceId: string): ServiceInstance {
    const instances = this.serviceInstances.get(serviceId)

    if (!instances || instances.length === 0) {
      throw new Error(`服务 "${serviceId}" 没有可用实例`)
    }

    // 过滤健康实例
    const healthyInstances = instances.filter(i => i.healthy)
    if (healthyInstances.length === 0) {
      throw new Error(`服务 "${serviceId}" 没有健康的实例`)
    }

    // 根据策略选择实例
    switch (this.config.strategy) {
      case LoadBalancingStrategy.ROUND_ROBIN:
        return this.selectRoundRobin(serviceId, healthyInstances)
      case LoadBalancingStrategy.LEAST_CONNECTIONS:
        return this.selectLeastConnections(healthyInstances)
      case LoadBalancingStrategy.RANDOM:
        return this.selectRandom(healthyInstances)
      case LoadBalancingStrategy.IP_HASH:
        return this.selectIpHash(serviceId, healthyInstances)
      case LoadBalancingStrategy.WEIGHTED:
        return this.selectWeighted(healthyInstances)
      default:
        return this.selectRoundRobin(serviceId, healthyInstances)
    }
  }

  private selectRoundRobin(
    serviceId: string,
    instances: ServiceInstance[]
  ): ServiceInstance {
    const currentIndex = this.currentRoundRobinIndex.get(serviceId) || 0
    const selectedInstance = instances[currentIndex % instances.length]

    this.currentRoundRobinIndex.set(serviceId, currentIndex + 1)
    return selectedInstance
  }

  private selectLeastConnections(instances: ServiceInstance[]): ServiceInstance {
    return instances.reduce((min, instance) => {
      const count = this.connectionCounts.get(instance.id) || 0
      const minCount = this.connectionCounts.get(min.id) || 0
      return count < minCount ? instance : min
    })
  }

  private selectRandom(instances: ServiceInstance[]): ServiceInstance {
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  private selectIpHash(
    serviceId: string,
    instances: ServiceInstance[]
  ): ServiceInstance {
    const ip = this.getClientIp()
    const hash = this.hashString(`${serviceId}:${ip}`)
    const index = hash % instances.length
    return instances[index]
  }

  private selectWeighted(instances: ServiceInstance[]): ServiceInstance {
    const totalWeight = instances.reduce((sum, i) => sum + (i.weight || 1), 0)
    let random = Math.random() * totalWeight

    for (const instance of instances) {
      random -= instance.weight || 1
      if (random <= 0) {
        return instance
      }
    }

    return instances[0]
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  incrementConnection(instanceId: string): void {
    const count = this.connectionCounts.get(instanceId) || 0
    this.connectionCounts.set(instanceId, count + 1)
  }

  decrementConnection(instanceId: string): void {
    const count = this.connectionCounts.get(instanceId) || 0
    this.connectionCounts.set(instanceId, Math.max(0, count - 1))
  }
}
```

### 2.5 熔断器

```typescript
export enum CircuitState {
  CLOSED = 'closed',      // 关闭状态（正常）
  OPEN = 'open',          // 开启状态（熔断）
  HALF_OPEN = 'half_open' // 半开状态（测试）
}

export interface CircuitBreakerConfig {
  timeout: number                 // 超时时间
  errorThreshold: number          // 错误阈值（0-1）
  successThreshold: number        // 成功阈值（0-1）
  resetTimeout: number            // 重置超时
  monitoringPeriod: number        // 监控周期
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount: number = 0
  private successCount: number = 0
  private lastFailureTime?: Date
  private nextAttemptTime?: Date

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(
    fn: () => Promise<T>,
    serviceId: string
  ): Promise<T> {
    // 检查熔断状态
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN
        this.successCount = 0
      } else {
        throw new CircuitBreakerOpenError(
          `服务 "${serviceId}" 熔断器已开启`
        )
      }
    }

    try {
      // 执行请求
      const result = await this.withTimeout(fn(), this.config.timeout)

      // 成功处理
      this.onSuccess()

      return result
    } catch (error) {
      // 失败处理
      this.onFailure(error)

      if (this.state === CircuitState.OPEN) {
        throw new CircuitBreakerOpenError(
          `服务 "${serviceId}" 熔断器已开启`,
          error
        )
      }

      throw error
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++

      // 达到成功阈值，关闭熔断器
      if (this.successCount >= this.config.successThreshold * 10) {
        this.state = CircuitState.CLOSED
        this.failureCount = 0
        this.successCount = 0
      }
    } else {
      this.failureCount = 0
    }
  }

  private onFailure(error: Error): void {
    this.failureCount++
    this.lastFailureTime = new Date()

    // 达到错误阈值，开启熔断器
    if (this.state === CircuitState.HALF_OPEN ||
        this.failureCount >= this.config.errorThreshold * 10) {
      this.state = CircuitState.OPEN
      this.nextAttemptTime = new Date(
        Date.now() + this.config.resetTimeout
      )
    }
  }

  private shouldAttemptReset(): boolean {
    return this.nextAttemptTime !== undefined &&
           new Date() >= this.nextAttemptTime
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new TimeoutError('请求超时')), timeout)
      )
    ])
  }

  getState(): CircuitState {
    return this.state
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    }
  }
}

export class CircuitBreakerManager {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map()

  registerService(serviceId: string, config?: CircuitBreakerConfig): void {
    const defaultConfig: CircuitBreakerConfig = {
      timeout: 10000,
      errorThreshold: 0.5,
      successThreshold: 0.7,
      resetTimeout: 60000,
      monitoringPeriod: 60000
    }

    const circuitBreaker = new CircuitBreaker(config || defaultConfig)
    this.circuitBreakers.set(serviceId, circuitBreaker)
  }

  async execute<T>(
    serviceId: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const circuitBreaker = this.circuitBreakers.get(serviceId)

    if (!circuitBreaker) {
      throw new Error(`服务 "${serviceId}" 的熔断器未注册`)
    }

    return await circuitBreaker.execute(fn, serviceId)
  }

  getCircuitBreaker(serviceId: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(serviceId)
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}

    for (const [serviceId, circuitBreaker] of this.circuitBreakers) {
      stats[serviceId] = circuitBreaker.getStats()
    }

    return stats
  }
}
```

### 2.6 限流

```typescript
export enum RateLimitStrategy {
  TOKEN_BUCKET = 'token_bucket',
  LEAKY_BUCKET = 'leaky_bucket',
  FIXED_WINDOW = 'fixed_window',
  SLIDING_WINDOW = 'sliding_window'
}

export interface RateLimitConfig {
  windowMs: number                // 时间窗口
  maxRequests: number             // 最大请求数
  skipSuccessfulRequests: boolean // 是否跳过成功请求
  keyGenerator?: (req: Request) => string  // 键生成器
  skipFailedRequests: boolean     // 是否跳过失败请求
  skip?: (req: Request) => boolean  // 跳过条件
}

export class RateLimiter {
  private config: RateLimitConfig
  private requests: Map<string, RequestRecord[]> = new Map()
  private cleanupInterval?: NodeJS.Timeout

  constructor(config: RateLimitConfig) {
    this.config = config
    this.startCleanup()
  }

  async checkLimit(req: Request): Promise<void> {
    // 检查是否跳过
    if (this.config.skip && this.config.skip(req)) {
      return
    }

    // 生成键
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(req)
      : this.generateDefaultKey(req)

    // 获取请求记录
    let records = this.requests.get(key) || []
    const now = Date.now()

    // 清理过期记录
    records = records.filter(
      r => r.timestamp > now - this.config.windowMs
    )

    // 检查是否超限
    if (records.length >= this.config.maxRequests) {
      const resetTime = records[0].timestamp + this.config.windowMs
      throw new RateLimitExceededError(
        `请求频率超限，请稍后再试`,
        {
          limit: this.config.maxRequests,
          remaining: 0,
          reset: new Date(resetTime)
        }
      )
    }

    // 记录请求
    records.push({ timestamp: now })
    this.requests.set(key, records)
  }

  private generateDefaultKey(req: Request): string {
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const userId = (req as any).user?.id || 'anonymous'
    return `${ip}:${userId}`
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, this.config.windowMs)
  }

  private cleanup(): void {
    const now = Date.now()

    for (const [key, records] of this.requests) {
      const validRecords = records.filter(
        r => r.timestamp > now - this.config.windowMs
      )

      if (validRecords.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, validRecords)
      }
    }
  }

  getStats(key: string): RateLimitStats {
    const records = this.requests.get(key) || []
    const now = Date.now()
    const validRecords = records.filter(
      r => r.timestamp > now - this.config.windowMs
    )

    return {
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - validRecords.length),
      reset: new Date(now + this.config.windowMs)
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

export interface RequestRecord {
  timestamp: number
}

export interface RateLimitStats {
  limit: number
  remaining: number
  reset: Date
}

export class RateLimitExceededError extends Error {
  constructor(
    message: string,
    public details: RateLimitStats
  ) {
    super(message)
    this.name = 'RateLimitExceededError'
  }
}
```

### 2.7 认证鉴权

```typescript
export interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: string
  apiKeyHeader: string
  skipPaths?: string[]
  adminPaths?: string[]
}

export class Authenticator {
  constructor(private config: AuthConfig) {}

  async authenticate(req: Request): Promise<void> {
    // 检查是否跳过认证
    if (this.shouldSkipAuth(req)) {
      return
    }

    // 尝试JWT认证
    const token = this.extractToken(req)
    if (token) {
      const user = await this.verifyJWT(token)
      (req as any).user = user
      return
    }

    // 尝试API Key认证
    const apiKey = this.extractApiKey(req)
    if (apiKey) {
      const user = await this.verifyApiKey(apiKey)
      (req as any).user = user
      return
    }

    // 认证失败
    throw new UnauthorizedError('未提供有效的认证信息')
  }

  async authorize(req: Request, requiredRole?: string): Promise<void> {
    const user = (req as any).user

    if (!user) {
      throw new UnauthorizedError('未认证')
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      throw new ForbiddenError('权限不足')
    }
  }

  private shouldSkipAuth(req: Request): boolean {
    const path = req.path

    // 检查跳过路径
    if (this.config.skipPaths?.some(p => path.startsWith(p))) {
      return true
    }

    // 健康检查端点
    if (path === '/health') {
      return true
    }

    return false
  }

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    return undefined
  }

  private extractApiKey(req: Request): string | undefined {
    const apiKey = req.headers[this.config.apiKeyHeader.toLowerCase()] as string

    return apiKey
  }

  private async verifyJWT(token: string): Promise<UserInfo> {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as any

      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions || []
      }
    } catch (error) {
      throw new UnauthorizedError('无效的令牌')
    }
  }

  private async verifyApiKey(apiKey: string): Promise<UserInfo> {
    // 从数据库验证API Key
    const user = await this.getUserByApiKey(apiKey)

    if (!user) {
      throw new UnauthorizedError('无效的API密钥')
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    }
  }

  private async getUserByApiKey(apiKey: string): Promise<any> {
    // 实现API Key验证逻辑
    return null
  }

  generateToken(user: UserInfo): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiresIn }
    )
  }
}

export interface UserInfo {
  id: string
  email: string
  role: string
  permissions: string[]
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}
```

### 2.8 监控与日志

```typescript
export interface MetricsConfig {
  enableRequestMetrics: boolean
  enableResponseTimeMetrics: boolean
  enableErrorMetrics: boolean
  enableServiceMetrics: boolean
  metricsInterval: number
}

export class Metrics {
  private config: MetricsConfig
  private metrics: Map<string, MetricData> = new Map()
  private interval?: NodeJS.Timeout

  constructor(config: MetricsConfig) {
    this.config = config
    this.startCollection()
  }

  recordRequest(serviceId: string, response: any): void {
    if (!this.config.enableRequestMetrics) return

    const key = `request:${serviceId}`
    const metric = this.getOrCreateMetric(key)

    metric.count++
    metric.lastUpdated = new Date()

    if (response.status >= 400) {
      metric.errorCount++
    }
  }

  recordResponseTime(serviceId: string, duration: number): void {
    if (!this.config.enableResponseTimeMetrics) return

    const key = `response_time:${serviceId}`
    const metric = this.getOrCreateMetric(key)

    metric.sum += duration
    metric.count++
    metric.min = Math.min(metric.min, duration)
    metric.max = Math.max(metric.max, duration)
    metric.lastUpdated = new Date()
  }

  recordError(serviceId: string, error: Error): void {
    if (!this.config.enableErrorMetrics) return

    const key = `error:${serviceId}:${error.name}`
    const metric = this.getOrCreateMetric(key)

    metric.count++
    metric.lastUpdated = new Date()
  }

  recordServiceHealth(serviceId: string, healthy: boolean): void {
    if (!this.config.enableServiceMetrics) return

    const key = `service_health:${serviceId}`
    const metric = this.getOrCreateMetric(key)

    metric.healthy = healthy
    metric.lastUpdated = new Date()
  }

  private getOrCreateMetric(key: string): MetricData {
    let metric = this.metrics.get(key)

    if (!metric) {
      metric = {
        key,
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        errorCount: 0,
        healthy: true,
        lastUpdated: new Date()
      }
      this.metrics.set(key, metric)
    }

    return metric
  }

  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, metric] of this.metrics) {
      result[key] = {
        ...metric,
        avg: metric.count > 0 ? metric.sum / metric.count : 0
      }
    }

    return result
  }

  getServiceMetrics(serviceId: string): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, metric] of this.metrics) {
      if (key.includes(serviceId)) {
        result[key] = {
          ...metric,
          avg: metric.count > 0 ? metric.sum / metric.count : 0
        }
      }
    }

    return result
  }

  private startCollection(): void {
    this.interval = setInterval(() => {
      this.collectMetrics()
    }, this.config.metricsInterval)
  }

  private collectMetrics(): void {
    // 定期收集和聚合指标
    this.emit('metricsCollected', this.getMetrics())
  }

  reset(): void {
    this.metrics.clear()
  }

  destroy(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}

export interface MetricData {
  key: string
  count: number
  sum: number
  min: number
  max: number
  errorCount: number
  healthy: boolean
  lastUpdated: Date
}

export class Logger {
  private logger: any

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: 'logs/combined.log'
        })
      ]
    })
  }

  logRequest(req: Request, res: Response, duration: number): void {
    this.logger.info('API Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    })
  }

  logError(error: Error, req?: Request): void {
    this.logger.error('API Error', {
      message: error.message,
      stack: error.stack,
      path: req?.path,
      method: req?.method
    })
  }

  logServiceEvent(event: string, data: any): void {
    this.logger.info('Service Event', { event, ...data })
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta)
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta)
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta)
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta)
  }
}
```

---

## 三、请求处理流程

### 3.1 完整流程

```typescript
export class APIGateway extends EventEmitter {
  async handleRequest(
    req: Request,
    res: Response,
    route?: RouteDefinition
  ): Promise<void> {
    const startTime = Date.now()

    try {
      // 1. 认证鉴权
      if (this.config.enableAuth) {
        await this.authenticator.authenticate(req)
      }

      // 2. 限流检查
      if (this.config.enableRateLimit) {
        await this.rateLimiter.checkLimit(req)
      }

      // 3. 路由匹配
      const matchedRoute = route || this.matchRoute(req)
      if (!matchedRoute) {
        throw new NotFoundError('路由未找到')
      }

      // 4. 服务发现
      const service = this.services.get(matchedRoute.serviceId)
      if (!service) {
        throw new ServiceUnavailableError(`服务 "${matchedRoute.serviceId}" 不可用`)
      }

      // 5. 熔断检查
      if (this.config.enableCircuitBreaker) {
        const circuitBreaker = this.circuitBreaker.getCircuitBreaker(service.id)
        if (circuitBreaker?.getState() === CircuitState.OPEN) {
          throw new ServiceUnavailableError(`服务 "${service.name}" 熔断器已开启`)
        }
      }

      // 6. 负载均衡
      const instance = this.loadBalancer.selectInstance(service.id)
      this.loadBalancer.incrementConnection(instance.id)

      // 7. 代理请求
      const response = await this.proxyRequest(instance, req, matchedRoute)

      // 8. 记录指标
      const duration = Date.now() - startTime
      this.metrics.recordRequest(service.id, response)
      this.metrics.recordResponseTime(service.id, duration)

      // 9. 返回响应
      res.status(response.status).json(response.data)

      // 10. 日志记录
      this.logger.logRequest(req, res, duration)

    } catch (error) {
      // 错误处理
      const duration = Date.now() - startTime
      this.handleError(error, req, res, duration)
    } finally {
      // 清理连接计数
      if (req.serviceInstance) {
        this.loadBalancer.decrementConnection(req.serviceInstance.id)
      }
    }
  }

  private async proxyRequest(
    instance: ServiceInstance,
    req: Request,
    route: RouteDefinition
  ): Promise<any> {
    const url = this.buildTargetUrl(instance, req, route)

    const response = await axios({
      method: req.method,
      url,
      headers: this.buildHeaders(req),
      data: req.body,
      params: req.query,
      timeout: route.timeout || this.config.requestTimeout
    })

    return {
      status: response.status,
      data: response.data
    }
  }

  private buildTargetUrl(
    instance: ServiceInstance,
    req: Request,
    route: RouteDefinition
  ): string {
    const protocol = instance.protocol || 'http'
    const host = instance.host
    const port = instance.port
    const path = route.targetPath || req.path

    return `${protocol}://${host}:${port}${path}`
  }

  private buildHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {}

    // 转发原始请求头
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers[key] = value
      }
    }

    // 添加用户信息
    if ((req as any).user) {
      headers['X-User-Id'] = (req as any).user.id
      headers['X-User-Role'] = (req as any).user.role
    }

    // 添加请求ID
    headers['X-Request-Id'] = (req as any).requestId || this.generateRequestId()

    return headers
  }

  private handleError(
    error: Error,
    req: Request,
    res: Response,
    duration: number
  ): void {
    // 记录错误
    this.logger.logError(error, req)

    // 记录错误指标
    if ((req as any).serviceId) {
      this.metrics.recordError((req as any).serviceId, error)
    }

    // 返回错误响应
    const statusCode = this.getHttpStatusCode(error)
    const responseBody = {
      error: {
        message: error.message,
        code: error.constructor.name,
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    }

    res.status(statusCode).json(responseBody)
  }

  private getHttpStatusCode(error: Error): number {
    if (error instanceof UnauthorizedError) return 401
    if (error instanceof ForbiddenError) return 403
    if (error instanceof NotFoundError) return 404
    if (error instanceof RateLimitExceededError) return 429
    if (error instanceof ServiceUnavailableError) return 503
    if (error instanceof CircuitBreakerOpenError) return 503
    if (error instanceof TimeoutError) return 504

    return 500
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
```

### 3.2 中间件链

```typescript
export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>

export class APIGateway extends EventEmitter {
  private middleware: Middleware[] = []

  use(middleware: Middleware): void {
    this.middleware.push(middleware)
  }

  private async executeMiddleware(
    req: Request,
    res: Response
  ): Promise<void> {
    for (const middleware of this.middleware) {
      await middleware(req, res, () => {})
    }
  }
}

// 认证中间件
export const authMiddleware = (
  authenticator: Authenticator
): Middleware => {
  return async (req, res, next) => {
    try {
      await authenticator.authenticate(req)
      next()
    } catch (error) {
      res.status(401).json({
        error: {
          message: '认证失败',
          code: 'AUTH_FAILED'
        }
      })
    }
  }
}

// 限流中间件
export const rateLimitMiddleware = (
  rateLimiter: RateLimiter
): Middleware => {
  return async (req, res, next) => {
    try {
      await rateLimiter.checkLimit(req)
      next()
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        res.status(429).json({
          error: {
            message: error.message,
            code: 'RATE_LIMIT_EXCEEDED',
            details: error.details
          }
        })
      } else {
        next(error)
      }
    }
  }
}

// 日志中间件
export const loggingMiddleware = (
  logger: Logger
): Middleware => {
  return (req, res, next) => {
    const startTime = Date.now()

    res.on('finish', () => {
      const duration = Date.now() - startTime
      logger.logRequest(req, res, duration)
    })

    next()
  }
}

// 请求ID中间件
export const requestIdMiddleware: Middleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] as string ||
                    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  (req as any).requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  next()
}

// 错误处理中间件
export const errorHandlerMiddleware = (
  logger: Logger
): Middleware => {
  return (error: Error, req: Request, res: Response, next) => {
    logger.logError(error, req)

    const statusCode = getHttpStatusCode(error)

    res.status(statusCode).json({
      error: {
        message: error.message,
        code: error.constructor.name,
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    })
  }
}
```

---

## 四、部署与运维

### 4.1 部署配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    build:
      context: ./services/gateway
      dockerfile: Dockerfile
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=production
      - API_GATEWAY_PORT=1229
      - API_GATEWAY_HOST=0.0.0.0
      - JWT_SECRET=${JWT_SECRET}
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - postgres
      - redis
    networks:
      - yyc3-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=yyc3
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - yyc3-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - yyc3-network
    restart: unless-stopped

networks:
  yyc3-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
```

### 4.2 环境变量

```bash
# .env.production

# API网关配置
API_GATEWAY_PORT=1229
API_GATEWAY_HOST=0.0.0.0
NODE_ENV=production

# JWT配置
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=24h

# 数据库配置
DB_HOST=postgres
DB_PORT=5432
DB_NAME=yyc3
DB_USER=postgres
DB_PASSWORD=your-database-password

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# 限流配置
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# 熔断配置
CIRCUIT_BREAKER_TIMEOUT=10000
CIRCUIT_BREAKER_ERROR_THRESHOLD=0.5
CIRCUIT_BREAKER_RESET_TIMEOUT=60000

# 日志配置
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/api-gateway

# 监控配置
ENABLE_METRICS=true
METRICS_INTERVAL=60000
```

### 4.3 健康检查

```typescript
export class HealthChecker {
  private checks: Map<string, HealthCheck> = new Map()

  registerCheck(name: string, check: HealthCheck): void {
    this.checks.set(name, check)
  }

  async performChecks(): Promise<HealthCheckResult> {
    const results: Record<string, any> = {}
    let healthy = true

    for (const [name, check] of this.checks) {
      try {
        const result = await check.execute()
        results[name] = {
          status: 'healthy',
          ...result
        }

        if (!result.healthy) {
          healthy = false
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error.message
        }
        healthy = false
      }
    }

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: results
    }
  }
}

export interface HealthCheck {
  execute(): Promise<HealthCheckStatus>
}

export interface HealthCheckStatus {
  healthy: boolean
  [key: string]: any
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  checks: Record<string, any>
}
```

### 4.4 监控告警

```typescript
export class MonitoringService {
  private metrics: Metrics
  private logger: Logger
  private alertRules: AlertRule[] = []

  constructor(metrics: Metrics, logger: Logger) {
    this.metrics = metrics
    this.logger = logger
    this.startMonitoring()
  }

  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule)
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.checkAlerts()
    }, 60000)
  }

  private async checkAlerts(): Promise<void> {
    const metrics = this.metrics.getMetrics()

    for (const rule of this.alertRules) {
      const value = this.getMetricValue(metrics, rule.metricPath)

      if (this.evaluateCondition(value, rule.condition, rule.threshold)) {
        await this.triggerAlert(rule, value)
      }
    }
  }

  private getMetricValue(metrics: any, path: string): number {
    const parts = path.split('.')
    let value = metrics

    for (const part of parts) {
      value = value[part]
    }

    return value
  }

  private evaluateCondition(
    value: number,
    condition: string,
    threshold: number
  ): boolean {
    switch (condition) {
      case 'gt': return value > threshold
      case 'lt': return value < threshold
      case 'eq': return value === threshold
      case 'gte': return value >= threshold
      case 'lte': return value <= threshold
      default: return false
    }
  }

  private async triggerAlert(rule: AlertRule, value: number): Promise<void> {
    this.logger.warn('Alert triggered', {
      rule: rule.name,
      value,
      threshold: rule.threshold,
      condition: rule.condition
    })

    // 发送告警通知
    await this.sendNotification(rule, value)
  }

  private async sendNotification(rule: AlertRule, value: number): Promise<void> {
    // 实现告警通知逻辑（邮件、短信、Webhook等）
  }
}

export interface AlertRule {
  name: string
  metricPath: string
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  threshold: number
  severity: 'info' | 'warning' | 'error' | 'critical'
  notificationChannels: string[]
}
```

---

## 五、最佳实践

### 5.1 性能优化

**连接池管理**：

```typescript
import { createPool } from 'mysql2/promise'

const pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})
```

**缓存策略**：

```typescript
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3
})

async function getCachedData(key: string, ttl: number, fetchFn: () => Promise<any>): Promise<any> {
  const cached = await redis.get(key)

  if (cached) {
    return JSON.parse(cached)
  }

  const data = await fetchFn()
  await redis.setex(key, ttl, JSON.stringify(data))

  return data
}
```

**异步处理**：

```typescript
import { Queue, Worker } from 'bullmq'

const queue = new Queue('api-gateway', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
})

async function enqueueJob(jobName: string, data: any): Promise<void> {
  await queue.add(jobName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  })
}
```

### 5.2 安全加固

**输入验证**：

```typescript
import { body, param, query, validationResult } from 'express-validator'

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: {
        message: '请求参数验证失败',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      }
    })
    return
  }

  next()
}

export const toolExecutionValidation = [
  body('toolName').notEmpty().isString(),
  body('parameters').isObject(),
  validateRequest
]
```

**CORS配置**：

```typescript
import cors from 'cors'

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400
}))
```

**安全头**：

```typescript
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true
}))
```

### 5.3 可观测性

**分布式追踪**：

```typescript
import { trace } from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'api-gateway',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0'
  })
})

provider.register()

export function withTracing<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const tracer = trace.getTracer('api-gateway')

  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
      throw error
    } finally {
      span.end()
    }
  })
}
```

**指标导出**：

```typescript
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { MeterProvider } from '@opentelemetry/sdk-metrics'

const exporter = new PrometheusExporter({
  port: 9464
})

const meterProvider = new MeterProvider()
meterProvider.addMetricReader(exporter)

export const meter = meterProvider.getMeter('api-gateway')
export const requestCounter = meter.createCounter('http_requests_total')
export const responseTimeHistogram = meter.createHistogram('http_request_duration_ms')
```

---

## 六、总结

YYC³智能预测系统的API网关设计遵循"五高五标五化"核心原则，实现了：

**高可用**：

- 多实例部署
- 健康检查
- 故障转移
- 优雅降级

**高性能**：

- 连接池优化
- 多级缓存
- 异步处理
- 负载均衡

**高安全**：

- JWT认证
- API鉴权
- 限流防护
- 输入验证

**高可扩展**：

- 插件化架构
- 动态路由
- 水平扩展
- 服务发现

**高可维护**：

- 配置管理
- 监控告警
- 日志追踪
- 完整文档

通过完善的路由管理、可靠的负载均衡、智能的熔断保护、严格的限流控制，API网关能够稳定、高效地处理所有外部请求，为整个微服务架构提供统一的入口和保障。

---

## 附录

### A. API端点

| 端点 | 方法 | 描述 | 认证 |
|------|------|------|------|
| /health | GET | 健康检查 | 否 |
| /metrics | GET | 指标数据 | 是 |
| /api/v1/tools | GET | 获取工具列表 | 是 |
| /api/v1/tools/:id | GET | 获取工具详情 | 是 |
| /api/v1/tools/:id/execute | POST | 执行工具 | 是 |
| /api/v1/knowledge | GET | 获取知识 | 是 |
| /api/v1/knowledge/:id | GET | 获取知识详情 | 是 |
| /api/v1/goals | GET | 获取目标列表 | 是 |
| /api/v1/goals | POST | 创建目标 | 是 |
| /api/v1/goals/:id | GET | 获取目标详情 | 是 |
| /api/v1/goals/:id | PUT | 更新目标 | 是 |
| /api/v1/goals/:id | DELETE | 删除目标 | 是 |

### B. 错误码

| 错误码 | HTTP状态 | 描述 |
|--------|---------|------|
| AUTH_FAILED | 401 | 认证失败 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源未找到 |
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| SERVICE_UNAVAILABLE | 503 | 服务不可用 |
| CIRCUIT_BREAKER_OPEN | 503 | 熔断器已开启 |
| TIMEOUT | 504 | 请求超时 |
| INTERNAL_ERROR | 500 | 内部服务器错误 |

### C. 相关文档

- [总体架构设计文档](./01-YYC3-XY-架构类-总体架构设计文档.md)
- [微服务架构设计文档](./02-YYC3-XY-架构类-微服务架构设计文档.md)
- [前端架构设计文档](./02-YYC3-XY-架构类-前端架构设计文档.md)
- [安全架构设计文档](./05-YYC3-XY-架构类-安全架构设计文档.md)
- [部署架构设计文档](./07-YYC3-XY-架构类-部署架构设计文档.md)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
