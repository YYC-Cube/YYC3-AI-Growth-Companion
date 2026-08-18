# 架构设计（Architecture）

> 对齐实况：2026-08-19 · 统一基线 v3.2.x
> 配套可视化图表见 [README §可视化架构](../README.md#-可视化架构)

## 1. 总体形态

四层单仓库架构（monorepo-lite），SSR 优先：

```
客户端（React 19 · App Router）
   ↓ fetch / SSE
Middleware（next-intl 语言路由 + 缓存/性能头）
   ↓
API 路由层（15 个服务端路由）
   ↓
服务层（lib/ 领域模块）
   ↓
存储与外部服务（SQLite · BigModel · fal.ai）
```

**设计原则**

1. **密钥不出服务端**：浏览器永不直连付费 AI 服务，一律代理
2. **降级优先**：所有外部依赖（模型/网关）缺失时回退本地实现，服务不中断
3. **单一数据源**：每个领域一个服务模块（badges 一个 service、数据一个 server 层）
4. **版本控制完整性**：.gitignore 规则一律根锚定（十例地雷的教训）

## 2. 技术选型与理由

| 领域 | 选型 | 理由 |
|---|---|---|
| 框架 | Next.js 16.3.1（App Router + Turbopack） | SSR + API Routes 一体；与 React 19 同代 |
| 运行时 | Node ≥ 22.5 / Bun | `node:sqlite` 原生驱动；bun 管包与测试 |
| 数据库 | SQLite（WAL） | 单机零运维；儿童数据本地落盘；外键约束 |
| AI 网关 | BigModel GLM（OpenAI 兼容） | 中文育儿场景效果 + 兼容协议可替换 |
| AI SDK | ai + @ai-sdk/openai（`provider.chat()`） | Chat Completions 是兼容网关的最大公约数 |
| i18n | next-intl v4 + 自研 i18n-core | 应用路由 / 通用运行时双轨，见 §6 |
| 监控 | prom-client + /api/metrics | 与既有 prometheus 配置即插即用 |
| 测试 | bun:test | 零配置、快（497 用例 4s） |

## 3. 模块地图

```
lib/
├── ai/model-provider.ts     # ① 统一模型工厂（唯一 AI 出口）
├── ai_roles.ts              # ② 六角色提示词编排（companion/recorder/listener/advisor/guardian/cultural）
├── db/server.ts             # ③ 数据层唯一入口（assertTable 白名单 + JSON 列序列化）
├── db/sqlite-client.ts      #    node:sqlite 封装（WAL/外键/种子/事务）
├── i18n-core/               # ④ 自研零依赖 i18n（引擎/ICU/插件/检测/RTL）
├── data/badgeMockData.ts    # ⑤ 勋章唯一数据源（22 枚 / 10 套系）
├── monitoring/metrics.ts    # ⑥ prom-client 注册表 + 业务计数器
└── logger.ts                # ⑦ 结构化日志
src/services/badgeService.ts # ⑧ 勋章唯一服务（SSR 安全）
i18n/ + messages/            # ⑨ next-intl v4 运行时配置
```

关键约束：

- **①** 是全库唯一的模型实例来源；未配密钥返回 `null`，调用方必须降级。
  勿在其他位置 `createOpenAI`
- **③** 是全库唯一的 SQL 入口；新表需同步 SCHEMA 与白名单
- **⑤⑧** 徽章数据与服务各自唯一，页面与 API 共享

## 4. 关键链路

### 4.1 AI 对话（真实 → 降级）

```
useAIXiaoyu(浮窗/hook)
  → POST /api/ai/chat {message, role?}
    → selectRoleByContext()（关键词/上下文选角色）
    → getModel()
       ├─ 有密钥：generateText(system=角色提示词, maxOutputTokens=4096)
       │           └─ 失败 → logger.warn → 本地关键词回复
       └─ 无密钥：本地关键词回复（CLEAN_RESPONSES）
    → SSE 流式（data:{content…} + [DONE]，格式与客户端手写解析严格兼容）
    → aiChatRequestsTotal.inc({role, source: openai|gateway|mock})
```

推理模型注意：GLM-5 系思考内容与正文共用 token 池，上限 4096 防正文为空。

### 4.2 数据读写（SQLite）

```
页面/Hooks → API 路由（children/growth-records/homework）
  → lib/db/server.ts（assertTable → serializeRow）
  → sqlite-client（prepared statement · 外键约束）
  → data/yyc3.db（WAL）
首次访问：自动建表（8 张）+ 幂等种子（示例家庭/成长记录/作业）
```

### 4.3 密钥安全边界

```
浏览器 ──(零密钥)──▶ /api/ai/{chat, homework-correction, speech-to-text, text-to-speech}
                          │ 服务端 env：AI_API_KEY / OPENAI_API_KEY / BIGMODEL_API_KEY
                          ▼
                    BigModel / OpenAI 兼容端点
```

## 5. 部署形态

| 形态 | 用途 | 说明 |
|---|---|---|
| `next dev/start`（:3201） | 应用（SSR + API + SQLite） | 生产部署目标（VPS/容器） |
| GitHub Pages（xy.yyc3.vip） | 静态着陆页 | 见 [deployment.md](deployment.md) |

> 本应用含 SSR/API/SQLite，**不能**整体跑在静态托管上；Pages 部署的是
> 独立静态着陆页（`site/`），主应用部署方案见部署文档。

## 6. i18n 双轨

| 轨道 | 路径 | 适用 | 机制 |
|---|---|---|---|
| 应用路由 | `i18n/request.ts` + middleware + `messages/{zh,en}.json` | 页面文案 | `/` 中文直出、`/en` 前缀；NextIntlClientProvider |
| 通用运行时 | `lib/i18n-core/`（零依赖一方代码） | 脚本/工具/非 React | I18nEngine + ICU + 插件；10 语言 |

**约定**：页面内一律 next-intl（useTranslations）；脱离 React 的场景用 i18n-core。
i18n-core 内部相对导入带 `.js` 后缀（bun 跨版本稳定）。

## 7. 演进路线（技术债）

| 项 | 现状 | 目标 |
|---|---|---|
| 类型债 | 778（`ignoreBuildErrors` 临时开启） | 按域清零后移除开关 |
| Lint 债 | 6711（CI 报告项） | --fix 分批 + 规则分级 |
| 徽章持久化 | 内存/localStorage（SQLite 已有 badges 表） | 接入 server 层 |
| themes/ | 三套 Figma 主题未接线 | 主题选择器 |
| 监控 | 基础计数器 | histogram + Grafana 面板 |

## 8. 架构决策记录（ADR 摘要）

| 决策 | 背景 | 结论 |
|---|---|---|
| 为主干选 xy-ai 线 | 7 版本并存 | 唯一干净工作区 + 质量工程最全，吸收式合并（DEEP_CODE_ANALYSIS_AND_MERGE_PLAN.md） |
| Chat Completions 而非 Responses API | BigModel 404 | `provider.chat()` 为兼容网关标准写法 |
| SQLite 而非 Postgres | 单机家庭场景 | node:sqlite 零运维；如需多端同步再上 PG |
| 密钥服务端代理 | 浏览器密钥暴露史 | 三代理路由 + realKey() 占位符过滤 |
| 删 7 条 CI 合 1 条 | 重复触发且含非法 YAML | 单流水线双阶段（质量门禁+冒烟） |
