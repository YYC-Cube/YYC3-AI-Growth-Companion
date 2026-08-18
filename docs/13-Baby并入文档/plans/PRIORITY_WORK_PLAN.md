# YYC³-XY-01 优先级工作计划

**分析时间**: 2026-01-02
**项目状态**: 整合完成，待集成和优化

---

## 📊 当前状态

### ✅ 已完成
- AI 引擎系统 (17个文件，来自 xy-05)
- 服务编排器 (11个服务，来自 xy-03)
- 自定义 Hooks (23个，来自 xy-02)
- 智能 AI 组件 (IntelligentAIWidget)
- Docker 配置 (5个 docker-compose 文件)
- 部署脚本 (deploy-xy03.sh)

### 📦 技术栈
- **Next.js**: 14.2.35
- **React**: 18.3.1
- **TypeScript**: 5.x
- **运行时**: Bun 1.1.x

### ⚠️ 技术债务
1. 服务编排器已复制但未集成到应用
2. AI 角色系统后端已实现但无 UI
3. 知识图谱服务未配置
4. Docker 部署未测试
5. 技术栈不是最新版本

---

## 🎯 优先级工作计划

### 【P0 - 关键路径】必须完成

#### 1. 集成服务编排器到主应用 ⚡
**优先级**: 🔴 P0 - 最高
**预估时间**: 2-3小时
**依赖**: 无

**任务清单**:
- [ ] 创建 `app/api/services/orchestrator/route.ts`
- [ ] 实现服务调用接口
- [ ] 添加服务健康检查端点
- [ ] 在主应用中初始化 ServiceOrchestrator
- [ ] 测试服务发现和负载均衡

**验收标准**:
- API 端点 `/api/services/orchestrator` 可访问
- 服务编排器能够注册和发现服务
- 服务健康检查正常工作

**代码位置**:
```
需要创建:
  app/api/services/orchestrator/route.ts

需要修改:
  app/layout.tsx (初始化)
  lib/orchestrator-client.ts (客户端封装)
```

---

#### 2. 实现 AI 角色切换 UI 🎨
**优先级**: 🔴 P0 - 最高
**预估时间**: 3-4小时
**依赖**: 无

**任务清单**:
- [ ] 创建 `components/ai-role-switcher/` 目录
- [ ] 实现 `RoleSwitcher.tsx` 组件
- [ ] 创建角色卡片组件 `RoleCard.tsx`
- [ ] 实现角色状态管理 (Redux/Zustand)
- [ ] 添加角色切换动画
- [ ] 集成到主界面

**角色列表**:
1. 陪伴者 (Companion)
2. 记录者 (Recorder)
3. 守护者 (Guardian)
4. 倾听者 (Listener)
5. 顾问 (Advisor)
6. 国粹导师 (Cultural Mentor) - 来自 xy-03

**验收标准**:
- 角色切换器显示所有可用角色
- 点击角色卡片可切换
- 切换后 AI 回复风格改变
- 状态持久化

**代码位置**:
```
需要创建:
  components/ai-role-switcher/
    ├── RoleSwitcher.tsx
    ├── RoleCard.tsx
    ├── RoleSwitcher.module.css
    └── index.ts

  store/ai-roles/
    ├── slice.ts
    ├── selectors.ts
    └── types.ts

需要修改:
  app/[locale]/page.tsx (集成角色切换器)
  lib/ai/role-coordinator.ts (连接UI)
```

---

### 【P1 - 重要】尽快完成

#### 3. 配置知识图谱服务 🕸️
**优先级**: 🟡 P1 - 高
**预估时间**: 2-3小时
**依赖**: Docker 环境

**任务清单**:
- [ ] 配置 Neo4j Docker 容器
- [ ] 创建环境变量配置
- [ ] 实现 Neo4j 连接客户端
- [ ] 创建知识图谱初始化脚本
- [ ] 实现基本的图谱查询 API
- [ ] 测试连接和查询

**环境变量**:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=neo4j
```

**验收标准**:
- Neo4j 容器成功启动
- 能够连接到 Neo4j
- 基本的图谱 CRUD 操作可用

**代码位置**:
```
需要创建:
  lib/db/neo4j-client.ts
  services/knowledge/graph-manager.ts
  app/api/knowledge/graph/route.ts
  docker-compose.knowledge-graph.yml (已存在，需配置)

需要修改:
  .env.local (添加 Neo4j 配置)
```

---

#### 4. 测试 Docker 部署 🐳
**优先级**: 🟡 P1 - 高
**预估时间**: 1-2小时
**依赖**: 无

**任务清单**:
- [ ] 测试基础 docker-compose.yml
- [ ] 测试微服务架构
- [ ] 测试知识图谱服务
- [ ] 测试 Ollama 本地 AI
- [ ] 编写 Docker 部署文档
- [ ] 创建部署验证脚本

**测试命令**:
```bash
# 测试基础服务
docker-compose up -d

# 测试微服务
docker-compose -f docker-compose.microservices.yml up -d

# 测试知识图谱
docker-compose -f docker-compose.knowledge-graph.yml up -d

# 测试本地AI
docker-compose -f docker-compose.ollama.yml up -d
```

**验收标准**:
- 所有容器成功启动
- 服务之间可以通信
- 健康检查通过

---

#### 5. 实现智能推荐系统 UI 📊
**优先级**: 🟡 P1 - 高
**预估时间**: 3-4小时
**依赖**: AI 角色切换

**任务清单**:
- [ ] 创建推荐系统组件
- [ ] 实现推荐卡片展示
- [ ] 添加推荐理由说明
- [ ] 实现推荐反馈机制
- [ ] 集成到用户界面

**代码位置**:
```
需要创建:
  components/recommendation/
    ├── RecommendationPanel.tsx
    ├── RecommendationCard.tsx
    └── index.ts

  app/api/recommendations/route.ts
```

---

### 【P2 - 优化】有时间再做

#### 6. 技术栈升级 🚀
**优先级**: 🟢 P2 - 中
**预估时间**: 4-6小时
**依赖**: 无
**风险**: 中等（可能有 breaking changes）

**升级内容**:
```diff
- "next": "^14.2.35"
+ "next": "^15.0.0"  // 稳定版本

- "react": "^18.3.1"
+ "react": "^19.0.0"  // 最新稳定版

- "react-dom": "^18.3.1"
+ "react-dom": "^19.0.0"
```

**任务清单**:
- [ ] 备份当前项目
- [ ] 升级 Next.js 到 15.x
- [ ] 升级 React 到 19
- [ ] 升级相关依赖
- [ ] 修复 breaking changes
- [ ] 测试所有功能
- [ ] 性能对比测试

**注意事项**:
- React 19 有一些 breaking changes
- Next.js 15 需要 Node.js 18.18+
- 需要测试第三方库兼容性

---

#### 7. 编写集成测试 🧪
**优先级**: 🟢 P2 - 中
**预估时间**: 4-5小时
**依赖**: 所有功能实现

**任务清单**:
- [ ] 设置测试环境
- [ ] 编写 AI 引擎测试
- [ ] 编写服务编排器测试
- [ ] 编写角色切换测试
- [ ] 编写知识图谱测试
- [ ] 设置 CI/CD 测试

**代码位置**:
```
需要创建:
  __tests__/
    ├── ai/
    │   ├── emotion-engine.test.ts
    │   ├── role-coordinator.test.ts
    │   └── recommendation-system.test.ts
    ├── services/
    │   ├── orchestrator.test.ts
    │   └── knowledge.test.ts
    └── integration/
        └── ai-roles.test.tsx
```

---

#### 8. 性能优化 ⚡
**优先级**: 🟢 P2 - 低
**预估时间**: 3-4小时
**依赖**: 功能完整

**任务清单**:
- [ ] 性能分析（Lighthouse）
- [ ] 代码分割优化
- [ ] 图片优化
- [ ] 缓存策略优化
- [ ] AI 响应缓存
- [ ] 懒加载优化

---

#### 9. 文档完善 📚
**优先级**: 🟢 P2 - 低
**预估时间**: 2-3小时
**依赖**: 无

**任务清单**:
- [ ] API 文档
- [ ] 组件文档
- [ ] 部署文档
- [ ] 开发指南
- [ ] 架构说明

---

## 📅 建议实施顺序

### 第一周（核心功能）
1. **Day 1-2**: 集成服务编排器 (P0-1)
2. **Day 3-4**: 实现 AI 角色切换 UI (P0-2)
3. **Day 5**: 测试和修复

### 第二周（重要功能）
4. **Day 6-7**: 配置知识图谱服务 (P1-3)
5. **Day 8**: 测试 Docker 部署 (P1-4)
6. **Day 9-10**: 实现智能推荐 UI (P1-5)

### 第三周（优化）
7. **Day 11-12**: 技术栈升级 (P2-6)
8. **Day 13-14**: 编写集成测试 (P2-7)
9. **Day 15**: 性能优化和文档 (P2-8, P2-9)

---

## 🎯 里程碑

| 里程碑 | 目标 | 预计完成 |
|--------|------|----------|
| M1 | 核心服务可用 | Day 2 |
| M2 | AI 角色切换可用 | Day 4 |
| M3 | 知识图谱运行 | Day 7 |
| M4 | Docker 部署成功 | Day 8 |
| M5 | 技术栈升级完成 | Day 12 |
| M6 | 测试覆盖完整 | Day 14 |

---

## 🚀 快速启动

如果你想立即开始，建议按以下顺序：

### 立即执行（今天）
```bash
# 1. 集成服务编排器
cd /Users/yanyu/yyc3-xy-01
# 创建 API 路由
mkdir -p app/api/services/orchestrator

# 2. 开始 AI 角色切换 UI
mkdir -p components/ai-role-switcher
```

### 本周完成
- P0-1: 服务编排器集成
- P0-2: AI 角色切换 UI

### 下周计划
- P1-3: 知识图谱配置
- P1-4: Docker 部署测试

---

## 📞 需要帮助？

如果需要开始某个任务，告诉我：
- "开始集成服务编排器"
- "创建 AI 角色切换 UI"
- "配置知识图谱"
- "测试 Docker 部署"

我可以帮你立即开始实施！
