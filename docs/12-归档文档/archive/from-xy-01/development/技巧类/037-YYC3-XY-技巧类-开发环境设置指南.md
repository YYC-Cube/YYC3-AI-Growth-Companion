---
@file: 037-YYC3-XY-技巧类-开发环境设置指南.md
@description: YYC3-XY项目技巧类开发环境设置指南文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: 开发技巧,最佳实践,编码规范
---

# 开发环境设置指南 (DOC-DEV-001)

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」

---

## 📋 文档信息

| 属性 | 内容 |
|------|------|
| **文档标题** | YYC³ AI小语系统开发环境设置指南 |
| **文档版本** | v1.0.0 |
| **创建时间** | 2025-12-08 |
| **最后更新** | 2025-12-08 |
| **适用对象** | 开发团队、贡献者 |
| **系统要求** | macOS, Linux, Windows (WSL2) |

---

## 🎯 开发环境概述

YYC³ AI小语系统采用现代化的技术栈，包括Next.js 16、TypeScript、Bun运行时和AI服务集成。本指南将帮助您快速搭建完整的开发环境。

### 技术栈要求
- **运行时**: Bun (推荐) 或 Node.js 18+
- **框架**: Next.js 16 + React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS v4
- **数据库**: Supabase (PostgreSQL)
- **AI服务**: OpenAI GPT-4 + Azure Speech
- **开发工具**: ESLint + Prettier + Husky

---

## 🔧 系统要求

### 1. 基础环境要求

#### 1.1 操作系统支持
```bash
# 支持的操作系统
✅ macOS 12+ (Monterey 或更高版本)
✅ Ubuntu 20.04+ / Debian 11+
✅ Windows 11 (使用 WSL2)
✅ Windows 10 (使用 WSL2)

# 推荐配置
- RAM: 16GB+ (32GB 更佳)
- 存储: SSD 50GB+ 可用空间
- CPU: 4核心+ (8核心更佳)
- 网络: 稳定的互联网连接
```

#### 1.2 必需软件安装
```bash
# 必需工具
- Git 2.30+
- Bun 1.0+ 或 Node.js 18+
- VS Code 或其他现代IDE
- Docker (可选，用于容器化开发)
- PostgreSQL 客户端工具 (pgAdmin 或 DBeaver)
```

---

## 📦 环境安装

### 1. Bun 安装 (推荐)

#### 1.1 macOS/Linux
```bash
# 使用官方安装脚本
curl -fsSL https://bun.sh/install | bash

# 或使用包管理器
# macOS
brew install oven/bun/bun

# Ubuntu/Debian
curl -fsSL https://bun.sh/install | bash
sudo apt-get install -y build-essential
```

#### 1.2 Windows (WSL2)
```bash
# 在 WSL2 Ubuntu 中
curl -fsSL https://bun.sh/install | bash
sudo apt-get install -y build-essential
```

### 2. Node.js 安装 (备选)

#### 2.1 使用 fnm (Fast Node Manager)
```bash
# 安装 fnm
curl -fsSL https://fnm.vercel.app/install | bash

# 安装并使用 Node.js 18
fnm install 18
fnm use 18
```

### 3. Git 配置

#### 3.1 基础配置
```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置默认分支名
git config --global init.defaultBranch main

# 配置凭证存储
git config --global credential.helper store

# 配置编辑器
git config --global core.editor "code --wait"
```

#### 3.2 SSH密钥设置
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 启动SSH代理
eval "$(ssh-agent -s)"

# 添加密钥到代理
ssh-add ~/.ssh/id_ed25519

# 复制公钥到剪贴板 (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# 或显示公钥 (Linux)
cat ~/.ssh/id_ed25519.pub
```

---

## 🚀 项目设置

### 1. 克隆项目

#### 1.1 从Git仓库克隆
```bash
# 克隆项目
git clone https://github.com/YYC-Cube/yyc3-xy-ai.git
cd yyc3-xy-ai

# 或使用SSH (推荐)
git clone git@github.com:YYC-Cube/yyc3-xy-ai.git
cd yyc3-xy-ai
```

### 2. 依赖安装

#### 2.1 安装依赖
```bash
# 使用 Bun (推荐)
bun install

# 或使用 npm
npm install

# 或使用 pnpm
pnpm install
```

#### 2.2 依赖安装验证
```bash
# 检查安装状态
bun --version
node --version
npm --version

# 检查依赖完整性
bun run check:deps
```

### 3. 环境变量配置

#### 3.1 创建环境变量文件
```bash
# 复制环境变量模板
cp .env.example .env.local
```

#### 3.2 配置环境变量
```bash
# .env.local
# 数据库配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORG_ID=your_openai_org_id
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_speech_region

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 开发配置
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true

# 安全配置
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key

# 监控配置
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

### 4. 数据库设置

#### 4.1 Supabase 项目设置
```bash
# 1. 访问 https://supabase.com
# 2. 创建新项目或使用现有项目
# 3. 获取项目 URL 和 API 密钥
# 4. 在 Supabase 控制台中运行数据库迁移
```

#### 4.2 数据库迁移
```bash
# 运行数据库迁移
bun run db:migrate

# 或使用 Supabase CLI
supabase db push
```

---

## 🛠️ 开发工具配置

### 1. VS Code 配置

#### 1.1 推荐扩展
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode-remote.remote-containers",
    "ms-vscode-remote.remote-ssh",
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "ms-vscode.vscode-thunder-client"
  ]
}
```

#### 1.2 工作区设置
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "prettier.configPath": "./prettier.config.js",
  "typescript.preferences.quoteStyle": "single"
}
```

#### 1.3 调试配置
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "bun run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "bun run dev",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "port": 9229
    }
  ]
}
```

### 2. Git Hooks 配置

#### 2.1 Husky 设置
```bash
# 安装 Husky
bun add --dev husky

# 初始化 Git hooks
bunx husky init

# 添加 pre-commit hook
bunx husky add .husky/pre-commit "bun run lint && bun run test:unit"

# 添加 commit-msg hook
bunx husky add .husky/commit-msg "bun run commitlint"
```

#### 2.2 commitlint 配置
```json
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'perf',     // 性能
        'test',     // 测试
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回滚
        'security'  // 安全相关
      ]
    ],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
};
```

---

## 🧪 开发测试

### 1. 启动开发服务器

#### 1.1 启动应用
```bash
# 使用 Bun 启动 (推荐)
bun run dev

# 或使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

#### 1.2 访问应用
```bash
# 应用地址
http://localhost:3000

# API 文档
http://localhost:3000/api/docs

# 开发工具
http://localhost:3000/_next/static/chunks/webpack.js (开发工具)
```

### 2. 运行测试

#### 2.1 单元测试
```bash
# 运行所有单元测试
bun run test:unit

# 监听模式
bun run test:watch

# 覆盖率报告
bun run test:coverage
```

#### 2.2 集成测试
```bash
# 运行集成测试
bun run test:integration

# E2E 测试
bun run test:e2e

# 安全测试
bun run test:security
```

### 3. 代码质量检查

#### 3.1 Lint 检查
```bash
# 运行 ESLint
bun run lint

# 自动修复
bun run lint:fix

# TypeScript 类型检查
bun run type-check
```

#### 3.2 代码格式化
```bash
# 格式化代码
bun run format

# 检查格式化
bun run format:check
```

---

## 🐳 Docker 开发

### 1. Docker 配置

#### 1.1 开发容器
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package.json bun.lockb ./
RUN npm install -g bun

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动开发服务器
CMD ["bun", "run", "dev"]
```

#### 1.2 Docker Compose 开发
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: yyc3_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. Docker 开发命令
```bash
# 构建并启动开发环境
docker-compose -f docker-compose.dev.yml up --build

# 后台运行
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f app

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

---

## 🔧 开发工具

### 1. 数据库工具

#### 1.1 数据库迁移
```bash
# 创建新迁移
bun run db:migration:create migration_name

# 运行迁移
bun run db:migrate

# 回滚迁移
bun run db:rollback

# 重置数据库
bun run db:reset
```

#### 1.2 数据库种子数据
```bash
# 运行种子数据
bun run db:seed

# 重置并填充数据
bun run db:seed:reset
```

### 2. AI 服务测试

#### 2.1 测试 AI 连接
```bash
# 测试 OpenAI 连接
bun run test:ai:openai

# 测试 Azure Speech 连接
bun run test:ai:speech

# 测试所有 AI 服务
bun run test:ai:all
```

### 3. 性能监控

#### 3.1 开发监控
```bash
# 启动性能监控
bun run dev:monitor

# 生成性能报告
bun run perf:report

# 分析包大小
bun run analyze:bundle
```

---

## 🐛 调试指南

### 1. 客户端调试

#### 1.1 React DevTools
```bash
# 安装 React DevTools
bun add --dev @types/react @types/react-dom

# 在组件中添加调试
import { useEffect } from 'react';

export default function DebugComponent() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
    }
  }, []);

  return <div>Debug Component</div>;
}
```

#### 1.2 Chrome DevTools
```javascript
// 在组件中添加调试断点
const DebugInfo = ({ data }) => {
  // 浏览器控制台输出
  console.debug('DebugInfo data:', data);

  // 条件断点
  if (data.suspicious) {
    debugger; // 浏览器断点
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
```

### 2. 服务端调试

#### 2.1 VS Code 调试
```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Debug API Route",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_OPTIONS": "--inspect"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

#### 2.2 日志调试
```typescript
// utils/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data);
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },

  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

---

## 🚀 常见问题解决

### 1. 安装问题

#### 1.1 Bun 安装失败
```bash
# 问题: Bun 安装权限错误
# 解决方案:
sudo chown -R $(whoami) ~/.bun

# 问题: Bun 命令未找到
# 解决方案:
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### 1.2 依赖安装失败
```bash
# 问题: 依赖安装超时
# 解决方案:
bun install --no-cache

# 问题: 权限错误
# 解决方案:
sudo chown -R $(whoami) node_modules

# 问题: 网络问题
# 解决方案:
bun install --registry=https://registry.npmjs.org/
```

### 2. 运行问题

#### 2.1 端口占用
```bash
# 查找占用 3000 端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用不同端口
PORT=3001 bun run dev
```

#### 2.2 数据库连接问题
```bash
# 问题: 数据库连接失败
# 解决方案:
# 1. 检查环境变量
cat .env.local | grep SUPABASE

# 2. 测试连接
bun run test:db:connection

# 3. 重置连接
bun run db:reset
```

### 3. 构建问题

#### 3.1 TypeScript 错误
```bash
# 问题: TypeScript 类型错误
# 解决方案:
# 1. 检查类型
bun run type-check

# 2. 忽略错误 (临时)
bun run build --no-lint

# 3. 更新类型定义
bun update @types/*
```

#### 3.2 内存不足
```bash
# 问题: 内存不足错误
# 解决方案:
# 1. 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 2. 使用 Bun (更高效)
bun run dev
```

---

## 📚 相关文档

- [项目架构文档](../01-ARCHITECTURE/PROJECT_OVERVIEW.md)
- [代码规范指南](./02-CODE_STANDARDS.md)
- [测试策略文档](../TESTING/01-TESTING_STRATEGY.md)
- [部署指南](./03-DEPLOYMENT_GUIDE.md)
- [贡献指南](./04-CONTRIBUTING.md)

---

**环境要求**: 确保所有开发环境要求满足后再开始开发工作。

**定期更新**: 定期更新依赖包和开发工具，保持开发环境的现代化。

**安全注意**: 不要将敏感信息提交到版本控制系统，始终使用环境变量管理配置。

---

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」
