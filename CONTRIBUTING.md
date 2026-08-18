# 贡献指南（Contributing Guide）

> 感谢你为 YYC³ AI小语智能成长守护系统贡献代码！请先阅读 [开发者指南](docs/developer-guide.md) 了解项目实况。

## 📋 目录

- [行为准则](#-行为准则)
- [开发环境搭建](#-开发环境搭建)
- [分支与提交规范](#-分支与提交规范)
- [Pull Request 流程](#-pull-request-流程)
- [代码质量门禁](#-代码质量门禁)
- [安全红线](#-安全红线)
- [文档贡献](#-文档贡献)

---

## 🤝 行为准则

- 尊重每一位贡献者，对事不对人
- 讨论聚焦技术方案，提供依据而非立场
- 新人友好：提问没有笨问题，review 给出建设性意见

## 🛠 开发环境搭建

```bash
git clone git@github.com:YYC-Cube/YYC3-AI-Growth-Companion.git
cd YYC3-AI-Growth-Companion

# 国内网络必须走镜像（默认源会卡死）
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bun install

cp .env.example .env.local   # 按需配置密钥（见下方安全红线）
bun run dev                   # http://localhost:3201
```

环境要求：Node ≥ 22.5（`node:sqlite`）、Bun ≥ 1.1。完整说明见
[开发者指南 §1-3](docs/developer-guide.md)。

## 🌿 分支与提交规范

**分支命名**：

```
feature/<短描述>     # 新功能        feature/badge-icons
fix/<短描述>         # 缺陷修复      fix/chat-token-limit
docs/<短描述>        # 文档          docs/api-reference
chore/<短描述>       # 工程/依赖     chore/deps-bump
```

**提交信息**（Conventional Commits）：

```
<type>(<scope>): <subject>

类型：feat | fix | docs | style | refactor | perf | test | chore | ci | security
主题：祈使句、不超过 50 字、不加句号

示例：
feat(badges): add series progress API
fix(ai): use chat completions for compatible gateways
security: move BigModel key to server-side proxy routes
```

## 🔄 Pull Request 流程

1. **Fork 或建分支**：从最新 `main` 切出（先 `git fetch && git rebase origin/main`，
   本仓库 Dependabot 活跃，远程常有新提交）
2. **开发与自测**：
   ```bash
   bun test            # 必须全绿（当前基线 497/0，禁止回退）
   bun run build       # 生产构建必须通过
   bunx tsc --noEmit   # 触碰的文件不得新增类型错误（存量基线 778）
   ```
3. **提交 PR**：标题遵循提交规范，描述包含"改了什么 / 为什么 / 如何验证"
4. **CI 门禁**：质量门禁（测试+构建）+ 生产冒烟两阶段必须全绿
5. **Review 合并**：至少一人 review 后 squash 合并

## ✅ 代码质量门禁

| 门禁 | 阻塞性 | 说明 |
|---|---|---|
| `bun test` | **阻塞**（本地+CI） | 任何用例回退不予合并 |
| `bun run build` | **阻塞**（本地+CI） | 生产构建失败不予合并 |
| 触碰文件类型检查 | **阻塞**（约定） | 新增 TS 错误不予合并 |
| 触碰文件 lint | 建议 | 新代码应符合 eslint 规则 |
| 依赖告警 | **阻塞**（Dependabot） | 引入高危依赖不予合并 |

测试编写规范见 [测试指南](docs/testing.md)。

## 🚫 安全红线（违反即拒）

1. **密钥只进 `.env.local`**——严禁提交任何真实密钥；严禁 `NEXT_PUBLIC_` 前缀承载密钥
   （浏览器可见）；浏览器一律经 `/api/ai/*` 代理路由访问外部 AI 服务
2. **新 API 路由必须校验输入**（参考现有代理路由的大小上限/类型校验模式）
3. **SQL 只经 `lib/db/server.ts`**（assertTable 白名单），禁止拼接
4. `.gitignore` 新增目录规则**必须根锚定**（`/xxx/`）——本仓库已因未锚定规则
   静默丢失过十类源文件，详见 [开发者指南 §8](docs/developer-guide.md)

发现安全漏洞请勿公开 issue，按 [SECURITY.md](SECURITY.md) 报告。

## 📚 文档贡献

- 文档结构见 [docs/README.md](docs/README.md) 索引
- 改动涉及架构/API/部署时同步更新对应文档
- 过程性报告一律放 `docs/12-归档文档/process-reports/`，不进顶层

---

<div align="center">

**用心守护每一个成长瞬间** 🌱

</div>
