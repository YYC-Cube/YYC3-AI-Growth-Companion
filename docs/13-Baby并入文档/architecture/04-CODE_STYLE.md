# 代码文档规范

## 📋 概述

本文档定义小语智能成长守护系统的代码文档规范，包括注释风格、JSDoc使用、组件文档等。

---

## 📝 注释规范

### 1. 文件头注释

每个文件开头应包含简要说明：

```typescript
/**
 * 用户认证服务
 * 提供用户注册、登录、Token刷新等功能
 * 
 * @module services/AuthService
 * @author Your Name
 * @created 2024-01-01
 */
```

### 2. 函数注释（JSDoc）

```typescript
/**
 * 获取用户信息
 * 
 * @param userId - 用户ID
 * @returns 用户数据对象，如果用户不存在返回null
 * @throws {NotFoundError} 当用户ID无效时抛出
 * 
 * @example
 * ```typescript
 * const user = await getUserInfo('123')
 * console.log(user.name)
 * ```
 */
async function getUserInfo(userId: string): Promise<User | null> {
  // 实现
}
```

### 3. 类注释

```typescript
/**
 * 用户服务类
 * 处理用户相关的所有业务逻辑
 * 
 * @class UserService
 * @example
 * ```typescript
 * const userService = new UserService()
 * const user = await userService.createUser(data)
 * ```
 */
export class UserService {
  /**
   * 创建新用户
   * @param data - 用户数据
   * @returns 创建的用户对象
   */
  async createUser(data: CreateUserDto): Promise<User> {
    // 实现
  }
}
```

### 4. 接口/类型注释

```typescript
/**
 * 用户数据接口
 */
export interface User {
  /** 用户ID */
  _id: string
  
  /** 用户名，3-20个字符 */
  username: string
  
  /** 邮箱地址 */
  email: string
  
  /** 创建时间 */
  createdAt: Date
  
  /** 最后更新时间 */
  updatedAt: Date
}
```

### 5. React组件注释

```typescript
/**
 * 用户卡片组件
 * 
 * 展示用户的基本信息，支持点击查看详情
 * 
 * @component
 * @example
 * ```tsx
 * <UserCard 
 *   userId="123" 
 *   showEmail={true}
 *   onUserClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */
export const UserCard: React.FC<UserCardProps> = ({
  userId,
  showEmail = false,
  onUserClick,
}) => {
  // 实现
}

/**
 * UserCard组件的Props
 */
export interface UserCardProps {
  /** 用户ID */
  userId: string
  
  /** 是否显示邮箱，默认false */
  showEmail?: boolean
  
  /** 点击用户时的回调函数 */
  onUserClick?: (userId: string) => void
}
```

### 6. Hook注释

```typescript
/**
 * 用户数据Hook
 * 
 * 自动加载并管理用户数据的状态
 * 
 * @param userId - 用户ID
 * @returns 用户数据、加载状态和错误信息
 * 
 * @example
 * ```typescript
 * const { user, loading, error } = useUser('123')
 * if (loading) return <Loading />
 * if (error) return <Error message={error.message} />
 * return <div>{user.name}</div>
 * ```
 */
export function useUser(userId: string) {
  // 实现
}
```

---

## 📦 组件文档

### 组件文档结构

每个复杂组件应有对应的文档文件：

**components/ui/Button/README.md**:

```markdown
# Button 按钮组件

## 描述

通用按钮组件，支持多种样式变体和大小。

## 引入

\`\`\`typescript
import { Button } from './components/ui/Button'
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | 按钮样式变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮大小 |
| loading | boolean | false | 是否显示加载状态 |
| block | boolean | false | 是否占满父容器宽度 |
| leftIcon | ReactNode | - | 左侧图标 |
| rightIcon | ReactNode | - | 右侧图标 |

## 使用示例

### 基础使用

\`\`\`tsx
<Button>点击我</Button>
\`\`\`

### 不同变体

\`\`\`tsx
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险按钮</Button>
\`\`\`

### 不同大小

\`\`\`tsx
<Button size="sm">小按钮</Button>
<Button size="md">中按钮</Button>
<Button size="lg">大按钮</Button>
\`\`\`

### 带图标

\`\`\`tsx
import { Plus, Save } from 'lucide-react'

<Button leftIcon={<Plus />}>添加</Button>
<Button rightIcon={<Save />}>保存</Button>
\`\`\`

### 加载状态

\`\`\`tsx
<Button loading>加载中...</Button>
\`\`\`

## 可访问性

- 支持键盘导航（Tab、Enter、Space）
- 支持ARIA属性
- 禁用状态下自动添加`aria-disabled`
```

---

## 🔧 工具函数文档

### 函数文档模板

```typescript
/**
 * 格式化日期
 * 
 * 将Date对象转换为指定格式的字符串
 * 
 * @param date - 要格式化的日期
 * @param format - 日期格式，默认为'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-01'), 'YYYY-MM-DD')
 * // => '2024-01-01'
 * 
 * formatDate(new Date('2024-01-01'), 'YYYY年MM月DD日')
 * // => '2024年01月01日'
 * ```
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  // 实现
}
```

---

## 📄 API路由文档

### 路由文件注释

```typescript
/**
 * 用户管理API路由
 * 
 * @module routes/user
 */

import { Router } from 'express'
import { auth } from '../middleware/auth'

const router = Router()

/**
 * 获取用户列表
 * 
 * @route GET /api/users
 * @auth 需要认证
 * @query {number} page - 页码，默认1
 * @query {number} limit - 每页数量，默认20
 * @returns {Object} 用户列表和分页信息
 * 
 * @example
 * GET /api/users?page=1&limit=20
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": { "total": 100, "page": 1, "limit": 20 }
 * }
 */
router.get('/', auth, async (req, res) => {
  // 实现
})

export default router
```

---

## 🎨 样式注释

### CSS/Tailwind注释

```css
/* 
 * 卡片容器样式
 * 用于统一的卡片展示，支持暗色模式
 */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-4;
}

/* 响应式网格布局 */
.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}
```

---

## 📚 Markdown文档

### README模板

每个重要模块都应有README文件：

```markdown
# 模块名称

## 概述

简要说明模块的功能和用途。

## 文件结构

\`\`\`
module/
├── index.ts          # 入口文件
├── Service.ts        # 服务实现
├── types.ts          # 类型定义
└── README.md         # 文档
\`\`\`

## 使用示例

\`\`\`typescript
import { Service } from './Service'

const service = new Service()
await service.doSomething()
\`\`\`

## API

### Service

#### constructor(config: Config)

创建服务实例。

**参数**:
- `config`: 配置对象

**示例**:
\`\`\`typescript
const service = new Service({ apiKey: 'xxx' })
\`\`\`

## 测试

\`\`\`bash
npm test
\`\`\`

## 注意事项

- 重要提示1
- 重要提示2
```

---

## ✅ 文档检查清单

### 代码文件

- [ ] 文件头注释
- [ ] 所有导出函数有JSDoc
- [ ] 所有导出接口/类型有注释
- [ ] 复杂逻辑有行内注释

### 组件文件

- [ ] 组件功能描述
- [ ] Props接口文档
- [ ] 使用示例
- [ ] 可访问性说明

### API路由

- [ ] 路由功能说明
- [ ] 请求参数文档
- [ ] 响应格式文档
- [ ] 错误处理说明

### 工具函数

- [ ] 函数用途说明
- [ ] 参数和返回值类型
- [ ] 使用示例
- [ ] 边界情况说明

---

## 🎯 最佳实践

### DO（推荐）

✅ 为所有导出的函数/类/组件添加注释  
✅ 使用JSDoc标准格式  
✅ 提供代码示例  
✅ 说明重要的业务逻辑  
✅ 记录已知问题和限制  

### DON'T（不推荐）

❌ 注释显而易见的代码  
❌ 使用过时或错误的注释  
❌ 注释代替好的命名  
❌ 过度注释简单逻辑  

---

**文档版本**: v1.0  
**最后更新**: 2024年11月
