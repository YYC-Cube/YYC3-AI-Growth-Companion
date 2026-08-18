# YYC³ 智能成长守护系统 - API文档与功能说明

> **创建日期**: 2025-01-30
> **版本**: 1.0.0
> **更新日期**: 2025-01-30
> **适用项目**: yyc3-xy-ai

---

## 📋 目录

1. [API接口文档](#api接口文档)
2. [页面功能说明](#页面功能说明)
3. [AI角色系统](#ai角色系统)
4. [组件架构](#组件架构)

---

## 🌐 API接口文档

### 1. AI服务接口

#### 1.1 AI聊天接口
**接口地址**: `POST /api/ai/chat`
**功能描述**: 处理用户聊天请求，返回AI响应

**请求参数**:
```typescript
{
  message: string;        // 用户消息
  userId: string;         // 用户ID
  childId?: string;       // 孩子ID（可选）
  context?: {             // 上下文信息
    previousMessages: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: number;
    }>;
    currentSituation: string;  // 当前情况描述
  };
}
```

**响应数据**:
```typescript
{
  success: boolean;
  data: {
    id: string;           // 响应ID
    content: string;      // AI响应内容
    role: {               // 响应角色信息
      id: string;
      name: string;
      icon: string;
      description: string;
    };
    confidence: number;   // 置信度 (0-1)
    suggestions?: string[]; // 建议行动列表
    metadata?: {          // 元数据
      emotionAnalysis?: {
        emotion: string;
        intensity: number;
      };
      developmentAdvice?: {
        area: string;
        suggestion: string;
      };
    };
  };
  timestamp: number;
}
```

#### 1.2 AI编排接口
**接口地址**: `POST /api/ai/orchestrate`
**功能描述**: 多角色AI协同处理复杂请求

**请求参数**:
```typescript
{
  query: string;          // 用户查询
  userId: string;         // 用户ID
  childContext?: {         // 孩子上下文
    age: number;
    developmentStage: string;
    interests: string[];
    recentActivities: string[];
  };
  preferredRoles?: string[];  // 偏好角色列表
}
```

**响应数据**:
```typescript
{
  success: boolean;
  data: {
    primaryRole: {
      id: string;
      name: string;
      response: string;
    };
    supportingRoles: Array<{
      id: string;
      name: string;
      insight: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    coordinationSummary: string;  // 协同总结
    suggestedActions: string[];  // 建议行动
    confidence: number;
  };
}
```

#### 1.3 情绪分析接口
**接口地址**: `POST /api/ai/emotion`
**功能描述**: 分析文本中的情绪状态

**请求参数**:
```typescript
{
  text: string;           // 待分析文本
  context?: string;       // 上下文信息
  childAge?: number;      // 孩子年龄
}
```

**响应数据**:
```typescript
{
  success: boolean;
  data: {
    emotion: string;      // 主要情绪
    intensity: number;    // 情绪强度 (0-1)
    triggers: string[];   // 可能触发因素
    suggestions: string[]; // 应对建议
    confidence: number;
  };
}
```

#### 1.4 成长记录分析接口
**接口地址**: `POST /api/ai/analyze-record`
**功能描述**: 分析成长记录，提取关键信息

**请求参数**:
```typescript
{
  record: {
    type: 'text' | 'image' | 'video';
    content: string;
    timestamp: number;
    tags?: string[];
  };
  childProfile: {
    age: number;
    developmentStage: string;
  };
}
```

**响应数据**:
```typescript
{
  success: boolean;
  data: {
    summary: string;           // 记录摘要
    milestones: string[];      // 里程碑识别
    developmentAreas: string[]; // 发展领域
    suggestions: string[];     // 后续建议
    emotionalContext?: {       // 情绪上下文
      mood: string;
      factors: string[];
    };
  };
}
```

### 2. 用户管理接口

#### 2.1 子童管理接口
**接口地址**: `GET/POST /api/children`
**功能描述**: 获取或创建子童信息

**GET请求响应**:
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    age: number;
    avatar: string;
    developmentStage: string;
    interests: string[];
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**POST请求参数**:
```typescript
{
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  avatar?: string;
  interests?: string[];
}
```

### 3. 成长记录接口

#### 3.1 成长记录CRUD
**接口地址**: `GET/POST /api/growth-records`
**功能描述**: 获取或创建成长记录

**GET请求参数**:
```typescript
{
  childId?: string;       // 孩子ID（可选）
  type?: string;          // 记录类型（可选）
  startDate?: string;     // 开始日期（可选）
  endDate?: string;       // 结束日期（可选）
  limit?: number;         // 限制数量（可选）
}
```

**POST请求参数**:
```typescript
{
  childId: string;
  type: 'milestone' | 'daily' | 'achievement' | 'emotion';
  title: string;
  description: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  }[];
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### 4. 作业管理接口

#### 4.1 作业CRUD接口
**接口地址**: `GET/POST /api/homework`
**功能描述**: 获取或创建作业任务

**GET请求响应**:
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;    // 预估完成时间（分钟）
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
    childId: string;
  }>;
}
```

**POST请求参数**:
```typescript
{
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  dueDate: string;
  childId: string;
  resources?: Array<{
    type: 'video' | 'document' | 'interactive';
    url: string;
    title: string;
  }>;
}
```

---

## 📱 页面功能说明

### 1. 主页 (`/`)
**文件路径**: `/app/page.tsx`
**功能描述**: 系统主页，提供整体功能导航

**主要功能**:
- 用户登录状态展示
- 功能模块快速入口
- 今日任务和提醒
- AI助手快速访问
- 成长数据概览

**核心组件**:
- `UserCenter`: 用户中心组件
- `Navigation`: 底部导航栏
- `AIWidget`: AI助手浮窗组件

### 2. 设置页面 (`/settings`)
**文件路径**: `/app/settings/page.tsx`
**功能描述**: 系统设置和个人偏好管理

**主要功能**:
- **账户管理**: 用户资料修改、密码设置
- **安全设置**: 家长授权码管理
- **学习偏好**: 护眼模式、学习提醒
- **帮助支持**: FAQ、联系客服、退出登录

**核心组件**:
- `SettingsSection`: 设置分组组件
- `SettingsItem`: 设置项组件
- `ToggleSwitch`: 开关组件
- `ActionCard`: 操作卡片组件

**状态管理**:
- `eyeMode`: 护眼模式状态
- `reminder`: 学习提醒状态

### 3. 成长页面 (`/growth`)
**文件路径**: `/app/growth/page.tsx`
**功能描述**: 孩子成长记录和发展追踪

**主要功能**:
- 成长里程碑记录
- 发展阶段评估
- 成长时间线展示
- 成长数据分析

**核心组件**:
- `GrowthTimeline`: 成长时间线
- `MilestoneTracker`: 里程碑追踪器
- `DevelopmentChart`: 发展图表
- `GrowthRecords`: 成长记录列表

### 4. AI聊天页面 (`/[locale]/ai-chat`)
**文件路径**: `/app/[locale]/ai-chat/page.tsx`
**功能描述**: AI助手交互界面

**主要功能**:
- 多角色AI对话
- 语音输入输出
- 对话历史记录
- 角色切换功能

**核心组件**:
- `ChatInterface`: 聊天界面
- `RoleSelector`: 角色选择器
- `VoiceInput`: 语音输入
- `MessageHistory`: 消息历史

### 5. 课程页面 (`/courses`)
**文件路径**: `/app/courses/page.tsx`
**功能描述**: 课程学习和内容管理

**主要功能**:
- 课程分类浏览
- 学习进度追踪
- 课程推荐
- 学习资源下载

**核心组件**:
- `CourseGrid`: 课程网格
- `ProgressBar`: 进度条
- `CourseCard`: 课程卡片
- `ResourceList`: 资源列表

### 6. 作业页面 (`/homework`)
**文件路径**: `/app/homework/page.tsx`
**功能描述**: 作业任务管理和提交

**主要功能**:
- 作业列表展示
- 作业状态管理
- 作业提交功能
- 作业评分查看

**核心组件**:
- `HomeworkList`: 作业列表
- `HomeworkCard`: 作业卡片
- `SubmissionForm`: 提交表单
- `GradeDisplay`: 评分展示

### 7. 日程页面 (`/schedule`)
**文件路径**: `/app/schedule/page.tsx`
**功能描述**: 日程安排和时间管理

**主要功能**:
- 日程查看和编辑
- 活动创建和管理
- 提醒设置
- 日程分享

**核心组件**:
- `Calendar`: 日历组件
- `EventList`: 事件列表
- `EventForm`: 事件表单
- `ReminderSettings`: 提醒设置

### 8. 子童管理页面 (`/children`)
**文件路径**: `/app/children/page.tsx`
**功能描述**: 子童信息和个人档案管理

**主要功能**:
- 子童档案创建
- 个人信息编辑
- 发展记录查看
- 偏好设置

**核心组件**:
- `ChildProfile`: 子童档案
- `ProfileEditor`: 档案编辑器
- `DevelopmentRecords`: 发展记录
- `PreferenceSettings`: 偏好设置

### 9. AI创意页面 (`/ai-creative`)
**文件路径**: `/app/ai-creative/page.tsx`
**功能描述**: AI创意工具和内容生成

**主要功能**:
- 故事创作
- 图像生成
- 音乐创作
- 创意游戏

**核心组件**:
- `StoryCreator`: 故事创作器
- `ImageGenerator`: 图像生成器
- `MusicComposer`: 音乐创作器
- `CreativeGames`: 创意游戏

### 10. 互动页面 (`/interactions`)
**文件路径**: `/app/interactions/page.tsx`
**功能描述**: 亲子互动和社交功能

**主要功能**:
- 互动活动推荐
- 亲子游戏
- 社区交流
- 成果分享

**核心组件**:
- `ActivityRecommendations`: 活动推荐
- `ParentChildGames`: 亲子游戏
- `CommunityForum`: 社区论坛
- `SharingCenter`: 分享中心

---

## 🤖 AI角色系统

### 角色定义

YYC³系统包含五个核心AI角色，每个角色都有独特的专业领域和功能特点：

#### 1. 记录者 (Recorder)
**角色ID**: `recorder`
**专业领域**: 成长事件记录、里程碑识别、数据整理
**主要功能**:
- 自动捕捉和记录成长瞬间
- 生成温暖的成长故事
- 整理和分析成长数据
- 创建个人成长档案

**触发关键词**: 记录、保存、成长、里程碑、档案、数据、时间线、事件、历史

#### 2. 守护者 (Guardian)
**角色ID**: `guardian`
**专业领域**: 风险识别、安全预警、健康监测
**主要功能**:
- 基于科学标准评估发展状况
- 识别潜在风险和问题
- 提供安全防护建议
- 监测健康指标

**触发关键词**: 安全、风险、危险、保护、预警、健康、检查、防护、注意

#### 3. 聆听者 (Listener)
**角色ID**: `listener`
**专业领域**: 情绪识别、心理分析、共情理解
**主要功能**:
- 理解情绪和行为背后的原因
- 促进亲子沟通
- 提供心理支持
- 分析行为模式

**触发关键词**: 情绪、心情、感觉、心理、分析、理解、为什么、行为、想法

#### 4. 建议者 (Advisor)
**角色ID**: `advisor`
**专业领域**: 成长建议、教育指导、个性化方案
**主要功能**:
- 提供多元选择和培养自主性
- 制定个性化教育方案
- 科学育儿指导
- 能力培养建议

**触发关键词**: 建议、指导、怎么办、如何、方案、方法、策略、培养、教育

#### 5. 国粹导师 (Cultural Tutor)
**角色ID**: `cultural`
**专业领域**: 传统文化、国学教育、文化传承
**主要功能**:
- 传承文化智慧
- 浸润传统教育
- 结合现代教育方法
- 培养文化素养

**触发关键词**: 古诗、诗词、文化、国学、传统、节日、礼仪、故事、成语、典故

### 角色协同机制

系统通过`RoleCoordinator`类实现多角色协同工作：

1. **智能角色选择**: 基于查询内容和上下文自动选择最合适的角色
2. **多角色协同**: 复杂问题可由多个角色协同解决
3. **角色权重管理**: 根据专业领域和协同效应调整角色权重
4. **协同历史记录**: 记录和分析协同效果，持续优化

### 角色配置文件

**配置文件路径**: `/lib/ai_roles.ts`

主要配置项：
```typescript
interface RoleConfig {
  id: AIRole;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  color: string;
  voiceStyle: "cheerful" | "calm" | "gentle" | "professional" | "warm";
  specialties: string[];
  triggerKeywords: string[];
}
```

---

## 🧩 组件架构

### 核心组件

#### 1. IntelligentAIWidget
**文件路径**: `/components/ai-widget/IntelligentAIWidget.tsx`
**功能描述**: 智能AI助手浮窗组件

**主要特性**:
- 支持拖拽移动
- 多视图切换（聊天、仪表板、工具、洞察、设置）
- 响应式设计
- 实时状态同步

**核心状态**:
```typescript
interface WidgetState {
  isVisible: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  currentView: 'chat' | 'dashboard' | 'tools' | 'insights' | 'settings';
  mode: 'floating' | 'docked' | 'modal';
  position: WidgetPosition;
  sessionId: string;
  unreadCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}
```

#### 2. RoleCoordinator
**文件路径**: `/lib/ai/role-coordinator.ts`
**功能描述**: AI角色协同管理器

**主要功能**:
- 角色选择和协同
- 查询复杂度分析
- 协同响应生成
- 协同历史记录

#### 3. CharacterManager
**文件路径**: `/lib/character-manager.ts`
**功能描述**: 角色信息管理器

**主要功能**:
- 统一管理角色形象
- 维护角色头像一致性
- 管理角色档案信息
- 提供角色资源访问

### UI组件库

#### 基础组件
- `Card`: 卡片容器
- `Button`: 按钮组件
- `Badge`: 徽章组件
- `Textarea`: 文本域
- `ScrollArea`: 滚动区域
- `Separator`: 分隔线
- `Progress`: 进度条
- `Switch`: 开关组件
- `Label`: 标签组件

#### 业务组件
- `Navigation`: 导航组件
- `PageHeader`: 页面头部
- `UserCenter`: 用户中心
- `SettingsSection`: 设置分组
- `SettingsItem`: 设置项
- `ActionCard`: 操作卡片

### 状态管理

#### 全局状态
- 用户认证状态 (`useAuth`)
- 子童信息状态 (`useChildrenMock`)
- AI服务状态 (`standaloneAIService`)
- 角色协同状态 (`roleCoordinator`)

#### 本地状态
- 组件内部状态使用`useState`
- 复杂状态逻辑使用`useReducer`
- 异步状态管理使用自定义Hook

---

## 🔧 技术实现

### 前端技术栈
- **框架**: Next.js 14.2.33 + React 19
- **类型系统**: TypeScript 5+
- **样式方案**: TailwindCSS 4.1.9+
- **状态管理**: React Query + Zustand
- **UI组件**: Radix UI + 自定义组件
- **动画**: Framer Motion
- **拖拽**: React DnD

### 后端技术栈
- **运行时**: Bun 1.1.38+ / Node.js 18+
- **框架**: Hono 4.6.3+
- **数据库**: PostgreSQL + Redis + 向量数据库
- **AI服务**: OpenAI API + Anthropic API
- **认证**: JWT + OAuth 2.0

### 部署架构
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: 结构化日志 + 集中收集

---

## 📊 性能优化

### 前端优化
- 代码分割和懒加载
- 图片优化和CDN加速
- 缓存策略优化
- 组件渲染优化

### 后端优化
- 数据库查询优化
- API响应缓存
- 连接池管理
- 异步处理优化

### 系统优化
- 负载均衡
- 自动扩缩容
- 资源调度优化
- 网络延迟优化

---

<div align="center">

**YYC³ 团队**

**万象归元于云枢 | 深栈智启新纪元**

</div>