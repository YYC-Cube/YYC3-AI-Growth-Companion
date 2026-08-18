# 部署指南（Deployment）

> 对齐实况：2026-08-19 · 含 GitHub Pages（xy.yyc3.vip）

## 目录

1. [部署形态总览](#1-部署形态总览)
2. [GitHub Pages 自动部署（xy.yyc3.vip）](#2-github-pages-自动部署xYYC3vip)
3. [主应用生产部署（SSR）](#3-主应用生产部署ssr)
4. [环境变量清单](#4-环境变量清单)
5. [数据库与备份](#5-数据库与备份)
6. [运维手册](#6-运维手册)

---

## 1. 部署形态总览

| 目标 | 内容 | 触发 | 地址 |
|---|---|---|---|
| **GitHub Pages** | 静态着陆页（品牌/功能/文档导航） | push main 自动 | **https://xy.yyc3.vip**（CNAME → YYC-Cube.github.io） |
| **主应用** | SSR + API + SQLite 完整应用 | 手动/服务器 | 自有服务器（VPS/容器），见 §3 |

> 为什么 Pages 只放着陆页：本应用含 SSR、API 路由与 SQLite 持久化，
> 静态托管无法承载。着陆页（`site/index.html`）独立自包含，承担产品门面
> 与文档导航，主应用另行部署后可将着陆页 CTA 指向应用地址。

## 2. GitHub Pages 自动部署（xy.yyc3.vip）

### 2.1 流水线

`.github/workflows/pages.yml`：push main → 质量门禁通过后构建静态站点
（`site/` + 品牌图片）→ 部署 Pages → 附带 `CNAME`（xy.yyc3.vip）。

### 2.2 一次性配置（已完成/需确认项）

| 步骤 | 状态 | 操作 |
|---|---|---|
| Pages 构建源设为 GitHub Actions | 仓库 Settings → Pages → Source: GitHub Actions | 已通过 API 启用 |
| CNAME 文件入库 | ✅ `site/CNAME` | — |
| **DNS 解析（唯一需你操作的）** | ⬜ 待配置 | 在 yyc3.vip 的 DNS 服务商添加记录，见下表 |

### 2.3 DNS 配置（必须）

在 `yyc3.vip` 域名的 DNS 管理处添加：

| 类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| CNAME | `xy` | `YYC-Cube.github.io` | 600 |

生效后（通常几分钟~数小时）：
- 访问 `https://xy.yyc3.vip` 即静态站
- 在仓库 **Settings → Pages → Enforce HTTPS** 勾选强制 HTTPS（GitHub 自动签发证书，DNS 生效后约几分钟可用）

> 若 DNS 未生效，Pages 仍可通过默认地址 `https://yyC-cube.github.io/YYC3-AI-Growth-Companion` 访问。

### 2.4 本地预览着陆页

```bash
bunx serve site   # 或任何静态服务器
```

## 3. 主应用生产部署（SSR）

### 3.1 裸机 / VPS

```bash
# 服务器要求：Node ≥ 22.5
git clone git@github.com:YYC-Cube/YYC3-AI-Growth-Companion.git
cd YYC3-AI-Growth-Companion

NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bun install   # 或 npm ci
cp .env.example .env.local    # 配置 §4 密钥

bun run build
bun run start                 # 监听 :3201
```

进程守护（任选）：`pm2 start bun --name yyc3 -- run start` 或 systemd unit。

### 3.2 Nginx 反代（示例）

```nginx
server {
    listen 443 ssl http2;
    server_name app.yyc3.vip;          # 示例：主应用子域

    location / {
        proxy_pass http://127.0.0.1:3201;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;      # SSE/WebSocket
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_buffering off;                          # SSE 必需
        proxy_read_timeout 300s;                      # AI 长响应
    }
}
```

### 3.3 容器（Docker）

仓库自带 `Dockerfile` 与 `docker-compose.yml`（家族继承，按需调整端口与环境变量注入）：

```bash
docker compose up -d --build
```

## 4. 环境变量清单

| 变量 | 作用域 | 必填 | 说明 |
|---|---|---|---|
| `AI_API_KEY` + `AI_BASE_URL`（+`AI_MODEL`） | 服务端 | 二选一 | OpenAI 兼容网关（推荐 BigModel） |
| `OPENAI_API_KEY`（+`OPENAI_BASE_URL`/`OPENAI_MODEL`） | 服务端 | 二选一 | OpenAI 官方/兼容端点，优先级最高 |
| `BIGMODEL_API_KEY` | 服务端 | 语音/批改需要 | 作业批改 + ASR + TTS |
| `FAL_KEY` | 服务端 | 可选 | 创意生图（无则占位 SVG） |

**红线**：全部服务端变量；禁止 `NEXT_PUBLIC_` 承载密钥；`.env*` 已 gitignore。
未配密钥时 AI 路由自动降级（对话→本地回复，生图→占位图），服务不中断。

## 5. 数据库与备份

- 数据文件：`data/yyc3.db`（WAL 模式，含 -shm/-wal 伴随文件）
- 备份：`sqlite3 data/yyc3.db "VACUUM INTO 'backup-$(date +%F).db'"`（建议 cron 每日）
- 恢复：替换 db 文件后重启进程
- schema 变更：开发期删除 db 重建（自动建表+种子）；生产变更前先备份

## 6. 运维手册

### 健康检查

```bash
curl -s localhost:3201/api/metrics | head -5      # 进程存活 + 指标
curl -s localhost:3201/api/children | head -c 80  # 数据层连通
```

### 常见问题

| 症状 | 处置 |
|---|---|
| AI 回复是固定话术 | 密钥未配/失效（metrics 看 `source="mock"`）；检查 .env.local 并重启 |
| 依赖安装卡死 | 未走镜像：`NPM_CONFIG_REGISTRY=https://registry.npmmirror.com` |
| 图片 404（返回 404 页） | middleware matcher 被改动，须保留 `.*\..*` 排除 |
| 数据"丢失" | 确认进程工作目录（data/yyc3.db 相对路径）；勿并发多实例写同一库 |
| Pages 域名不通 | DNS 未生效（§2.3）；或 Enforce HTTPS 未开 |

### 监控接入

`/api/metrics` 可被任意 Prometheus 抓取（`monitoring/prometheus.yml` 已有模板，
端口对齐 3201）。Grafana 数据源配置见 `monitoring/grafana/`。
