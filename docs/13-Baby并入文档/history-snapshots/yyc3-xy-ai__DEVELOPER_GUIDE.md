# 小语AI智能成长守护系统 - 开发者文档

<div align="center">

![小语AI智能成长守护系统](https://raw.githubusercontent.com/YY-Nexus/yyc3-xyai/main/public/git_1800_450-6.png)

**小语AI智能成长守护系统**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai)
[![Coverage](https://img.shields.io/badge/Coverage-41%25-yellow?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai)

**版本**: v2.0.0 | **最后更新**: 2025-01-30

[快速开始](#-快速开始) · [项目结构](#-项目结构) · [核心功能](#-核心功能) · [API文档](#-api文档) · [部署指南](#-部署指南)

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [核心功能](#-核心功能)
- [开发指南](#-开发指南)
- [API文档](#-api文档)
- [数据库设计](#-数据库设计)
- [部署指南](#-部署指南)
- [贡献指南](#-贡献指南)
- [常见问题](#-常见问题)

---

## 🎯 项目概述

小语AI智能成长守护系统是基于Next.js 16、React 19和TypeScript 5构建的智能育儿平台，专为0-3岁儿童成长守护场景设计。

### 核心价值

- **智能守护**: AI智能对话、消息通知、日程计划、系统设置
- **成长记录**: 成长记录、成长评估、活动记录、交互记录、儿童档案、徽章成就
- **知识教育**: 课程学习、作业管理、阅读计划、视频教学、创意培养、课程大纲

### 项目特色

- **最新技术栈**: 采用Next.js 16.1.1、React 19.2.3、TypeScript 5.9.3
- **智能AI系统**: 集成AgenticCore元学习系统、Neo4j知识图谱
- **Q版角色系统**: 支持性别主题切换、表情变化、个性化配置
- **企业级架构**: 微服务架构、事件驱动、目标驱动

---

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 16.1.1 | React框架，支持SSR/SSG |
| **React** | 19.2.3 | UI库，最新版本 |
| **TypeScript** | 5.9.3 | 类型安全的JavaScript超集 |
| **Tailwind CSS** | 4.x | CSS框架 |
| **Radix UI** | - | 无样式组件库 |
| **Framer Motion** | - | 动画库 |
| **React DnD** | - | 拖拽功能库 |

### 后端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| **Node.js** | 18+ | JavaScript运行时 |
| **Bun** | Latest | JavaScript运行时（可选）|
| **Next.js API Routes** | - | API路由 |
| **Prisma** | - | ORM（可选）|

### AI/ML技术

| 技术 | 版本 | 说明 |
|------|------|------|
| **OpenAI API** | - | GPT-4, GPT-3.5 |
| **Claude API** | - | Anthropic AI |
| **LangChain** | - | AI应用开发框架 |
| **Neo4j** | 5+ | 图数据库（知识图谱）|

### 开发工具

| 工具 | 说明 |
|------|------|
| **ESLint** | 代码规范检查 |
| **Prettier** | 代码格式化 |
| **Jest** | 单元测试 |
| **Bun Test** | 单元测试 |
| **GitHub Actions** | CI/CD |

---

## 📁 项目结构

```
yyc3-xy-ai/
├── app/                         # Next.js App Router
│   ├── [locale]/                # 国际化路由
│   │   ├── ai-chat/             # AI聊天页面
│   │   ├── growth/              # 成长页面
│   │   └── page.tsx             # 国际化首页
│   ├── activities/              # 活动页面
│   ├── ai-creative/             # AI创意页面
│   ├── badges/                  # 徽章页面
│   ├── books/                   # 书籍页面
│   ├── children/                # 儿童管理页面
│   ├── courses/                 # 课程页面
│   ├── curriculum/              # 课程大纲页面
│   ├── growth/                  # 成长页面
│   │   ├── assessment/          # 成长评估页面
│   │   └── page.tsx             # 成长总览页面
│   ├── homework/                # 作业页面
│   ├── interactions/            # 交互页面
│   ├── messages/                # 消息页面
│   ├── page.tsx                 # 首页
│   ├── schedule/                # 计划页面
│   ├── settings/                # 设置页面
│   └── videos/                  # 视频页面
├── components/                  # React组件
│   ├── ai-xiaoyu/               # AI小语组件
│   ├── growth/                  # 成长组件
│   ├── headers/                 # 头部组件
│   ├── Navigation.tsx           # 导航组件
│   ├── ChildSelector.tsx        # 儿童选择器
│   └── ui/                      # UI组件库
├── core/                        # 核心模块
│   ├── AgenticCore.ts           # Agentic核心
│   └── AgenticCore-Enhanced.ts  # Agentic增强核心
├── lib/                         # 工具库
│   ├── character-manager.ts     # 角色管理器
│   ├── db/client.ts             # 数据库客户端
│   └── hooks/                   # 自定义Hooks
├── hooks/                       # 全局自定义Hooks
│   ├── useAuth.ts               # 认证Hook
│   ├── useChildren.ts           # 儿童Hook
│   └── useGrowthStage.ts        # 成长阶段Hook
├── public/                      # 静态资源
│   ├── role-photos/             # 角色图片
│   │   ├── boy/                 # 男孩图片
│   │   └── girl/                # 女孩图片
│   └── git_1800_450-6.png       # Git顶图
├── docs/                        # 文档
│   ├── 01-架构设计类/             # 架构设计文档
│   ├── 02-开发指南/               # 开发指南
│   ├── 03-文档规范类/             # 文档规范
│   ├── 04-项目管理类/             # 项目管理文档
│   └── 05-项目概述类/             # 项目概述
├── types/                       # TypeScript类型定义
│   └── common.ts                # 通用类型
├── __tests__/                   # 测试文件
│   ├── components/              # 组件测试
│   ├── hooks/                   # Hooks测试
│   └── lib/                     # 工具库测试
├── .env.local                   # 环境变量
├── next.config.ts               # Next.js配置
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript配置
└── tailwind.config.ts           # Tailwind CSS配置
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本（或使用 bun）
- **Git**: 最新版本

### 安装步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/YY-Nexus/yyc3-xyai.git
cd yyc3-xy-ai
```

#### 2. 安装依赖

```bash
npm install
# 或使用 bun
bun install
```

#### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置必要的环境变量：

```env
# 应用配置
NEXT_PUBLIC_APP_NAME=小语AI智能成长守护系统
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_API_URL=http://localhost:1228

# API配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

#### 4. 启动开发服务器

```bash
npm run dev
```

访问地址: http://localhost:1228

#### 5. 构建生产版本

```bash
npm run build
npm run start
```

访问地址: http://localhost:1228

---

## 🎨 核心功能

### 1. 智能守护

#### AI聊天

**路径**: `app/[locale]/ai-chat/page.tsx`

**功能**:
- AI智能对话
- 语音交互
- 多角色切换
- 消息历史记录

**技术实现**:
```typescript
// 使用 OpenAI API 进行对话
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
  initialMessages: [],
})
```

#### 消息通知

**路径**: `app/messages/page.tsx`

**功能**:
- 消息列表
- 消息详情
- 消息发送
- 消息状态跟踪

#### 日程计划

**路径**: `app/schedule/page.tsx`

**功能**:
- 计划列表
- 计划详情
- 计划提醒
- 计划完成状态

#### 系统设置

**路径**: `app/settings/page.tsx`

**功能**:
- 用户设置
- 系统设置
- 偏好设置
- 权限管理

### 2. 成长记录

#### 成长总览

**路径**: `app/growth/page.tsx`

**功能**:
- 成长数据可视化
- 成长时间线
- 智能评估
- 发展曲线图

**技术实现**:
```typescript
// 使用 Framer Motion 进行动画
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 成长数据内容 */}
</motion.div>
```

#### 成长评估

**路径**: `app/growth/assessment/page.tsx`

**功能**:
- 成长评估
- 评估报告
- 建议推荐
- 发展水平分析

#### 活动记录

**路径**: `app/activities/page.tsx`

**功能**:
- 活动列表
- 活动详情
- 活动记录
- 活动统计

#### 儿童档案

**路径**: `app/children/page.tsx`

**功能**:
- 儿童信息管理
- 角色配置
- 主题切换
- 档案编辑

#### 徽章成就

**路径**: `app/badges/page.tsx`

**功能**:
- 徽章展示
- 进度追踪
- 成就解锁
- 徽章等级

### 3. 知识教育

#### 课程学习

**路径**: `app/courses/page.tsx`

**功能**:
- 课程列表
- 学习进度
- 课程评价
- 课程推荐

#### 课程大纲

**路径**: `app/curriculum/page.tsx`

**功能**:
- 课程大纲
- 学习计划
- 课程安排
- 学习路径

#### 作业管理

**路径**: `app/homework/page.tsx`

**功能**:
- 作业列表
- 作业提交
- 作业反馈
- 作业统计

#### 阅读计划

**路径**: `app/books/page.tsx`

**功能**:
- 书籍列表
- 阅读记录
- 推荐书籍
- 阅读统计

#### 视频教学

**路径**: `app/videos/page.tsx`

**功能**:
- 视频列表
- 视频播放
- 视频推荐
- 视频记录

#### AI创意

**路径**: `app/ai-creative/page.tsx`

**功能**:
- AI创意生成
- 个性化内容创作
- 创意展示
- 创意分享

---

## 💻 开发指南

### 代码规范

#### TypeScript

```typescript
// ✅ 正确
interface User {
  id: string
  name: string
  email: string
}

// ❌ 错误
interface User {
  id: any
  name: any
  email: any
}
```

#### React组件

```typescript
// ✅ 正确
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)

  return <div>Count: {count}</div>
}

// ❌ 错误
import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)

  return <div>Count: {count}</div>
}
```

#### Tailwind CSS

```typescript
// ✅ 正确
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
  内容
</div>

// ❌ 错误
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
  内容
</div>
```

### 组件开发

#### 创建新组件

```bash
# 创建组件目录
mkdir components/MyComponent

# 创建组件文件
touch components/MyComponent/index.tsx
touch components/MyComponent/MyComponent.tsx
touch components/MyComponent/MyComponent.test.tsx
touch components/MyComponent/README.md
```

#### 组件模板

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
    </motion.div>
  )
}
```

### 自定义Hooks开发

#### 创建新Hook

```bash
# 创建Hook目录
mkdir hooks/useMyHook

# 创建Hook文件
touch hooks/useMyHook.ts
touch hooks/useMyHook.test.ts
```

#### Hook模板

```typescript
import { useState, useEffect } from 'react'

interface UseMyHookReturn {
  data: any
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useMyHook(): UseMyHookReturn {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch data
      setData(/* data */)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
```

---

## 🔌 API文档

### API路由结构

```
app/api/
├── chat/                # AI聊天API
│   └── route.ts
├── children/            # 儿童管理API
│   └── route.ts
├── growth/              # 成长记录API
│   └── route.ts
└── assessments/         # 成长评估API
    └── route.ts
```

### API端点

#### 1. AI聊天API

**端点**: `POST /api/chat`

**请求体**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

**响应**:
```json
{
  "message": {
    "role": "assistant",
    "content": "你好！我是小语的AI守护助手"
  }
}
```

#### 2. 儿童管理API

**端点**: `GET /api/children`

**响应**:
```json
{
  "children": [
    {
      "id": "child-001",
      "name": "小云",
      "gender": "female",
      "birthDate": "2020-09-15"
    }
  ]
}
```

**端点**: `POST /api/children`

**请求体**:
```json
{
  "name": "小云",
  "gender": "female",
  "birthDate": "2020-09-15"
}
```

**响应**:
```json
{
  "child": {
    "id": "child-001",
    "name": "小云",
    "gender": "female",
    "birthDate": "2020-09-15"
  }
}
```

#### 3. 成长记录API

**端点**: `GET /api/growth?childId=child-001`

**响应**:
```json
{
  "records": [
    {
      "id": "record-001",
      "childId": "child-001",
      "date": "2025-01-30",
      "height": 115,
      "weight": 20,
      "notes": "正常"
    }
  ]
}
```

**端点**: `POST /api/growth`

**请求体**:
```json
{
  "childId": "child-001",
  "date": "2025-01-30",
  "height": 115,
  "weight": 20,
  "notes": "正常"
}
```

**响应**:
```json
{
  "record": {
    "id": "record-001",
    "childId": "child-001",
    "date": "2025-01-30",
    "height": 115,
    "weight": 20,
    "notes": "正常"
  }
}
```

#### 4. 成长评估API

**端点**: `POST /api/growth/assessment`

**请求体**:
```json
{
  "childId": "child-001",
  "assessmentDate": "2025-01-30"
}
```

**响应**:
```json
{
  "assessment": {
    "id": "assessment-001",
    "childId": "child-001",
    "overallScore": 87,
    "overallLevel": "良好",
    "dimensionScores": {
      "academic": { "score": 85, "level": "良好" },
      "learningHabits": { "score": 82, "level": "良好" },
      "logicalThinking": { "score": 90, "level": "优秀" },
      "selfManagement": { "score": 78, "level": "良好" },
      "socialSkills": { "score": 92, "level": "优秀" }
    }
  }
}
```

---

## 🗄️ 数据库设计

### 数据模型

#### 1. Child（儿童）

```typescript
interface Child {
  id: string
  name: string
  nickname: string
  gender: 'male' | 'female'
  birthDate: Date
  createdAt: Date
  updatedAt: Date
}
```

#### 2. GrowthRecord（成长记录）

```typescript
interface GrowthRecord {
  id: string
  childId: string
  date: Date
  height: number
  weight: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### 3. Milestone（里程碑）

```typescript
interface Milestone {
  id: string
  childId: string
  title: string
  description: string
  date: Date
  isAchieved: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### 4. Badge（徽章）

```typescript
interface Badge {
  id: string
  childId: string
  title: string
  description: string
  icon: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  isUnlocked: boolean
  unlockedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### 数据库连接

```typescript
// lib/db/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 📦 部署指南

### 环境变量

```env
# 应用配置
NEXT_PUBLIC_APP_NAME=小语AI智能成长守护系统
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_API_URL=https://api.yyc3-xyai.com

# API配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3xyai

# 其他配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yyc3-xyai.com
```

### Docker部署

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/yyc3xyai
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=yyc3xyai
    volumes:
      - postgres_data:/var/lib/postgresql/data

  neo4j:
    image: neo4j:5.0
    environment:
      - NEO4J_AUTH=neo4j/your_neo4j_password
    volumes:
      - neo4j_data:/data

volumes:
  postgres_data:
  neo4j_data:
```

### Vercel部署

#### 1. 连接GitHub仓库

访问 https://vercel.com/new，选择连接GitHub仓库 `YY-Nexus/yyc3-xyai`

#### 2. 配置环境变量

在Vercel项目设置中添加所有必要的环境变量。

#### 3. 部署

Vercel会自动检测Next.js项目并进行部署。

---

## 🤝 贡献指南

### 贡献流程

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范

- 遵循TypeScript和ESLint规范
- 编写单元测试
- 更新文档
- 遵循Conventional Commits规范

### Commit信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:
```
feat(ai-chat): add voice interaction feature

- Add voice input component
- Integrate Web Speech API
- Update AI chat API to handle voice messages

Closes #123
```

---

## ❓ 常见问题

### Q1: 如何添加新的页面？

A: 在`app`目录下创建新的页面文件夹，并添加`page.tsx`文件。

```bash
mkdir app/new-page
touch app/new-page/page.tsx
```

### Q2: 如何配置新的环境变量？

A: 在`.env.local`文件中添加新的环境变量，并在代码中通过`process.env.VARIABLE_NAME`访问。

### Q3: 如何调试Next.js应用？

A: 使用VS Code的调试功能，在`.vscode/launch.json`中配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:1228"
    }
  ]
}
```

### Q4: 如何优化Next.js应用性能？

A: 
- 使用Next.js Image组件优化图片
- 使用React.memo和useMemo优化组件性能
- 使用Next.js的ISR和SSG优化页面加载
- 使用CDN加速静态资源

### Q5: 如何处理国际化？

A: 使用Next.js的国际化路由，在`app/[locale]`目录下创建页面，并使用`useLocale`和`useTranslations` Hooks。

```typescript
import { useLocale, useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('common')
  const locale = useLocale()

  return <div>{t('welcome')}</div>
}
```

---

## 📞 联系方式

### 项目信息

- **项目名称**: 小语AI智能成长守护系统
- **Git仓库**: https://github.com/YY-Nexus/yyc3-xyai.git
- **管理员邮箱**: admin@0379.email
- **项目版本**: v2.0.0

### 贡献者

- YYC³ Development Team
- Contributors from the community

---

## 📄 许可证

本项目采用MIT许可证。详细信息请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">

**[⬆ 回到顶部](#小语ai智能成长守护系统---开发者文档)**

Made with ❤️ by YYC³ Development Team

</div>
