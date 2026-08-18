# YYC³ 智能插拔式移动AI系统

<div align="center">

![YYC³ Logo](https://img.shields.io/badge/YYC³-智能插拔式移动AI系统-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Bun](https://img.shields.io/badge/runtime-Bun-black?style=for-the-badge)

**Intelligent Pluggable Mobile AI System**

基于事件驱动+目标驱动混合架构的智能插拔式移动AI系统，支持动态工具注册、知识库管理、多模态AI交互和微服务部署。

[快速开始](#快速开始) • [功能特性](#功能特性) • [系统架构](#系统架构) • [API文档](#api文档) • [部署指南](#部署指南)

</div>

## 📋 目录

- [项目概述](#项目概述)
- [功能特性](#功能特性)
- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [部署指南](#部署指南)
- [API文档](#api文档)
- [配置说明](#配置说明)
- [监控与运维](#监控与运维)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 🎯 项目概述

YYC³智能插拔式移动AI系统是一个现代化的、可扩展的AI服务平台，采用微服务架构和容器化部署，提供：

- **智能拖拽AI组件** - 支持React DnD的可拖拽AI助手
- **事件驱动核心引擎** - 混合事件驱动和目标驱动架构
- **动态工具生态** - 自动工具发现与注册系统
- **RAG知识库** - 向量存储和检索增强生成
- **多模态交互** - 文本、语音、图像、文件全支持
- **微服务架构** - 完整的服务编排和API网关
- **实时学习系统** - 三层学习架构（行为、策略、知识）

## ✨ 功能特性

### 🤖 智能AI助手

- **拖拽式界面** - 基于React DnD的智能组件
- **多视图切换** - 对话、工具、洞察多模式
- **位置优化** - 自动最佳位置计算
- **实时任务监控** - 动态任务状态跟踪

### 🧠 核心系统引擎

- **AgenticCore** - 事件驱动+目标驱动混合架构
- **ServiceOrchestrator** - 微服务编排与协调
- **GoalManagementSystem** - 目标生命周期管理
- **MetaLearningSystem** - 三层智能学习架构

### 🛠️ 工具与知识系统

- **ToolManager** - 动态工具发现与注册
- **KnowledgeManager** - RAG知识库管理
- **APIGateway** - 统一API网关与负载均衡
- **向量数据库** - 高效相似度搜索

### 🎨 多模态交互

- **文本对话** - 智能回复与上下文理解
- **语音识别** - 实时语音转文字
- **图像处理** - 视觉内容理解与分析
- **文件上传** - 多格式文件智能处理

### 🏗️ 基础设施

- **容器化部署** - Docker + Docker Compose
- **微服务架构** - 服务发现与健康检查
- **实时通信** - WebSocket双向通信
- **监控告警** - Prometheus + Grafana + Jaeger

## 🏗️ 系统架构

```mermaid
graph TB
    subgraph "前端层"
        A[智能AI组件] --> B[React应用]
        B --> C[拖拽界面]
    end

    subgraph "API网关层"
        D[API Gateway] --> E[负载均衡]
        D --> F[认证授权]
        D --> G[限流熔断]
    end

    subgraph "服务层"
        H[AgenticCore] --> I[事件处理]
        J[ToolManager] --> K[工具注册]
        L[KnowledgeManager] --> M[RAG检索]
        N[GoalManager] --> O[目标管理]
        P[MetaLearning] --> Q[学习系统]
    end

    subgraph "数据层"
        R[PostgreSQL] --> S[关系数据]
        T[Redis] --> U[缓存会话]
        V[Elasticsearch] --> W[搜索索引]
        X[VectorDB] --> Y[向量存储]
    end

    A --> D
    D --> H
    D --> J
    D --> L
    D --> N
    D --> P

    H --> R
    J --> T
    L --> V
    L --> X
    N --> R
    P --> R
```

### 核心组件

| 组件 | 功能 | 状态 |
|------|------|------|
| **AgenticCore** | 事件驱动核心引擎 | ✅ 完成 |
| **ServiceOrchestrator** | 服务编排管理 | ✅ 完成 |
| **ToolManager** | 工具注册发现 | ✅ 完成 |
| **KnowledgeManager** | RAG知识库 | ✅ 完成 |
| **APIGateway** | 统一API网关 | ✅ 完成 |
| **IntelligentWidget** | 智能拖拽组件 | ✅ 完成 |
| **EnhancedAIGirl** | 增强AI助手 | ✅ 完成 |

## 🛠️ 技术栈

### 前端技术

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **TailwindCSS** - 原子化CSS框架
- **React DnD** - 拖拽功能库
- **Framer Motion** - 动画库
- **Radix UI** - 无样式组件库

### 后端技术

- **Bun** - 高性能JavaScript运行时
- **Node.js** - 服务端JavaScript
- **Hono** - 轻量级Web框架
- **Socket.io** - 实时通信
- **PostgreSQL** - 关系型数据库
- **Redis** - 内存数据库
- **Elasticsearch** - 搜索引擎

### AI/ML技术

- **OpenAI API** - GPT模型集成
- **Anthropic API** - Claude模型
- **向量数据库** - 语义搜索
- **RAG架构** - 检索增强生成
- **语音识别** - Azure Speech Services

### 基础设施

- **Docker** - 容器化技术
- **Docker Compose** - 容器编排
- **Nginx** - 反向代理
- **Prometheus** - 监控指标
- **Grafana** - 数据可视化
- **Jaeger** - 分布式追踪

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0
- **Docker** >= 20.0.0
- **Docker Compose** >= 2.0.0

### 一键部署

```bash
# 克隆项目
git clone https://github.com/YY-Nexus/yyc3-xy-05.git
cd yyc3-xy-05

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入必要的配置

# 一键部署
chmod +x deploy.sh
./deploy.sh deploy
```

### 开发环境启动

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

### 访问地址

- **主应用**: <http://localhost:3000> (Next.js应用)
- **API网关**: <http://localhost:1229>
- **Nginx代理**: <http://localhost>
- **监控面板**: <http://localhost:3001> (admin/admin123)
- **Prometheus**: <http://localhost:9090>
- **Jaeger追踪**: <http://localhost:16686>

## 📖 开发指南

### 项目结构

```
yyc3-xy-ai/
├── components/         # React组件
│   ├── ai-widget/      # 智能AI组件
│   └── ai-xiaoyu/      # 小语AI助手
├── core/               # 核心引擎
├── services/           # 后端服务
│   ├── gateway/        # API网关
│   ├── knowledge/      # 知识库
│   ├── learning/       # 学习系统
│   ├── orchestrator/   # 服务编排
│   ├── prediction/     # 预测服务
│   └── tools/          # 工具管理
├── src/                # Next.js源代码
│   ├── contexts/       # React上下文
│   └── pages/          # 页面组件
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── hooks/              # React Hooks
├── config/             # 配置文件
├── docs/               # 文档
│   ├── architecture/   # 架构文档
│   ├── audit/          # 审计报告
│   ├── overview/       # 项目概述
│   ├── planning/       # 开发计划
│   ├── team/           # 团队规范
│   ├── user/           # 用户文档
│   └── others/         # 其他文档
├── scripts/            # 脚本文件
├── public/             # 静态资源
└── microservices/      # 微服务
```

### 开发工作流

1. **功能开发**

   ```bash
   # 创建功能分支
   git checkout -b feature/new-feature

   # 开发和测试
   bun run dev
   bun test
   ```

2. **代码质量**

   ```bash
   # 类型检查
   bun run type-check

   # 代码检查
   bun run lint

   # 代码格式化
   bun run format
   ```

3. **构建部署**

   ```bash
   # 构建
   bun run build

   # 部署
   ./deploy.sh deploy
   ```

### 组件开发

#### 创建新的AI工具

```typescript
// services/tools/example-tool.ts
import { Tool, ToolResult } from '@/types/tools';

export class ExampleTool implements Tool {
  id = 'example-tool';
  name = '示例工具';
  description = '这是一个示例工具';
  version = '1.0.0';

  async execute(input: any): Promise<ToolResult> {
    // 工具执行逻辑
    return {
      success: true,
      data: '处理结果',
      metadata: {}
    };
  }

  async validate(input: any): Promise<boolean> {
    // 输入验证逻辑
    return true;
  }
}
```

#### 注册工具

```typescript
// services/tools/ToolManager.ts
import { ExampleTool } from './example-tool';

const toolManager = new ToolManager();
await toolManager.registerTool(new ExampleTool());
```

## 📦 部署指南

### 生产环境部署

1. **服务器要求**
   - CPU: 4核心以上
   - 内存: 8GB以上
   - 存储: 100GB以上
   - 网络: 100Mbps以上

2. **部署步骤**

   ```bash
   # 克隆代码
   git clone https://github.com/YY-Nexus/yyc3-xy-05.git
   cd yyc3-xy-05

   # 配置环境变量
   cp .env.example .env.local
   # 编辑配置文件

   # 部署服务
   ./deploy.sh deploy
   ```

3. **SSL配置**

   ```bash
   # 将SSL证书放置到配置目录
   mkdir -p config/nginx/ssl
   cp your-cert.pem config/nginx/ssl/cert.pem
   cp your-key.pem config/nginx/ssl/key.pem
   ```

### 监控配置

系统集成了完整的监控方案：

- **Prometheus** - 指标收集
- **Grafana** - 数据可视化
- **Jaeger** - 分布式追踪
- **ELK Stack** - 日志管理

访问监控面板：

- Grafana: <http://your-domain:3001>
- Prometheus: <http://your-domain:9090>
- Jaeger: <http://your-domain:16686>
- Kibana: <http://your-domain:5601>

## 📚 API文档

### 核心API端点

#### 健康检查

```http
GET /api/health
```

#### AI对话

```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "用户消息",
  "context": "对话上下文",
  "mode": "chat|voice|image"
}
```

#### 工具调用

```http
POST /api/tools/{toolId}/execute
Content-Type: application/json

{
  "input": "工具输入参数",
  "options": {}
}
```

#### 知识检索

```http
POST /api/knowledge/search
Content-Type: application/json

{
  "query": "搜索查询",
  "limit": 10,
  "threshold": 0.7
}
```

### WebSocket事件

#### 连接建立

```javascript
const socket = io('ws://localhost:1229');

// 监听AI回复
socket.on('ai-response', (data) => {
  console.log('AI回复:', data.message);
});

// 发送用户消息
socket.emit('user-message', {
  message: '用户输入',
  timestamp: Date.now()
});
```

## ⚙️ 配置说明

### 环境变量配置

主要配置项说明：

```bash
# 系统基础配置
NODE_ENV=development
PORT=1229

# AI服务配置
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 数据库配置
DATABASE_URL=postgresql://user:pass@localhost:5432/yyc3_ai
REDIS_URL=redis://localhost:6379

# 向量数据库
VECTOR_DB_URL=http://localhost:6333
VECTOR_DIMENSION=1536
```

完整配置参考 `.env.example` 文件。

### 服务配置

各服务的详细配置：

- **API网关**: 负载均衡、限流、认证
- **数据库**: PostgreSQL连接池、Redis集群
- **监控**: Prometheus指标、Grafana仪表板
- **日志**: 结构化日志、集中收集

## 📊 监控与运维

### 关键指标

- **系统性能**: CPU、内存、磁盘、网络
- **应用指标**: 请求量、响应时间、错误率
- **业务指标**: AI调用次数、工具使用率
- **数据库**: 连接数、查询性能、缓存命中率

### 告警规则

系统预设了以下告警规则：

- 服务不可用
- 响应时间过长
- 错误率过高
- 资源使用率过高
- 数据库连接异常

### 日志管理

日志级别和输出配置：

```typescript
// 日志配置示例
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **报告问题** - 提交Issue报告bug或提出建议
2. **功能开发** - Fork项目并提交Pull Request
3. **文档改进** - 完善文档和示例
4. **测试覆盖** - 增加单元测试和集成测试

### 开发流程

1. Fork项目到个人仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交Pull Request

### 代码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier配置
- 编写单元测试覆盖新功能
- 添加适当的注释和文档

## 📄 许可证

本项目基于 [MIT许可证](LICENSE) 开源。

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/) - 用户界面框架
- [Bun](https://bun.sh/) - 高性能JavaScript运行时
- [Docker](https://www.docker.com/) - 容器化技术
- [OpenAI](https://openai.com/) - AI模型服务
- [PostgreSQL](https://www.postgresql.org/) - 关系型数据库

## 📞 联系我们

- **项目主页**: <https://github.com/YY-Nexus/yyc3-xy-05>
- **问题反馈**: <https://github.com/YY-Nexus/yyc3-xy-05/issues>
- **邮箱**: <admin@0379.email>
- **官网**: <https://yyc3.ai>

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！**

Made with ❤️ by YYC³ Team

</div>
