# YYC³ 智能插拔式移动AI系统 部署指南

## 📖 概述

本指南详细说明如何在不同环境中部署YYC³智能插拔式移动AI系统，包括开发环境、测试环境和生产环境的部署方案。

## 🏗️ 系统架构

### 部署架构图

```mermaid
graph TB
    subgraph "负载均衡层"
        LB[Nginx负载均衡器]
        SSL[SSL终端]
    end

    subgraph "应用层"
        APP1[YYC³应用实例1]
        APP2[YYC³应用实例2]
        APP3[YYC³应用实例3]
    end

    subgraph "数据层"
        PG[(PostgreSQL主库)]
        PGR[(PostgreSQL从库)]
        REDIS[(Redis集群)]
        ES[(Elasticsearch)]
        VECTOR[(向量数据库)]
    end

    subgraph "监控层"
        PROM[Prometheus]
        GRAF[Grafana]
        JAEGER[Jaeger]
        KIBANA[Kibana]
    end

    Internet --> SSL
    SSL --> LB
    LB --> APP1
    LB --> APP2
    LB --> APP3

    APP1 --> PG
    APP1 --> REDIS
    APP1 --> ES
    APP1 --> VECTOR

    APP2 --> PG
    APP2 --> REDIS
    APP2 --> ES
    APP2 --> VECTOR

    APP3 --> PG
    APP3 --> REDIS
    APP3 --> ES
    APP3 --> VECTOR

    PROM --> APP1
    PROM --> APP2
    PROM --> APP3
```

### 服务组件

| 服务 | 端口 | 描述 | 副置条件 |
|------|------|------|----------|
| **Nginx** | 80, 443 | 反向代理和负载均衡 | - |
| **API网关** | 8080 | 主应用和API服务 | 数据库、Redis |
| **工具服务** | 3001 | AI工具管理服务 | API网关 |
| **知识库服务** | 3002 | 知识库和向量搜索服务 | API网关、向量DB |
| **PostgreSQL** | 5432 | 主数据库 | - |
| **Redis** | 6379 | 缓存和会话存储 | - |
| **Elasticsearch** | 9200 | 全文搜索 | - |
| **Prometheus** | 9090 | 指标收集 | - |
| **Grafana** | 3001 | 监控面板 | Prometheus |

## 🚀 快速部署

### 一键部署脚本

使用提供的一键部署脚本：

```bash
# 克隆项目
git clone https://github.com/YY-Nexus/yyc3-xy-03.git
cd yyc3-xy-03

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要配置

# 一键部署
chmod +x deploy.sh
./deploy.sh deploy
```

### Docker Compose部署

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f yyc3-main

# 停止服务
docker-compose down
```

## 🔧 环境配置

### 开发环境

#### 系统要求
- CPU: 2核心以上
- 内存: 4GB以上
- 存储: 20GB以上
- 操作系统: macOS, Linux, Windows (WSL2)

#### 环境变量

```bash
# .env.development
NODE_ENV=development
PORT=8080
API_GATEWAY_PORT=8080
TOOL_SERVICE_PORT=3001
KNOWLEDGE_SERVICE_PORT=3002

# 数据库配置
DATABASE_URL=postgresql://postgres:password@localhost:5432/yyc3_ai_dev
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200

# AI服务配置
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 开发配置
DEBUG_MODE=true
HOT_RELOAD=true
LOG_LEVEL=debug
```

#### 启动步骤

```bash
# 1. 启动数据库服务
docker-compose up -d postgres redis elasticsearch

# 2. 安装依赖
bun install

# 3. 数据库迁移
bun run migrate

# 4. 启动开发服务器
bun run dev
```

### 测试环境

#### 系统要求
- CPU: 4核心以上
- 内存: 8GB以上
- 存储: 50GB以上
- 网络: 100Mbps以上

#### 环境变量

```bash
# .env.testing
NODE_ENV=testing
PORT=8080

# 数据库配置（独立数据库）
DATABASE_URL=postgresql://postgres:password@postgres-test:5432/yyc3_ai_test
REDIS_URL=redis://redis-test:6379

# AI服务配置（使用测试API）
OPENAI_API_KEY=your-test-openai-key
ANTHROPIC_API_KEY=your-test-anthropic-key

# 测试配置
TEST_MODE=true
MOCK_EXTERNAL_APIS=true
```

#### 部署配置

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  yyc3-test:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    environment:
      - NODE_ENV=testing
      - DATABASE_URL=postgresql://postgres:password@postgres-test:5432/yyc3_ai_test
    depends_on:
      - postgres-test
      - redis-test
    networks:
      - test-network

  postgres-test:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=yyc3_ai_test
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-test-data:/var/lib/postgresql/data
    networks:
      - test-network

  redis-test:
    image: redis:7-alpine
    networks:
      - test-network

networks:
  test-network:
    driver: bridge

volumes:
  postgres-test-data:
```

### 生产环境

#### 系统要求

**最小配置**:
- CPU: 8核心
- 内存: 16GB
- 存储: 200GB SSD
- 网络: 1Gbps

**推荐配置**:
- CPU: 16核心
- 内存: 32GB
- 存储: 500GB SSD
- 网络: 10Gbps
- 高可用架构（多节点）

#### 环境变量

```bash
# .env.production
NODE_ENV=production
PORT=8080

# 安全配置
JWT_SECRET=your-super-secure-jwt-secret-key
SESSION_SECRET=your-super-secure-session-secret
CORS_ORIGIN=https://yourdomain.com

# 数据库配置（主从）
DATABASE_URL=postgresql://user:password@postgres-master:5432/yyc3_ai
DATABASE_READ_URL=postgresql://user:password@postgres-slave:5432/yyc3_ai
REDIS_URL=redis://redis-cluster:6379
REDIS_SENTINEL_URL=redis://redis-sentinel:26379

# AI服务配置（生产API密钥）
OPENAI_API_KEY=sk-prod-xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-prod-xxxxxxxxxxxxxxxxxxxx

# 监控配置
PROMETHEUS_ENABLED=true
JAEGER_ENABLED=true
SENTRY_DSN=https://your-sentry-dsn

# 性能配置
ENABLE_CACHING=true
ENABLE_COMPRESSION=true
RATE_LIMIT_ENABLED=true
```

#### 生产部署配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./config/nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - yyc3-app
    restart: unless-stopped
    networks:
      - yyc3-network

  yyc3-app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs/app:/app/logs
      - ./uploads:/app/uploads
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
    depends_on:
      postgres-master:
        condition: service_healthy
      redis-cluster:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres-master:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=yyc3_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_REPLICATION_MODE=master
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD}
    volumes:
      - postgres-master-data:/var/lib/postgresql/data
      - ./config/postgres/postgresql.conf:/etc/postgresql/postgresql.conf
      - ./config/postgres/pg_hba.conf:/etc/postgresql/pg_hba.conf
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres-slave:
    image: postgres:15-alpine
    environment:
      - PGUSER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_MASTER_HOST=postgres-master
      - POSTGRES_REPLICATION_USER=replicator
      - POSTGRES_REPLICATION_PASSWORD=${REPLICATION_PASSWORD}
    volumes:
      - postgres-slave-data:/var/lib/postgresql/data
    depends_on:
      - postgres-master
    restart: unless-stopped
    networks:
      - yyc3-network

  redis-cluster:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - node.name=elasticsearch
      - cluster.name=yyc3-cluster
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    restart: unless-stopped
    networks:
      - yyc3-network

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - yyc3-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./config/grafana/datasources:/etc/grafana/provisioning/datasources:ro
    depends_on:
      - prometheus
    restart: unless-stopped
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  postgres-master-data:
  postgres-slave-data:
  redis-data:
  elasticsearch-data:
  prometheus-data:
  grafana-data:
```

## 🔒 安全配置

### SSL/TLS配置

```nginx
# config/nginx/nginx.conf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://yyc3-app:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 防火墙配置

```bash
# Ubuntu/Debian
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 5432/tcp   # 数据库（仅内部访问）
sudo ufw deny 6379/tcp   # Redis（仅内部访问）
sudo ufw deny 9200/tcp   # Elasticsearch（仅内部访问）

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 密钥管理

```bash
# 生成JWT密钥
openssl genrsa -out jwt-private.pem 4096
openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem

# 生成SSL证书（生产环境建议使用Let's Encrypt）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key \
  -out ssl/certificate.crt \
  -subj "/C=CN/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

## 📊 监控和日志

### Prometheus配置

```yaml
# config/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'yyc3-app'
    static_configs:
      - targets: ['yyc3-app:8080']
    metrics_path: '/api/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-master:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-cluster:6379']

  - job_name: 'elasticsearch'
    static_configs:
      - targets: ['elasticsearch:9200']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### Grafana仪表板

```json
{
  "dashboard": {
    "title": "YYC³系统监控",
    "panels": [
      {
        "title": "API请求量",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "响应时间",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "错误率",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100"
          }
        ]
      }
    ]
  }
}
```

### 日志配置

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'yyc3-ai' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/audit.log',
    level: 'info',
    maxsize: 50 * 1024 * 1024,
    maxFiles: 10
  }));
}

export default logger;
```

## 🔄 备份和恢复

### 数据库备份

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/yyc3_ai_backup_$DATE.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
docker-compose exec postgres-master pg_dump -U postgres -d yyc3_ai > $BACKUP_FILE

# 压缩备份文件
gzip $BACKUP_FILE

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_FILE.gz"
```

### 自动备份配置

```bash
# 添加到crontab
# 每天凌晨2点执行备份
0 2 * * * /path/to/backup-database.sh

# 每周日凌晨3点执行全量备份
0 3 * * 0 /path/to/full-backup.sh
```

### 数据恢复

```bash
#!/bin/bash
# scripts/restore-database.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "用法: $0 <backup_file>"
    exit 1
fi

# 停止应用服务
docker-compose stop yyc3-app

# 恢复数据库
gunzip -c $BACKUP_FILE | docker-compose exec -T postgres-master psql -U postgres -d yyc3_ai

# 重启应用服务
docker-compose start yyc3-app

echo "数据库恢复完成"
```

## 🚀 CI/CD部署

### GitHub Actions配置

```yaml
# .github/workflows/deploy.yml
name: Deploy YYC³ AI System

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run type checking
        run: bun run type-check

      - name: Run linting
        run: bun run lint

      - name: Run tests
        run: bun run test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build application
        run: bun run build

      - name: Build Docker image
        run: |
          docker build -t yyc3/xy-ai:${{ github.sha }} .
          docker tag yyc3/xy-ai:latest yyc3/xy-ai:${{ github.sha }}

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push yyc3/xy-ai:${{ github.sha }}
          docker push yyc3/xy-ai:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_KEY }}
          script: |
            cd /opt/yyc3-xy-ai
            git pull origin main
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

## 🔧 故障排除

### 常见问题

#### 1. 服务无法启动

```bash
# 检查服务状态
docker-compose ps

# 查看服务日志
docker-compose logs yyc3-app

# 检查端口占用
netstat -tlnp | grep :8080

# 检查磁盘空间
df -h

# 检查内存使用
free -m
```

#### 2. 数据库连接失败

```bash
# 检查数据库状态
docker-compose exec postgres-master pg_isready -U postgres

# 检查数据库连接
docker-compose exec yyc3-app curl -f http://postgres-master:5432

# 检查网络连通性
docker network ls
docker network inspect yyc3_xy-ai_yyc3-network
```

#### 3. AI服务无响应

```bash
# 检查API密钥
grep OPENAI_API_KEY .env.production

# 测试API连接
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# 检查网络连接
ping api.openai.com
```

### 性能优化

#### 数据库优化

```sql
-- PostgreSQL配置优化
-- postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

-- 索引优化
CREATE INDEX CONCURRENTLY idx_ai_messages_created_at ON ai_messages(created_at);
CREATE INDEX CONCURRENTLY idx_goals_status_priority ON goals(status, priority);
CREATE INDEX CONCURRENTLY idx_knowledge_vectors_vector_id ON knowledge_vectors(vector_id);
```

#### Redis优化

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### 应用优化

```typescript
// 连接池配置
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'yyc3_ai',
  user: 'postgres',
  password: password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 缓存配置
const cacheOptions = {
  max: 1000,
  ttl: 1000 * 60 * 5, // 5分钟
  updateAgeOnGet: true,
  allowStale: false,
};
```

## 📋 部署清单

### 部署前检查

- [ ] 服务器资源满足最低要求
- [ ] 网络配置和防火墙规则
- [ ] SSL证书准备
- [ ] 数据库设计和迁移脚本
- [ ] 环境变量配置
- [ ] 监控和日志配置
- [ ] 备份策略制定
- [ ] 回滚方案准备

### 部署后验证

- [ ] 所有服务正常启动
- [ ] 健康检查接口正常
- [ ] 数据库连接正常
- [ ] 缓存服务正常
- [ ] AI服务响应正常
- [ ] 监控指标正常
- [ ] 日志收集正常
- [ ] 性能测试通过

### 部署文档

- [ ] 系统架构文档
- [ ] API接口文档
- [ ] 运维手册
- [ ] 故障排除指南
- [ ] 应急响应流程

---

最后更新: 2024-01-01