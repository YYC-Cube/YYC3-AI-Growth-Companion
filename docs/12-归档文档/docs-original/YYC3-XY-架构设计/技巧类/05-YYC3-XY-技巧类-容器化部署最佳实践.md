# YYC³ AI小语智能成长守护系统 - 容器化部署最佳实践

## 文档信息

- **文档类型**: 技巧类
- **文档编号**: 05-YYC3-XY-技巧类-容器化部署最佳实践
- **版本**: V1.0
- **创建日期**: 2025-12-25
- **适用范围**: YYC³ AI小语智能成长守护系统容器化部署

## 一、文档概述

### 1.1 文档目的

本文档旨在提供YYC³ AI小语智能成长守护系统容器化部署的全面最佳实践指南，涵盖Docker Compose配置优化、容器镜像构建、资源管理、安全加固等关键领域，确保系统在容器化环境中的高可用性、高性能和高安全性。

### 1.2 适用场景

- 本地开发环境容器化部署
- 测试环境容器化部署
- 生产环境容器化部署
- 容器编排平台迁移准备（Kubernetes）

### 1.3 核心原则

遵循「五高五标五化」要求：
- **高可用**: 容器健康检查、自动重启、故障恢复
- **高性能**: 资源优化、镜像精简、启动加速
- **高安全**: 镜像安全扫描、最小权限原则、网络隔离
- **高可扩展**: 水平扩展能力、服务解耦、配置外部化
- **高可维护**: 标准化配置、日志规范、监控完善

## 二、Docker Compose配置最佳实践

### 2.1 服务定义规范

#### 2.1.1 基础配置模板

```yaml
services:
  # 服务命名规范: yyc3-{服务名称}
  yyc3-service-name:
    # 镜像配置
    image: {镜像名称}:{版本号}
    # 或使用构建配置
    build:
      context: .
      dockerfile: Dockerfile
      target: production
      args:
        NODE_ENV: production
    
    # 容器配置
    container_name: yyc3-{服务名称}
    restart: unless-stopped
    
    # 端口映射
    ports:
      - "宿主机端口:容器端口"
    
    # 环境变量
    environment:
      - ENV_VAR=value
    
    # 依赖关系
    depends_on:
      - service-1
      - service-2
    
    # 数据卷挂载
    volumes:
      - host-path:container-path:mode
    
    # 网络配置
    networks:
      - yyc3-network
    
    # 健康检查
    healthcheck:
      test: ["CMD", "command"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### 2.1.2 主应用服务配置

```yaml
yyc3-main:
  build:
    context: .
    dockerfile: Dockerfile
    target: production
  container_name: yyc3-main
  restart: unless-stopped
  ports:
    - "1229:1229"
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_ENVIRONMENT=production
    - NEXT_PUBLIC_API_URL=http://localhost:1229
    - PORT=1229
    - API_GATEWAY_PORT=1229
    - TOOL_SERVICE_PORT=3001
    - KNOWLEDGE_SERVICE_PORT=3002
    - REDIS_URL=redis://redis:6379
    - DATABASE_URL=postgresql://postgres:password@postgres:5432/yyc3_ai
    - ELASTICSEARCH_URL=http://elasticsearch:9200
    - JWT_SECRET=${JWT_SECRET:-your-jwt-secret-key}
    - OPENAI_API_KEY=${OPENAI_API_KEY}
    - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
  depends_on:
    redis:
      condition: service_healthy
    postgres:
      condition: service_healthy
    elasticsearch:
      condition: service_healthy
  volumes:
    - ./data:/app/data
    - ./logs:/app/logs
    - ./uploads:/app/uploads
    - ./knowledge:/app/knowledge
  networks:
    - yyc3-network
  healthcheck:
    test: ["CMD", "bun", "-e", "fetch('http://localhost:1229/api/health').then(r=>r.ok?process.exit(0):process.exit(1))"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

### 2.2 重启策略选择

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| `no` | 不自动重启 | 临时调试容器 |
| `always` | 总是重启 | 关键服务，即使手动停止 |
| `on-failure` | 失败时重启 | 可容忍短暂停机的服务 |
| `unless-stopped` | 除非手动停止否则重启 | 生产环境推荐 |

### 2.3 依赖关系管理

#### 2.3.1 基础依赖配置

```yaml
depends_on:
  - redis
  - postgres
  - elasticsearch
```

#### 2.3.2 健康检查依赖（推荐）

```yaml
depends_on:
  redis:
    condition: service_healthy
  postgres:
    condition: service_healthy
  elasticsearch:
    condition: service_healthy
```

## 三、容器镜像优化

### 3.1 多阶段构建

#### 3.1.1 Node.js应用多阶段构建

```dockerfile
# 阶段1: 依赖安装
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 阶段2: 构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 阶段3: 生产运行
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 1229
CMD ["node", "server.js"]
```

#### 3.1.2 Python应用多阶段构建

```dockerfile
# 阶段1: 构建
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 阶段2: 运行
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
CMD ["python", "app.py"]
```

### 3.2 镜像精简技巧

#### 3.2.1 使用Alpine基础镜像

```dockerfile
# 推荐: Alpine镜像体积小
FROM node:18-alpine

# 避免: 完整镜像体积大
FROM node:18
```

#### 3.2.2 清理缓存和临时文件

```dockerfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    package1 \
    package2 && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

RUN pip install package && \
    pip cache purge
```

#### 3.2.3 合并RUN指令

```dockerfile
# 推荐: 合并RUN指令减少层数
RUN apt-get update && \
    apt-get install -y package && \
    rm -rf /var/lib/apt/lists/*

# 避免: 多个RUN指令增加层数
RUN apt-get update
RUN apt-get install -y package
RUN rm -rf /var/lib/apt/lists/*
```

### 3.3 镜像安全加固

#### 3.3.1 使用非root用户

```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
```

#### 3.3.2 只读根文件系统

```yaml
services:
  yyc3-main:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

#### 3.3.3 限制文件系统访问

```yaml
volumes:
  - /usr/local/lib/node_modules
  - /app/node_modules
```

## 四、资源限制与性能优化

### 4.1 资源限制配置

#### 4.1.1 CPU限制

```yaml
services:
  yyc3-main:
    deploy:
      resources:
        limits:
          cpus: '2.0'
        reservations:
          cpus: '0.5'
```

#### 4.1.2 内存限制

```yaml
services:
  yyc3-main:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 512M
```

#### 4.1.3 完整资源配置

```yaml
services:
  yyc3-main:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 4.2 服务资源配置建议

| 服务 | CPU限制 | 内存限制 | 说明 |
|------|---------|----------|------|
| 主应用 | 2.0 cores | 2G | 核心业务服务 |
| Nginx | 0.5 cores | 256M | 反向代理 |
| Redis | 1.0 cores | 512M | 缓存服务 |
| PostgreSQL | 2.0 cores | 2G | 数据库 |
| Elasticsearch | 2.0 cores | 2G | 日志存储 |
| Prometheus | 1.0 cores | 1G | 监控服务 |
| Grafana | 0.5 cores | 512M | 可视化 |

### 4.3 性能优化技巧

#### 4.3.1 启用Docker BuildKit

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

#### 4.3.2 使用构建缓存

```dockerfile
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
```

#### 4.3.3 优化层缓存顺序

```dockerfile
# 频繁变化的文件放在后面
COPY package.json ./
RUN npm install
COPY . .
```

## 五、健康检查配置

### 5.1 健康检查参数说明

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `test` | 健康检查命令 | 根据服务配置 |
| `interval` | 检查间隔 | 30s |
| `timeout` | 超时时间 | 10s |
| `retries` | 重试次数 | 3 |
| `start_period` | 启动宽限期 | 40s |

### 5.2 常见服务健康检查

#### 5.2.1 HTTP服务检查

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:1229/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

#### 5.2.2 Redis检查

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 30s
  timeout: 10s
  retries: 3
```

#### 5.2.3 PostgreSQL检查

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 30s
  timeout: 10s
  retries: 5
```

#### 5.2.4 Elasticsearch检查

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 5
```

### 5.3 自定义健康检查脚本

```bash
#!/bin/bash
# healthcheck.sh

# 检查HTTP端点
curl -f http://localhost:1229/api/health || exit 1

# 检查数据库连接
pg_isready -h postgres -U postgres || exit 1

# 检查Redis连接
redis-cli -h redis ping | grep -q PONG || exit 1

echo "All checks passed"
exit 0
```

```yaml
healthcheck:
  test: ["CMD", "/app/healthcheck.sh"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 六、数据持久化

### 6.1 数据卷配置

#### 6.1.1 命名卷（推荐）

```yaml
volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
  prometheus-data:
    driver: local
```

#### 6.1.2 绑定挂载

```yaml
volumes:
  - ./data:/app/data
  - ./logs:/app/logs
  - ./uploads:/app/uploads
```

### 6.2 数据备份策略

#### 6.2.1 自动备份服务

```yaml
backup:
  image: postgres:15-alpine
  container_name: yyc3-backup
  restart: unless-stopped
  environment:
    - PGPASSWORD=password
  volumes:
    - ./backups:/backups
  command: |
    sh -c "
      while true; do
        echo 'Creating backup...'
        pg_dump -h postgres -U postgres -d yyc3_ai > /backups/backup_$$(date +%Y%m%d_%H%M%S).sql
        echo 'Backup created'
        find /backups -name '*.sql' -mtime +7 -delete
        sleep 86400
      done
    "
  depends_on:
    - postgres
  networks:
    - yyc3-network
```

#### 6.2.2 备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 数据库备份
pg_dump -h postgres -U postgres -d yyc3_ai > $BACKUP_DIR/db_backup_$DATE.sql

# Redis备份
redis-cli -h redis BGSAVE
cp /data/dump.rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# 清理旧备份（保留7天）
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 6.3 数据恢复流程

#### 6.3.1 数据库恢复

```bash
# 停止服务
docker-compose stop yyc3-main

# 恢复数据库
docker-compose exec -T postgres psql -U postgres -d yyc3_ai < /backups/backup_20251225_120000.sql

# 重启服务
docker-compose start yyc3-main
```

#### 6.3.2 Redis恢复

```bash
# 停止Redis
docker-compose stop redis

# 恢复数据
cp /backups/redis_backup_20251225_120000.rdb ./redis-data/dump.rdb

# 重启Redis
docker-compose start redis
```

## 七、网络配置

### 7.1 网络类型选择

| 网络类型 | 说明 | 适用场景 |
|----------|------|----------|
| bridge | 桥接网络（默认） | 单机多容器通信 |
| host | 主机网络 | 高性能需求 |
| overlay | 覆盖网络 | 多机集群 |
| macvlan | MAC地址网络 | 需要独立IP |

### 7.2 自定义网络配置

```yaml
networks:
  yyc3-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1
    driver_opts:
      com.docker.network.bridge.name: yyc3-br0
```

### 7.3 网络隔离策略

#### 7.3.1 前端网络

```yaml
networks:
  frontend:
    driver: bridge
    internal: false
```

#### 7.3.2 后端网络

```yaml
networks:
  backend:
    driver: bridge
    internal: true
```

#### 7.3.3 数据库网络

```yaml
networks:
  database:
    driver: bridge
    internal: true
```

### 7.4 服务网络连接

```yaml
services:
  yyc3-main:
    networks:
      - frontend
      - backend
  
  postgres:
    networks:
      - backend
      - database
  
  nginx:
    networks:
      - frontend
```

## 八、环境变量管理

### 8.1 环境变量配置方式

#### 8.1.1 直接配置（开发环境）

```yaml
environment:
  - NODE_ENV=development
  - DATABASE_URL=postgresql://postgres:password@postgres:5432/yyc3_ai
```

#### 8.1.2 .env文件（推荐）

```yaml
env_file:
  - .env
  - .env.production
```

#### 8.1.3 环境变量文件

```bash
# .env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@postgres:5432/yyc3_ai
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
```

### 8.2 敏感信息管理

#### 8.2.1 使用Docker Secrets

```yaml
services:
  yyc3-main:
    secrets:
      - jwt_secret
      - database_password

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  database_password:
    file: ./secrets/database_password.txt
```

#### 8.2.2 使用环境变量替换

```yaml
environment:
  - JWT_SECRET=${JWT_SECRET}
  - DATABASE_PASSWORD=${DATABASE_PASSWORD}
  - OPENAI_API_KEY=${OPENAI_API_KEY}
```

### 8.3 环境变量最佳实践

| 实践 | 说明 |
|------|------|
| 使用.env文件 | 避免硬编码敏感信息 |
| 区分环境 | .env.development, .env.production |
| 默认值 | ${VAR:-default_value} |
| 文档化 | 在README中说明所有环境变量 |

## 九、日志管理

### 9.1 日志驱动配置

#### 9.1.1 JSON File驱动（默认）

```yaml
services:
  yyc3-main:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=yyc3-main"
```

#### 9.1.2 Syslog驱动

```yaml
services:
  yyc3-main:
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://192.168.0.42:123"
```

#### 9.1.3 Fluentd驱动

```yaml
services:
  yyc3-main:
    logging:
      driver: "fluentd"
      options:
        fluentd-address: "localhost:24224"
        tag: "yyc3.main"
```

### 9.2 日志收集配置

#### 9.2.1 ELK Stack集成

```yaml
logstash:
  image: docker.elastic.co/logstash/logstash:8.11.0
  container_name: yyc3-logstash
  restart: unless-stopped
  ports:
    - "5044:5044"
  volumes:
    - ./logging/logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
    - ./logs:/var/log/app:ro
  depends_on:
    - elasticsearch
  networks:
    - yyc3-network
```

#### 9.2.2 Logstash配置

```conf
input {
  file {
    path => "/var/log/app/*.log"
    start_position => "beginning"
    type => "yyc3-app"
  }
}

filter {
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:msg}" }
  }
  date {
    match => ["timestamp", "ISO8601"]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "yyc3-logs-%{+YYYY.MM.dd}"
  }
}
```

### 9.3 日志轮转策略

```yaml
services:
  yyc3-main:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        compress: "true"
```

## 十、安全加固

### 10.1 容器安全配置

#### 10.1.1 只读文件系统

```yaml
services:
  yyc3-main:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

#### 10.1.2 用户权限限制

```yaml
services:
  yyc3-main:
    user: "1001:1001"
```

#### 10.1.3 能力限制

```yaml
services:
  yyc3-main:
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 10.2 网络安全

#### 10.2.1 端口限制

```yaml
services:
  postgres:
    ports:
      - "127.0.0.1:5432:5432"
```

#### 10.2.2 网络隔离

```yaml
networks:
  backend:
    internal: true
```

### 10.3 镜像安全扫描

#### 10.3.1 使用Trivy扫描

```bash
# 扫描镜像
trivy image yyc3-main:latest

# 扫描Dockerfile
trivy config Dockerfile
```

#### 10.3.2 使用Docker Bench

```bash
# 运行Docker Bench Security
docker run --rm --net host --pid host --userns host --cap-add SYS_ADMIN \
  -v /var/lib/docker:/var/lib/docker \
  -v /dev:/dev \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker/docker-bench-security
```

## 十一、故障恢复

### 11.1 自动重启策略

```yaml
services:
  yyc3-main:
    restart: unless-stopped
    restart_policy:
      condition: on-failure
      delay: 5s
      max_attempts: 3
      window: 120s
```

### 11.2 故障排查命令

#### 11.2.1 查看容器日志

```bash
# 查看实时日志
docker-compose logs -f yyc3-main

# 查看最近100行日志
docker-compose logs --tail=100 yyc3-main

# 查看所有服务日志
docker-compose logs
```

#### 11.2.2 查看容器状态

```bash
# 查看所有容器状态
docker-compose ps

# 查看资源使用情况
docker stats

# 查看容器详细信息
docker inspect yyc3-main
```

#### 11.2.3 进入容器调试

```bash
# 进入容器
docker-compose exec yyc3-main sh

# 查看进程
docker-compose top yyc3-main

# 查看端口映射
docker-compose port yyc3-main 1229
```

### 11.3 故障恢复流程

#### 11.3.1 服务重启

```bash
# 重启单个服务
docker-compose restart yyc3-main

# 重启所有服务
docker-compose restart

# 强制重启
docker-compose restart -t 30 yyc3-main
```

#### 11.3.2 服务重建

```bash
# 重建服务
docker-compose up -d --force-recreate yyc3-main

# 重建所有服务
docker-compose up -d --force-recreate
```

#### 11.3.3 数据恢复

```bash
# 恢复数据库
docker-compose exec -T postgres psql -U postgres -d yyc3_ai < backup.sql

# 恢复Redis
docker-compose exec redis redis-cli FLUSHALL
docker-compose exec redis --pipe < backup.rdb
```

## 十二、监控与告警

### 12.1 容器监控

#### 12.1.1 Prometheus监控配置

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: yyc3-prometheus
  restart: unless-stopped
  ports:
    - "9090:9090"
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    - prometheus-data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.path=/prometheus'
    - '--storage.tsdb.retention.time=200h'
    - '--web.enable-lifecycle'
  networks:
    - yyc3-network
```

#### 12.1.2 cAdvisor监控

```yaml
cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  container_name: yyc3-cadvisor
  restart: unless-stopped
  ports:
    - "8080:8080"
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
    - /dev/disk/:/dev/disk:ro
  privileged: true
  networks:
    - yyc3-network
```

### 12.2 告警配置

#### 12.2.1 Alertmanager配置

```yaml
alertmanager:
  image: prom/alertmanager:latest
  container_name: yyc3-alertmanager
  restart: unless-stopped
  ports:
    - "9093:9093"
  volumes:
    - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    - alertmanager-data:/alertmanager
  networks:
    - yyc3-network
```

#### 12.2.2 告警规则

```yaml
groups:
  - name: container_alerts
    rules:
      - alert: ContainerDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Container {{ $labels.instance }} is down"
      
      - alert: HighCPUUsage
        expr: rate(container_cpu_usage_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
      
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
```

## 十三、部署流程

### 13.1 开发环境部署

```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

### 13.2 生产环境部署

```bash
# 构建镜像
docker-compose build

# 启动生产环境
docker-compose -f docker-compose.prod.yml up -d

# 健康检查
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 13.3 滚动更新

```bash
# 拉取新镜像
docker-compose pull

# 滚动更新
docker-compose up -d --no-deps --build yyc3-main

# 验证更新
docker-compose ps
docker-compose logs -f yyc3-main
```

## 十四、五高五标五化检查清单

### 14.1 五高原则检查项

#### 14.1.1 高可用性检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 健康检查 | 所有服务配置健康检查 | 每个服务都有healthcheck配置 | 检查docker-compose.yml |
| 自动重启 | 配置重启策略 | 使用unless-stopped或always | 检查restart配置 |
| 故障恢复 | 容器故障自动恢复 | 容器异常退出后自动重启 | 模拟容器崩溃 |
| 数据持久化 | 关键数据持久化 | 数据库、Redis使用命名卷 | 检查volumes配置 |
| 负载均衡 | 多实例部署支持 | 支持scale扩展 | 测试scale命令 |

#### 14.1.2 高性能检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 镜像优化 | 镜像体积 | 主应用镜像<500MB | docker images |
| 资源限制 | CPU/内存限制 | 所有服务设置资源限制 | 检查deploy.resources |
| 启动时间 | 容器启动时间 | <30秒 | docker-compose up -d |
| 缓存策略 | 构建缓存利用 | 利用层缓存 | docker-compose build |
| 网络性能 | 网络延迟 | <10ms | ping测试 |

#### 14.1.3 高安全性检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 非root用户 | 容器运行用户 | 使用非root用户 | 检查user配置 |
| 只读文件系统 | 根文件系统只读 | 配置read_only: true | 检查服务配置 |
| 镜像扫描 | 无高危漏洞 | 无Critical级别漏洞 | trivy scan |
| 网络隔离 | 内部网络隔离 | 数据库网络internal: true | 检查networks配置 |
| 敏感信息 | 无硬编码密钥 | 使用环境变量或secrets | grep检查代码 |

#### 14.1.4 高可扩展性检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 水平扩展 | 支持多实例 | 可scale到3+实例 | docker-compose scale |
| 无状态设计 | 无状态服务 | 状态存储在外部 | 检查架构设计 |
| 配置外部化 | 配置与代码分离 | 使用环境变量 | 检查.env文件 |
| 服务解耦 | 服务间松耦合 | 通过API通信 | 检查服务依赖 |
| 数据库扩展 | 支持读写分离 | 配置主从复制 | 检查数据库配置 |

#### 14.1.5 高可维护性检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 标准化配置 | 配置格式统一 | 遵循命名规范 | 检查配置文件 |
| 日志规范 | 日志格式统一 | JSON格式日志 | 检查日志输出 |
| 监控完善 | 监控指标完整 | 覆盖关键指标 | 检查Prometheus配置 |
| 文档完整 | 文档齐全 | 包含部署、运维文档 | 检查docs目录 |
| 版本管理 | 镜像版本化 | 使用语义化版本 | 检查镜像标签 |

### 14.2 五标体系检查项

#### 14.2.1 标准化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 命名规范 | 服务命名 | yyc3-{服务名} | 检查服务名 |
| 端口规范 | 端口使用 | 使用3200-3500 | 检查ports配置 |
| 配置规范 | 配置文件格式 | YAML格式 | 检查文件格式 |
| 目录规范 | 目录结构 | 遵循项目规范 | 检查目录结构 |
| 文档规范 | 文档格式 | 遵循文档规范 | 检查文档 |

#### 14.2.2 规范化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 代码规范 | 代码风格 | ESLint通过 | npm run lint |
| Git规范 | 提交信息 | Conventional Commits | 检查提交记录 |
| API规范 | API设计 | RESTful规范 | 检查API文档 |
| 数据库规范 | 表结构设计 | 遵循命名规范 | 检查数据库表 |
| 测试规范 | 测试覆盖 | >80% | npm run test |

#### 14.2.3 自动化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| CI/CD | 自动化部署 | 配置GitHub Actions | 检查.github/workflows |
| 自动测试 | 自动化测试 | 每次提交自动测试 | 检查测试配置 |
| 自动备份 | 自动备份 | 定时备份任务 | 检查backup服务 |
| 自动监控 | 自动监控 | Prometheus采集 | 检查监控配置 |
| 自动告警 | 自动告警 | Alertmanager配置 | 检查告警规则 |

#### 14.2.4 智能化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 智能调度 | 容器调度 | 自动资源分配 | 检查调度策略 |
| 智能扩缩容 | 自动扩缩容 | 根据负载调整 | 检查HPA配置 |
| 智能告警 | 智能告警 | 告警聚合 | 检查告警配置 |
| 智能日志 | 日志分析 | ELK日志分析 | 检查日志系统 |
| 智能监控 | 性能预测 | 基于历史数据 | 检查监控数据 |

#### 14.2.5 可视化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 监控仪表盘 | Grafana仪表盘 | 覆盖关键指标 | 访问Grafana |
| 日志可视化 | Kibana日志 | 日志查询界面 | 访问Kibana |
| 链路追踪 | Jaeger追踪 | 请求链路可视化 | 访问Jaeger |
| 拓扑图 | 服务拓扑图 | 服务依赖图 | 检查拓扑图 |
| 报表 | 运维报表 | 定期生成 | 检查报表系统 |

### 14.3 五化架构检查项

#### 14.3.1 流程化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 部署流程 | 标准化部署流程 | 有文档说明 | 检查部署文档 |
| 发布流程 | 发布流程规范 | 有发布检查清单 | 检查发布流程 |
| 回滚流程 | 回滚流程明确 | 有回滚脚本 | 测试回滚 |
| 应急流程 | 应急响应流程 | 有应急预案 | 检查应急文档 |
| 维护流程 | 日常维护流程 | 有维护手册 | 检查维护文档 |

#### 14.3.2 文档化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 架构文档 | 架构设计文档 | 完整架构图 | 检查架构文档 |
| API文档 | API接口文档 | Swagger/OpenAPI | 检查API文档 |
| 部署文档 | 部署操作文档 | 详细的部署步骤 | 检查部署文档 |
| 运维文档 | 运维手册 | 故障排查指南 | 检查运维文档 |
| 开发文档 | 开发指南 | 开发规范 | 检查开发文档 |

#### 14.3.3 工具化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 部署工具 | 自动化部署工具 | Docker Compose/K8s | 检查部署工具 |
| 监控工具 | 监控工具链 | Prometheus+Grafana | 检查监控工具 |
| 日志工具 | 日志收集工具 | ELK Stack | 检查日志工具 |
| 测试工具 | 测试工具链 | Jest/Vitest | 检查测试工具 |
| CI/CD工具 | CI/CD平台 | GitHub Actions | 检查CI/CD工具 |

#### 14.3.4 数字化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 指标数字化 | 关键指标量化 | 有明确的KPI | 检查指标定义 |
| 监控数字化 | 监控数据数字化 | 实时监控数据 | 检查监控系统 |
| 日志数字化 | 日志结构化 | JSON格式日志 | 检查日志格式 |
| 报表数字化 | 自动化报表 | 定期生成报表 | 检查报表系统 |
| 分析数字化 | 数据分析 | 数据驱动决策 | 检查分析工具 |

#### 14.3.5 生态化检查

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 技术生态 | 技术栈成熟 | 使用主流技术 | 检查技术栈 |
| 工具生态 | 工具链完整 | 覆盖全生命周期 | 检查工具链 |
| 社区生态 | 社区支持 | 有活跃社区 | 检查社区活跃度 |
| 服务生态 | 第三方服务 | 集成必要服务 | 检查服务集成 |
| 标准生态 | 遵循标准 | 遵循行业标准 | 检查标准符合性 |

## 十五、Kubernetes迁移指南

### 15.1 迁移准备

#### 15.1.1 评估清单

| 评估项 | 说明 | 评估结果 |
|--------|------|----------|
| 应用无状态化 | 应用是否支持无状态部署 | ☐ 是 ☐ 否 |
| 配置外部化 | 配置是否已外部化 | ☐ 是 ☐ 否 |
| 健康检查 | 是否配置健康检查 | ☐ 是 ☐ 否 |
| 日志标准 | 日志是否标准化 | ☐ 是 ☐ 否 |
| 监控指标 | 是否有监控指标 | ☐ 是 ☐ 否 |
| 资源需求 | CPU/内存需求是否明确 | ☐ 是 ☐ 否 |
| 存储需求 | 是否需要持久化存储 | ☐ 是 ☐ 否 |
| 网络需求 | 网络策略是否明确 | ☐ 是 ☐ 否 |

#### 15.1.2 环境准备

```bash
# 安装kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# 安装minikube（本地测试）
brew install minikube
minikube start

# 配置kubectl上下文
kubectl config use-context minikube
```

### 15.2 资源清单转换

#### 15.2.1 Deployment配置

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: yyc3-main
  labels:
    app: yyc3-main
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: yyc3-main
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: yyc3-main
        version: v1
    spec:
      containers:
      - name: yyc3-main
        image: yyc3-main:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 1229
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: yyc3-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: yyc3-config
              key: redis-url
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 2000m
            memory: 2Gi
        livenessProbe:
          httpGet:
            path: /api/health
            port: 1229
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 1229
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: data
          mountPath: /app/data
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: yyc3-data-pvc
      - name: logs
        emptyDir: {}
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
```

#### 15.2.2 Service配置

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: yyc3-main
  labels:
    app: yyc3-main
spec:
  type: ClusterIP
  ports:
  - port: 1229
    targetPort: 1229
    protocol: TCP
    name: http
  selector:
    app: yyc3-main
```

#### 15.2.3 Ingress配置

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: yyc3-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.yyc3.com
    secretName: yyc3-tls
  rules:
  - host: api.yyc3.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: yyc3-main
            port:
              number: 1229
```

#### 15.2.4 ConfigMap配置

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: yyc3-config
data:
  redis-url: "redis://redis:6379"
  elasticsearch-url: "http://elasticsearch:9200"
  log-level: "info"
```

#### 15.2.5 Secret配置

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: yyc3-secrets
type: Opaque
stringData:
  database-url: "postgresql://postgres:password@postgres:5432/yyc3_ai"
  jwt-secret: "your-jwt-secret-key"
  openai-api-key: "your-openai-api-key"
```

#### 15.2.6 PersistentVolumeClaim配置

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: yyc3-data-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard
```

#### 15.2.7 HorizontalPodAutoscaler配置

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: yyc3-main-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: yyc3-main
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 15.3 部署流程

#### 15.3.1 创建命名空间

```bash
# 创建命名空间
kubectl create namespace yyc3-production

# 设置默认命名空间
kubectl config set-context --current --namespace=yyc3-production
```

#### 15.3.2 部署配置

```bash
# 部署ConfigMap和Secret
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# 部署PVC
kubectl apply -f pvc.yaml

# 部署Deployment
kubectl apply -f deployment.yaml

# 部署Service
kubectl apply -f service.yaml

# 部署Ingress
kubectl apply -f ingress.yaml

# 部署HPA
kubectl apply -f hpa.yaml
```

#### 15.3.3 验证部署

```bash
# 查看Pod状态
kubectl get pods -l app=yyc3-main

# 查看Service
kubectl get svc yyc3-main

# 查看Ingress
kubectl get ingress yyc3-ingress

# 查看HPA
kubectl get hpa yyc3-main-hpa

# 查看日志
kubectl logs -f deployment/yyc3-main

# 进入Pod
kubectl exec -it deployment/yyc3-main -- sh
```

### 15.4 监控与日志

#### 15.4.1 Prometheus监控

```yaml
# prometheus-service-monitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: yyc3-main
  labels:
    app: yyc3-main
spec:
  selector:
    matchLabels:
      app: yyc3-main
  endpoints:
  - port: http
    interval: 30s
    path: /metrics
```

#### 15.4.2 日志收集

```yaml
# fluentd-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
      </parse>
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>
    
    <match **>
      @type elasticsearch
      host elasticsearch
      port 9200
      logstash_format true
      logstash_prefix yyc3-logs
    </match>
```

## 十六、CI/CD集成

### 16.1 GitHub Actions配置

#### 16.1.1 构建和推送镜像

```yaml
# .github/workflows/docker-build.yml
name: Docker Build and Push

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          yyc3/yyc3-main:latest
          yyc3/yyc3-main:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        target: production
    
    - name: Image vulnerability scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: yyc3/yyc3-main:latest
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
```

#### 16.1.2 部署到Kubernetes

```yaml
# .github/workflows/deploy-k8s.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [ main ]
    paths:
      - 'k8s/**'
      - '.github/workflows/deploy-k8s.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'
    
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
    
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/configmap.yaml
        kubectl apply -f k8s/secret.yaml
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
        kubectl apply -f k8s/ingress.yaml
        kubectl apply -f k8s/hpa.yaml
    
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/yyc3-main
        kubectl get pods -l app=yyc3-main
    
    - name: Notify deployment
      if: success()
      run: |
        echo "Deployment successful!"
```

### 16.2 GitLab CI配置

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: yyc3/yyc3-main
  DOCKER_TAG: $CI_COMMIT_SHORT_SHA

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG -t $DOCKER_IMAGE:latest .
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
    - docker push $DOCKER_IMAGE:latest

test:
  stage: test
  image: $DOCKER_IMAGE:$DOCKER_TAG
  script:
    - npm run lint
    - npm run test
    - npm run test:e2e

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT
    - kubectl set image deployment/yyc3-main yyc3-main=$DOCKER_IMAGE:$DOCKER_TAG
    - kubectl rollout status deployment/yyc3-main
  only:
    - main
```

## 十七、最佳实践总结

### 17.1 核心原则

1. **最小化镜像**: 使用Alpine基础镜像，多阶段构建
2. **资源限制**: 设置CPU和内存限制，防止资源耗尽
3. **健康检查**: 配置健康检查，确保服务可用性
4. **日志管理**: 配置日志轮转，集中收集日志
5. **安全加固**: 使用非root用户，只读文件系统
6. **数据持久化**: 使用命名卷，定期备份数据
7. **网络隔离**: 使用自定义网络，限制服务间通信
8. **监控告警**: 集成Prometheus和Grafana，配置告警规则
9. **环境管理**: 使用.env文件，区分不同环境
10. **故障恢复**: 配置自动重启，制定恢复流程

### 17.2 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 容器启动失败 | 端口冲突 | 检查端口占用，修改端口映射 |
| 容器频繁重启 | 健康检查失败 | 调整健康检查参数 |
| 内存不足 | 未设置内存限制 | 设置内存限制和reservation |
| 数据丢失 | 未使用数据卷 | 配置数据卷持久化 |
| 网络不通 | 网络配置错误 | 检查网络配置和DNS |
| 镜像构建慢 | 未使用BuildKit | 启用DOCKER_BUILDKIT=1 |
| 镜像体积大 | 未使用多阶段构建 | 使用多阶段构建优化 |
| 容器权限问题 | 使用root用户 | 使用非root用户运行 |

### 17.3 性能优化建议

1. **使用BuildKit**: 加快镜像构建速度
2. **层缓存优化**: 合理安排Dockerfile指令顺序
3. **多阶段构建**: 减小最终镜像体积
4. **资源限制**: 合理分配CPU和内存
5. **日志轮转**: 避免日志文件过大
6. **网络优化**: 使用overlay网络提高性能
7. **存储优化**: 使用本地卷提高I/O性能
8. **并发构建**: 并行构建多个镜像
9. **镜像缓存**: 使用镜像缓存加速拉取
10. **健康检查优化**: 合理设置检查间隔和超时

### 17.4 安全加固建议

1. **使用非root用户**: 避免以root用户运行容器
2. **只读文件系统**: 配置read_only: true
3. **限制能力**: 使用cap_drop和cap_add
4. **网络隔离**: 使用internal网络隔离敏感服务
5. **镜像扫描**: 定期使用Trivy扫描镜像
6. **密钥管理**: 使用Docker Secrets或K8s Secrets
7. **最小权限**: 遵循最小权限原则
8. **定期更新**: 定期更新基础镜像和依赖
9. **安全审计**: 定期进行安全审计
10. **漏洞修复**: 及时修复已知漏洞

## 十八、附录

### 18.1 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 查看状态
docker-compose ps

# 构建镜像
docker-compose build

# 拉取镜像
docker-compose pull

# 扩展服务
docker-compose up -d --scale yyc3-main=3

# 查看资源使用
docker stats

# 进入容器
docker-compose exec yyc3-main sh

# 查看容器详情
docker inspect yyc3-main

# 清理未使用的资源
docker system prune -a

# 查看镜像
docker images

# 删除镜像
docker rmi yyc3-main:latest

# 导出镜像
docker save yyc3-main:latest | gzip > yyc3-main.tar.gz

# 导入镜像
docker load < yyc3-main.tar.gz
```

### 18.2 配置文件示例

#### 18.2.1 docker-compose.yml

```yaml
version: '3.8'

services:
  yyc3-main:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: yyc3-main
    restart: unless-stopped
    ports:
      - "1229:1229"
    environment:
      - NODE_ENV=production
    depends_on:
      - redis
      - postgres
    volumes:
      - ./data:/app/data
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1229/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    container_name: yyc3-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: yyc3-postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=yyc3_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - yyc3-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  postgres-data:
  redis-data:

networks:
  yyc3-network:
    driver: bridge
```

#### 18.2.2 .env.example

```bash
# 应用配置
NODE_ENV=production
PORT=1229

# 数据库配置
DATABASE_URL=postgresql://postgres:password@postgres:5432/yyc3_ai

# Redis配置
REDIS_URL=redis://redis:6379

# Elasticsearch配置
ELASTICSEARCH_URL=http://elasticsearch:9200

# JWT密钥
JWT_SECRET=your-jwt-secret-key

# API密钥
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json

# 监控配置
ENABLE_METRICS=true
METRICS_PORT=9090
```

#### 18.2.3 Dockerfile

```dockerfile
# 阶段1: 依赖安装
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 阶段2: 构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 阶段3: 生产运行
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 1229
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:1229/api/health || exit 1
CMD ["node", "server.js"]
```

### 18.3 参考资源

- [Docker官方文档](https://docs.docker.com/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- [Docker最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Docker安全指南](https://docs.docker.com/engine/security/)
- [Kubernetes文档](https://kubernetes.io/docs/)
- [Prometheus文档](https://prometheus.io/docs/)
- [Grafana文档](https://grafana.com/docs/)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Trivy文档](https://aquasecurity.github.io/trivy/)
- [Docker Bench Security](https://github.com/docker/docker-bench-security)

---

**文档版本历史**

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| V1.0 | 2025-12-25 | 初始版本 | YYC³团队 |

**审核记录**

| 审核人 | 审核日期 | 审核结论 | 备注 |
|--------|----------|----------|------|
| - | - | - | - |

---

**YYC³ AI小语智能成长守护系统 - 容器化部署最佳实践**

遵循「五高五标五化」要求，确保容器化部署的高可用性、高性能、高安全性、高可扩展性和高可维护性。
