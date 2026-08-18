# YYC³-XY-01 基于UI图示的优先级开发计划

**更新时间**: 2026-01-02
**规划依据**: public/UI页面图示/ 11个真实UI截图
**当前状态**: P0-1 服务编排器集成 ✅ 已完成

---

## 📋 UI 页面清单

| 序号 | 页面名称 | 文件名 | 大小 | 优先级 |
|------|----------|--------|------|--------|
| 1 | 首页界面 | 首页界面.png | 626KB | 🔴 P0 |
| 2 | 成长记录 | 成长记录.png | 478KB | 🟡 P1 |
| 3 | 消息中心 | 消息中心.png | 330KB | 🟡 P1 |
| 4 | 设置管理 | 设置管理.png | 333KB | 🟢 P2 |
| 5 | 作业任务 | 作业任务.png | 189KB | 🔴 P0 |
| 6 | 公益活动 | 公益活动.png | 575KB | 🟢 P2 |
| 7 | 智能课表 | 智能课表.png | 310KB | 🟡 P1 |
| 8 | 有声绘本 | 有声绘本.png | 209KB | 🟢 P2 |
| 9 | 视频工坊 | 视频工坊.png | 321KB | 🟢 P2 |
| 10 | 公益课堂 | 公益课堂.png | 315KB | 🟢 P2 |
| 11 | 创意工坊 | 创意工坊.png | 395KB | 🟢 P2 |

---

## 🎯 更新后的优先级计划

### 【第一周】核心页面 - P0 (必须完成)

#### ✅ P0-1: 服务编排器集成
**状态**: 已完成
**交付物**:
- ✅ API 路由: `app/api/services/orchestrator/route.ts`
- ✅ 客户端: `lib/orchestrator-client.ts`
- ✅ 监控组件: `components/ServiceMonitor.tsx`
- ✅ 测试页面: `/test-orchestrator`
- ✅ 测试脚本: `scripts/test-orchestrator.sh`

---

#### 🎨 P0-2: 首页界面重构
**优先级**: 🔴 最高
**预估时间**: 4-6小时
**参考图示**: `public/UI页面图示/首页界面.png`

**基于 UI 分析的组件拆解**:

```
首页布局
├── [1] 顶部状态栏 (StatusBar)
│   ├── 日期显示 (2024年5月23日 星期四)
│   ├── 天气组件 (23℃，适宜户外，太阳图标)
│   └── 快捷操作 (登录/注册/学习打卡/公益活动/家长须知)
│
├── [2] 左侧 AI 助手区 (AIAvatar)
│   ├── 角色形象 (小女孩+吉他+小狗)
│   ├── 标题: "快乐学习助手"
│   └── Slogan: "万象归元于云枢"
│
├── [3] 右侧今日计划区 (TodayPlan)
│   ├── 计划列表
│   │   ├── 背诵古诗《静夜思》 (未完成)
│   │   └── 完成10道口算题 (已完成 ✓)
│   └── 进度统计
│
├── [4] 作业中心区 (HomeworkCenter)
│   ├── 标题: "作业中心"
│   ├── 鼓励语: "云云，保持专注，你最棒啦！"
│   ├── 科目选择 (语文/数学)
│   └── 开始作业按钮 (橙色)
│
├── [5] 功能模块卡片 (FeatureCards)
│   ├── 错题本 (紫色书本图标)
│   ├── 公益课堂 (蓝色对话框图标)
│   └── 心情记录 (粉色笑脸图标)
│
└── [6] 底部导航栏 (BottomNavigation)
    ├── 首页 ✓ (当前选中)
    ├── 视频
    ├── 绘本
    ├── 短剧
    ├── 创作
    ├── 课表
    ├── 成长
    └── 设置
```

**需要创建的组件**:

```typescript
// 组件列表
components/home/
├── StatusBar.tsx              // 顶部状态栏
├── AIAvatar.tsx              // AI助手形象
├── TodayPlan.tsx             // 今日计划
├── HomeworkCenter.tsx        // 作业中心
├── FeatureCards.tsx          // 功能卡片
└── BottomNavigation.tsx      // 底部导航

// 数据 hooks
hooks/
├── useWeather.ts             // 天气API
├── useTodayPlan.ts           // 计划管理
└── useHomework.ts            // 作业管理 (已存在)
```

**API 端点需求**:
```typescript
// 需要创建的API
app/api/
├── weather/route.ts          // GET - 获取天气
├── plans/route.ts            // GET/POST/PUT - 计划管理
└── homework/subjects/route.ts // GET - 获取科目列表
```

**验收标准**:
- [ ] 完整复现 UI 设计
- [ ] AI 助手可点击触发对话
- [ ] 今日计划可添加/完成
- [ ] 作业中心可选择科目
- [ ] 底部导航可切换页面
- [ ] 响应式布局适配

---

#### 📝 P0-3: 作业任务页面
**优先级**: 🔴 最高
**预估时间**: 3-4小时
**参考图示**: `public/UI页面图示/作业任务.png`

**核心功能**:
- 题目展示
- 答题交互
- 答案提交
- 成绩统计

**需要创建的组件**:
```typescript
components/homework/
├── QuestionCard.tsx          // 题目卡片
├── AnswerInput.tsx           // 答案输入
├── SubmitButton.tsx          // 提交按钮
└── ResultDisplay.tsx         // 成绩展示
```

---

### 【第二周】重要页面 - P1 (尽快完成)

#### 📊 P1-1: 成长记录页面
**优先级**: 🟡 高
**预估时间**: 3-4小时
**参考图示**: `public/UI页面图示/成长记录.png`

**核心功能**:
- 成长时间线
- 里程碑展示
- 照片相册
- 数据可视化

---

#### 💬 P1-2: 消息中心页面
**优先级**: 🟡 高
**预估时间**: 2-3小时
**参考图示**: `public/UI页面图示/消息中心.png`

**核心功能**:
- 消息列表
- 消息详情
- 消息类型筛选

---

#### 📅 P1-3: 智能课表页面
**优先级**: 🟡 高
**预估时间**: 2-3小时
**参考图示**: `public/UI页面图示/智能课表.png`

**核心功能**:
- 周课表展示
- 课程详情
- 上课提醒

---

### 【第三周】辅助页面 - P2 (有时间再做)

#### ⚙️ P2-1: 设置管理页面
**参考图示**: `public/UI页面图示/设置管理.png`
**预估时间**: 2-3小时

#### ❤️ P2-2: 公益活动页面
**参考图示**: `public/UI页面图示/公益活动.png`
**预估时间**: 2-3小时

#### 📚 P2-3: 有声绘本页面
**参考图示**: `public/UI页面图示/有声绘本.png`
**预估时间**: 3-4小时

#### 🎬 P2-4: 视频工坊页面
**参考图示**: `public/UI页面图示/视频工坊.png`
**预估时间**: 3-4小时

#### 🏫 P2-5: 公益课堂页面
**参考图示**: `public/UI页面图示/公益课堂.png`
**预估时间**: 2-3小时

#### 🎨 P2-6: 创意工坊页面
**参考图示**: `public/UI页面图示/创意工坊.png`
**预估时间**: 3-4小时

---

## 🔧 技术架构调整

基于 UI 分析，需要调整技术架构：

### 1. 状态管理
```typescript
// 新增状态管理需求
store/
├── home/
│   ├── planSlice.ts          // 今日计划状态
│   └── weatherSlice.ts       // 天气状态
├── homework/
│   ├── currentSlice.ts       // 当前作业状态
│   └── historySlice.ts       // 作业历史
└── ui/
    ├── navigationSlice.ts    // 导航状态
    └── themeSlice.ts         // 主题状态
```

### 2. API 路由规划
```typescript
// 核心API端点
app/api/
├── home/
│   ├── weather/route.ts      // 天气API
│   └── plans/route.ts        // 计划CRUD
├── homework/
│   ├── subjects/route.ts     // 科目列表
│   ├── questions/route.ts    // 题目CRUD
│   └── submit/route.ts       // 提交答案
├── growth/
│   ├── records/route.ts      // 成长记录CRUD
│   └── milestones/route.ts   // 里程碑
├── messages/
│   └── list/route.ts         // 消息列表
└── schedule/
    └── timetable/route.ts    // 课表数据
```

### 3. 组件复用策略
```typescript
// 可复用组件
components/common/
├── Card/                     // 卡片容器
├── Button/                   // 按钮组件
├── Icon/                     // 图标组件
├── Avatar/                   // 头像组件
└── Modal/                    // 弹窗组件
```

---

## 📅 开发时间线

### Week 1: 核心功能 (P0)
| Day | 任务 | 组件 | API |
|-----|------|------|-----|
| 1-2 | 首页重构 | StatusBar, BottomNavigation | weather |
| 3-4 | 首页功能 | AIAvatar, TodayPlan, HomeworkCenter | plans |
| 5 | 作业页面 | QuestionCard, AnswerInput | questions, submit |

### Week 2: 重要功能 (P1)
| Day | 任务 | 页面 |
|-----|------|------|
| 6-7 | 成长记录 | 成长记录页面 |
| 8 | 消息中心 | 消息中心页面 |
| 9-10 | 智能课表 | 智能课表页面 |

### Week 3: 辅助功能 (P2)
| Day | 任务 |
|-----|------|
| 11 | 设置管理 |
| 12 | 公益活动 |
| 13 | 有声绘本 |
| 14 | 视频工坊 |
| 15 | 公益课堂 + 创意工坊 |

---

## 🎯 立即开始

**下一步行动**: P0-2 首页界面重构

需要创建的文件：
```
app/[locale]/page.tsx           # 主页入口
components/home/                 # 首页组件目录
hooks/useWeather.ts              # 天气Hook
hooks/useTodayPlan.ts            # 计划Hook
app/api/home/weather/route.ts    # 天气API
app/api/home/plans/route.ts      # 计划API
```

**开始命令**:
```bash
# 1. 创建首页组件目录
mkdir -p components/home

# 2. 启动开发服务器
bun run dev

# 3. 访问开发页面
# http://localhost:1228
```

---

**准备开始 P0-2 首页重构吗？** 告诉我：
- "开始 P0-2" → 立即重构首页界面
- "先看其他页面" → 分析其他 UI 图示
- "调整计划" → 修改优先级
