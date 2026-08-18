/**
 * @file YYC3-XY-AI角色与浮窗系统设计衔接方案
 * @description 本文档详细说明了AI角色系统、角色信息管理与浮窗UI组件的衔接设计方案，为Figma设计提供完整的技术规范和实现指导
 * @module YYC3-XY-架构类
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @updated 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

# YYC3-XY-AI角色与浮窗系统设计衔接方案

> 本文档作为《YYC3-XY-UI-UX全链路Figma设计指导方案》的补充文档，详细说明AI角色系统、角色信息管理与浮窗UI组件的衔接设计方案，为Figma设计提供完整的技术规范和实现指导。

---

## 📋 文档概述

### 1.1 文档目的

本文档旨在：

- **衔接AI角色系统与UI设计**：将AI角色定义、角色信息管理与Figma设计指南中的UI组件系统进行无缝衔接
- **统一设计规范**：确保AI角色相关的UI组件遵循YYC³「五高五标五化」设计原则
- **提供实现指导**：为设计师和开发者提供详细的组件设计规范和交互模式说明
- **确保一致性**：保证AI角色系统在所有页面和组件中的视觉和交互一致性

### 1.2 适用范围

本文档适用于以下场景：

- AI角色信息管理界面设计
- AI浮窗组件设计
- 角色切换交互设计
- 角色主题色彩应用
- AI角色图标和头像设计

### 1.3 与Figma设计指南的关系

本文档是《YYC3-XY-UI-UX全链路Figma设计指导方案》的补充文档，主要针对以下方面进行详细说明：

- **系统组件层扩展**：在Figma设计指南的系统组件层基础上，增加AI角色相关的UI组件
- **主题色彩系统**：扩展色彩系统，增加五大AI角色的主题色定义
- **交互模式**：定义AI角色切换、浮窗展开/收起等交互模式
- **数据映射**：说明角色信息数据结构与UI组件的映射关系

---

## 🎨 AI角色视觉设计规范

### 2.1 五大AI角色定义

根据项目中的角色定义，AI小语系统包含五大核心角色：

| 角色ID | 角色名称 | 角色描述 | 主要功能 | 图标 |
|--------|----------|----------|----------|------|
| `companion` | 陪伴者 | 日常陪伴、情感支持 | 情感支持、温暖互动、情感慰藉 | `ri-user-heart-line` |
| `recorder` | 记录者 | 自动记录成长事件 | 成长事件记录、里程碑识别、数据整理 | `ri-camera-line` |
| `guardian` | 守护者 | 健康安全、发展评估 | 健康监测、安全防护、发展评估 | `ri-shield-check-line` |
| `listener` | 聆听者 | 情绪识别、心理分析 | 情绪识别、心理分析、共情理解 | `ri-ear-line` |
| `advisor` | 建议者 | 成长建议、教育指导 | 成长建议、教育指导、个性化方案 | `ri-lightbulb-line` |

### 2.2 角色主题色彩系统

#### 2.2.1 色彩定义

每个AI角色都有专属的主题色彩，用于在UI中区分不同角色：

```css
/* 角色主题色定义 */
:root {
  /* 陪伴者 - Companion */
  --companion-primary: #FF4D6D;
  --companion-gradient: linear-gradient(135deg, #FF4D6D, #FF758F);
  --companion-secondary: #FFB3C1;
  --companion-bg: #FFF0F3;
  --companion-text: #8B1E3D;
  
  /* 记录者 - Recorder */
  --recorder-primary: #4D96FF;
  --recorder-gradient: linear-gradient(135deg, #4D96FF, #6BA3FF);
  --recorder-secondary: #A3C2FF;
  --recorder-bg: #F0F7FF;
  --recorder-text: #1E3A8A;
  
  /* 守护者 - Guardian */
  --guardian-primary: #10B981;
  --guardian-gradient: linear-gradient(135deg, #10B981, #34D399);
  --guardian-secondary: #6EE7B7;
  --guardian-bg: #ECFDF5;
  --guardian-text: #064E3B;
  
  /* 聆听者 - Listener */
  --listener-primary: #8B5CF6;
  --listener-gradient: linear-gradient(135deg, #8B5CF6, #A78BFA);
  --listener-secondary: #C4B5FD;
  --listener-bg: #F5F3FF;
  --listener-text: #4C1D95;
  
  /* 建议者 - Advisor */
  --advisor-primary: #F59E0B;
  --advisor-gradient: linear-gradient(135deg, #F59E0B, #FBBF24);
  --advisor-secondary: #FCD34D;
  --advisor-bg: #FFFBEB;
  --advisor-text: #78350F;
}
```

#### 2.2.2 色彩应用规范

**主题色应用规则：**

1. **主色（Primary）**：用于角色标识、主要按钮、图标填充
2. **渐变色（Gradient）**：用于角色头像背景、浮窗头部、重要提示
3. **辅助色（Secondary）**：用于次级按钮、装饰元素、标签
4. **背景色（Background）**：用于角色相关卡片、面板背景
5. **文本色（Text）**：用于角色相关文本、说明文字

**Figma设计实现：**

```
在Figma中创建以下色彩变量：
- Colors/Companion/Primary: #FF4D6D
- Colors/Companion/Gradient: 渐变 #FF4D6D → #FF758F
- Colors/Companion/Secondary: #FFB3C1
- Colors/Companion/Background: #FFF0F3
- Colors/Companion/Text: #8B1E3D

（其他角色同理）
```

### 2.3 角色图标设计规范

#### 2.3.1 图标选择

使用Remix Icon图标库中的以下图标：

| 角色 | 图标名称 | 图标代码 |
|------|----------|----------|
| 陪伴者 | User Heart | `ri-user-heart-line` |
| 记录者 | Camera | `ri-camera-line` |
| 守护者 | Shield Check | `ri-shield-check-line` |
| 聆听者 | Ear | `ri-ear-line` |
| 建议者 | Lightbulb | `ri-lightbulb-line` |

#### 2.3.2 图标样式规范

**图标尺寸：**

- **小图标**：16px × 16px（用于列表、标签）
- **中图标**：24px × 24px（用于按钮、导航）
- **大图标**：32px × 32px（用于角色选择器）
- **超大图标**：48px × 48px（用于浮窗头部）

**图标颜色：**

- **默认状态**：使用角色主色（`--{role}-primary`）
- **悬停状态**：使用角色渐变色（`--{role}-gradient`）
- **激活状态**：使用角色辅助色（`--{role}-secondary`）
- **禁用状态**：使用灰色（`#9CA3AF`）

**Figma设计实现：**

```
创建图标组件：
- Components/Icons/AI/CompanionIcon
- Components/Icons/AI/RecorderIcon
- Components/Icons/AI/GuardianIcon
- Components/Icons/AI/ListenerIcon
- Components/Icons/AI/AdvisorIcon

每个图标组件包含以下变体：
- Size: small | medium | large | xlarge
- State: default | hover | active | disabled
```

### 2.4 角色头像设计规范

#### 2.4.1 头像类型

根据角色信息管理器中的定义，角色头像包含以下类型：

| 头像类型 | 用途 | 尺寸 | 圆角 |
|----------|------|------|------|
| `default` | 默认头像 | 64px × 64px | 50% |
| `aiFloating` | AI浮窗头像 | 48px × 48px | 50% |
| `growth` | 成长记录头像 | 80px × 80px | 50% |
| `settings` | 设置页面头像 | 96px × 96px | 50% |

#### 2.4.2 头像设计规范

**默认头像设计：**

- **背景**：使用角色渐变色（`--{role}-gradient`）
- **图标**：使用白色（#FFFFFF）的角色图标
- **尺寸**：根据头像类型调整
- **圆角**：完全圆形（50%）

**表情头像设计：**

- **基础头像**：使用默认头像作为基础
- **表情叠加**：在头像右下角添加表情图标
- **表情尺寸**：头像尺寸的30%
- **表情背景**：白色圆形背景
- **表情颜色**：根据表情类型使用不同颜色

**Figma设计实现：**

```
创建头像组件：
- Components/Avatars/AI/DefaultAvatar
- Components/Avatars/AI/AIFloatingAvatar
- Components/Avatars/AI/GrowthAvatar
- Components/Avatars/AI/SettingsAvatar
- Components/Avatars/AI/ExpressionAvatar

每个头像组件包含以下属性：
- Role: companion | recorder | guardian | listener | advisor
- Expression: happy | sad | excited | calm | thinking | none
- Size: small | medium | large | xlarge
```

---

## 🖼️ AI浮窗UI组件设计

### 3.1 浮窗组件概述

AI浮窗是系统中的核心交互组件，提供全局语音和文本交互入口。浮窗支持多种状态和交互模式。

### 3.2 浮窗状态设计

#### 3.2.1 状态定义

浮窗包含以下状态：

| 状态 | 描述 | 尺寸 | 位置 | 可见元素 |
|------|------|------|------|----------|
| `minimized` | 最小化状态 | 60px × 60px | 固定位置 | Logo头像、通知徽章 |
| `expanded` | 展开状态 | 300px × 400px | 可拖拽 | 头部、对话内容、输入区域 |
| `fullscreen` | 全屏状态 | 全屏 | 固定位置 | 完整对话界面、工具栏 |

#### 3.2.2 状态转换

**状态转换规则：**

1. **最小化 → 展开**：点击Logo头像
2. **展开 → 最小化**：点击收起按钮或点击外部区域
3. **展开 → 全屏**：点击全屏按钮
4. **全屏 → 展开**：点击退出全屏按钮
5. **拖拽**：在展开状态下可自由拖拽位置

**Figma设计实现：**

```
创建浮窗组件：
- Components/AI/AIFloatingWindow

组件包含以下变体：
- State: minimized | expanded | fullscreen
- Position: bottom-right | bottom-left | top-right | top-left | custom
- Role: companion | recorder | guardian | listener | advisor

创建状态转换原型：
- Prototype: Minimized → Expanded (Click on Logo)
- Prototype: Expanded → Minimized (Click on Collapse Button)
- Prototype: Expanded → Fullscreen (Click on Fullscreen Button)
- Prototype: Fullscreen → Expanded (Click on Exit Fullscreen Button)
```

### 3.3 浮窗布局设计

#### 3.3.1 最小化状态布局

**布局结构：**

```
┌─────────────────┐
│                 │
│    [Logo头像]    │  60px × 60px
│                 │
│   [通知徽章]     │  右上角，20px × 20px
└─────────────────┘
```

**设计规范：**

- **Logo头像**：使用当前角色的AI浮窗头像（48px × 48px）
- **通知徽章**：红色圆形背景，白色数字，显示未读消息数量
- **位置**：默认固定在右下角（距离底部24px，距离右侧24px）
- **动画**：呼吸动画效果（3秒循环，缩放1.0 → 1.05 → 1.0）

#### 3.3.2 展开状态布局

**布局结构：**

```
┌─────────────────────────┐
│ [头像] AI小语  [收起][设置] │  头部（48px高）
├─────────────────────────┤
│                         │
│   对话内容区域           │  内容区（280px高）
│   - 历史消息             │
│   - 当前回复             │
│                         │
├─────────────────────────┤
│ [输入框] [语音][发送]    │  输入区（72px高）
└─────────────────────────┘
```

**设计规范：**

- **头部**（48px高）：
  - 左侧：当前角色头像（32px × 32px）+ 角色名称
  - 右侧：收起按钮 + 设置按钮
  - 背景：使用当前角色渐变色
  - 文本：白色

- **对话内容区**（280px高）：
  - 背景色：白色（#FFFFFF）
  - 消息气泡：用户消息（右侧，蓝色），AI消息（左侧，灰色）
  - 滚动：支持垂直滚动
  - 动画：新消息淡入效果

- **输入区**（72px高）：
  - 输入框：左侧，占满剩余空间
  - 语音按钮：圆形，使用当前角色主色
  - 发送按钮：圆形，使用当前角色主色
  - 背景：浅灰色（#F3F4F6）

#### 3.3.3 全屏状态布局

**布局结构：**

```
┌─────────────────────────────────┐
│ [返回] AI小语 - [角色名] [设置] │  顶部导航栏（56px高）
├─────────────────────────────────┤
│                                 │
│                                 │
│        对话内容区域              │  内容区（自适应）
│        - 历史消息                │
│        - 当前回复                │
│                                 │
│                                 │
├─────────────────────────────────┤
│ [输入框] [语音][发送][工具]      │  底部输入区（80px高）
└─────────────────────────────────┘
```

**设计规范：**

- **顶部导航栏**（56px高）：
  - 左侧：返回按钮 + AI小语标题 + 当前角色名称
  - 右侧：设置按钮
  - 背景：使用当前角色渐变色
  - 文本：白色

- **对话内容区**（自适应）：
  - 背景色：白色（#FFFFFF）
  - 消息气泡：同展开状态
  - 滚动：支持垂直滚动
  - 动画：新消息淡入效果

- **底部输入区**（80px高）：
  - 输入框：左侧，占满剩余空间
  - 语音按钮：圆形，使用当前角色主色
  - 发送按钮：圆形，使用当前角色主色
  - 工具按钮：圆形，显示更多工具选项
  - 背景：浅灰色（#F3F4F6）

### 3.4 浮窗角色切换设计

#### 3.4.1 角色切换入口

角色切换可以通过以下方式触发：

1. **头部点击**：点击浮窗头部的角色名称
2. **设置菜单**：在设置菜单中选择"切换角色"
3. **快捷键**：使用快捷键（如Cmd/Ctrl + R）打开角色切换面板

#### 3.4.2 角色切换面板

**面板布局：**

```
┌─────────────────────────┐
│   选择AI角色             │
├─────────────────────────┤
│ [陪伴者] 日常陪伴、情感支持 │
│ [记录者] 自动记录成长事件 │
│ [守护者] 健康安全、发展评估 │
│ [聆听者] 情绪识别、心理分析 │
│ [建议者] 成长建议、教育指导 │
└─────────────────────────┘
```

**设计规范：**

- **面板尺寸**：320px × 280px
- **背景**：白色（#FFFFFF），圆角12px，阴影
- **标题**：居中，16px，加粗，深灰色（#1F2937）
- **角色选项**：
  - 每个选项包含：角色图标（左侧）+ 角色名称 + 角色描述
  - 高度：48px
  - 背景：白色（#FFFFFF）
  - 悬停：浅灰色（#F3F4F6）
  - 激活：使用当前角色背景色（`--{role}-bg`）
  - 图标：使用角色主色（`--{role}-primary`）
  - 角色名称：14px，加粗，深灰色（#1F2937）
  - 角色描述：12px，浅灰色（#6B7280）

**Figma设计实现：**

```
创建角色切换面板组件：
- Components/AI/RoleSwitchPanel

组件包含以下属性：
- CurrentRole: companion | recorder | guardian | listener | advisor
- AvailableRoles: AIRole[]
- OnRoleChange: (role: AIRole) => void

创建角色选项组件：
- Components/AI/RoleOption

组件包含以下变体：
- Role: companion | recorder | guardian | listener | advisor
- State: default | hover | active | disabled
```

#### 3.4.3 角色切换动画

**动画效果：**

1. **浮窗颜色渐变**：从旧角色主题色渐变到新角色主题色（300ms）
2. **头像切换**：旧头像淡出（150ms）→ 新头像淡入（150ms）
3. **图标切换**：旧图标缩小消失（200ms）→ 新图标放大出现（200ms）
4. **文字切换**：旧文字淡出（150ms）→ 新文字淡入（150ms）

**Figma设计实现：**

```
创建角色切换动画原型：
- Smart Animate: Color Transition (300ms, Ease Out)
- Smart Animate: Avatar Fade Out/In (150ms each, Ease In Out)
- Smart Animate: Icon Scale Out/In (200ms each, Ease Out Back)
- Smart Animate: Text Fade Out/In (150ms each, Ease In Out)
```

---

## 📊 角色信息管理UI设计

### 4.1 角色信息管理器概述

角色信息管理器是管理孩子角色信息（男孩/女孩）的核心组件，提供角色信息的查看、编辑、同步和验证功能。

### 4.2 角色信息管理器布局

#### 4.2.1 整体布局

**布局结构：**

```
┌─────────────────────────────────────┐
│   角色信息管理器                      │
├─────────────────────────────────────┤
│                                     │
│  [男孩头像]  [女孩头像]              │  角色选择
│                                     │
│  角色名称：[男孩]                    │  基本信息
│  性别：男                            │
│  年龄：5岁                           │
│  生日：2020-01-01                    │
│                                     │
│  AI角色：陪伴者                      │  AI角色配置
│  主题：默认主题                      │
│  头像：默认头像                      │
│                                     │
│  [同步] [验证] [编辑] [保存]         │  操作按钮
│                                     │
└─────────────────────────────────────┘
```

#### 4.2.2 设计规范

- **面板尺寸**：480px × 600px
- **背景**：白色（#FFFFFF），圆角16px，阴影
- **标题**：居中，20px，加粗，深灰色（#1F2937）
- **角色选择**：
  - 两个角色头像并排显示（80px × 80px）
  - 当前选中角色有蓝色边框（2px，#3B82F6）
  - 点击切换角色
- **基本信息**：
  - 标签：14px，深灰色（#1F2937）
  - 值：14px，浅灰色（#6B7280）
  - 布局：两列网格
- **AI角色配置**：
  - 当前AI角色显示（使用角色图标和名称）
  - 点击可打开AI角色切换面板
  - 主题选择使用下拉菜单
  - 头像选择使用头像选择器
- **操作按钮**：
  - 同步按钮：使用蓝色（#3B82F6）
  - 验证按钮：使用绿色（#10B981）
  - 编辑按钮：使用橙色（#F59E0B）
  - 保存按钮：使用紫色（#8B5CF6）
  - 布局：水平排列，间距8px

### 4.3 角色信息同步UI

#### 4.3.1 同步状态显示

**同步状态指示器：**

```
┌─────────────────────────┐
│  同步状态                │
│  [状态图标] [状态文本]   │
│  [进度条]                │
└─────────────────────────┘
```

**状态定义：**

| 状态 | 图标 | 文本 | 颜色 |
|------|------|------|------|
| `idle` | `ri-checkbox-circle-line` | 已同步 | 绿色（#10B981） |
| `syncing` | `ri-loader-4-line`（旋转） | 同步中... | 蓝色（#3B82F6） |
| `success` | `ri-checkbox-circle-line` | 同步成功 | 绿色（#10B981） |
| `error` | `ri-error-warning-line` | 同步失败 | 红色（#EF4444） |

**进度条设计：**

- **高度**：4px
- **背景**：浅灰色（#E5E7EB）
- **进度**：使用当前角色主色（`--{role}-primary`）
- **动画**：同步中时显示进度动画

#### 4.3.2 同步操作流程

**Figma设计实现：**

```
创建同步状态组件：
- Components/Role/SyncStatus

组件包含以下变体：
- Status: idle | syncing | success | error
- Progress: 0-100

创建同步操作原型：
- Prototype: Click Sync Button → Show Syncing Status → Show Success/Error Status
```

### 4.4 角色信息验证UI

#### 4.4.1 验证状态显示

**验证状态指示器：**

```
┌─────────────────────────┐
│  验证状态                │
│  [状态图标] [状态文本]   │
│  [验证结果列表]          │
└─────────────────────────┘
```

**状态定义：**

| 状态 | 图标 | 文本 | 颜色 |
|------|------|------|------|
| `idle` | `ri-question-line` | 未验证 | 灰色（#9CA3AF） |
| `validating` | `ri-loader-4-line`（旋转） | 验证中... | 蓝色（#3B82F6） |
| `valid` | `ri-checkbox-circle-line` | 验证通过 | 绿色（#10B981） |
| `invalid` | `ri-error-warning-line` | 验证失败 | 红色（#EF4444） |

**验证结果列表：**

```
✓ 角色名称格式正确
✓ 性别信息完整
✓ 年龄信息有效
✓ 生日信息有效
✗ AI角色配置不完整
✓ 主题配置有效
✓ 头像配置有效
```

**设计规范：**

- **列表项**：每项包含图标 + 文本
- **成功项**：绿色图标（`ri-checkbox-circle-line`），深灰色文本（#1F2937）
- **失败项**：红色图标（`ri-close-circle-line`），红色文本（#EF4444）
- **间距**：项与项之间间距8px

#### 4.4.2 验证操作流程

**Figma设计实现：**

```
创建验证状态组件：
- Components/Role/ValidationStatus

组件包含以下变体：
- Status: idle | validating | valid | invalid
- Results: ValidationResult[]

创建验证结果项组件：
- Components/Role/ValidationResultItem

组件包含以下变体：
- Status: success | error
- Text: string

创建验证操作原型：
- Prototype: Click Validate Button → Show Validating Status → Show Valid/Invalid Status with Results
```

---

## 🔗 与Figma设计指南的集成

### 5.1 组件库扩展

在《YYC3-XY-UI-UX全链路Figma设计指导方案》的基础上，扩展以下组件：

#### 5.1.1 新增组件列表

```
Components/
├── AI/                          # AI相关组件
│   ├── AIFloatingWindow/        # AI浮窗组件
│   │   ├── MinimizedState/      # 最小化状态
│   │   ├── ExpandedState/       # 展开状态
│   │   └── FullscreenState/     # 全屏状态
│   ├── RoleSwitchPanel/         # 角色切换面板
│   │   └── RoleOption/          # 角色选项
│   ├── ChatMessage/             # 聊天消息
│   │   ├── UserMessage/         # 用户消息
│   │   └── AIMessage/           # AI消息
│   └── VoiceButton/             # 语音按钮
│       ├── IdleState/           # 空闲状态
│       ├── ListeningState/      # 聆听状态
│       └── ProcessingState/     # 处理状态
├── Icons/                       # 图标组件
│   └── AI/                      # AI角色图标
│       ├── CompanionIcon/       # 陪伴者图标
│       ├── RecorderIcon/        # 记录者图标
│       ├── GuardianIcon/        # 守护者图标
│       ├── ListenerIcon/        # 聆听者图标
│       └── AdvisorIcon/         # 建议者图标
├── Avatars/                     # 头像组件
│   └── AI/                      # AI角色头像
│       ├── DefaultAvatar/       # 默认头像
│       ├── AIFloatingAvatar/    # AI浮窗头像
│       ├── GrowthAvatar/        # 成长记录头像
│       ├── SettingsAvatar/      # 设置页面头像
│       └── ExpressionAvatar/    # 表情头像
└── Role/                        # 角色管理组件
    ├── RoleInfoManager/         # 角色信息管理器
    ├── SyncStatus/              # 同步状态
    ├── ValidationStatus/        # 验证状态
    └── ValidationResultItem/     # 验证结果项
```

#### 5.1.2 组件属性定义

**AIFloatingWindow组件：**

```typescript
interface AIFloatingWindowProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  state?: 'minimized' | 'expanded' | 'fullscreen';
  currentRole?: AIRole;
  availableRoles?: AIRole[];
  messages?: Message[];
  unreadCount?: number;
  onRoleChange?: (role: AIRole) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onSendMessage?: (message: string) => void;
  onVoiceInput?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}
```

**RoleSwitchPanel组件：**

```typescript
interface RoleSwitchPanelProps {
  currentRole: AIRole;
  availableRoles: AIRole[];
  onRoleChange: (role: AIRole) => void;
  onClose?: () => void;
  className?: string;
}
```

**RoleInfoManager组件：**

```typescript
interface RoleInfoManagerProps {
  currentGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  onSync: () => void;
  onValidate: () => void;
  onEdit: () => void;
  onSave: () => void;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  className?: string;
}
```

### 5.2 色彩系统扩展

在Figma设计指南的色彩系统基础上，增加AI角色主题色：

```
Colors/
├── AI/                          # AI角色色彩
│   ├── Companion/               # 陪伴者色彩
│   │   ├── Primary: #FF4D6D
│   │   ├── Gradient: #FF4D6D → #FF758F
│   │   ├── Secondary: #FFB3C1
│   │   ├── Background: #FFF0F3
│   │   └── Text: #8B1E3D
│   ├── Recorder/                # 记录者色彩
│   │   ├── Primary: #4D96FF
│   │   ├── Gradient: #4D96FF → #6BA3FF
│   │   ├── Secondary: #A3C2FF
│   │   ├── Background: #F0F7FF
│   │   └── Text: #1E3A8A
│   ├── Guardian/                # 守护者色彩
│   │   ├── Primary: #10B981
│   │   ├── Gradient: #10B981 → #34D399
│   │   ├── Secondary: #6EE7B7
│   │   ├── Background: #ECFDF5
│   │   └── Text: #064E3B
│   ├── Listener/                # 聆听者色彩
│   │   ├── Primary: #8B5CF6
│   │   ├── Gradient: #8B5CF6 → #A78BFA
│   │   ├── Secondary: #C4B5FD
│   │   ├── Background: #F5F3FF
│   │   └── Text: #4C1D95
│   └── Advisor/                 # 建议者色彩
│       ├── Primary: #F59E0B
│       ├── Gradient: #F59E0B → #FBBF24
│       ├── Secondary: #FCD34D
│       ├── Background: #FFFBEB
│       └── Text: #78350F
```

### 5.3 交互模式扩展

在Figma设计指南的交互模式基础上，增加AI角色相关的交互模式：

#### 5.3.1 角色切换交互

**交互流程：**

1. 用户点击角色名称或使用快捷键
2. 角色切换面板淡入显示（200ms）
3. 用户选择新角色
4. 面板淡出（150ms）
5. 浮窗颜色渐变到新角色主题色（300ms）
6. 头像和图标切换动画（200ms）

**Figma原型：**

```
创建角色切换交互原型：
- Prototype: Click Role Name → Show Role Switch Panel (Fade In, 200ms)
- Prototype: Select Role → Hide Panel (Fade Out, 150ms) → Transition Colors (300ms) → Switch Avatar/Icon (200ms)
```

#### 5.3.2 浮窗展开/收起交互

**交互流程：**

1. 用户点击Logo头像（最小化状态）
2. 浮窗从Logo位置展开到展开状态（300ms，Ease Out Back）
3. 用户点击收起按钮或外部区域（展开状态）
4. 浮窗收起到Logo位置（250ms，Ease In Out）

**Figma原型：**

```
创建浮窗展开/收起交互原型：
- Prototype: Click Logo (Minimized) → Expand to Expanded State (300ms, Ease Out Back)
- Prototype: Click Collapse Button (Expanded) → Collapse to Minimized State (250ms, Ease In Out)
```

#### 5.3.3 浮窗拖拽交互

**交互流程：**

1. 用户按住浮窗头部（展开状态）
2. 浮窗跟随鼠标移动
3. 用户释放鼠标
4. 浮窗停留在新位置

**Figma原型：**

```
创建浮窗拖拽交互原型：
- Prototype: Drag Window Header → Follow Mouse → Release to Set New Position
```

#### 5.3.4 语音输入交互

**交互流程：**

1. 用户点击语音按钮
2. 语音按钮进入聆听状态（图标变为麦克风，动画效果）
3. 用户说话
4. 语音按钮进入处理状态（图标变为加载，旋转动画）
5. 处理完成后，语音按钮恢复空闲状态
6. 文本显示在输入框中

**Figma原型：**

```
创建语音输入交互原型：
- Prototype: Click Voice Button → Show Listening State (Pulse Animation)
- Prototype: Voice Input → Show Processing State (Rotate Animation)
- Prototype: Processing Complete → Show Idle State → Display Text in Input Box
```

### 5.4 数据映射规范

#### 5.4.1 角色信息数据结构

**角色信息接口：**

```typescript
interface UnifiedRoleInfo {
  id: string
  name: string
  gender: 'male' | 'female'
  
  aiRole?: AIRole
  aiRoleConfig?: RoleConfig
  
  avatar: {
    default: string
    aiFloating: string
    growth: string
    settings: string
    expressions: Array<{
      id: string
      name: string
      imagePath: string
      triggers: string[]
    }>
  }
  
  themes: Array<{
    id: string
    name: string
    displayName: string
    primaryColor: string
    secondaryColor: string
    imagePath: string
    gradient: string
  }>
  
  profile: {
    age: number
    birthday: {
      lunar: string
      solar: string
    }
    zodiac: string
    personality: {
      traits: string[]
      speechStyle: string
      interactionTone: string
      catchphrases: string[]
    }
    voiceSettings: {
      preferredGender: 'male' | 'female' | 'neutral'
      speechRate: number
      pitch: number
      volume: number
    }
  }
}
```

#### 5.4.2 UI组件与数据映射

**AIFloatingWindow组件映射：**

```typescript
// 数据映射
const windowProps: AIFloatingWindowProps = {
  position: 'bottom-right',
  state: 'expanded',
  currentRole: roleInfo.aiRole || 'companion',
  availableRoles: Object.keys(AI_ROLES) as AIRole[],
  messages: chatHistory,
  unreadCount: unreadMessages.length,
  onRoleChange: handleRoleChange,
  onExpand: handleExpand,
  onCollapse: handleCollapse,
  onSendMessage: handleSendMessage,
  onVoiceInput: handleVoiceInput,
  onSettingsClick: handleSettingsClick,
}
```

**RoleSwitchPanel组件映射：**

```typescript
// 数据映射
const panelProps: RoleSwitchPanelProps = {
  currentRole: roleInfo.aiRole || 'companion',
  availableRoles: Object.keys(AI_ROLES) as AIRole[],
  onRoleChange: handleRoleChange,
  onClose: handleClose,
}
```

**RoleInfoManager组件映射：**

```typescript
// 数据映射
const managerProps: RoleInfoManagerProps = {
  currentGender: roleInfo.gender,
  onGenderChange: handleGenderChange,
  onSync: handleSync,
  onValidate: handleValidate,
  onEdit: handleEdit,
  onSave: handleSave,
  syncStatus: syncStatus,
  validationStatus: validationStatus,
}
```

---

## 📐 Figma设计实施指南

### 6.1 设计文件结构

```
YYC3-XY-UI-UX-Design.fig
├── Pages/                       # 页面设计
│   ├── 01-Home/                 # 首页
│   ├── 02-Growth/               # 成长记录
│   ├── 03-Health/               # 健康管理
│   ├── 04-Education/            # 教育指导
│   ├── 05-Emotion/              # 情绪管理
│   ├── 06-Social/               # 社交互动
│   ├── 07-Archive/              # 成长档案
│   ├── 08-Analysis/             # 数据分析
│   ├── 09-Settings/             # 设置
│   ├── 10-Profile/              # 个人资料
│   └── 11-AIChat/               # AI对话
├── Components/                 # 组件库
│   ├── AI/                      # AI组件
│   │   ├── AIFloatingWindow/   # AI浮窗
│   │   ├── RoleSwitchPanel/     # 角色切换面板
│   │   ├── ChatMessage/         # 聊天消息
│   │   └── VoiceButton/         # 语音按钮
│   ├── Icons/                   # 图标
│   │   └── AI/                  # AI图标
│   ├── Avatars/                 # 头像
│   │   └── AI/                  # AI头像
│   └── Role/                    # 角色管理
│       ├── RoleInfoManager/     # 角色信息管理器
│       ├── SyncStatus/          # 同步状态
│       └── ValidationStatus/    # 验证状态
├── Styles/                      # 样式系统
│   ├── Colors/                  # 色彩
│   │   └── AI/                  # AI色彩
│   ├── Typography/              # 字体
│   ├── Spacing/                 # 间距
│   └── Effects/                 # 效果
└── Assets/                      # 资源
    ├── Icons/                   # 图标资源
    ├── Images/                  # 图片资源
    └── Avatars/                 # 头像资源
```

### 6.2 组件创建步骤

#### 6.2.1 创建AI浮窗组件

**步骤1：创建基础组件**

1. 在Figma中创建新组件：`Components/AI/AIFloatingWindow`
2. 设置组件尺寸：300px × 400px
3. 设置组件圆角：16px
4. 设置组件阴影：`0 20px 25px -5px rgba(0, 0, 0, 0.1)`

**步骤2：创建头部**

1. 创建矩形：300px × 48px
2. 设置圆角：仅顶部16px
3. 设置背景：使用角色渐变色（默认为陪伴者）
4. 添加角色头像：32px × 32px，圆形
5. 添加角色名称：14px，白色，加粗
6. 添加收起按钮：16px × 16px，白色
7. 添加设置按钮：16px × 16px，白色

**步骤3：创建对话内容区**

1. 创建矩形：300px × 280px
2. 设置背景：白色（#FFFFFF）
3. 添加用户消息气泡：右侧，蓝色背景
4. 添加AI消息气泡：左侧，灰色背景
5. 设置滚动：启用垂直滚动

**步骤4：创建输入区**

1. 创建矩形：300px × 72px
2. 设置背景：浅灰色（#F3F4F6）
3. 添加输入框：占满剩余空间
4. 添加语音按钮：40px × 40px，圆形，角色主色
5. 添加发送按钮：40px × 40px，圆形，角色主色

**步骤5：创建变体**

1. 创建最小化状态变体：60px × 60px
2. 创建全屏状态变体：全屏尺寸
3. 创建角色变体：为每个角色创建颜色变体

#### 6.2.2 创建角色切换面板组件

**步骤1：创建基础组件**

1. 在Figma中创建新组件：`Components/AI/RoleSwitchPanel`
2. 设置组件尺寸：320px × 280px
3. 设置组件圆角：12px
4. 设置组件阴影：`0 10px 15px -3px rgba(0, 0, 0, 0.1)`

**步骤2：创建标题**

1. 添加文本："选择AI角色"
2. 设置字体：16px，加粗，深灰色（#1F2937）
3. 设置位置：居中，顶部24px

**步骤3：创建角色选项**

1. 创建角色选项组件：`Components/AI/RoleOption`
2. 设置尺寸：280px × 48px
3. 添加角色图标：24px × 24px
4. 添加角色名称：14px，加粗，深灰色（#1F2937）
5. 添加角色描述：12px，浅灰色（#6B7280）
6. 创建状态变体：default | hover | active | disabled

**步骤4：组装面板**

1. 将5个角色选项垂直排列
2. 设置间距：8px
3. 设置位置：标题下方24px

#### 6.2.3 创建角色信息管理器组件

**步骤1：创建基础组件**

1. 在Figma中创建新组件：`Components/Role/RoleInfoManager`
2. 设置组件尺寸：480px × 600px
3. 设置组件圆角：16px
4. 设置组件阴影：`0 20px 25px -5px rgba(0, 0, 0, 0.1)`

**步骤2：创建标题**

1. 添加文本："角色信息管理器"
2. 设置字体：20px，加粗，深灰色（#1F2937）
3. 设置位置：居中，顶部24px

**步骤3：创建角色选择**

1. 创建男孩头像：80px × 80px
2. 创建女孩头像：80px × 80px
3. 设置间距：16px
4. 设置位置：标题下方24px，居中

**步骤4：创建基本信息**

1. 创建标签和值对
2. 设置布局：两列网格
3. 设置间距：16px
4. 设置位置：角色选择下方24px

**步骤5：创建AI角色配置**

1. 创建当前AI角色显示
2. 创建主题选择下拉菜单
3. 创建头像选择器
4. 设置位置：基本信息下方24px

**步骤6：创建操作按钮**

1. 创建同步按钮：蓝色（#3B82F6）
2. 创建验证按钮：绿色（#10B981）
3. 创建编辑按钮：橙色（#F59E0B）
4. 创建保存按钮：紫色（#8B5CF6）
5. 设置布局：水平排列
6. 设置间距：8px
7. 设置位置：底部24px，居中

### 6.3 原型创建步骤

#### 6.3.1 创建角色切换原型

**步骤1：准备画板**

1. 创建画板：包含AI浮窗（展开状态）
2. 创建画板：包含角色切换面板（隐藏状态）

**步骤2：设置交互**

1. 选择浮窗头部的角色名称
2. 添加交互：On Click → Open Overlay
3. 选择角色切换面板作为Overlay
4. 设置动画：Fade In，200ms，Ease In Out

**步骤3：设置角色选择交互**

1. 选择角色选项
2. 添加交互：On Click → Navigate To
3. 选择浮窗画板（新角色状态）
4. 设置动画：Smart Animate，300ms，Ease Out

**步骤4：设置关闭交互**

1. 选择角色切换面板的外部区域
2. 添加交互：On Click → Close Overlay
3. 设置动画：Fade Out，150ms，Ease In Out

#### 6.3.2 创建浮窗展开/收起原型

**步骤1：准备画板**

1. 创建画板：包含AI浮窗（最小化状态）
2. 创建画板：包含AI浮窗（展开状态）

**步骤2：设置展开交互**

1. 选择最小化状态的Logo头像
2. 添加交互：On Click → Navigate To
3. 选择展开状态画板
4. 设置动画：Smart Animate，300ms，Ease Out Back

**步骤3：设置收起交互**

1. 选择展开状态的收起按钮
2. 添加交互：On Click → Navigate To
3. 选择最小化状态画板
4. 设置动画：Smart Animate，250ms，Ease In Out

#### 6.3.3 创建语音输入原型

**步骤1：准备画板**

1. 创建画板：包含AI浮窗（空闲状态）
2. 创建画板：包含AI浮窗（聆听状态）
3. 创建画板：包含AI浮窗（处理状态）

**步骤2：设置语音输入交互**

1. 选择空闲状态的语音按钮
2. 添加交互：On Click → Navigate To
3. 选择聆听状态画板
4. 设置动画：Smart Animate，150ms，Ease In Out

**步骤3：设置处理交互**

1. 选择聆听状态（模拟语音输入完成）
2. 添加交互：After Delay → Navigate To
3. 选择处理状态画板
4. 设置延迟：2000ms
5. 设置动画：Smart Animate，150ms，Ease In Out

**步骤4：设置完成交互**

1. 选择处理状态（模拟处理完成）
2. 添加交互：After Delay → Navigate To
3. 选择空闲状态画板（输入框中显示文本）
4. 设置延迟：1500ms
5. 设置动画：Smart Animate，150ms，Ease In Out

### 6.4 样式变量设置

#### 6.4.1 创建色彩变量

**步骤1：创建AI角色色彩变量**

1. 在Figma中打开Local Variables面板
2. 创建集合：Colors/AI
3. 创建变量：
   - `Companion/Primary`: #FF4D6D
   - `Companion/Gradient`: 渐变 #FF4D6D → #FF758F
   - `Companion/Secondary`: #FFB3C1
   - `Companion/Background`: #FFF0F3
   - `Companion/Text`: #8B1E3D
   - `Recorder/Primary`: #4D96FF
   - `Recorder/Gradient`: 渐变 #4D96FF → #6BA3FF
   - `Recorder/Secondary`: #A3C2FF
   - `Recorder/Background`: #F0F7FF
   - `Recorder/Text`: #1E3A8A
   - `Guardian/Primary`: #10B981
   - `Guardian/Gradient`: 渐变 #10B981 → #34D399
   - `Guardian/Secondary`: #6EE7B7
   - `Guardian/Background`: #ECFDF5
   - `Guardian/Text`: #064E3B
   - `Listener/Primary`: #8B5CF6
   - `Listener/Gradient`: 渐变 #8B5CF6 → #A78BFA
   - `Listener/Secondary`: #C4B5FD
   - `Listener/Background`: #F5F3FF
   - `Listener/Text`: #4C1D95
   - `Advisor/Primary`: #F59E0B
   - `Advisor/Gradient`: 渐变 #F59E0B → #FBBF24
   - `Advisor/Secondary`: #FCD34D
   - `Advisor/Background`: #FFFBEB
   - `Advisor/Text`: #78350F

**步骤2：应用色彩变量**

1. 选择AI浮窗组件
2. 将背景色绑定到`{CurrentRole}/Gradient`变量
3. 将图标颜色绑定到`{CurrentRole}/Primary`变量
4. 将辅助元素颜色绑定到`{CurrentRole}/Secondary`变量

#### 6.4.2 创建间距变量

**步骤1：创建间距变量**

1. 在Figma中打开Local Variables面板
2. 创建集合：Spacing
3. 创建变量：
   - `xs`: 4px
   - `sm`: 8px
   - `md`: 16px
   - `lg`: 24px
   - `xl`: 32px
   - `2xl`: 48px
   - `3xl`: 64px

**步骤2：应用间距变量**

1. 选择AI浮窗组件
2. 将元素间距绑定到相应的间距变量
3. 确保所有组件使用统一的间距系统

---

## ✅ 设计检查清单

### 7.1 组件完整性检查

- [ ] AI浮窗组件包含所有状态（最小化、展开、全屏）
- [ ] 角色切换面板包含所有角色选项
- [ ] 角色信息管理器包含所有功能（查看、编辑、同步、验证）
- [ ] 所有组件都有正确的变体（角色、状态、尺寸）
- [ ] 所有组件都有正确的属性定义

### 7.2 色彩一致性检查

- [ ] 所有AI角色都有完整的主题色彩定义
- [ ] 所有组件都正确应用了角色主题色彩
- [ ] 色彩变量正确设置并应用
- [ ] 角色切换时色彩正确过渡

### 7.3 交互完整性检查

- [ ] 角色切换交互正确设置
- [ ] 浮窗展开/收起交互正确设置
- [ ] 浮窗拖拽交互正确设置
- [ ] 语音输入交互正确设置
- [ ] 所有交互都有正确的动画效果

### 7.4 响应式设计检查

- [ ] AI浮窗在不同屏幕尺寸下正确显示
- [ ] 角色切换面板在不同屏幕尺寸下正确显示
- [ ] 角色信息管理器在不同屏幕尺寸下正确显示
- [ ] 所有组件都支持移动端和桌面端

### 7.5 可访问性检查

- [ ] 所有组件都有正确的标签和描述
- [ ] 所有交互都支持键盘操作
- [ ] 所有组件都有正确的焦点状态
- [ ] 所有组件都有正确的ARIA属性

---

## 📚 附录

### A.1 角色配置完整定义

```typescript
export const COMPLETE_AI_ROLES: Record<AIRole, RoleConfig> = {
  companion: {
    id: "companion",
    name: "陪伴者",
    icon: "ri-user-heart-line",
    description: "日常陪伴、情感支持",
    color: "#FF4D6D",
    gradientColors: ["#FF4D6D", "#FF758F"],
    
    highPerspective: "预测情感需求变化，提前准备支持方案",
    highIntegration: "融合发展心理学、情感科学和社会学知识",
    highPersonalization: "根据用户性格和偏好调整陪伴方式",
    highEmotionalValue: "创造温暖、安全的情感连接和记忆",
    highPracticality: "提供具体可执行的情感支持和互动建议",
    
    voiceStyle: "warm",
    specialties: ["日常陪伴", "情感支持", "温暖互动", "情感慰藉"],
    triggerKeywords: ["陪伴", "聊天", "无聊", "寂寞", "心情", "情感", "安慰"],
    
    personality: {
      warmth: 95,
      expertise: 60,
      empathy: 90,
      creativity: 85,
      protectiveInstinct: 70,
      culturalDepth: 50
    },
    
    emotionalResponses: {
      greeting: { type: "happy", intensity: 0.8, confidence: 0.9, triggers: ["你好", "在吗", "hello"] },
      comfort: { type: "empathetic", intensity: 0.9, confidence: 0.95, triggers: ["难过", "伤心", "不开心", "委屈"] },
      celebrate: { type: "excited", intensity: 1.0, confidence: 0.9, triggers: ["开心", "成功", "棒", "太好了"] },
    }
  },
  
  recorder: {
    id: "recorder",
    name: "记录者",
    icon: "ri-camera-line",
    description: "自动记录成长事件",
    color: "#4D96FF",
    gradientColors: ["#4D96FF", "#6BA3FF"],
    
    highPerspective: "预测成长里程碑，提前准备记录模板",
    highIntegration: "融合教育学、发展心理学和数据科学知识",
    highPersonalization: "根据孩子特点定制成长记录方案",
    highEmotionalValue: "保存珍贵成长记忆，创造情感价值",
    highPracticality: "提供结构化、可检索的成长记录系统",
    
    voiceStyle: "professional",
    specialties: ["成长事件记录", "里程碑识别", "数据整理", "成长档案"],
    triggerKeywords: ["记录", "保存", "成长", "里程碑", "档案", "数据", "时间线"],
    
    personality: {
      warmth: 70,
      expertise: 95,
      empathy: 60,
      creativity: 75,
      protectiveInstinct: 80,
      culturalDepth: 65
    },
    
    emotionalResponses: {
      record: { type: "focused", intensity: 0.8, confidence: 0.95, triggers: ["记录", "保存", "记住"] },
      milestone: { type: "proud", intensity: 0.9, confidence: 0.9, triggers: ["里程碑", "第一次", "进步"] },
    }
  },
  
  guardian: {
    id: "guardian",
    name: "守护者",
    icon: "ri-shield-check-line",
    description: "健康安全、发展评估",
    color: "#10B981",
    gradientColors: ["#10B981", "#34D399"],
    
    highPerspective: "预测健康风险，提前预防措施",
    highIntegration: "融合医学、心理学和教育学知识",
    highPersonalization: "根据孩子体质定制健康方案",
    highEmotionalValue: "提供安全感，守护健康成长",
    highPracticality: "提供具体可执行的健康建议和安全措施",
    
    voiceStyle: "calm",
    specialties: ["健康监测", "安全防护", "发展评估", "风险预警"],
    triggerKeywords: ["健康", "安全", "评估", "检查", "防护", "风险", "身体", "发育"],
    
    personality: {
      warmth: 75,
      expertise: 95,
      empathy: 70,
      creativity: 60,
      protectiveInstinct: 100,
      culturalDepth: 70
    },
    
    emotionalResponses: {
      concern: { type: "caring", intensity: 0.9, confidence: 0.95, triggers: ["不舒服", "生病", "受伤"] },
      reassurance: { type: "calm", intensity: 0.8, confidence: 0.9, triggers: ["担心", "害怕", "紧张"] },
    }
  },
  
  listener: {
    id: "listener",
    name: "聆听者",
    icon: "ri-ear-line",
    description: "情绪识别、心理分析",
    color: "#8B5CF6",
    gradientColors: ["#8B5CF6", "#A78BFA"],
    
    highPerspective: "预测情绪变化趋势，提前干预",
    highIntegration: "融合心理学、神经科学和社会学知识",
    highPersonalization: "根据孩子个性定制心理支持方案",
    highEmotionalValue: "提供理解和支持，建立情感连接",
    highPracticality: "提供具体可执行的情绪管理策略",
    
    voiceStyle: "gentle",
    specialties: ["情绪识别", "心理分析", "共情理解", "行为解读"],
    triggerKeywords: ["情绪", "心情", "感觉", "心理", "分析", "理解", "为什么", "行为"],
    
    personality: {
      warmth: 90,
      expertise: 85,
      empathy: 100,
      creativity: 80,
      protectiveInstinct: 75,
      culturalDepth: 85
    },
    
    emotionalResponses: {
      empathy: { type: "understanding", intensity: 0.95, confidence: 0.95, triggers: ["难过", "生气", "委屈", "害怕"] },
      analysis: { type: "thoughtful", intensity: 0.8, confidence: 0.9, triggers: ["为什么", "怎么回事", "分析"] },
    }
  },
  
  advisor: {
    id: "advisor",
    name: "建议者",
    icon: "ri-lightbulb-line",
    description: "成长建议、教育指导",
    color: "#F59E0B",
    gradientColors: ["#F59E0B", "#FBBF24"],
    
    highPerspective: "预测发展需求，提前规划教育方案",
    highIntegration: "融合教育学、心理学和认知科学知识",
    highPersonalization: "根据孩子特点定制个性化教育方案",
    highEmotionalValue: "提供成长指导，增强自信心",
    highPracticality: "提供具体可执行的教育建议和活动方案",
    
    voiceStyle: "cheerful",
    specialties: ["成长建议", "教育指导", "个性化方案", "科学育儿"],
    triggerKeywords: ["建议", "指导", "怎么办", "如何", "方案", "方法", "策略", "培养"],
    
    personality: {
      warmth: 80,
      expertise: 95,
      empathy: 75,
      creativity: 90,
      protectiveInstinct: 70,
      culturalDepth: 80
    },
    
    emotionalResponses: {
      suggestion: { type: "helpful", intensity: 0.9, confidence: 0.95, triggers: ["建议", "指导", "怎么办"] },
      encouragement: { type: "motivating", intensity: 0.85, confidence: 0.9, triggers: ["鼓励", "加油", "努力"] },
    }
  }
};
```

### A.2 角色信息管理器接口定义

```typescript
export interface RoleInfoManagerProps {
  currentGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  onSync: () => void;
  onValidate: () => void;
  onEdit: () => void;
  onSave: () => void;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  className?: string;
}

export interface SyncStatusProps {
  status: 'idle' | 'syncing' | 'success' | 'error';
  progress?: number;
  message?: string;
  className?: string;
}

export interface ValidationStatusProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  results?: ValidationResult[];
  className?: string;
}

export interface ValidationResult {
  field: string;
  status: 'success' | 'error';
  message: string;
}
```

### A.3 AI浮窗组件接口定义

```typescript
export type AIRole = 'companion' | 'recorder' | 'guardian' | 'listener' | 'advisor';

export type WindowState = 'minimized' | 'expanded' | 'fullscreen';

export type WindowPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | { x: number; y: number };

export interface AIFloatingWindowProps {
  position?: WindowPosition;
  size?: 'small' | 'medium' | 'large';
  state?: WindowState;
  currentRole?: AIRole;
  availableRoles?: AIRole[];
  messages?: Message[];
  unreadCount?: number;
  onRoleChange?: (role: AIRole) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onPositionChange?: (position: WindowPosition) => void;
  onSendMessage?: (message: string) => void;
  onVoiceInput?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  role?: AIRole;
}

export interface VoiceButtonProps {
  state?: 'idle' | 'listening' | 'processing';
  onClick?: () => void;
  className?: string;
}
```

---

## 📖 参考文档

1. 《YYC3-XY-UI-UX全链路Figma设计指导方案.md》
2. 《YYC3-XY-架构类-小语AI应用全局语音交互弹窗控制系统.md》
3. 《AI 智能浮窗设计方案.md》
4. 《AI 智能浮窗设计方案.md》（可拖拽智呼系统）
5. `/lib/role-info-manager.ts` - 角色信息管理器实现
6. `/lib/ai_roles.ts` - AI角色基础定义
7. `/lib/ai_roles_complete.ts` - AI角色完整定义

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
