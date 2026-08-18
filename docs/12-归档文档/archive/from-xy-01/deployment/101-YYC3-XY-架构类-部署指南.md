---
@file: 101-YYC3-XY-架构类-部署指南.md
@description: YYC3-XY项目架构类部署指南文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: 系统架构,技术设计,架构文档
---

# YYC³ 部署指南

## 部署前检查��单

### 1. 环境变量配置

确保以下环境变量已配置：

\`\`\`bash

# 必需变量

OPENAI_API_KEY=xxx
AZURE_SPEECH_KEY=xxx
AZURE_SPEECH_REGION=xxx

# 数据库变量（如使用Supabase）

NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# 应用URL

NEXT_PUBLIC_APP_URL=<https://your-domain.com>
\`\`\`

### 2. 数据库初始化

如果使用Supabase，执行以下步骤：

1. 在Supabase Dashboard创建新项目
2. 在SQL编辑器中执行 `scripts/database-schema.sql`
3. 验证所有表和RLS策略已创建
4. 在环境变量中配置Supabase连接信息

### 3. 构建测试

本地构建测试：

\`\`\`bash
npm run build
npm run start
\`\`\`

访问 `http://localhost:3000` 验证所有功能正常。

## Vercel部署步骤

### 方式一：通过Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com)
2. 点击 "Add New Project"
3. 导入Git仓库
4. 配置项目：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. 添加环境变量（Environment Variables）
6. 点击 "Deploy"

### 方式二：通过Vercel CLI

\`\`\`bash

# 安装Vercel CLI

npm i -g vercel

# 登录

vercel login

# 开发环境部署

vercel

# 生产环境部署

vercel --prod
\`\`\`

### 环境变量配置

在Vercel Dashboard → Settings → Environment Variables 添加：

| 变量名 | 值 | 环境 |
|--------|---|------|
| `OPENAI_API_KEY` | sk-xxx | Production, Preview |
| `AZURE_SPEECH_KEY` | xxx | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | <https://xxx.supabase.co> | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | xxx | Production, Preview, Development |

## 数据库迁移

### Supabase数据库设置

1. 创建Supabase项目
\`\`\`bash

# 访问 <https://supabase.com/dashboard>

# 创建新项目

\`\`\`

2. 执行SQL脚本
\`\`\`sql
-- 在Supabase SQL Editor中执行
-- 复制 scripts/database-schema.sql 的内容
\`\`\`

3. 配置RLS策略
\`\`\`sql
-- 确保所有表的RLS已启用
-- 验证策略是否正确应用
\`\`\`

4. 测试连接
\`\`\`bash

# 在本地测试Supabase连接

npm run dev

# 访问应用，验证数据读写正常

\`\`\`

## 性能优化

### 1. 图片优化

- 使用Next.js Image组件
- 配置图片域名白名单
- 启用图片压缩

### 2. 缓存策略

\`\`\`typescript
// next.config.mjs
export default {
  // 启用SWC压缩
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['blob.vercel-storage.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
\`\`\`

### 3. 代码分割

- 使用动态导入
- 懒加载非关键组件
- 路由预加载

\`\`\`typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
\`\`\`

## 监控与日志

### 1. Vercel Analytics

已集成 `@vercel/analytics`，自动收集：

- 页面访问量
- 用户会话
- 性能指标

### 2. Speed Insights

已集成 `@vercel/speed-insights`，监控：

- Core Web Vitals
- 页面加载时间
- 交互性指标

### 3. 错误监控

可选集成Sentry：

\`\`\`bash
npm install @sentry/nextjs

# 配置 sentry.client.config.js 和 sentry.server.config.js

\`\`\`

## 域名配置

### 1. 在Vercel添加域名

1. 进入项目 Settings → Domains
2. 添加自定义域名
3. 配置DNS记录

### 2. DNS配置

在域名注册商处添加：

\`\`\`
类型    名称    值
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
\`\`\`

### 3. SSL证书

Vercel自动提供免费SSL证书（Let's Encrypt）

## 故障排查

### 构建失败

\`\`\`bash

# 检查TypeScript错误

npm run type-check

# 检查ESLint错误

npm run lint

# 清理缓存重新构建

rm -rf .next node_modules
npm install
npm run build
\`\`\`

### API路由错误

1. 检查环境变量是否正确配置
2. 查看Vercel Function日志
3. 验证API路由返回格式

### 数据库连接失败

1. 验证Supabase URL和密钥
2. 检查RLS策略
3. 测试网络连接

## 回滚策略

Vercel支持一键回滚：

1. 进入项目 Deployments
2. 找到稳定版本
3. 点击 "Promote to Production"

## 备份策略

### 数据库备份

Supabase自动备份：

- 每日自动备份
- 保留7天
- 可手动触发备份

### 代码备份

使用Git版本控制：

- 定期推送到远程仓库
- 使用标签标记重要版本
- 保护主分支

## 上线检查清单

- [ ] 所有环境变量已配置
- [ ] 数据库Schema已初始化
- [ ] 本地构建测试通过
- [ ] API接口功能正常
- [ ] AI对话功能可用
- [ ] 语音功能测试通过
- [ ] 移动端适配良好
- [ ] 性能指标达标
- [ ] 错误边界正常工作
- [ ] 404/500页面正常
- [ ] SSL证书已配置
- [ ] 域名解析正常
- [ ] 监控系统已启用
- [ ] 备份策略已设置

## 持续集成/部署

### GitHub Actions示例

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
\`\`\`

---

如有部署问题，请联系技术支持：<support@yyc3.app>

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>

