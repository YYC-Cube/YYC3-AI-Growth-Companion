---
@file: YYC3-XY-架构类-UI-UX全量设计体系整合文档.md
@description: 整合小语AI应用UI-UX全量设计规划与Figma设计指导方案的完整设计体系
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: UI/UX设计,设计体系,组件库,五高五标五化,Figma
---

# YYC³-XY 架构类 - UI-UX全量设计体系整合文档

---

## 目录

1. [文档概述](#一文档概述)
2. [设计理念与原则](#二设计理念与原则)
3. [整合设计系统架构](#三整合设计系统架构)
4. [设计令牌系统](#四设计令牌系统)
5. [基础组件层](#五基础组件层)
6. [业务组件层](#六业务组件层)
7. [页面组件层](#七页面组件层)
8. [系统组件层](#八系统组件层)
9. [布局组件层](#九布局组件层)
10. [反馈组件层](#十反馈组件层)
11. [模板层](#十一模板层)
12. [交互层](#十二交互层)
13. [页面结构设计](#十三页面结构设计)
14. [技术实现规范](#十四技术实现规范)
15. [Figma实现指南](#十五figma实现指南)

---

## 一、文档概述

### 1.1 设计目标

本设计体系整合了小语AI应用的UI/UX全量设计规划与Figma全链路设计指导方案，旨在提供完整、系统、可落地的UI/UX设计方案，实现以下核心目标：

- **全局统一性**: 确保所有页面组件遵循统一的设计语言和交互规范
- **分层清晰性**: 采用多层架构模型，实现组件的层次化管理和复用
- **AI弹窗自治**: AI浮窗作为独立自治系统，具备完整的交互能力和状态管理
- **全链路闭环**: 从用户进入应用到完成交互的完整流程闭环设计
- **智能适配性**: 根据用户年龄、成长阶段、文化背景智能适配内容和界面
- **设计系统化**: 建立完整的设计令牌系统，支持Figma设计与开发实现的无缝对接

### 1.2 设计原则

遵循YYC³「五高五标五化」标准：

**五高 (Five Highs)**:
- 高可用: 组件可复用性≥90%，交互响应时间≤200ms
- 高性能: 页面加载时间≤2s，动画帧率≥60fps
- 高安全: 用户数据加密存储，权限分级管理
- 高扩展: 组件化设计，支持动态加载和按需渲染
- 高维护: 代码注释覆盖率≥80%，文档完整度100%

**五标 (Five Standards)**:
- 标准化: 组件命名、样式、交互遵循统一规范
- 规范化: 设计稿、代码、文档三同步
- 自动化: 组件自动生成、测试、部署
- 智能化: AI辅助设计、智能推荐、自适应布局
- 可视化: 设计系统可视化、组件库可视化

**五化 (Five Transformations)**:
- 流程化: 设计流程标准化、可追溯
- 文档化: 所有设计决策有文档记录
- 工具化: 设计工具链完整集成
- 数字化: 设计资产数字化管理
- 生态化: 设计系统可扩展、可演进

### 1.3 设计范围

本设计体系覆盖以下核心系统：

| 系统名称 | 设计内容 | 关键特性 |
|---------|---------|---------|
| 设计令牌系统 | 色彩、字体、间距、图标、动效 | 标准化、可复用、可扩展 |
| 基础组件层 | 按钮、输入框、卡片、列表、弹窗、加载器、提示框 | 原子化、可组合、可配置 |
| 业务组件层 | 成长卡片、文化轮播、学习进度、成就徽章、社交互动 | 业务化、场景化、智能化 |
| 页面组件层 | 首页、成长记录、文化探索、学习中心、个人中心 | 模块化、可复用、可定制 |
| 系统组件层 | AI浮窗、全局导航、主题切换、权限控制、通知中心 | 全局化、自治化、智能化 |
| 布局组件层 | 导航栏、头部、侧边栏、标签页、网格、容器 | 结构化、响应式、自适应 |
| 反馈组件层 | 提示框、工具提示、弹出框、进度条、加载器 | 即时性、友好性、可访问 |
| 模板层 | 页面模板、布局模板、流程模板、文档模板 | 标准化、可复用、可定制 |
| 交互层 | 微交互、手势、动画、过渡、语音交互 | 流畅性、自然性、智能化 |

---

## 二、设计理念与原则

### 2.1 五高原则在UI/UX中的体现

**高前瞻性**

- 设计可扩展的组件系统，支持未来功能扩展
- 采用模块化设计，便于快速迭代和功能升级
- 预留多语言、多主题、多设备适配能力

**高整合性**

- 整合医学、心理学、教育学知识体系
- 融合河洛文化元素与现代设计美学
- 统一AI交互、数据记录、成长分析等核心功能

**高个性化**

- 支持用户自定义界面布局和主题
- 基于成长阶段动态调整界面呈现
- 提供个性化推荐和智能引导

**高情感价值**

- 温暖的视觉风格和友好的交互体验
- 记录和展示亲子互动的温暖瞬间
- 通过故事化设计增强情感联结

**高实操性**

- 清晰的信息层级和直观的操作流程
- 提供详细的帮助文档和操作指引
- 优化关键路径，减少用户操作步骤

### 2.2 五标体系在设计中的应用

**数据标准化**

- 统一的数据展示格式和单位
- 标准化的图表和可视化组件
- 一致的数据录入和验证规则

**发展标准化**

- 基于WHO等权威机构的发展标准
- 参考发展心理学理论设计界面
- 科学的评估工具和指标展示

**安全标准化**

- 遵循儿科安全规范设计界面
- 隐私保护相关的UI设计
- 安全的权限控制和访问提示

**记录标准化**

- 统一的成长记录模板
- 标准化的数据录入界面
- 一致的记录展示格式

**评估标准化**

- 科学的评估量表设计
- 标准化的评估结果展示
- 清晰的评估报告界面

### 2.3 五化架构在UI/UX中的实现

**阶段化**

- 按成长阶段划分界面模块
- 阶段特定的功能入口和展示
- 动态调整界面内容和交互

**模块化**

- 可复用的UI组件库
- 独立的功能模块设计
- 灵活的组件组合方式

**场景化**

- 针对具体育儿场景设计界面
- 场景化的操作流程和引导
- 上下文相关的功能推荐

**工具化**

- 实用的记录工具界面
- 便捷的评估量表工具
- 智能的数据分析工具

**故事化**

- 成长记录的故事化展示
- 时间线式的成长历程
- 温暖的回忆和纪念功能

---

## 三、整合设计系统架构

### 3.1 九层设计系统架构

```
┌─────────────────────────────────────────────────────────────┐
│              原则层 (Principles Layer)                         │
│  五高五标五化原则、设计价值观、用户体验原则                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              设计令牌层 (Design Tokens Layer)                  │
│  色彩系统、字体系统、间距系统、图标系统、动效系统               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              基础组件层 (Foundation Layer)                     │
│  按钮、输入框、卡片、列表、弹窗、加载器、提示框                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              业务组件层 (Business Layer)                      │
│  成长卡片、文化轮播、学习进度、成就徽章、社交互动               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              页面组件层 (Page Layer)                          │
│  首页、成长记录、文化探索、学习中心、个人中心                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              系统组件层 (System Layer)                        │
│  AI浮窗、全局导航、主题切换、权限控制、通知中心                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              布局组件层 (Layout Layer)                        │
│  导航栏、头部、侧边栏、标签页、网格、容器                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              反馈组件层 (Feedback Layer)                      │
│  提示框、工具提示、弹出框、进度条、加载器                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              模板层 (Template Layer)                          │
│  页面模板、布局模板、流程模板、文档模板                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              交互层 (Interaction Layer)                       │
│  微交互、手势、动画、过渡、语音交互                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 设计系统文件结构

```
YYC3-XY-UI-UX-Design-System/
├── 01-Design-Tokens/              # 设计令牌
│   ├── Colors.figma               # 色彩系统
│   ├── Typography.figma          # 字体系统
│   ├── Spacing.figma             # 间距系统
│   ├── Icons.figma               # 图标系统
│   └── Effects.figma             # 动效系统
├── 02-Components/                # 组件库
│   ├── 01-Base-Components/       # 基础组件
│   │   ├── Buttons.figma
│   │   ├── Inputs.figma
│   │   ├── Cards.figma
│   │   ├── Lists.figma
│   │   ├── Modals.figma
│   │   ├── Loaders.figma
│   │   ├── Alerts.figma
│   │   └── Badges.figma
│   ├── 02-Business-Components/   # 业务组件
│   │   ├── Growth-Cards.figma
│   │   ├── Culture-Carousel.figma
│   │   ├── Learning-Progress.figma
│   │   ├── Achievement-Badges.figma
│   │   ├── Social-Interactions.figma
│   │   ├── Milestone-Cards.figma
│   │   ├── Timeline-View.figma
│   │   └── Data-Charts.figma
│   ├── 03-Page-Components/       # 页面组件
│   │   ├── Home-Page.figma
│   │   ├── Growth-Records-Page.figma
│   │   ├── Culture-Exploration-Page.figma
│   │   ├── Learning-Center-Page.figma
│   │   └── Personal-Center-Page.figma
│   ├── 04-System-Components/    # 系统组件
│   │   ├── AI-Floating-Window.figma
│   │   ├── Global-Navigation.figma
│   │   ├── Theme-Switcher.figma
│   │   ├── Permission-Control.figma
│   │   └── Notification-Center.figma
│   ├── 05-Layout-Components/     # 布局组件
│   │   ├── Navigation.figma
│   │   ├── Headers.figma
│   │   ├── Sidebars.figma
│   │   ├── Tabs.figma
│   │   ├── Grids.figma
│   │   └── Containers.figma
│   └── 06-Feedback-Components/   # 反馈组件
│       ├── Toasts.figma
│       ├── Tooltips.figma
│       ├── Popovers.figma
│       ├── Progress-Bars.figma
│       └── Spinners.figma
├── 03-Pages/                     # 页面设计
│   ├── 01-Home.figma
│   ├── 02-Growth-Records.figma
│   ├── 03-Culture-Exploration.figma
│   ├── 04-Learning-Center.figma
│   ├── 05-Personal-Center.figma
│   ├── 06-Smart-Schedule.figma
│   ├── 07-Audio-Picture-Books.figma
│   ├── 08-Video-Workshop.figma
│   ├── 09-Creative-Workshop.figma
│   ├── 10-Charity-Activities.figma
│   ├── 11-Charity-Classroom.figma
│   ├── 12-Homework-Tasks.figma
│   ├── 13-Message-Center.figma
│   └── 14-Settings.figma
├── 04-Templates/                 # 模板
│   ├── 01-Page-Templates.figma
│   ├── 02-Layout-Templates.figma
│   ├── 03-Flow-Templates.figma
│   └── 04-Document-Templates.figma
├── 05-Interactions/              # 交互设计
│   ├── 01-Micro-Interactions.figma
│   ├── 02-Gestures.figma
│   ├── 03-Animations.figma
│   ├── 04-Transitions.figma
│   └── 05-Voice-Interactions.figma
├── 06-Assets/                    # 资源文件
│   ├── 01-Images/
│   ├── 02-Icons/
│   ├── 03-Fonts/
│   └── 04-Illustrations/
└── 07-Documentation/             # 文档
    ├── 01-Design-Guide.md
    ├── 02-Component-Guide.md
    ├── 03-Interaction-Guide.md
    └── 04-Implementation-Guide.md
```

---

## 四、设计令牌系统

### 4.1 色彩系统

#### 4.1.1 主色调

```typescript
export const ColorSystem = {
  主色调: {
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    secondary: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
  },
  
  中性色: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  
  语义色: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  功能色: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      disabled: '#9CA3AF',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#8B5CF6',
    },
  },
};
```

#### 4.1.2 色彩使用规范

| 用途 | 色彩 | 使用场景 |
|-----|------|---------|
| 主按钮 | Primary 500-600 | 主要操作按钮、重要链接 |
| 次要按钮 | Secondary 500-600 | 次要操作按钮 |
| 背景色 | Background Primary-Secondary | 页面背景、卡片背景 |
| 文字色 | Text Primary-Secondary | 标题、正文文字 |
| 成功状态 | Success | 成功提示、完成状态 |
| 警告状态 | Warning | 警告提示、待处理状态 |
| 错误状态 | Error | 错误提示、失败状态 |
| 信息状态 | Info | 信息提示、帮助说明 |

### 4.2 字体系统

#### 4.2.1 字体族

```typescript
export const TypographySystem = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    secondary: '"PingFang SC", "Microsoft YaHei", "SimHei", sans-serif',
    mono: '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};
```

#### 4.2.2 字体使用规范

| 用途 | 字号 | 字重 | 行高 | 使用场景 |
|-----|------|------|------|---------|
| 页面标题 | 6xl | Bold | Tight | 页面主标题 |
| 章节标题 | 5xl | Semibold | Tight | 章节标题 |
| 卡片标题 | 4xl | Semibold | Tight | 卡片标题 |
| 小标题 | 3xl | Medium | Normal | 小标题 |
| 正文 | Base | Normal | Normal | 正文内容 |
| 辅助文字 | Sm | Normal | Relaxed | 辅助说明 |
| 说明文字 | Xs | Normal | Loose | 提示说明 |

### 4.3 间距系统

```typescript
export const SpacingSystem = {
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
};
```

### 4.4 图标系统

```typescript
export const IconSystem = {
  size: {
    xs: '0.75rem',   // 12px
    sm: '1rem',      // 16px
    md: '1.25rem',   // 20px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
  },
  
  strokeWidth: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
};
```

### 4.5 动效系统

```typescript
export const AnimationSystem = {
  duration: {
    '75': '75ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '300': '300ms',
    '500': '500ms',
    '700': '700ms',
    '1000': '1000ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
```

---

## 五、基础组件层

### 5.1 按钮组件 (Button)

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  onClick,
  children,
  className = '',
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="small" />}
      {icon && !loading && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
};
```

### 5.2 卡片组件 (Card)

```typescript
export interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  actions,
  onClick,
  hoverable = true,
  className = '',
  children,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-4">
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        {children}
        {actions && (
          <div className="mt-4 flex gap-2 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 5.3 输入框组件 (Input)

```typescript
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  icon,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className={`relative flex items-center border-2 rounded-lg transition-all duration-200 ${focused ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-300'} ${error ? 'border-red-500' : ''}`}>
        {icon && (
          <span className="absolute left-3 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 outline-none ${icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
```

### 5.4 加载器组件 (LoadingSpinner)

```typescript
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#9333EA',
  className = '',
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeMap[size]}`}
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};
```

### 5.5 提示框组件 (Toast)

```typescript
export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const typeConfig = {
    success: {
      icon: '✓',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
    error: {
      icon: '✕',
      bgColor: 'bg-red-500',
      textColor: 'text-white',
    },
    warning: {
      icon: '⚠',
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
    },
    info: {
      icon: 'ℹ',
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
    },
  };
  
  const config = typeConfig[type];
  
  if (!visible) return null;
  
  return (
    <div className={`fixed top-4 right-4 ${config.bgColor} ${config.textColor} px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold">{config.icon}</span>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
```

### 5.6 列表组件 (List)

```typescript
export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  action,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <div>
          <Typography variant="body1">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export interface ListProps {
  items: ListItemProps[];
  className?: string;
}

export const List: React.FC<ListProps> = ({ items, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {items.map((item, index) => (
        <ListItem key={index} {...item} />
      ))}
    </div>
  );
};
```

### 5.7 弹窗组件 (Modal)

```typescript
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  className = '',
}) => {
  if (!open) return null;
  
  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-xl shadow-2xl ${sizeStyles[size]} w-full mx-4 animate-slide-up ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <Typography variant="h5">{title}</Typography>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 5.8 徽章组件 (Badge)

```typescript
export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  count?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  dot = false,
  count,
  children,
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-purple-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  };
  
  const sizeStyles = {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2 py-0.5 text-sm',
    large: 'px-2.5 py-1 text-base',
  };
  
  if (dot) {
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${variantStyles[variant]} ${className}`} />
    );
  }
  
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {count !== undefined && count > 0 ? count : children}
    </span>
  );
};
```

---

## 六、业务组件层

### 6.1 成长卡片组件 (GrowthCard)

```typescript
export interface GrowthCardProps {
  ageStage: string;
  growthData: GrowthRecord;
  onViewDetails?: () => void;
  onEdit?: () => void;
  className?: string;
}

export interface GrowthRecord {
  id: string;
  age: number;
  stage: string;
  dimensions: {
    name: string;
    progress: number;
    items: GrowthItem[];
  }[];
  achievements: Achievement[];
  lastUpdated: string;
}

export interface GrowthItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earnedDate: string;
}

export const GrowthCard: React.FC<GrowthCardProps> = ({
  ageStage,
  growthData,
  onViewDetails,
  onEdit,
  className = '',
}) => {
  const overallProgress = useMemo(() => {
    const totalItems = growthData.dimensions.reduce((sum, dim) => sum + dim.items.length, 0);
    const completedItems = growthData.dimensions.reduce((sum, dim) => sum + dim.items.filter(item => item.completed).length, 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [growthData]);
  
  return (
    <Card className={`growth-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {growthData.age}
          </div>
          <div>
            <Typography variant="h6">{ageStage}</Typography>
            <Typography variant="body2" color="textSecondary">
              最后更新: {new Date(growthData.lastUpdated).toLocaleDateString('zh-CN')}
            </Typography>
          </div>
        </div>
        <div className="text-right">
          <Typography variant="h4" color="primary">
            {overallProgress}%
          </Typography>
          <Typography variant="caption">总体进度</Typography>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {growthData.dimensions.slice(0, 3).map((dimension, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{dimension.name}</span>
              <span>{dimension.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dimension.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {growthData.achievements.length > 0 && (
        <div className="flex gap-2 mb-4">
          {growthData.achievements.slice(0, 4).map((achievement) => (
            <Tooltip key={achievement.id} title={achievement.title}>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                {achievement.icon}
              </div>
            </Tooltip>
          ))}
          {growthData.achievements.length > 4 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              +{growthData.achievements.length - 4}
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" size="small" onClick={onViewDetails} fullWidth>
          查看详情
        </Button>
        <Button variant="ghost" size="small" onClick={onEdit}>
          编辑
        </Button>
      </div>
    </Card>
  );
};
```

### 6.2 文化轮播组件 (CultureCarousel)

```typescript
export interface CultureCarouselProps {
  items: CultureItem[];
  autoplay?: boolean;
  interval?: number;
  onItemClick?: (item: CultureItem) => void;
  className?: string;
}

export interface CultureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
}

export const CultureCarousel: React.FC<CultureCarouselProps> = ({
  items,
  autoplay = true,
  interval = 5000,
  onItemClick,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval, items.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  
  const currentItem = items[currentIndex];
  
  return (
    <div className={`culture-carousel ${className}`}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={currentItem.image}
          alt={currentItem.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
            color: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
            {currentItem.title}
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {currentItem.description}
          </Typography>
          {currentItem.tags && (
            <div className="flex gap-2 mt-2">
              {currentItem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          ‹
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          ›
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 6.3 学习进度组件 (LearningProgress)

```typescript
export interface LearningProgressProps {
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
  onContinue?: () => void;
  className?: string;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  courseId,
  courseTitle,
  progress,
  completedLessons,
  totalLessons,
  lastAccessed,
  onContinue,
  className = '',
}) => {
  return (
    <Card className={`learning-progress ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Typography variant="h6" gutterBottom>
            {courseTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            已完成 {completedLessons}/{totalLessons} 课时
          </Typography>
        </div>
        <div className="text-right">
          <Typography variant="h4" color="primary">
            {progress}%
          </Typography>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>上次学习: {new Date(lastAccessed).toLocaleDateString('zh-CN')}</span>
        <Badge variant="primary" size="small">
          进行中
        </Badge>
      </div>
      
      <Button variant="primary" size="small" onClick={onContinue} fullWidth>
        继续学习
      </Button>
    </Card>
  );
};
```

### 6.4 成就徽章组件 (AchievementBadge)

```typescript
export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  onClick,
  className = '',
}) => {
  const sizeStyles = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl',
  };
  
  return (
    <Tooltip title={achievement.title}>
      <div
        className={`rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${sizeStyles[size]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        <span className="text-white">{achievement.icon}</span>
      </div>
    </Tooltip>
  );
};
```

### 6.5 社交互动组件 (SocialInteraction)

```typescript
export interface SocialInteractionProps {
  type: 'like' | 'comment' | 'share' | 'bookmark';
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SocialInteraction: React.FC<SocialInteractionProps> = ({
  type,
  count,
  active = false,
  onClick,
  className = '',
}) => {
  const icons = {
    like: '❤️',
    comment: '💬',
    share: '🔗',
    bookmark: '🔖',
  };
  
  const activeStyles = active ? 'text-purple-600' : 'text-gray-400';
  
  return (
    <button
      className={`flex items-center gap-1 hover:text-purple-600 transition-colors ${activeStyles} ${className}`}
      onClick={onClick}
    >
      <span>{icons[type]}</span>
      {count !== undefined && count > 0 && (
        <span className="text-sm">{count}</span>
      )}
    </button>
  );
};
```

### 6.6 里程碑卡片组件 (MilestoneCard)

```typescript
export interface MilestoneCardProps {
  milestone: {
    id: string;
    title: string;
    description: string;
    date: string;
    achieved: boolean;
    category: string;
  };
  onToggle?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onToggle,
  onEdit,
  className = '',
}) => {
  return (
    <Card
      className={`milestone-card ${milestone.achieved ? 'border-2 border-green-500' : ''} ${className}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${milestone.achieved ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
        >
          {milestone.achieved && <span className="text-white text-sm">✓</span>}
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Typography variant="h6" className={milestone.achieved ? 'line-through text-gray-400' : ''}>
                {milestone.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {milestone.description}
              </Typography>
            </div>
            {onEdit && (
              <Button variant="ghost" size="small" onClick={onEdit}>
                编辑
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" size="small">
              {milestone.category}
            </Badge>
            <Typography variant="caption" color="textSecondary">
              {new Date(milestone.date).toLocaleDateString('zh-CN')}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
};
```

### 6.7 时间线视图组件 (TimelineView)

```typescript
export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: 'milestone' | 'record' | 'event';
  icon?: string;
}

export interface TimelineViewProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
  className?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  items,
  onItemClick,
  className = '',
}) => {
  return (
    <div className={`timeline-view ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="relative pl-8 pb-8 last:pb-0">
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
            {item.icon || (index + 1)}
          </div>
          <div className="absolute left-3 top-6 w-0.5 h-full bg-gray-200 last:hidden" />
          
          <div
            className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer ${onItemClick ? 'cursor-pointer' : ''}`}
            onClick={() => onItemClick?.(item)}
          >
            <div className="flex items-center justify-between mb-2">
              <Typography variant="body2" color="textSecondary">
                {new Date(item.date).toLocaleDateString('zh-CN')}
              </Typography>
              <Badge
                variant={item.type === 'milestone' ? 'primary' : 'secondary'}
                size="small"
              >
                {item.type}
              </Badge>
            </div>
            
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            
            {item.description && (
              <Typography variant="body2" color="textSecondary">
                {item.description}
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 6.8 数据图表组件 (DataChart)

```typescript
export interface DataChartProps {
  type: 'line' | 'bar' | 'pie';
  data: {
    label: string;
    value: number;
  }[];
  title?: string;
  color?: string;
  className?: string;
}

export const DataChart: React.FC<DataChartProps> = ({
  type,
  data,
  title,
  color = '#8B5CF6',
  className = '',
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={`data-chart ${className}`}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {type === 'line' && (
        <div className="relative h-48">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 400;
                const y = 200 - (item.value / maxValue) * 180;
                return `${x},${y}`;
              }).join(' ')}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 200 - (item.value / maxValue) * 180;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
```

---

## 七、页面组件层

### 7.1 首页组件 (HomePage)

```typescript
export interface HomePageProps {
  user: User;
  carouselItems: CultureItem[];
  quickAccessItems: QuickAccessItem[];
  recommendedContent: RecommendedContent[];
  notifications: Notification[];
  className?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  carouselItems,
  quickAccessItems,
  recommendedContent,
  notifications,
  className = '',
}) => {
  return (
    <div className={`home-page ${className}`}>
      <CultureCarousel items={carouselItems} />
      
      <div className="quick-access-grid">
        {quickAccessItems.map((item) => (
          <QuickAccessCard key={item.id} item={item} />
        ))}
      </div>
      
      <div className="recommended-content">
        <Typography variant="h5" gutterBottom>
          推荐内容
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          {recommendedContent.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>
      
      <NotificationCenter notifications={notifications} />
    </div>
  );
};
```

### 7.2 成长记录页面组件 (GrowthRecordsPage)

```typescript
export interface GrowthRecordsPageProps {
  growthRecords: GrowthRecord[];
  currentStage: string;
  onStageChange: (stage: string) => void;
  onAddRecord: () => void;
  onExportReport: () => void;
  className?: string;
}

export const GrowthRecordsPage: React.FC<GrowthRecordsPageProps> = ({
  growthRecords,
  currentStage,
  onStageChange,
  onAddRecord,
  onExportReport,
  className = '',
}) => {
  return (
    <div className={`growth-records-page ${className}`}>
      <div className="stage-tabs">
        {['胎儿期', '新生儿期', '婴儿期', '幼儿期', '学龄前', '小学'].map((stage) => (
          <Button
            key={stage}
            variant={currentStage === stage ? 'primary' : 'outline'}
            onClick={() => onStageChange(stage)}
          >
            {stage}
          </Button>
        ))}
      </div>
      
      <TimelineView items={growthRecords} />
      
      <div className="bottom-actions">
        <Button variant="primary" onClick={onAddRecord}>
          添加记录
        </Button>
        <Button variant="outline" onClick={onExportReport}>
          导出报告
        </Button>
      </div>
    </div>
  );
};
```

### 7.3 文化探索页面组件 (CultureExplorationPage)

```typescript
export interface CultureExplorationPageProps {
  categories: CultureCategory[];
  featuredItems: CultureItem[];
  onCategorySelect: (category: string) => void;
  onItemSelect: (item: CultureItem) => void;
  className?: string;
}

export const CultureExplorationPage: React.FC<CultureExplorationPageProps> = ({
  categories,
  featuredItems,
  onCategorySelect,
  onItemSelect,
  className = '',
}) => {
  return (
    <div className={`culture-exploration-page ${className}`}>
      <div className="category-tabs">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            onClick={() => onCategorySelect(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <div className="featured-items">
        <Typography variant="h5" gutterBottom>
          精选内容
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          {featuredItems.map((item) => (
            <CultureCard key={item.id} item={item} onClick={() => onItemSelect(item)} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 7.4 学习中心页面组件 (LearningCenterPage)

```typescript
export interface LearningCenterPageProps {
  courses: Course[];
  progressData: LearningProgress[];
  onCourseSelect: (courseId: string) => void;
  className?: string;
}

export const LearningCenterPage: React.FC<LearningCenterPageProps> = ({
  courses,
  progressData,
  onCourseSelect,
  className = '',
}) => {
  return (
    <div className={`learning-center-page ${className}`}>
      <div className="progress-overview">
        <Typography variant="h5" gutterBottom>
          学习进度
        </Typography>
        {progressData.map((progress) => (
          <LearningProgress key={progress.courseId} {...progress} />
        ))}
      </div>
      
      <div className="course-list">
        <Typography variant="h5" gutterBottom>
          全部课程
        </Typography>
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => onCourseSelect(course.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 7.5 个人中心页面组件 (PersonalCenterPage)

```typescript
export interface PersonalCenterPageProps {
  user: User;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onLogout: () => void;
  className?: string;
}

export const PersonalCenterPage: React.FC<PersonalCenterPageProps> = ({
  user,
  settings,
  onSettingsChange,
  onLogout,
  className = '',
}) => {
  return (
    <div className={`personal-center-page ${className}`}>
      <UserProfileCard user={user} />
      
      <div className="settings-section">
        <Typography variant="h5" gutterBottom>
          设置
        </Typography>
        <SettingsForm settings={settings} onChange={onSettingsChange} />
      </div>
      
      <Button variant="danger" onClick={onLogout} fullWidth>
        退出登录
      </Button>
    </div>
  );
};
```

---

## 八、系统组件层

### 8.1 AI浮窗组件 (AIFloatingWindow)

```typescript
export interface AIFloatingWindowProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  expanded?: boolean;
  currentRole: AIRole;
  availableRoles: AIRole[];
  onRoleChange: (role: AIRole) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onVoiceInput?: () => void;
  onTextInput?: () => void;
  className?: string;
}

export interface AIRole {
  id: string;
  name: string;
  avatar: string;
  description: string;
  capabilities: string[];
}

export const ROLES: AIRole[] = [
  {
    id: 'xiaoyu',
    name: '沫语（小语）',
    avatar: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
    description: '温柔可爱的小女孩，1岁，射手座',
    capabilities: ['成长陪伴', '情感交流', '学习引导', '故事讲述'],
  },
  {
    id: 'xiaoyan',
    name: '沫言（小言）',
    avatar: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
    description: '活泼开朗的小男孩，10岁，天秤座',
    capabilities: ['学习辅导', '知识解答', '游戏互动', '成长记录'],
  },
];

export const getRoleById = (id: string): AIRole | undefined => {
  return ROLES.find(role => role.id === id);
};

export const getRoleByGender = (gender: 'boy' | 'girl'): AIRole | undefined => {
  if (gender === 'boy') {
    return ROLES.find(role => role.id === 'xiaoyan');
  }
  return ROLES.find(role => role.id === 'xiaoyu');
};

export const getRoleAvatarPath = (roleId: string, type: 'ai-avatar' | 'home' | 'profile' = 'ai-avatar'): string => {
  const role = getRoleById(roleId);
  if (!role) return '';
  
  const avatarPaths: Record<string, Record<string, string>> = {
    xiaoyu: {
      'ai-avatar': '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
      'home': '/role-photos/girl/home/girl-xiaoyu-home-001.png',
      'profile': '/role-photos/girl/profile/girl-xiaoyu-profile-001.png',
    },
    xiaoyan: {
      'ai-avatar': '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
      'home': '/role-photos/boy/home/boy-xiaoyan-home-001.png',
      'profile': '/role-photos/boy/profile/boy-xiaoyan-profile-001.png',
    },
  };
  
  return avatarPaths[roleId]?.[type] || role.avatar;
};

export const AIFloatingWindow: React.FC<AIFloatingWindowProps> = ({
  position = 'bottom-right',
  size = 'medium',
  expanded = false,
  currentRole,
  availableRoles,
  onRoleChange,
  onExpand,
  onCollapse,
  onVoiceInput,
  onTextInput,
  className = '',
}) => {
  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };
  
  const sizeStyles = {
    small: 'w-64 h-80',
    medium: 'w-80 h-96',
    large: 'w-96 h-[28rem]',
  };
  
  return (
    <div
      className={`fixed ${positionStyles[position]} ${expanded ? sizeStyles[size] : 'w-16 h-16'} bg-white rounded-2xl shadow-2xl transition-all duration-300 ${className}`}
    >
      {!expanded ? (
        <button
          onClick={onExpand}
          className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg hover:scale-110 transition-transform"
        >
          🤖
        </button>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img src={currentRole.avatar} alt={currentRole.name} className="w-10 h-10 rounded-full" />
              <div>
                <Typography variant="h6">{currentRole.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {currentRole.description}
                </Typography>
              </div>
            </div>
            <button onClick={onCollapse} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onRoleChange(role)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${role.id === currentRole.id ? 'bg-purple-50 border-2 border-purple-500' : 'hover:bg-gray-50'}`}
                >
                  <img src={role.avatar} alt={role.name} className="w-8 h-8 rounded-full" />
                  <div className="text-left">
                    <Typography variant="body1">{role.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {role.description}
                    </Typography>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t flex gap-2">
            <Button variant="primary" size="small" onClick={onVoiceInput} fullWidth>
              🎤 语音
            </Button>
            <Button variant="outline" size="small" onClick={onTextInput} fullWidth>
              💬 文字
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 8.2 全局导航组件 (GlobalNavigation)

```typescript
export interface GlobalNavigationProps {
  currentRoute: string;
  routes: NavigationRoute[];
  onRouteChange: (route: string) => void;
  className?: string;
}

export interface NavigationRoute {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  currentRoute,
  routes,
  onRouteChange,
  className = '',
}) => {
  return (
    <nav className={`global-navigation ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="logo">
            <Typography variant="h5" color="primary">
              YYC³-XY
            </Typography>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => onRouteChange(route.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentRoute === route.path ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>{route.icon}</span>
                <span>{route.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
```

### 8.3 主题切换组件 (ThemeSwitcher)

```typescript
export interface ThemeSwitcherProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  className = '',
}) => {
  return (
    <div className={`theme-switcher ${className}`}>
      <button
        onClick={() => onThemeChange('light')}
        className={`p-2 rounded-lg transition-colors ${currentTheme === 'light' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        ☀️
      </button>
      <button
        onClick={() => onThemeChange('dark')}
        className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        🌙
      </button>
    </div>
  );
};
```

### 8.4 权限控制组件 (PermissionControl)

```typescript
export interface PermissionControlProps {
  requiredPermissions: string[];
  userPermissions: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PermissionControl: React.FC<PermissionControlProps> = ({
  requiredPermissions,
  userPermissions,
  fallback,
  children,
  className = '',
}) => {
  const hasPermission = requiredPermissions.every(permission =>
    userPermissions.includes(permission)
  );
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <div className={className}>{children}</div>;
};
```

### 8.5 通知中心组件 (NotificationCenter)

```typescript
export interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface NotificationCenterProps {
  notifications: NotificationProps[];
  onMarkAsRead: (id: