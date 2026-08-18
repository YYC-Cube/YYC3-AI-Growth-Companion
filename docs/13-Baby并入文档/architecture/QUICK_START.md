# 快速启动指南

> 小语智能成长守护系统 - P2功能完整版

---

## 🚀 快速启动（基础模式）

**无需任何外部依赖，5分钟启动应用**

```bash
# 1. 配置环境变量
cp env.development .env

# 2. 安装依赖（已完成）
cd apps/server
# npm install  # 已执行

# 3. 启动后端
npm run dev

# 4. 启动前端（新终端窗口）
cd ../web
npm run dev
```

**访问应用**:
- 前端: http://localhost:5173
- 后端: http://localhost:4000
- 健康检查: http://localhost:4000/api/health
- Prometheus指标: http://localhost:4000/metrics

---

## 🔍 完整监控模式（ELK + Jaeger）

**需要Docker，启动完整的监控和可观测性功能**

### 步骤1: 启动ELK日志聚合栈

```bash
# 启动Elasticsearch, Logstash, Kibana
docker-compose -f docker-compose.logging.yml up -d

# 等待服务就绪（约30-60秒）
docker-compose -f docker-compose.logging.yml ps

# 检查Elasticsearch健康状态
curl http://localhost:9200/_cluster/health
```

**ELK服务端口**:
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601
- Logstash: http://localhost:5044

---

### 步骤2: 启动Jaeger分布式追踪（可选）

```bash
docker run -d \
  -p 4318:4318 \
  -p 16686:16686 \
  --name jaeger \
  jaegertracing/all-in-one:latest
```

**Jaeger服务端口**:
- OTLP接收端点: http://localhost:4318
- Jaeger UI: http://localhost:16686

---

### 步骤3: 启用完整监控

编辑 `.env` 文件:

```env
# 启用所有监控功能
ENABLE_METRICS=true
ENABLE_TRACING=true
ENABLE_LOG_AGGREGATION=true

# 其他配置保持不变
```

---

### 步骤4: 启动应用

```bash
# 后端
cd apps/server
npm run dev

# 前端（新终端）
cd apps/web
npm run dev
```

---

### 步骤5: 访问监控界面

1. **Kibana (日志查看)**
   - URL: http://localhost:5601
   - 首次访问需要创建索引模式: `xiaoyu-ai-logs-*`

2. **Jaeger (分布式追踪)**
   - URL: http://localhost:16686
   - 选择服务: `xiaoyu-ai`

3. **Prometheus指标**
   - URL: http://localhost:4000/metrics
   - 查看实时性能指标

4. **日志API查询**
   ```bash
   # 搜索错误日志
   curl "http://localhost:4000/api/logs/search?level=error&size=10"
   
   # 日志统计
   curl "http://localhost:4000/api/logs/stats"
   
   # 健康检查
   curl "http://localhost:4000/api/logs/health"
   ```

---

## 🐳 Kubernetes生产部署

### 前置条件

- Kubernetes集群（1.20+）
- kubectl已配置
- Docker镜像仓库访问权限

### 步骤1: 构建Docker镜像

```bash
# 后端镜像
cd apps/server
docker build -t xiaoyu-ai/server:latest .
docker tag xiaoyu-ai/server:latest your-registry/xiaoyu-ai/server:latest
docker push your-registry/xiaoyu-ai/server:latest

# 前端镜像
cd apps/web
docker build -t xiaoyu-ai/web:latest .
docker tag xiaoyu-ai/web:latest your-registry/xiaoyu-ai/web:latest
docker push your-registry/xiaoyu-ai/web:latest
```

### 步骤2: 配置Secret

```bash
# 复制Secret模板
cp k8s/secret.yaml.example k8s/secret.yaml

# 编辑Secret文件，填入实际值
vim k8s/secret.yaml
```

### 步骤3: 部署到Kubernetes

```bash
# 使用自动化脚本
./scripts/deploy-k8s.sh production

# 或手动部署
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 步骤4: 验证部署

```bash
# 查看Pod状态
kubectl get pods -n xiaoyu-ai

# 查看Service
kubectl get services -n xiaoyu-ai

# 查看Ingress
kubectl get ingress -n xiaoyu-ai

# 查看日志
kubectl logs -f deployment/xiaoyu-ai-server -n xiaoyu-ai
```

---

## 📊 功能特性

### 已实现的P2功能

#### 1. ELK日志聚合 ✅
- 自动收集应用日志
- Elasticsearch存储和索引
- Kibana可视化和查询
- 日志API（搜索、统计、健康检查）
- 批量写入优化
- 错误重试机制

#### 2. Kubernetes部署配置 ✅
- 完整的K8s部署配置
- 自动扩缩容（HPA）
- 健康检查和探针
- ConfigMap和Secret管理
- Ingress路由配置
- 持久化存储（PVC）
- Docker多阶段构建

---

## 📚 文档索引

### 核心文档

1. **项目概览**
   - `docs/00-PROJECT_OVERVIEW.md` - 完整项目说明

2. **环境配置**
   - `docs/03-ENVIRONMENT_VARIABLES.md` - 环境变量详解
   - `docs/ENVIRONMENT_SYNC_COMPLETE.md` - 配置同步报告

3. **监控和可观测性**
   - `docs/ELK_LOG_AGGREGATION_SETUP.md` - ELK设置指南
   - `docs/KUBERNETES_DEPLOYMENT_GUIDE.md` - K8s部署指南
   - `docs/P2_FEATURES_COMPLETE.md` - P2功能完成报告

4. **技术栈**
   - `docs/01-TECH_STACK.md` - 技术栈说明

---

## 🛠️ 故障排查

### 依赖安装失败

```bash
# 清理缓存重试
cd apps/server
rm -rf node_modules package-lock.json
npm install
```

### ELK服务启动失败

```bash
# 检查Docker状态
docker-compose -f docker-compose.logging.yml ps

# 查看日志
docker-compose -f docker-compose.logging.yml logs elasticsearch
docker-compose -f docker-compose.logging.yml logs kibana

# 重启服务
docker-compose -f docker-compose.logging.yml restart
```

### 日志未写入Elasticsearch

1. 检查 `.env` 配置: `ENABLE_LOG_AGGREGATION=true`
2. 检查Elasticsearch连接: `curl http://localhost:4000/api/logs/health`
3. 查看应用日志中的错误信息

### Kubernetes部署失败

```bash
# 检查Pod状态
kubectl describe pod <pod-name> -n xiaoyu-ai

# 查看Pod日志
kubectl logs <pod-name> -n xiaoyu-ai

# 检查Event
kubectl get events -n xiaoyu-ai --sort-by='.lastTimestamp'
```

---

## 💡 提示和技巧

### 1. 开发环境推荐配置

**最小配置**（快速开发）:
```env
ENABLE_METRICS=true
ENABLE_TRACING=false
ENABLE_LOG_AGGREGATION=false
```

**完整配置**（调试监控）:
```env
ENABLE_METRICS=true
ENABLE_TRACING=true
ENABLE_LOG_AGGREGATION=true
```

### 2. 性能优化建议

- 开发环境关闭追踪和日志聚合（减少依赖）
- 生产环境启用所有监控（完整可观测性）
- 根据日志量调整 `LOG_BUFFER_SIZE` 和 `LOG_FLUSH_INTERVAL`

### 3. 安全建议

- 不要将 `.env` 和 `k8s/secret.yaml` 提交到版本控制
- 生产环境使用强密码和密钥
- 启用Elasticsearch安全认证
- 配置Kubernetes RBAC和NetworkPolicy

---

## 🎯 下一步

1. ✅ **P0-P2功能已完成** - 核心功能和中优先级功能
2. ⏳ **P3功能** - 低优先级/探索性功能
3. ⏳ **P4功能** - 长期规划功能

详见: `docs/UNIMPLEMENTED_FEATURES_IMPLEMENTATION_PLAN.md`

---

## 📞 支持和反馈

如有问题或建议，请参考相关文档或查看代码注释。

---

**版本**: v1.0.0  
**最后更新**: 2024年11月26日  
**P2完成度**: 100% ✅
