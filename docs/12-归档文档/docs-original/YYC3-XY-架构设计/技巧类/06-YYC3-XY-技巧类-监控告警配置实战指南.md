# YYC³ AI小语智能成长守护系统 - 监控告警配置实战指南

## 文档信息

- **文档类型**: 技巧类
- **文档编号**: 06-YYC3-XY-技巧类-监控告警配置实战指南
- **版本**: V1.0
- **创建日期**: 2025-12-25
- **适用范围**: YYC³ AI小语智能成长守护系统监控告警系统

## 一、文档概述

### 1.1 文档目的

本文档提供YYC³ AI小语智能成长守护系统监控告警系统的完整配置指南，涵盖Prometheus指标采集、Grafana可视化、Alertmanager告警管理、ELK日志分析等核心组件的实战配置，确保系统可观测性和故障快速响应能力。

### 1.2 适用场景

- 生产环境监控告警系统部署
- 开发环境监控配置
- 监控指标定制化开发
- 告警规则优化调整

### 1.3 核心原则

遵循「五高五标五化」要求：
- **高可用**: 监控系统高可用部署，告警不丢失
- **高性能**: 高效指标采集，低延迟告警
- **高安全**: 监控数据加密，告警信息安全
- **高可扩展**: 支持多环境、多集群监控
- **高可维护**: 标准化配置，易于维护和扩展

## 二、监控架构概述

### 2.1 监控系统组件

```
┌─────────────────────────────────────────────────────────────┐
│                    YYC³ 监控告警系统                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Prometheus │───▶│ Alertmanager│───▶│   通知渠道   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                                       │           │
│         ▼                                       ▼           │
│  ┌─────────────┐                        ┌─────────────┐    │
│  │   Grafana   │                        │   邮件/短信   │    │
│  └─────────────┘                        │   钉钉/企微   │    │
│         │                              └─────────────┘    │
│         ▼                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   cAdvisor  │    │ Node Exporter│   │ App Metrics  │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │Elasticsearch│───▶│   Logstash  │◀───│  应用日志    │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│         │                                       │           │
│         ▼                                       ▼           │
│  ┌─────────────┐                        ┌─────────────┐  │
│  │    Kibana   │                        │  容器日志    │  │
│  └─────────────┘                        └─────────────┘  │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │    Jaeger   │◀───│  App Traces │    │   Tempo     │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 监控数据流

1. **指标采集**: Prometheus定期从各Exporter采集指标
2. **数据存储**: Prometheus时序数据库存储指标数据
3. **规则评估**: 定期评估告警规则，触发告警
4. **告警路由**: Alertmanager接收告警，按规则路由
5. **通知发送**: 通过邮件、短信、钉钉等渠道发送告警
6. **可视化展示**: Grafana从Prometheus查询数据，展示仪表板
7. **日志分析**: Logstash收集日志，存储到Elasticsearch，Kibana展示
8. **链路追踪**: Jaeger/Tempo收集分布式追踪数据，Grafana展示

### 2.3 五高五标五化检查表

#### 2.3.1 高可用性检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| Prometheus HA | Prometheus高可用部署 | 使用Thanos或VictoriaMetrics集群 | 检查部署架构 |
| Alertmanager HA | Alertmanager高可用部署 | 至少3个实例集群部署 | 检查集群状态 |
| Grafana HA | Grafana高可用部署 | 使用负载均衡+多实例 | 检查负载均衡配置 |
| 数据持久化 | 监控数据持久化存储 | 使用PVC或外部存储 | 检查存储配置 |
| 自动恢复 | 组件故障自动恢复 | 配置重启策略和健康检查 | 模拟组件故障 |
| 告警不丢失 | 告警消息不丢失 | 使用消息队列或持久化存储 | 检查告警路由配置 |

#### 2.3.2 高性能检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 采集间隔优化 | 指标采集间隔合理 | 关键指标15s，一般指标30-60s | 检查scrape_interval |
| 存储优化 | 时序数据存储优化 | 使用数据压缩和降采样 | 检查存储配置 |
| 查询性能 | PromQL查询性能 | 查询响应时间<5s | 执行性能测试 |
| 资源限制 | 组件资源限制合理 | CPU/内存使用率<80% | 检查资源使用情况 |
| 并发处理 | 支持高并发查询 | 支持100+并发查询 | 执行压力测试 |
| 缓存优化 | 查询结果缓存 | 启用查询缓存 | 检查缓存配置 |

#### 2.3.3 高安全性检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 访问控制 | Grafana访问控制 | 配置认证和RBAC | 检查用户权限 |
| 数据加密 | 传输数据加密 | 使用HTTPS/TLS | 检查证书配置 |
| 敏感信息保护 | 敏感信息保护 | 使用Secret管理 | 检查Secret配置 |
| 告警信息脱敏 | 告警信息脱敏 | 不包含敏感数据 | 检查告警模板 |
| 审计日志 | 操作审计日志 | 记录关键操作 | 检查审计日志 |
| 网络隔离 | 监控网络隔离 | 使用独立网络或VLAN | 检查网络配置 |

#### 2.3.4 高可扩展性检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 多环境监控 | 支持多环境监控 | 支持dev/staging/prod | 检查环境标签 |
| 多集群监控 | 支持多集群监控 | 使用联邦或Thanos | 检查联邦配置 |
| 水平扩展 | 组件水平扩展 | 支持自动扩缩容 | 测试扩缩容功能 |
| 指标扩展 | 自定义指标扩展 | 支持应用自定义指标 | 检查自定义指标 |
| 告警扩展 | 告警规则扩展 | 支持动态规则加载 | 测试规则热加载 |
| 可视化扩展 | 仪表板扩展 | 支持自定义仪表板 | 检查仪表板数量 |

#### 2.3.5 高可维护性检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 配置标准化 | 配置文件标准化 | 统一配置格式和命名 | 检查配置文件 |
| 文档完善 | 监控文档完善 | 包含架构、配置、运维文档 | 检查文档完整性 |
| 告警分类 | 告警分类清晰 | 按级别、团队、服务分类 | 检查告警标签 |
| 故障排查手册 | 故障排查手册完整 | 包含常见问题和解决方案 | 检查排查手册 |
| 版本管理 | 配置版本管理 | 使用Git管理配置 | 检查Git仓库 |
| 变更流程 | 变更流程规范 | 遵循变更管理流程 | 检查变更记录 |

#### 2.3.6 标准化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 指标命名 | 指标命名规范 | 遵循Prometheus命名规范 | 检查指标名称 |
| 标签命名 | 标签命名规范 | 使用小写和下划线 | 检查标签名称 |
| 告警命名 | 告警命名规范 | 统一告警名称格式 | 检查告警名称 |
| 仪表板命名 | 仪表板命名规范 | 统一仪表板命名 | 检查仪表板名称 |
| 配置文件命名 | 配置文件命名规范 | 使用kebab-case | 检查文件名 |
| 日志格式 | 日志格式统一 | 使用JSON或标准格式 | 检查日志格式 |

#### 2.3.7 规范化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 部署规范 | 部署流程规范 | 使用Docker/K8s部署 | 检查部署脚本 |
| 配置规范 | 配置管理规范 | 使用环境变量/ConfigMap | 检查配置管理 |
| 告警规范 | 告警规则规范 | 遵循告警最佳实践 | 检查告警规则 |
| 可视化规范 | 仪表板设计规范 | 统一颜色和布局 | 检查仪表板设计 |
| 监控范围 | 监控范围明确 | 覆盖所有关键服务 | 检查监控覆盖度 |
| SLA规范 | SLA定义规范 | 明确各服务SLA | 检查SLA文档 |

#### 2.3.8 自动化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 自动部署 | 自动部署监控组件 | 使用IaC工具部署 | 检查部署脚本 |
| 自动发现 | 服务自动发现 | 使用服务发现机制 | 检查服务发现配置 |
| 自动告警 | 自动告警触发 | 基于规则自动告警 | 测试告警触发 |
| 自动恢复 | 自动故障恢复 | 配置自动重启和恢复 | 测试自动恢复 |
| 自动扩缩容 | 自动扩缩容 | 基于指标自动扩缩容 | 测试自动扩缩容 |
| 自动备份 | 自动数据备份 | 定期自动备份监控数据 | 检查备份任务 |

#### 2.3.9 智能化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 异常检测 | 智能异常检测 | 使用机器学习算法 | 检查异常检测配置 |
| 预测告警 | 预测性告警 | 基于趋势预测故障 | 检查预测模型 |
| 根因分析 | 自动根因分析 | 关联分析故障根因 | 测试根因分析 |
| 智能降噪 | 告警智能降噪 | 自动聚合相似告警 | 检查告警聚合 |
| 自适应阈值 | 自适应告警阈值 | 根据历史数据调整 | 检查阈值配置 |
| AI辅助 | AI辅助运维 | 使用AI提供运维建议 | 检查AI功能 |

#### 2.3.10 可视化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 仪表板完整 | 仪表板覆盖全面 | 覆盖所有关键指标 | 检查仪表板列表 |
| 实时更新 | 数据实时更新 | 刷新间隔<30s | 检查刷新配置 |
| 多维度展示 | 多维度数据展示 | 支持时间、服务、环境维度 | 检查仪表板变量 |
| 告警可视化 | 告警可视化展示 | 告警状态清晰展示 | 检查告警面板 |
| 链路可视化 | 分布式链路可视化 | 清晰展示调用链 | 检查链路追踪 |
| 报表生成 | 自动报表生成 | 定期生成监控报表 | 检查报表任务 |

#### 2.3.11 流程化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 监控流程 | 监控流程规范 | 定义清晰的监控流程 | 检查流程文档 |
| 告警流程 | 告警处理流程 | 定义告警处理SOP | 检查SOP文档 |
| 故障流程 | 故障处理流程 | 定义故障处理流程 | 检查故障处理文档 |
| 变更流程 | 监控变更流程 | 定义变更管理流程 | 检查变更记录 |
| 优化流程 | 监控优化流程 | 定期优化监控策略 | 检查优化记录 |
| 复盘流程 | 故障复盘流程 | 故障后复盘总结 | 检查复盘报告 |

#### 2.3.12 文档化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 架构文档 | 监控架构文档 | 包含架构图和说明 | 检查架构文档 |
| 配置文档 | 配置说明文档 | 详细说明配置项 | 检查配置文档 |
| 运维文档 | 运维操作文档 | 包含日常运维操作 | 检查运维文档 |
| 故障文档 | 故障处理文档 | 包含故障案例和解决方案 | 检查故障文档 |
| API文档 | 监控API文档 | 包含API使用说明 | 检查API文档 |
| 培训文档 | 培训材料文档 | 包含培训PPT和视频 | 检查培训材料 |

#### 2.3.13 工具化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 部署工具 | 自动化部署工具 | 使用Ansible/Helm等 | 检查部署工具 |
| 配置工具 | 配置管理工具 | 使用ConfigMap/Secret | 检查配置工具 |
| 监控工具 | 监控工具链 | Prometheus+Grafana+Alertmanager | 检查工具链 |
| 日志工具 | 日志分析工具 | ELK/Loki等 | 检查日志工具 |
| 追踪工具 | 链路追踪工具 | Jaeger/Tempo等 | 检查追踪工具 |
| 告警工具 | 告警通知工具 | 钉钉/企微/邮件等 | 检查告警工具 |

#### 2.3.14 数字化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 数据采集 | 全量数据采集 | 覆盖所有关键数据 | 检查采集配置 |
| 数据存储 | 数据持久化存储 | 使用时序数据库 | 检查存储配置 |
| 数据分析 | 数据分析能力 | 支持复杂查询和分析 | 测试查询功能 |
| 数据可视化 | 数据可视化展示 | 多种图表类型 | 检查可视化效果 |
| 数据报表 | 数据报表生成 | 自动生成报表 | 检查报表功能 |
| 数据导出 | 数据导出功能 | 支持多种格式导出 | 测试导出功能 |

#### 2.3.15 生态化检查表

| 检查项 | 检查内容 | 合格标准 | 检查方法 |
|--------|----------|----------|----------|
| 工具生态 | 监控工具生态 | 集成多种监控工具 | 检查工具集成 |
| 告警生态 | 告警通知生态 | 支持多种通知渠道 | 检查告警渠道 |
| 可视化生态 | 可视化生态 | 支持多种可视化方案 | 检查可视化方案 |
| 社区生态 | 社区生态参与 | 参与开源社区 | 检查社区贡献 |
| 标准生态 | 遵循标准规范 | 遵循业界标准 | 检查标准遵循 |
| 扩展生态 | 扩展能力 | 支持插件和扩展 | 检查扩展能力 |

## 三、Prometheus配置

### 3.1 基础配置

#### 3.1.1 全局配置

```yaml
global:
  # 采集间隔
  scrape_interval: 15s
  # 规则评估间隔
  evaluation_interval: 15s
  # 外部标签
  external_labels:
    cluster: 'yyc3-xy-ai'
    environment: 'production'

# 告警规则文件
rule_files:
  - "alerts.yml"

# 告警管理器配置
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

#### 3.1.2 存储配置

```yaml
# 启动参数
command:
  - '--config.file=/etc/prometheus/prometheus.yml'
  - '--storage.tsdb.path=/prometheus'
  - '--storage.tsdb.retention.time=200h'
  - '--web.enable-lifecycle'
  - '--web.enable-admin-api'
```

### 3.2 指标采集配置

#### 3.2.1 主应用监控

```yaml
scrape_configs:
  # 主应用监控
  - job_name: 'yyc3-main-app'
    static_configs:
      - targets: ['app:1229']
        labels:
          service: 'yyc3-main'
          environment: 'production'
    metrics_path: '/api/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
```

#### 3.2.2 系统监控

```yaml
  # Node Exporter (系统监控)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
        labels:
          service: 'node-exporter'
          environment: 'production'
    scrape_interval: 15s
```

#### 3.2.3 数据库监控

```yaml
  # PostgreSQL 监控
  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']
        labels:
          service: 'postgres'
          environment: 'production'
    scrape_interval: 15s

  # Redis 监控
  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']
        labels:
          service: 'redis'
          environment: 'production'
    scrape_interval: 15s
```

#### 3.2.4 容器监控

```yaml
  # Docker 容器监控
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
        labels:
          service: 'cadvisor'
          environment: 'production'
    scrape_interval: 15s
```

#### 3.2.5 Web服务器监控

```yaml
  # Nginx 监控
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
        labels:
          service: 'nginx'
          environment: 'production'
    scrape_interval: 15s
```

### 3.3 自定义指标开发

#### 3.3.1 应用指标埋点

```javascript
// 使用prom-client库
const client = require('prom-client');

// 创建指标
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// 在请求处理中使用
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      { method: req.method, route: req.path, status_code: res.statusCode },
      duration
    );
    httpRequestsTotal.inc(
      { method: req.method, route: req.path, status_code: res.statusCode }
    );
  });
  
  next();
});

// 暴露指标端点
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

#### 3.3.2 业务指标埋点

```javascript
// 用户注册指标
const userRegistrations = new client.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['user_type']
});

// AI调用指标
const aiRequestsTotal = new client.Counter({
  name: 'ai_requests_total',
  help: 'Total number of AI requests',
  labelNames: ['model', 'provider']
});

const aiRequestDuration = new client.Histogram({
  name: 'ai_request_duration_seconds',
  help: 'Duration of AI requests in seconds',
  labelNames: ['model', 'provider'],
  buckets: [1, 5, 10, 30, 60]
});

// 使用示例
async function handleUserRegistration(userType) {
  userRegistrations.inc({ user_type: userType });
}

async function handleAIRequest(model, provider) {
  const start = Date.now();
  try {
    const result = await callAI(model, provider);
    aiRequestsTotal.inc({ model, provider });
    return result;
  } finally {
    const duration = (Date.now() - start) / 1000;
    aiRequestDuration.observe({ model, provider }, duration);
  }
}
```

## 四、告警规则配置

### 4.1 告警规则文件

#### 4.1.1 基础告警规则

```yaml
groups:
  - name: system_alerts
    interval: 30s
    rules:
      # 容器宕机告警
      - alert: ContainerDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
          team: devops
        annotations:
          summary: "容器 {{ $labels.instance }} 已宕机"
          description: "容器 {{ $labels.instance }} (job: {{ $labels.job }}) 已宕机超过5分钟"
      
      # CPU使用率告警
      - alert: HighCPUUsage
        expr: rate(container_cpu_usage_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
          team: devops
        annotations:
          summary: "高CPU使用率"
          description: "容器 {{ $labels.instance }} CPU使用率超过80% (当前值: {{ $value | humanizePercentage }})"
      
      # 内存使用率告警
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.8
        for: 5m
        labels:
          severity: warning
          team: devops
        annotations:
          summary: "高内存使用率"
          description: "容器 {{ $labels.instance }} 内存使用率超过80% (当前值: {{ $value | humanizePercentage }})"
      
      # 磁盘使用率告警
      - alert: HighDiskUsage
        expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.8
        for: 10m
        labels:
          severity: warning
          team: devops
        annotations:
          summary: "高磁盘使用率"
          description: "挂载点 {{ $labels.mountpoint }} 磁盘使用率超过80% (当前值: {{ $value | humanizePercentage }})"
```

#### 4.1.2 应用告警规则

```yaml
  - name: application_alerts
    interval: 30s
    rules:
      # HTTP错误率告警
      - alert: HighHTTPErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "高HTTP错误率"
          description: "服务 {{ $labels.service }} HTTP 5xx错误率超过5% (当前值: {{ $value | humanizePercentage }})"
      
      # HTTP响应时间告警
      - alert: HighHTTPResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "高HTTP响应时间"
          description: "服务 {{ $labels.service }} P95响应时间超过2秒 (当前值: {{ $value }}s)"
      
      # 数据库连接池告警
      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_activity_count / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: warning
          team: database
        annotations:
          summary: "数据库连接池接近耗尽"
          description: "数据库连接使用率超过80% (当前值: {{ $value | humanizePercentage }})"
      
      # Redis连接数告警
      - alert: HighRedisConnections
        expr: redis_connected_clients / redis_maxclients > 0.8
        for: 5m
        labels:
          severity: warning
          team: cache
        annotations:
          summary: "Redis连接数过高"
          description: "Redis连接数超过最大值的80% (当前值: {{ $value | humanizePercentage }})"
```

#### 4.1.3 AI服务告警规则

```yaml
  - name: ai_service_alerts
    interval: 30s
    rules:
      # AI请求失败率告警
      - alert: HighAIRequestFailureRate
        expr: rate(ai_requests_total{status="failed"}[5m]) / rate(ai_requests_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
          team: ai
        annotations:
          summary: "AI请求失败率过高"
          description: "AI服务 {{ $labels.provider }}/{{ $labels.model }} 请求失败率超过10% (当前值: {{ $value | humanizePercentage }})"
      
      # AI响应时间告警
      - alert: HighAIResponseTime
        expr: histogram_quantile(0.95, rate(ai_request_duration_seconds_bucket[5m])) > 30
        for: 5m
        labels:
          severity: warning
          team: ai
        annotations:
          summary: "AI响应时间过长"
          description: "AI服务 {{ $labels.provider }}/{{ $labels.model }} P95响应时间超过30秒 (当前值: {{ $value }}s)"
      
      # API配额告警
      - alert: APIQuotaExceeded
        expr: ai_api_usage / ai_api_quota > 0.9
        for: 1m
        labels:
          severity: critical
          team: ai
        annotations:
          summary: "API配额即将耗尽"
          description: "AI服务 {{ $labels.provider }} API配额使用率超过90% (当前值: {{ $value | humanizePercentage }})"
```

### 4.2 告警规则管理

#### 4.2.1 规则文件结构

```
monitoring/
├── prometheus.yml
├── alerts/
│   ├── system.yml
│   ├── application.yml
│   ├── ai_service.yml
│   └── business.yml
└── alertmanager.yml
```

#### 4.2.2 规则热加载

```bash
# 检查规则配置
docker-compose exec prometheus promtool check config /etc/prometheus/prometheus.yml

# 检查告警规则
docker-compose exec prometheus promtool check rules /etc/prometheus/alerts/*.yml

# 热加载配置
curl -X POST http://localhost:9090/-/reload
```

## 五、Alertmanager配置

### 5.1 基础配置

#### 5.1.1 全局配置

```yaml
global:
  # SMTP配置
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@example.com'
  smtp_auth_username: 'alertmanager@example.com'
  smtp_auth_password: 'password'
  
  # Slack配置
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
  
  # 全局超时
  resolve_timeout: 5m

# 告警路由树
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'
  
  # 子路由
  routes:
    # 严重告警
    - match:
        severity: critical
      receiver: 'critical-alerts'
      continue: true
    
    # DevOps团队
    - match:
        team: devops
      receiver: 'devops-team'
    
    # 后端团队
    - match:
        team: backend
      receiver: 'backend-team'
    
    # AI团队
    - match:
        team: ai
      receiver: 'ai-team'

# 接收器配置
receivers:
  - name: 'default'
    email_configs:
      - to: 'team@example.com'
        headers:
          Subject: '[YYC³ Alert] {{ .GroupLabels.alertname }}'
  
  - name: 'critical-alerts'
    email_configs:
      - to: 'oncall@example.com'
        headers:
          Subject: '[CRITICAL] {{ .GroupLabels.alertname }}'
    slack_configs:
      - channel: '#critical-alerts'
        title: '[CRITICAL] {{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
  
  - name: 'devops-team'
    email_configs:
      - to: 'devops@example.com'
    slack_configs:
      - channel: '#devops-alerts'
  
  - name: 'backend-team'
    email_configs:
      - to: 'backend@example.com'
    slack_configs:
      - channel: '#backend-alerts'
  
  - name: 'ai-team'
    email_configs:
      - to: 'ai@example.com'
    slack_configs:
      - channel: '#ai-alerts'
```

### 5.2 钉钉告警配置

#### 5.2.1 钉钉Webhook配置

```yaml
receivers:
  - name: 'dingtalk-alerts'
    webhook_configs:
      - url: 'https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN'
        send_resolved: true
        http_config:
          bearer_token: 'YOUR_TOKEN'
```

#### 5.2.2 钉钉告警模板

```yaml
templates:
  - '/etc/alertmanager/templates/*.tmpl'
```

```go
{{ define "dingtalk.default.message" }}
{{- if gt (len .Alerts.Firing) 0 -}}
【告警触发】
{{ range .Alerts.Firing }}
告警名称: {{ .Labels.alertname }}
告警级别: {{ .Labels.severity }}
告警时间: {{ .StartsAt.Format "2006-01-02 15:04:05" }}
告警详情: {{ .Annotations.description }}
{{ end }}
{{- end -}}

{{- if gt (len .Alerts.Resolved) 0 -}}
【告警恢复】
{{ range .Alerts.Resolved }}
告警名称: {{ .Labels.alertname }}
恢复时间: {{ .EndsAt.Format "2006-01-02 15:04:05" }}
{{ end }}
{{- end -}}
{{ end }}
```

### 5.3 企业微信告警配置

#### 5.3.1 企业微信Webhook配置

```yaml
receivers:
  - name: 'wechat-alerts'
    webhook_configs:
      - url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY'
        send_resolved: true
```

#### 5.3.2 企业微信告警模板

```json
{
  "msgtype": "markdown",
  "markdown": {
    "content": "## YYC³ 告警通知\n\n> **告警名称**: {{ .GroupLabels.alertname }}\n\n> **告警级别**: {{ .GroupLabels.severity }}\n\n> **告警详情**:\n{{ range .Alerts }}- {{ .Annotations.description }}\n{{ end }}"
  }
}
```

## 六、Grafana配置

### 6.1 数据源配置

#### 6.1.1 Prometheus数据源

```yaml
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    jsonData:
      timeInterval: "15s"
      queryTimeout: "60s"
      httpMethod: "POST"
      exemplarTraceIdDestinations:
        - datasourceUid: tempo
          name: trace_id
    secureJsonData: {}
```

#### 6.1.2 Elasticsearch数据源

```yaml
datasources:
  - name: Elasticsearch
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "logstash-*"
    jsonData:
      interval: "Daily"
      timeField: "@timestamp"
      esVersion: "8.0.0"
      maxConcurrentShardRequests: 5
      logMessageField: "message"
      logLevelField: "level"
    secureJsonData: {}
```

### 6.2 仪表板配置

#### 6.2.1 系统概览仪表板

```json
{
  "dashboard": {
    "title": "YYC³ 系统概览",
    "panels": [
      {
        "title": "CPU使用率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(container_cpu_usage_seconds_total[5m]) * 100",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "内存使用率",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes / container_spec_memory_limit_bytes * 100",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "磁盘使用率",
        "type": "graph",
        "targets": [
          {
            "expr": "(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100",
            "legendFormat": "{{mountpoint}}"
          }
        ]
      }
    ]
  }
}
```

#### 6.2.2 应用性能仪表板

```json
{
  "dashboard": {
    "title": "YYC³ 应用性能",
    "panels": [
      {
        "title": "HTTP请求速率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "HTTP响应时间 (P95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{route}}"
          }
        ]
      },
      {
        "title": "HTTP错误率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100",
            "legendFormat": "{{service}}"
          }
        ]
      }
    ]
  }
}
```

#### 6.2.3 AI服务仪表板

```json
{
  "dashboard": {
    "title": "YYC³ AI服务",
    "panels": [
      {
        "title": "AI请求速率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(ai_requests_total[5m])",
            "legendFormat": "{{provider}}/{{model}}"
          }
        ]
      },
      {
        "title": "AI响应时间 (P95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(ai_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{provider}}/{{model}}"
          }
        ]
      },
      {
        "title": "AI请求失败率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(ai_requests_total{status=\"failed\"}[5m]) / rate(ai_requests_total[5m]) * 100",
            "legendFormat": "{{provider}}/{{model}}"
          }
        ]
      }
    ]
  }
}
```

### 6.3 仪表板管理

#### 6.3.1 仪表板 provisioning

```yaml
apiVersion: 1

providers:
  - name: 'YYC³ Dashboards'
    orgId: 1
    folder: 'YYC³'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
```

#### 6.3.2 仪表板导入

```bash
# 导入仪表板
curl -X POST \
  -H "Content-Type: application/json" \
  -d @dashboard.json \
  http://admin:admin123@localhost:3001/api/dashboards/db
```

## 七、ELK日志配置

### 7.1 Logstash配置

#### 7.1.1 输入配置

```conf
input {
  # 应用日志
  file {
    path => "/var/log/app/*.log"
    start_position => "beginning"
    type => "yyc3-app"
    codec => multiline {
      pattern => "^%{TIMESTAMP_ISO8601}"
      negate => true
      what => "previous"
    }
  }
  
  # 容器日志
  docker {
    path => "/var/lib/docker/containers/*/*.log"
    start_position => "beginning"
    type => "docker-container"
  }
  
  # 系统日志
  syslog {
    port => 514
    type => "syslog"
  }
}
```

#### 7.1.2 过滤配置

```conf
filter {
  # 应用日志解析
  if [type] == "yyc3-app" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} \[%{DATA:thread}\] %{DATA:logger} - %{GREEDYDATA:msg}" }
    }
    
    date {
      match => ["timestamp", "ISO8601"]
    }
    
    # 解析JSON日志
    if [msg] =~ /^\{.*\}$/ {
      json {
        source => "msg"
      }
    }
  }
  
  # 容器日志解析
  if [type] == "docker-container" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:msg}" }
    }
  }
  
  # 添加环境标签
  mutate {
    add_field => { "environment" => "production" }
    add_field => { "cluster" => "yyc3-xy-ai" }
  }
}
```

#### 7.1.3 输出配置

```conf
output {
  # 输出到Elasticsearch
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "yyc3-logs-%{+YYYY.MM.dd}"
    document_type => "_doc"
  }
  
  # 错误日志单独索引
  if [level] == "ERROR" {
    elasticsearch {
      hosts => ["elasticsearch:9200"]
      index => "yyc3-error-logs-%{+YYYY.MM.dd}"
      document_type => "_doc"
    }
  }
  
  # 调试输出
  stdout {
    codec => rubydebug
  }
}
```

### 7.2 Kibana配置

#### 7.2.1 索引模式

```json
{
  "title": "yyc3-logs-*",
  "timeFieldName": "@timestamp",
  "fields": "[{\"name\":\"@timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"level\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"service\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true}]"
}
```

#### 7.2.2 可视化配置

```json
{
  "title": "日志级别分布",
  "type": "pie",
  "params": {
    "addTooltip": true,
    "addLegend": true,
    "legendPosition": "right",
    "isDonut": false
  },
  "aggs": [
    {
      "id": "1",
      "type": "terms",
      "schema": "segment",
      "params": {
        "field": "level",
        "size": 10,
        "order": "desc",
        "orderBy": "1"
      }
    }
  ]
}
```

## 八、分布式链路追踪

### 8.1 Jaeger配置

#### 8.1.1 Jaeger部署配置

```yaml
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
      - COLLECTOR_OTLP_ENABLED=true
    networks:
      - monitoring

  hotrod:
    image: jaegertracing/example-hotrod:latest
    container_name: hotrod
    ports:
      - "8080:8080"
      - "8081:8081"
    environment:
      - JAEGER_AGENT_HOST=jaeger
      - JAEGER_AGENT_PORT=6831
    networks:
      - monitoring
    depends_on:
      - jaeger

networks:
  monitoring:
    external: true
```

#### 8.1.2 应用集成Jaeger

```javascript
const { initTracer } = require('jaeger-client');

const initJaegerTracer = (serviceName) => {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: true,
      agentHost: 'jaeger',
      agentPort: 6831,
    },
  };

  const options = {
    logger: {
      info: (msg) => console.log('INFO', msg),
      error: (msg) => console.log('ERROR', msg),
    },
  };

  return initTracer(config, options);
};

const tracer = initJaegerTracer('yyc3-main-app');

// 在Express中间件中使用
app.use((req, res, next) => {
  const span = tracer.startSpan(`${req.method} ${req.path}`);
  span.setTag('http.method', req.method);
  span.setTag('http.url', req.url);
  
  req.span = span;
  
  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode);
    span.finish();
  });
  
  next();
});

// 在异步函数中使用
async function handleAIRequest(model, prompt) {
  const span = tracer.startSpan('handle_ai_request', {
    childOf: tracer.currentSpan(),
  });
  
  try {
    span.setTag('ai.model', model);
    span.setTag('ai.prompt_length', prompt.length);
    
    const result = await callAI(model, prompt);
    span.setTag('ai.response_length', result.length);
    
    return result;
  } catch (error) {
    span.setTag('error', true);
    span.log({ event: 'error', 'error.object': error, message: error.message });
    throw error;
  } finally {
    span.finish();
  }
}
```

### 8.2 Tempo配置

#### 8.2.1 Tempo部署配置

```yaml
version: '3.8'

services:
  tempo:
    image: grafana/tempo:latest
    container_name: tempo
    command: ['-config.file=/etc/tempo.yaml']
    volumes:
      - ./tempo.yaml:/etc/tempo.yaml
      - ./tempo-data:/tmp/tempo
    ports:
      - "3200:3200"
      - "4317:4317"
      - "4318:4318"
    networks:
      - monitoring

networks:
  monitoring:
    external: true
```

#### 8.2.2 Tempo配置文件

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        http:
        grpc:

storage:
  trace:
    backend: local
    local:
      path: /tmp/tempo
```

#### 8.2.3 应用集成Tempo

```javascript
const { trace } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const initTempoTracer = (serviceName) => {
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  });

  const provider = new NodeTracerProvider({ resource });

  const exporter = new OTLPTraceExporter({
    url: 'http://tempo:4317',
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  const expressInstrumentation = new ExpressInstrumentation();
  const httpInstrumentation = new HttpInstrumentation();

  expressInstrumentation.setTracerProvider(provider);
  httpInstrumentation.setTracerProvider(provider);

  provider.register();

  return trace.getTracer(serviceName);
};

const tracer = initTempoTracer('yyc3-main-app');

// 使用示例
async function processRequest(req, res) {
  const span = tracer.startSpan('process_request', {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
    },
  });

  try {
    const result = await businessLogic(req);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}
```

### 8.3 Grafana Tempo集成

```yaml
datasources:
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    isDefault: false
    editable: true
    jsonData:
      tracesToLogs:
        datasourceUid: 'loki'
        filterByTraceId: true
        mapTagNamesEnabled: true
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
      tracesToMetrics:
        datasourceUid: 'prometheus'
        queries:
          - name: 'Request Rate'
            query: 'rate(http_requests_total{$$__tags}[5m])'
      nodeGraph:
        enabled: true
      search:
        hide: false
      serviceMap:
        enabled: true
```

## 九、监控系统高可用部署

### 9.1 Prometheus HA部署

#### 9.1.1 Thanos架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Thanos高可用架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Prometheus 1│    │ Prometheus 2│    │ Prometheus 3│     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             ▼                               │
│                    ┌─────────────┐                          │
│                    │   Thanos    │                          │
│                    │   Store     │                          │
│                    │   Gateway   │                          │
│                    └─────────────┘                          │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────┐                          │
│                    │   Object    │                          │
│                    │   Storage   │                          │
│                    │  (S3/GCS)   │                          │
│                    └─────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.1.2 Thanos配置

```yaml
version: '3.8'

services:
  prometheus-1:
    image: prom/prometheus:latest
    container_name: prometheus-1
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
      - '--storage.tsdb.no-lockfile'
    volumes:
      - ./prometheus-1.yml:/etc/prometheus/prometheus.yml
      - prometheus-1-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - monitoring

  prometheus-2:
    image: prom/prometheus:latest
    container_name: prometheus-2
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
      - '--storage.tsdb.no-lockfile'
    volumes:
      - ./prometheus-2.yml:/etc/prometheus/prometheus.yml
      - prometheus-2-data:/prometheus
    ports:
      - "9091:9090"
    networks:
      - monitoring

  thanos-sidecar-1:
    image: quay.io/thanos/thanos:latest
    container_name: thanos-sidecar-1
    command:
      - 'sidecar'
      - '--tsdb.path=/prometheus'
      - '--prometheus.url=http://prometheus-1:9090'
      - '--objstore.config-file=/etc/thanos/objstore.yml'
      - '--grpc-address=0.0.0.0:10901'
      - '--http-address=0.0.0.0:10902'
    volumes:
      - ./objstore.yml:/etc/thanos/objstore.yml
      - prometheus-1-data:/prometheus
    ports:
      - "10901:10901"
      - "10902:10902"
    networks:
      - monitoring
    depends_on:
      - prometheus-1

  thanos-sidecar-2:
    image: quay.io/thanos/thanos:latest
    container_name: thanos-sidecar-2
    command:
      - 'sidecar'
      - '--tsdb.path=/prometheus'
      - '--prometheus.url=http://prometheus-2:9090'
      - '--objstore.config-file=/etc/thanos/objstore.yml'
      - '--grpc-address=0.0.0.0:10901'
      - '--http-address=0.0.0.0:10902'
    volumes:
      - ./objstore.yml:/etc/thanos/objstore.yml
      - prometheus-2-data:/prometheus
    ports:
      - "10903:10901"
      - "10904:10902"
    networks:
      - monitoring
    depends_on:
      - prometheus-2

  thanos-query:
    image: quay.io/thanos/thanos:latest
    container_name: thanos-query
    command:
      - 'query'
      - '--http-address=0.0.0.0:9091'
      - '--store=thanos-sidecar-1:10901'
      - '--store=thanos-sidecar-2:10901'
      - '--store=dnssrv+_grpc._tcp.thanos-store.thanos.svc.cluster.local'
    ports:
      - "9091:9091"
    networks:
      - monitoring
    depends_on:
      - thanos-sidecar-1
      - thanos-sidecar-2

  thanos-store:
    image: quay.io/thanos/thanos:latest
    container_name: thanos-store
    command:
      - 'store'
      - '--data-dir=/data'
      - '--objstore.config-file=/etc/thanos/objstore.yml'
      - '--grpc-address=0.0.0.0:10901'
      - '--http-address=0.0.0.0:10902'
      - '--index-cache-size=500MB'
      - '--chunk-pool-size=500MB'
    volumes:
      - ./objstore.yml:/etc/thanos/objstore.yml
      - thanos-store-data:/data
    ports:
      - "10905:10901"
      - "10906:10902"
    networks:
      - monitoring

  thanos-compact:
    image: quay.io/thanos/thanos:latest
    container_name: thanos-compact
    command:
      - 'compact'
      - '--data-dir=/data'
      - '--objstore.config-file=/etc/thanos/objstore.yml'
      - '--wait'
      - '--retention.resolution-raw=30d'
      - '--retention.resolution-5m=90d'
      - '--retention.resolution-1h=1y'
    volumes:
      - ./objstore.yml:/etc/thanos/objstore.yml
      - thanos-compact-data:/data
    networks:
      - monitoring

volumes:
  prometheus-1-data:
  prometheus-2-data:
  thanos-store-data:
  thanos-compact-data:

networks:
  monitoring:
    external: true
```

#### 9.1.3 对象存储配置

```yaml
type: s3
config:
  bucket: "yyc3-thanos"
  endpoint: "s3.amazonaws.com"
  region: "us-east-1"
  access_key: "YOUR_ACCESS_KEY"
  secret_key: "YOUR_SECRET_KEY"
  insecure: false
  signature_version2: false
  sse_encryption: false
  http_config:
    idle_conn_timeout: 90s
    response_header_timeout: 0s
    insecure_skip_verify: false
  trace:
    enable: false
```

### 9.2 Alertmanager HA部署

```yaml
version: '3.8'

services:
  alertmanager-1:
    image: prom/alertmanager:latest
    container_name: alertmanager-1
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-2:9094'
      - '--cluster.peer=alertmanager-3:9094'
      - '--storage.path=/alertmanager'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-1-data:/alertmanager
    ports:
      - "9093:9093"
      - "9094:9094"
    networks:
      - monitoring

  alertmanager-2:
    image: prom/alertmanager:latest
    container_name: alertmanager-2
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-1:9094'
      - '--cluster.peer=alertmanager-3:9094'
      - '--storage.path=/alertmanager'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-2-data:/alertmanager
    ports:
      - "9095:9093"
      - "9096:9094"
    networks:
      - monitoring

  alertmanager-3:
    image: prom/alertmanager:latest
    container_name: alertmanager-3
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--cluster.listen-address=0.0.0.0:9094'
      - '--cluster.peer=alertmanager-1:9094'
      - '--cluster.peer=alertmanager-2:9094'
      - '--storage.path=/alertmanager'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-3-data:/alertmanager
    ports:
      - "9097:9093"
      - "9098:9094"
    networks:
      - monitoring

volumes:
  alertmanager-1-data:
  alertmanager-2-data:
  alertmanager-3-data:

networks:
  monitoring:
    external: true
```

### 9.3 Grafana HA部署

```yaml
version: '3.8'

services:
  grafana-1:
    image: grafana/grafana:latest
    container_name: grafana-1
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
      - GF_SERVER_ROOT_URL=http://grafana.yyc3.com
      - GF_DATABASE_TYPE=postgres
      - GF_DATABASE_HOST=postgres:5432
      - GF_DATABASE_NAME=grafana
      - GF_DATABASE_USER=grafana
      - GF_DATABASE_PASSWORD=grafana
    volumes:
      - grafana-1-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - postgres

  grafana-2:
    image: grafana/grafana:latest
    container_name: grafana-2
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
      - GF_SERVER_ROOT_URL=http://grafana.yyc3.com
      - GF_DATABASE_TYPE=postgres
      - GF_DATABASE_HOST=postgres:5432
      - GF_DATABASE_NAME=grafana
      - GF_DATABASE_USER=grafana
      - GF_DATABASE_PASSWORD=grafana
    volumes:
      - grafana-2-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    ports:
      - "3001:3000"
    networks:
      - monitoring
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    container_name: grafana-postgres
    environment:
      - POSTGRES_DB=grafana
      - POSTGRES_USER=grafana
      - POSTGRES_PASSWORD=grafana
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - monitoring

  nginx:
    image: nginx:alpine
    container_name: grafana-nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
    networks:
      - monitoring
    depends_on:
      - grafana-1
      - grafana-2

volumes:
  grafana-1-data:
  grafana-2-data:
  postgres-data:

networks:
  monitoring:
    external: true
```

#### 9.3.1 Nginx负载均衡配置

```nginx
upstream grafana {
    least_conn;
    server grafana-1:3000 weight=1 max_fails=3 fail_timeout=30s;
    server grafana-2:3000 weight=1 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name grafana.yyc3.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name grafana.yyc3.com;
    
    ssl_certificate /etc/nginx/ssl/grafana.crt;
    ssl_certificate_key /etc/nginx/ssl/grafana.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        proxy_pass http://grafana;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 十、监控安全加固

### 10.1 访问控制

#### 10.1.1 Grafana认证配置

```yaml
grafana.ini:
  [auth.anonymous]
  enabled = false
  
  [auth.basic]
  enabled = true
  
  [auth.proxy]
  enabled = true
  header_name = X-WEBAUTH-USER
  header_property = username
  auto_sign_up = true
  
  [auth.ldap]
  enabled = true
  config_file = /etc/grafana/ldap.toml
  
  [users]
  allow_sign_up = false
  auto_assign_org_role = Viewer
  
  [security]
  admin_user = admin
  admin_password = ${GF_SECURITY_ADMIN_PASSWORD}
  secret_key = ${GF_SECURITY_SECRET_KEY}
```

#### 10.1.2 LDAP认证配置

```toml
[[servers]]
host = "ldap.yyc3.com"
port = 389
use_ssl = false
start_tls = false
ssl_skip_verify = false
bind_dn = "cn=admin,dc=yyc3,dc=com"
bind_password = "password"
search_filter = "(cn=%s)"
search_base_dns = ["ou=users,dc=yyc3,dc=com"]

[servers.attributes]
name = "givenName"
surname = "sn"
username = "cn"
email =  "email"

[[servers.group_mappings]]
group_dn = "cn=admins,ou=groups,dc=yyc3,dc=com"
org_role = "Admin"
grafana_admin = true

[[servers.group_mappings]]
group_dn = "cn=developers,ou=groups,dc=yyc3,dc=com"
org_role = "Editor"

[[servers.group_mappings]]
group_dn = "cn=users,ou=groups,dc=yyc3,dc=com"
org_role = "Viewer"
```

### 10.2 数据加密

#### 10.2.1 TLS/SSL配置

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--web.config.file=/etc/prometheus/web.yml'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./web.yml:/etc/prometheus/web.yml
      - ./certs:/etc/prometheus/certs
    ports:
      - "9090:9090"
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--web.config.file=/etc/alertmanager/web.yml'
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - ./web-alertmanager.yml:/etc/alertmanager/web.yml
      - ./certs:/etc/alertmanager/certs
    ports:
      - "9093:9093"
    networks:
      - monitoring

networks:
  monitoring:
    external: true
```

#### 10.2.2 Prometheus TLS配置

```yaml
tls_server_config:
  cert_file: /etc/prometheus/certs/server.crt
  key_file: /etc/prometheus/certs/server.key

basic_auth_users:
  admin: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYJWvWJjV2K
```

#### 10.2.3 Alertmanager TLS配置

```yaml
tls_server_config:
  cert_file: /etc/alertmanager/certs/server.crt
  key_file: /etc/alertmanager/certs/server.key

basic_auth_users:
  admin: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYJWvWJjV2K
```

### 10.3 敏感信息保护

#### 10.3.1 Kubernetes Secret管理

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: prometheus-secrets
  namespace: monitoring
type: Opaque
stringData:
  smtp-auth-username: "alertmanager@example.com"
  smtp-auth-password: "your-password"
  slack-webhook-url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  dingtalk-webhook-token: "your-dingtalk-token"
  wechat-webhook-key: "your-wechat-key"
---
apiVersion: v1
kind: Secret
metadata:
  name: thanos-objstore
  namespace: monitoring
type: Opaque
stringData:
  objstore.yml: |
    type: s3
    config:
      bucket: "yyc3-thanos"
      endpoint: "s3.amazonaws.com"
      region: "us-east-1"
      access_key: "YOUR_ACCESS_KEY"
      secret_key: "YOUR_SECRET_KEY"
```

#### 10.3.2 Docker Secret管理

```bash
# 创建Docker Secret
echo "your-password" | docker secret create alertmanager-smtp-password -

# 在docker-compose.yml中使用
version: '3.8'

services:
  alertmanager:
    image: prom/alertmanager:latest
    secrets:
      - alertmanager-smtp-password
    environment:
      - SMTP_AUTH_PASSWORD_FILE=/run/secrets/alertmanager-smtp-password

secrets:
  alertmanager-smtp-password:
    external: true
```

### 10.4 网络隔离

#### 10.4.1 Kubernetes NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: monitoring-network-policy
  namespace: monitoring
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9090
        - protocol: TCP
          port: 9093
        - protocol: TCP
          port: 3000
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 9090
        - protocol: TCP
          port: 9093
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
    - to:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9100
        - protocol: TCP
          port: 9187
        - protocol: TCP
          port: 9121
        - protocol: TCP
          port: 8080
```

#### 10.4.2 Docker网络隔离

```yaml
version: '3.8'

networks:
  monitoring-internal:
    driver: bridge
    internal: true
    ipam:
      config:
        - subnet: 172.20.0.0/16
  
  monitoring-external:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16

services:
  prometheus:
    image: prom/prometheus:latest
    networks:
      - monitoring-internal
      - monitoring-external
    ports:
      - "9090:9090"

  alertmanager:
    image: prom/alertmanager:latest
    networks:
      - monitoring-internal
    ports:
      - "9093:9093"

  grafana:
    image: grafana/grafana:latest
    networks:
      - monitoring-external
    ports:
      - "3000:3000"

  node-exporter:
    image: prom/node-exporter:latest
    networks:
      - monitoring-internal
    ports:
      - "9100:9100"
```

### 10.5 审计日志

#### 10.5.1 Grafana审计日志配置

```yaml
grafana.ini:
  [audit_log]
  enabled = true
  path = /var/log/grafana/audit.log
  log_events = ApiCall, CreateSnapshot, DashboardCreate, DashboardDelete, DashboardUpdate, DatasourceAdd, DatasourceDelete, DatasourceUpdate, Login, Logout, PluginAdd, PluginDelete, PluginUpdate, RoleCreate, RoleDelete, RoleUpdate, UserAdd, UserDelete, UserUpdate
```

#### 10.5.2 Prometheus审计日志

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--enable-feature=exemplar-storage'
      - '--enable-feature=expand-external-labels'
      - '--web.enable-admin-api'
      - '--web.enable-lifecycle'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./audit:/var/log/prometheus
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=prometheus"
```

## 十一、监控最佳实践

### 11.1 指标采集优化

#### 11.1.1 采集间隔优化

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # 关键指标 - 高频采集
  - job_name: 'critical-services'
    scrape_interval: 10s
    scrape_timeout: 8s
    static_configs:
      - targets: ['app:1229', 'api:8080']
  
  # 一般指标 - 标准采集
  - job_name: 'standard-services'
    scrape_interval: 30s
    scrape_timeout: 25s
    static_configs:
      - targets: ['node-exporter:9100', 'postgres-exporter:9187']
  
  # 低优先级指标 - 低频采集
  - job_name: 'low-priority'
    scrape_interval: 60s
    scrape_timeout: 50s
    static_configs:
      - targets: ['backup-service:8080', 'cleanup-service:8080']
```

#### 11.1.2 指标降采样

```yaml
# Prometheus启动参数
command:
  - '--config.file=/etc/prometheus/prometheus.yml'
  - '--storage.tsdb.path=/prometheus'
  - '--storage.tsdb.retention.time=200h'
  - '--storage.tsdb.retention.size=50GB'
```

#### 11.1.3 指标采集优化

```javascript
// 使用批量指标上报
const client = require('prom-client');

const batchMetrics = new client.Registry();

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [batchMetrics]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [batchMetrics]
});

// 批量上报
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', batchMetrics.contentType);
  res.end(await batchMetrics.metrics());
});
```

### 11.2 告警策略优化

#### 11.2.1 告警分级

```yaml
groups:
  - name: alert_levels
    rules:
      # P0 - 严重告警
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
          priority: P0
          team: devops
        annotations:
          summary: "服务宕机"
          description: "服务 {{ $labels.instance }} 已宕机"
      
      # P1 - 重要告警
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          priority: P1
          team: backend
        annotations:
          summary: "高错误率"
          description: "服务 {{ $labels.service }} 错误率超过5%"
      
      # P2 - 一般告警
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: info
          priority: P2
          team: backend
        annotations:
          summary: "高延迟"
          description: "服务 {{ $labels.service }} P95延迟超过2秒"
```

#### 11.2.2 告警聚合

```yaml
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 12h
  receiver: 'default'
  
  routes:
    # 严重告警立即通知
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 10s
      repeat_interval: 5m
    
    # 警告告警聚合通知
    - match:
        severity: warning
      receiver: 'warning-alerts'
      group_wait: 30s
      repeat_interval: 30m
    
    # 信息告警批量通知
    - match:
        severity: info
      receiver: 'info-alerts'
      group_wait: 5m
      repeat_interval: 2h
```

#### 11.2.3 告警抑制

```yaml
inhibit_rules:
  # 如果服务宕机，抑制该服务的所有其他告警
  - source_match:
      alertname: 'ServiceDown'
    target_match_re:
      alertname: '(HighErrorRate|HighLatency|HighCPUUsage)'
    equal: ['instance']
  
  # 如果节点宕机，抑制该节点上所有容器的告警
  - source_match:
      alertname: 'NodeDown'
    target_match_re:
      alertname: 'Container.*'
    equal: ['node']
```

### 11.3 可视化优化

#### 11.3.1 仪表板设计原则

1. **关键指标置顶**: 将最重要的指标放在仪表板顶部
2. **合理分组**: 按功能或服务分组展示指标
3. **颜色编码**: 使用一致的颜色方案表示状态
4. **时间范围**: 提供常用时间范围快速切换
5. **变量使用**: 使用变量实现仪表板复用

#### 11.3.2 仪表板变量配置

```json
{
  "templating": {
    "list": [
      {
        "name": "environment",
        "type": "query",
        "datasource": "Prometheus",
        "query": "label_values(up, environment)",
        "includeAll": true,
        "allValue": ".*",
        "multi": false,
        "refresh": 1
      },
      {
        "name": "service",
        "type": "query",
        "datasource": "Prometheus",
        "query": "label_values(http_requests_total{environment=\"$environment\"}, service)",
        "includeAll": true,
        "allValue": ".*",
        "multi": false,
        "refresh": 2
      },
      {
        "name": "instance",
        "type": "query",
        "datasource": "Prometheus",
        "query": "label_values(http_requests_total{environment=\"$environment\",service=\"$service\"}, instance)",
        "includeAll": true,
        "allValue": ".*",
        "multi": true,
        "refresh": 2
      }
    ]
  }
}
```

#### 11.3.3 告警面板配置

```json
{
  "title": "告警状态",
  "type": "alertlist",
  "gridPos": {
    "h": 8,
    "w": 24,
    "x": 0,
    "y": 0
  },
  "options": {
    "alertName": "",
    "dashboardAlerts": false,
    "folder": "",
    "maxItems": 20,
    "sortOrder": 1,
    "stateFilter": {
      "filters": [
        {
          "name": "alerting",
          "state": "alerting"
        },
        {
          "name": "pending",
          "state": "pending"
        }
      ]
    }
  }
}
```

## 十二、故障排查

### 12.1 常见问题

#### 12.1.1 Prometheus无法采集指标

**问题现象**: Prometheus显示target为down状态

**排查步骤**:
1. 检查目标服务是否正常运行
```bash
curl http://target-service:port/metrics
```

2. 检查Prometheus配置
```bash
docker-compose exec prometheus promtool check config /etc/prometheus/prometheus.yml
```

3. 检查网络连通性
```bash
docker-compose exec prometheus ping target-service
```

4. 查看Prometheus日志
```bash
docker-compose logs prometheus | grep "target"
```

**解决方案**:
- 确保目标服务正常运行
- 检查scrape_interval和scrape_timeout配置
- 验证网络策略和防火墙规则
- 检查metrics端点路径是否正确

#### 12.1.2 告警未触发

**问题现象**: 指标超过阈值但告警未触发

**排查步骤**:
1. 检查告警规则配置
```bash
docker-compose exec prometheus promtool check rules /etc/prometheus/alerts/*.yml
```

2. 查看告警状态
```bash
curl http://localhost:9090/api/v1/alerts
```

3. 检查规则评估时间
```bash
curl http://localhost:9090/api/v1/rules
```

**解决方案**:
- 确认for时间是否足够
- 检查告警规则语法
- 验证PromQL查询是否正确
- 检查Alertmanager配置

#### 12.1.3 Grafana无法连接数据源

**问题现象**: Grafana显示数据源连接失败

**排查步骤**:
1. 检查数据源配置
2. 验证网络连通性
3. 查看Grafana日志
```bash
docker-compose logs grafana
```

**解决方案**:
- 检查数据源URL是否正确
- 验证认证配置
- 检查网络策略
- 确认数据源服务正常运行

### 12.2 排查命令

```bash
# Prometheus健康检查
curl http://localhost:9090/-/healthy

# Prometheus配置检查
docker-compose exec prometheus promtool check config /etc/prometheus/prometheus.yml

# 告警规则检查
docker-compose exec prometheus promtool check rules /etc/prometheus/alerts/*.yml

# 查看当前告警
curl http://localhost:9090/api/v1/alerts | jq

# 查看告警规则
curl http://localhost:9090/api/v1/rules | jq

# 查看目标状态
curl http://localhost:9090/api/v1/targets | jq

# 查看Prometheus配置
curl http://localhost:9090/api/v1/status/config | jq

# 查看Prometheus统计信息
curl http://localhost:9090/api/v1/status/tsdbstats | jq

# Alertmanager健康检查
curl http://localhost:9093/-/healthy

# 查看Alertmanager配置
curl http://localhost:9093/api/v1/status/config | jq

# 查看Alertmanager告警
curl http://localhost:9093/api/v1/alerts | jq

# Grafana健康检查
curl http://localhost:3000/api/health

# 查看Grafana数据源
curl -u admin:admin http://localhost:3000/api/datasources | jq

# 查看Grafana仪表板
curl -u admin:admin http://localhost:3000/api/search?query= | jq

# 查看Docker容器状态
docker-compose ps

# 查看容器资源使用
docker stats

# 查看容器日志
docker-compose logs -f prometheus
docker-compose logs -f alertmanager
docker-compose logs -f grafana

# 进入容器调试
docker-compose exec prometheus sh
docker-compose exec alertmanager sh
docker-compose exec grafana sh
```

## 十三、附录

### 13.1 配置文件路径

```
monitoring/
├── prometheus/
│   ├── prometheus.yml          # Prometheus主配置
│   ├── alerts/
│   │   ├── system.yml          # 系统告警规则
│   │   ├── application.yml     # 应用告警规则
│   │   ├── ai_service.yml      # AI服务告警规则
│   │   └── business.yml        # 业务告警规则
│   ├── web.yml                 # Prometheus TLS配置
│   └── certs/                  # TLS证书
│       ├── server.crt
│       └── server.key
├── alertmanager/
│   ├── alertmanager.yml        # Alertmanager配置
│   ├── web.yml                 # Alertmanager TLS配置
│   ├── templates/              # 告警模板
│   │   └── dingtalk.tmpl
│   └── certs/                  # TLS证书
│       ├── server.crt
│       └── server.key
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/        # 数据源配置
│   │   │   └── prometheus.yml
│   │   ├── dashboards/         # 仪表板配置
│   │   │   └── dashboards.yml
│   │   └── alerting/           # 告警通知配置
│   │       └── notification-channels.yml
│   └── dashboards/             # 仪表板JSON
│       ├── system-overview.json
│       ├── application-performance.json
│       └── ai-service.json
├── thanos/
│   ├── objstore.yml            # 对象存储配置
│   └── rules/                  # Thanos规则
├── logstash/
│   ├── pipeline/               # Logstash管道配置
│   │   └── app.conf
│   └── patterns/               # 日志模式
└── docker-compose.yml
```

### 13.2 常用PromQL查询

```promql
# CPU使用率
rate(container_cpu_usage_seconds_total[5m]) * 100

# 内存使用率
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100

# 磁盘使用率
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100

# 网络流量
rate(container_network_receive_bytes_total[5m])
rate(container_network_transmit_bytes_total[5m])

# HTTP请求速率
rate(http_requests_total[5m])

# HTTP错误率
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# HTTP响应时间P95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 数据库连接数
pg_stat_activity_count

# Redis连接数
redis_connected_clients

# 容器重启次数
increase(container_restart_count[1h])

# 服务可用性
avg(up)

# AI请求速率
rate(ai_requests_total[5m])

# AI请求失败率
rate(ai_requests_total{status="failed"}[5m]) / rate(ai_requests_total[5m]) * 100

# AI响应时间P95
histogram_quantile(0.95, rate(ai_request_duration_seconds_bucket[5m]))

# API配额使用率
ai_api_usage / ai_api_quota * 100
```

### 13.3 参考资源

- Prometheus官方文档: https://prometheus.io/docs/
- Grafana官方文档: https://grafana.com/docs/
- Alertmanager官方文档: https://prometheus.io/docs/alerting/latest/alertmanager/
- Thanos官方文档: https://thanos.io/tip/
- Jaeger官方文档: https://www.jaegertracing.io/docs/
- Tempo官方文档: https://grafana.com/docs/tempo/latest/
- OpenTelemetry文档: https://opentelemetry.io/docs/
- ELK Stack文档: https://www.elastic.co/guide/

---

遵循「五高五标五化」要求，确保监控系统的高可用性、高性能、高安全性、高可扩展性和高可维护性。

#### 8.1.1 采集间隔设置

| 指标类型 | 采集间隔 | 说明 |
|----------|----------|------|
| 系统指标 | 15s | CPU、内存、磁盘等 |
| 应用指标 | 15s | HTTP请求、响应时间等 |
| 业务指标 | 30s | 用户注册、AI调用等 |
| 慢查询指标 | 60s | 数据库慢查询等 |

#### 8.1.2 指标命名规范

```
{metric_name}_{unit}

示例:
- http_request_duration_seconds
- http_requests_total
- active_connections
- memory_usage_bytes
```

#### 8.1.3 标签使用规范

```yaml
labels:
  # 服务标签
  service: yyc3-main
  environment: production
  cluster: yyc3-xy-ai
  
  # 实例标签
  instance: 192.168.1.100:1229
  job: yyc3-main-app
  
  # 业务标签
  method: GET
  route: /api/users
  status_code: 200
```

### 8.2 告警策略优化

#### 8.2.1 告警级别定义

| 级别 | 响应时间 | 通知渠道 | 示例 |
|------|----------|----------|------|
| Critical | 5分钟 | 电话+短信+邮件 | 服务宕机、数据库不可用 |
| Warning | 30分钟 | 邮件+IM | 高CPU、高内存 |
| Info | 1小时 | 邮件 | 配额即将耗尽 |

#### 8.2.2 告警抑制规则

```yaml
inhibit_rules:
  # 如果服务宕机，抑制该服务的所有其他告警
  - source_match:
      alertname: 'ContainerDown'
    target_match_re:
      service: '.+'
    equal: ['service', 'instance']
  
  # 如果节点宕机，抑制该节点上所有容器的告警
  - source_match:
      alertname: 'NodeDown'
    target_match_re:
      instance: '.+'
    equal: ['node']
```

#### 8.2.3 告警静默规则

```bash
# 创建静默规则
amtool silence add \
  --author="admin" \
  --comment="维护窗口" \
  "service=yyc3-main" \
  "severity=~warning|info"

# 查看静默规则
amtool silence query

# 删除静默规则
amtool silence expire <silence-id>
```

### 8.3 可视化优化

#### 8.3.1 仪表板设计原则

1. **分层展示**: 系统层 → 应用层 → 业务层
2. **关键指标优先**: 最重要的指标放在顶部
3. **合理分组**: 相关指标放在同一面板
4. **颜色编码**: 使用颜色表示状态（绿色正常，红色异常）

#### 8.3.2 查询优化

```promql
# 使用rate计算速率
rate(http_requests_total[5m])

# 使用histogram_quantile计算分位数
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 使用increase计算增长
increase(http_requests_total[1h])

# 使用预测
predict_linear(http_requests_total[1h], 3600)
```

## 九、故障排查

### 9.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 指标采集失败 | 端口不可达 | 检查网络配置和防火墙 |
| 告警未触发 | 规则配置错误 | 检查PromQL表达式 |
| 仪表板无数据 | 数据源配置错误 | 检查Grafana数据源配置 |
| 日志未收集 | Logstash配置错误 | 检查Logstash输入输出配置 |

### 9.2 排查命令

```bash
# 查看Prometheus目标状态
curl http://localhost:9090/api/v1/targets

# 查看告警规则
curl http://localhost:9090/api/v1/rules

# 查看告警状态
curl http://localhost:9090/api/v1/alerts

# 查看Prometheus日志
docker-compose logs prometheus

# 查看Alertmanager日志
docker-compose logs alertmanager

# 查看Grafana日志
docker-compose logs grafana
```

## 十、附录

### 10.1 配置文件路径

```
monitoring/
├── prometheus.yml          # Prometheus主配置
├── alerts/                 # 告警规则目录
│   ├── system.yml         # 系统告警规则
│   ├── application.yml    # 应用告警规则
│   └── ai_service.yml     # AI服务告警规则
├── alertmanager.yml       # Alertmanager配置
├── grafana/               # Grafana配置
│   ├── datasources/       # 数据源配置
│   └── dashboards/        # 仪表板配置
└── logging/               # 日志配置
    └── logstash.conf      # Logstash配置
```

### 10.2 常用PromQL查询

```promql
# CPU使用率
rate(container_cpu_usage_seconds_total[5m]) * 100

# 内存使用率
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100

# HTTP请求速率
rate(http_requests_total[5m])

# HTTP错误率
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# P95响应时间
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# 数据库连接数
pg_stat_activity_count

# Redis连接数
redis_connected_clients

# 磁盘使用率
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100
```

### 10.3 参考资源

- [Prometheus官方文档](https://prometheus.io/docs/)
- [Grafana官方文档](https://grafana.com/docs/)
- [Alertmanager文档](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [ELK Stack文档](https://www.elastic.co/guide/)

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

**YYC³ AI小语智能成长守护系统 - 监控告警配置实战指南**

遵循「五高五标五化」要求，确保监控系统的高可用性、高性能、高安全性、高可扩展性和高可维护性。
