# YYC³-XY 项目交接文档与迭代路线图

> 版本: 1.0 | 日期: 2026-08-11

---

## 一、环境搭建指南

### 1.1 前置要求

| 工具 | 版本要求 | 安装方式 |
|------|---------|---------|
| Bun | >= 1.1.38 | `curl -fsSL https://bun.sh/install \| bash` |
| Node.js | >= 18.0.0 | nvm 或 nvs |
| Git | >= 2.40 | 系统包管理器 |

### 1.2 项目启动

```bash
# 1. 克隆/进入统一基线
cd /Users/yanyu/YYC3-Baby/unified

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入实际 API Key

# 4. 启动开发服务器
bun run dev:next
# 或: next dev -p 1228

# 5. 打开浏览器
# http://localhost:1228
```

### 1.3 构建与部署

```bash
# 构建
bun run build:next

# Docker 部署
docker build -t yyc3-xy .
docker run -p 1228:1228 yyc3-xy

# Docker Compose (含数据服务)
docker-compose -f docker-compose.microservices.yml up -d
```

### 1.4 关键配置文件

| 文件 | 用途 | 修改场景 |
|------|------|---------|
| `.env.local` | API Key、端口配置 | 更换 API 密钥 |
| `next.config.mjs` | Next.js 配置 | 添加 headers、重定向 |
| `tsconfig.json` | TypeScript 配置 | 添加路径别名 |
| `package.json` | 依赖管理 | 新增/升级依赖 |

---

## 二、项目架构文档

### 2.1 目录结构

```
unified/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页
│   ├── growth/             # 成长记录模块
│   ├── homework/           # 作业模块
│   ├── api/                # API Routes (13个)
│   ├── [locale]/           # 国际化路由
│   └── ...                 # 其他功能页面
├── components/             # React 组件
│   ├── ui/                 # shadcn/ui 基础组件 (65+)
│   ├── growth/             # 成长相关组件 (15+)
│   ├── ai-xiaoyu/          # AI 小语浮窗
│   ├── ai-widget/          # AI 拖拽浮窗
│   └── ...                 # 其他业务组件
├── lib/                    # 工具库
│   ├── ai/                 # AI 引擎模块 (17个)
│   ├── ai-modules/         # 从 ai_xy05 整合的模块 (17个)
│   ├── db/                 # 数据库层
│   │   ├── schema.ts       # 表结构定义
│   │   ├── sqlite-client.ts
│   │   └── database-manager.ts
│   ├── store/              # Redux 状态管理
│   └── prediction/         # 预测引擎
├── types/                  # TypeScript 类型定义 (17+)
├── hooks/                  # React Hooks (24个)
├── core/                   # 核心引擎
│   └── AgenticCore.ts      # 事件驱动核心
├── themes/                 # 多主题方案
│   ├── cyberpunk/          # 赛博朋克主题
│   ├── default/            # 标准主题
│   └── liquid/             # 液态主题
└── config/                 # 配置文件
```

### 2.2 数据流

```
用户操作 → React Component → API Route → SQLite/PostgreSQL
                ↑                              ↓
            Hooks ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                              ↓
                      AI 分析/预测引擎
                              ↓
                      UI 可视化呈现
```

---

## 三、验收清单

### 3.1 功能验收

| # | 验收项 | 验收标准 | 状态 | 证据 |
|---|--------|---------|------|------|
| 1 | 项目审计报告 | 覆盖代码结构、依赖、安全、版本差异 | ✅ | [审计报告](/Users/yanyu/YYC3-Baby/audit-output/01-deep-audit-report.md) |
| 2 | 竞品分析报告 | 覆盖12款竞品、功能矩阵、用户画像 | ✅ | [竞品分析](/Users/yanyu/YYC3-Baby/audit-output/02-competitive-intelligence-analysis.md) |
| 3 | 版本合并 | 统一基线已创建、Git已初始化、合并日志完整 | ✅ | `/Users/yanyu/YYC3-Baby/unified/` + `MERGE_LOG.md` |
| 4 | 软链接修复 | AgenticCore.ts 断裂软链接已修复为实体文件 | ✅ | `core/AgenticCore.ts` 已是实体文件 |
| 5 | 安全修复 | .env.local 明文密钥已替换为占位符 | ✅ | unified/.env.local |
| 6 | UI设计方案A | 柔和科技·温润精致 高保真原型 | ✅ | [方案A](/Users/yanyu/YYC3-Baby/audit-output/ui-scheme-A-soft-tech-home.html) |
| 7 | UI设计方案B | 呼吸留白·极简克制 高保真原型 | ✅ | [方案B](/Users/yanyu/YYC3-Baby/audit-output/ui-scheme-B-breath-minimal.html) |
| 8 | UI设计方案C | 意外色彩·活力手作 高保真原型 | ✅ | [方案C](/Users/yanyu/YYC3-Baby/audit-output/ui-scheme-C-playful-bold.html) |
| 9 | 数据存储层 | SQLite Schema 定义（6张表+索引+台账） | ✅ | `lib/db/schema.ts` |
| 10 | 智能功能方案 | 2个AI功能设计方案（情感+预测） | ✅ | [智能方案](/Users/yanyu/YYC3-Baby/audit-output/04-smart-feature-integration-plan.md) |
| 11 | 交接文档 | 环境搭建+架构+验收+路线图 | ✅ | 本文档 |
| 12 | 迭代路线图 | 3-6个月里程碑规划 | ✅ | 见下方第四节 |

### 3.2 已知限制

| 限制 | 原因 | 缓解方案 |
|------|------|---------|
| 依赖未安装 | bun install 在当前环境卡在 resolving | 需在网络通畅环境执行 `bun install` |
| 构建未验证 | 依赖未安装导致无法 build | 安装依赖后执行 `bun run build:next` |
| API Key 需轮换 | 原始密钥在 .env.local 中暴露 | 在 BigModel 控制台重新生成密钥 |
| EmotionType 类型冲突 | interaction.ts 与 emotion-engine.ts 定义不一致 | 统一为 union type 或 enum |
| 测试页面冗余 | 10个测试/Demo路由未清理 | 迁移至 __tests__/ 或删除 |

---

## 四、迭代路线图（2026年8月-2027年2月）

### Phase 1: 基础设施（8月 W3-W4）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M1.1 | 依赖安装 + 构建通过 | `bun install && bun run build:next` 成功 |
| M1.2 | EmotionType 统一 | 类型冲突消除，type-check 通过 |
| M1.3 | 测试页面清理 | 10个测试路由移至 `__tests__/` 或删除 |
| M1.4 | API Key 轮换 | 新密钥在 BigModel 控制台生成并配置 |

### Phase 2: 数据与安全（9月）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M2.1 | SQLite 持久化接入 | children/growth-records/homework API 使用 SQLite |
| M2.2 | 用户认证系统 | 手机号+验证码登录，JWT Token |
| M2.3 | 审计日志中间件 | 所有写操作自动记录审计日志 |
| M2.4 | 安全头配置 | CSP/X-Frame-Options/X-Content-Type 在 next.config 中配置 |

### Phase 3: 核心 AI 功能（10月）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M3.1 | AI 对话持久化 | 对话历史存储到 ai_conversations 表 |
| M3.2 | 情感识别上线 | emotion-engine 在 AI 对话中实时分析情感 |
| M3.3 | WHO 标准数据 | WHO 生长标准数据集导入（0-5岁） |
| M3.4 | 成长预测报告 | 基于历史数据生成 3 个月预测 |

### Phase 4: UI/UX 升级（11月）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M4.1 | 多主题切换 | 赛博/液态/标准三套主题可运行切换 |
| M4.2 | PWA 配置 | manifest.json + service worker，可安装到桌面 |
| M4.3 | 移动端适配 | 所有核心页面通过 375px 宽度测试 |
| M4.4 | 无障碍增强 | WCAG AA 级别通过 axe-core 检测 |

### Phase 5: 差异化功能（12月-1月）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M5.1 | 知识图谱种子 | Neo4j 初始化，导入育儿知识图谱 |
| M5.2 | AI 照片识别 | 上传成长照片自动识别场景和情绪 |
| M5.3 | 社区模块 | 轻量社区/动态流 MVP |
| M5.4 | 家庭组功能 | 多家长共享同一宝宝档案 |

### Phase 6: 商业化与发布（2月）

| 里程碑 | 任务 | 完成标准 |
|--------|------|---------|
| M6.1 | 增值订阅 | 免费+Pro 两档功能 |
| M6.2 | App Store 备案 | ICP/教育类应用备案 |
| M6.3 | 性能优化 | Lighthouse > 90 分 |
| M6.4 | 正式发布 | 生产环境部署，监控告警就绪 |

---

## 五、风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| Bun 与 Next.js 16 兼容性 | 中 | 高 | 准备 Node.js + npm 降级方案 |
| Neo4j 运维复杂度高 | 中 | 中 | 初期用 SQLite 替代，后期再迁移 |
| AI API 费用超支 | 低 | 高 | 设置用量上限 + 缓存策略 |
| 数据隐私合规 | 中 | 高 | 用户数据加密存储 + 隐私政策 |
| 测试覆盖不足导致回归 | 高 | 中 | 逐步补充核心路径测试，CI 门禁 |

---

## 六、联系人与职责

| 角色 | 职责 |
|------|------|
| 项目负责人 | YYC³ (admin@0379.email) |
| 技术决策 | 架构选型、技术债管理 |
| 开发执行 | 功能开发、Bug 修复 |
| 内容运营 | 育儿知识库、活动策划 |
