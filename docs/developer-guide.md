# 开发者指南（Developer Guide）

> **YanYuCloudCube ™** · 对齐项目实况：2026-08-19 · 统一基线 v3.x
> 本文档描述的是**当前真实运行状态**，与历史文档（docs/12-归档文档、13-Baby并入文档）中的过程记录不同，以本文为准。

## 1. 环境要求

| 依赖 | 版本 | 用途 |
|---|---|---|
| Node | ≥ 22.5（建议 22.13+） | 运行时；`node:sqlite` 需要 |
| Bun | ≥ 1.1 | 包管理 / 测试运行器 |
| Git | — | SSH remote（HTTPS 推送无 workflow 权限） |

## 2. 常用命令

```bash
# 安装（国内网络必须走镜像，默认源会卡死）
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bun install

bun run dev          # 开发服务器 :3201（热重载）
bun run build        # 生产构建（Turbopack）
bun run start        # 生产模式 :3201（CSP/安全头仅生产生效）
bun test             # 497 用例，~4s
bun run type-check   # tsc --noEmit（存量基线 778，勿新增）
bun run lint         # eslint（存量基线 6711，勿新增）
```

## 3. 密钥配置（.env.local，已被 gitignore）

```bash
# ===== 对话/创意类（二选一，model-provider 自动解析）=====
OPENAI_API_KEY=sk-...                 # 方式一：OpenAI 官方或兼容端点
                                      #   可选：OPENAI_BASE_URL / OPENAI_MODEL
AI_API_KEY=你的密钥                    # 方式二：OpenAI 兼容网关
AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
AI_MODEL=glm-5.1

# ===== 作业批改/语音类（服务端专用）=====
BIGMODEL_API_KEY=同一个 BigModel 密钥即可
```

**红线**：密钥只进 `.env.local`；禁止任何 `NEXT_PUBLIC_` 前缀承载密钥（历史漏洞已修复，
浏览器一律经 `/api/ai/*` 代理路由）。占位符（`sk-your-...`）会被 `realKey()` 过滤，不会抢占优先级。

验证真实链路：`POST /api/ai/chat` 返回针对性回复，或 `/api/metrics` 中
`yyc3_ai_chat_requests_total{source="gateway"}` 计数增长（`source="mock"` 表示降级中）。

## 4. 架构速览

四层结构（详见 [README 可视化架构](../README.md#-可视化架构)）：

```
客户端(React 19) → Middleware(next-intl/缓存头) → API 路由(15 个)
                                                → 服务层(lib/) → SQLite / BigModel / fal.ai
```

关键模块：

| 模块 | 职责 | 备注 |
|---|---|---|
| `lib/ai/model-provider.ts` | 统一模型工厂 | `provider.chat()` 走 Chat Completions（兼容网关不支持 Responses API）；未配密钥返回 null 由调用方降级 |
| `lib/db/server.ts` | SQLite 统一入口 | `assertTable` 白名单防注入；JSON 列自动序列化 |
| `src/services/badgeService.ts` | 勋章唯一服务 | SSR 安全（localStorage 守卫）；数据源 `lib/data/badgeMockData.ts` |
| `lib/i18n-core/` | 自研零依赖 i18n | 引擎/ICU/插件/检测/RTL，10 语言；**注意 `import` 用相对路径**（bun CI 版本对 src 外 `@/` 别名解析差异） |
| `lib/monitoring/metrics.ts` | prom-client 注册表 | 新业务指标在此注册，路由中 `.inc()` |

## 5. 数据层开发约定

- 新表：在 `lib/db/sqlite-client.ts` 的 SCHEMA 中追加 `CREATE TABLE IF NOT EXISTS`，
  并把表名加入 `lib/db/server.ts` 的 `assertTable` 白名单
- 种子数据：`seedMockData()`（幂等，已有数据跳过）
- 迁移：当前无迁移框架，schema 变更后删除 `data/yyc3.db` 重建（开发期可接受）

## 6. 测试约定

- 运行器：`bun test`（无 jsdom 预加载；DOM 相关测试需自含 mock 或标 `.disabled`）
- 位置：`__tests__/**`（镜像源码路径）
- **禁止提交挂起的测试**（历史上 4 个 jest 时代文件导致套件卡死，已 `.disabled`：
  badgeComponents / mobility / rule-engine / decision-engine）
- 当前基线：**497 pass / 0 fail**——任何 PR 不得使其回退

## 7. CI/CD

单流水线 `.github/workflows/ci.yml`（旧 7 条已删）：

1. **质量门禁**（阻塞）：`bun test` → 生产构建（空密钥验证降级路径）
2. **报告项**（不阻塞）：tsc（778）/ eslint（6711）/ npm audit（合成树）
3. **生产冒烟**（独立 job）：干净 runner 上 `next start` + 八项路由断言

推送前 `git fetch && git rebase origin/main`（Dependabot 活跃，远程常有新提交）。

## 8. 已知坑（本仓库踩过的雷）

| 症状 | 根因 | 处置 |
|---|---|---|
| 本地全绿、CI 挂 | `.gitignore` 未锚定目录规则静默吞源文件（家族九例：lib/、*.png、archive/、data/、i18n/、metrics/、monitoring/、analytics/、performance/） | 怀疑时先 `git check-ignore -v <文件>`；新增目录规则一律根锚定 `/xxx/` |
| 构建失败：dotenv not found | `lib/config.ts` 顶部 dotenv 被 profile 页拉进客户端 bundle | Next 自动加载 .env，禁用 dotenv |
| 兼容网关 404 | @ai-sdk/openai 默认走 `/responses` | 用 `provider.chat(modelId)` |
| 真实 AI 静默降级 | `.env` 占位符密钥抢占优先级 | `realKey()` 已过滤；勿在 .env 留示例值 |
| 图片 404（带 404 页内容） | next-intl middleware 拦截了带扩展名路径 | matcher 已排除 `.*\..*` |
| Next 16 构建报 headers 空 | dev 分支返回空 headers 数组 | CSP 仅生产注册（条件 push） |
| bun test 卡死 | 测试内有未决异步/定时器 | 修或 `.disabled`，勿提交挂起测试 |

## 9. 存量债与路线

| 项 | 规模 | 计划 |
|---|---|---|
| 类型债 | 778（起点 1214） | 按域清偿 → 清零后移除 `ignoreBuildErrors` |
| Lint 债 | 6711 | 分批 `--fix` + 规则分级 |
| 徽章图标 | `/badges/**.png` 从未产出 | 设计任务；放入 `public/badges/` 即生效 |
| 三套 Figma 主题 | themes/ 未接线 | 主题选择器方案待定 |
| 4 个 .disabled 测试 | jest 时代写法 | 迁移 bun 兼容写法 |

## 10. 家族仓库地图

| 仓库 | 状态 |
|---|---|
| **YYC3-AI-Growth-Companion（本仓库）** | ✅ 唯一活跃基线 |
| YYC-Cube/YYC3-Baby（私有） | 已吸收归档，历史保全 |
| YYC3-小语-AAA/xy-* 家族 7 版本 | 资产已吸收/抢救，只读封存 |
