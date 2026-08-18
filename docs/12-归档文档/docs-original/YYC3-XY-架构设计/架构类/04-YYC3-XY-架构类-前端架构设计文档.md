---
@file: YYC3-XY-架构类-前端架构设计文档.md
@description: YYC³-XY智能成长守护系统的前端架构设计文档
@author: YYC³ Team
@version: v1.0.0
@created: 2025-12-24
@updated: 2025-12-28
@status: published
@tags: 前端架构,架构设计,五高五标五化,Next.js,React,TypeScript
---

# YYC³-XY 架构类 - 前端架构设计文档

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***

## 文档变更记录

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|--------|----------|----------|--------|
| v1.0.0 | 2025-12-24 | 初始版本创建 | AI Assistant |
| v1.0.1 | 2025-12-28 | 元数据标准化 | YYC³ Team |

---

## 一、前端架构概述

### 1.1 架构简介

YYC³-XY前端采用Next.js 14框架，基于React构建现代化的单页应用(SPA)。前端架构遵循分层设计原则，采用五层架构模型，确保代码的可维护性、可扩展性和可测试性。前端通过TypeScript实现类型安全，使用Redux Toolkit进行状态管理，集成shadcn/ui组件库提供统一的UI体验。

### 1.2 设计原则

#### 五高原则在前端的体现

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 高可用 | 页面稳定，错误可恢复 | Error Boundary、服务端渲染降级、离线缓存 |
| 高性能 | 渲染快速，交互流畅 | 代码分割、懒加载、虚拟滚动、图片优化 |
| 高安全 | 数据安全，XSS防护 | CSP策略、输入验证、Token认证、HTTPS |
| 高扩展 | 组件复用，功能易扩展 | 组件化设计、插件化架构、模块化开发 |
| 高维护 | 代码规范，易于调试 | TypeScript类型检查、ESLint规范、统一日志 |

#### 五标原则在前端的体现

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 标准化 | 统一规范，一致性好 | 统一组件库、统一状态管理、统一API调用 |
| 规范化 | 流程清晰，可追溯 | 组件开发流程、代码审查流程、发布流程 |
| 自动化 | 减少人工，提高效率 | 自动化构建、自动化测试、自动化部署 |
| 智能化 | 智能决策，自我优化 | 智能路由、智能缓存、智能预加载 |
| 可视化 | 状态透明，易于理解 | Redux DevTools、性能监控、错误追踪 |

#### 五化原则在前端的体现

| 维度 | 说明 | 实现方式 |
|------|------|----------|
| 流程化 | 按流程执行，减少随意 | 标准开发流程、组件生命周期管理 |
| 文档化 | 知识沉淀，便于传承 | 组件文档、API文档、设计规范 |
| 工具化 | 工具支撑，提升效率 | 开发工具链、调试工具、性能分析工具 |
| 数字化 | 数据驱动，科学决策 | 用户行为分析、性能数据采集 |
| 生态化 | 开放合作，共建共赢 | 开源组件、插件生态、开发者社区 |

### 1.3 技术栈详解

#### 核心框架

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| Next.js | 14 | React服务端渲染框架 | 支持SSR/SSG、优秀的性能、SEO友好 |
| React | 18+ | UI框架 | 生态成熟、组件化、虚拟DOM |
| TypeScript | 5.x | 类型安全 | 减少运行时错误、提升开发效率 |

#### 状态管理

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| Redux Toolkit | latest | 状态管理 | 简化Redux使用、内置Immer、DevTools支持 |
| Redux Persist | latest | 状态持久化 | 本地存储、自动持久化、SSR兼容 |
| React Context | latest | 上下文传递 | 轻量级状态共享、避免prop drilling |

#### UI组件库

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| shadcn/ui | latest | 基础UI组件 | 可定制性强、基于Radix UI、无样式锁定 |
| Radix UI | latest | 无障碍组件 | WAI-ARIA标准、键盘导航、屏幕阅读器支持 |
| Tailwind CSS | latest | 样式系统 | 原子化CSS、快速开发、一致性强 |

#### 交互与动画

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| Framer Motion | latest | 动画库 | 声明式API、性能优化、手势支持 |
| React DnD | latest | 拖拽功能 | 灵活的拖拽API、HTML5拖拽支持、触摸兼容 |

#### 数据可视化

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| Recharts | latest | 图表库 | React原生、声明式API、响应式设计 |

#### 工具库

| 技术选型 | 版本 | 用途说明 | 选型理由 |
|----------|------|----------|----------|
| clsx | latest | 类名合并 | 条件类名、性能优化 |
| tailwind-merge | latest | Tailwind类名合并 | 避免类名冲突、智能合并 |
| date-fns | latest | 日期处理 | 模块化、不可变、Tree-shaking友好 |

---

## 二、五层架构设计

### 2.1 架构分层模型

```
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (Application Layer)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - 应用入口 (app/layout.tsx, app/page.tsx)           │   │
│  │  - 路由配置 (App Router)                             │   │
│  │  - 全局状态管理 (Redux Provider)                     │   │
│  │  - 全局错误处理 (Error Boundary)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       页面层 (Page Layer)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - 页面组件 (app/*/page.tsx)                        │   │
│  │  - 页面布局 (app/*/layout.tsx)                      │   │
│  │  - 页面级状态管理                                   │   │
│  │  - 页面级数据获取 (Server Components)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       布局层 (Layout Layer)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - 通用布局组件 (Navigation, Sidebar, PageHeader)   │   │
│  │  - 页面框架和结构                                    │   │
│  │  - 响应式布局                                        │   │
│  │  - 主题切换                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      组件层 (Component Layer)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - UI基础组件 (components/ui/*)                      │   │
│  │  - 业务组件 (components/growth/*, components/video/*)│   │
│  │  - AI浮动组件 (components/ai-widget/*)               │   │
│  │  - 组件状态管理                                       │   │
│  │  - 组件通信 (Props, Context, Redux)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      基础层 (Foundation Layer)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - 样式系统 (Tailwind CSS, globals.css)             │   │
│  │  - 工具函数 (lib/utils/*)                            │   │
│  │  - 类型定义 (types/*)                                │   │
│  │  - 常量定义 (lib/constants/*)                        │   │
│  │  - API客户端 (lib/api/*)                             │   │
│  │  - Hooks (hooks/*)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 应用层 (Application Layer)

#### 核心职责

- 应用入口和初始化
- 全局路由配置
- 全局状态管理
- 全局错误处理
- 全局配置管理

#### 关键文件

| 文件路径 | 职责说明 |
|----------|----------|
| app/layout.tsx | 根布局，全局Provider配置 |
| app/page.tsx | 应用首页 |
| app/globals.css | 全局样式 |
| app/providers.tsx | 全局Provider组件 |
| lib/store/index.ts | Redux Store配置 |

#### 实现示例

```typescript
// app/layout.tsx - 根布局
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/components/ReduxProvider'
import { DndProvider } from '@/components/DndProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YYC³-XY - 言启象限',
  description: '智能化婴幼儿成长守护系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ErrorBoundary>
          <ReduxProvider>
            <DndProvider>
              {children}
            </DndProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

### 2.3 页面层 (Page Layer)

#### 核心职责

- 页面组件实现
- 页面布局配置
- 页面级状态管理
- 服务端数据获取
- 页面级权限控制

#### 页面结构

```
app/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页
├── (auth)/                       # 认证相关页面组
│   ├── layout.tsx                # 认证页面布局
│   ├── login/
│   │   └── page.tsx              # 登录页
│   └── register/
│       └── page.tsx              # 注册页
├── (dashboard)/                  # 仪表板页面组
│   ├── layout.tsx                # 仪表板布局
│   ├── page.tsx                  # 仪表板首页
│   ├── growth/
│   │   └── page.tsx              # 成长仪表板
│   ├── video/
│   │   └── page.tsx              # 视频中心
│   ├── books/
│   │   └── page.tsx              # 图书中心
│   └── insights/
│       └── page.tsx              # 洞察分析
└── (settings)/                   # 设置页面组
    ├── layout.tsx                # 设置页面布局
    └── settings/
        └── page.tsx              # 设置页
```

#### 实现示例

```typescript
// app/(dashboard)/growth/page.tsx - 成长仪表板页面
import { GrowthDashboard } from '@/components/growth/GrowthDashboard'

export default function GrowthPage() {
  return (
    <div className="container mx-auto py-6">
      <GrowthDashboard />
    </div>
  )
}
```

### 2.4 布局层 (Layout Layer)

#### 核心职责

- 通用布局组件
- 页面框架和结构
- 响应式布局
- 主题切换
- 导航管理

#### 布局组件

| 组件名称 | 文件路径 | 职责说明 |
|----------|----------|----------|
| Navigation | components/layout/Navigation.tsx | 顶部导航栏 |
| Sidebar | components/layout/Sidebar.tsx | 侧边栏导航 |
| PageHeader | components/layout/PageHeader.tsx | 页面头部 |
| MainLayout | components/layout/MainLayout.tsx | 主布局容器 |

#### 实现示例

```typescript
// components/layout/Navigation.tsx - 顶部导航栏
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            YYC³-XY
          </Link>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/dashboard">仪表板</Link>
            <Link href="/dashboard/growth">成长</Link>
            <Link href="/dashboard/video">视频</Link>
            <Link href="/dashboard/books">图书</Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  )
}
```

### 2.5 组件层 (Component Layer)

#### 组件分类

```
components/
├── ui/                           # UI基础组件
│   ├── button/
│   │   └── Button.tsx
│   ├── card/
│   │   └── Card.tsx
│   ├── dialog/
│   │   └── Dialog.tsx
│   ├── input/
│   │   └── Input.tsx
│   └── ...
├── ai-widget/                    # AI浮动组件
│   └── IntelligentAIWidget.tsx
├── growth/                       # 成长相关组件
│   ├── GrowthDashboard.tsx
│   ├── MilestoneTracker.tsx
│   └── GrowthChart.tsx
├── video/                        # 视频相关组件
│   └── VideoPlayer.tsx
├── books/                        # 图书相关组件
│   └── BookReader.tsx
└── layout/                       # 布局组件
    ├── Navigation.tsx
    ├── PageHeader.tsx
    └── Sidebar.tsx
```

#### 组件设计原则

| 原则 | 说明 | 实现方式 |
|------|------|----------|
| 单一职责 | 组件只做一件事 | 功能拆分、组件复用 |
| 可复用性 | 组件可在多处使用 | Props配置、插槽模式 |
| 可组合性 | 组件可组合使用 | 组合模式、高阶组件 |
| 可测试性 | 组件易于测试 | 纯函数组件、依赖注入 |

#### 实现示例

```typescript
// components/ui/button/Button.tsx - 按钮组件
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### 2.6 基础层 (Foundation Layer)

#### 核心职责

- 样式系统定义
- 工具函数封装
- 类型定义管理
- 常量定义
- API客户端封装
- 自定义Hooks

#### 目录结构

```
lib/
├── api/                          # API客户端
│   ├── client.ts                 # API客户端配置
│   ├── auth.ts                   # 认证API
│   ├── growth.ts                 # 成长记录API
│   └── ...
├── constants/                    # 常量定义
│   ├── routes.ts                 # 路由常量
│   ├── api.ts                    # API常量
│   └── ...
├── store/                        # Redux Store
│   ├── index.ts                  # Store配置
│   ├── slices/                   # Redux Slices
│   │   ├── user.ts
│   │   ├── children.ts
│   │   └── ...
│   └── storage.ts                # 存储适配器
├── utils/                        # 工具函数
│   ├── cn.ts                     # 类名合并
│   ├── date.ts                   # 日期处理
│   └── ...
└── types/                        # 类型定义
    ├── user.ts                   # 用户类型
    ├── children.ts               # 儿童类型
    └── ...
```

#### 实现示例

```typescript
// lib/utils/cn.ts - 类名合并工具
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```typescript
// lib/api/client.ts - API客户端
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1229'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
```

---

## 三、组件分类与层次结构

### 3.1 组件分类体系

#### 按功能分类

| 分类 | 说明 | 示例 |
|------|------|------|
| UI基础组件 | 通用UI元素 | Button, Input, Card, Dialog |
| 业务组件 | 特定业务功能 | GrowthDashboard, VideoPlayer, BookReader |
| 布局组件 | 页面布局结构 | Navigation, Sidebar, PageHeader |
| 容器组件 | 状态管理和数据获取 | DashboardContainer, GrowthContainer |
| 展示组件 | 纯UI展示 | UserAvatar, MilestoneCard, VideoThumbnail |

#### 按复杂度分类

| 分类 | 说明 | 特点 |
|------|------|------|
| 原子组件 | 最小可复用单元 | 无状态、纯展示、高度复用 |
| 分子组件 | 由原子组件组合而成 | 简单逻辑、中等复用 |
| 组织组件 | 由分子组件组合而成 | 复杂逻辑、业务相关 |
| 模板组件 | 页面级组件 | 完整页面结构、数据获取 |
| 页面组件 | 路由页面组件 | 页面入口、SEO配置 |

### 3.2 组件层次结构图

```
页面组件 (Page Components)
├── HomePage
├── LoginPage
├── DashboardPage
├── GrowthPage
├── VideoPage
├── BooksPage
└── SettingsPage
    │
    ▼
容器组件 (Container Components)
├── DashboardContainer
├── GrowthContainer
├── VideoContainer
└── BooksContainer
    │
    ▼
业务组件 (Business Components)
├── GrowthDashboard
│   ├── MilestoneTracker
│   ├── GrowthChart
│   └── GrowthStats
├── VideoPlayer
│   ├── VideoControls
│   ├── VideoProgress
│   └── VideoPlaylist
└── BookReader
    │
    ▼
布局组件 (Layout Components)
├── Navigation
├── Sidebar
├── PageHeader
└── MainLayout
    │
    ▼
UI基础组件 (UI Components)
├── Button
├── Input
├── Card
├── Dialog
├── Avatar
├── Badge
└── ...
```

### 3.3 组件通信模式

#### Props传递

```typescript
// 父组件
function ParentComponent() {
  const [data, setData] = useState('Hello')

  return <ChildComponent data={data} onUpdate={setData} />
}

// 子组件
function ChildComponent({ data, onUpdate }: { data: string; onUpdate: (value: string) => void }) {
  return <div>{data}</div>
}
```

#### Context API

```typescript
// 创建Context
const ThemeContext = createContext('light')

// Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Consumer
function ThemedComponent() {
  const { theme, setTheme } = useContext(ThemeContext)

  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
    Toggle Theme
  </button>
}
```

#### Redux状态管理

```typescript
// Redux Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

// Component中使用
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/lib/store/slices/user'

function UserProfile() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const dispatch = useDispatch()

  return <div>{currentUser?.name}</div>
}
```

#### 自定义Hooks

```typescript
// 自定义Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}

// 使用自定义Hook
function MyComponent() {
  const [name, setName] = useLocalStorage('name', '')

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

---

## 四、状态管理架构

### 4.1 状态管理策略

#### 状态分类

| 状态类型 | 管理方式 | 说明 |
|----------|----------|------|
| 全局状态 | Redux Toolkit | 跨组件共享的状态 |
| 页面状态 | useState/useReducer | 页面级状态 |
| 组件状态 | useState | 组件内部状态 |
| 表单状态 | React Hook Form | 表单数据管理 |
| 服务端状态 | React Query/SWR | 服务端数据缓存 |
| URL状态 | URL参数 | 路由参数和查询参数 |

#### Redux状态结构

```typescript
// lib/store/index.ts - Redux Store配置
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from './storage'
import userReducer from './slices/user'
import childrenReducer from './slices/children'
import growthRecordsReducer from './slices/growthRecords'
import goalsReducer from './slices/goals'
import settingsReducer from './slices/settings'
import aiWidgetReducer from './slices/aiWidget'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'children', 'settings'],
}

const rootReducer = combineReducers({
  user: userReducer,
  children: childrenReducer,
  growthRecords: growthRecordsReducer,
  goals: goalsReducer,
  settings: settingsReducer,
  aiWidget: aiWidgetReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 4.2 Redux Slices详解

#### User Slice

```typescript
// lib/store/slices/user.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/client'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<{ user: User; token: string }>(
      '/auth/login',
      credentials
    )
    apiClient.setToken(response.token)
    return response.user
  }
)

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await apiClient.post('/auth/logout', {})
  apiClient.clearToken()
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
```

#### Children Slice

```typescript
// lib/store/slices/children.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/client'

interface Child {
  id: string
  name: string
  birthDate: string
  gender: 'male' | 'female'
  avatar?: string
}

interface ChildrenState {
  items: Child[]
  selectedChild: Child | null
  loading: boolean
  error: string | null
}

const initialState: ChildrenState = {
  items: [],
  selectedChild: null,
  loading: false,
  error: null,
}

export const fetchChildren = createAsyncThunk(
  'children/fetch',
  async () => {
    const response = await apiClient.get<Child[]>('/children')
    return response
  }
)

export const addChild = createAsyncThunk(
  'children/add',
  async (child: Omit<Child, 'id'>) => {
    const response = await apiClient.post<Child>('/children', child)
    return response
  }
)

export const updateChild = createAsyncThunk(
  'children/update',
  async ({ id, data }: { id: string; data: Partial<Child> }) => {
    const response = await apiClient.put<Child>(`/children/${id}`, data)
    return response
  }
)

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    selectChild: (state, action: PayloadAction<Child>) => {
      state.selectedChild = action.payload
    },
    clearSelectedChild: (state) => {
      state.selectedChild = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(addChild.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export const { selectChild, clearSelectedChild } = childrenSlice.actions
export default childrenSlice.reducer
```

### 4.3 状态持久化

#### Redux Persist配置

```typescript
// lib/store/storage.ts - SSR兼容的存储适配器
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage()

export default storage
```

---

## 五、路由架构

### 5.1 路由设计

#### 路由结构

```
app/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页 (/)
├── (auth)/                       # 认证相关路由组
│   ├── layout.tsx
│   ├── login/page.tsx            # 登录页 (/login)
│   └── register/page.tsx         # 注册页 (/register)
├── (dashboard)/                  # 仪表板路由组
│   ├── layout.tsx
│   ├── page.tsx                  # 仪表板首页 (/dashboard)
│   ├── growth/page.tsx           # 成长仪表板 (/dashboard/growth)
│   ├── video/page.tsx            # 视频中心 (/dashboard/video)
│   ├── books/page.tsx            # 图书中心 (/dashboard/books)
│   └── insights/page.tsx         # 洞察分析 (/dashboard/insights)
└── (settings)/                   # 设置路由组
    ├── layout.tsx
    └── settings/page.tsx        # 设置页 (/settings)
```

#### 路由配置表

| 路径 | 页面 | 组件 | 说明 |
|------|------|------|------|
| / | 首页 | HomePage | 系统首页 |
| /login | 登录页 | LoginPage | 用户登录 |
| /register | 注册页 | RegisterPage | 用户注册 |
| /dashboard | 仪表板 | DashboardPage | 主仪表板 |
| /dashboard/growth | 成长仪表板 | GrowthPage | 儿童成长数据展示 |
| /dashboard/video | 视频中心 | VideoPage | 视频播放和管理 |
| /dashboard/books | 图书中心 | BooksPage | 图书阅读和管理 |
| /dashboard/insights | 洞察分析 | InsightsPage | 数据分析和洞察 |
| /settings | 设置 | SettingsPage | 系统设置 |

### 5.2 路由守卫

#### 认证守卫

```typescript
// components/AuthGuard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

---

## 六、响应式设计

### 6.1 断点系统

| 断点名称 | 屏幕宽度 | 说明 |
|----------|----------|------|
| xs | < 640px | 超小屏幕 |
| sm | ≥ 640px | 小屏幕 |
| md | ≥ 768px | 中等屏幕 |
| lg | ≥ 1024px | 大屏幕 |
| xl | ≥ 1280px | 超大屏幕 |
| 2xl | ≥ 1536px | 超超大屏幕 |

### 6.2 响应式实现

```typescript
// 响应式导航栏
export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            YYC³-XY
          </Link>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/dashboard">仪表板</Link>
            <Link href="/dashboard/growth">成长</Link>
            <Link href="/dashboard/video">视频</Link>
            <Link href="/dashboard/books">图书</Link>
          </div>

          <button className="md:hidden">
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  )
}
```

---

## 七、性能优化

### 7.1 代码分割

#### 动态导入

```typescript
// 动态导入组件
const VideoPlayer = dynamic(() => import('@/components/video/VideoPlayer'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})
```

### 7.2 图片优化

```typescript
import Image from 'next/image'

<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={200}
  height={200}
  priority
/>
```

### 7.3 虚拟滚动

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 八、安全架构

### 8.1 安全措施

| 安全措施 | 实现方式 | 说明 |
|----------|----------|------|
| CSP策略 | next.config.js | 内容安全策略 |
| XSS防护 | React自动转义 | 防止跨站脚本攻击 |
| CSRF防护 | Token验证 | 防止跨站请求伪造 |
| HTTPS | 强制HTTPS | 加密传输 |
| 输入验证 | 前端验证 | 防止恶意输入 |

### 8.2 CSP配置

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

---

## 九、错误处理

### 9.1 Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">出错了</h1>
            <p className="mt-4 text-gray-600">
              抱歉，小语遇到了一些问题，请刷新页面重试
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 十、架构决策记录 (ADR)

### ADR-001: 选择Next.js作为前端框架

**状态**: 已接受

**背景**: 需要选择一个现代化的前端框架来构建YYC³-XY应用

**决策**: 选择Next.js 14作为前端框架

**理由**:

- 支持服务端渲染(SSR)和静态生成(SSG)，提升SEO和首屏加载速度
- 内置路由系统，简化路由管理
- 优秀的开发体验和性能优化
- 强大的生态系统和社区支持
- 与React生态完美集成

**后果**:

- 正面: 提升应用性能和SEO，简化开发流程
- 负面: 学习曲线相对较陡，需要理解SSR/SSG概念

### ADR-002: 选择Redux Toolkit进行状态管理

**状态**: 已接受

**背景**: 需要选择一个状态管理方案来管理应用的全局状态

**决策**: 选择Redux Toolkit进行状态管理

**理由**:

- 简化Redux的使用，减少样板代码
- 内置Immer，简化不可变数据更新
- 内置Redux DevTools支持，方便调试
- 与Redux Persist无缝集成，支持状态持久化

**后果**:

- 正面: 提升开发效率，简化状态管理
- 负面: 对于小型应用可能过于复杂

### ADR-003: 选择shadcn/ui作为UI组件库

**状态**: 已接受

**背景**: 需要选择一个UI组件库来快速构建用户界面

**决策**: 选择shadcn/ui作为UI组件库

**理由**:

- 基于Radix UI，提供无障碍支持
- 可定制性强，不锁定样式
- 与Tailwind CSS完美集成
- 组件按需复制到项目中，完全控制代码

**后果**:

- 正面: 灵活性高，可定制性强
- 负面: 需要手动复制组件，不如传统组件库方便

---

## 十一、总结

YYC³-XY前端架构采用五层架构设计，遵循"五高五标五化"要求，确保了系统的高可用性、高性能、高安全性、高扩展性和高维护性。通过合理的分层设计、组件化开发、状态管理和性能优化，构建了一个现代化、可维护、可扩展的前端应用。

### 架构优势

1. **分层清晰**: 五层架构设计，职责明确，易于维护
2. **组件复用**: 组件分类体系完善，复用性高
3. **类型安全**: TypeScript类型检查，减少运行时错误
4. **性能优化**: 代码分割、懒加载、虚拟滚动等优化手段
5. **响应式设计**: 支持多种设备，用户体验一致

### 后续优化方向

1. **性能监控**: 集成性能监控工具，持续优化性能
2. **自动化测试**: 完善单元测试和集成测试
3. **PWA支持**: 添加PWA功能，提升离线体验
4. **国际化**: 支持多语言，拓展国际市场
5. **微前端**: 考虑微前端架构，支持团队独立开发
