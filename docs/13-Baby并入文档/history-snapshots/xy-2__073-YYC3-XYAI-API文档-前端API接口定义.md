# YYC³（YanYuCloudCube）-XY-API 接口文档

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

*   `request<T>(config: APIRequest): Promise<APIResponse<T>>`
*   `get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>>`
*   `post<T>(url: string, body?: any): Promise<APIResponse<T>>`
*   `put<T>(url: string, body?: any): Promise<APIResponse<T>>`
*   `delete<T>(url: string): Promise<APIResponse<T>>`

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
*   **返回**: `Promise<GrowthNode[]>`

#### `getGrowthTimeline()`
获取成长时间轴配置，包括各个年龄阶段的定义。
*   **返回**: `Promise<any>` (包含 phases 对象)

#### `getGrowthStatistics()`
获取成长数据的统计信息。
*   **返回**: `Promise<any>`
    *   `totalRecords`: 总记录数
    *   `milestones`: 里程碑数量
    *   `culturalActivities`: 文化活动数量
    *   `growthAreas`: 各领域成长趋势

#### `addGrowthRecord(record: any)`
添加新的成长记录。
*   **参数**: `record` - 记录对象
*   **返回**: `Promise<void>`

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
*   **参数**: `category` (可选) - 分类ID
*   **返回**: `Promise<ContentItem[]>`

#### `getContentById(id: string)`
根据ID获取详细内容。
*   **参数**: `id` - 内容ID
*   **返回**: `Promise<ContentItem | undefined>`

#### `getCategories()`
获取所有可用的文化分类。
*   **返回**: `Promise<CultureCategory[]>`

---

## 4. 角色服务 (`src/app/services/character.ts`)

简单的角色状态管理服务。

### 方法

#### `setCurrentChild(child: any)`
设置当前选中的孩子/角色。
*   **参数**: `child` - 角色对象

#### `getCurrentChild()`
获取当前选中的孩子/角色。
*   **返回**: 角色对象或 `null`
