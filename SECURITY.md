# 安全策略（Security Policy）

> **YanYuCloudCube ™**

> 适用版本：统一基线 v3.x 及以上

## 🔒 安全架构摘要

本项目的安全模型（实现细节见 [README §安全模型](README.md#-安全模型)）：

| 层面 | 机制 |
|---|---|
| 密钥边界 | 所有 AI 密钥为**服务端环境变量**；浏览器经 `/api/ai/*` 代理路由访问；占位符密钥被 `realKey()` 过滤 |
| 传输与响应 | nosniff / X-Frame-Options / Referrer-Policy / Permissions-Policy 全站；**生产环境启用 CSP**（connect-src 限定 self + BigModel） |
| 输入校验 | 批改图片 10MB、音频 25MB、TTS 文本 2000 字 + 音色白名单；API 路由类型与必填校验 |
| 数据层 | `lib/db/server.ts` assertTable 白名单防 SQL 注入；SQLite 外键约束；参数化查询 |
| 依赖 | GitHub Dependabot 持续审计（阻塞门禁）+ package.json overrides 引导传递依赖 |
| 静态资源 | middleware 排除带扩展名路径，防止 i18n 路由劫持静态文件 |

## 🏭 支持版本

| 版本 | 支持状态 |
|---|---|
| main（统一基线 v3.x） | ✅ 持续维护 |
| 家族历史版本（xy-01…05 等） | ❌ 已归档，不再接收修复 |

## 📣 报告漏洞

**请勿通过公开 Issue / Discussion 报告安全漏洞。**

1. 使用 GitHub 私有渠道：**Security → Report a vulnerability**
   （[安全通告页](https://github.com/YYC-Cube/YYC3-AI-Growth-Companion/security/advisories)）
2. 或邮件：`admin@0379.email`，标题前缀 `[安全] YYC3-AI-Growth-Companion`

报告请包含：影响范围、复现步骤/POC、受影响版本/commit、可能的修复建议。

**响应承诺**：48 小时内确认收到；高危漏洞 7 个工作日内评估并给出修复计划。

## ✅ 贡献者安全清单（摘自 CONTRIBUTING）

- 密钥只进 `.env.local`，禁止提交、禁止 `NEXT_PUBLIC_` 承载
- 新路由必须做输入校验；SQL 一律走 server 层白名单
- 引入新依赖前确认无高危告警（Dependabot 会阻塞）
