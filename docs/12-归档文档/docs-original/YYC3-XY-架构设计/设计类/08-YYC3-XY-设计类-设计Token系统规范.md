# YYC3-XY-设计类-设计Token系统规范

> @file YYC3-XY-设计类-设计Token系统规范.md
> @description YYC³小语项目的设计Token系统完整规范，包含色彩、字体、间距、图标、动效、AI角色主题等所有设计Token定义
> @author YYC³
> @version 1.0.0
> @created 2025-01-30
> @updated 2025-01-30
> @status published
> @tags 设计Token,设计系统,YYC³,色彩系统,字体系统

---

## 目录

1. [概述](#概述)
2. [色彩系统](#色彩系统)
3. [字体系统](#字体系统)
4. [间距系统](#间距系统)
5. [圆角系统](#圆角系统)
6. [阴影系统](#阴影系统)
7. [图标系统](#图标系统)
8. [动效系统](#动效系统)
9. [AI角色主题系统](#ai角色主题系统)
10. [响应式断点系统](#响应式断点系统)
11. [Token命名规范](#token命名规范)
12. [Token使用指南](#token使用指南)

---

## 概述

### 1.1 设计Token定义

设计Token是设计系统的最小原子单位，用于描述设计决策的具体值。通过统一管理设计Token，可以确保整个产品的一致性，并便于维护和更新。

### 1.2 设计Token分类

YYC³小语项目的设计Token系统包含以下类别：

- **色彩Token**：定义所有颜色值
- **字体Token**：定义字体家族、大小、粗细等
- **间距Token**：定义间距和尺寸值
- **圆角Token**：定义圆角半径
- **阴影Token**：定义阴影效果
- **图标Token**：定义图标尺寸和样式
- **动效Token**：定义动画时长、缓动函数等
- **AI角色主题Token**：定义AI角色的专属主题色
- **响应式断点Token**：定义响应式设计的断点值

### 1.3 设计Token原则

- **原子性**：每个Token代表一个最小设计决策
- **可组合性**：Token可以组合使用形成复杂的设计
- **语义化**：Token名称应具有明确的语义
- **可维护性**：Token应易于维护和更新
- **可扩展性**：Token系统应支持未来扩展

---

## 色彩系统

### 2.1 色彩Token结构

YYC³小语项目的色彩系统采用分层结构：

```
色彩系统
├── 主色调
│   ├── primary (紫色系)
│   └── secondary (粉色系)
├── 中性色
│   └── gray (灰色系)
├── 语义色
│   ├── success (成功)
│   ├── warning (警告)
│   ├── error (错误)
│   └── info (信息)
└── AI角色主题色
    ├── companion (陪伴者)
    ├── recorder (记录者)
    ├── guardian (守护者)
    ├── listener (聆听者)
    └── advisor (建议者)
```

### 2.2 主色调

#### 2.2.1 Primary (紫色系)

紫色系是YYC³小语项目的主色调，代表智慧、创造力和科技感。

```css
:root {
  /* Primary - 紫色系 */
  --color-primary-50: #F5F3FF;
  --color-primary-100: #EDE9FE;
  --color-primary-200: #DDD6FE;
  --color-primary-300: #C4B5FD;
  --color-primary-400: #A78BFA;
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-primary-700: #6D28D9;
  --color-primary-800: #5B21B6;
  --color-primary-900: #4C1D95;
}
```

**使用场景**：
- `primary-500`：主要按钮、链接、强调元素
- `primary-600`：主要按钮悬停状态
- `primary-50` ~ `primary-100`：浅色背景
- `primary-700` ~ `primary-900`：深色文字、边框

#### 2.2.2 Secondary (粉色系)

粉色系是YYC³小语项目的辅助色调，代表温暖、友好和亲和力。

```css
:root {
  /* Secondary - 粉色系 */
  --color-secondary-50: #FDF2F8;
  --color-secondary-100: #FCE7F3;
  --color-secondary-200: #FBCFE8;
  --color-secondary-300: #F9A8D4;
  --color-secondary-400: #F472B6;
  --color-secondary-500: #EC4899;
  --color-secondary-600: #DB2777;
  --color-secondary-700: #BE185D;
  --color-secondary-800: #9D174D;
  --color-secondary-900: #831843;
}
```

**使用场景**：
- `secondary-500`：次要按钮、装饰元素
- `secondary-400`：高亮提示
- `secondary-50` ~ `secondary-100`：柔和背景
- `secondary-700` ~ `secondary-900`：深色装饰

### 2.3 中性色

```css
:root {
  /* Neutral - 灰色系 */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
}
```

**使用场景**：
- `gray-50` ~ `gray-100`：页面背景、卡片背景
- `gray-200` ~ `gray-300`：边框、分割线
- `gray-400` ~ `gray-500`：次要文字、图标
- `gray-600` ~ `gray-700`：主要文字
- `gray-800` ~ `gray-900`：标题、强调文字

### 2.4 语义色

```css
:root {
  /* Success - 成功 */
  --color-success-50: #ECFDF5;
  --color-success-100: #D1FAE5;
  --color-success-200: #A7F3D0;
  --color-success-300: #6EE7B7;
  --color-success-400: #34D399;
  --color-success-500: #10B981;
  --color-success-600: #059669;
  --color-success-700: #047857;
  --color-success-800: #065F46;
  --color-success-900: #064E3B;

  /* Warning - 警告 */
  --color-warning-50: #FFFBEB;
  --color-warning-100: #FEF3C7;
  --color-warning-200: #FDE68A;
  --color-warning-300: #FCD34D;
  --color-warning-400: #FBBF24;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;
  --color-warning-700: #B45309;
  --color-warning-800: #92400E;
  --color-warning-900: #78350F;

  /* Error - 错误 */
  --color-error-50: #FEF2F2;
  --color-error-100: #FEE2E2;
  --color-error-200: #FECACA;
  --color-error-300: #FCA5A5;
  --color-error-400: #F87171;
  --color-error-500: #EF4444;
  --color-error-600: #DC2626;
  --color-error-700: #B91C1C;
  --color-error-800: #991B1B;
  --color-error-900: #7F1D1D;

  /* Info - 信息 */
  --color-info-50: #EFF6FF;
  --color-info-100: #DBEAFE;
  --color-info-200: #BFDBFE;
  --color-info-300: #93C5FD;
  --color-info-400: #60A5FA;
  --color-info-500: #3B82F6;
  --color-info-600: #2563EB;
  --color-info-700: #1D4ED8;
  --color-info-800: #1E40AF;
  --color-info-900: #1E3A8A;
}
```

**使用场景**：
- `success`：成功状态、完成提示
- `warning`：警告提示、注意事项
- `error`：错误状态、失败提示
- `info`：信息提示、帮助说明

### 2.5 AI角色主题色

```css
:root {
  /* Companion - 陪伴者 */
  --color-companion-primary: #FF4D6D;
  --color-companion-gradient: linear-gradient(135deg, #FF4D6D, #FF758F);
  --color-companion-secondary: #FFB3C1;
  --color-companion-bg: #FFF0F3;
  --color-companion-text: #8B1E3D;

  /* Recorder - 记录者 */
  --color-recorder-primary: #4D96FF;
  --color-recorder-gradient: linear-gradient(135deg, #4D96FF, #6BA3FF);
  --color-recorder-secondary: #A3C2FF;
  --color-recorder-bg: #F0F7FF;
  --color-recorder-text: #1E3A8A;

  /* Guardian - 守护者 */
  --color-guardian-primary: #10B981;
  --color-guardian-gradient: linear-gradient(135deg, #10B981, #34D399);
  --color-guardian-secondary: #6EE7B7;
  --color-guardian-bg: #ECFDF5;
  --color-guardian-text: #064E3B;

  /* Listener - 聆听者 */
  --color-listener-primary: #8B5CF6;
  --color-listener-gradient: linear-gradient(135deg, #8B5CF6, #A78BFA);
  --color-listener-secondary: #C4B5FD;
  --color-listener-bg: #F5F3FF;
  --color-listener-text: #4C1D95;

  /* Advisor - 建议者 */
  --color-advisor-primary: #F59E0B;
  --color-advisor-gradient: linear-gradient(135deg, #F59E0B, #FBBF24);
  --color-advisor-secondary: #FCD34D;
  --color-advisor-bg: #FFFBEB;
  --color-advisor-text: #78350F;
}
```

**使用场景**：
- AI角色专属UI组件
- AI角色相关页面主题
- AI角色状态指示
- AI角色交互反馈

---

## 字体系统

### 3.1 字体家族

```css
:root {
  /* 字体家族 */
  --font-family-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-family-serif: 'Noto Serif SC', 'Songti SC', serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

**使用场景**：
- `font-family-sans`：正文、标题、UI元素
- `font-family-serif`：特殊标题、引用
- `font-family-mono`：代码、数字、技术内容

### 3.2 字体大小

```css
:root {
  /* 字体大小 */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
}
```

**使用场景**：
- `font-size-xs`：辅助文字、标签
- `font-size-sm`：次要文字、说明
- `font-size-base`：正文、默认文字
- `font-size-lg`：强调文字、小标题
- `font-size-xl`：二级标题
- `font-size-2xl`：一级标题
- `font-size-3xl` ~ `font-size-6xl`：大标题、展示文字

### 3.3 字体粗细

```css
:root {
  /* 字体粗细 */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

**使用场景**：
- `font-weight-light`：装饰性文字
- `font-weight-normal`：正文
- `font-weight-medium`：强调文字
- `font-weight-semibold`：小标题
- `font-weight-bold`：标题
- `font-weight-extrabold`：大标题

### 3.4 行高

```css
:root {
  /* 行高 */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
}
```

**使用场景**：
- `line-height-none`：单行文字
- `line-height-tight`：大标题
- `line-height-snug`：小标题
- `line-height-normal`：正文
- `line-height-relaxed`：长段落
- `line-height-loose`：特殊排版

### 3.5 字间距

```css
:root {
  /* 字间距 */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

**使用场景**：
- `letter-spacing-tighter` ~ `letter-spacing-tight`：大标题
- `letter-spacing-normal`：正文
- `letter-spacing-wide` ~ `letter-spacing-widest`：小标题、标签

---

## 间距系统

### 4.1 间距Token

```css
:root {
  /* 间距 */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0_5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1_5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-2_5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-3_5: 0.875rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-14: 3.5rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-28: 7rem;
  --spacing-32: 8rem;
  --spacing-36: 9rem;
  --spacing-40: 10rem;
  --spacing-44: 11rem;
  --spacing-48: 12rem;
  --spacing-52: 13rem;
  --spacing-56: 14rem;
  --spacing-60: 15rem;
  --spacing-64: 16rem;
  --spacing-72: 18rem;
  --spacing-80: 20rem;
  --spacing-96: 24rem;
}
```

**使用场景**：
- `spacing-0` ~ `spacing-2`：紧凑间距
- `spacing-3` ~ `spacing-6`：常规间距
- `spacing-8` ~ `spacing-12`：宽松间距
- `spacing-16` ~ `spacing-24`：大间距
- `spacing-32` ~ `spacing-96`：超大间距

---

## 圆角系统

### 5.1 圆角Token

```css
:root {
  /* 圆角 */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}
```

**使用场景**：
- `radius-none`：无圆角
- `radius-sm` ~ `radius-base`：小圆角
- `radius-md` ~ `radius-lg`：常规圆角
- `radius-xl` ~ `radius-2xl`：大圆角
- `radius-3xl`：超大圆角
- `radius-full`：圆形

---

## 阴影系统

### 6.1 阴影Token

```css
:root {
  /* 阴影 */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-2xl: 0 50px 100px -20px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
```

**使用场景**：
- `shadow-xs` ~ `shadow-sm`：轻微阴影
- `shadow-base` ~ `shadow-md`：常规阴影
- `shadow-lg` ~ `shadow-xl`：大阴影
- `shadow-2xl`：超大阴影
- `shadow-inner`：内阴影

---

## 图标系统

### 7.1 图标尺寸

```css
:root {
  /* 图标尺寸 */
  --icon-size-xs: 0.75rem;
  --icon-size-sm: 1rem;
  --icon-size-base: 1.25rem;
  --icon-size-lg: 1.5rem;
  --icon-size-xl: 1.75rem;
  --icon-size-2xl: 2rem;
  --icon-size-3xl: 2.5rem;
  --icon-size-4xl: 3rem;
  --icon-size-5xl: 3.5rem;
  --icon-size-6xl: 4rem;
}
```

**使用场景**：
- `icon-size-xs` ~ `icon-size-sm`：小图标
- `icon-size-base` ~ `icon-size-lg`：常规图标
- `icon-size-xl` ~ `icon-size-2xl`：大图标
- `icon-size-3xl` ~ `icon-size-6xl`：超大图标

---

## 动效系统

### 8.1 动画时长

```css
:root {
  /* 动画时长 */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  --duration-slowest: 1000ms;
}
```

**使用场景**：
- `duration-instant`：即时反馈
- `duration-fast`：快速动画
- `duration-base`：常规动画
- `duration-slow` ~ `duration-slower`：慢速动画
- `duration-slowest`：超慢速动画

### 8.2 缓动函数

```css
:root {
  /* 缓动函数 */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
```

**使用场景**：
- `ease-linear`：线性动画
- `ease-in`：加速动画
- `ease-out`：减速动画
- `ease-in-out`：先加速后减速
- `ease-bounce`：弹跳效果
- `ease-elastic`：弹性效果

---

## AI角色主题系统

### 9.1 角色主题配置

#### 9.1.1 陪伴者 (Companion)

```typescript
interface CompanionTheme {
  colors: {
    primary: string;
    gradient: string;
    secondary: string;
    bg: string;
    text: string;
  };
  personality: {
    traits: string[];
    description: string;
  };
  expressions: {
    greeting: string;
    celebration: string;
    encouragement: string;
    comfort: string;
    thinking: string;
    listening: string;
  };
}

const companionTheme: CompanionTheme = {
  colors: {
    primary: '#FF4D6D',
    gradient: 'linear-gradient(135deg, #FF4D6D, #FF758F)',
    secondary: '#FFB3C1',
    bg: '#FFF0F3',
    text: '#8B1E3D'
  },
  personality: {
    traits: ['温暖', '友好', '陪伴', '关怀'],
    description: '陪伴者是一个温暖友好的AI角色，时刻陪伴在用户身边，提供关怀和支持。'
  },
  expressions: {
    greeting: '微笑问候',
    celebration: '欢呼庆祝',
    encouragement: '鼓励加油',
    comfort: '温柔安慰',
    thinking: '认真思考',
    listening: '专注聆听'
  }
};
```

#### 9.1.2 记录者 (Recorder)

```typescript
interface RecorderTheme {
  colors: {
    primary: string;
    gradient: string;
    secondary: string;
    bg: string;
    text: string;
  };
  personality: {
    traits: string[];
    description: string;
  };
  expressions: {
    greeting: string;
    celebration: string;
    encouragement: string;
    comfort: string;
    thinking: string;
    listening: string;
  };
}

const recorderTheme: RecorderTheme = {
  colors: {
    primary: '#4D96FF',
    gradient: 'linear-gradient(135deg, #4D96FF, #6BA3FF)',
    secondary: '#A3C2FF',
    bg: '#F0F7FF',
    text: '#1E3A8A'
  },
  personality: {
    traits: ['记录', '整理', '分析', '总结'],
    description: '记录者是一个善于整理和分析的AI角色，帮助用户记录和整理信息。'
  },
  expressions: {
    greeting: '礼貌问候',
    celebration: '记录成就',
    encouragement: '鼓励记录',
    comfort: '理解支持',
    thinking: '分析思考',
    listening: '认真记录'
  }
};
```

#### 9.1.3 守护者 (Guardian)

```typescript
interface GuardianTheme {
  colors: {
    primary: string;
    gradient: string;
    secondary: string;
    bg: string;
    text: string;
  };
  personality: {
    traits: string[];
    description: string;
  };
  expressions: {
    greeting: string;
    celebration: string;
    encouragement: string;
    comfort: string;
    thinking: string;
    listening: string;
  };
}

const guardianTheme: GuardianTheme = {
  colors: {
    primary: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    secondary: '#6EE7B7',
    bg: '#ECFDF5',
    text: '#064E3B'
  },
  personality: {
    traits: ['保护', '安全', '可靠', '稳定'],
    description: '守护者是一个可靠稳定的AI角色，保护用户的安全和隐私。'
  },
  expressions: {
    greeting: '可靠问候',
    celebration: '安全庆祝',
    encouragement: '安全鼓励',
    comfort: '稳定安慰',
    thinking: '安全思考',
    listening: '保护聆听'
  }
};
```

#### 9.1.4 聆听者 (Listener)

```typescript
interface ListenerTheme {
  colors: {
    primary: string;
    gradient: string;
    secondary: string;
    bg: string;
    text: string;
  };
  personality: {
    traits: string[];
    description: string;
  };
  expressions: {
    greeting: string;
    celebration: string;
    encouragement: string;
    comfort: string;
    thinking: string;
    listening: string;
  };
}

const listenerTheme: ListenerTheme = {
  colors: {
    primary: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    secondary: '#C4B5FD',
    bg: '#F5F3FF',
    text: '#4C1D95'
  },
  personality: {
    traits: ['聆听', '理解', '共情', '支持'],
    description: '聆听者是一个善于理解和共情的AI角色，认真聆听用户的心声。'
  },
  expressions: {
    greeting: '温暖问候',
    celebration: '共情庆祝',
    encouragement: '理解鼓励',
    comfort: '共情安慰',
    thinking: '理解思考',
    listening: '专注聆听'
  }
};
```

#### 9.1.5 建议者 (Advisor)

```typescript
interface AdvisorTheme {
  colors: {
    primary: string;
    gradient: string;
    secondary: string;
    bg: string;
    text: string;
  };
  personality: {
    traits: string[];
    description: string;
  };
  expressions: {
    greeting: string;
    celebration: string;
    encouragement: string;
    comfort: string;
    thinking: string;
    listening: string;
  };
}

const advisorTheme: AdvisorTheme = {
  colors: {
    primary: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    secondary: '#FCD34D',
    bg: '#FFFBEB',
    text: '#78350F'
  },
  personality: {
    traits: ['建议', '指导', '智慧', '启发'],
    description: '建议者是一个智慧启发的AI角色，为用户提供专业的建议和指导。'
  },
  expressions: {
    greeting: '智慧问候',
    celebration: '智慧庆祝',
    encouragement: '启发鼓励',
    comfort: '智慧安慰',
    thinking: '智慧思考',
    listening: '专注聆听'
  }
};
```

---

## 响应式断点系统

### 10.1 断点定义

```css
:root {
  /* 响应式断点 */
  --breakpoint-xs: 0;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 10.2 设备分类

| 断点 | 设备类型 | 屏幕宽度 | 使用场景 |
|------|---------|---------|---------|
| `xs` | 超小屏 | < 640px | 小型手机 |
| `sm` | 小屏 | ≥ 640px | 大型手机 |
| `md` | 中屏 | ≥ 768px | 平板电脑 |
| `lg` | 大屏 | ≥ 1024px | 小型笔记本 |
| `xl` | 超大屏 | ≥ 1280px | 桌面显示器 |
| `2xl` | 超超大屏 | ≥ 1536px | 大型显示器 |

### 10.3 媒体查询示例

```css
/* 小屏设备 */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

/* 中屏设备 */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

/* 大屏设备 */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

/* 超大屏设备 */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* 超超大屏设备 */
@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
```

---

## Token命名规范

### 11.1 命名原则

- **语义化**：Token名称应具有明确的语义
- **一致性**：同类Token使用相同的命名模式
- **可读性**：使用连字符分隔单词
- **简洁性**：避免过长的Token名称

### 11.2 命名模式

#### 11.2.1 色彩Token

```css
/* 基础色彩 */
--color-{color}-{shade}

/* 示例 */
--color-primary-500
--color-secondary-300
--color-gray-700
--color-success-500
```

#### 11.2.2 字体Token

```css
/* 字体家族 */
--font-family-{type}

/* 字体大小 */
--font-size-{size}

/* 字体粗细 */
--font-weight-{weight}

/* 行高 */
--line-height-{height}

/* 字间距 */
--letter-spacing-{spacing}

/* 示例 */
--font-family-sans
--font-size-base
--font-weight-medium
--line-height-normal
--letter-spacing-wide
```

#### 11.2.3 间距Token

```css
--spacing-{size}

/* 示例 */
--spacing-4
--spacing-8
--spacing-12
```

#### 11.2.4 圆角Token

```css
--radius-{size}

/* 示例 */
--radius-base
--radius-lg
--radius-full
```

#### 11.2.5 阴影Token

```css
--shadow-{size}

/* 示例 */
--shadow-sm
--shadow-md
--shadow-lg
```

#### 11.2.6 图标Token

```css
--icon-size-{size}

/* 示例 */
--icon-size-base
--icon-size-lg
--icon-size-xl
```

#### 11.2.7 动效Token

```css
/* 动画时长 */
--duration-{speed}

/* 缓动函数 */
--ease-{type}

/* 示例 */
--duration-base
--duration-fast
--ease-in-out
--ease-bounce
```

---

## Token使用指南

### 12.1 CSS变量使用

```css
/* 在CSS中使用设计Token */
.button {
  background-color: var(--color-primary-500);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-in-out);
}

.button:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}
```

### 12.2 JavaScript使用

```javascript
// 在JavaScript中使用设计Token
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary-500')
  .trim();

const fontSize = getComputedStyle(document.documentElement)
  .getPropertyValue('--font-size-base')
  .trim();
```

### 12.3 React使用

```jsx
// 在React中使用设计Token
import React from 'react';

const Button = ({ children }) => {
  return (
    <button
      style={{
        backgroundColor: 'var(--color-primary-500)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-3) var(--spacing-6)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-medium)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--duration-fast) var(--ease-in-out)'
      }}
    >
      {children}
    </button>
  );
};
```

### 12.4 TypeScript使用

```typescript
// 定义设计Token类型
export type ColorToken = `--color-${string}-${number}`;
export type FontSizeToken = `--font-size-${string}`;
export type SpacingToken = `--spacing-${number}`;

// 使用设计Token
const buttonStyles = {
  backgroundColor: 'var(--color-primary-500)' as ColorToken,
  padding: 'var(--spacing-3) var(--spacing-6)' as `${SpacingToken} ${SpacingToken}`,
  fontSize: 'var(--font-size-base)' as FontSizeToken
};
```

### 12.5 最佳实践

1. **优先使用设计Token**：避免硬编码颜色、间距等值
2. **保持一致性**：在相同场景使用相同的Token
3. **语义化命名**：使用具有语义的Token名称
4. **定期审查**：定期审查和更新设计Token
5. **文档化**：为自定义Token编写文档
6. **版本控制**：对设计Token进行版本控制

---

## 附录

### A. 设计Token映射表

| Token类型 | Token名称 | 值 | 用途 |
|-----------|-----------|---|------|
| 色彩 | `--color-primary-500` | `#8B5CF6` | 主色调 |
| 字体 | `--font-size-base` | `1rem` | 基础字体大小 |
| 间距 | `--spacing-4` | `1rem` | 基础间距 |
| 圆角 | `--radius-md` | `0.375rem` | 中等圆角 |
| 阴影 | `--shadow-md` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | 中等阴影 |
| 动效 | `--duration-base` | `300ms` | 基础动画时长 |

### B. 相关文档

- [UI-UX全链路Figma设计指导方案](./01-YYC3-XY-设计类-UI-UX全链路Figma设计指导方案.md)
- [UI-UX全量设计体系整合文档](./04-YYC3-XY-架构类-UI-UX全量设计体系整合文档.md)
- [移动端响应式设计指南](./03-YYC3-XY-设计类-移动端响应式设计指南.md)
- [AI角色与浮窗系统设计衔接方案](./07-YYC3-XY-AI角色与浮窗系统设计衔接方案.md)

---

<div align="center">

> 「***智能插拔式移动AI系统***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
> **GitHub**: <https://github.com/YY-Nexus/yyc3-xy-05> | **官网**: <https://yyc3.ai>

</div>
