---
@file: YYC3-XY-架构类-部署架构设计文档.md
@description: YYC³-XY智能成长守护系统的部署架构设计文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-26
@updated: 2025-12-28
@status: published
@tags: 部署架构,架构设计,五高五标五化,Docker,Kubernetes,CI/CD
---

# YYC³-XY 架构类 - 部署架构设计文档

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***

## 文档变更记录

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|--------|----------|----------|--------|
| v1.0.0 | 2025-12-26 | 初始版本创建 | AI Assistant |
| v1.0.1 | 2025-12-28 | 元数据标准化 | YYC³ Team |

---

## 目录

- [一、部署架构概述](#一部署架构概述)
- [二、部署架构设计原则](#二部署架构设计原则)
- [三、部署环境设计](#三部署环境设计)
- [四、容器化部署架构](#四容器化部署架构)
- [五、CI/CD流水线](#五cicd流水线)
- [六、服务编排与调度](#六服务编排与调度)
- [七、配置管理](#七配置管理)
- [八、部署流程](#八部署流程)
- [九、灰度发布与回滚](#九灰度发布与回滚)
- [十、监控与运维](#十监控与运维)
- [十一、架构演进规划](#十一架构演进规划)
- [十二、风险评估与应对](#十二风险评估与应对)

---

## 一、部署架构概述

### 1.1 架构定位

YYC³ AI小语智能成长守护系统的部署架构基于"五高五标五化"要求构建，采用容器化、自动化、云原生的部署方案，实现系统的高可用、高性能、高安全运行。

### 1.2 核心目标

- **高可用性**：7×24小时不间断服务，故障快速恢复
- **高性能**：快速部署，秒级扩缩容，高效资源利用
- **高安全性**：部署过程安全可控，敏感信息加密存储
- **高扩展性**：支持水平扩展，弹性伸缩
- **高可维护性**：部署流程标准化，运维操作自动化

### 1.3 架构层次

```
┌─────────────────────────────────────────────────────────────┐
│                     用户访问层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Web浏览器  │  │   移动APP    │  │   第三方集成 │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     负载均衡层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Nginx/ALB  │  │   CDN加速    │  │   WAF防护    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     应用服务层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Next.js    │  │   API网关    │  │   微服务群   │        │
│  │   前端服务   │  │   (1229)     │  │   容器化部署 │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     数据存储层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ PostgreSQL   │  │    Redis     │  │  Qdrant/ES   │        │
│  │   (5432)     │  │   (6379)     │  │   (6333)     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     基础设施层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Docker/K8s  │  │   云服务器   │  │   网络VPC    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 核心组件

| 组件名称 | 功能描述 | 端口 | 版本 |
|---------|---------|------|------|
| Docker | 容器运行时 | 2375/2376 | latest |
| Docker Compose | 本地容器编排 | - | latest |
| Nginx | 反向代理/负载均衡 | 80/443 | latest |
| PostgreSQL | 关系型数据库 | 5432 | 16.0 |
| Redis | 缓存/会话存储 | 6379 | 7.2 |
| Qdrant | 向量数据库 | 6333 | latest |
| Next.js | 前端开发服务器 | 3000 | latest |
| API Gateway | API网关服务 | 1229 | latest |
| Grafana | 监控可视化 | 3001 | latest |

---

## 二、部署架构设计原则

### 2.1 五高原则

#### 高可用性

- 关键服务多副本部署
- 健康检查和自动重启
- 故障自动转移
- 数据多副本存储

#### 高性能

- 容器化快速启动
- 资源隔离和限制
- 负载均衡优化
- 缓存策略优化

#### 高安全性

- 容器镜像安全扫描
- 网络隔离和访问控制
- 敏感信息加密存储
- 安全基线配置

#### 高扩展性

- 水平扩展支持
- 弹性伸缩配置
- 无状态服务设计
- 服务发现机制

#### 高可维护性

- 基础设施即代码
- 配置版本管理
- 自动化部署流程
- 标准化运维操作

### 2.2 五标原则

#### 标准化

- 统一容器镜像标准
- 统一配置管理标准
- 统一部署流程标准
- 统一监控告警标准

#### 规范化

- 容器命名规范
- 配置文件规范
- 日志格式规范
- 部署文档规范

#### 自动化

- 自动化构建流程
- 自动化测试流程
- 自动化部署流程
- 自动化运维流程

#### 智能化

- 智能资源调度
- 智能故障预测
- 智能容量规划
- 智能告警聚合

#### 可视化

- 部署状态可视化
- 资源使用可视化
- 服务拓扑可视化
- 监控数据可视化

### 2.3 五化原则

#### 流程化

- 需求评估流程
- 方案设计流程
- 实施部署流程
- 验收测试流程

#### 文档化

- 部署架构文档
- 部署操作手册
- 应急处理手册
- 故障排查手册

#### 工具化

- 部署工具链
- 监控工具链
- 运维工具链
- 诊断工具链

#### 数字化

- 部署数据数字化
- 运维记录数字化
- 性能指标数字化
- 决策依据数字化

#### 生态化

- 云服务生态集成
- 开源工具集成
- 第三方服务集成
- 持续优化迭代

---

## 三、部署环境设计

### 3.1 环境划分

| 环境 | 用途 | 配置 | 部署方式 |
|------|------|------|---------|
| 开发环境 | 本地开发和调试 | 2核4G，Docker Compose | Docker Compose |
| 测试环境 | 功能测试和集成测试 | 4核8G，Docker Compose | Docker Compose |
| 预发布环境 | 生产前验证 | 8核16G，Docker Compose | Docker Compose |
| 生产环境 | 线上服务 | 16核32G，Docker Compose | Docker Compose |

### 3.2 开发环境配置

#### 3.2.1 系统要求

- 操作系统：macOS 12+ / Ubuntu 20.04+ / Windows 10+
- Docker：20.10+
- Docker Compose：2.0+
- Node.js：18.0+
- 内存：≥8GB
- 磁盘：≥50GB

#### 3.2.2 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| API网关 | 1229 | 主服务端口 |
| 前端开发服务器 | 3000 | Next.js开发服务器 |
| Grafana | 3001 | 监控面板 |
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存 |
| Qdrant | 6333 | 向量数据库 |

### 3.3 测试环境配置

#### 3.3.1 基础设施

- 服务器：4核8G × 2台
- 存储：100GB SSD
- 网络：内网互通，外网访问
- 数据库：PostgreSQL 16.0
- 缓存：Redis 7.2

#### 3.3.2 服务部署

```yaml
services:
  # API网关
  api-gateway:
    image: yyc3-xy-ai/api-gateway:latest
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://user:pass@postgres:5432/yyc3_test
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  # PostgreSQL数据库
  postgres:
    image: postgres:16.0
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=yyc3_test
      - POSTGRES_USER=yyc3_user
      - POSTGRES_PASSWORD=test_password
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis缓存
  redis:
    image: redis:7.2
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data

  # Qdrant向量数据库
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant-data:/qdrant/storage

volumes:
  postgres-data:
  redis-data:
  qdrant-data:
```

### 3.4 生产环境配置

#### 3.4.1 基础设施

- 服务器：16核32G × 3台
- 存储：500GB SSD RAID10
- 网络：VPC内网，负载均衡
- 数据库：PostgreSQL 16.0（主从复制）
- 缓存：Redis 7.2（哨兵模式）
- 备份：每日全量备份，实时增量备份

#### 3.4.2 高可用配置

```yaml
services:
  # API网关（多副本）
  api-gateway:
    image: yyc3-xy-ai/api-gateway:latest
    ports:
      - "1229:1229"
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # PostgreSQL主库
  postgres-master:
    image: postgres:16.0
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=yyc3_prod
      - POSTGRES_USER=yyc3_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD}
    volumes:
      - postgres-master-data:/var/lib/postgresql/data
      - ./postgresql/master.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf

  # PostgreSQL从库
  postgres-slave:
    image: postgres:16.0
    environment:
      - POSTGRES_DB=yyc3_prod
      - POSTGRES_USER=yyc3_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_MASTER_HOST=postgres-master
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD}
    volumes:
      - postgres-slave-data:/var/lib/postgresql/data
      - ./postgresql/slave.conf:/etc/postgresql/postgresql.conf
    depends_on:
      - postgres-master
    command: postgres -c config_file=/etc/postgresql/postgresql.conf

  # Redis哨兵模式
  redis-master:
    image: redis:7.2
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-master-data:/data

  redis-slave-1:
    image: redis:7.2
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD} --slaveof redis-master 6379 --masterauth ${REDIS_PASSWORD}
    depends_on:
      - redis-master

  redis-sentinel:
    image: redis:7.2
    command: redis-sentinel /etc/redis/sentinel.conf
    volumes:
      - ./redis/sentinel.conf:/etc/redis/sentinel.conf
    depends_on:
      - redis-master
      - redis-slave-1

volumes:
  postgres-master-data:
  postgres-slave-data:
  redis-master-data:
```

---

## 四、容器化部署架构

### 4.1 容器化技术栈

#### 4.1.1 技术选型

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| Docker | 20.10+ | 容器运行时 | 应用容器化 |
| Docker Compose | 2.0+ | 容器编排 | 本地/测试环境 |
| Nginx | latest | 反向代理 | 负载均衡 |
| PostgreSQL | 16.0 | 关系型数据库 | 数据存储 |
| Redis | 7.2 | 缓存/会话 | 高速缓存 |
| Qdrant | latest | 向量数据库 | 向量检索 |

#### 4.1.2 镜像管理

```dockerfile
# API网关 Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 1229

CMD ["node", "dist/main.js"]
```

```dockerfile
# Next.js前端 Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### 4.2 Docker Compose配置

#### 4.2.1 主配置文件

```yaml
version: '3.8'

services:
  # API网关
  api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: yyc3-api-gateway
    restart: unless-stopped
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=1229
      - DATABASE_URL=postgresql://${DB_USER:-yyc3_user}:${DB_PASSWORD:-password}@postgres:5432/${DB_NAME:-yyc3}
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
      - JWT_SECRET=${JWT_SECRET:-your-secret-key}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      qdrant:
        condition: service_healthy
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Next.js前端
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: yyc3-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - NEXT_PUBLIC_API_URL=http://localhost:1229
    depends_on:
      - api-gateway
    networks:
      - yyc3-network

  # PostgreSQL数据库
  postgres:
    image: postgres:16.0-alpine
    container_name: yyc3-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${DB_NAME:-yyc3}
      - POSTGRES_USER=${DB_USER:-yyc3_user}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./postgresql/init:/docker-entrypoint-initdb.d
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-yyc3_user} -d ${DB_NAME:-yyc3}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis缓存
  redis:
    image: redis:7.2-alpine
    container_name: yyc3-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-password}
    volumes:
      - redis-data:/data
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Qdrant向量数据库
  qdrant:
    image: qdrant/qdrant:latest
    container_name: yyc3-qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - qdrant-data:/qdrant/storage
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Grafana监控
  grafana:
    image: grafana/grafana:latest
    container_name: yyc3-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_USER:-admin}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - api-gateway
    networks:
      - yyc3-network

  # Nginx反向代理
  nginx:
    image: nginx:latest
    container_name: yyc3-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - api-gateway
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  grafana-data:
```

#### 4.2.2 环境变量配置

```bash
# .env
NODE_ENV=production

# 数据库配置
DB_NAME=yyc3
DB_USER=yyc3_user
DB_PASSWORD=your_secure_password

# Redis配置
REDIS_PASSWORD=your_redis_password

# JWT配置
JWT_SECRET=your_jwt_secret_key

# AI服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Grafana配置
GRAFANA_USER=admin
GRAFANA_PASSWORD=your_grafana_password
```

### 4.3 镜像构建与推送

#### 4.3.1 构建脚本

```bash
#!/bin/bash
# build.sh

set -e

VERSION=${1:-latest}
REGISTRY=${REGISTRY:-registry.example.com}

echo "Building images for version: $VERSION"

# 构建API网关镜像
echo "Building API Gateway image..."
docker build -f Dockerfile.api -t ${REGISTRY}/yyc3-xy-ai/api-gateway:${VERSION} .
docker tag ${REGISTRY}/yyc3-xy-ai/api-gateway:${VERSION} ${REGISTRY}/yyc3-xy-ai/api-gateway:latest

# 构建前端镜像
echo "Building Frontend image..."
docker build -f Dockerfile.frontend -t ${REGISTRY}/yyc3-xy-ai/frontend:${VERSION} .
docker tag ${REGISTRY}/yyc3-xy-ai/frontend:${VERSION} ${REGISTRY}/yyc3-xy-ai/frontend:latest

echo "Build completed successfully!"
```

#### 4.3.2 推送脚本

```bash
#!/bin/bash
# push.sh

set -e

VERSION=${1:-latest}
REGISTRY=${REGISTRY:-registry.example.com}

echo "Pushing images for version: $VERSION"

# 推送API网关镜像
echo "Pushing API Gateway image..."
docker push ${REGISTRY}/yyc3-xy-ai/api-gateway:${VERSION}
docker push ${REGISTRY}/yyc3-xy-ai/api-gateway:latest

# 推送前端镜像
echo "Pushing Frontend image..."
docker push ${REGISTRY}/yyc3-xy-ai/frontend:${VERSION}
docker push ${REGISTRY}/yyc3-xy-ai/frontend:latest

echo "Push completed successfully!"
```

---

## 五、CI/CD流水线

### 5.1 CI/CD架构

```
┌──────────────┐
│   代码提交   │
│   Git Push   │
└──────┬───────┘
       ↓
┌──────────────┐
│  触发构建    │
│  GitHub/GitLab│
└──────┬───────┘
       ↓
┌──────────────┐
│  代码检查    │
│  Lint/Type   │
└──────┬───────┘
       ↓
┌──────────────┐
│  单元测试    │
│  Jest/Vitest │
└──────┬───────┘
       ↓
┌──────────────┐
│  集成测试    │
│  E2E Tests   │
└──────┬───────┘
       ↓
┌──────────────┐
│  构建镜像    │
│  Docker Build│
└──────┬───────┘
       ↓
┌──────────────┐
│  推送镜像    │
│  Registry    │
└──────┬───────┘
       ↓
┌──────────────┐
│  部署到环境  │
│  Staging/Prod│
└──────┬───────┘
       ↓
┌──────────────┐
│  健康检查    │
│  Smoke Tests │
└──────────────┘
```

### 5.2 GitHub Actions配置

#### 5.2.1 主工作流

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:16.0
        env:
          POSTGRES_DB: yyc3_test
          POSTGRES_USER: yyc3_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7.2
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://yyc3_user:test_password@localhost:5432/yyc3_test
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://yyc3_user:test_password@localhost:5432/yyc3_test
          REDIS_URL: redis://localhost:6379

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  docker-build:
    name: Docker Build & Push
    runs-on: ubuntu-latest
    needs: build
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.api
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.yyc3-ai.com
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # 部署命令

      - name: Run smoke tests
        run: |
          echo "Running smoke tests..."
          # 测试命令

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://yyc3-ai.com
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploying to production environment..."
          # 部署命令

      - name: Run smoke tests
        run: |
          echo "Running smoke tests..."
          # 测试命令
```

### 5.3 部署脚本

#### 5.3.1 部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

echo "Deploying to ${ENVIRONMENT} environment..."

# 加载环境变量
if [ -f .env.${ENVIRONMENT} ]; then
  export $(cat .env.${ENVIRONMENT} | xargs)
else
  echo "Environment file .env.${ENVIRONMENT} not found"
  exit 1
fi

# 拉取最新镜像
echo "Pulling latest images..."
docker-compose -f docker-compose.${ENVIRONMENT}.yml pull

# 停止旧容器
echo "Stopping old containers..."
docker-compose -f docker-compose.${ENVIRONMENT}.yml down

# 启动新容器
echo "Starting new containers..."
docker-compose -f docker-compose.${ENVIRONMENT}.yml up -d

# 等待服务启动
echo "Waiting for services to be ready..."
sleep 30

# 健康检查
echo "Running health checks..."
curl -f http://localhost:1229/health || exit 1

echo "Deployment completed successfully!"
```

---

## 六、服务编排与调度

### 6.1 服务编排策略

#### 6.1.1 启动顺序

```yaml
services:
  # 第一层：基础设施服务
  postgres:
    depends_on: []
  
  redis:
    depends_on: []
  
  qdrant:
    depends_on: []

  # 第二层：应用服务
  api-gateway:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      qdrant:
        condition: service_healthy

  # 第三层：前端服务
  frontend:
    depends_on:
      - api-gateway

  # 第四层：监控服务
  grafana:
    depends_on:
      - api-gateway
```

#### 6.1.2 资源限制

```yaml
services:
  api-gateway:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G

  postgres:
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 8G
        reservations:
          cpus: '2.0'
          memory: 4G

  redis:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

### 6.2 健康检查

#### 6.2.1 应用健康检查

```typescript
// health-check.ts
import { Router } from 'express';
import { Pool } from 'pg';
import Redis from 'ioredis';

const router = Router();

export function createHealthCheckRouter(pool: Pool, redis: Redis) {
  router.get('/health', async (req, res) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown',
        qdrant: 'unknown'
      }
    };

    try {
      await pool.query('SELECT 1');
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
    }

    try {
      await redis.ping();
      health.services.redis = 'healthy';
    } catch (error) {
      health.services.redis = 'unhealthy';
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  });

  return router;
}
```

#### 6.2.2 Docker健康检查

```yaml
services:
  api-gateway:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yyc3_user -d yyc3"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
```

---

## 七、配置管理

### 7.1 配置文件结构

```
config/
├── default.json          # 默认配置
├── development.json       # 开发环境配置
├── test.json             # 测试环境配置
├── staging.json          # 预发布环境配置
└── production.json       # 生产环境配置
```

### 7.2 配置管理方案

```typescript
// config/index.ts
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig();

const env = process.env.NODE_ENV || 'development';

const defaultConfig = {
  port: 1229,
  database: {
    host: 'localhost',
    port: 5432,
    database: 'yyc3',
    user: 'yyc3_user',
    password: 'password'
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: ''
  },
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '7d'
  }
};

const envConfig = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'yyc3_dev',
      user: process.env.DB_USER || 'yyc3_user',
      password: process.env.DB_PASSWORD || 'password'
    }
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  }
};

export const config = {
  ...defaultConfig,
  ...envConfig[env]
};
```

---

## 八、部署流程

### 8.1 标准部署流程

#### 8.1.1 开发环境部署

```bash
# 1. 克隆代码
git clone https://github.com/YY-Nexus/yyc3-xy-03.git
cd yyc3-xy-03

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 启动服务
docker-compose up -d

# 5. 初始化数据库
npm run db:migrate

# 6. 访问应用
open http://localhost:3000
```

#### 8.1.2 生产环境部署

```bash
# 1. 准备部署环境
ssh user@production-server
cd /opt/yyc3-xy-ai

# 2. 拉取最新代码
git pull origin main

# 3. 备份数据库
docker-compose exec postgres pg_dump -U yyc3_user yyc3 > backup_$(date +%Y%m%d_%H%M%S).sql

# 4. 拉取最新镜像
docker-compose pull

# 5. 执行数据库迁移
docker-compose run --rm api-gateway npm run db:migrate

# 6. 滚动更新服务
docker-compose up -d --no-deps --build api-gateway

# 7. 健康检查
curl -f http://localhost:1229/health

# 8. 清理旧镜像
docker image prune -f
```

### 8.2 回滚流程

```bash
# 1. 查看历史版本
git log --oneline

# 2. 切换到目标版本
git checkout <commit-hash>

# 3. 重新部署
./deploy.sh production

# 4. 恢复数据库（如需要）
docker-compose exec -T postgres psql -U yyc3_user yyc3 < backup_20251226_100000.sql
```

---

## 九、灰度发布与回滚

### 9.1 灰度发布策略

#### 9.1.1 蓝绿部署

```bash
# 蓝环境（当前版本）
docker-compose -f docker-compose.blue.yml up -d

# 绿环境（新版本）
docker-compose -f docker-compose.green.yml up -d

# 切换流量
# 更新Nginx配置指向绿环境
nginx -s reload

# 验证新版本
# 如果出现问题，快速切换回蓝环境
```

#### 9.1.2 金丝雀发布

```yaml
# Nginx配置
upstream api_gateway {
  server api-gateway-v1:1229 weight=90;  # 旧版本 90%
  server api-gateway-v2:1229 weight=10;  # 新版本 10%
}

# 逐步增加新版本流量
# 10% -> 25% -> 50% -> 75% -> 100%
```

### 9.2 自动回滚机制

```typescript
// 自动回滚监控
async function monitorDeployment() {
  const metrics = await getMetrics();
  
  if (metrics.errorRate > 0.05) {
    console.error('Error rate too high, rolling back...');
    await rollback();
  }
  
  if (metrics.latencyP95 > 2000) {
    console.error('Latency too high, rolling back...');
    await rollback();
  }
}

async function rollback() {
  await exec('git checkout previous_version');
  await exec('./deploy.sh production');
}
```

---

## 十、监控与运维

### 10.1 监控体系

#### 10.1.1 监控层级

- **基础设施监控**：CPU、内存、磁盘、网络
- **容器监控**：容器状态、资源使用、健康检查
- **应用监控**：API性能、错误率、业务指标
- **业务监控**：用户活跃度、功能使用、转化率

#### 10.1.2 监控指标

| 指标类别 | 指标名称 | 告警阈值 |
|---------|---------|---------|
| 系统 | CPU使用率 | >90% |
| 系统 | 内存使用率 | >90% |
| 系统 | 磁盘使用率 | >90% |
| 应用 | API错误率 | >5% |
| 应用 | P95响应时间 | >2s |
| 应用 | 并发连接数 | >1000 |

### 10.2 日志管理

#### 10.2.1 日志收集

```yaml
# Filebeat配置
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/containers/*.log
    fields:
      service: yyc3-xy-ai
      environment: production
    fields_under_root: true

output.logstash:
  hosts: ["logstash:5044"]
```

#### 10.2.2 日志存储

- 热数据：Elasticsearch（30天）
- 温数据：对象存储（90天）
- 冷数据：归档存储（1年）

### 10.3 备份策略

#### 10.3.1 数据库备份

```bash
# 每日全量备份
0 2 * * * pg_dump -U yyc3_user yyc3 | gzip > /backup/yyc3_$(date +\%Y\%m\%d).sql.gz

# 每小时增量备份
0 * * * * pg_dump -U yyc3_user yyc3 --format=custom | gzip > /backup/yyc3_$(date +\%Y\%m\%d_\%H).sql.gz

# 保留7天备份
find /backup -name "yyc3_*.sql.gz" -mtime +7 -delete
```

#### 10.3.2 配置备份

```bash
# 备份配置文件
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
  /opt/yyc3-xy-ai/config \
  /opt/yyc3-xy-ai/docker-compose.yml \
  /opt/yyc3-xy-ai/.env
```

---

## 十一、高可用配置规划

### 11.1 数据库高可用配置

#### 11.1.1 主从复制架构

**架构说明**：当前生产环境采用PostgreSQL单机部署，为实现高可用和读写分离，规划部署主从复制架构。

**架构设计**：

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  应用服务    │  写操作  │  PostgreSQL  │  主从同步  │  PostgreSQL  │
│  (API网关)   │────────▶│   主库       │────────▶│   从库       │
│              │         │  (Master)    │         │  (Slave)     │
└──────────────┘         └──────────────┘         └──────────────┘
       │                          │                          │
       └────────── 读操作 ─────────┴────────── 读操作 ─────────┘
```

**配置方案**：

```yaml
# PostgreSQL主从复制配置
services:
  # PostgreSQL主库
  postgres-master:
    image: postgres:16.0-alpine
    container_name: yyc3-postgres-master
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${DB_NAME:-yyc3}
      - POSTGRES_USER=${DB_USER:-yyc3_user}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD:-replication_password}
    volumes:
      - postgres-master-data:/var/lib/postgresql/data
      - ./postgresql/master.conf:/etc/postgresql/postgresql.conf:ro
      - ./postgresql/pg_hba.conf:/etc/postgresql/pg_hba.conf:ro
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-yyc3_user} -d ${DB_NAME:-yyc3}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # PostgreSQL从库
  postgres-slave:
    image: postgres:16.0-alpine
    container_name: yyc3-postgres-slave
    restart: unless-stopped
    ports:
      - "5433:5432"
    environment:
      - POSTGRES_DB=${DB_NAME:-yyc3}
      - POSTGRES_USER=${DB_USER:-yyc3_user}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
      - POSTGRES_MASTER_HOST=postgres-master
      - POSTGRES_MASTER_PORT=5432
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD:-replication_password}
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - postgres-slave-data:/var/lib/postgresql/data
      - ./postgresql/slave.conf:/etc/postgresql/postgresql.conf:ro
    networks:
      - yyc3-network
    depends_on:
      postgres-master:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-yyc3_user} -d ${DB_NAME:-yyc3}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-master-data:
  postgres-slave-data:
```

**主库配置文件** (postgresql/master.conf):

```conf
# 连接配置
listen_addresses = '*'
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 1310kB
min_wal_size = 1GB
max_wal_size = 4GB

# 复制配置
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
synchronous_commit = on
synchronous_standby_names = 'postgres-slave'
hot_standby = on
```

**从库配置文件** (postgresql/slave.conf):

```conf
# 连接配置
listen_addresses = '*'
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 1310kB
min_wal_size = 1GB
max_wal_size = 4GB

# 复制配置
hot_standby = on
max_standby_streaming_delay = 30s
wal_receiver_status_interval = 10s
hot_standby_feedback = on
```

**读写分离配置**：

```typescript
// 数据库连接配置
const dbConfig = {
  master: {
    host: process.env.DB_MASTER_HOST || 'postgres-master',
    port: 5432,
    database: process.env.DB_NAME || 'yyc3',
    user: process.env.DB_USER || 'yyc3_user',
    password: process.env.DB_PASSWORD,
  },
  slave: {
    host: process.env.DB_SLAVE_HOST || 'postgres-slave',
    port: 5432,
    database: process.env.DB_NAME || 'yyc3',
    user: process.env.DB_USER || 'yyc3_user',
    password: process.env.DB_PASSWORD,
  },
};

// 读写分离路由
export const getDbConnection = (operation: 'read' | 'write') => {
  const config = operation === 'write' ? dbConfig.master : dbConfig.slave;
  return new Pool(config);
};
```

### 11.2 Redis高可用配置

#### 11.2.1 Redis哨兵模式

**架构说明**：当前生产环境采用Redis单机部署，为实现高可用，规划部署Redis哨兵模式。

**架构设计**：

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  应用服务    │         │  Redis Master│         │  Redis Slave │
│  (API网关)   │────────▶│   (主节点)   │◀────────│   (从节点)   │
│              │         └──────────────┘         └──────────────┘
└──────────────┘                  │
                                  │ 主从同步
                                  ▼
                           ┌──────────────┐
                           │ Redis Sentinel│
                           │   (哨兵)     │
                           └──────────────┘
```

**配置方案**：

```yaml
# Redis哨兵模式配置
services:
  # Redis主节点
  redis-master:
    image: redis:7.2-alpine
    container_name: yyc3-redis-master
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD:-password}
      --masterauth ${REDIS_PASSWORD:-password}
    volumes:
      - redis-master-data:/data
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-password}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Redis从节点1
  redis-slave-1:
    image: redis:7.2-alpine
    container_name: yyc3-redis-slave-1
    restart: unless-stopped
    ports:
      - "6380:6379"
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD:-password}
      --masterauth ${REDIS_PASSWORD:-password}
      --slaveof redis-master 6379
    volumes:
      - redis-slave-1-data:/data
    networks:
      - yyc3-network
    depends_on:
      redis-master:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-password}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Redis从节点2
  redis-slave-2:
    image: redis:7.2-alpine
    container_name: yyc3-redis-slave-2
    restart: unless-stopped
    ports:
      - "6381:6379"
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD:-password}
      --masterauth ${REDIS_PASSWORD:-password}
      --slaveof redis-master 6379
    volumes:
      - redis-slave-2-data:/data
    networks:
      - yyc3-network
    depends_on:
      redis-master:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-password}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Redis哨兵1
  redis-sentinel-1:
    image: redis:7.2-alpine
    container_name: yyc3-redis-sentinel-1
    restart: unless-stopped
    ports:
      - "26379:26379"
    command: redis-sentinel /etc/redis/sentinel.conf
    volumes:
      - ./redis/sentinel.conf:/etc/redis/sentinel.conf:ro
      - redis-sentinel-1-data:/data
    networks:
      - yyc3-network
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2

  # Redis哨兵2
  redis-sentinel-2:
    image: redis:7.2-alpine
    container_name: yyc3-redis-sentinel-2
    restart: unless-stopped
    ports:
      - "26380:26379"
    command: redis-sentinel /etc/redis/sentinel.conf
    volumes:
      - ./redis/sentinel.conf:/etc/redis/sentinel.conf:ro
      - redis-sentinel-2-data:/data
    networks:
      - yyc3-network
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2

  # Redis哨兵3
  redis-sentinel-3:
    image: redis:7.2-alpine
    container_name: yyc3-redis-sentinel-3
    restart: unless-stopped
    ports:
      - "26381:26379"
    command: redis-sentinel /etc/redis/sentinel.conf
    volumes:
      - ./redis/sentinel.conf:/etc/redis/sentinel.conf:ro
      - redis-sentinel-3-data:/data
    networks:
      - yyc3-network
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2

volumes:
  redis-master-data:
  redis-slave-1-data:
  redis-slave-2-data:
  redis-sentinel-1-data:
  redis-sentinel-2-data:
  redis-sentinel-3-data:
```

**哨兵配置文件** (redis/sentinel.conf):

```conf
port 26379
dir /tmp
sentinel monitor mymaster redis-master 6379 2
sentinel auth-pass mymaster ${REDIS_PASSWORD}
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000
sentinel deny-scripts-reconfig yes
```

### 11.3 性能优化配置

#### 11.3.1 CDN加速配置

**架构说明**：为提升前端资源加载速度和用户体验，规划部署CDN加速方案。

**CDN配置方案**：

```nginx
# Nginx CDN配置
server {
    listen 80;
    server_name cdn.yyc3-ai.com;

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
        
        # 启用Gzip压缩
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript 
                   application/x-javascript application/xml+rss 
                   application/json application/javascript;
        
        # 启用Brotli压缩（如果支持）
        brotli on;
        brotli_comp_level 6;
        brotli_types text/plain text/css application/json application/javascript 
                     application/x-javascript text/xml application/xml 
                     application/xml+rss text/javascript image/svg+xml;
        
        root /var/www/cdn;
    }

    # API代理
    location /api/ {
        proxy_pass http://api-gateway:1229;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**CDN厂商配置**（以阿里云CDN为例）：

```yaml
# CDN加速域名配置
cdn:
  domain: cdn.yyc3-ai.com
  origin:
    type: domain
    domain: api.yyc3-ai.com
    port: 80
    protocol: http
  
  # 缓存配置
  cache:
    - path: /*
      ttl: 3600
      weight: 1
    - path: /static/*
      ttl: 86400
      weight: 1
    - path: /api/*
      ttl: 0
      weight: 1
  
  # 压缩配置
  compression:
    enabled: true
    types:
      - text/plain
      - text/css
      - application/json
      - application/javascript
      - text/xml
      - application/xml
  
  # HTTPS配置
  https:
    enabled: true
    cert_id: your_cert_id
    http2: true
    tls_version:
      - TLSv1.2
      - TLSv1.3
```

#### 11.3.2 HTTP传输压缩配置

**Nginx Gzip压缩配置**：

```nginx
# nginx/nginx.conf
http {
    # Gzip压缩配置
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        application/xml+rss
        application/xhtml+xml
        application/rss+xml
        application/atom+xml
        image/svg+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        font/truetype
        font/x-woff
        font/woff2;
    
    # Brotli压缩配置（需要安装ngx_brotli模块）
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript
        image/svg+xml;
    
    server {
        listen 80;
        server_name api.yyc3-ai.com;

        # 静态资源压缩
        location ~* \.(css|js|json|xml|svg|woff|woff2|ttf|eot)$ {
            gzip_static on;
            brotli_static on;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # API代理
        location / {
            proxy_pass http://api-gateway:1229;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

**应用层压缩配置**（Node.js/Express）：

```typescript
// compression中间件配置
import compression from 'compression';

app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 1024,
    level: 6,
    memLevel: 8,
}));
```

### 11.4 高可用切换策略

#### 11.4.1 数据库主从切换

**自动故障转移**：

```bash
#!/bin/bash
# 数据库故障转移脚本

MASTER_HOST="postgres-master"
SLAVE_HOST="postgres-slave"
DB_USER="yyc3_user"
DB_NAME="yyc3"

# 检查主库状态
check_master() {
    pg_isready -h $MASTER_HOST -U $DB_USER -d $DB_NAME
    return $?
}

# 提升从库为主库
promote_slave() {
    echo "Promoting slave to master..."
    docker exec $SLAVE_HOST pg_ctl promote -D /var/lib/postgresql/data
    
    # 更新应用配置
    update_app_config
    
    echo "Failover completed"
}

# 更新应用配置
update_app_config() {
    # 更新环境变量或配置文件
    sed -i 's/DB_MASTER_HOST=.*/DB_MASTER_HOST=postgres-slave/' .env
}

# 主循环
while true; do
    if ! check_master; then
        echo "Master is down, promoting slave..."
        promote_slave
        break
    fi
    sleep 10
done
```

#### 11.4.2 Redis哨兵故障转移

Redis哨兵模式会自动进行故障转移，无需手动干预。应用需要配置哨兵地址：

```typescript
// Redis哨兵客户端配置
import Redis from 'ioredis';

const redis = new Redis({
    sentinels: [
        { host: 'redis-sentinel-1', port: 26379 },
        { host: 'redis-sentinel-2', port: 26380 },
        { host: 'redis-sentinel-3', port: 26381 },
    ],
    name: 'mymaster',
    password: process.env.REDIS_PASSWORD,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
```

### 11.5 高可用监控与告警

#### 11.5.1 数据库复制监控

```yaml
# Prometheus告警规则
groups:
  - name: postgresql_replication
    rules:
      - alert: PostgreSQLReplicationLag
        expr: pg_replication_lag_seconds > 30
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "PostgreSQL复制延迟过高"
          description: "从库复制延迟 {{ $value }} 秒"

      - alert: PostgreSQLMasterDown
        expr: pg_up{instance="postgres-master:5432"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL主库宕机"
          description: "主库 {{ $labels.instance }} 不可用"
```

#### 11.5.2 Redis哨兵监控

```yaml
# Prometheus告警规则
groups:
  - name: redis_sentinel
    rules:
      - alert: RedisMasterDown
        expr: redis_up{role="master"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis主节点宕机"
          description: "Redis主节点 {{ $labels.instance }} 不可用"

      - alert: RedisSentinelDown
        expr: redis_up{role="sentinel"} == 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Redis哨兵节点宕机"
          description: "Redis哨兵 {{ $labels.instance }} 不可用"
```

---

## 十二、架构演进规划

### 11.1 短期规划（1-3个月）

| 目标 | 具体措施 | 预期效果 | 完成时间 |
|------|---------|---------|---------|
| 完善监控体系 | 集成Prometheus、Grafana、Alertmanager | 实现全链路监控 | 2026-01-15 |
| 优化部署流程 | 完善CI/CD流水线，增加自动化测试 | 提升部署效率50% | 2026-01-30 |
| 增强安全防护 | 集成WAF、DDoS防护、安全扫描 | 提升系统安全性 | 2026-02-15 |

### 11.2 中期规划（3-6个月）

| 目标 | 具体措施 | 预期效果 | 完成时间 |
|------|---------|---------|---------|
| 容器编排升级 | 迁移到Kubernetes | 提升扩展性和可用性 | 2026-03-30 |
| 多地域部署 | 实现跨地域容灾 | 提升容灾能力 | 2026-04-30 |
| 智能运维 | 引入AIOps，实现故障自愈 | 降低运维成本 | 2026-05-30 |

### 11.3 长期规划（6-12个月）

| 目标 | 具体措施 | 预期效果 | 完成时间 |
|------|---------|---------|---------|
| 微服务架构 | 拆分单体应用为微服务 | 提升系统灵活性 | 2026-08-30 |
| 服务网格 | 引入Istio，实现服务治理 | 提升服务治理能力 | 2026-10-30 |
| 云原生改造 | 全面云原生化，Serverless架构 | 提升资源利用率 | 2026-12-30 |

---

## 十二、风险评估与应对

### 12.1 技术风险

| 风险 | 风险描述 | 影响程度 | 发生概率 | 应对措施 |
|------|---------|---------|---------|---------|
| 容器镜像漏洞 | 镜像存在安全漏洞 | 高 | 中 | 定期扫描镜像，及时更新基础镜像 |
| 配置错误 | 部署配置错误导致服务异常 | 高 | 低 | 配置版本管理，部署前验证 |
| 资源不足 | 服务器资源不足导致性能下降 | 中 | 中 | 监控资源使用，自动扩容 |
| 网络故障 | 网络故障导致服务不可用 | 高 | 低 | 多可用区部署，网络冗余 |

### 12.2 业务风险

| 风险 | 风险描述 | 影响程度 | 发生概率 | 应对措施 |
|------|---------|---------|---------|---------|
| 部署失败 | 新版本部署失败 | 高 | 中 | 完善回滚机制，快速恢复 |
| 数据丢失 | 数据库数据丢失 | 高 | 低 | 多副本备份，定期恢复演练 |
| 服务中断 | 服务中断影响用户体验 | 高 | 低 | 高可用架构，故障自动转移 |
| 性能下降 | 新版本性能下降 | 中 | 中 | 性能测试，灰度发布 |

---

## 附录

### A. 部署检查清单

#### A.1 部署前检查

- [ ] 代码已合并到主分支
- [ ] 所有测试通过
- [ ] 代码审查已完成
- [ ] 镜像已构建并推送
- [ ] 数据库迁移脚本已准备
- [ ] 配置文件已更新
- [ ] 备份已完成

#### A.2 部署后检查

- [ ] 所有服务已启动
- [ ] 健康检查通过
- [ ] 日志无错误
- [ ] 监控指标正常
- [ ] 功能测试通过
- [ ] 性能测试通过

### B. 相关文档

- [总体架构设计文档](./01-YYC3-XY-架构类-总体架构设计文档.md)
- [监控架构设计文档](./08-YYC3-XY-架构类-监控架构设计文档.md)
- [安全架构设计文档](./05-YYC3-XY-架构类-安全架构设计文档)
- [微服务架构设计文档](./02-YYC3-XY-架构类-微服务架构设计文档.md)

### C. 变更历史

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|-------|---------|---------|-------|
| V1.0 | 2025-12-26 | 初始版本 | AI助手 |

---

**文档结束**
