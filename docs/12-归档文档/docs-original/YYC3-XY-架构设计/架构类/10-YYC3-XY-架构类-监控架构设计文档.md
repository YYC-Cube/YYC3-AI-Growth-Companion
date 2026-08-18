---
@file: YYC3-XY-架构类-监控架构设计文档.md
@description: YYC³-XY智能成长守护系统的监控架构设计文档
@author: YYC³ Team
@version: v1.0.0
@created: 2025-12-25
@updated: 2025-12-28
@status: published
@tags: 监控架构,架构设计,五高五标五化,Prometheus,Grafana,告警
---

# YYC³-XY 架构类 - 监控架构设计文档

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***

## 文档变更记录

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|--------|----------|----------|--------|
| v1.0.0 | 2025-12-25 | 初始版本创建 | AI Assistant |
| v1.0.1 | 2025-12-28 | 元数据标准化 | YYC³ Team |

---

## 目录

- [一、监控架构概述](#一监控架构概述)
- [二、监控架构设计原则](#二监控架构设计原则)
- [三、指标收集架构](#三指标收集架构)
- [四、告警机制设计](#四告警机制设计)
- [五、日志分析架构](#五日志分析架构)
- [六、监控数据存储与查询](#六监控数据存储与查询)
- [七、监控可视化与仪表盘](#七监控可视化与仪表盘)
- [八、监控高可用设计](#八监控高可用设计)
- [九、监控安全设计](#九监控安全设计)
- [十、监控运维最佳实践](#十监控运维最佳实践)

---

## 一、监控架构概述

### 1.1 架构定位

YYC³ AI小语智能成长守护系统的监控架构基于"五高五标五化"要求构建，实现全链路、多维度的系统可观测性，确保系统高可用、高性能、高安全运行。

### 1.2 核心目标

- **高可用性**：7×24小时不间断监控，故障快速发现与告警
- **高可观测性**：覆盖基础设施、应用服务、业务指标的全链路监控
- **高扩展性**：支持动态添加监控目标和自定义指标
- **标准化**：统一监控指标命名、数据格式、告警规则
- **自动化**：监控配置自动化、告警处理自动化、报表生成自动化

### 1.3 架构层次

```
┌─────────────────────────────────────────────────────────────┐
│                     监控可视化层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Grafana    │  │   Dashboard  │  │   报表系统   │        │
│  │   仪表盘     │  │   自定义     │  │   定时生成   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     告警通知层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Alertmanager │  │  邮件通知    │  │  钉钉/企业微信│        │
│  │   告警路由   │  │  短信通知    │  │  即时通讯    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     数据处理层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Prometheus  │  │   Logstash   │  │  数据聚合    │        │
│  │  时序数据库  │  │   日志处理   │  │  指标计算    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     数据采集层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Exporters  │  │   日志采集    │  │  应用埋点    │        │
│  │  指标导出器  │  │   Filebeat   │  │  自定义指标  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     被监控对象层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  基础设施    │  │   中间件     │  │   应用服务   │        │
│  │  服务器/容器 │  │  DB/Redis/ES │  │  微服务/API  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 核心组件

| 组件名称 | 功能描述 | 端口 | 版本 |
|---------|---------|------|------|
| Prometheus | 时序数据库，指标采集与存储 | 9090 | latest |
| Grafana | 可视化仪表盘，数据展示 | 3001 | latest |
| Alertmanager | 告警管理，告警路由与通知 | 9093 | latest |
| Elasticsearch | 日志存储与全文检索 | 9200 | 8.11.0 |
| Logstash | 日志收集、过滤、转换 | 5044 | 8.11.0 |
| Node Exporter | 系统级指标采集 | 9100 | latest |
| cAdvisor | 容器指标采集 | 8080 | latest |
| Redis Exporter | Redis指标采集 | 9121 | latest |
| PostgreSQL Exporter | PostgreSQL指标采集 | 9187 | latest |

---

## 二、监控架构设计原则

### 2.1 五高原则

#### 高可用性

- 监控系统本身采用高可用部署
- 关键监控指标冗余采集
- 监控数据多副本存储
- 告警通道多路备份

#### 高性能

- 指标采集采用拉取模式，降低目标负载
- 时序数据高效压缩存储
- 查询结果缓存优化
- 告警规则评估优化

#### 高安全性

- 监控数据传输加密
- 监控接口访问认证
- 敏感信息脱敏处理
- 监控权限分级管理

#### 高扩展性

- 支持动态服务发现
- 支持自定义指标扩展
- 支持多租户监控
- 支持水平扩展

#### 高可维护性

- 监控配置版本化管理
- 监控指标标准化命名
- 告警规则模板化
- 监控文档完整规范

### 2.2 五标原则

#### 标准化

- 统一监控指标命名规范
- 统一告警级别定义
- 统一日志格式标准
- 统一监控数据模型

#### 规范化

- 监控配置文件规范
- 告警规则编写规范
- 仪表盘设计规范
- 监控运维流程规范

#### 自动化

- 监控目标自动发现
- 监控配置自动部署
- 告警自动处理
- 报表自动生成

#### 智能化

- 智能异常检测
- 智能根因分析
- 智能告警聚合
- 智能容量预测

#### 可视化

- 实时监控大屏
- 多维度数据展示
- 趋势分析与预测
- 自定义仪表盘

### 2.3 五化原则

#### 流程化

- 监控需求评估流程
- 监控指标设计流程
- 告警规则配置流程
- 故障处理流程

#### 文档化

- 监控架构文档
- 指标定义文档
- 告警规则文档
- 运维手册文档

#### 工具化

- 监控配置管理工具
- 告警测试工具
- 数据查询工具
- 报表生成工具

#### 数字化

- 监控数据数字化
- 告警信息数字化
- 运维记录数字化
- 决策依据数字化

#### 生态化

- 监控工具生态集成
- 第三方服务集成
- 开源社区协作
- 持续优化迭代

---

## 三、指标收集架构

### 3.1 指标分类

#### 3.1.1 基础设施指标

| 指标类别 | 监控对象 | 关键指标 | 采集工具 |
|---------|---------|---------|---------|
| 服务器 | CPU | 使用率、负载、上下文切换 | Node Exporter |
| 服务器 | 内存 | 使用率、缓存、交换区 | Node Exporter |
| 服务器 | 磁盘 | 使用率、IO读写、IOPS | Node Exporter |
| 服务器 | 网络 | 流量、连接数、丢包率 | Node Exporter |
| 容器 | 资源 | CPU、内存、网络、磁盘 | cAdvisor |
| 容器 | 状态 | 运行状态、重启次数 | Docker API |

#### 3.1.2 中间件指标

| 指标类别 | 监控对象 | 关键指标 | 采集工具 |
|---------|---------|---------|---------|
| PostgreSQL | 连接 | 活跃连接数、空闲连接数 | PostgreSQL Exporter |
| PostgreSQL | 性能 | 查询时间、慢查询数、锁等待 | PostgreSQL Exporter |
| PostgreSQL | 存储 | 数据库大小、表空间使用 | PostgreSQL Exporter |
| Redis | 性能 | 命中率、响应时间、命令执行数 | Redis Exporter |
| Redis | 内存 | 使用率、过期键、驱逐策略 | Redis Exporter |
| Redis | 连接 | 客户端连接数、拒绝连接数 | Redis Exporter |
| Elasticsearch | 集群 | 节点状态、分片状态 | Elasticsearch Exporter |
| Elasticsearch | 性能 | 查询延迟、索引速度 | Elasticsearch Exporter |
| Nginx | 请求 | QPS、响应时间、状态码 | Nginx Exporter |

#### 3.1.3 应用指标

| 指标类别 | 监控对象 | 关键指标 | 采集方式 |
|---------|---------|---------|---------|
| API服务 | 性能 | 请求量、响应时间、错误率 | 应用埋点 |
| API服务 | 业务 | 用户数、会话数、转化率 | 应用埋点 |
| AI服务 | 性能 | 模型推理时间、Token消耗 | 应用埋点 |
| AI服务 | 资源 | GPU使用率、显存占用 | 应用埋点 |
| 知识库 | 存储 | 文档数量、向量索引大小 | 应用埋点 |
| 用户服务 | 业务 | 注册数、活跃用户、留存率 | 应用埋点 |

#### 3.1.4 业务指标

| 指标类别 | 监控对象 | 关键指标 | 采集方式 |
|---------|---------|---------|---------|
| 用户增长 | 注册 | 日新增用户、周新增用户 | 应用埋点 |
| 用户活跃 | 活跃 | DAU、WAU、MAU | 应用埋点 |
| 功能使用 | 使用 | 功能调用次数、使用时长 | 应用埋点 |
| 转化漏斗 | 转化 | 各环节转化率、流失率 | 应用埋点 |
| 收入指标 | 收入 | 日收入、ARPU、付费率 | 应用埋点 |

### 3.2 Prometheus配置

#### 3.2.1 全局配置

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'yyc3-xy-ai'
    environment: 'production'
```

**配置说明**：

- `scrape_interval`：指标采集间隔，15秒平衡实时性与性能
- `evaluation_interval`：告警规则评估间隔
- `external_labels`：集群和环境标签，用于多集群监控

#### 3.2.2 采集任务配置

##### 主应用监控

```yaml
- job_name: 'yyc3-main-app'
  static_configs:
    - targets: ['app:1229']
  metrics_path: '/api/metrics'
  scrape_interval: 15s
  scrape_timeout: 10s
```

**关键指标**：

- `http_requests_total`：HTTP请求总数
- `http_request_duration_seconds`：请求响应时间
- `http_requests_in_flight`：当前并发请求数
- `api_errors_total`：API错误总数

##### Node Exporter监控

```yaml
- job_name: 'node-exporter'
  static_configs:
    - targets: ['node-exporter:9100']
  scrape_interval: 15s
```

**关键指标**：

- `node_cpu_seconds_total`：CPU使用时间
- `node_memory_MemAvailable_bytes`：可用内存
- `node_filesystem_avail_bytes`：磁盘可用空间
- `node_network_receive_bytes_total`：网络接收字节数

##### PostgreSQL监控

```yaml
- job_name: 'postgres-exporter'
  static_configs:
    - targets: ['postgres-exporter:9187']
  scrape_interval: 15s
```

**关键指标**：

- `pg_stat_database_numbackends`：活跃连接数
- `pg_stat_database_blks_hit`：缓存命中率
- `pg_stat_statements_mean_exec_time`：平均查询时间

##### Redis监控

```yaml
- job_name: 'redis-exporter'
  static_configs:
    - targets: ['redis-exporter:9121']
  scrape_interval: 15s
```

**关键指标**：

- `redis_up`：Redis实例状态
- `redis_memory_used_bytes`：内存使用量
- `redis_keyspace_hits_total`：缓存命中数
- `redis_connected_clients`：客户端连接数

##### 容器监控

```yaml
- job_name: 'cadvisor'
  static_configs:
    - targets: ['cadvisor:8080']
  scrape_interval: 15s
```

**关键指标**：

- `container_cpu_usage_seconds_total`：容器CPU使用
- `container_memory_usage_bytes`：容器内存使用
- `container_network_receive_bytes_total`：容器网络接收

### 3.3 自定义指标开发

#### 3.3.1 应用指标埋点

```typescript
import { Counter, Histogram, Gauge, Registry } from 'prom-client';

const register = new Registry();

// HTTP请求计数器
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// HTTP请求响应时间直方图
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register]
});

// 当前并发请求数
const httpRequestsInFlight = new Gauge({
  name: 'http_requests_in_flight',
  help: 'Current number of HTTP requests in flight',
  registers: [register]
});

// API错误计数器
const apiErrorsTotal = new Counter({
  name: 'api_errors_total',
  help: 'Total API errors',
  labelNames: ['error_type', 'service'],
  registers: [register]
});

// AI服务指标
const aiServiceMetrics = {
  modelInferenceTime: new Histogram({
    name: 'ai_model_inference_duration_seconds',
    help: 'AI model inference duration',
    labelNames: ['model_name', 'provider'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    registers: [register]
  }),
  tokenUsage: new Counter({
    name: 'ai_token_usage_total',
    help: 'Total AI token usage',
    labelNames: ['model_name', 'type'],
    registers: [register]
  })
};

export {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInFlight,
  apiErrorsTotal,
  aiServiceMetrics
};
```

#### 3.3.2 中间件集成

```typescript
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestsTotal, httpRequestsInFlight } from './metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  httpRequestsInFlight.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route)
      .observe(duration);

    httpRequestsTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();

    httpRequestsInFlight.dec();
  });

  next();
}
```

---

## 四、告警机制设计

### 4.1 告警级别定义

| 告警级别 | 严重程度 | 响应时间 | 通知渠道 | 处理要求 |
|---------|---------|---------|---------|---------|
| P0 - 紧急 | 系统不可用 | 5分钟内 | 电话+短信+IM | 立即处理 |
| P1 - 严重 | 核心功能异常 | 15分钟内 | 电话+IM | 优先处理 |
| P2 - 警告 | 性能下降/资源紧张 | 30分钟内 | IM+邮件 | 尽快处理 |
| P3 - 提示 | 潜在风险 | 2小时内 | 邮件 | 计划处理 |
| P4 - 信息 | 一般通知 | 24小时内 | 邮件 | 关注即可 |

### 4.2 告警规则配置

#### 4.2.1 基础设施告警

```yaml
groups:
  - name: infrastructure_alerts
    interval: 30s
    rules:
      # CPU使用率过高
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 90
        for: 5m
        labels:
          severity: P2
          category: infrastructure
        annotations:
          summary: "实例 {{ $labels.instance }} CPU使用率过高"
          description: "CPU使用率持续5分钟超过90%，当前值：{{ $value }}%"

      # 内存使用率过高
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: P2
          category: infrastructure
        annotations:
          summary: "实例 {{ $labels.instance }} 内存使用率过高"
          description: "内存使用率持续5分钟超过90%，当前值：{{ $value }}%"

      # 磁盘空间不足
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes) * 100 < 10
        for: 10m
        labels:
          severity: P1
          category: infrastructure
        annotations:
          summary: "实例 {{ $labels.instance }} 磁盘空间不足"
          description: "磁盘 {{ $labels.mountpoint }} 可用空间低于10%，当前值：{{ $value }}%"

      # 磁盘IO过高
      - alert: HighDiskIO
        expr: rate(node_disk_io_time_seconds_total[5m]) > 0.8
        for: 10m
        labels:
          severity: P2
          category: infrastructure
        annotations:
          summary: "实例 {{ $labels.instance }} 磁盘IO过高"
          description: "磁盘 {{ $labels.device }} IO使用率持续10分钟超过80%"

      # 网络连接数过高
      - alert: HighNetworkConnections
        expr: node_netstat_Tcp_CurrEstab > 10000
        for: 5m
        labels:
          severity: P2
          category: infrastructure
        annotations:
          summary: "实例 {{ $labels.instance }} 网络连接数过高"
          description: "TCP连接数持续5分钟超过10000，当前值：{{ $value }}"
```

#### 4.2.2 应用服务告警

```yaml
  - name: application_alerts
    interval: 30s
    rules:
      # 服务不可用
      - alert: ServiceDown
        expr: up == 0
        for: 2m
        labels:
          severity: P0
          category: application
        annotations:
          summary: "服务 {{ $labels.job }} 不可用"
          description: "服务 {{ $labels.instance }} 已停止响应超过2分钟"

      # API错误率过高
      - alert: HighAPIErrorRate
        expr: (sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100 > 5
        for: 5m
        labels:
          severity: P1
          category: application
        annotations:
          summary: "API错误率过高"
          description: "5xx错误率持续5分钟超过5%，当前值：{{ $value }}%"

      # API响应时间过长
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)) > 2
        for: 5m
        labels:
          severity: P2
          category: application
        annotations:
          summary: "API响应时间过长"
          description: "P95响应时间持续5分钟超过2秒，路由：{{ $labels.route }}"

      # 并发请求数过高
      - alert: HighConcurrentRequests
        expr: http_requests_in_flight > 1000
        for: 5m
        labels:
          severity: P2
          category: application
        annotations:
          summary: "并发请求数过高"
          description: "当前并发请求数持续5分钟超过1000，当前值：{{ $value }}"
```

#### 4.2.3 数据库告警

```yaml
  - name: database_alerts
    interval: 30s
    rules:
      # PostgreSQL连接数过高
      - alert: HighPostgreSQLConnections
        expr: pg_stat_database_numbackends / pg_settings_max_connections * 100 > 80
        for: 5m
        labels:
          severity: P2
          category: database
        annotations:
          summary: "PostgreSQL连接数过高"
          description: "连接数使用率持续5分钟超过80%，当前值：{{ $value }}%"

      # PostgreSQL慢查询过多
      - alert: HighPostgreSQLSlowQueries
        expr: rate(pg_stat_statements_calls_total{mean_exec_time > 1000}[5m]) > 10
        for: 10m
        labels:
          severity: P2
          category: database
        annotations:
          summary: "PostgreSQL慢查询过多"
          description: "慢查询（>1s）速率持续10分钟超过10次/秒"

      # Redis内存使用率过高
      - alert: HighRedisMemoryUsage
        expr: (redis_memory_used_bytes / redis_memory_max_bytes) * 100 > 90
        for: 5m
        labels:
          severity: P1
          category: database
        annotations:
          summary: "Redis内存使用率过高"
          description: "Redis内存使用率持续5分钟超过90%，当前值：{{ $value }}%"

      # Redis缓存命中率过低
      - alert: LowRedisCacheHitRate
        expr: (redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)) * 100 < 80
        for: 15m
        labels:
          severity: P3
          category: database
        annotations:
          summary: "Redis缓存命中率过低"
          description: "缓存命中率持续15分钟低于80%，当前值：{{ $value }}%"
```

#### 4.2.4 业务指标告警

```yaml
  - name: business_alerts
    interval: 60s
    rules:
      # 用户注册量异常下降
      - alert: LowUserRegistration
        expr: rate(user_registrations_total[1h]) < 10
        for: 2h
        labels:
          severity: P3
          category: business
        annotations:
          summary: "用户注册量异常下降"
          description: "用户注册速率持续2小时低于10/小时"

      # API调用量异常下降
      - alert: LowAPIUsage
        expr: rate(http_requests_total[1h]) < 100
        for: 2h
        labels:
          severity: P3
          category: business
        annotations:
          summary: "API调用量异常下降"
          description: "API调用速率持续2小时低于100/小时"

      # AI服务Token消耗异常
      - alert: HighAITokenUsage
        expr: rate(ai_token_usage_total[1h]) > 100000
        for: 1h
        labels:
          severity: P2
          category: business
        annotations:
          summary: "AI服务Token消耗异常"
          description: "Token消耗速率持续1小时超过100000/小时，可能存在异常使用"
```

### 4.3 Alertmanager配置

#### 4.3.1 全局配置

```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alerts@yyc3-ai.com'
  smtp_auth_username: 'alerts@yyc3-ai.com'
  smtp_auth_password: '${SMTP_PASSWORD}'
```

#### 4.3.2 告警路由

```yaml
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'

  routes:
    # P0紧急告警路由
    - match:
        severity: P0
      receiver: 'critical-alerts'
      group_wait: 0s
      repeat_interval: 5m

    # P1严重告警路由
    - match:
        severity: P1
      receiver: 'severe-alerts'
      group_wait: 30s
      repeat_interval: 30m

    # P2警告告警路由
    - match:
        severity: P2
      receiver: 'warning-alerts'
      group_wait: 1m
      repeat_interval: 2h

    # 数据库告警路由
    - match:
        category: database
      receiver: 'db-team'

    # 业务告警路由
    - match:
        category: business
      receiver: 'business-team'
```

#### 4.3.3 接收器配置

```yaml
receivers:
  # 默认接收器
  - name: 'default'
    email_configs:
      - to: 'team@yyc3-ai.com'
        headers:
          Subject: '[YYC3-ALERT] {{ .GroupLabels.alertname }}'

  # 紧急告警接收器
  - name: 'critical-alerts'
    email_configs:
      - to: 'oncall@yyc3-ai.com'
        headers:
          Subject: '[P0-URGENT] {{ .GroupLabels.alertname }}'
    wechat_configs:
      - corp_id: '${WECHAT_CORP_ID}'
        api_secret: '${WECHAT_API_SECRET}'
        to_party: '1'
        agent_id: '${WECHAT_AGENT_ID}'
        message: '{{ template "wechat.default.message" . }}'

  # 严重告警接收器
  - name: 'severe-alerts'
    email_configs:
      - to: 'team@yyc3-ai.com'
    dingtalk_configs:
      - webhook_url: '${DINGTALK_WEBHOOK}'
        message: '{{ template "dingtalk.default.message" . }}'

  # 数据库团队接收器
  - name: 'db-team'
    email_configs:
      - to: 'db-team@yyc3-ai.com'

  # 业务团队接收器
  - name: 'business-team'
    email_configs:
      - to: 'business-team@yyc3-ai.com'
```

#### 4.3.4 抑制规则

```yaml
inhibit_rules:
  # 如果服务宕机，抑制该服务的所有其他告警
  - source_match:
      alertname: 'ServiceDown'
    target_match_re:
      alertname: '(HighAPIErrorRate|HighAPILatency|HighConcurrentRequests)'
    equal: ['instance']

  # 如果主机宕机，抑制该主机的所有其他告警
  - source_match:
      alertname: 'InstanceDown'
    target_match_re:
      alertname: '.*'
    equal: ['instance']

  # 如果磁盘空间不足，抑制磁盘IO告警
  - source_match:
      alertname: 'DiskSpaceLow'
    target_match:
      alertname: 'HighDiskIO'
    equal: ['instance', 'device']
```

### 4.4 告警通知模板

#### 4.4.1 邮件模板

```yaml
templates:
  - '/etc/alertmanager/templates/*.tmpl'
```

```go
{{ define "email.default.subject" }}[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .GroupLabels.alertname }}{{ end }}

{{ define "email.default.html" }}
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .alert { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
        .firing { border-left-color: #f44336; background: #ffebee; }
        .resolved { border-left-color: #4caf50; background: #e8f5e9; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <h2>{{ .GroupLabels.alertname }}</h2>
    <p><strong>状态：</strong>{{ .Status | toUpper }}</p>
    <p><strong>时间：</strong>{{ .Alerts.Firing | len }}条触发，{{ .Alerts.Resolved | len }}条恢复</p>

    {{ range .Alerts }}
    <div class="alert {{ .Status }}">
        <p><strong>实例：</strong>{{ .Labels.instance }}</p>
        <p><strong>描述：</strong>{{ .Annotations.description }}</p>
        <p><strong>时间：</strong>{{ .StartsAt.Format "2006-01-02 15:04:05" }}</p>
        {{ if .EndsAt }}
        <p><strong>恢复时间：</strong>{{ .EndsAt.Format "2006-01-02 15:04:05" }}</p>
        {{ end }}
    </div>
    {{ end }}
</body>
</html>
{{ end }}
```

#### 4.4.2 钉钉模板

```go
{{ define "dingtalk.default.message" }}
{
  "msgtype": "markdown",
  "markdown": {
    "title": "{{ .GroupLabels.alertname }}",
    "text": "## {{ .GroupLabels.alertname }}\n\n" +
            "**状态：** {{ .Status | toUpper }}\n\n" +
            "**告警级别：** {{ .CommonLabels.severity }}\n\n" +
            "**触发时间：** {{ .Alerts.Firing | len }}条\n\n" +
            "**恢复时间：** {{ .Alerts.Resolved | len }}条\n\n" +
            "---\n\n" +
            "{{ range .Alerts }}" +
            "> **实例：** {{ .Labels.instance }}\n\n" +
            "> **描述：** {{ .Annotations.description }}\n\n" +
            "> **时间：** {{ .StartsAt.Format "2006-01-02 15:04:05" }}\n\n" +
            "{{ end }}"
  }
}
{{ end }}
```

---

## 五、日志分析架构

### 5.1 日志分类

#### 5.1.1 应用日志

| 日志类型 | 日志级别 | 用途 | 存储位置 |
|---------|---------|------|---------|
| 访问日志 | INFO | 记录所有HTTP请求 | Elasticsearch |
| 错误日志 | ERROR | 记录应用错误和异常 | Elasticsearch |
| 性能日志 | DEBUG | 记录性能指标和慢查询 | Elasticsearch |
| 业务日志 | INFO | 记录关键业务操作 | Elasticsearch |
| 审计日志 | WARN | 记录敏感操作和权限变更 | Elasticsearch |

#### 5.1.2 系统日志

| 日志类型 | 日志级别 | 用途 | 存储位置 |
|---------|---------|------|---------|
| 系统日志 | INFO | 操作系统日志 | Elasticsearch |
| Docker日志 | INFO | 容器日志 | Elasticsearch |
| Nginx日志 | INFO | Web服务器日志 | Elasticsearch |
| 数据库日志 | WARN | 数据库慢查询和错误 | Elasticsearch |

### 5.2 ELK Stack配置

#### 5.2.1 Elasticsearch配置

```yaml
# docker-compose.yml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
  container_name: yyc3-elasticsearch
  restart: unless-stopped
  environment:
    - discovery.type=single-node
    - ES_JAVA_OPTS=-Xms512m -Xmx512m
    - xpack.security.enabled=false
    - cluster.name=yyc3-logs
    - node.name=yyc3-node-1
    - bootstrap.memory_lock=true
  ulimits:
    memlock:
      soft: -1
      hard: -1
  ports:
    - "9200:9200"
    - "9300:9300"
  volumes:
    - elasticsearch-data:/usr/share/elasticsearch/data
  networks:
    - yyc3-network
  healthcheck:
    test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**索引策略**：

```json
PUT _template/yyc3-logs-template
{
  "index_patterns": ["yyc3-*"],
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "index.lifecycle.name": "yyc3-logs-policy",
    "index.lifecycle.rollover_alias": "yyc3-logs"
  },
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "level": { "type": "keyword" },
      "service": { "type": "keyword" },
      "host": { "type": "keyword" },
      "message": { "type": "text" },
      "logger": { "type": "keyword" },
      "thread": { "type": "keyword" },
      "request_id": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "duration_ms": { "type": "long" },
      "status_code": { "type": "integer" }
    }
  }
}
```

#### 5.2.2 Logstash配置

```yaml
# docker-compose.yml
logstash:
  image: docker.elastic.co/logstash/logstash:8.11.0
  container_name: yyc3-logstash
  restart: unless-stopped
  environment:
    - LS_JAVA_OPTS=-Xms256m -Xmx256m
  ports:
    - "5044:5044"
    - "9600:9600"
  volumes:
    - ./monitoring/logstash/pipeline:/usr/share/logstash/pipeline:ro
    - ./logs:/app/logs:ro
  networks:
    - yyc3-network
  depends_on:
    - elasticsearch
```

**Pipeline配置**：

```conf
# logstash/pipeline/logstash.conf
input {
  # 从文件读取日志
  file {
    path => "/app/logs/**/*.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
    codec => multiline {
      pattern => "^%{TIMESTAMP_ISO8601}"
      negate => true
      what => "previous"
    }
  }

  # 从Beats接收日志
  beats {
    port => 5044
  }
}

filter {
  # 解析JSON格式日志
  if [message] =~ /^\{.*\}$/ {
    json {
      source => "message"
    }
  }

  # 解析应用日志格式
  grok {
    match => {
      "message" => "%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\] \[%{DATA:logger}\] - %{GREEDYDATA:msg}"
    }
  }

  # 添加时间戳
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }

  # 添加主机信息
  mutate {
    add_field => {
      "host" => "${HOSTNAME}"
      "environment" => "${ENVIRONMENT}"
    }
  }

  # 移除不需要的字段
  mutate {
    remove_field => ["message", "timestamp"]
  }
}

output {
  # 输出到Elasticsearch
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "yyc3-%{[service]}-%{+YYYY.MM.dd}"
    template_name => "yyc3-logs-template"
  }

  # 输出到标准输出（调试用）
  stdout {
    codec => rubydebug
  }
}
```

#### 5.2.3 Filebeat配置

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /app/logs/**/*.log
    fields:
      service: yyc3-main
      environment: production
    fields_under_root: true
    multiline:
      pattern: '^\d{4}-\d{2}-\d{2}'
      negate: true
      match: after

output.logstash:
  hosts: ["logstash:5044"]

processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
```

### 5.3 日志格式规范

#### 5.3.1 应用日志格式

```typescript
// 日志格式定义
interface LogEntry {
  timestamp: string;      // ISO 8601格式时间戳
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  service: string;        // 服务名称
  host: string;          // 主机名
  request_id?: string;    // 请求ID，用于链路追踪
  user_id?: string;      // 用户ID
  logger: string;        // 日志记录器名称
  message: string;       // 日志消息
  context?: Record<string, any>; // 上下文信息
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  duration_ms?: number;  // 操作耗时（毫秒）
}

// 示例日志
{
  "timestamp": "2025-12-25T10:30:45.123Z",
  "level": "INFO",
  "service": "yyc3-main",
  "host": "yyc3-server-01",
  "request_id": "req_1234567890",
  "user_id": "user_001",
  "logger": "APIHandler",
  "message": "API request completed",
  "context": {
    "method": "POST",
    "path": "/api/chat",
    "status_code": 200
  },
  "duration_ms": 1250
}
```

#### 5.3.2 访问日志格式

```typescript
interface AccessLogEntry {
  timestamp: string;
  level: 'INFO';
  service: string;
  host: string;
  request_id: string;
  message: string;
  context: {
    method: string;
    path: string;
    query_string?: string;
    status_code: number;
    user_agent?: string;
    client_ip: string;
    duration_ms: number;
    request_size?: number;
    response_size?: number;
  };
}

// 示例访问日志
{
  "timestamp": "2025-12-25T10:30:45.123Z",
  "level": "INFO",
  "service": "yyc3-main",
  "host": "yyc3-server-01",
  "request_id": "req_1234567890",
  "message": "HTTP request",
  "context": {
    "method": "POST",
    "path": "/api/chat",
    "query_string": "model=gpt-4",
    "status_code": 200,
    "user_agent": "Mozilla/5.0...",
    "client_ip": "192.168.1.100",
    "duration_ms": 1250,
    "request_size": 1024,
    "response_size": 2048
  }
}
```

### 5.4 日志查询与分析

#### 5.4.1 常用查询语句

```json
// 查询错误日志
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}

// 查询特定用户的操作日志
{
  "query": {
    "bool": {
      "must": [
        { "term": { "user_id": "user_001" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ]
    }
  }
}

// 查询慢请求（响应时间>2秒）
{
  "query": {
    "bool": {
      "must": [
        { "range": { "duration_ms": { "gt": 2000 } } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}

// 统计错误率
{
  "size": 0,
  "aggs": {
    "error_rate": {
      "terms": {
        "field": "level"
      }
    }
  }
}
```

#### 5.4.2 日志分析仪表盘

Grafana仪表盘配置示例：

```json
{
  "dashboard": {
    "title": "YYC3 日志分析",
    "panels": [
      {
        "title": "日志级别分布",
        "targets": [
          {
            "expr": "sum by (level) (count_over_time(logs[1h]))"
          }
        ]
      },
      {
        "title": "错误日志趋势",
        "targets": [
          {
            "expr": "sum by (service) (rate(logs{level=\"ERROR\"}[5m]))"
          }
        ]
      },
      {
        "title": "慢请求Top10",
        "targets": [
          {
            "expr": "topk(10, logs{duration_ms>1000})"
          }
        ]
      }
    ]
  }
}
```

---

## 六、监控数据存储与查询

### 6.1 数据存储策略

#### 6.1.1 Prometheus数据保留

| 数据类型 | 保留时间 | 压缩策略 | 存储位置 |
|---------|---------|---------|---------|
| 原始数据 | 15天 | 无压缩 | 本地存储 |
| 5分钟聚合 | 30天 | 压缩存储 | 本地存储 |
| 1小时聚合 | 90天 | 压缩存储 | 本地存储 |
| 1天聚合 | 1年 | 压缩存储 | 本地存储 |

```yaml
# Prometheus配置
--storage.tsdb.retention.time=200h
--storage.tsdb.retention.size=50GB
```

#### 6.1.2 Elasticsearch数据保留

| 索引模式 | 保留时间 | 滚动策略 |
|---------|---------|---------|
| yyc3-* | 30天 | 每天滚动 |
| yyc3-audit-* | 1年 | 每月滚动 |
| yyc3-error-* | 90天 | 每周滚动 |

```json
PUT _ilm/policy/yyc3-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "1d"
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

### 6.2 查询优化

#### 6.2.1 Prometheus查询优化

```promql
# 使用rate()计算速率
rate(http_requests_total[5m])

# 使用irate()计算瞬时速率（更精确）
irate(http_requests_total[5m])

# 使用increase()计算增量
increase(http_requests_total[1h])

# 使用histogram_quantile()计算分位数
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))

# 使用aggregation减少数据量
sum by (service) (rate(http_requests_total[5m]))
avg by (instance) (cpu_usage)

# 使用recording rule预计算常用查询
groups:
  - name: recording_rules
    interval: 30s
    rules:
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))
```

#### 6.2.2 Elasticsearch查询优化

```json
// 使用filter代替query（不计算评分）
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}

// 使用date_histogram进行时间聚合
{
  "size": 0,
  "aggs": {
    "logs_over_time": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "1h"
      }
    }
  }
}

// 使用scroll处理大量数据
GET /yyc3-*/_search?scroll=1m
{
  "size": 1000,
  "query": {
    "match_all": {}
  }
}
```

---

## 七、监控可视化与仪表盘

### 7.1 Grafana仪表盘设计

#### 7.1.1 系统概览仪表盘

**面板列表**：

1. **系统健康状态**
   - 服务可用性
   - 错误率
   - 响应时间

2. **资源使用率**
   - CPU使用率趋势
   - 内存使用率趋势
   - 磁盘使用率
   - 网络流量

3. **应用性能**
   - QPS趋势
   - P50/P95/P99响应时间
   - 并发连接数

4. **业务指标**
   - 活跃用户数
   - API调用量
   - AI Token消耗

#### 7.1.2 数据库监控仪表盘

**面板列表**：

1. **连接状态**
   - 活跃连接数
   - 空闲连接数
   - 连接池使用率

2. **查询性能**
   - 慢查询数量
   - 平均查询时间
   - QPS

3. **缓存状态**
   - 缓存命中率
   - 键数量
   - 内存使用率

4. **存储状态**
   - 数据库大小
   - 表空间使用
   - 索引大小

#### 7.1.3 业务监控仪表盘

**面板列表**：

1. **用户增长**
   - 日新增用户
   - 周/月新增用户
   - 用户留存率

2. **功能使用**
   - 功能调用次数
   - 功能使用时长
   - 功能转化率

3. **收入指标**
   - 日收入
   - ARPU
   - 付费率

### 7.2 仪表盘配置示例

```json
{
  "dashboard": {
    "title": "YYC3 系统概览",
    "uid": "yyc3-overview",
    "panels": [
      {
        "id": 1,
        "title": "服务可用性",
        "type": "stat",
        "targets": [
          {
            "expr": "avg(up{job=~\"yyc3.*\"})"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percentunit",
            "thresholds": {
              "steps": [
                { "color": "red", "value": 0 },
                { "color": "green", "value": 0.95 }
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "QPS趋势",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m]))"
          }
        ]
      },
      {
        "id": 3,
        "title": "P95响应时间",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"
          }
        ]
      }
    ]
  }
}
```

---

## 八、监控高可用设计

### 8.1 Prometheus高可用

#### 8.1.1 Prometheus联邦

```yaml
# 主Prometheus
global:
  external_labels:
    cluster: 'yyc3-xy-ai'
    replica: 'prometheus-1'

scrape_configs:
  # 从从Prometheus拉取聚合数据
  - job_name: 'federate'
    scrape_interval: 15s
    honor_labels: true
    metrics_path: '/federate'
    static_configs:
      - targets:
          - 'prometheus-2:9090'
          - 'prometheus-3:9090'
    params:
      'match[]':
        - '{__name__=~".+"}'
```

#### 8.1.2 Thanos集群

```yaml
# Thanos Sidecar配置
thanos-sidecar:
  image: quay.io/thanos/thanos:v0.32.0
  command:
    - sidecar
  args:
    - --prometheus.url=http://prometheus:9090
    - --tsdb.path=/prometheus
    - --objstore.config-file=/etc/thanos/objstore.yml
    - --grpc-address=0.0.0.0:10901
    - --http-address=0.0.0.0:10902
```

### 8.2 Alertmanager高可用

```yaml
alertmanager:
  image: prom/alertmanager:latest
  command:
    - --config.file=/etc/alertmanager/alertmanager.yml
    - --cluster.listen-address=0.0.0.0:9094
    - --cluster.peer=alertmanager-1:9094
    - --cluster.peer=alertmanager-2:9094
```

### 8.3 Elasticsearch高可用

```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
  environment:
    - cluster.name=yyc3-logs
    - node.name=es-node-1
    - discovery.seed_hosts=es-node-2,es-node-3
    - cluster.initial_master_nodes=es-node-1,es-node-2,es-node-3
    - node.roles=master,data,ingest
```

---

## 九、监控安全设计

### 9.1 访问控制

#### 9.1.1 Prometheus认证

```yaml
# 使用Basic Auth
global:
  external_labels:
    cluster: 'yyc3-xy-ai'

# 使用TLS
scrape_configs:
  - job_name: 'yyc3-main-app'
    scheme: https
    tls_config:
      ca_file: /etc/prometheus/ca.pem
      cert_file: /etc/prometheus/cert.pem
      key_file: /etc/prometheus/key.pem
      insecure_skip_verify: false
```

#### 9.1.2 Grafana认证

```yaml
# docker-compose.yml
grafana:
  environment:
    - GF_SECURITY_ADMIN_USER=admin
    - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    - GF_AUTH_ANONYMOUS_ENABLED=false
    - GF_AUTH_BASIC_ENABLED=true
    - GF_AUTH_LDAP_ENABLED=true
    - GF_AUTH_LDAP_CONFIG_FILE=/etc/grafana/ldap.toml
```

### 9.2 数据加密

#### 9.2.1 传输加密

```yaml
# Prometheus TLS配置
scrape_configs:
  - job_name: 'yyc3-main-app'
    scheme: https
    tls_config:
      ca_file: /etc/prometheus/ca.pem
      cert_file: /etc/prometheus/cert.pem
      key_file: /etc/prometheus/key.pem
```

#### 9.2.2 存储加密

```yaml
# Elasticsearch加密
elasticsearch:
  environment:
    - xpack.security.enabled=true
    - xpack.security.transport.ssl.enabled=true
    - xpack.security.transport.ssl.certificate_authorities=/usr/share/elasticsearch/config/ca.pem
    - xpack.security.transport.ssl.certificate=/usr/share/elasticsearch/config/node.pem
    - xpack.security.transport.ssl.key=/usr/share/elasticsearch/config/node-key.pem
```

### 9.3 敏感信息脱敏

```typescript
// 日志脱敏中间件
export function sanitizeLogData(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'privateKey'];

  if (typeof data === 'string') {
    return data.replace(/(password|token|secret|apiKey|privateKey)=["']([^"']+)["']/gi, '$1=***');
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***';
      }
    }
    return sanitized;
  }

  return data;
}
```

---

## 十、监控运维最佳实践

### 10.1 监控配置管理

#### 10.1.1 配置版本控制

```bash
# 监控配置目录结构
monitoring/
├── prometheus/
│   ├── prometheus.yml
│   ├── alerts.yml
│   └── recording_rules.yml
├── grafana/
│   ├── datasources/
│   └── dashboards/
├── alertmanager/
│   └── alertmanager.yml
└── logstash/
    └── pipeline/
```

#### 10.1.2 配置变更流程

1. 在开发环境测试配置
2. 提交PR进行代码审查
3. 合并到主分支
4. 自动部署到测试环境
5. 验证配置正确性
6. 部署到生产环境
7. 监控配置生效情况

### 10.2 告警处理流程

#### 10.2.1 告警响应流程

```
告警触发 → 告警路由 → 通知发送 → 值班人员接收 → 问题确认 → 问题定位 → 问题解决 → 告警恢复 → 事后复盘
```

#### 10.2.2 告警处理SOP

| 告警级别 | 响应时间 | 处理流程 | 升级条件 |
|---------|---------|---------|---------|
| P0 | 5分钟 | 立即处理，电话通知 | 15分钟未解决升级 |
| P1 | 15分钟 | 优先处理，IM通知 | 1小时未解决升级 |
| P2 | 30分钟 | 尽快处理，邮件通知 | 4小时未解决升级 |
| P3 | 2小时 | 计划处理，邮件通知 | 次日未解决升级 |

### 10.3 监控指标优化

#### 10.3.1 指标优化原则

- **必要性**：只采集必要的指标
- **可理解性**：指标名称和标签清晰易懂
- **可操作性**：指标能够指导运维决策
- **可追溯性**：指标能够关联到具体问题

#### 10.3.2 指标优化方法

```promql
# 使用recording rule预计算
groups:
  - name: optimization_rules
    interval: 30s
    rules:
      # 预计算QPS
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))

      # 预计算错误率
      - record: job:http_errors:rate5m
        expr: sum by (job) (rate(http_requests_total{status_code=~"5.."}[5m]))

      # 预计算P95响应时间
      - record: job:http_request_duration:p95
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
```

### 10.4 监控系统维护

#### 10.4.1 日常维护任务

- 检查监控系统运行状态
- 检查告警规则触发情况
- 清理过期监控数据
- 更新监控配置
- 优化查询性能
- 备份监控数据

#### 10.4.2 定期维护任务

- 每周：审查告警规则有效性
- 每月：优化仪表盘配置
- 每季度：评估监控系统性能
- 每半年：进行监控系统架构评审

---

## 附录

### A. 监控指标清单

#### A.1 基础设施指标

| 指标名称 | 指标类型 | 单位 | 告警阈值 |
|---------|---------|------|---------|
| node_cpu_usage | Gauge | 百分比 | >90% |
| node_memory_usage | Gauge | 百分比 | >90% |
| node_disk_usage | Gauge | 百分比 | >90% |
| node_network_in | Counter | 字节 | - |
| node_network_out | Counter | 字节 | - |

#### A.2 应用指标

| 指标名称 | 指标类型 | 单位 | 告警阈值 |
|---------|---------|------|---------|
| http_requests_total | Counter | 次 | - |
| http_request_duration | Histogram | 秒 | P95>2s |
| http_requests_in_flight | Gauge | 次 | >1000 |
| api_errors_total | Counter | 次 | - |

#### A.3 数据库指标

| 指标名称 | 指标类型 | 单位 | 告警阈值 |
|---------|---------|------|---------|
| pg_connections | Gauge | 个 | >80% |
| pg_slow_queries | Counter | 次 | - |
| redis_memory_usage | Gauge | 字节 | >90% |
| redis_cache_hit_rate | Gauge | 百分比 | <80% |

### B. 相关文档

- [总体架构设计文档](./01-YYC3-XY-架构类-总体架构设计文档.md)
- [部署架构设计文档](./07-YYC3-XY-架构类-部署架构设计文档.md)
- [安全架构设计文档](./05-YYC3-XY-架构类-安全架构设计文档)
- [微服务架构设计文档](./02-YYC3-XY-架构类-微服务架构设计文档.md)

### C. 变更历史

| 版本号 | 变更日期 | 变更内容 | 变更人 |
|-------|---------|---------|-------|
| V1.0 | 2025-12-25 | 初始版本 | AI助手 |

---

**文档结束**
