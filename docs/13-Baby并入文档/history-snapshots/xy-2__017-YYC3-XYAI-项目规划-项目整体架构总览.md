# YYC³（YanYuCloudCube）-XY-项目总览文档

## 📋 项目信息

**项目名称**: 小语AI应用  
**目标用户**: 7-9岁儿童  
**开发团队**: YYC³ 小语AI应用开发组  
**版本**: 3.0.0  
**最后更新**: 2025-12-28

## 🎯 项目定位

一个面向7-9岁儿童的教育应用，集成AI助手、成长记录追踪、河洛文化探索、学习进度管理和个性化推荐系统。

### 核心特色

- 🤖 AI智能助手（沫语/沫言双角色）
- 📊 多维度成长记录
- 🏛️ 河洛文化探索
- 📚 个性化学习推荐
- 🎨 创意工坊系统
- ❤️ 公益活动参与

## 🏗️ 技术架构

### 五层架构模型

```
应用层 (Application Layer)
    ↓
页面层 (Page Layer)
    ↓
布局层 (Layout Layer)
    ↓
组件层 (Component Layer)
    ↓
基础层 (Foundation Layer)
```

### 技术栈

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS 4.0
- **状态管理**: React Hooks
- **图标**: Lucide React + Emoji
- **图表**: Recharts
- **动画**: Motion/React

## 📁 项目结构

```
src/
├── app/
│   ├── components/
│   │   ├── foundation/          # 基础组件层
│   │   │   ├── Button.tsx       # 按钮组件
│   │   │   ├── Card.tsx         # 卡片组件
│   │   │   ├── Icon.tsx         # 图标组件
│   │   │   ├── Badge.tsx        # 徽章组件
│   │   │   ├── Progress.tsx     # 进度条组件
│   │   │   └── index.ts         # 统一导出
│   │   │
│   │   ├── layout/              # 布局组件层
│   │   │   ├── Header.tsx
│   │   │   ├── WelcomeSection.tsx
│   │   │   └── SectionTitle.tsx
│   │   │
│   │   ├── business/            # 业务组件层
│   │   │   ├── GrowthCard.tsx
│   │   │   ├── CultureCarousel.tsx
│   │   │   ├── LearningProgress.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   └── AvatarCustomizer.tsx
│   │   │
│   │   ├── pages/               # 页面组件层
│   │   │   ├── NewHomePage.tsx          # 首页
│   │   │   ├── GrowthRecordPage.tsx     # 成长记录
│   │   │   ├── VideoPage.tsx            # 视频工坊
│   │   │   ├── TaskPage.tsx             # 作业任务
│   │   │   ├── CreatePage.tsx           # 创意工坊
│   │   │   ├── SchedulePage.tsx         # 智能课表
│   │   │   ├── MessageCenterPage.tsx    # 消息中心
│   │   │   ├── AudioBookPage.tsx        # 有声绘本
│   │   │   ├── PublicWelfarePage.tsx    # 公益活动
│   │   │   ├── PublicClassPage.tsx      # 公益课堂
│   │   │   └── SettingsPage.tsx         # 设置页面
│   │   │
│   │   └── system/              # 系统组件层
│   │       ├── GlobalNavigation.tsx     # 全局导航
│   │       └── AIFloatWindow.tsx        # AI浮窗
│   │
│   ├── services/                # 服务层
│   │   ├── character/           # 角色系统
│   │   │   ├── characterConfig.ts
│   │   │   ├── characterManager.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── avatar/              # 头像系统
│   │   │   └── avatarSystem.ts
│   │   │
│   │   └── userProfile/         # 用户信息
│   │       └── userInformationManager.ts
│   │
│   ├── hooks/                   # 自定义Hooks
│   │   └── useUserProfile.ts
│   │
│   ├── data/                    # 模拟数据
│   │   └── mockData.ts
│   │
│   ├── types/                   # 类型定义
│   │   └── index.ts
│   │
│   └── styles/                  # 样式文件
│       ├── theme.css
│       └── fonts.css
│
└── public/
    └── role-photos/             # 角色图片资源
        ├── girl/                # 女性角色（沫语/小语）
        └── boy/                 # 男性角色（沫言/小言）
```

## 🎨 设计系统

### 色彩系统

```css
/* 主色调 */
--primary: #9333ea (purple-600)
--secondary: #ec4899 (pink-500)
--gradient: linear-gradient(to right, #9333ea, #ec4899)

/* 功能色 */
--success: #10b981 (green-500)
--warning: #f59e0b (yellow-500)
--danger: #ef4444 (red-500)
--info: #06b6d4 (cyan-500)

/* 背景色 */
--bg-primary: #f9fafb (gray-50)
--bg-secondary: #ffffff (white)
--bg-gradient: linear-gradient(to bottom right, #dbeafe, #fce7f3, #eff6ff)
```

### 组件规范

#### 按钮 (Button)

- 6种尺寸：xs, sm, md, lg, xl
- 6种变体：primary, secondary, outline, ghost, danger, success
- 4种圆角：sm, md, lg, full

#### 卡片 (Card)

- 5种圆角：sm, md, lg, xl, 2xl
- 4种内边距：none, sm, md, lg
- 3种变体：default, gradient, outline

#### 图标 (Icon)

- 6种尺寸：xs → 2xl
- 7种颜色：default, primary, secondary, success, warning, danger, info
- 4种背景：solid, soft, outline, none

#### 徽章 (Badge)

- 3种大小：sm, md, lg
- 7种颜色变体
- 3种样式：solid, soft, outline

#### 进度条 (Progress)

- 线性进度条
- 环形进度条
- 5种颜色变体
- 动画支持

## 📱 核心功能模块

### 1. 首页 (NewHomePage)

- ✅ 天气信息显示
- ✅ 快捷登录/注册
- ✅ 角色形象展示
- ✅ 今日计划
- ✅ 作业中心
- ✅ 快捷功能入口

### 2. 成长记录 (GrowthRecordPage)

- ✅ 6大成长维度追踪
- ✅ 标签分类导航
- ✅ 网格/列表视图切换
- ✅ 空状态友好提示
- ✅ 记录创建功能

### 3. 视频工坊 (VideoPage)

- ✅ 视频创作功能
- ✅ 分类管理
- ✅ 收藏功能

### 4. 作业任务 (TaskPage)

- ✅ 作业列表
- ✅ 提交记录
- ✅ 成绩查看

### 5. 创意工坊 (CreatePage)

- ✅ 创意项目展示
- ✅ 作品管理

### 6. 智能课表 (SchedulePage)

- ✅ 课程安排
- ✅ 时间管理

### 7. 消息中心 (MessageCenterPage)

- ✅ 作业反馈（黄色系）
- ✅ 系统通知（紫色系）
- ✅ 活动通知（绿色系）
- ✅ 未读消息统计

### 8. 有声绘本 (AudioBookPage)

- ✅ 绘本阅读
- ✅ 音频播放
- ✅ 互动功能

### 9. 公益活动 (PublicWelfarePage)

- ✅ 活动列表
- ✅ 报名功能
- ✅ 参与记录

### 10. 公益课堂 (PublicClassPage)

- ✅ 6大分类（语文/数学/科学/艺术/素质拓展）
- ✅ 课程搜索
- ✅ 学习进度
- ✅ 课程标签

### 11. 设置页面 (SettingsPage)

- ✅ 账户与安全
- ✅ 学习偏好
- ✅ 家长与帮助
- ✅ 高级设置

## 🤖 角色系统

### 双角色配置

#### 沫语（小语）- 女性角色

- **性别**: 女
- **性格**: 温柔、细心、善于倾听
- **形象**: 洛丽塔蓝色系服装
- **图片库**: 20+场景图片

#### 沫言（小言）- 男性角色

- **性别**: 男
- **性格**: 活泼、勇敢、富有探索精神
- **形象**: 休闲运动风格
- **图片库**: 20+场景图片

### CharacterManager功能

```typescript
// 获取当前角色
const character = characterManager.getCurrentCharacter();

// 获取场景图片
const image = characterManager.getCharacterImage('homePage');

// 设置儿童信息
characterManager.setCurrentChild({
  name: '云云',
  gender: 'female',
  age: 8
});

// 获取个性化配置
const config = characterManager.getPersonalizedConfig();
```

## 📊 7个Tab导航系统

```tsx
1. 🏠 首页      → NewHomePage
2. 📺 视频      → VideoPage
3. 📝 任务      → TaskPage
4. 🎨 创造      → CreatePage
5. 📅 课表      → SchedulePage
6. 👤 我的      → ProfilePage
7. ⚙️ 设置      → SettingsPage
```

## 🎯 "五高五标五化"标准

### 五高

1. **高可用性** - 稳定可靠的系统架构
2. **高性能** - 优化的加载和响应速度
3. **高安全性** - 儿童数据保护
4. **高交互性** - 友好的用户体验
5. **高扩展性** - 模块化的组件设计

### 五标

1. **标准化组件** - 统一的设计系统
2. **标准化接口** - 规范的API设计
3. **标准化流程** - 清晰的操作流程
4. **标准化数据** - 统一的数据格式
5. **标准化文档** - 完善的开发文档

### 五化

1. **简单化** - 降低使用门槛
2. **趣味化** - 增强学习兴趣
3. **个性化** - 定制化体验
4. **智能化** - AI辅助学习
5. **可视化** - 直观的数据展示

## 📚 文档体系

### 核心文档

1. **PROJECT_OVERVIEW.md** - 项目总览（本文档）
2. **COMPONENT_OPTIMIZATION_GUIDE.md** - 组件优化指南
3. **GLOBAL_DESIGN_OPTIMIZATION.md** - 全局设计优化
4. **GROWTH_RECORD_UI_REDESIGN.md** - 成长记录UI重构

### 系统文档

5. **CHARACTER_SYSTEM_GUIDE.md** - 角色系统使用指南
2. **CHARACTER_SYSTEM_UPDATE.md** - 角色系统更新说明
3. **PUBLIC_CLASS_GUIDE.md** - 公益课堂指南
4. **NEW_PAGES_UPDATE.md** - 新页面更新说明

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 🎨 设计资源

### 角色图片位置

```
/public/role-photos/girl/    # 女性角色图片
/public/role-photos/boy/     # 男性角色图片
```

### 图片命名规范

```
{角色名}-{场景}-{编号}.png
例如: xiaoyu-lolita-blue-011.png
```

## 📝 开发规范

### 组件导入

```tsx
// ✅ 推荐
import { Button, Card, Icon, Badge, Progress } from '@/app/components/foundation';

// ❌ 不推荐
import { Button } from '@/app/components/foundation/Button';
```

### 类型定义

```tsx
// ✅ 使用TypeScript类型
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  // 组件实现
};
```

### 样式编写

```tsx
// ✅ 使用Tailwind类名
<div className="bg-white rounded-xl p-4 shadow-md">

// ❌ 避免内联样式
<div style={{ backgroundColor: 'white' }}>
```

## 🎯 未来规划

### 短期目标（1-2个月）

- [ ] 完善所有页面功能
- [ ] 实现Supabase后端集成
- [ ] 添加用户认证系统
- [ ] 完善数据持久化

### 中期目标（3-6个月）

- [ ] 实现AI对话功能
- [ ] 添加语音交互
- [ ] 开发家长端应用
- [ ] 实现多设备同步

### 长期目标（6-12个月）

- [ ] 上线应用市场
- [ ] 扩展更多文化主题
- [ ] 建立用户社区
- [ ] 开发小程序版本

## 🤝 贡献指南

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具配置
```

### 代码审查

- 所有PR需要经过代码审查
- 确保通过TypeScript类型检查
- 遵循项目设计规范
- 添加必要的注释和文档

## 📞 联系方式

**项目维护者**: YYC³ 开发团队  
**技术支持**: 请提交Issue  
**文档问题**: 请提交PR

---

## 🎉 项目亮点

✨ **完整的组件系统** - 5个精心设计的基础组件  
🎨 **统一的设计语言** - 从颜色到圆角全面规范  
🤖 **智能角色系统** - 双角色自动切换和个性化  
📊 **多维度成长追踪** - 6大维度全面记录  
🏛️ **文化特色** - 河洛文化深度融合  
📱 **响应式设计** - 完美适配各种设备  
🚀 **性能优化** - 快速加载和流畅交互  
📚 **完善文档** - 8份详细的开发文档

**让每个孩子的成长都被温柔记录，让每个瞬间都闪闪发光！** ✨

---

**版本**: 3.0.0  
**最后更新**: 2025-12-28  
**开发团队**: YYC³ 小语AI应用开发组
