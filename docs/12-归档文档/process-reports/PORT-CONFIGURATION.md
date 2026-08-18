# YYC³ 小语AI智能成长守护系统 - 端口配置说明

> ***YanYuCloudCube***
> **标语**：言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> **标语**：万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

## 📋 文档信息

| 属性 | 内容 |
|------|------|
| **文档标题** | YYC³ 小语AI智能成长守护系统 - 端口配置说明 |
| **文档版本** | v1.0.0 |
| **创建时间** | 2026-01-19 |
| **适用范围** | YYC³ 小语AI智能成长守护系统 |
| **目的** | 明确项目中所有端口配置，确保端口使用规范 |

---

## 📋 文档概述

本文档详细说明YYC³ 小语AI智能成长守护系统的所有端口配置，明确各服务的端口用途和配置方式，确保端口使用符合项目规范和避免端口冲突。

---

## 🚀 端口配置总览

### 主应用端口

| 服务名称 | 端口 | 配置位置 | 环境变量 | 说明 |
|---------|------|----------|-----------|------|
| **Next.js 主应用** | **1228** | package.json | PORT | YYC³ 小语AI主应用端口，项目特定端口 |

### 微服务端口

| 服务名称 | 端口 | 配置位置 | 环境变量 | 说明 |
|---------|------|----------|-----------|------|
| **API 网关** | 1229 | services/gateway/APIGateway.ts | API_GATEWAY_PORT | API网关服务端口 |
| **服务编排器** | 3001, 3002 | services/orchestrator/ServiceOrchestrator.ts | TOOL_SERVICE_PORT, KNOWLEDGE_SERVICE_PORT | 工具服务和知识服务端口 |
| **本地AI网关** | 8081 | services/ai/LocalAIGateway.ts | PORT | 本地AI服务网关端口 |
| **用户服务** | 8001 | microservices/user-service/src/index.ts | PORT | 用户微服务端口 |
| **后端服务** | 3000 | backend/src/index.ts | PORT | 后端API服务端口 |

---

## 📝 端口配置详解

### 1. Next.js 主应用端口（1228）

**配置位置**：[package.json](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/package.json#L18-L23)

```json
{
  "scripts": {
    "dev": "next dev -p 1228",
    "start": "next start -p 1228",
    "dev:next": "next dev -p 1228",
    "start:next": "next start -p 1228"
  }
}
```

**说明**：
- **端口**：1228
- **用途**：Next.js主应用开发和生产服务器
- **配置方式**：通过package.json脚本和环境变量PORT
- **项目特定性**：1228是YYC³小语AI项目的特定端口，已确认无冲突

**环境变量配置**：
```env
PORT=1228
```

---

### 2. API 网关端口（1229）

**配置位置**：[services/gateway/APIGateway.ts](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/services/gateway/APIGateway.ts#L46)

```typescript
const server = createServer(router, {
  port: process.env.API_GATEWAY_PORT || 1229,
});
```

**说明**：
- **端口**：1229
- **用途**：API网关服务，统一入口
- **配置方式**：通过环境变量API_GATEWAY_PORT
- **默认值**：1229

**环境变量配置**：
```env
API_GATEWAY_PORT=1229
```

---

### 3. 服务编排器端口（3001, 3002）

**配置位置**：[services/orchestrator/ServiceOrchestrator.ts](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/services/orchestrator/ServiceOrchestrator.ts#L188-L207)

```typescript
const toolService = createServer(toolRouter, {
  port: process.env.TOOL_SERVICE_PORT || 3001,
});

const knowledgeService = createServer(knowledgeRouter, {
  port: process.env.KNOWLEDGE_SERVICE_PORT || 3002,
});
```

**说明**：
- **端口**：3001（工具服务）、3002（知识服务）
- **用途**：服务编排器，管理多个微服务
- **配置方式**：通过环境变量TOOL_SERVICE_PORT和KNOWLEDGE_SERVICE_PORT
- **默认值**：3001、3002

**环境变量配置**：
```env
TOOL_SERVICE_PORT=3001
KNOWLEDGE_SERVICE_PORT=3002
```

---

### 4. 本地AI网关端口（8081）

**配置位置**：[services/ai/LocalAIGateway.ts](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/services/ai/LocalAIGateway.ts#L15)

```typescript
const PORT = parseInt(process.env.PORT || '8081');
```

**说明**：
- **端口**：8081
- **用途**：本地AI服务网关
- **配置方式**：通过环境变量PORT
- **默认值**：8081

**环境变量配置**：
```env
PORT=8081
```

---

### 5. 用户服务端口（8001）

**配置位置**：[microservices/user-service/src/index.ts](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/microservices/user-service/src/index.ts#L51)

```typescript
const PORT = Number(process.env.PORT) || 8001;
```

**说明**：
- **端口**：8001
- **用途**：用户微服务
- **配置方式**：通过环境变量PORT
- **默认值**：8001

**环境变量配置**：
```env
PORT=8001
```

---

### 6. 后端服务端口（3000）

**配置位置**：[backend/src/index.ts](file:///Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-ai/backend/src/index.ts#L20)

```typescript
const PORT = process.env.PORT || 3000;
```

**说明**：
- **端口**：3000
- **用途**：后端API服务
- **配置方式**：通过环境变量PORT
- **默认值**：3000

**环境变量配置**：
```env
PORT=3000
```

---

## ✅ 端口配置规范确认

### YYC³ 端口使用规范

根据YYC³团队标准化规范：

- **默认端口范围**：3200-3500（推荐所有新项目使用此范围）
- **限用端口范围**：3000-3199（仅用于特殊项目和遗留系统）

### 本项目端口配置说明

**YYC³ 小语AI智能成长守护系统**的端口配置情况：

| 端口 | 使用状态 | 说明 |
|------|---------|------|
| **1228** | ✅ **已确认** | YYC³ 小语AI主应用端口，项目特定端口，无冲突 |
| 1229 | ✅ **已确认** | API网关服务端口，与主应用端口相邻，无冲突 |
| 3000 | ⚠️ **限用范围** | 后端服务端口，属于限用范围（3000-3199） |
| 3001 | ⚠️ **限用范围** | 工具服务端口，属于限用范围（3000-3199） |
| 3002 | ⚠️ **限用范围** | 知识服务端口，属于限用范围（3000-3199） |
| 8001 | ✅ **已确认** | 用户微服务端口，无冲突 |
| 8081 | ✅ **已确认** | 本地AI网关端口，无冲突 |

**结论**：
- **主应用端口1228**：已确认为项目特定端口，不识别为问题项
- **限用范围端口（3000-3002）**：属于限用范围，但为遗留系统端口，已确认无冲突

---

## 🔧 端口配置最佳实践

### 1. 环境变量配置

**创建 `.env.local` 文件**：
```env
# 主应用端口
PORT=1228

# API网关端口
API_GATEWAY_PORT=1229

# 服务编排器端口
TOOL_SERVICE_PORT=3001
KNOWLEDGE_SERVICE_PORT=3002

# 本地AI网关端口
LOCAL_AI_GATEWAY_PORT=8081

# 用户服务端口
USER_SERVICE_PORT=8001

# 后端服务端口
BACKEND_SERVICE_PORT=3000
```

### 2. 端口冲突检查

**启动服务前检查端口占用**：
```bash
# 检查端口1228是否被占用
lsof -i :1228

# 检查端口1229是否被占用
lsof -i :1229

# 检查所有项目端口
lsof -i :1228,1229,3000,3001,3002,8001,8081
```

### 3. Docker端口映射

**docker-compose.yml 配置**：
```yaml
version: '3.8'

services:
  app:
    ports:
      - "1228:1228"
    environment:
      - PORT=1228

  api-gateway:
    ports:
      - "1229:1229"
    environment:
      - API_GATEWAY_PORT=1229

  backend:
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
```

---

## 📊 端口使用监控

### 监控脚本

**创建端口监控脚本**：`scripts/monitor-ports.sh`

```bash
#!/bin/bash

echo "🔍 YYC³ 小语AI 端口监控"
echo "================================"

PORTS=(1228 1229 3000 3001 3002 8001 8081)

for port in "${PORTS[@]}"; do
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ 端口 $port: 运行中"
  else
    echo "❌ 端口 $port: 未运行"
  fi
done

echo "================================"
echo "监控完成"
```

**使用方法**：
```bash
chmod +x scripts/monitor-ports.sh
./scripts/monitor-ports.sh
```

---

## 🚨 端口冲突处理

### 冲突检测流程

1. **检测冲突**：使用`lsof`命令检测端口占用
2. **确认服务**：确认占用端口的服务是否为YYC³项目服务
3. **处理冲突**：
   - 如果是YYC³服务，检查服务状态
   - 如果是其他服务，修改端口配置或停止冲突服务

### 冲突解决方案

**方案1：修改端口配置**
```env
# 修改环境变量中的端口配置
PORT=3200  # 修改为推荐范围内的端口
```

**方案2：停止冲突服务**
```bash
# 查找占用端口的进程PID
lsof -i :1228

# 停止进程
kill -9 <PID>
```

---

## 📝 端口配置文档更新

### 更新记录

| 日期 | 版本 | 更新内容 | 更新人 |
|------|------|---------|--------|
| 2026-01-19 | v1.0.0 | 初始版本，确认所有端口配置 | YYC³ 审计团队 |

---

## 📞 联系方式

### 项目信息

- **项目名称**：小语AI智能成长守护系统
- **Git仓库**：<https://github.com/YY-Nexus/yyc3-xyai.git>
- **管理员邮箱**：<admin@0379.email>
- **项目版本**：v2.0.0

---

## 📄 许可证

本项目采用MIT许可证。详细信息请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">

**[⬆ 回到顶部](#yyc³-小语ai智能成长守护系统---端口配置说明)**

Made with ❤️ by YYC³ Development Team

</div>

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
