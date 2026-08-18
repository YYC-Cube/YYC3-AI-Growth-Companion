/**

* @file YYC3-XY-项目页面清单文档
* @description YYC3-XY-AI项目所有页面文件清单，包含文件名称、功能描述、路径信息
* @module YYC3-XY-架构类
* @author YYC³
* @version 1.0.0
* @created 2025-12-28
* @updated 2025-12-28
* @copyright Copyright (c) 2025 YYC³
* @license MIT
 */

# YYC3-XY-AI 项目页面清单文档

## 文档信息

* **项目名称**: YYC3-XY-AI (小语AI成长守护体系)
* **文档版本**: v1.0.0
* **创建日期**: 2025-12-28
* **最后更新**: 2025-12-28
* **文档状态**: published

---

## 目录

1. [核心页面](#核心页面)
2. [成长管理页面](#成长管理页面)
3. [学习与作业页面](#学习与作业页面)
4. [AI功能页面](#ai功能页面)
5. [内容与媒体页面](#内容与媒体页面)
6. [社交与互动页面](#社交与互动页面)
7. [测试页面](#测试页面)
8. [页面统计汇总](#页面统计汇总)

---

## 核心页面

### 1. 首页 (HomePage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/[locale]/page.tsx`

**功能描述**:

* 应用主入口页面，提供综合仪表板视图
* 显示今日计划、作业中心快捷入口
* 展示小语Q版形象和功能卡片
* 提供底部导航栏，包含7个主要功能入口

**核心特性**:

* 📅 今日计划管理（任务列表、完成状态）
* 🌈 作业中心（语文、数学作业入口）
* 📖 错题本快捷入口
* 🎓 公益课堂入口
* 😊 心情记录入口
* 🤖 小语Q版形象展示
* 📱 底部导航栏（首页、作业中心、课程学习、公益活动、消息中心、成长记录、设置管理）

**技术实现**:

* 使用 Framer Motion 实现动画效果
* 响应式布局设计
* 本地化支持（通过 [locale] 路由参数）
* 组件化设计，包含 PageHeader、Navigation 等组件

**相关组件**:

* PageHeader
* Navigation
* Motion 组件（动画）

---

### 2. 个人资料页 (ProfilePage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/profile/page.tsx`

**功能描述**:

* 用户个人资料管理页面
* 展示用户基本信息和头像
* 提供编辑个人资料功能

**核心特性**:

* 👤 用户头像展示
* ✏️ 个人信息编辑
* 📊 成长数据概览
* ⚙️ 账户设置入口

**技术实现**:

* 表单验证和提交
* 图片上传功能
* 状态管理

---

### 3. 设置页 (SettingsPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/settings/page.tsx`

**功能描述**:

* 应用设置管理中心
* 提供系统配置选项和偏好设置

**核心特性**:

* 🔔 通知设置
* 🎨 主题设置
* 🔒 隐私设置
* 🌐 语言设置
* 📱 应用设置

**技术实现**:

* 设置项分组展示
* 开关控件
* 下拉选择器
* 表单验证

---

## 成长管理页面

### 4. 成长页 (GrowthPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/growth/page.tsx`

**功能描述**:

* 孩子成长记录和追踪页面
* 展示成长时间线、里程碑、数据可视化

**核心特性**:

* 📈 成长数据可视化
* 🎯 里程碑追踪
* 📸 成长相册
* 📊 能力发展雷达图
* 🎉 里程碑庆祝动画
* 📝 成长日记

**技术实现**:

* 使用图表库（如 Recharts）展示数据
* 时间线组件
* 媒体上传和管理
* 动画效果（Framer Motion）

**相关组件**:

* GrowthDataVisualization
* EnhancedGrowthTimeline
* EnhancedMilestoneCelebration
* SmartPhotoAlbumManager

---

### 5. 评估页 (AssessmentPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/growth/assessment/page.tsx`

**功能描述**:

* 孩子发展能力评估页面
* 提供多维度评估问卷和报告生成

**核心特性**:

* 📋 分阶段评估（3-6岁等）
* 🎯 多维度评估（认知、语言、运动、社交、情感）
* 📊 评估报告生成
* 💡 个性化建议
* 📈 进度追踪

**技术实现**:

* 问卷管理系统
* 答案收集和验证
* 评分算法
* 报告生成
* 进度条显示

**相关库**:

* `@/lib/assessment_questions` - 评估问题库

**评估维度**:

* 认知发展（蓝色）
* 语言发展（绿色）
* 运动发展（橙色）
* 社交发展（紫色）
* 情感发展（粉色）
* 创造力（青色）
* 适应能力（黄色）

---

## 学习与作业页面

### 6. 作业页 (HomeworkPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/homework/page.tsx`

**功能描述**:

* 作业管理和完成页面
* 展示待完成作业、已完成作业和错题本

**核心特性**:

* 📚 待完成作业列表
* ✅ 已完成作业记录
* ❌ 错题本
* 📊 作业统计
* ⏰ 作业提醒
* 🎯 作业进度追踪

**技术实现**:

* 作业状态管理
* 作业分类和筛选
* 作业详情展示
* 提交和批改功能

---

### 7. 课程页 (CurriculumPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/curriculum/page.tsx`

**功能描述**:

* 课程内容浏览和学习页面
* 展示课程列表、课程详情和学习进度

**核心特性**:

* 📖 课程列表
* 📚 课程详情
* 🎓 学习进度
* 📊 课程统计
* 🔍 课程搜索
* 🏷️ 课程分类

**技术实现**:

* 课程数据管理
* 学习进度追踪
* 课程播放器
* 互动练习

---

### 8. 课程列表页 (CoursesPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/courses/page.tsx`

**功能描述**:

* 课程目录和推荐页面
* 提供课程分类、推荐和搜索功能

**核心特性**:

* 🎯 课程推荐
* 📂 课程分类
* 🔍 课程搜索
* ⭐ 课程评分
* 👥 学习人数
* 📅 更新时间

**技术实现**:

* 推荐算法
* 搜索和筛选
* 分页加载
* 课程卡片组件

---

### 9. 日程页 (SchedulePage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/schedule/page.tsx`

**功能描述**:

* 日程管理和计划页面
* 展示每日、每周、每月日程安排

**核心特性**:

* 📅 日历视图
* 📋 日程列表
* ⏰ 提醒设置
* 📊 时间统计
* ➕ 添加日程
* ✏️ 编辑日程

**技术实现**:

* 日历组件
* 日程数据管理
* 提醒功能
* 拖拽排序

---

## AI功能页面

### 10. AI聊天页 (AIChatPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/[locale]/ai-chat/page.tsx`

**功能描述**:

* AI智能对话页面
* 提供五大AI角色的对话服务

**核心特性**:

* 🤖 五大AI角色对话
  * 记录员（📝）: 专业记录成长数据和重要时刻
  * 守护员（🛡️）: 智能守护健康和安全
  * 倾听师（👂）: 情感倾听和心理支持
  * 顾问（🎓）: 专业育儿建议和指导
  * 文化导师（📚）: 文化启蒙和素质培养
* 💬 智能对话
* 🎤 语音输入
* 😊 情感识别
* 📝 聊天历史记录
* 🔄 角色切换

**技术实现**:

* 消息状态管理
* 语音识别（VoiceInteraction 组件）
* 情感分析
* 本地存储（localStorage）
* AI响应生成

**相关组件**:

* VoiceInteraction
* Message 组件

**AI角色列表**:

```typescript
const aiRoles = [
  { id: "all", name: "全部角色", avatar: "🤖", color: "bg-purple-100 text-purple-600" },
  { id: "recorder", name: "记录员", avatar: "📝", color: "bg-blue-100 text-blue-600" },
  { id: "guardian", name: "守护员", avatar: "🛡️", color: "bg-green-100 text-green-600" },
  { id: "listener", name: "倾听师", avatar: "👂", color: "bg-pink-100 text-pink-600" },
  { id: "advisor", name: "顾问", avatar: "🎓", color: "bg-yellow-100 text-yellow-600" },
  { id: "cultural", name: "文化导师", avatar: "📚", color: "bg-indigo-100 text-indigo-600" }
]
```

---

### 11. AI创作页 (AICreativePage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/ai-creative/page.tsx`

**功能描述**:

* AI创作工具页面
* 提供AI生成故事、绘画、音乐等创作功能

**核心特性**:

* 🎨 AI绘画生成
* 📖 AI故事创作
* 🎵 AI音乐生成
* 🖼️ 图片编辑
* 📝 文本生成
* 🎭 角色定制

**技术实现**:

* AI模型集成
* 提示词输入
* 生成结果展示
* 参数调整
* 作品保存

---

## 内容与媒体页面

### 12. 视频页 (VideosPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/videos/page.tsx`

**功能描述**:

* AI视频生成和管理页面
* 提供视频生成、播放、收藏等功能

**核心特性**:

* 🎬 AI视频生成
  * 幻灯片视频
  * 动态图（图片转视频）
  * 故事动画
  * 成长回忆视频
* 📺 视频播放
* ⭐ 视频收藏
* 🔍 视频筛选
* 📊 视频统计
* 💾 视频下载

**技术实现**:

* 视频生成器
* 视频播放器
* 筛选和搜索
* 收藏管理
* 网格/列表视图切换

**视频类型**:

```typescript
type FilterType = "all" | "slideshow" | "image-to-video" | "story-animation" | "memory-recap"
```

**相关Hooks**:

* `useAIVideo` - 视频管理
* `useChildren` - 当前孩子信息

---

### 13. 书籍页 (BooksPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/books/page.tsx`

**功能描述**:

* 互动绘本页面
* 提供绘本阅读、收藏、搜索等功能

**核心特性**:

* 📚 绘本库
* 📖 绘本阅读
* 🔍 绘本搜索
* 🏷️ 分类浏览
* ⭐ 收藏管理
* 🎧 语音朗读
* 📊 阅读统计

**技术实现**:

* 绘本阅读器
* 分类筛选
* 搜索功能
* 收藏管理
* 阅读进度追踪

**相关Hooks**:

* `usePictureBook` - 绘本管理

**书籍分类**:

```typescript
type BookCategory = "story" | "knowledge" | "poetry" | "picture" | "interactive"
```

---

### 14. 孩子页 (ChildrenPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/children/page.tsx`

**功能描述**:

* 孩子信息管理页面
* 提供孩子档案、成长数据、照片管理等功能

**核心特性**:

* 👶 孩子档案
* 📊 成长数据
* 📸 照片管理
* 🎯 里程碑记录
* 📝 日记管理
* 🏷️ 标签管理

**技术实现**:

* 孩子数据管理
* 照片上传
* 数据可视化
* 标签系统

---

## 社交与互动页面

### 15. 消息页 (MessagesPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/messages/page.tsx`

**功能描述**:

* 消息中心页面
* 展示作业反馈、系统通知、活动通知等消息

**核心特性**:

* 📬 作业反馈
* 🔔 系统通知
* ❤️ 活动通知
* 📊 未读统计
* ✅ 标记已读
* 🗑️ 删除消息

**技术实现**:

* 消息分类展示
* 未读状态管理
* 消息详情查看
* 批量操作

**消息类型**:

```typescript
type MessageType = "homework" | "system" | "activity"
```

**消息数据结构**:

```typescript
interface Message {
  id: string
  type: "homework" | "system" | "activity"
  icon: string
  iconColor: string
  title: string
  content: string
  time: string
  unread: boolean
  bgColor?: string
}
```

---

### 16. 活动页 (ActivitiesPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/activities/page.tsx`

**功能描述**:

* 公益活动中心页面
* 展示正在进行和历史回顾的公益活动

**核心特性**:

* 💚 正在进行的活动
* 📚 历史回顾
* 👥 参与统计
* ⏰ 截止时间
* 📝 活动详情
* ❤️ 我的参与

**技术实现**:

* 活动列表展示
* Tab切换（正在进行/历史回顾）
* 活动卡片组件
* 参与状态管理

**活动示例**:

* "我的绿色小星球" 线上种植活动
* "为乡村小朋友录制睡前故事"

---

### 17. 互动页 (InteractionsPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/interactions/page.tsx`

**功能描述**:

* 互动活动页面
* 提供亲子互动、游戏等活动内容

**核心特性**:

* 🎮 互动游戏
* 👨‍👩‍👧 亲子活动
* 🎯 互动任务
* 📊 互动统计
* ⭐ 成就系统
* 🏆 排行榜

**技术实现**:

* 游戏组件
* 任务系统
* 成就系统
* 排行榜

---

## 测试页面

### 18. 数据库测试页 (DatabaseTestPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/database-test/page.tsx`

**功能描述**:

* 数据库功能测试页面
* 用于测试数据库连接和操作

**状态**: 文件为空，待实现

---

### 19. 功能亮点测试页 (FeatureHighlightsTestPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/feature-highlights-test/page.tsx`

**功能描述**:

* 功能亮点展示和测试页面
* 展示Day 8-10开发完成的核心功能

**核心特性**:

* 📖 AI语音故事生成
  * 智能故事创作
  * 年龄适配内容
  * 多种语调风格
  * 语音合成播放
  * 个性化定制
* 📈 成长数据可视化
  * 生长曲线追踪
  * 能力发展雷达
  * 活动时间分析
  * 里程碑时间轴
  * 数据导出分享
* 📷 智能相册管理
  * AI自动标签
  * 情感识别分析
  * 智能搜索过滤
  * 多视图展示
  * 批量操作管理

**技术实现**:

* 功能卡片展示
* Tab切换
* 动画效果（Framer Motion）
* 组件集成展示

**相关组件**:

* AIVoiceStoryGenerator
* GrowthDataVisualization
* SmartPhotoAlbumManager

**状态**: 开发完成 ✅

---

### 20. 成长增强测试页 (GrowthEnhancementTestPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/growth-enhancement-test/page.tsx`

**功能描述**:

* 成长记录功能增强测试页面
* 展示Day 3-4开发完成的增强功能

**核心特性**:

* ⏰ 增强时间线
  * 优雅的动画效果
  * 三种视图模式
  * 智能分组展示
  * 交互式详情弹窗
* 🏆 庆祝动画
  * 彩带粒子效果
  * 音符动画
  * 星星爆炸效果
  * 庆祝音效播放
* 📷 智能上传
  * 拖拽上传支持
  * 智能标签生成
  * 缩略图预览
  * 批量管理功能

**技术实现**:

* Tab切换
* 功能演示
* 组件集成展示

**相关组件**:

* EnhancedGrowthTimeline
* EnhancedMilestoneCelebration
* EnhancedMediaUploader

**状态**: 开发完成 ✅

---

### 21. 生日主题测试页 (BirthdayThemeTestPage)

**文件路径**: `/Users/yanyu/yyc3-xy-ai/app/birthday-theme-test/page.tsx`

**功能描述**:

* 生日主题测试页面
* 提供生日主题自定义和预览功能

**核心特性**:

* 🎨 主题控制面板
  * 主题颜色调整（主色调、次色调、强调色）
  * 装饰元素控制（气球、彩带、星星、丝带）
  * 动画和音效控制
* 👁️ 主题预览
  * 按钮样式预览
  * 卡片样式预览
  * 整体效果预览
* 🎂 生日装饰
* 📸 纪念相册
* ⏰ 倒计时

**技术实现**:

* 主题提供者（BirthdayThemeProvider）
* 装饰组件（BirthdayDecorations）
* 纪念相册（XiaoyuMemorialAlbum）
* 倒计时组件（BirthdayCountdown）
* 颜色选择器
* 开关控件

**相关组件**:

* BirthdayThemeProvider
* BirthdayDecorations
* XiaoyuMemorialAlbum
* BirthdayCountdown

---

## 页面统计汇总

### 页面总数: 21个

#### 按功能分类统计

| 分类 | 页面数量 | 占比 |
|------|----------|------|
| 核心页面 | 3 | 14.3% |
| 成长管理页面 | 2 | 9.5% |
| 学习与作业页面 | 4 | 19.0% |
| AI功能页面 | 2 | 9.5% |
| 内容与媒体页面 | 3 | 14.3% |
| 社交与互动页面 | 3 | 14.3% |
| 测试页面 | 4 | 19.0% |

#### 按开发状态统计

| 状态 | 页面数量 | 占比 |
|------|----------|------|
| 已完成 | 20 | 95.2% |
| 待实现 | 1 | 4.8% |

#### 按技术复杂度统计

| 复杂度 | 页面数量 | 占比 |
|--------|----------|------|
| 高复杂度 | 7 | 33.3% |
| 中复杂度 | 10 | 47.6% |
| 低复杂度 | 4 | 19.0% |

**高复杂度页面**:

1. AI聊天页 (AIChatPage) - 五大AI角色、语音交互、情感识别
2. 成长页 (GrowthPage) - 数据可视化、时间线、里程碑
3. 评估页 (AssessmentPage) - 多维度评估、报告生成
4. 视频页 (VideosPage) - AI视频生成、播放管理
5. 书籍页 (BooksPage) - 绘本阅读、语音朗读
6. 功能亮点测试页 (FeatureHighlightsTestPage) - 多功能集成
7. 成长增强测试页 (GrowthEnhancementTestPage) - 动画效果、媒体管理

---

## 技术栈汇总

### 前端框架

* **Next.js** - React框架

* **React** - UI库
* **TypeScript** - 类型系统

### UI组件库

* **Framer Motion** - 动画库

* **Lucide React** - 图标库
* **Tailwind CSS** - 样式框架

### 状态管理

* **React Hooks** - useState, useEffect, useMemo

* **Context API** - 全局状态

### 数据管理

* **LocalStorage** - 本地存储

* **Custom Hooks** - 业务逻辑封装

### 路由

* **Next.js App Router** - 文件系统路由

* **动态路由** - [locale] 参数化路由

### 表单处理

* **表单验证**

* **输入组件**
* **开关控件**

### 媒体处理

* **图片上传**

* **视频播放**
* **音频播放**

### AI功能

* **语音识别**

* **情感分析**
* **AI对话**
* **内容生成**

---

## 相关文档

* [YYC3-XY-架构类-UI-UX全量设计体系整合文档.md](./YYC3-XY-架构类-UI-UX全量设计体系整合文档.md)
* [YYC3-XY-AI角色与浮窗系统设计衔接方案.md](./YYC3-XY-AI角色与浮窗系统设计衔接方案.md)
* [YYC3-XY-角色信息管理器详细文档.md](./YYC3-XY-角色信息管理器详细文档.md)

---

## 更新日志

### v1.0.0 (2025-12-28)

* 初始版本发布

* 完成21个页面的功能分析
* 生成完整的页面清单文档

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
