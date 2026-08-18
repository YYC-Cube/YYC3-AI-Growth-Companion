---
@file: 030-YYC3-XY-架构类-API接口实现文档.md
@description: YYC3-XY项目架构类API接口实现文档文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-24
@updated: 2025-12-24
@status: draft
@tags: API接口,开发实施,技术实现,YYC3-XY
---

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

## **"五高"战略定位**

- **高起点规划**：基于RESTful API最佳实践进行接口顶层设计
- **高标准建设**：采用业界领先的API设计规范与安全标准
- **高效率运营**：优化API开发、测试、文档生成全链路流程
- **高质量服务**：提升API可用性、性能和开发者体验
- **高效益回报**：确保API资产投入产出合理化

## **"五标"体系构建**

- **流程标准化**：API开发流程SOP数字化落地
- **数据标准化**：统一API数据模型与接口规范
- **服务标准化**：一致性API服务体验
- **安全标准化**：全方位API安全保障体系
- **评价标准化**：多维量化API质量评估指标

## **"五化"实现路径**

- **数字化**：全要素API数据采集与转换
- **网络化**：全域API互联互通
- **智能化**：AI驱动API决策与执行
- **自动化**：减少人工干预环节
- **生态化**：API产业链协同整合

# API接口实现文档

## 一、API架构概述

### 1.1 整体架构

YYC3-XY系统采用分层API架构，遵循以下设计原则：

```yaml
API架构层次:
  网关层:
    - API网关服务
    - 路由转发
    - 认证授权
    - 限流熔断
    
  业务层:
    - 业务逻辑API
    - 工作流API
    - 规则引擎API
    
  数据层:
    - 数据访问API
    - 缓存API
    - 文件存储API
    
  AI服务层:
    - 模型推理API
    - 向量检索API
    - 提示词管理API
```

### 1.2 技术选型

```yaml
API技术栈:
  网关:
    - Kong / Nginx
    - 支持插件扩展
    - 高性能路由
    
  框架:
    - Node.js: Express / Fastify
    - TypeScript类型安全
    - 中间件生态丰富
    
  规范:
    - RESTful API
    - GraphQL（可选）
    - WebSocket（实时通信）
    
  文档:
    - OpenAPI 3.0
    - Swagger UI
    - 自动生成文档
    
  安全:
    - JWT认证
    - OAuth2.0
    - API密钥管理
```

### 1.3 端口配置

```yaml
服务端口配置:
  主服务端口: 1228
    - API网关和主服务
    - 统一入口
    
  前端开发端口: 3000
    - Next.js开发服务器
    - 热重载支持
    
  监控服务端口: 3001
    - Grafana监控面板
    - 可视化展示
```

## 二、API设计规范

### 2.1 URL设计规范

```yaml
URL设计原则:
  基础格式:
    - https://api.yyc3-xy.com/{version}/{resource}/{id}
    
  版本控制:
    - URL路径版本: /v1/users
    - 请求头版本: Accept: application/vnd.api+json; version=1
    
  资源命名:
    - 使用名词复数: /users, /projects
    - 层级关系: /users/{userId}/projects
    - 过滤查询: /users?status=active
    
  HTTP方法:
    - GET: 获取资源
    - POST: 创建资源
    - PUT: 完整更新资源
    - PATCH: 部分更新资源
    - DELETE: 删除资源
```

### 2.2 请求规范

#### 2.2.1 请求头规范

```typescript
// types/apiTypes.ts
/**
 * @description API请求头类型定义
 */
export interface ApiHeaders {
  'Content-Type': 'application/json' | 'multipart/form-data';
  'Accept': 'application/json';
  'Authorization': `Bearer ${string}`;
  'X-Request-ID': string;
  'X-Client-Version': string;
  'X-Client-Platform': 'web' | 'ios' | 'android';
  'X-Timestamp': number;
}

/**
 * @description 创建标准请求头
 */
export function createHeaders(accessToken: string): ApiHeaders {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-Request-ID': generateRequestId(),
    'X-Client-Version': process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    'X-Client-Platform': 'web',
    'X-Timestamp': Date.now()
  };
}
```

#### 2.2.2 请求体规范

```typescript
// types/requestTypes.ts
/**
 * @description 通用请求体接口
 */
export interface ApiRequest<T = any> {
  data?: T;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

/**
 * @description 分页请求参数
 */
export interface PaginationRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * @description 用户创建请求
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}
```

### 2.3 响应规范

#### 2.3.1 统一响应格式

```typescript
// types/responseTypes.ts
/**
 * @description 统一API响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp: number;
  requestId: string;
}

/**
 * @description 分页响应数据
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * @description 创建成功响应
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success'
): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
    timestamp: Date.now(),
    requestId: getCurrentRequestId()
  };
}

/**
 * @description 创建错误响应
 */
export function createErrorResponse(
  code: number,
  message: string,
  errors?: any[]
): ApiResponse {
  return {
    code,
    message,
    errors,
    timestamp: Date.now(),
    requestId: getCurrentRequestId()
  };
}
```

#### 2.3.2 状态码规范

```yaml
HTTP状态码规范:
  成功响应:
    200 OK: 请求成功
    201 Created: 资源创建成功
    204 No Content: 请求成功，无返回内容
    
  客户端错误:
    400 Bad Request: 请求参数错误
    401 Unauthorized: 未认证
    403 Forbidden: 无权限
    404 Not Found: 资源不存在
    409 Conflict: 资源冲突
    422 Unprocessable Entity: 请求格式正确但语义错误
    429 Too Many Requests: 请求过于频繁
    
  服务器错误:
    500 Internal Server Error: 服务器内部错误
    502 Bad Gateway: 网关错误
    503 Service Unavailable: 服务不可用
    504 Gateway Timeout: 网关超时
```

## 三、核心API实现

### 3.1 用户管理API

```typescript
// api/userApi.ts
/**
 * @description 用户管理API实现
 */
import express, { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { validateRequest } from '../middleware/validation';

const router = express.Router();
const userService = new UserService();

/**
 * @route GET /api/v1/users
 * @description 获取用户列表
 * @access private
 */
router.get('/users', 
  validateRequest({
    query: {
      page: { type: 'number', min: 1, default: 1 },
      pageSize: { type: 'number', min: 1, max: 100, default: 20 },
      status: { type: 'string', enum: ['active', 'inactive', 'all'] }
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { page, pageSize, status } = req.query;
      
      const result = await userService.getUsers({
        page: Number(page),
        pageSize: Number(pageSize),
        status: status as string
      });
      
      res.json(createSuccessResponse(result));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route GET /api/v1/users/:id
 * @description 获取用户详情
 * @access private
 */
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }
    
    res.json(createSuccessResponse(user));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
});

/**
 * @route POST /api/v1/users
 * @description 创建用户
 * @access private
 */
router.post('/users',
  validateRequest({
    body: {
      username: { type: 'string', required: true, minLength: 3, maxLength: 50 },
      email: { type: 'string', required: true, format: 'email' },
      password: { type: 'string', required: true, minLength: 8 }
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      
      res.status(201).json(createSuccessResponse(user, 'User created successfully'));
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return res.status(409).json(createErrorResponse(409, 'Email already exists'));
      }
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route PUT /api/v1/users/:id
 * @description 更新用户信息
 * @access private
 */
router.put('/users/:id',
  validateRequest({
    body: {
      username: { type: 'string', minLength: 3, maxLength: 50 },
      email: { type: 'string', format: 'email' }
    }
  }),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await userService.updateUser(id, updateData);
      
      if (!user) {
        return res.status(404).json(createErrorResponse(404, 'User not found'));
      }
      
      res.json(createSuccessResponse(user, 'User updated successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route DELETE /api/v1/users/:id
 * @description 删除用户
 * @access private
 */
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
});

export default router;
```

### 3.2 AI服务API

```typescript
// api/aiApi.ts
/**
 * @description AI服务API实现
 */
import express, { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const aiService = new AIService();

/**
 * @route POST /api/v1/ai/generate
 * @description 生成AI响应
 * @access private
 */
router.post('/ai/generate',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { prompt, context, options } = req.body;
      const userId = req.user.id;
      
      const response = await aiService.generateResponse(
        prompt,
        {
          ...context,
          userId
        },
        options
      );
      
      res.json(createSuccessResponse(response));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route POST /api/v1/ai/code-completion
 * @description 代码补全
 * @access private
 */
router.post('/ai/code-completion',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { code, language, cursorPosition } = req.body;
      
      const completion = await aiService.getCodeCompletion({
        code,
        language,
        cursorPosition
      });
      
      res.json(createSuccessResponse(completion));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route POST /api/v1/ai/code-review
 * @description 代码审查
 * @access private
 */
router.post('/ai/code-review',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { code, language, reviewType } = req.body;
      
      const review = await aiService.codeReview({
        code,
        language,
        reviewType: reviewType || 'comprehensive'
      });
      
      res.json(createSuccessResponse(review));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route POST /api/v1/ai/vector-search
 * @description 向量检索
 * @access private
 */
router.post('/ai/vector-search',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { query, collection, limit } = req.body;
      
      const results = await aiService.vectorSearch({
        query,
        collection: collection || 'default',
        limit: limit || 10
      });
      
      res.json(createSuccessResponse(results));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

export default router;
```

### 3.3 项目管理API

```typescript
// api/projectApi.ts
/**
 * @description 项目管理API实现
 */
import express, { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const projectService = new ProjectService();

/**
 * @route GET /api/v1/projects
 * @description 获取项目列表
 * @access private
 */
router.get('/projects',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { page, pageSize, status } = req.query;
      
      const result = await projectService.getProjects({
        userId,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 20,
        status: status as string
      });
      
      res.json(createSuccessResponse(result));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route GET /api/v1/projects/:id
 * @description 获取项目详情
 * @access private
 */
router.get('/projects/:id',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const project = await projectService.getProjectById(id, userId);
      
      if (!project) {
        return res.status(404).json(createErrorResponse(404, 'Project not found'));
      }
      
      res.json(createSuccessResponse(project));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route POST /api/v1/projects
 * @description 创建项目
 * @access private
 */
router.post('/projects',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const projectData = req.body;
      
      const project = await projectService.createProject({
        ...projectData,
        userId
      });
      
      res.status(201).json(createSuccessResponse(project, 'Project created successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route PUT /api/v1/projects/:id
 * @description 更新项目
 * @access private
 */
router.put('/projects/:id',
  authenticate,
  authorize(['project:edit']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      const project = await projectService.updateProject(id, userId, updateData);
      
      if (!project) {
        return res.status(404).json(createErrorResponse(404, 'Project not found'));
      }
      
      res.json(createSuccessResponse(project, 'Project updated successfully'));
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

/**
 * @route DELETE /api/v1/projects/:id
 * @description 删除项目
 * @access private
 */
router.delete('/projects/:id',
  authenticate,
  authorize(['project:delete']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await projectService.deleteProject(id, userId);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
);

export default router;
```

## 四、API安全实现

### 4.1 认证中间件

```typescript
// middleware/auth.ts
/**
 * @description 认证授权中间件
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const userService = new UserService();

/**
 * @description 扩展Express Request接口
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        roles: string[];
      };
    }
  }
}

/**
 * @description JWT认证中间件
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(createErrorResponse(401, 'Unauthorized'));
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    const user = await userService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json(createErrorResponse(401, 'Invalid token'));
    }
    
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    };
    
    next();
  } catch (error) {
    res.status(401).json(createErrorResponse(401, 'Invalid token'));
  }
}

/**
 * @description 权限授权中间件
 */
export function authorize(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(createErrorResponse(401, 'Unauthorized'));
    }
    
    const userPermissions = req.user.roles.flatMap(role => 
      getPermissionsByRole(role)
    );
    
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json(createErrorResponse(403, 'Forbidden'));
    }
    
    next();
  };
}

/**
 * @description 根据角色获取权限
 */
function getPermissionsByRole(role: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    developer: ['project:edit', 'project:delete', 'ai:generate'],
    user: ['project:view', 'ai:generate']
  };
  
  return rolePermissions[role] || [];
}
```

### 4.2 限流中间件

```typescript
// middleware/rateLimit.ts
/**
 * @description 限流中间件
 */
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
});

/**
 * @description 限流配置
 */
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

/**
 * @description 创建限流中间件
 */
export function createRateLimit(config: RateLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = config.keyGenerator 
        ? config.keyGenerator(req)
        : `rate_limit:${req.ip}`;
      
      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, Math.ceil(config.windowMs / 1000));
      }
      
      if (current > config.maxRequests) {
        const ttl = await redis.ttl(key);
        res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', (Date.now() + ttl * 1000).toString());
        
        return res.status(429).json(createErrorResponse(429, 'Too many requests'));
      }
      
      res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (config.maxRequests - current).toString());
      
      next();
    } catch (error) {
      next();
    }
  };
}

/**
 * @description API限流配置
 */
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 1000,
  keyGenerator: (req) => `rate_limit:${req.user?.id || req.ip}`
});

/**
 * @description 严格限流配置
 */
export const strictRateLimit = createRateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10
});
```

### 4.3 请求验证中间件

```typescript
// middleware/validation.ts
/**
 * @description 请求验证中间件
 */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * @description 验证配置
 */
interface ValidationConfig {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

/**
 * @description 创建验证中间件
 */
export function validateRequest(config: ValidationConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any[] = [];
    
    if (config.body) {
      const { error } = config.body.validate(req.body);
      if (error) {
        errors.push({
          field: 'body',
          message: error.details.map(d => d.message).join(', ')
        });
      }
    }
    
    if (config.query) {
      const { error } = config.query.validate(req.query);
      if (error) {
        errors.push({
          field: 'query',
          message: error.details.map(d => d.message).join(', ')
        });
      }
    }
    
    if (config.params) {
      const { error } = config.params.validate(req.params);
      if (error) {
        errors.push({
          field: 'params',
          message: error.details.map(d => d.message).join(', ')
        });
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json(createErrorResponse(400, 'Validation failed', errors));
    }
    
    next();
  };
}
```

## 五、API文档生成

### 5.1 OpenAPI配置

```typescript
// config/openapi.ts
/**
 * @description OpenAPI配置
 */
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const registry = new OpenAPIRegistry();

/**
 * @description 用户Schema
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().url().optional()
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

/**
 * @description 分页响应Schema
 */
export const PaginationResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => 
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number()
  });

/**
 * @description 统一响应Schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    message: z.string(),
    data: dataSchema.optional(),
    timestamp: z.number(),
    requestId: z.string()
  });

/**
 * @description 注册用户API
 */
registry.registerPath({
  method: 'get',
  path: '/api/v1/users',
  summary: '获取用户列表',
  tags: ['Users'],
  request: {
    query: z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      status: z.enum(['active', 'inactive', 'all']).default('all')
    })
  },
  responses: {
    200: {
      description: '成功',
      content: {
        'application/json': {
          schema: ApiResponseSchema(PaginationResponseSchema(UserSchema))
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/users',
  summary: '创建用户',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            username: z.string().min(3).max(50),
            email: z.string().email(),
            password: z.string().min(8),
            profile: z.object({
              firstName: z.string().optional(),
              lastName: z.string().optional(),
              avatar: z.string().url().optional()
            }).optional()
          })
        }
      }
    }
  },
  responses: {
    201: {
      description: '创建成功',
      content: {
        'application/json': {
          schema: ApiResponseSchema(UserSchema)
        }
      }
    }
  }
});

export default registry;
```

### 5.2 Swagger UI配置

```typescript
// config/swagger.ts
/**
 * @description Swagger UI配置
 */
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { generateOpenAPI } from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

/**
 * @description 生成OpenAPI文档
 */
export function generateOpenAPIDocument(registry: OpenAPIRegistry) {
  return generateOpenAPI(registry, {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'YYC3-XY API',
      description: 'YYC3-XY小语AI智能编程系统API文档',
      contact: {
        name: 'YanYuCloudCube Team',
        email: 'admin@0379.email'
      }
    },
    servers: [
      {
        url: 'http://localhost:1228',
        description: '开发环境'
      },
      {
        url: 'https://api.yyc3-xy.com',
        description: '生产环境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  });
}

/**
 * @description 配置Swagger UI路由
 */
export function setupSwagger(app: express.Application, registry: OpenAPIRegistry) {
  const openAPIDocument = generateOpenAPIDocument(registry);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument, {
    customSiteTitle: 'YYC3-XY API文档',
    customCss: '.swagger-ui .topbar { display: none }'
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.json(openAPIDocument);
  });
}
```

## 六、API测试

### 6.1 单元测试

```typescript
// tests/api/userApi.test.ts
/**
 * @description 用户API单元测试
 */
import request from 'supertest';
import express from 'express';
import userApi from '../../api/userApi';
import { UserService } from '../../services/userService';

const app = express();
app.use(express.json());
app.use('/api/v1', userApi);

describe('User API', () => {
  describe('GET /api/v1/users', () => {
    it('should return users list', async () => {
      const response = await request(app)
        .get('/api/v1/users?page=1&pageSize=20')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('total');
    });
  });
  
  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(201);
      expect(response.body.code).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.username).toBe(userData.username);
    });
    
    it('should return 400 for invalid data', async () => {
      const userData = {
        username: 'ab',
        email: 'invalid-email',
        password: '123'
      };
      
      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(400);
      expect(response.body.code).toBe(400);
    });
  });
});
```

### 6.2 集成测试

```typescript
// tests/integration/api.test.ts
/**
 * @description API集成测试
 */
import request from 'supertest';
import { createTestServer } from '../helpers/server';

describe('API Integration Tests', () => {
  let app: any;
  let authToken: string;
  
  beforeAll(async () => {
    app = await createTestServer();
    
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.data.accessToken;
  });
  
  describe('User Flow', () => {
    let userId: string;
    
    it('should create a user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'integration-test-user',
          email: 'integration@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      userId = response.body.data.id;
    });
    
    it('should get the user', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(userId);
    });
    
    it('should update the user', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'updated-user'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('updated-user');
    });
    
    it('should delete the user', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(204);
    });
  });
});
```

## 七、API监控与日志

### 7.1 API监控中间件

```typescript
// middleware/monitoring.ts
/**
 * @description API监控中间件
 */
import { Request, Response, NextFunction } from 'express';
import { prometheus } from '../utils/prometheus';

/**
 * @description API请求监控
 */
export function apiMonitoring(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, path } = req;
    const statusCode = res.statusCode;
    
    prometheus.httpRequestDurationMicroseconds.observe(
      {
        method,
        path,
        status_code: statusCode
      },
      duration
    );
    
    prometheus.httpRequestsTotal.inc({
      method,
      path,
      status_code: statusCode
    });
  });
  
  next();
}

/**
 * @description API错误监控
 */
export function errorMonitoring(err: Error, req: Request, res: Response, next: NextFunction) {
  prometheus.httpErrorsTotal.inc({
    method: req.method,
    path: req.path,
    error_type: err.name
  });
  
  next(err);
}
```

### 7.2 API日志中间件

```typescript
// middleware/logging.ts
/**
 * @description API日志中间件
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * @description 请求日志
 */
export function requestLogging(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      requestId: req.headers['x-request-id'],
      userId: (req as any).user?.id
    });
  });
  
  next();
}

/**
 * @description 错误日志
 */
export function errorLogging(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('API Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    requestId: req.headers['x-request-id'],
    userId: (req as any).user?.id
  });
  
  next(err);
}
```

## 八、API版本管理

### 8.1 版本路由配置

```typescript
// routes/index.ts
/**
 * @description API版本路由配置
 */
import express from 'express';
import v1Routes from './v1';
import v2Routes from './v2';

const router = express.Router();

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

export default router;
```

### 8.2 版本迁移策略

```typescript
// utils/versionMigration.ts
/**
 * @description API版本迁移工具
 */
export class VersionMigration {
  /**
   * @description 检测客户端版本
   */
  static detectClientVersion(req: Request): string {
    const versionHeader = req.headers['x-api-version'];
    const acceptHeader = req.headers.accept;
    
    if (versionHeader) {
      return versionHeader as string;
    }
    
    if (acceptHeader && acceptHeader.includes('version=')) {
      const match = acceptHeader.match(/version=(\d+)/);
      return match ? match[1] : '1';
    }
    
    return '1';
  }
  
  /**
   * @description 版本兼容性检查
   */
  static checkCompatibility(clientVersion: string, minVersion: string = '1'): boolean {
    return parseInt(clientVersion) >= parseInt(minVersion);
  }
  
  /**
   * @description 版本弃用警告
   */
  static deprecationWarning(req: Request, res: Response, next: NextFunction) {
    const clientVersion = this.detectClientVersion(req);
    const deprecatedVersions = ['1'];
    
    if (deprecatedVersions.includes(clientVersion)) {
      res.setHeader('X-API-Deprecated', 'true');
      res.setHeader('X-API-Sunset', '2026-01-01');
      res.setHeader('X-API-Recommended-Version', '2');
    }
    
    next();
  }
}
```

## 九、API性能优化

### 9.1 响应缓存

```typescript
// middleware/cache.ts
/**
 * @description 响应缓存中间件
 */
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379
});

/**
 * @description 缓存配置
 */
interface CacheConfig {
  ttl: number;
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
}

/**
 * @description 创建缓存中间件
 */
export function createCache(config: CacheConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }
    
    if (config.skipCache && config.skipCache(req)) {
      return next();
    }
    
    const cacheKey = config.keyGenerator 
      ? config.keyGenerator(req)
      : `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }
      
      const originalJson = res.json.bind(res);
      
      res.json = function(data: any) {
        redis.setex(cacheKey, config.ttl, JSON.stringify(data));
        res.setHeader('X-Cache', 'MISS');
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
}

/**
 * @description 公共API缓存配置
 */
export const publicApiCache = createCache({
  ttl: 300,
  keyGenerator: (req) => `cache:public:${req.originalUrl}`
});
```

### 9.2 响应压缩

```typescript
// middleware/compression.ts
/**
 * @description 响应压缩中间件
 */
import compression from 'compression';

/**
 * @description 压缩配置
 */
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024,
  level: 6
});

## 十、API性能监控与告警

### 10.1 性能监控实现

```typescript
// middleware/performanceMonitor.ts
/**
 * @description API性能监控中间件
 */
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: number;
  userId?: string;
  userAgent?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics: number = 10000;
  private alertThreshold: number = 1000; // 1秒

  /**
   * @description 记录性能指标
   */
  record(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    if (metric.duration > this.alertThreshold) {
      this.sendAlert(metric);
    }
  }

  /**
   * @description 获取性能统计
   */
  getStats(endpoint?: string) {
    const filtered = endpoint
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;

    if (filtered.length === 0) {
      return null;
    }

    const durations = filtered.map(m => m.duration);
    const sorted = [...durations].sort((a, b) => a - b);

    return {
      count: filtered.length,
      avg: durations.reduce((a, b) => a + b, 0) / filtered.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      errorRate: filtered.filter(m => m.statusCode >= 400).length / filtered.length
    };
  }

  /**
   * @description 发送告警
   */
  private sendAlert(metric: PerformanceMetrics): void {
    console.error(`[PERFORMANCE ALERT] ${metric.method} ${metric.endpoint} took ${metric.duration}ms`);
  }
}

const monitor = new PerformanceMonitor();

/**
 * @description 性能监控中间件
 */
export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const startTime = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - startTime;
    
    monitor.record({
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: Date.now(),
      userId: (req as any).user?.id,
      userAgent: req.headers['user-agent']
    });
  });

  next();
}

export { monitor, PerformanceMonitor };
```

### 10.2 API版本管理策略

```typescript
// middleware/apiVersioning.ts
/**
 * @description API版本管理中间件
 */
import { Request, Response, NextFunction } from 'express';

type APIVersion = 'v1' | 'v2' | 'v3';

interface VersionedRoute {
  version: APIVersion;
  deprecated?: boolean;
  sunsetDate?: Date;
}

const versionHandlers: Map<APIVersion, any> = new Map();

/**
 * @description 注册版本处理器
 */
export function registerVersion(version: APIVersion, handler: any): void {
  versionHandlers.set(version, handler);
}

/**
 * @description 版本检测中间件
 */
export function apiVersioning(req: Request, res: Response, next: NextFunction) {
  const version = req.headers['api-version'] as APIVersion || 'v1';
  
  if (!versionHandlers.has(version)) {
    return res.status(400).json({
      error: 'Invalid API version',
      supportedVersions: Array.from(versionHandlers.keys())
    });
  }

  req.apiVersion = version;
  next();
}

/**
 * @description 版本弃用警告
 */
export function deprecationWarning(route: VersionedRoute) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (route.deprecated) {
      res.setHeader('X-API-Deprecated', 'true');
      res.setHeader('X-API-Sunset-Date', route.sunsetDate?.toISOString());
      res.setHeader('X-API-Recommended-Version', 'v2');
    }
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      apiVersion?: APIVersion;
    }
  }
}
```

### 10.3 API文档自动化生成

```typescript
// utils/apiDocGenerator.ts
/**
 * @description API文档自动生成工具
 */
import { Express } from 'express';
import { swaggerJsdoc, SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: SwaggerDefinition = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YYC3-XY API Documentation',
      version: '1.0.0',
      description: 'YYC3-XY小语AI智能编程系统API接口文档',
      contact: {
        name: 'YYC3 Team',
        email: 'admin@0379.email'
      }
    },
    servers: [
      {
        url: 'http://localhost:1228',
        description: '开发环境'
      },
      {
        url: 'https://api.yyc3-xy.com',
        description: '生产环境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            code: { type: 'integer' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    }
  },
  apis: ['./src/api/*.ts', './src/routes/*.ts']
};

/**
 * @description 设置Swagger文档
 */
export function setupSwaggerDocs(app: Express): void {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'YYC3-XY API Docs',
    customCss: '.swagger-ui .topbar { display: none }'
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

/**
 * @description 生成OpenAPI规范
 */
export function generateOpenAPISpec(): object {
  return swaggerJsdoc(swaggerOptions);
}
```

### 10.4 API测试自动化

```typescript
// tests/api/apiTestSuite.ts
/**
 * @description API自动化测试套件
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('API自动化测试', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });

  describe('用户API测试', () => {
    it('应该成功获取用户列表', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('应该成功创建用户', async () => {
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(newUser.username);
    });

    it('应该成功更新用户信息', async () => {
      const updateData = {
        username: 'updateduser'
      };

      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(updateData.username);
    });

    it('应该返回401未认证错误', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('应该返回403无权限错误', async () => {
      const response = await request(app)
        .delete('/api/v1/users/admin-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('AI服务API测试', () => {
    it('应该成功生成AI响应', async () => {
      const response = await request(app)
        .post('/api/v1/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Hello, AI!',
          context: {}
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.response).toBeDefined();
    });

    it('应该成功执行代码补全', async () => {
      const response = await request(app)
        .post('/api/v1/ai/code-completion')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'function hello() {',
          language: 'javascript',
          cursorPosition: 20
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completions).toBeDefined();
    });
  });

  describe('性能测试', () => {
    it('API响应时间应小于200ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it('应支持并发请求', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
```

## 十一、API部署配置

### 11.1 Docker配置

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

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 1228

CMD ["node", "dist/index.js"]
```

### 10.2 Kubernetes配置

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-xy-api
  labels:
    app: yyc3-xy-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-xy-api
  template:
    metadata:
      labels:
        app: yyc3-xy-api
    spec:
      containers:
      - name: api
        image: yyc3-xy-api:latest
        ports:
        - containerPort: 1228
        env:
        - name: NODE_ENV
          value: "production"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: jwt-secret
        - name: REDIS_HOST
          value: "redis-service"
        - name: REDIS_PORT
          value: "6379"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 1228
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 1228
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: yyc3-xy-api-service
spec:
  selector:
    app: yyc3-xy-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 1228
  type: LoadBalancer
```

---

## 附录

### A. API端点清单

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/v1/users | 获取用户列表 | 是 |
| GET | /api/v1/users/:id | 获取用户详情 | 是 |
| POST | /api/v1/users | 创建用户 | 是 |
| PUT | /api/v1/users/:id | 更新用户 | 是 |
| DELETE | /api/v1/users/:id | 删除用户 | 是 |
| POST | /api/v1/ai/generate | 生成AI响应 | 是 |
| POST | /api/v1/ai/code-completion | 代码补全 | 是 |
| POST | /api/v1/ai/code-review | 代码审查 | 是 |
| POST | /api/v1/ai/vector-search | 向量检索 | 是 |
| GET | /api/v1/projects | 获取项目列表 | 是 |
| GET | /api/v1/projects/:id | 获取项目详情 | 是 |
| POST | /api/v1/projects | 创建项目 | 是 |
| PUT | /api/v1/projects/:id | 更新项目 | 是 |
| DELETE | /api/v1/projects/:id | 删除项目 | 是 |

### B. 错误代码清单

| 代码 | 描述 | 解决方案 |
|------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式 |
| 401 | 未认证 | 提供有效的认证令牌 |
| 403 | 无权限 | 检查用户权限 |
| 404 | 资源不存在 | 确认资源ID是否正确 |
| 409 | 资源冲突 | 检查资源是否已存在 |
| 422 | 请求格式错误 | 检查请求体格式 |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器内部错误 | 联系技术支持 |

### C. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2025-12-24 | 初始版本 | YanYuCloudCube Team |

### D. 故障排除指南

#### D.1 API开发问题

**问题1：CORS跨域错误**

```
错误信息：Access to XMLHttpRequest at 'http://localhost:3200/api/v1/users' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**解决方案：**

1. 配置CORS中间件：

```typescript
import cors from 'cors';

const app = express();

// 基础CORS配置
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 生产环境严格CORS
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
    maxAge: 86400 // 24小时
  }));
}
```

2. 在API网关层配置CORS：

```yaml
# Kong配置
plugins:
  - name: cors
    config:
      origins:
        - https://yyc3-xy.example.com
      methods:
        - GET
        - POST
        - PUT
        - DELETE
      headers:
        - Content-Type
        - Authorization
      exposed_headers:
        - X-Total-Count
      credentials: true
      max_age: 3600
```

**问题2：JWT令牌过期**

```
错误信息：TokenExpiredError: jwt expired
```

**解决方案：**

```typescript
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

// 中间件：自动刷新令牌
export async function refreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // 尝试使用刷新令牌
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const newToken = await authService.refreshAccessToken(refreshToken);
        
        // 设置新的访问令牌
        res.setHeader('X-New-Token', newToken);
        req.user = jwt.decode(newToken) as JwtPayload;
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
}
```

**问题3：API响应时间过长**

```
问题现象：API响应时间超过5秒
```

**解决方案：**

```typescript
// 1. 添加响应时间监控中间件
import { performance } from 'perf_hooks';

export function responseTimeMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - startTime;
    
    // 记录慢查询
    if (duration > 3000) {
      logger.warn('Slow API response', {
        method: req.method,
        path: req.path,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      });
    }
    
    // 发送指标
    metricsCollector.recordApiMetric({
      endpoint: req.path,
      method: req.method,
      duration,
      statusCode: res.statusCode
    });
  });

  next();
}

// 2. 实现响应缓存
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5分钟缓存

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const cacheKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
  
  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // 拦截响应
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    // 缓存成功的GET请求
    if (req.method === 'GET' && res.statusCode === 200) {
      cache.set(cacheKey, data);
    }
    return originalJson(data);
  };

  next();
}
```

#### D.2 API部署问题

**问题1：Docker容器无法访问外部服务**

```
错误信息：getaddrinfo ENOTFOUND database.example.com
```

**解决方案：**

```dockerfile
# Dockerfile
FROM node:18-alpine

# 设置DNS服务器
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# 安装必要的工具
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3200

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3200:3200"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@database:5432/yyc3
      - REDIS_URL=redis://redis:6379
    depends_on:
      - database
      - redis
    networks:
      - yyc3-network
    dns:
      - 8.8.8.8
      - 8.8.4.4

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yyc3
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - yyc3-network

  redis:
    image: redis:7-alpine
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge

volumes:
  postgres-data:
```

**问题2：Kubernetes Pod无法启动**

```
错误信息：CrashLoopBackOff
```

**解决方案：**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-api
  template:
    metadata:
      labels:
        app: yyc3-api
    spec:
      containers:
      - name: api
        image: yyc3/api:latest
        ports:
        - containerPort: 3200
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: yyc3-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: yyc3-secrets
              key: redis-url
        livenessProbe:
          httpGet:
            path: /health
            port: 3200
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3200
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      restartPolicy: Always
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-api-service
spec:
  selector:
    app: yyc3-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3200
  type: LoadBalancer
```

#### D.3 API性能问题

**问题1：高并发下API响应变慢**

```
问题现象：并发请求超过100时，响应时间显著增加
```

**解决方案：**

```typescript
// 1. 实现连接池
import { Pool } from 'pg';

const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 2. 实现请求队列
import PQueue from 'p-queue';

const apiQueue = new PQueue({
  concurrency: 100, // 最大并发数
  timeout: 30000, // 超时时间
  throwOnTimeout: true
});

export async function queueRequest<T>(
  handler: () => Promise<T>
): Promise<T> {
  return apiQueue.add(handler);
}

// 使用示例
app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await queueRequest(() => userService.getUsers());
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. 实现分布式缓存
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttl: number = 300
): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}

// 使用示例
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    
    // 尝试从缓存获取
    let user = await cacheGet(cacheKey);
    
    if (!user) {
      user = await userService.getUserById(id);
      await cacheSet(cacheKey, user, 300); // 缓存5分钟
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**问题2：数据库查询慢**

```
问题现象：某些API端点查询时间超过1秒
```

**解决方案：**

```typescript
// 1. 添加查询日志
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    logger.warn('Slow query detected', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`
    });
  }
});

// 2. 使用索引
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([createdAt])
}

// 3. 实现查询优化
export async function getUsersWithPagination(
  page: number = 1,
  pageSize: number = 20,
  filters?: UserFilters
) {
  const skip = (page - 1) * pageSize;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      where: filters,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where: filters })
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
```

### E. 常见问题FAQ

#### E.1 开发相关

**Q1：如何添加新的API端点？**

A：按照以下步骤添加新的API端点：

1. 在`src/api/`目录下创建或编辑路由文件
2. 定义API路径和处理函数
3. 添加请求验证
4. 实现业务逻辑
5. 添加错误处理
6. 编写测试用例
7. 更新API文档

```typescript
// src/api/users.ts
import { Router } from 'express';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

router.post('/users', zValidator('json', createUserSchema), async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Q2：如何实现API版本控制？**

A：使用URL路径版本控制：

```typescript
import express from 'express';

const app = express();

// v1 API
const v1Router = express.Router();
v1Router.get('/users', getUsersV1);
app.use('/api/v1', v1Router);

// v2 API
const v2Router = express.Router();
v2Router.get('/users', getUsersV2);
app.use('/api/v2', v2Router);

// 默认使用最新版本
app.use('/api', v2Router);
```

**Q3：如何处理文件上传？**

A：使用multer中间件：

```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename });
});
```

#### E.2 性能相关

**Q1：如何优化API响应时间？**

A：实施以下优化策略：

1. **启用缓存**
```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 });
```

2. **使用数据库索引**
```prisma
model User {
  id    String @id
  email String @unique
  @@index([email])
}
```

3. **实现分页**
```typescript
app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const users = await userService.getUsers(page, pageSize);
  res.json(users);
});
```

4. **压缩响应**
```typescript
import compression from 'compression';
app.use(compression());
```

**Q2：如何处理高并发请求？**

A：使用以下技术：

1. **连接池**
```typescript
import { Pool } from 'pg';
const pool = new Pool({ max: 20 });
```

2. **请求队列**
```typescript
import PQueue from 'p-queue';
const queue = new PQueue({ concurrency: 100 });
```

3. **负载均衡**
```yaml
# nginx.conf
upstream api_servers {
  server api1:3200;
  server api2:3200;
  server api3:3200;
}
```

#### E.3 安全相关

**Q1：如何保护API免受攻击？**

A：实施以下安全措施：

1. **输入验证**
```typescript
import { z } from 'zod';
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

2. **认证授权**
```typescript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
```

3. **限流**
```typescript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);
```

4. **CORS配置**
```typescript
import cors from 'cors';
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### F. 最佳实践建议

#### F.1 API设计最佳实践

1. **使用RESTful设计**
   - 使用HTTP动词（GET, POST, PUT, DELETE）
   - 使用名词表示资源
   - 使用复数形式（/users, /projects）
   - 使用嵌套资源（/users/:id/projects）

2. **统一响应格式**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}
```

3. **使用HTTP状态码**
   - 200 OK - 成功
   - 201 Created - 创建成功
   - 400 Bad Request - 请求错误
   - 401 Unauthorized - 未认证
   - 403 Forbidden - 无权限
   - 404 Not Found - 资源不存在
   - 500 Internal Server Error - 服务器错误

4. **版本控制**
   - 在URL中包含版本号（/api/v1/users）
   - 保持向后兼容
   - 提供版本迁移指南

#### F.2 API开发最佳实践

1. **使用TypeScript**
   - 提供类型安全
   - 改善开发体验
   - 减少运行时错误

2. **编写测试**
   - 单元测试测试业务逻辑
   - 集成测试测试API端点
   - E2E测试测试完整流程

3. **使用中间件**
   - 认证中间件
   - 验证中间件
   - 错误处理中间件
   - 日志中间件

4. **实现错误处理**
```typescript
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('API error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}
```

#### F.3 API部署最佳实践

1. **使用Docker**
   - 创建轻量级镜像
   - 使用多阶段构建
   - 优化层缓存

2. **使用Kubernetes**
   - 实现自动扩展
   - 配置健康检查
   - 设置资源限制

3. **实现CI/CD**
   - 自动化测试
   - 自动化部署
   - 回滚机制

4. **监控和日志**
   - 使用APM工具
   - 集中式日志
   - 告警通知

### G. 扩展阅读资源

#### G.1 官方文档

- [Express.js 官方文档](https://expressjs.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [JWT 官方文档](https://jwt.io/)

#### G.2 最佳实践

- [REST API 设计最佳实践](https://restfulapi.net/)
- [API 安全最佳实践](https://owasp.org/www-project-api-security/)
- [API 版本管理策略](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)

#### G.3 工具和框架

- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Postman](https://www.postman.com/)
- [Kong API Gateway](https://konghq.com/)
- [Prisma ORM](https://www.prisma.io/)

#### G.4 性能优化

- [Node.js 性能优化](https://nodejs.org/en/docs/guides/simple-profiling/)
- [数据库查询优化](https://www.postgresql.org/docs/current/performance-tips.html)
- [Redis 缓存策略](https://redis.io/topics/lru-cache)

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
