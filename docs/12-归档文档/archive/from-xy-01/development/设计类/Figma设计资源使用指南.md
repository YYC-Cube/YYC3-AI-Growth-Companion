# YYC3-XY Figma 设计资源使用指南

> 本文档详细说明如何在 Figma 设计中正确使用项目 public 目录下的所有图片资源

## 📁 完整资源目录结构

```
public/
├── icon.svg                          # 通用SVG图标 - 可缩放矢量图标，用于UI内部图标
├── manifest.json                     # PWA清单文件 - 定义PWA应用配置（Figma不使用）
├── placeholder-logo.png              # Logo占位图(PNG) - 设计草稿、未确定Logo时使用
├── placeholder-logo.svg              # Logo占位图(SVG) - 可缩放Logo占位，设计草稿使用
├── placeholder-user.jpg              # 用户头像占位图 - 未上传头像的用户显示此图
├── placeholder.svg                   # 通用占位图 - 图片加载中、未加载状态显示
├── sw.js                             # Service Worker文件 - PWA离线缓存脚本（Figma不使用）
├── role-photos/                      # 角色照片资源目录 - 包含所有角色头像和照片
│   ├── boy/                          # 男孩角色目录 - 小言(xiaoyan)的所有照片
│   │   ├── ai-avatars/               # AI生成的男孩头像目录 - 5张AI头像
│   │   │   ├── boy-xiaoyan-casual-001.png    # AI生成-小言休闲风格头像001 - 日常场景
│   │   │   ├── boy-xiaoyan-casual-002.png    # AI生成-小言休闲风格头像002 - 日常场景
│   │   │   ├── boy-xiaoyan-casual-003.png    # AI生成-小言休闲风格头像003 - 日常场景
│   │   │   ├── boy-xiaoyan-cool-001.png      # AI生成-小言酷炫风格头像001 - 活力场景
│   │   │   └── boy-xiaoyan-cool-002.png      # AI生成-小言酷炫风格头像002 - 活力场景
│   │   ├── xiaoyan-casual-001.png            # 小言休闲风格照片001 - 日常学习、休闲活动
│   │   ├── xiaoyan-casual-002.png            # 小言休闲风格照片002 - 日常学习、休闲活动
│   │   ├── xiaoyan-casual-003.png            # 小言休闲风格照片003 - 日常学习、休闲活动
│   │   ├── xiaoyan-casual-005.png            # 小言休闲风格照片005 - 日常学习、休闲活动
│   │   ├── xiaoyan-cool-001.png              # 小言酷炫风格照片001 - 运动场景、创意活动
│   │   ├── xiaoyan-cool-002.png              # 小言酷炫风格照片002 - 运动场景、创意活动
│   │   ├── xiaoyan-cool-003.png              # 小言酷炫风格照片003 - 运动场景、创意活动
│   │   ├── xiaoyan-formal-001.png            # 小言正式风格照片001 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-002.png            # 小言正式风格照片002 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-003.png            # 小言正式风格照片003 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-005.png            # 小言正式风格照片005 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-006.png            # 小言正式风格照片006 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-007.png            # 小言正式风格照片007 - 正式场合、学习成果展示
│   │   ├── xiaoyan-formal-008.png            # 小言正式风格照片008 - 正式场合、学习成果展示
│   │   └── xiaoyan-formal-009.png            # 小言正式风格照片009 - 正式场合、学习成果展示
│   ├── girl/                         # 女孩角色目录 - 小语(xiaoyu)的所有照片
│   │   ├── ai-avatars/               # AI生成的女孩头像目录 - 4张AI头像
│   │   │   ├── girl-xiaoyu-lolita-blue-001.png   # AI生成-小语蓝色洛丽塔头像001 - 优雅场景
│   │   │   ├── girl-xiaoyu-lolita-blue-002.png   # AI生成-小语蓝色洛丽塔头像002 - 优雅场景
│   │   │   ├── girl-xiaoyu-lolita-pink-001.png   # AI生成-小语粉色洛丽塔头像001 - 可爱场景
│   │   │   └── girl-xiaoyu-lolita-pink-002.png   # AI生成-小语粉色洛丽塔头像002 - 可爱场景
│   │   ├── xiaoyu-lolita-blue-008.png          # 小语蓝色洛丽塔照片008 - 优雅场景、艺术创作
│   │   ├── xiaoyu-lolita-blue-009.png          # 小语蓝色洛丽塔照片009 - 优雅场景、艺术创作
│   │   ├── xiaoyu-lolita-blue-010.png          # 小语蓝色洛丽塔照片010 - 优雅场景、艺术创作
│   │   ├── xiaoyu-lolita-blue-011.png          # 小语蓝色洛丽塔照片011 - 优雅场景、艺术创作
│   │   ├── xiaoyu-lolita-blue-013.png          # 小语蓝色洛丽塔照片013 - 优雅场景、艺术创作
│   │   ├── xiaoyu-lolita-pink-001.png          # 小语粉色洛丽塔照片001 - 可爱场景、儿童活动
│   │   ├── xiaoyu-lolita-pink-002.png          # 小语粉色洛丽塔照片002 - 可爱场景、儿童活动
│   │   ├── xiaoyu-lolita-pink-003.png          # 小语粉色洛丽塔照片003 - 可爱场景、儿童活动
│   │   ├── xiaoyu-lolita-pink-005.png          # 小语粉色洛丽塔照片005 - 可爱场景、儿童活动
│   │   ├── xiaoyu-lolita-pink-006.png          # 小语粉色洛丽塔照片006 - 可爱场景、儿童活动
│   │   ├── xiaoyu-school-blue-015.png          # 小语蓝色校服照片015 - 学习场景、校园活动
│   │   ├── xiaoyu-school-blue-016.png          # 小语蓝色校服照片016 - 学习场景、校园活动
│   │   └── xiaoyu-school-pink-007.png          # 小语粉色校服照片007 - 学习场景、校园活动
│   └── joint-avatars/                # 联合头像目录 - 男孩+女孩双人头像
│       ├── xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png  # 可爱联合头像001 - 双人互动场景
│       ├── xiaoyan-boy-xiaoyu-girl-cute-002-joint-avatar.png  # 可爱联合头像002 - 双人互动场景
│       └── xiaoyan-boy-xiaoyu-girl-cute-003-joint-avatar.png  # 可爱联合头像003 - 双人互动场景
├── UI页面图示/                      # UI页面图示目录 - 11张UI界面截图（Figma参考使用）
│   ├── 创意工坊.png                 # 创意工坊页面截图 - Figma设计参考
│   ├── 成长记录.png                 # 成长记录页面截图 - Figma设计参考
│   ├── 消息中心.png                 # 消息中心页面截图 - Figma设计参考
│   ├── 设置管理.png                 # 设置管理页面截图 - Figma设计参考
│   ├── 作业任务.png                 # 作业任务页面截图 - Figma设计参考
│   ├── 公益活动.png                 # 公益活动页面截图 - Figma设计参考
│   ├── 智能课表.png                 # 智能课表页面截图 - Figma设计参考
│   ├── 有声绘本.png                 # 有声绘本页面截图 - Figma设计参考
│   ├── 视频工坊.png                 # 视频工坊页面截图 - Figma设计参考
│   ├── 公益课堂.png                 # 公益课堂页面截图 - Figma设计参考
│   └── 首页界面.png                 # 首页界面截图 - Figma设计参考
├── yyc3-logo-black.png              # YYC3黑色Logo - 深色背景、打印材料使用
├── yyc3-logo-blue.png               # YYC3蓝色Logo - 品牌主Logo，首页、登录页、主要导航使用
├── yyc3-logo-gray.png              # YYC3灰色Logo - 次要位置、辅助元素、文档页脚使用
├── yyc3-logo-R_blue.png             # YYC3 R蓝色Logo - 特定品牌场景使用
├── yyc3-logo-red.png                # YYC3红色Logo - 强调元素、特殊活动、活力展示使用
├── yyc3-logo-white.png              # YYC3白色Logo - 深色背景、暗色主题使用
├── yyc3-pwa-icon.png                # YYC3 PWA应用图标 - 浏览器标签页、桌面快捷方式使用
└── yyc3-white.png                   # YYC3白色Logo变体 - 深色背景使用
```

## 🎨 品牌资源使用指南

### YYC3 Logo 系列（7个文件）

| 文件名 | 路径 | 颜色 | 推荐场景 |
|--------|------|------|----------|
| `yyc3-logo-blue.png` | `/yyc3-logo-blue.png` | 蓝色 | 首页、登录页、主要导航（默认使用） |
| `yyc3-logo-white.png` | `/yyc3-logo-white.png` | 白色 | 深色背景、暗色主题 |
| `yyc3-logo-black.png` | `/yyc3-logo-black.png` | 黑色 | 深色背景、打印材料 |
| `yyc3-logo-gray.png` | `/yyc3-logo-gray.png` | 灰色 | 次要位置、辅助元素、文档页脚 |
| `yyc3-logo-red.png` | `/yyc3-logo-red.png` | 红色 | 强调元素、特殊活动、活力展示 |
| `yyc3-logo-R_blue.png` | `/yyc3-logo-R_blue.png` | R蓝色 | 特定品牌场景 |
| `yyc3-white.png` | `/yyc3-white.png` | 白色 | 深色背景（白色Logo变体） |

**Figma 使用建议：**
- 首页顶部导航栏：使用 `/yyc3-logo-blue.png`
- 登录/注册页：使用 `/yyc3-logo-blue.png` 或 `/yyc3-logo-white.png`（根据背景）
- 深色主题页面：使用 `/yyc3-logo-white.png` 或 `/yyc3-white.png`
- 文档页脚：使用 `/yyc3-logo-gray.png`
- 活动推广页：使用 `/yyc3-logo-red.png`

### 应用图标（2个文件）

| 文件名 | 路径 | 用途 | 推荐尺寸 |
|--------|------|------|----------|
| `yyc3-pwa-icon.png` | `/yyc3-pwa-icon.png` | PWA应用图标 | 512x512px |
| `icon.svg` | `/icon.svg` | 通用SVG图标 | 矢量格式，可缩放 |

**Figma 使用建议：**
- 浏览器标签页图标：使用 `/yyc3-pwa-icon.png`
- 桌面快捷方式：使用 `/yyc3-pwa-icon.png`
- UI 内部图标：使用 `/icon.svg`（可缩放矢量图标）

## 👤 角色照片资源使用指南

### 男孩角色 - 小言 (xiaoyan) - 共22个文件

#### AI 生成头像 (5个文件)

| 文件名 | 完整路径 | 风格 | 用途 |
|--------|----------|------|------|
| `boy-xiaoyan-casual-001.png` | `/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png` | 休闲风格 | 日常场景、轻松氛围 |
| `boy-xiaoyan-casual-002.png` | `/role-photos/boy/ai-avatars/boy-xiaoyan-casual-002.png` | 休闲风格 | 日常场景、轻松氛围 |
| `boy-xiaoyan-casual-003.png` | `/role-photos/boy/ai-avatars/boy-xiaoyan-casual-003.png` | 休闲风格 | 日常场景、轻松氛围 |
| `boy-xiaoyan-cool-001.png` | `/role-photos/boy/ai-avatars/boy-xiaoyan-cool-001.png` | 酷炫风格 | 活力场景、运动主题 |
| `boy-xiaoyan-cool-002.png` | `/role-photos/boy/ai-avatars/boy-xiaoyan-cool-002.png` | 酷炫风格 | 活力场景、运动主题 |

#### 照片资源 (17个文件)

**休闲风格 (casual) - 4个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyan-casual-001.png` | `/role-photos/boy/xiaoyan-casual-001.png` | 日常学习、休闲活动、轻松场景 |
| `xiaoyan-casual-002.png` | `/role-photos/boy/xiaoyan-casual-002.png` | 日常学习、休闲活动、轻松场景 |
| `xiaoyan-casual-003.png` | `/role-photos/boy/xiaoyan-casual-003.png` | 日常学习、休闲活动、轻松场景 |
| `xiaoyan-casual-005.png` | `/role-photos/boy/xiaoyan-casual-005.png` | 日常学习、休闲活动、轻松场景 |

**酷炫风格 (cool) - 3个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyan-cool-001.png` | `/role-photos/boy/xiaoyan-cool-001.png` | 运动场景、创意活动、活力展示 |
| `xiaoyan-cool-002.png` | `/role-photos/boy/xiaoyan-cool-002.png` | 运动场景、创意活动、活力展示 |
| `xiaoyan-cool-003.png` | `/role-photos/boy/xiaoyan-cool-003.png` | 运动场景、创意活动、活力展示 |

**正式风格 (formal) - 10个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyan-formal-001.png` | `/role-photos/boy/xiaoyan-formal-001.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-002.png` | `/role-photos/boy/xiaoyan-formal-002.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-003.png` | `/role-photos/boy/xiaoyan-formal-003.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-005.png` | `/role-photos/boy/xiaoyan-formal-005.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-006.png` | `/role-photos/boy/xiaoyan-formal-006.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-007.png` | `/role-photos/boy/xiaoyan-formal-007.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-008.png` | `/role-photos/boy/xiaoyan-formal-008.png` | 正式场合、学习成果展示、证书场景 |
| `xiaoyan-formal-009.png` | `/role-photos/boy/xiaoyan-formal-009.png` | 正式场合、学习成果展示、证书场景 |

### 女孩角色 - 小语 (xiaoyu) - 共18个文件

#### AI 生成头像 (4个文件)

| 文件名 | 完整路径 | 风格 | 用途 |
|--------|----------|------|------|
| `girl-xiaoyu-lolita-blue-001.png` | `/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-001.png` | 蓝色洛丽塔 | 优雅场景、艺术氛围 |
| `girl-xiaoyu-lolita-blue-002.png` | `/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-002.png` | 蓝色洛丽塔 | 优雅场景、艺术氛围 |
| `girl-xiaoyu-lolita-pink-001.png` | `/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png` | 粉色洛丽塔 | 可爱场景、温馨氛围 |
| `girl-xiaoyu-lolita-pink-002.png` | `/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-002.png` | 粉色洛丽塔 | 可爱场景、温馨氛围 |

#### 照片资源 (14个文件)

**洛丽塔风格 - 蓝色系 (lolita-blue) - 5个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyu-lolita-blue-008.png` | `/role-photos/girl/xiaoyu-lolita-blue-008.png` | 优雅场景、艺术创作、展示页面 |
| `xiaoyu-lolita-blue-009.png` | `/role-photos/girl/xiaoyu-lolita-blue-009.png` | 优雅场景、艺术创作、展示页面 |
| `xiaoyu-lolita-blue-010.png` | `/role-photos/girl/xiaoyu-lolita-blue-010.png` | 优雅场景、艺术创作、展示页面 |
| `xiaoyu-lolita-blue-011.png` | `/role-photos/girl/xiaoyu-lolita-blue-011.png` | 优雅场景、艺术创作、展示页面 |
| `xiaoyu-lolita-blue-013.png` | `/role-photos/girl/xiaoyu-lolita-blue-013.png` | 优雅场景、艺术创作、展示页面 |

**洛丽塔风格 - 粉色系 (lolita-pink) - 5个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyu-lolita-pink-001.png` | `/role-photos/girl/xiaoyu-lolita-pink-001.png` | 可爱场景、儿童活动、温馨页面 |
| `xiaoyu-lolita-pink-002.png` | `/role-photos/girl/xiaoyu-lolita-pink-002.png` | 可爱场景、儿童活动、温馨页面 |
| `xiaoyu-lolita-pink-003.png` | `/role-photos/girl/xiaoyu-lolita-pink-003.png` | 可爱场景、儿童活动、温馨页面 |
| `xiaoyu-lolita-pink-005.png` | `/role-photos/girl/xiaoyu-lolita-pink-005.png` | 可爱场景、儿童活动、温馨页面 |
| `xiaoyu-lolita-pink-006.png` | `/role-photos/girl/xiaoyu-lolita-pink-006.png` | 可爱场景、儿童活动、温馨页面 |

**校服风格 (school) - 3个文件**
| 文件名 | 完整路径 | 用途 |
|--------|----------|------|
| `xiaoyu-school-blue-015.png` | `/role-photos/girl/xiaoyu-school-blue-015.png` | 学习场景、校园活动、课程页面 |
| `xiaoyu-school-blue-016.png` | `/role-photos/girl/xiaoyu-school-blue-016.png` | 学习场景、校园活动、课程页面 |
| `xiaoyu-school-pink-007.png` | `/role-photos/girl/xiaoyu-school-pink-007.png` | 学习场景、校园活动、课程页面 |

### 联合头像 (joint-avatars) - 共3个文件

| 文件名 | 完整路径 | 描述 | 用途 |
|--------|----------|------|------|
| `xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png` | `/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png` | 可爱联合头像001 | 双人互动场景、协作页面 |
| `xiaoyan-boy-xiaoyu-girl-cute-002-joint-avatar.png` | `/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-002-joint-avatar.png` | 可爱联合头像002 | 双人互动场景、协作页面 |
| `xiaoyan-boy-xiaoyu-girl-cute-003-joint-avatar.png` | `/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-003-joint-avatar.png` | 可爱联合头像003 | 双人互动场景、协作页面 |

## 🔧 占位资源使用指南（4个文件）

| 文件名 | 完整路径 | 格式 | 用途 | 推荐场景 |
|--------|----------|------|------|----------|
| `placeholder-logo.png` | `/placeholder-logo.png` | PNG | Logo占位 | 设计草稿、未确定Logo时使用 |
| `placeholder-logo.svg` | `/placeholder-logo.svg` | SVG | Logo占位（矢量） | 设计草稿、可缩放场景使用 |
| `placeholder-user.jpg` | `/placeholder-user.jpg` | JPG | 用户头像占位 | 未上传头像的用户显示 |
| `placeholder.svg` | `/placeholder.svg` | SVG | 通用占位图 | 图片加载中、未加载状态显示 |

**Figma 使用建议：**
- 设计初期：使用占位资源快速搭建布局
- 用户头像未加载：显示 `/placeholder-user.jpg`
- 图片加载失败：显示 `/placeholder.svg`
- Logo未确定：使用 `/placeholder-logo.png` 或 `/placeholder-logo.svg`

## 📋 Figma 设计最佳实践

### 1. 资源导入方法

#### 方法一：直接拖拽
```
1. 打开 Figma 设计文件
2. 从 Finder 中拖拽图片到 Figma 画布
3. 图片自动导入到 Figma
```

#### 方法二：使用 Figma Assets 面板
```
1. 将常用资源上传到 Figma Team Library
2. 在 Assets 面板中搜索并拖拽使用
3. 保持资源版本统一
```

#### 方法三：使用 Figma 插件
```
推荐插件：
- Unsplash：查找占位图
- Iconify：查找图标
- Image Tracer：图片矢量化
```

### 2. 资源命名规范

在 Figma 中使用时，建议保持以下命名规范：

```
Logo:
- YYC3-Logo-Blue
- YYC3-Logo-White
- YYC3-Logo-Black
- YYC3-Logo-Gray
- YYC3-Logo-Red
- YYC3-PWA-Icon

男孩头像:
- Boy-Xiaoyan-Casual-001
- Boy-Xiaoyan-Casual-002
- Boy-Xiaoyan-Cool-001
- Boy-Xiaoyan-Formal-001

女孩头像:
- Girl-Xiaoyu-Lolita-Blue-008
- Girl-Xiaoyu-Lolita-Pink-001
- Girl-Xiaoyu-School-Blue-015

联合头像:
- Joint-Cute-001
- Joint-Cute-002
- Joint-Cute-003

占位资源:
- Placeholder-Logo
- Placeholder-User
- Placeholder-Image
```

### 3. 组件化建议

创建以下 Figma 组件以便复用：

#### Logo 组件（7个变体）
```
Component: Logo/YYC3-Logo
Variants:
- Blue (Default) - /yyc3-logo-blue.png
- White - /yyc3-logo-white.png
- Black - /yyc3-logo-black.png
- Gray - /yyc3-logo-gray.png
- Red - /yyc3-logo-red.png
- R_Blue - /yyc3-logo-R_blue.png
- White_Variant - /yyc3-white.png
```

#### 男孩头像组件（22个变体）
```
Component: Avatar/Boy-Xiaoyan
Variants:
- AI_Casual-001 - /role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png
- AI_Casual-002 - /role-photos/boy/ai-avatars/boy-xiaoyan-casual-002.png
- AI_Casual-003 - /role-photos/boy/ai-avatars/boy-xiaoyan-casual-003.png
- AI_Cool-001 - /role-photos/boy/ai-avatars/boy-xiaoyan-cool-001.png
- AI_Cool-002 - /role-photos/boy/ai-avatars/boy-xiaoyan-cool-002.png
- Casual-001 - /role-photos/boy/xiaoyan-casual-001.png
- Casual-002 - /role-photos/boy/xiaoyan-casual-002.png
- Casual-003 - /role-photos/boy/xiaoyan-casual-003.png
- Casual-005 - /role-photos/boy/xiaoyan-casual-005.png
- Cool-001 - /role-photos/boy/xiaoyan-cool-001.png
- Cool-002 - /role-photos/boy/xiaoyan-cool-002.png
- Cool-003 - /role-photos/boy/xiaoyan-cool-003.png
- Formal-001 - /role-photos/boy/xiaoyan-formal-001.png
- Formal-002 - /role-photos/boy/xiaoyan-formal-002.png
- Formal-003 - /role-photos/boy/xiaoyan-formal-003.png
- Formal-005 - /role-photos/boy/xiaoyan-formal-005.png
- Formal-006 - /role-photos/boy/xiaoyan-formal-006.png
- Formal-007 - /role-photos/boy/xiaoyan-formal-007.png
- Formal-008 - /role-photos/boy/xiaoyan-formal-008.png
- Formal-009 - /role-photos/boy/xiaoyan-formal-009.png
```

#### 女孩头像组件（18个变体）
```
Component: Avatar/Girl-Xiaoyu
Variants:
- AI_Lolita-Blue-001 - /role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-001.png
- AI_Lolita-Blue-002 - /role-photos/girl/ai-avatars/girl-xiaoyu-lolita-blue-002.png
- AI_Lolita-Pink-001 - /role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png
- AI_Lolita-Pink-002 - /role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-002.png
- Lolita-Blue-008 - /role-photos/girl/xiaoyu-lolita-blue-008.png
- Lolita-Blue-009 - /role-photos/girl/xiaoyu-lolita-blue-009.png
- Lolita-Blue-010 - /role-photos/girl/xiaoyu-lolita-blue-010.png
- Lolita-Blue-011 - /role-photos/girl/xiaoyu-lolita-blue-011.png
- Lolita-Blue-013 - /role-photos/girl/xiaoyu-lolita-blue-013.png
- Lolita-Pink-001 - /role-photos/girl/xiaoyu-lolita-pink-001.png
- Lolita-Pink-002 - /role-photos/girl/xiaoyu-lolita-pink-002.png
- Lolita-Pink-003 - /role-photos/girl/xiaoyu-lolita-pink-003.png
- Lolita-Pink-005 - /role-photos/girl/xiaoyu-lolita-pink-005.png
- Lolita-Pink-006 - /role-photos/girl/xiaoyu-lolita-pink-006.png
- School-Blue-015 - /role-photos/girl/xiaoyu-school-blue-015.png
- School-Blue-016 - /role-photos/girl/xiaoyu-school-blue-016.png
- School-Pink-007 - /role-photos/girl/xiaoyu-school-pink-007.png
```

#### 联合头像组件（3个变体）
```
Component: Avatar/Joint
Variants:
- Cute-001 - /role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png
- Cute-002 - /role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-002-joint-avatar.png
- Cute-003 - /role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-003-joint-avatar.png
```

#### 占位组件（4个变体）
```
Component: Placeholder/Logo
- PNG - /placeholder-logo.png
- SVG - /placeholder-logo.svg

Component: Placeholder/User
- /placeholder-user.jpg

Component: Placeholder/Image
- /placeholder.svg
```

### 4. 响应式设计建议

#### Logo 尺寸规范
```
桌面端: 120-160px 宽度
平板端: 100-120px 宽度
移动端: 80-100px 宽度
```

#### 头像尺寸规范
```
大头像: 120x120px (个人中心、用户详情)
中头像: 64x64px (列表项、评论列表)
小头像: 32x32px (评论、通知、消息)
```

#### 图标尺寸规范
```
大图标: 48x48px (主要操作按钮)
中图标: 24x24px (常规操作、导航)
小图标: 16x16px (辅助信息、状态指示)
```

### 5. 颜色主题适配

#### 亮色主题
```
Logo: /yyc3-logo-blue.png
头像: 原始图片
背景: 白色/浅灰色
文字: 深色
```

#### 暗色主题
```
Logo: /yyc3-logo-white.png 或 /yyc3-white.png
头像: 原始图片（可能需要调整亮度）
背景: 深灰色/黑色
文字: 浅色
```

## 🎯 场景化使用建议

### 首页设计
```
Logo: /yyc3-logo-blue.png
角色头像: 
  - 男孩: /role-photos/boy/xiaoyan-casual-001.png
  - 女孩: /role-photos/girl/xiaoyu-lolita-pink-001.png
背景图: 根据主题选择合适的角色照片
```

### 登录/注册页
```
Logo: /yyc3-logo-blue.png 或 /yyc3-logo-white.png（根据背景）
用户头像: /placeholder-user.jpg（未登录状态）
```

### 个人中心
```
用户头像: 
  - 男孩: /role-photos/boy/xiaoyan-formal-001.png
  - 女孩: /role-photos/girl/xiaoyu-school-blue-015.png
Logo: /yyc3-logo-gray.png（页脚）
```

### 学习页面
```
角色头像: 
  - 男孩: /role-photos/boy/xiaoyan-formal-001.png
  - 女孩: /role-photos/girl/xiaoyu-school-blue-015.png
Logo: /yyc3-logo-blue.png
```

### 创意活动页
```
角色头像: 
  - 男孩: /role-photos/boy/xiaoyan-cool-001.png
  - 女孩: /role-photos/girl/xiaoyu-lolita-blue-008.png
Logo: /yyc3-logo-red.png（强调活力）
```

### 双人互动场景
```
联合头像: /role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png
Logo: /yyc3-logo-blue.png
```

### 公益活动页
```
角色头像: 
  - 男孩: /role-photos/boy/xiaoyan-casual-002.png
  - 女孩: /role-photos/girl/xiaoyu-lolita-pink-002.png
Logo: /yyc3-logo-blue.png
```

### 有声绘本页
```
角色头像: 
  - 男孩: /role-photos/boy/xiaoyan-casual-003.png
  - 女孩: /role-photos/girl/xiaoyu-lolita-pink-003.png
Logo: /yyc3-logo-blue.png
```

### 消息中心
```
用户头像: /placeholder-user.jpg（未登录）
Logo: /yyc3-logo-gray.png（页脚）
```

### 设置管理页
```
用户头像: 
  - 男孩: /role-photos/boy/xiaoyan-formal-002.png
  - 女孩: /role-photos/girl/xiaoyu-school-blue-016.png
Logo: /yyc3-logo-gray.png（页脚）
```

## 📦 资源打包建议

### Figma 资源库结构
```
YYC3-XY-Design-Assets/
├── Logos/
│   ├── YYC3-Logo-Blue.png
│   ├── YYC3-Logo-White.png
│   ├── YYC3-Logo-Black.png
│   ├── YYC3-Logo-Gray.png
│   ├── YYC3-Logo-Red.png
│   ├── YYC3-Logo-R_Blue.png
│   ├── YYC3-White.png
│   └── YYC3-PWA-Icon.png
├── Avatars/
│   ├── Boy-Xiaoyan/
│   │   ├── AI-Avatars/
│   │   │   ├── Casual-001.png
│   │   │   ├── Casual-002.png
│   │   │   ├── Casual-003.png
│   │   │   ├── Cool-001.png
│   │   │   └── Cool-002.png
│   │   ├── Casual/
│   │   ├── Cool/
│   │   └── Formal/
│   ├── Girl-Xiaoyu/
│   │   ├── AI-Avatars/
│   │   │   ├── Lolita-Blue-001.png
│   │   │   ├── Lolita-Blue-002.png
│   │   │   ├── Lolita-Pink-001.png
│   │   │   └── Lolita-Pink-002.png
│   │   ├── Lolita-Blue/
│   │   ├── Lolita-Pink/
│   │   └── School/
│   └── Joint/
│       └── Cute/
├── Placeholders/
│   ├── Logo/
│   ├── User/
│   └── Image/
└── Icons/
    └── icon.svg
```

## ⚠️ 注意事项

1. **版权声明**
   - 所有资源仅限 YYC3-XY 项目内部使用
   - 不得用于其他商业项目

2. **图片优化**
   - 导入 Figma 前可适当压缩图片
   - 保持原始分辨率以保证质量
   - SVG 格式优先用于图标和 Logo

3. **版本管理**
   - 保持资源与 public 目录同步
   - 更新资源时及时更新 Figma 组件库
   - 记录资源变更历史

4. **性能考虑**
   - 避免使用过大尺寸的图片
   - 根据显示场景选择合适尺寸
   - 使用 WebP 格式可进一步优化

5. **一致性**
   - 同一角色在同一场景下使用相同风格的照片
   - Logo 在同一页面中保持一致
   - 占位图统一使用项目标准占位资源

## 🔄 资源更新流程

1. **新增资源**
   ```
   1. 将新资源放入 public 对应目录
   2. 更新本文档
   3. 导入 Figma 并创建组件
   4. 通知团队成员
   ```

2. **更新资源**
   ```
   1. 替换 public 目录中的资源文件
   2. 更新 Figma 中的对应组件
   3. 检查所有使用该资源的设计稿
   4. 更新文档记录
   ```

3. **删除资源**
   ```
   1. 确认资源未被使用
   2. 从 public 目录删除
   3. 从 Figma 组件库删除
   4. 更新文档
   ```

## 📊 资源统计

### 总计资源数量
- **Logo 系列**: 7 个文件
- **应用图标**: 2 个文件
- **男孩角色**: 22 个文件（5个AI头像 + 17张照片）
- **女孩角色**: 18 个文件（4个AI头像 + 14张照片）
- **联合头像**: 3 个文件
- **占位资源**: 4 个文件
- **UI页面图示**: 11 个文件（仅参考使用）
- **其他文件**: 2 个文件（manifest.json, sw.js）

**Figma 可用资源总计**: 56 个文件（不含 UI页面图示、manifest.json、sw.js）

### 按类型分类
```
Logo: 7 个
头像: 43 个（男孩22个 + 女孩18个 + 联合3个）
占位图: 4 个
图标: 2 个
```

## 📞 技术支持

如有资源使用问题，请联系：
- 项目负责人：YYC³ Team
- 邮箱：admin@0379.email

---

<div align="center">

> 「***智能插拔式移动AI系统***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
> **GitHub**: <https://github.com/YYC-Cube/yyc3_xiaoyu_ai> | **官网**: <https://yyc3.ai>

</div>
