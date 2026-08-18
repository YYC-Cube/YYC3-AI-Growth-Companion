---
@file: 032-YYC3-XY-架构类-数据访问层架构实现文档.md
@description: YYC3-XY项目架构类数据访问层架构实现文档文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-24
@updated: 2025-12-24
@status: draft
@tags: 数据访问层,开发实施,技术实现,YYC3-XY
---

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

## **"五高"战略定位**
- **高起点规划**：基于数据驱动架构进行数据访问层顶层设计
- **高标准建设**：采用业界领先的数据访问模式与ORM框架
- **高效率运营**：优化数据查询、缓存、同步全链路流程
- **高质量服务**：提升数据一致性、可用性和访问性能
- **高效益回报**：确保数据资产投入产出合理化

## **"五标"体系构建**
- **流程标准化**：数据访问流程SOP数字化落地
- **数据标准化**：统一数据模型与访问接口规范
- **服务标准化**：一致性数据访问体验
- **安全标准化**：全方位数据安全保障体系
- **评价标准化**：多维量化数据质量评估指标

## **"五化"实现路径**
- **数字化**：全要素数据采集与转换
- **网络化**：全域数据互联互通
- **智能化**：AI驱动数据决策与执行
- **自动化**：减少人工干预环节
- **生态化**：数据产业链协同整合

# 数据访问层架构实现文档

## 一、数据访问层架构概述

### 1.1 整体架构

YYC3-XY系统采用分层数据访问架构，遵循以下设计原则：

```yaml
数据访问架构层次:
  应用层:
    - 业务逻辑层
    - 服务编排层
    - API网关层
    
  数据访问层:
    - Repository模式
    - ORM映射层
    - 数据查询构建器
    - 缓存抽象层
    
  数据存储层:
    - 关系型数据库
    - NoSQL数据库
    - 向量数据库
    - 文件存储
    
  数据同步层:
    - 数据同步服务
    - 消息队列
    - CDC变更数据捕获
```

### 1.2 技术选型

```yaml
数据访问技术栈:
  ORM框架:
    - Prisma (TypeScript优先)
    - 支持类型安全
    - 自动迁移生成
    - 查询构建器
    
  数据库:
    - PostgreSQL (主数据库)
      - 版本: 14+
      - 端口: 5432
      - 特性: JSONB支持、全文检索
    - Redis (缓存)
      - 版本: 7+
      - 端口: 6379
      - 特性: 持久化、集群
    - Qdrant (向量数据库)
      - 版本: 1.7+
      - 端口: 6333
      - 特性: HNSW索引、过滤查询
      
  连接池:
    - Prisma连接池
    - 最大连接数: 20
    - 最小连接数: 2
    - 超时时间: 30秒
```

### 1.3 端口配置

```yaml
数据服务端口配置:
  PostgreSQL端口: 5432
    - 主数据库服务
    - 数据持久化存储
    
  Redis端口: 6379
    - 缓存服务
    - 会话存储
    - 消息队列
    
  Qdrant端口: 6333
    - 向量数据库
    - 语义检索
    - AI模型存储
```

## 二、数据访问设计规范

### 2.1 Repository模式

```typescript
// types/repositoryTypes.ts
/**
 * @description Repository基础接口定义
 */
export interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findByIds(ids: ID[]): Promise<T[]>;
  findAll(options?: FindOptions<T>): Promise<T[]>;
  findOne(options: FindOptions<T>): Promise<T | null>;
  create(data: CreateDTO<T>): Promise<T>;
  createMany(data: CreateDTO<T>[]): Promise<T[]>;
  update(id: ID, data: UpdateDTO<T>): Promise<T>;
  updateMany(filter: Filter<T>, data: UpdateDTO<T>): Promise<number>;
  delete(id: ID): Promise<boolean>;
  deleteMany(filter: Filter<T>): Promise<number>;
  count(filter?: Filter<T>): Promise<number>;
  exists(filter: Filter<T>): Promise<boolean>;
}

/**
 * @description 查询选项接口
 */
export interface FindOptions<T> {
  where?: Filter<T>;
  select?: Partial<Record<keyof T, boolean>>;
  orderBy?: OrderBy<T>;
  skip?: number;
  take?: number;
  include?: IncludeOptions<T>;
}

/**
 * @description 过滤条件接口
 */
export type Filter<T> = Partial<{
  [K in keyof T]: T[K] | FilterOperator<T[K]>;
}>;

/**
 * @description 过滤操作符
 */
export type FilterOperator<T> = {
  equals?: T;
  in?: T[];
  notIn?: T[];
  lt?: T;
  lte?: T;
  gt?: T;
  gte?: T;
  contains?: T;
  startsWith?: T;
  endsWith?: T;
  and?: Filter<T>[];
  or?: Filter<T>[];
  not?: Filter<T>;
};

/**
 * @description 排序选项
 */
export type OrderBy<T> = {
  [K in keyof T]?: 'asc' | 'desc';
} | {
  [K in keyof T]?: 'asc' | 'desc';
}[];
```

### 2.2 基础Repository实现

```typescript
// repositories/baseRepository.ts
/**
 * @description 基础Repository抽象类
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { IRepository, FindOptions, Filter, CreateDTO, UpdateDTO } from '../types/repositoryTypes';

export abstract class BaseRepository<T, ID = string> implements IRepository<T, ID> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  protected get model() {
    return (this.prisma as any)[this.modelName];
  }

  async findById(id: ID): Promise<T | null> {
    return this.model.findUnique({
      where: { id }
    });
  }

  async findByIds(ids: ID[]): Promise<T[]> {
    return this.model.findMany({
      where: {
        id: { in: ids }
      }
    });
  }

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.model.findMany(this.buildPrismaOptions(options));
  }

  async findOne(options: FindOptions<T>): Promise<T | null> {
    return this.model.findFirst(this.buildPrismaOptions(options));
  }

  async create(data: CreateDTO<T>): Promise<T> {
    return this.model.create({
      data: data as any
    });
  }

  async createMany(data: CreateDTO<T>[]): Promise<T[]> {
    const results = await this.model.createMany({
      data: data as any[]
    });
    return this.findByIds(results as any);
  }

  async update(id: ID, data: UpdateDTO<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data: data as any
    });
  }

  async updateMany(filter: Filter<T>, data: UpdateDTO<T>): Promise<number> {
    const result = await this.model.updateMany({
      where: filter as any,
      data: data as any
    });
    return result.count;
  }

  async delete(id: ID): Promise<boolean> {
    await this.model.delete({
      where: { id }
    });
    return true;
  }

  async deleteMany(filter: Filter<T>): Promise<number> {
    const result = await this.model.deleteMany({
      where: filter as any
    });
    return result.count;
  }

  async count(filter?: Filter<T>): Promise<number> {
    return this.model.count({
      where: filter as any
    });
  }

  async exists(filter: Filter<T>): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }

  protected buildPrismaOptions(options?: FindOptions<T>): any {
    const prismaOptions: any = {};

    if (options?.where) {
      prismaOptions.where = options.where;
    }

    if (options?.select) {
      prismaOptions.select = options.select;
    }

    if (options?.orderBy) {
      prismaOptions.orderBy = options.orderBy;
    }

    if (options?.skip !== undefined) {
      prismaOptions.skip = options.skip;
    }

    if (options?.take !== undefined) {
      prismaOptions.take = options.take;
    }

    if (options?.include) {
      prismaOptions.include = options.include;
    }

    return prismaOptions;
  }
}
```

## 三、核心Repository实现

### 3.1 用户Repository

```typescript
// repositories/userRepository.ts
/**
 * @description 用户Repository实现
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './baseRepository';
import { User, Prisma } from '@prisma/client';

export class UserRepository extends BaseRepository<User, string> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email }
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.model.findUnique({
      where: { username }
    });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.model.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });
  }

  async searchUsers(keyword: string, options?: FindOptions<User>): Promise<User[]> {
    return this.model.findMany({
      ...this.buildPrismaOptions(options),
      where: {
        OR: [
          { username: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } },
          { profile: { firstName: { contains: keyword, mode: 'insensitive' } } },
          { profile: { lastName: { contains: keyword, mode: 'insensitive' } } }
        ]
      }
    });
  }

  async updateLastLogin(userId: string): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  }

  async changePassword(userId: string, hashedPassword: string): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  async deactivateUser(userId: string): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { 
        status: 'INACTIVE',
        deactivatedAt: new Date()
      }
    });
  }

  async activateUser(userId: string): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { 
        status: 'ACTIVE',
        deactivatedAt: null
      }
    });
  }

  async getUserWithProfile(userId: string): Promise<User | null> {
    return this.model.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: {
          include: {
            permissions: true
          }
        }
      }
    });
  }
}
```

### 3.2 项目Repository

```typescript
// repositories/projectRepository.ts
/**
 * @description 项目Repository实现
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './baseRepository';
import { Project, Prisma } from '@prisma/client';

export class ProjectRepository extends BaseRepository<Project, string> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'project');
  }

  async findByOwnerId(ownerId: string, options?: FindOptions<Project>): Promise<Project[]> {
    return this.model.findMany({
      ...this.buildPrismaOptions(options),
      where: { ownerId }
    });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.model.findUnique({
      where: { slug }
    });
  }

  async searchProjects(keyword: string, options?: FindOptions<Project>): Promise<Project[]> {
    return this.model.findMany({
      ...this.buildPrismaOptions(options),
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ]
      }
    });
  }

  async getProjectWithMembers(projectId: string): Promise<Project | null> {
    return this.model.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        members: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async addMember(projectId: string, userId: string, role: string = 'MEMBER'): Promise<void> {
    await this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role
      }
    });
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectMember.deleteMany({
      where: {
        projectId,
        userId
      }
    });
  }

  async updateMemberRole(projectId: string, userId: string, role: string): Promise<void> {
    await this.prisma.projectMember.updateMany({
      where: {
        projectId,
        userId
      },
      data: { role }
    });
  }

  async getProjectStats(projectId: string): Promise<{
    totalFiles: number;
    totalCommits: number;
    totalMembers: number;
    lastActivity: Date | null;
  }> {
    const [totalFiles, totalCommits, totalMembers, lastCommit] = await Promise.all([
      this.prisma.file.count({ where: { projectId } }),
      this.prisma.commit.count({ where: { projectId } }),
      this.prisma.projectMember.count({ where: { projectId } }),
      this.prisma.commit.findFirst({
        where: { projectId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      totalFiles,
      totalCommits,
      totalMembers,
      lastActivity: lastCommit?.createdAt || null
    };
  }
}
```

### 3.3 AI会话Repository

```typescript
// repositories/aiSessionRepository.ts
/**
 * @description AI会话Repository实现
 */
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './baseRepository';
import { AISession, Prisma } from '@prisma/client';

export class AISessionRepository extends BaseRepository<AISession, string> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'aISession');
  }

  async findByUserId(userId: string, options?: FindOptions<AISession>): Promise<AISession[]> {
    return this.model.findMany({
      ...this.buildPrismaOptions(options),
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findByProjectId(projectId: string, options?: FindOptions<AISession>): Promise<AISession[]> {
    return this.model.findMany({
      ...this.buildPrismaOptions(options),
      where: { projectId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getSessionWithMessages(sessionId: string): Promise<AISession | null> {
    return this.model.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async createMessage(sessionId: string, content: string, role: 'USER' | 'ASSISTANT'): Promise<void> {
    await this.prisma.aIMessage.create({
      data: {
        sessionId,
        content,
        role
      }
    });
  }

  async updateSessionSummary(sessionId: string, summary: string): Promise<AISession> {
    return this.model.update({
      where: { id: sessionId },
      data: { summary }
    });
  }

  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    totalMessages: number;
    activeSessions: number;
  }> {
    const [totalSessions, totalMessages, activeSessions] = await Promise.all([
      this.count({ userId }),
      this.prisma.aIMessage.count({
        where: {
          session: { userId }
        }
      }),
      this.count({
        userId,
        status: 'ACTIVE'
      })
    ]);

    return {
      totalSessions,
      totalMessages,
      activeSessions
    };
  }
}
```

## 四、缓存策略实现

### 4.1 缓存抽象层

```typescript
// cache/cacheProvider.ts
/**
 * @description 缓存提供者抽象接口
 */
export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttl: number): Promise<void>;
  getTTL(key: string): Promise<number>;
  flush(): Promise<void>;
}

/**
 * @description Redis缓存提供者实现
 */
import Redis from 'ioredis';

export class RedisCacheProvider implements ICacheProvider {
  private redis: Redis;

  constructor(config: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  }) {
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  async getTTL(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}
```

### 4.2 缓存装饰器

```typescript
// cache/cacheDecorator.ts
/**
 * @description 缓存装饰器实现
 */
import { ICacheProvider } from './cacheProvider';

export function Cacheable(
  keyPrefix: string,
  ttl: number = 3600
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheKey = `${keyPrefix}:${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const cacheProvider: ICacheProvider = this.cacheProvider;
      const key = `${cacheKey}:${JSON.stringify(args)}`;

      const cached = await cacheProvider.get(key);
      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      await cacheProvider.set(key, result, ttl);

      return result;
    };

    return descriptor;
  };
}

export function CacheEvict(
  keyPrefix: string,
  pattern?: boolean
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheKey = `${keyPrefix}:${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const cacheProvider: ICacheProvider = this.cacheProvider;
      const key = pattern 
        ? `${cacheKey}:*`
        : `${cacheKey}:${JSON.stringify(args)}`;

      const result = await originalMethod.apply(this, args);

      if (pattern) {
        await cacheProvider.deletePattern(key);
      } else {
        await cacheProvider.delete(key);
      }

      return result;
    };

    return descriptor;
  };
}
```

### 4.3 缓存Repository包装器

```typescript
// cache/cachedRepository.ts
/**
 * @description 缓存Repository包装器
 */
import { ICacheProvider } from './cacheProvider';
import { IRepository, FindOptions, Filter, CreateDTO, UpdateDTO } from '../types/repositoryTypes';

export class CachedRepository<T, ID = string> implements IRepository<T, ID> {
  constructor(
    private repository: IRepository<T, ID>,
    private cacheProvider: ICacheProvider,
    private keyPrefix: string,
    private defaultTTL: number = 3600
  ) {}

  private buildKey(id: ID): string {
    return `${this.keyPrefix}:${id}`;
  }

  private buildListKey(options?: FindOptions<T>): string {
    return `${this.keyPrefix}:list:${JSON.stringify(options)}`;
  }

  async findById(id: ID): Promise<T | null> {
    const key = this.buildKey(id);
    const cached = await this.cacheProvider.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = await this.repository.findById(id);
    
    if (result !== null) {
      await this.cacheProvider.set(key, result, this.defaultTTL);
    }

    return result;
  }

  async findByIds(ids: ID[]): Promise<T[]> {
    const keys = ids.map(id => this.buildKey(id));
    const cachedResults = await Promise.all(
      keys.map(key => this.cacheProvider.get<T>(key))
    );

    const cachedItems = cachedResults.filter(item => item !== null) as T[];
    const missingIds = ids.filter((_, index) => cachedResults[index] === null);

    if (missingIds.length === 0) {
      return cachedItems;
    }

    const fetchedItems = await this.repository.findByIds(missingIds);

    await Promise.all(
      fetchedItems.map(item => 
        this.cacheProvider.set(this.buildKey(item.id as ID), item, this.defaultTTL)
      )
    );

    return [...cachedItems, ...fetchedItems];
  }

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    const key = this.buildListKey(options);
    const cached = await this.cacheProvider.get<T[]>(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = await this.repository.findAll(options);
    await this.cacheProvider.set(key, result, this.defaultTTL);

    return result;
  }

  async findOne(options: FindOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async create(data: CreateDTO<T>): Promise<T> {
    const result = await this.repository.create(data);
    await this.cacheProvider.set(this.buildKey(result.id as ID), result, this.defaultTTL);
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:list:*`);
    return result;
  }

  async createMany(data: CreateDTO<T>[]): Promise<T[]> {
    const results = await this.repository.createMany(data);
    
    await Promise.all(
      results.map(item => 
        this.cacheProvider.set(this.buildKey(item.id as ID), item, this.defaultTTL)
      )
    );
    
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:list:*`);
    
    return results;
  }

  async update(id: ID, data: UpdateDTO<T>): Promise<T> {
    const result = await this.repository.update(id, data);
    await this.cacheProvider.set(this.buildKey(id), result, this.defaultTTL);
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:list:*`);
    return result;
  }

  async updateMany(filter: Filter<T>, data: UpdateDTO<T>): Promise<number> {
    const count = await this.repository.updateMany(filter, data);
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:*`);
    return count;
  }

  async delete(id: ID): Promise<boolean> {
    const result = await this.repository.delete(id);
    await this.cacheProvider.delete(this.buildKey(id));
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:list:*`);
    return result;
  }

  async deleteMany(filter: Filter<T>): Promise<number> {
    const count = await this.repository.deleteMany(filter);
    await this.cacheProvider.deletePattern(`${this.keyPrefix}:*`);
    return count;
  }

  async count(filter?: Filter<T>): Promise<number> {
    return this.repository.count(filter);
  }

  async exists(filter: Filter<T>): Promise<boolean> {
    return this.repository.exists(filter);
  }
}
```

## 五、事务管理

### 5.1 事务管理器

```typescript
// transaction/transactionManager.ts
/**
 * @description 事务管理器实现
 */
import { PrismaClient, Prisma } from '@prisma/client';

export class TransactionManager {
  constructor(private prisma: PrismaClient) {}

  async executeInTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return callback(tx);
    });
  }

  async executeInTransactionWithRetry<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          return callback(tx);
        });
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          await this.sleep(delayMs * attempt);
        }
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 5.2 工作单元模式

```typescript
// transaction/unitOfWork.ts
/**
 * @description 工作单元模式实现
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { TransactionManager } from './transactionManager';
import { UserRepository } from '../repositories/userRepository';
import { ProjectRepository } from '../repositories/projectRepository';

export class UnitOfWork {
  private prisma: Prisma.TransactionClient;
  private transactionManager: TransactionManager;

  private _userRepository?: UserRepository;
  private _projectRepository?: ProjectRepository;

  constructor(
    prisma: Prisma.TransactionClient,
    transactionManager: TransactionManager
  ) {
    this.prisma = prisma;
    this.transactionManager = transactionManager;
  }

  get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(this.prisma as any);
    }
    return this._userRepository;
  }

  get projectRepository(): ProjectRepository {
    if (!this._projectRepository) {
      this._projectRepository = new ProjectRepository(this.prisma as any);
    }
    return this._projectRepository;
  }

  async commit(): Promise<void> {
    await this.prisma.$commit();
  }

  async rollback(): Promise<void> {
    await this.prisma.$rollback();
  }
}

export class UnitOfWorkFactory {
  constructor(
    private prisma: PrismaClient,
    private transactionManager: TransactionManager
  ) {}

  async create<T>(
    callback: (uow: UnitOfWork) => Promise<T>
  ): Promise<T> {
    return this.transactionManager.executeInTransaction(async (tx) => {
      const uow = new UnitOfWork(tx, this.transactionManager);
      return callback(uow);
    });
  }
}
```

## 六、数据库迁移管理

### 6.1 迁移配置

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  username      String    @unique
  email         String    @unique
  password      String
  status        UserStatus @default(ACTIVE)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deactivatedAt DateTime?

  profile       UserProfile?
  roles         UserRole[]
  sessions      AISession[]
  projectMembers ProjectMember[]

  @@index([email])
  @@index([username])
  @@index([status])
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model UserProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  firstName String?
  lastName  String?
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Project {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  ownerId     String
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner   User            @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  members ProjectMember[]
  files   File[]
  commits Commit[]
  sessions AISession[]

  @@index([ownerId])
  @@index([slug])
  @@index([status])
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
  DELETED
}

model ProjectMember {
  id        String   @id @default(uuid())
  projectId String
  userId    String
  role      ProjectMemberRole @default(MEMBER)
  joinedAt  DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([projectId])
  @@index([userId])
}

enum ProjectMemberRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

model AISession {
  id          String       @id @default(uuid())
  userId      String
  projectId   String?
  title       String
  summary     String?
  status      AISessionStatus @default(ACTIVE)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user     User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  project  Project?   @relation(fields: [projectId], references: [id], onDelete: SetNull)
  messages AIMessage[]

  @@index([userId])
  @@index([projectId])
  @@index([status])
}

enum AISessionStatus {
  ACTIVE
  ARCHIVED
  DELETED
}

model AIMessage {
  id        String   @id @default(uuid())
  sessionId String
  content   String   @db.Text
  role      AIMessageRole
  createdAt DateTime @default(now())

  session AISession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
}

enum AIMessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

### 6.2 迁移脚本管理

```typescript
// scripts/migrate.ts
/**
 * @description 数据库迁移脚本
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库迁移...');

  try {
    await prisma.$executeRaw`
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "user_email_trgm_idx" 
      ON "User" USING gin (email gin_trgm_ops);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "user_username_trgm_idx" 
      ON "User" USING gin (username gin_trgm_ops);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "project_name_trgm_idx" 
      ON "Project" USING gin (name gin_trgm_ops);
    `;

    console.log('数据库迁移完成');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 七、数据访问层配置

### 7.1 Prisma配置

```typescript
// config/database.ts
/**
 * @description 数据库配置
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
});

prisma.$connect()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((error) => {
    console.error('数据库连接失败:', error);
    process.exit(1);
  });

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
```

### 7.2 Redis配置

```typescript
// config/redis.ts
/**
 * @description Redis配置
 */
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('Redis连接成功');
});

redis.on('error', (error) => {
  console.error('Redis连接错误:', error);
});

export default redis;
```

## 八、数据访问层使用示例

### 8.1 Repository使用

```typescript
// services/userService.ts
/**
 * @description 用户服务示例
 */
import prisma from '../config/database';
import { UserRepository } from '../repositories/userRepository';
import { RedisCacheProvider } from '../cache/cacheProvider';
import { CachedRepository } from '../cache/cachedRepository';
import redis from '../config/redis';

const userRepository = new UserRepository(prisma);
const cacheProvider = new RedisCacheProvider({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
});

const cachedUserRepository = new CachedRepository(
  userRepository,
  cacheProvider,
  'user',
  3600
);

export class UserService {
  async getUserById(userId: string) {
    return cachedUserRepository.findById(userId);
  }

  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async createUser(userData: any) {
    return cachedUserRepository.create(userData);
  }

  async updateUser(userId: string, userData: any) {
    return cachedUserRepository.update(userId, userData);
  }

  async deleteUser(userId: string) {
    return cachedUserRepository.delete(userId);
  }

  async searchUsers(keyword: string, page: number = 1, pageSize: number = 20) {
    return userRepository.searchUsers(keyword, {
      skip: (page - 1) * pageSize,
      take: pageSize
    });
  }
}
```

### 8.2 事务使用

```typescript
// services/projectService.ts
/**
 * @description 项目服务示例（含事务）
 */
import prisma from '../config/database';
import { TransactionManager } from '../transaction/transactionManager';
import { UnitOfWorkFactory } from '../transaction/unitOfWork';
import { ProjectRepository } from '../repositories/projectRepository';
import { UserRepository } from '../repositories/userRepository';

const transactionManager = new TransactionManager(prisma);
const unitOfWorkFactory = new UnitOfWorkFactory(prisma, transactionManager);

export class ProjectService {
  async createProjectWithOwner(projectData: any, ownerEmail: string) {
    return unitOfWorkFactory.create(async (uow) => {
      const user = await uow.userRepository.findByEmail(ownerEmail);
      
      if (!user) {
        throw new Error('User not found');
      }

      const project = await uow.projectRepository.create({
        ...projectData,
        ownerId: user.id
      });

      await uow.projectRepository.addMember(project.id, user.id, 'OWNER');

      return project;
    });
  }

  async transferProject(projectId: string, newOwnerEmail: string) {
    return unitOfWorkFactory.create(async (uow) => {
      const project = await uow.projectRepository.findById(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      const newOwner = await uow.userRepository.findByEmail(newOwnerEmail);
      
      if (!newOwner) {
        throw new Error('New owner not found');
      }

      const updatedProject = await uow.projectRepository.update(projectId, {
        ownerId: newOwner.id
      });

      await uow.projectRepository.updateMemberRole(projectId, newOwner.id, 'OWNER');
      await uow.projectRepository.updateMemberRole(projectId, project.ownerId, 'ADMIN');

      return updatedProject;
    });
  }
}
```

## 十、数据库性能优化

### 10.1 查询优化策略

```typescript
// services/queryOptimizer.ts
/**
 * @description 查询优化服务
 */
import { Prisma } from '@prisma/client';

export class QueryOptimizer {
  /**
   * @description 优化查询条件
   */
  static optimizeWhereClause(where: any): any {
    const optimized: any = {};

    for (const [key, value] of Object.entries(where)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        optimized[key] = this.optimizeWhereClause(value);
      } else {
        optimized[key] = value;
      }
    }

    return optimized;
  }

  /**
   * @description 添加查询提示
   */
  static addQueryHints(query: any, hints: QueryHints): any {
    if (hints.useIndex) {
      query = query.withQueryHint(`USE INDEX (${hints.useIndex})`);
    }

    if (hints.forceIndex) {
      query = query.withQueryHint(`FORCE INDEX (${hints.forceIndex})`);
    }

    return query;
  }

  /**
   * @description 分页优化
   */
  static optimizePagination<T>(
    query: Prisma.Prisma__TClient<T>['findMany'],
    page: number,
    pageSize: number
  ) {
    const skip = (page - 1) * pageSize;
    const take = Math.min(pageSize, 100);

    return query.skip(skip).take(take);
  }
}

interface QueryHints {
  useIndex?: string;
  forceIndex?: string;
  maxExecutionTime?: number;
}
```

### 10.2 索引管理

```typescript
// services/indexManager.ts
/**
 * @description 索引管理服务
 */
import { PrismaClient } from '@prisma/client';

export class IndexManager {
  constructor(private prisma: PrismaClient) {}

  /**
   * @description 创建复合索引
   */
  async createCompositeIndex(
    table: string,
    columns: string[],
    options?: IndexOptions
  ): Promise<void> {
    const indexName = `idx_${table}_${columns.join('_')}`;
    const columnsDef = columns.join(', ');
    const unique = options?.unique ? 'UNIQUE' : '';
    const concurrently = options?.concurrent ? 'CONCURRENTLY' : '';

    const sql = `
      CREATE ${unique} INDEX ${concurrently} IF NOT EXISTS ${indexName}
      ON ${table} (${columnsDef})
      ${options?.where ? `WHERE ${options.where}` : ''}
    `;

    await this.prisma.$executeRawUnsafe(sql);
  }

  /**
   * @description 分析索引使用情况
   */
  async analyzeIndexUsage(table: string): Promise<IndexUsage[]> {
    const sql = `
      SELECT
        indexrelname as index_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public' AND relname = $1
      ORDER BY idx_scan DESC
    `;

    return this.prisma.$queryRawUnsafe(sql, table) as Promise<IndexUsage[]>;
  }

  /**
   * @description 删除未使用的索引
   */
  async dropUnusedIndexes(table: string, threshold: number = 100): Promise<void> {
    const unusedIndexes = await this.prisma.$queryRawUnsafe<IndexUsage[]>(`
      SELECT indexrelname as index_name
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public' 
        AND relname = $1
        AND idx_scan < $2
        AND indexrelname NOT LIKE '%_pkey'
    `, table, threshold);

    for (const index of unusedIndexes) {
      await this.prisma.$executeRawUnsafe(
        `DROP INDEX CONCURRENTLY IF EXISTS ${index.index_name}`
      );
    }
  }
}

interface IndexOptions {
  unique?: boolean;
  concurrent?: boolean;
  where?: string;
}

interface IndexUsage {
  index_name: string;
  index_scans: number;
  tuples_read: number;
  tuples_fetched: number;
  index_size: string;
}
```

### 10.3 数据库健康检查

```typescript
// services/databaseHealthCheck.ts
/**
 * @description 数据库健康检查服务
 */
import { PrismaClient } from '@prisma/client';

export class DatabaseHealthCheck {
  constructor(private prisma: PrismaClient) {}

  /**
   * @description 执行完整健康检查
   */
  async checkHealth(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkConnection(),
      this.checkConnectionPool(),
      this.checkQueryPerformance(),
      this.checkReplicationLag(),
      this.checkDiskSpace()
    ]);

    return {
      status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
      checks: {
        connection: this.getResult(checks[0]),
        connectionPool: this.getResult(checks[1]),
        queryPerformance: this.getResult(checks[2]),
        replicationLag: this.getResult(checks[3]),
        diskSpace: this.getResult(checks[4])
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * @description 检查数据库连接
   */
  private async checkConnection(): Promise<ConnectionHealth> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 检查连接池状态
   */
  private async checkConnectionPool(): Promise<PoolHealth> {
    const pool = (this.prisma as any)._engine?.dataSource?.driver;
    
    if (!pool) {
      return { status: 'unknown', error: 'Pool not available' };
    }

    return {
      status: 'healthy',
      totalConnections: pool.totalCount,
      activeConnections: pool.activeCount,
      idleConnections: pool.idleCount
    };
  }

  /**
   * @description 检查查询性能
   */
  private async checkQueryPerformance(): Promise<QueryPerformanceHealth> {
    const start = Date.now();
    
    try {
      await this.prisma.$queryRaw`
        SELECT pg_stat_statements_reset()
      `;
      
      const latency = Date.now() - start;
      const status = latency < 100 ? 'healthy' : 'degraded';
      
      return { status, avgLatency: latency };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 检查复制延迟
   */
  private async checkReplicationLag(): Promise<ReplicationHealth> {
    try {
      const result = await this.prisma.$queryRawUnsafe<ReplicationLagResult[]>(`
        SELECT CASE 
          WHEN pg_last_xact_replay_timestamp() IS NULL THEN 0
          ELSE EXTRACT(EPOCH FROM (now() - pg_last_xact_replay_timestamp()))
        END as lag_seconds
      `);

      const lag = result[0]?.lag_seconds || 0;
      const status = lag < 5 ? 'healthy' : 'degraded';
      
      return { status, lagSeconds: lag };
    } catch (error) {
      return {
        status: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 检查磁盘空间
   */
  private async checkDiskSpace(): Promise<DiskSpaceHealth> {
    try {
      const result = await this.prisma.$queryRawUnsafe<DiskSpaceResult[]>(`
        SELECT
          pg_size_pretty(pg_database_size(current_database())) as database_size,
          pg_size_pretty(pg_tablespace_size('pg_default')) as tablespace_size
      `);

      return {
        status: 'healthy',
        databaseSize: result[0]?.database_size || 'unknown',
        tablespaceSize: result[0]?.tablespace_size || 'unknown'
      };
    } catch (error) {
      return {
        status: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getResult<T>(result: PromiseSettledResult<T>): T {
    return result.status === 'fulfilled' ? result.value : null as any;
  }
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    connection: ConnectionHealth | null;
    connectionPool: PoolHealth | null;
    queryPerformance: QueryPerformanceHealth | null;
    replicationLag: ReplicationHealth | null;
    diskSpace: DiskSpaceHealth | null;
  };
  timestamp: string;
}

interface ConnectionHealth {
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}

interface PoolHealth {
  status: 'healthy' | 'degraded';
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  error?: string;
}

interface QueryPerformanceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  avgLatency?: number;
  error?: string;
}

interface ReplicationHealth {
  status: 'healthy' | 'degraded' | 'unknown';
  lagSeconds?: number;
  error?: string;
}

interface DiskSpaceHealth {
  status: 'healthy' | 'degraded' | 'unknown';
  databaseSize?: string;
  tablespaceSize?: string;
  error?: string;
}

interface ReplicationLagResult {
  lag_seconds: number;
}

interface DiskSpaceResult {
  database_size: string;
  tablespace_size: string;
}
```

### 10.4 数据备份与恢复

```typescript
// services/backupService.ts
/**
 * @description 数据备份与恢复服务
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export class BackupService {
  private backupDir: string;
  private retentionDays: number = 7;

  constructor() {
    this.backupDir = process.env.BACKUP_DIR || './backups';
    this.ensureBackupDir();
  }

  /**
   * @description 创建完整备份
   */
  async createFullBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `full-backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    const command = [
      'pg_dump',
      `-d ${process.env.DATABASE_URL}`,
      `-f ${filepath}`,
      '--format=plain',
      '--no-owner',
      '--no-acl',
      '--verbose'
    ].join(' ');

    try {
      const { stdout, stderr } = await execAsync(command);
      
      const stats = await fs.promises.stat(filepath);
      
      return {
        success: true,
        filename,
        filepath,
        size: stats.size,
        timestamp: new Date().toISOString(),
        logs: stderr
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 创建增量备份
   */
  async createIncrementalBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `incremental-backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    const command = [
      'pg_dump',
      `-d ${process.env.DATABASE_URL}`,
      `-f ${filepath}`,
      '--format=plain',
      '--data-only',
      '--no-owner',
      '--no-acl'
    ].join(' ');

    try {
      const { stdout, stderr } = await execAsync(command);
      
      const stats = await fs.promises.stat(filepath);
      
      return {
        success: true,
        filename,
        filepath,
        size: stats.size,
        timestamp: new Date().toISOString(),
        logs: stderr
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 恢复备份
   */
  async restoreBackup(backupFile: string): Promise<RestoreResult> {
    const filepath = path.join(this.backupDir, backupFile);

    if (!fs.existsSync(filepath)) {
      return {
        success: false,
        error: 'Backup file not found'
      };
    }

    const command = [
      'psql',
      `-d ${process.env.DATABASE_URL}`,
      `-f ${filepath}`,
      '--quiet',
      '--set ON_ERROR_STOP=on'
    ].join(' ');

    try {
      const { stdout, stderr } = await execAsync(command);
      
      return {
        success: true,
        backupFile,
        timestamp: new Date().toISOString(),
        logs: stderr
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @description 清理过期备份
   */
  async cleanupOldBackups(): Promise<CleanupResult> {
    const files = await fs.promises.readdir(this.backupDir);
    const now = Date.now();
    const maxAge = this.retentionDays * 24 * 60 * 60 * 1000;

    let deletedCount = 0;
    let deletedSize = 0;

    for (const file of files) {
      const filepath = path.join(this.backupDir, file);
      const stats = await fs.promises.stat(filepath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        await fs.promises.unlink(filepath);
        deletedCount++;
        deletedSize += stats.size;
      }
    }

    return {
      success: true,
      deletedCount,
      deletedSize,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * @description 列出所有备份
   */
  async listBackups(): Promise<BackupInfo[]> {
    const files = await fs.promises.readdir(this.backupDir);
    const backups: BackupInfo[] = [];

    for (const file of files) {
      const filepath = path.join(this.backupDir, file);
      const stats = await fs.promises.stat(filepath);

      backups.push({
        filename: file,
        size: stats.size,
        created: stats.mtime.toISOString(),
        type: file.startsWith('full-') ? 'full' : 'incremental'
      });
    }

    return backups.sort((a, b) => 
      new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }

  private ensureBackupDir(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }
}

interface BackupResult {
  success: boolean;
  filename?: string;
  filepath?: string;
  size?: number;
  timestamp?: string;
  logs?: string;
  error?: string;
}

interface RestoreResult {
  success: boolean;
  backupFile?: string;
  timestamp?: string;
  logs?: string;
  error?: string;
}

interface CleanupResult {
  success: boolean;
  deletedCount: number;
  deletedSize: number;
  timestamp: string;
}

interface BackupInfo {
  filename: string;
  size: number;
  created: string;
  type: 'full' | 'incremental';
}
```

## 附录

### A. 数据库连接池配置

```yaml
数据库连接池配置:
  PostgreSQL:
    最大连接数: 20
    最小连接数: 2
    连接超时: 30秒
    空闲超时: 600秒
    生命周期: 3600秒
    
  Redis:
    最大连接数: 50
    最小连接数: 5
    连接超时: 10秒
    重试延迟: 50ms
    最大重试次数: 3
```

### B. 缓存策略配置

```yaml
缓存策略配置:
  用户缓存:
    TTL: 3600秒
    键前缀: user
    缓存命中目标: 80%
    
  项目缓存:
    TTL: 1800秒
    键前缀: project
    缓存命中目标: 70%
    
  会话缓存:
    TTL: 7200秒
    键前缀: session
    缓存命中目标: 90%
```

### C. 数据访问层性能指标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 查询响应时间 | <100ms | - |
| 缓存命中率 | >80% | - |
| 连接池利用率 | <80% | - |
| 事务成功率 | >99.9% | - |
| 数据库连接数 | <20 | - |

### D. 故障排除指南

#### D.1 数据库连接问题

**问题1：数据库连接超时**

```
错误信息：Connection timeout: failed to connect to database
```

**解决方案：**

```typescript
// 1. 配置连接池超时设置
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error', 'warn'],
});

// 2. 实现连接重试机制
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        logger.warn(`Database operation failed, retrying (${attempt}/${maxRetries})`, {
          error: lastError.message
        });
        
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
}

// 使用示例
const user = await executeWithRetry(() => 
  prisma.user.findUnique({ where: { id: userId } })
);
```

**问题2：连接池耗尽**

```
错误信息：Connection pool exhausted
```

**解决方案：**

```typescript
// 1. 优化连接池配置
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // 连接池配置
  connectionLimit: 20,
  poolTimeout: 30,
  // 启用连接池监控
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
});

// 2. 实现连接池监控
prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`
    });
  }
});

// 3. 实现健康检查
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    return false;
  }
}
```

#### D.2 查询性能问题

**问题1：N+1查询问题**

```
问题现象：查询用户及其项目时，产生大量数据库查询
```

**解决方案：**

```typescript
// 错误示例：N+1查询
const users = await prisma.user.findMany();
for (const user of users) {
  const projects = await prisma.project.findMany({
    where: { userId: user.id }
  });
  user.projects = projects;
}

// 正确示例：使用include预加载
const users = await prisma.user.findMany({
  include: {
    projects: true
  }
});

// 或者使用select选择特定字段
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    projects: {
      select: {
        id: true,
        name: true
      }
    }
  }
});
```

**问题2：查询结果过大**

```
问题现象：查询返回大量数据导致内存溢出
```

**解决方案：**

```typescript
// 1. 实现分页查询
export async function getUsersWithPagination(
  page: number = 1,
  pageSize: number = 20
) {
  const skip = (page - 1) * pageSize;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);
  
  return {
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}

// 2. 使用游标分页（适合大数据集）
export async function getUsersWithCursorPagination(
  cursor?: string,
  pageSize: number = 20
) {
  const users = await prisma.user.findMany({
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' }
  });
  
  return {
    data: users,
    nextCursor: users.length === pageSize ? users[users.length - 1].id : null
  };
}

// 3. 使用流式处理
import { PrismaClient } from '@prisma/client';

export async function* streamUsers() {
  let cursor: string | undefined;
  
  while (true) {
    const users = await prisma.user.findMany({
      take: 100,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' }
    });
    
    if (users.length === 0) {
      break;
    }
    
    yield* users;
    cursor = users[users.length - 1].id;
  }
}

// 使用示例
for await (const user of streamUsers()) {
  // 处理每个用户
  console.log(user);
}
```

#### D.3 缓存问题

**问题1：缓存穿透**

```
问题现象：大量请求查询不存在的数据，绕过缓存直接查询数据库
```

**解决方案：**

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// 1. 实现布隆过滤器
import { BloomFilter } from 'bloom-filters';

const userExistsFilter = new BloomFilter(1000000, 0.01);

// 初始化时加载所有用户ID
async function initializeBloomFilter() {
  const userIds = await prisma.user.findMany({
    select: { id: true }
  });
  
  userIds.forEach(user => userExistsFilter.add(user.id));
}

// 2. 实现缓存空值
export async function getUserWithCache(userId: string) {
  const cacheKey = `user:${userId}`;
  
  // 检查布隆过滤器
  if (!userExistsFilter.has(userId)) {
    return null;
  }
  
  // 尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) {
    if (cached === 'NULL') {
      return null;
    }
    return JSON.parse(cached);
  }
  
  // 查询数据库
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  // 缓存结果（包括空值）
  if (user) {
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
  } else {
    await redis.setex(cacheKey, 300, 'NULL'); // 空值缓存5分钟
  }
  
  return user;
}
```

**问题2：缓存雪崩**

```
问题现象：大量缓存同时失效，导致数据库压力激增
```

**解决方案：**

```typescript
// 1. 实现随机过期时间
export async function setCacheWithRandomTTL(
  key: string,
  value: any,
  baseTTL: number = 3600
) {
  // 添加随机偏移（±10%）
  const randomOffset = Math.floor(baseTTL * 0.1 * (Math.random() * 2 - 1));
  const ttl = baseTTL + randomOffset;
  
  await redis.setex(key, ttl, JSON.stringify(value));
}

// 2. 实现缓存预热
export async function warmupCache() {
  const users = await prisma.user.findMany({
    take: 1000,
    orderBy: { lastActiveAt: 'desc' }
  });
  
  await Promise.all(
    users.map(user => 
      setCacheWithRandomTTL(`user:${user.id}`, user, 3600)
    )
  );
}

// 3. 实现互斥锁防止缓存击穿
export async function getWithLock<T>(
  key: string,
  factory: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const lockKey = `lock:${key}`;
  const lockValue = Date.now().toString();
  
  // 尝试获取锁
  const acquired = await redis.set(lockKey, lockValue, 'NX', 'EX', 10);
  
  if (acquired) {
    try {
      // 双重检查
      const doubleCheck = await redis.get(key);
      if (doubleCheck) {
        return JSON.parse(doubleCheck);
      }
      
      // 执行数据加载
      const value = await factory();
      await redis.setex(key, ttl, JSON.stringify(value));
      
      return value;
    } finally {
      // 释放锁
      await redis.del(lockKey);
    }
  } else {
    // 等待并重试
    await new Promise(resolve => setTimeout(resolve, 100));
    return getWithLock(key, factory, ttl);
  }
}
```

### E. 常见问题FAQ

#### E.1 Repository使用相关

**Q1：如何创建自定义Repository？**

A：按照以下步骤创建自定义Repository：

1. 创建基础Repository类
2. 实现通用CRUD方法
3. 添加特定业务方法
4. 实现缓存装饰器
5. 编写单元测试

```typescript
// repositories/baseRepository.ts
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaClient) {}

  async findById(id: string): Promise<T | null> {
    return this.prisma[this.getModelName()].findUnique({
      where: { id }
    });
  }

  async findAll(options?: any): Promise<T[]> {
    return this.prisma[this.getModelName()].findMany(options);
  }

  async create(data: any): Promise<T> {
    return this.prisma[this.getModelName()].create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.prisma[this.getModelName()].update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<T> {
    return this.prisma[this.getModelName()].delete({
      where: { id }
    });
  }

  protected abstract getModelName(): string;
}

// repositories/userRepository.ts
export class UserRepository extends BaseRepository<any> {
  protected getModelName(): string {
    return 'user';
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findActiveUsers() {
    return this.prisma.user.findMany({
      where: { isActive: true }
    });
  }
}
```

**Q2：如何实现复杂查询？**

A：使用Prisma的查询构建器：

```typescript
// 复杂查询示例
export async function findUsersWithComplexFilters(filters: UserFilters) {
  return prisma.user.findMany({
    where: {
      AND: [
        filters.name && {
          name: { contains: filters.name, mode: 'insensitive' }
        },
        filters.email && {
          email: { contains: filters.email, mode: 'insensitive' }
        },
        filters.minAge && {
          age: { gte: filters.minAge }
        },
        filters.maxAge && {
          age: { lte: filters.maxAge }
        },
        filters.status && {
          status: { in: filters.status }
        }
      ].filter(Boolean),
      OR: [
        filters.searchTerm && {
          name: { contains: filters.searchTerm }
        },
        filters.searchTerm && {
          email: { contains: filters.searchTerm }
        }
      ].filter(Boolean)
    },
    include: {
      projects: {
        where: { isActive: true },
        include: {
          tasks: true
        }
      }
    },
    orderBy: [
      { createdAt: 'desc' },
      { name: 'asc' }
    ],
    skip: filters.page ? (filters.page - 1) * filters.pageSize : undefined,
    take: filters.pageSize
  });
}
```

**Q3：如何处理事务？**

A：使用Prisma的事务API：

```typescript
// 简单事务
export async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return prisma.$transaction(async (tx) => {
    // 扣款
    await tx.user.update({
      where: { id: fromUserId },
      data: { balance: { decrement: amount } }
    });

    // 加款
    await tx.user.update({
      where: { id: toUserId },
      data: { balance: { increment: amount } }
    });

    // 记录交易
    await tx.transaction.create({
      data: {
        fromUserId,
        toUserId,
        amount
      }
    });
  });
}

// 交互式事务
export async function createUserWithProject(userData: any, projectData: any) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData
    });

    const project = await tx.project.create({
      data: {
        ...projectData,
        userId: user.id
      }
    });

    return { user, project };
  });
}

// 批量事务
export async function batchCreateUsers(users: any[]) {
  return prisma.$transaction(
    users.map(user => 
      prisma.user.create({ data: user })
    )
  );
}
```

#### E.2 性能优化相关

**Q1：如何优化查询性能？**

A：实施以下优化策略：

1. **使用索引**
```prisma
model User {
  id    String @id
  email String @unique
  name  String
  
  @@index([email])
  @@index([name])
  @@index([email, name])
}
```

2. **选择必要字段**
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});
```

3. **使用分页**
```typescript
const users = await prisma.user.findMany({
  skip: 0,
  take: 20
});
```

4. **预加载关联数据**
```typescript
const users = await prisma.user.findMany({
  include: {
    projects: true
  }
});
```

**Q2：如何监控数据库性能？**

A：实现性能监控：

```typescript
// 查询日志
prisma.$on('query', (e) => {
  logger.info('Query executed', {
    query: e.query,
    params: e.params,
    duration: `${e.duration}ms`,
    timestamp: new Date().toISOString()
  });
});

// 慢查询告警
prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`
    });
    
    // 发送告警
    alertService.sendAlert({
      type: 'slow_query',
      message: `Slow query detected: ${e.duration}ms`,
      details: { query: e.query, params: e.params }
    });
  }
});

// 连接池监控
setInterval(() => {
  const pool = (prisma as any)._engine?.pool;
  if (pool) {
    logger.info('Database pool status', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    });
  }
}, 60000);
```

#### E.3 缓存相关

**Q1：如何实现缓存策略？**

A：实现多层缓存策略：

```typescript
// 1. 内存缓存（L1）
const memoryCache = new Map<string, { value: any; expiry: number }>();

function getFromMemory(key: string): any | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expiry) {
    memoryCache.delete(key);
    return null;
  }
  
  return cached.value;
}

function setToMemory(key: string, value: any, ttl: number = 60000) {
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttl
  });
}

// 2. Redis缓存（L2）
async function getFromRedis(key: string): Promise<any | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

async function setToRedis(key: string, value: any, ttl: number = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

// 3. 多级缓存
export async function getWithMultiLevelCache<T>(
  key: string,
  factory: () => Promise<T>
): Promise<T> {
  // L1: 内存缓存
  let value = getFromMemory(key);
  if (value) return value;
  
  // L2: Redis缓存
  value = await getFromRedis(key);
  if (value) {
    setToMemory(key, value);
    return value;
  }
  
  // L3: 数据库
  value = await factory();
  
  // 回填缓存
  setToMemory(key, value);
  await setToRedis(key, value);
  
  return value;
}
```

### F. 最佳实践建议

#### F.1 Repository设计最佳实践

1. **单一职责原则**
   - 每个Repository只负责一个实体
   - 方法职责单一明确
   - 避免跨实体操作

2. **依赖注入**
```typescript
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository
  ) {}
}
```

3. **错误处理**
```typescript
export async function findById(id: string): Promise<User | null> {
  try {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  } catch (error) {
    logger.error('Failed to find user by id', { id, error });
    throw new DatabaseError('Failed to find user');
  }
}
```

4. **日志记录**
```typescript
export async function create(data: any): Promise<User> {
  logger.info('Creating user', { data });
  
  try {
    const user = await this.prisma.user.create({ data });
    logger.info('User created successfully', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Failed to create user', { data, error });
    throw error;
  }
}
```

#### F.2 查询优化最佳实践

1. **使用索引**
   - 为常用查询字段创建索引
   - 使用复合索引优化多字段查询
   - 定期分析索引使用情况

2. **避免N+1查询**
   - 使用include预加载关联数据
   - 使用select选择必要字段
   - 使用批量查询代替循环查询

3. **实现分页**
   - 使用offset/limit分页
   - 使用游标分页处理大数据集
   - 实现流式处理处理超大数据集

4. **缓存策略**
   - 实现多级缓存
   - 设置合理的TTL
   - 实现缓存预热

#### F.3 数据库设计最佳实践

1. **规范化设计**
   - 遵循数据库范式
   - 避免数据冗余
   - 合理设计外键关系

2. **索引优化**
   - 为查询条件创建索引
   - 定期维护索引
   - 监控索引使用情况

3. **事务管理**
   - 保持事务简短
   - 避免长事务
   - 实现事务重试机制

4. **备份策略**
   - 定期备份数据
   - 测试备份恢复
   - 实现增量备份

### G. 扩展阅读资源

#### G.1 官方文档

- [Prisma 官方文档](https://www.prisma.io/docs)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Redis 官方文档](https://redis.io/documentation)

#### G.2 最佳实践

- [数据库设计最佳实践](https://www.postgresql.org/docs/current/ddl.html)
- [查询优化指南](https://www.postgresql.org/docs/current/performance-tips.html)
- [缓存策略设计](https://redis.io/topics/lru-cache)

#### G.3 工具和框架

- [Prisma Studio](https://www.prisma.io/studio)
- [pgAdmin](https://www.pgadmin.org/)
- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

#### G.4 性能优化

- [PostgreSQL性能调优](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Redis性能优化](https://redis.io/topics/admin)
- [连接池最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
