# YYC³-XY-01 优先级开发计划（基于现有代码）

**更新时间**: 2026-01-02
**项目状态**: P0-1 服务编排器已完成 ✅
**规划依据**: 现有完整 UI/UX 页面 + 新增功能需求

---

## 📊 现状分析

### ✅ 已完成的页面（11个UI图示对应）

| UI图示 | 现有实现 | 状态 | 说明 |
|--------|----------|------|------|
| 首页界面 | `app/page.tsx` + `app/[locale]/page.tsx` | ✅ 完整 | 包含AI助手、今日计划、作业中心 |
| 成长记录 | `app/growth/page.tsx` | ✅ 完整 | 成长记录、评估、图表 |
| 消息中心 | `app/messages/page.tsx` | ✅ 完整 | 消息列表、详情 |
| 设置管理 | `app/settings/page.tsx` | ✅ 完整 | 设置、配置 |
| 作业任务 | `app/homework/` | ✅ 存在 | 作业相关功能 |
| 公益活动 | `app/activities/` | ✅ 存在 | 活动页面 |
| 智能课表 | `app/schedule/page.tsx` | ✅ 完整 | 课程表、时间表 |
| 有声绘本 | `app/books/page.tsx` | ✅ 完整 | 绘本阅读 |
| 视频工坊 | `app/videos/` | ✅ 存在 | 视频功能 |
| 公益课堂 | `app/courses/` | ✅ 存在 | 课程学习 |
| 创意工坊 | `app/ai-creative/` | ✅ 存在 | AI创作 |

### ✅ 已完成的后端能力（从 xy-02/03/05 整合）

| 能力 | 来源 | 状态 |
|------|------|------|
| 服务编排器 | xy-03 | ✅ 已集成到 API |
| AI引擎系统 | xy-05 | ✅ 17个核心文件 |
| AI角色协调器 | xy-05 | ✅ role-coordinator.ts |
| 智能推荐系统 | xy-05 | ✅ intelligent-recommendation-system.ts |
| 自定义Hooks | xy-02 | ✅ 23个hooks |
| Docker配置 | xy-03 | ✅ 5个配置文件 |

---

## 🎯 优先级计划

### 【P0】核心新功能 - 必须完成

#### ✅ P0-1: 服务编排器集成
**状态**: 已完成
**交付物**:
- API 路由: `app/api/services/orchestrator/route.ts`
- 客户端: `lib/orchestrator-client.ts`
- 监控组件: `components/ServiceMonitor.tsx`
- 测试页面: `/test-orchestrator`

---

#### 🎨 P0-2: AI角色切换UI
**优先级**: 🔴 最高
**预估时间**: 3-4小时
**说明**: 这是唯一需要新建的功能

**需要创建**:

```
components/ai-roles/
├── RoleSwitcher.tsx          # 角色切换器主组件
│   ├── 角色卡片展示（6个角色）
│   ├── 角色选择交互
│   └── 角色状态显示
├── RoleCard.tsx              # 单个角色卡片
└── RoleBadge.tsx             # 角色徽章（小尺寸）

store/ai-roles/
├── slice.ts                  # Redux slice
├── selectors.ts              # 选择器
└── types.ts                  # 类型定义

hooks/
└── useAIRole.ts              # 角色管理Hook
```

**集成点**:
- 在现有首页 (`app/page.tsx`) 添加角色切换入口
- 连接到 `lib/ai/role-coordinator.ts`
- 使用现有的角色图片资源 `public/role-photos/`

**6个AI角色**:
1. 陪伴者 (Companion)
2. 记录者 (Recorder)
3. 守护者 (Guardian)
4. 倾听者 (Listener)
5. 顾问 (Advisor)
6. 国粹导师 (Cultural Mentor)

**验收标准**:
- [x] 角色切换器组件创建
- [x] 集成到首页
- [x] 连接到 role-coordinator
- [x] 角色切换后AI回复风格改变
- [x] 状态持久化

---

### 【P1】系统增强 - 重要功能

#### 🕸️ P1-1: 知识图谱服务配置
**优先级**: 🟡 高
**预估时间**: 2-3小时
**说明**: 配置已有服务，不是新建

**任务清单**:
- [ ] 配置 Neo4j 环境变量
- [ ] 启动 Neo4j Docker 容器
- [ ] 测试 `services/knowledge/` 连接
- [ ] 验证知识图谱 API

**已存在的代码**:
- `services/knowledge/KnowledgeManager.ts`
- `docker-compose.knowledge-graph.yml`

**需要添加**:
```env
# .env.local
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

---

#### 🐳 P1-2: Docker部署测试
**优先级**: 🟡 高
**预估时间**: 1-2小时
**说明**: 测试已有配置

**测试清单**:
- [ ] `docker-compose.yml` - 基础服务
- [ ] `docker-compose.microservices.yml` - 微服务
- [ ] `docker-compose.knowledge-graph.yml` - 知识图谱
- [ ] `docker-compose.ollama.yml` - 本地AI

**已有配置**:
- 5个 docker-compose 文件
- `Dockerfile`
- 部署脚本

---

#### 📊 P1-3: 智能推荐系统集成
**优先级**: 🟡 高
**预估时间**: 2-3小时
**说明**: 集成已有推荐系统到现有页面

**集成点**:
- 在首页添加推荐卡片
- 在作业页面添加题目推荐
- 在成长页面添加成长建议

**已存在的代码**:
- `lib/ai/intelligent-recommendation-system.ts` (1218行)

**需要创建**:
- `components/recommendation/RecommendationCard.tsx`
- `app/api/recommendations/route.ts`

---

### 【P2】优化工作 - 有时间再做

#### 🚀 P2-1: 技术栈升级
**优先级**: 🟢 中
**预估时间**: 4-6小时
**风险**: 中等（可能有 breaking changes）

**升级目标**:
```diff
- "next": "^14.2.35"
+ "next": "^15.0.0"  # 稳定版本

- "react": "^18.3.1"
+ "react": "^19.0.0"  # 最新稳定版
```

---

#### 🧪 P2-2: 集成测试
**优先级**: 🟢 中
**预估时间**: 4-5小时

**测试范围**:
- 服务编排器 API
- AI 角色切换
- 知识图谱查询
- 推荐系统

---

#### ⚡ P2-3: 性能优化
**优先级**: 🟢 低
**预估时间**: 3-4小时

**优化项**:
- 代码分割
- 图片优化
- 缓存策略
- AI 响应缓存

---

#### 📚 P2-4: 文档完善
**优先级**: 🟢 低
**预估时间**: 2-3小时

**文档内容**:
- API 文档
- 部署指南
- 开发指南

---

## 📅 开发时间线

### Week 1: 核心功能
| Day | 任务 | 状态 |
|-----|------|------|
| 1 | P0-2: AI角色切换UI | 🔴 待开始 |
| 2 | P0-2: AI角色切换UI | 🔴 进行中 |
| 3 | P0-2: AI角色切换UI | 🔴 进行中 |
| 4 | P1-1: 知识图谱配置 | 🟡 待开始 |
| 5 | P1-2: Docker测试 | 🟡 待开始 |

### Week 2-3: 优化
| 周次 | 任务 |
|------|------|
| Week 2 | P1-3 智能推荐 + P2-1 技术栈升级 |
| Week 3 | P2-2 测试 + P2-3 优化 + P2-4 文档 |

---

## 🎯 立即行动

**下一步**: P0-2 AI角色切换UI

**需要创建**:
```
components/ai-roles/RoleSwitcher.tsx
hooks/useAIRole.ts
store/ai-roles/slice.ts
```

**集成到**:
```
app/page.tsx (现有首页)
lib/ai/role-coordinator.ts (已有)
```

---

**准备开始 P0-2 AI角色切换UI吗？**
- "开始 P0-2" → 立即开发
- "先做 P1-1" → 配置知识图谱
- "先做 P1-2" → 测试Docker部署
