---
@file: 056-YYC3-XYAI-API文档-通用规范-RESTful接口设计标准.md
@description: YYC3-XYAI 全项目RESTful接口的统一设计标准，包含请求、响应、路径规范
@author: YanYuCloudCube Team
@version: v1.0.0
@created: 2025-12-29
@updated: 2025-12-29
@status: published
@tags: [API接口],[通用规范],[RESTful]
---

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 056-YYC3-XYAI-API文档-通用规范-RESTful接口设计标准

## 概述

本文档详细描述YYC3-YYC3-XYAI-API文档-通用规范-RESTful接口设计标准相关内容，确保项目按照YYC³标准规范进行开发和实施。

## 核心内容

### 1. 背景与目标

#### 1.1 项目背景

YYC³(YanYuCloudCube)-「智能教育」项目是一个基于「五高五标五化」理念的智能化应用系统，致力于提供高质量、高可用、高安全的成长守护体系。

#### 1.2 文档目标

- 规范通用规范-RESTful接口设计标准相关的业务标准与技术落地要求
- 为项目相关人员提供清晰的参考依据
- 保障相关模块开发、实施、运维的一致性与规范性

### 2. 设计原则

#### 2.1 五高原则

- **高可用性**：确保系统7x24小时稳定运行
- **高性能**：优化响应时间和处理能力
- **高安全性**：保护用户数据和隐私安全
- **高扩展性**：支持业务快速扩展
- **高可维护性**：便于后续维护和升级

#### 2.2 五标体系

- **标准化**：统一的技术和流程标准
- **规范化**：严格的开发和管理规范
- **自动化**：提高开发效率和质量
- **智能化**：利用AI技术提升能力
- **可视化**：直观的监控和管理界面

#### 2.3 五化架构

- **流程化**：标准化的开发流程
- **文档化**：完善的文档体系
- **工具化**：高效的开发工具链
- **数字化**：数据驱动的决策
- **生态化**：开放的生态系统

### 3. 通用规范-RESTful接口设计标准

# API 接口文档

本文档详细描述了小语AI应用的前端服务接口定义。

## 1. 基础 API 客户端 (`src/app/services/apiClient.ts`)

所有服务均基于此基础客户端构建，支持统一的请求处理和错误处理。

### 类型定义

```typescript
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
}
```

### 方法

- `request<T>(config: APIRequest): Promise<APIResponse<T>>`
- `get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>>`
- `post<T>(url: string, body?: any): Promise<APIResponse<T>>`
- `put<T>(url: string, body?: any): Promise<APIResponse<T>>`
- `delete<T>(url: string): Promise<APIResponse<T>>`

---

## 2. 成长记录服务 (`src/app/services/growth/growthService.ts`)

负责管理用户的成长记录数据，包括成长树、时间轴和统计数据。

### 类型定义

```typescript
export interface GrowthNode {
  id: string;
  age: number;
  content: {
    title: string;
    description: string;
    type: 'cultural' | 'academic' | 'social' | 'health' | 'perception';
    milestones: string[];
    smartTags?: string[];
  };
  metadata: {
    created: string;
    updated: string;
  };
}
```

### 方法

#### `getGrowthTree()`

获取完整的成长树数据。
- **返回**: `Promise<GrowthNode[]>`

#### `getGrowthTimeline()`

获取成长时间轴配置，包括各个年龄阶段的定义。
- **返回**: `Promise<any>` (包含 phases 对象)

#### `getGrowthStatistics()`

获取成长数据的统计信息。
- **返回**: `Promise<any>`
  - `totalRecords`: 总记录数
  - `milestones`: 里程碑数量
  - `culturalActivities`: 文化活动数量
  - `growthAreas`: 各领域成长趋势

#### `addGrowthRecord(record: any)`

添加新的成长记录。
- **参数**: `record` - 记录对象
- **返回**: `Promise<void>`

---

## 3. 内容服务 (`src/app/services/content/contentService.ts`)

负责河洛文化内容的获取和分类管理。

### 类型定义

```typescript
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
  content?: string;
  relatedItems?: string[];
}

export interface CultureCategory {
  id: string;
  name: string;
  icon: string;
}
```

### 方法

#### `getContentList(category?: string)`

获取内容列表，支持按分类筛选。
- **参数**: `category` (可选) - 分类ID
- **返回**: `Promise<ContentItem[]>`

#### `getContentById(id: string)`

根据ID获取详细内容。
- **参数**: `id` - 内容ID
- **返回**: `Promise<ContentItem | undefined>`

#### `getCategories()`

获取所有可用的文化分类。
- **返回**: `Promise<CultureCategory[]>`

---

## 4. 角色服务 (`src/app/services/character.ts`)

简单的角色状态管理服务。

### 方法

#### `setCurrentChild(child: any)`

设置当前选中的孩子/角色。
- **参数**: `child` - 角色对象

#### `getCurrentChild()`

获取当前选中的孩子/角色。
- **返回**: 角色对象或 `null`

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
