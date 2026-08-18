---
@file: YYC3-XY-架构类-智能架构设计文档.md
@description: YYC³ AI小语智能成长守护系统的智能架构设计，包含本地AI模型集成、RAG知识增强、服务接口设计和性能优化策略
@author: YYC³
@version: v1.0.0
@created: 2025-12-24
@updated: 2025-12-28
@status: approved
@tags: AI服务,架构设计,集成架构,本地AI,RAG,智能架构
---

# YYC³-XY 架构类 - 智能架构设计文档

## 1. 文档概述

### 1.1 文档目的

本文档详细描述YYC³-XY智能成长守护系统的智能架构设计，包括本地AI模型集成、RAG知识增强、服务接口设计和性能优化策略，为开发和维护团队提供技术指导。

### 1.2 适用范围

本文档适用于YYC³-XY系统的AI服务开发、集成和维护人员。

### 1.3 参考文档

- YYC³-XY总体架构设计文档
- YYC³-XY微服务架构设计文档
- YYC³-XY数据架构详细设计文档
- YYC³-XY接口架构设计文档

## 2. 智能架构概述

### 2.1 架构总览

YYC³-XY系统采用分层智能架构，包括基础设施层、数据层、服务层、接口层和应用层，实现本地AI能力与知识增强的深度融合。

```
┌─────────────────────────────────────────────────────────────┐
│                        应用层                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ 智能对话  │  │ 学习规划  │  │ 知识问答  │  │ 任务管理  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        接口层                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         LocalAIGateway (Hono API Gateway)            │  │
│  │  /api/chat  /api/rag  /api/knowledge  /api/models    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        服务层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ OllamaService│  │  RAGEngine   │  │KnowledgeMgr  │     │
│  │  本地AI推理   │  │  知识增强    │  │  知识库管理   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Ollama API  │  │  ChromaDB    │  │  PostgreSQL  │     │
│  │  模型服务    │  │  向量数据库   │  │  业务数据    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      基础设施层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Docker容器  │  │  Redis缓存   │  │  监控告警    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件名称 | 主要功能 | 技术选型 | 端口 |
|----------|----------|----------|------|
| LocalAIGateway | AI服务网关，统一接口 | Hono | 1229 |
| OllamaService | 本地AI模型管理与推理 | Ollama | 11434 |
| RAGEngine | 知识检索与增强生成 | ChromaDB | 8000 |
| KnowledgeManager | 知识库管理 | TypeScript | - |

### 2.3 设计原则

遵循「五高五标五化」要求：

**五高 (Five Highs)**:
- 高可用：多实例部署，健康检查，自动恢复
- 高性能：模型缓存，并发处理，响应优化
- 高安全：请求验证，数据加密，访问控制
- 高扩展：插件化设计，服务解耦，水平扩展
- 高维护：日志完善，监控全面，文档齐全

**五标 (Five Standards)**:
- 标准化：统一接口规范，代码规范，文档规范
- 规范化：流程规范，数据规范，测试规范
- 自动化：自动部署，自动测试，自动监控
- 智能化：智能调度，智能优化，智能推荐
- 可视化：监控可视化，日志可视化，数据可视化

**五化 (Five Transformations)**:
- 流程化：标准化流程，流程自动化
- 文档化：全链路文档，文档版本管理
- 工具化：开发工具，运维工具，监控工具
- 数字化：数据驱动，智能决策
- 生态化：开放接口，生态集成

## 3. 核心组件设计

### 3.1 LocalAIGateway - AI服务网关

#### 3.1.1 组件定位

LocalAIGateway是AI服务的统一入口，负责请求路由、参数验证、服务编排和响应处理。

#### 3.1.2 架构设计

```typescript
// services/ai/LocalAIGateway.ts 核心架构

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// 中间件配置
app.use('*', cors());
app.use('*', logger());

// 核心端点
app.post('/api/chat', async (c) => {
  // AI聊天端点
});

app.post('/api/rag', async (c) => {
  // RAG增强生成端点
});

app.get('/api/models', async (c) => {
  // 模型列表端点
});

app.post('/api/knowledge', async (c) => {
  // 知识库管理端点
});

// 健康检查
app.get('/health', async (c) => {
  return c.json({ status: 'healthy', timestamp: Date.now() });
});
```

#### 3.1.3 API端点设计

| 端点 | 方法 | 功能 | 参数 | 响应 |
|------|------|------|------|------|
| /api/chat | POST | AI对话 | messages, options, use_rag | ChatResponse |
| /api/rag | POST | RAG增强生成 | query, context | RAGResponse |
| /api/models | GET | 模型列表 | - | ModelList |
| /api/models/:id | GET | 模型详情 | model_id | ModelInfo |
| /api/knowledge | POST | 知识库添加 | documents | AddResult |
| /api/knowledge/:id | DELETE | 知识库删除 | doc_id | DeleteResult |
| /api/knowledge/search | POST | 知识检索 | query, top_k | SearchResult |
| /health | GET | 健康检查 | - | HealthStatus |

#### 3.1.4 请求处理流程

```
用户请求 → 参数验证 → 服务选择 → 执行处理 → 响应封装 → 返回结果
    ↓         ↓          ↓          ↓          ↓          ↓
  解析JSON   格式检查   use_rag?   AI/RAG    统一格式   JSON响应
```

### 3.2 OllamaService - 本地AI模型服务

#### 3.2.1 组件定位

OllamaService负责本地AI模型的加载、推理、管理和性能监控。

#### 3.2.2 核心功能

**模型管理**:
```typescript
class OllamaService {
  private baseURL: string = 'http://localhost:11434';
  private currentModel: string = 'llama3.2';
  private availableModels: Map<string, ModelInfo> = new Map();
  private requestQueue: Map<string, AbortController> = new Map();
  private metrics: PerformanceMetrics = {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    avg_response_time: 0,
    response_times: [],
  };

  // 加载模型
  async loadModel(modelName: string): Promise<void> {
    // 模型加载逻辑
  }

  // 切换模型
  async switchModel(modelName: string): Promise<void> {
    // 模型切换逻辑
  }

  // 获取模型列表
  async getModels(): Promise<ModelInfo[]> {
    // 获取可用模型列表
  }
}
```

**AI对话**:
```typescript
async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
  const startTime = Date.now();
  const requestId = this.generateRequestId();

  try {
    // 更新指标
    this.metrics.total_requests++;

    // 构建请求体
    const requestBody = {
      model: options.model || this.currentModel,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      stream: options.stream || false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
        num_predict: options.max_tokens ?? 2048,
      }
    };

    // 创建取消控制器
    const controller = new AbortController();
    this.requestQueue.set(requestId, controller);

    // 发送请求
    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const endTime = Date.now();

    // 清理请求队列
    this.requestQueue.delete(requestId);

    // 更新成功指标
    this.metrics.successful_requests++;
    const responseTime = endTime - startTime;
    this.updateResponseTime(responseTime);

    return {
      message: {
        role: 'assistant',
        content: result.message?.content || '',
        timestamp: Date.now(),
      },
      usage: {
        prompt_tokens: result.prompt_eval_count || 0,
        completion_tokens: result.eval_count || 0,
        total_tokens: (result.prompt_eval_count || 0) + (result.eval_count || 0),
      },
      model: result.model,
      created_at: result.created_at,
      done: result.done,
      thinking_time: responseTime,
    };
  } catch (error) {
    this.requestQueue.delete(requestId);
    this.metrics.failed_requests++;
    throw error;
  }
}
```

**性能监控**:
```typescript
interface PerformanceMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  response_times: number[];
  last_request_time: number;
  error_rate: number;
}

// 获取性能指标
getMetrics(): PerformanceMetrics {
  return {
    ...this.metrics,
    error_rate: this.calculateErrorRate(),
    avg_response_time: this.calculateAvgResponseTime(),
  };
}

// 重置指标
resetMetrics(): void {
  this.metrics = {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    avg_response_time: 0,
    response_times: [],
    last_request_time: 0,
    error_rate: 0,
  };
}
```

#### 3.2.3 模型配置

| 模型名称 | 用途 | 参数量 | 推荐场景 |
|----------|------|--------|----------|
| llama3.2 | 通用对话 | 3B/8B | 日常对话、任务执行 |
| mistral | 代码生成 | 7B | 代码辅助、编程任务 |
| qwen2.5 | 中文优化 | 7B/14B | 中文问答、知识检索 |
| phi-3 | 轻量级 | 3.8B | 边缘设备、快速响应 |

### 3.3 RAGEngine - 知识检索增强生成引擎

#### 3.3.1 组件定位

RAGEngine负责知识检索、上下文构建和增强生成，将外部知识库与AI模型结合，提升回答准确性和相关性。

#### 3.3.2 架构设计

```typescript
// services/ai/RAGEngine.ts 核心架构

class RAGEngine {
  private chromaClient: ChromaClient;
  private collection: Collection;
  private embeddingModel: string = 'all-MiniLM-L6-v2';
  private topK: number = 5;

  constructor() {
    this.chromaClient = new ChromaClient({
      path: 'http://localhost:8000'
    });
  }

  // 初始化知识库
  async initialize(collectionName: string): Promise<void> {
    this.collection = await this.chromaClient.getOrCreateCollection({
      name: collectionName,
    });
  }

  // 添加知识文档
  async addDocuments(documents: KnowledgeDocument[]): Promise<void> {
    const embeddings = await this.generateEmbeddings(
      documents.map(doc => doc.content)
    );

    await this.collection.add({
      ids: documents.map(doc => doc.id),
      embeddings: embeddings,
      metadatas: documents.map(doc => doc.metadata),
      documents: documents.map(doc => doc.content),
    });
  }

  // 知识检索
  async retrieve(query: string, topK: number = 5): Promise<RetrievedKnowledge[]> {
    const queryEmbedding = await this.generateEmbedding(query);

    const results = await this.collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
    });

    return results.documents[0].map((doc, index) => ({
      content: doc,
      metadata: results.metadatas[0][index],
      score: results.distances[0][index],
      id: results.ids[0][index],
    }));
  }

  // 生成增强响应
  async generateResponse(context: RAGContext): Promise<RAGResponse> {
    // 1. 构建增强上下文
    const enhancedContext = await this.buildContext(context);

    // 2. 构建RAG提示模板
    const ragPrompt = this.buildRAGPrompt(enhancedContext, context.user_context);

    // 3. 调用本地AI模型生成回答
    const messages: ChatMessage[] = [
      { role: 'system', content: ragPrompt },
      { role: 'user', content: context.query }
    ];

    const aiResponse = await ollamaService.chat(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    });

    // 4. 解析和增强AI响应
    const enhancedResponse = await this.enhanceResponse(
      aiResponse.message.content,
      context.retrieved_knowledge,
      context.query
    );

    return enhancedResponse;
  }
}
```

#### 3.3.3 RAG处理流程

```
用户查询 → 向量化检索 → 相关知识排序 → 上下文构建 → AI生成 → 响应增强
    ↓           ↓            ↓            ↓           ↓          ↓
  query    embedding    top-K排序    prompt模板   Ollama    置信度评估
```

#### 3.3.4 知识检索策略

| 策略 | 描述 | 适用场景 | 参数 |
|------|------|----------|------|
| 语义检索 | 基于向量相似度检索 | 通用问答 | topK=5 |
| 混合检索 | 语义+关键词混合 | 精确匹配 | topK=3, keyword_weight=0.3 |
| 重排序检索 | 先检索后重排序 | 高精度需求 | topK=10, rerank_top=3 |
| 多轮检索 | 结合对话历史 | 上下文相关 | history_window=3 |

### 3.4 KnowledgeManager - 知识库管理器

#### 3.4.1 组件定位

KnowledgeManager负责知识文档的增删改查、分类管理、版本控制和质量评估。

#### 3.4.2 核心功能

```typescript
class KnowledgeManager {
  private ragEngine: RAGEngine;
  private documentStore: Map<string, KnowledgeDocument> = new Map();

  // 添加文档
  async addDocument(document: KnowledgeDocument): Promise<string> {
    // 文档预处理
    const processed = await this.preprocessDocument(document);

    // 存储文档
    this.documentStore.set(document.id, processed);

    // 添加到向量数据库
    await this.ragEngine.addDocuments([processed]);

    return document.id;
  }

  // 批量导入
  async importDocuments(documents: KnowledgeDocument[]): Promise<ImportResult> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const doc of documents) {
      try {
        await this.addDocument(doc);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${doc.id}: ${error}`);
      }
    }

    return results;
  }

  // 文档预处理
  private async preprocessDocument(document: KnowledgeDocument): Promise<KnowledgeDocument> {
    // 文本清洗
    let content = document.content;
    content = this.cleanText(content);

    // 分块处理
    const chunks = this.chunkText(content, 512);

    return {
      ...document,
      content: content,
      chunks: chunks,
      processed_at: Date.now(),
    };
  }
}
```

## 4. 本地AI模型集成

### 4.1 Ollama集成方案

#### 4.1.1 部署架构

```yaml
# docker-compose.yml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: yyc3-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_MODELS=llama3.2,mistral,qwen2.5
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  ollama_data:
```

#### 4.1.2 模型管理

**模型下载**:
```bash
# 下载llama3.2模型
ollama pull llama3.2

# 下载mistral模型
ollama pull mistral

# 下载qwen2.5模型
ollama pull qwen2.5
```

**模型切换**:
```typescript
// 动态切换模型
async switchModel(modelName: string): Promise<void> {
  // 验证模型是否可用
  const models = await this.getModels();
  const modelExists = models.some(m => m.name === modelName);

  if (!modelExists) {
    throw new Error(`Model ${modelName} not found`);
  }

  // 切换模型
  this.currentModel = modelName;

  // 预热模型
  await this.warmupModel(modelName);
}
```

### 4.2 模型性能优化

#### 4.2.1 推理优化

**量化优化**:
```typescript
const quantizationOptions = {
  '4bit': { precision: 'q4_k_m', speed: 'fast', quality: 'medium' },
  '8bit': { precision: 'q8_0', speed: 'medium', quality: 'high' },
  '16bit': { precision: 'f16', speed: 'slow', quality: 'very_high' },
};
```

**批处理优化**:
```typescript
async batchChat(requests: ChatRequest[]): Promise<ChatResponse[]> {
  // 批量处理请求
  const responses = await Promise.all(
    requests.map(req => this.chat(req.messages, req.options))
  );

  return responses;
}
```

#### 4.2.2 缓存策略

**响应缓存**:
```typescript
class ResponseCache {
  private cache: Map<string, CachedResponse> = new Map();
  private ttl: number = 3600000; // 1小时

  async get(key: string): Promise<CachedResponse | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  async set(key: string, response: ChatResponse): Promise<void> {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }
}
```

**模型缓存**:
```typescript
// 模型预热
async warmupModel(modelName: string): Promise<void> {
  const warmupPrompt = 'Hello, how are you?';
  await this.chat([{ role: 'user', content: warmupPrompt }], {
    model: modelName,
  });
}
```

## 5. RAG知识增强实现

### 5.1 知识库构建

#### 5.1.1 文档处理流程

```
原始文档 → 文本提取 → 清洗预处理 → 分块切分 → 向量化 → 存储索引
    ↓          ↓          ↓          ↓         ↓         ↓
  PDF/HTML   纯文本    去噪清洗   512token   embedding  ChromaDB
```

#### 5.1.2 分块策略

| 策略 | 块大小 | 重叠 | 适用场景 |
|------|--------|------|----------|
| 固定大小 | 512 tokens | 50 tokens | 通用文档 |
| 段落分割 | 按段落 | 0 | 结构化文档 |
| 语义分割 | 按语义 | 20 tokens | 长文档 |
| 混合分割 | 512+段落 | 50 tokens | 复杂文档 |

### 5.2 向量检索

#### 5.2.1 Embedding模型

| 模型 | 维度 | 速度 | 精度 | 适用场景 |
|------|------|------|------|----------|
| all-MiniLM-L6-v2 | 384 | 快 | 中 | 通用检索 |
| bge-large-zh | 1024 | 中 | 高 | 中文检索 |
| text-embedding-ada-002 | 1536 | 慢 | 高 | 高精度检索 |

#### 5.2.2 相似度计算

```typescript
// 余弦相似度
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (norm1 * norm2);
}

// 欧氏距离
function euclideanDistance(vec1: number[], vec2: number[]): number {
  return Math.sqrt(
    vec1.reduce((sum, val, i) => sum + Math.pow(val - vec2[i], 2), 0)
  );
}
```

### 5.3 上下文构建

#### 5.3.1 提示模板

```typescript
const RAG_SYSTEM_PROMPT = `
你是一个专业的AI助手，基于以下知识库内容回答用户问题。

知识库内容：
{knowledge_chunks}

用户问题：
{user_query}

要求：
1. 基于知识库内容回答，不要编造信息
2. 如果知识库中没有相关信息，请明确说明
3. 引用知识库中的具体内容支持你的回答
4. 回答要准确、简洁、有条理
`;

function buildRAGPrompt(knowledge: RetrievedKnowledge[], query: string): string {
  const knowledgeChunks = knowledge
    .map(k => `[${k.id}] ${k.content}`)
    .join('\n\n');

  return RAG_SYSTEM_PROMPT
    .replace('{knowledge_chunks}', knowledgeChunks)
    .replace('{user_query}', query);
}
```

#### 5.3.2 上下文优化

**去重处理**:
```typescript
function deduplicateKnowledge(knowledge: RetrievedKnowledge[]): RetrievedKnowledge[] {
  const seen = new Set<string>();
  const result: RetrievedKnowledge[] = [];

  for (const k of knowledge) {
    const key = k.content.substring(0, 100); // 使用前100字符作为键
    if (!seen.has(key)) {
      seen.add(key);
      result.push(k);
    }
  }

  return result;
}
```

**相关性过滤**:
```typescript
function filterByRelevance(knowledge: RetrievedKnowledge[], threshold: number = 0.7): RetrievedKnowledge[] {
  return knowledge.filter(k => k.score >= threshold);
}
```

## 6. API接口设计

### 6.1 接口规范

#### 6.1.1 通用规范

- 协议：HTTP/1.1, HTTPS
- 数据格式：JSON
- 字符编码：UTF-8
- 认证方式：Bearer Token
- 限流策略：100 req/min per user

#### 6.1.2 请求格式

```typescript
interface APIRequest<T> {
  timestamp: number;
  request_id: string;
  data: T;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
  request_id: string;
}
```

### 6.2 核心接口

#### 6.2.1 AI对话接口

**端点**: `POST /api/chat`

**请求参数**:
```typescript
interface ChatRequest {
  messages: ChatMessage[];
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  };
  use_rag?: boolean;
  user_context?: {
    user_id?: string;
    session_id?: string;
    preferences?: Record<string, any>;
  };
}
```

**响应参数**:
```typescript
interface ChatResponse {
  answer: string;
  sources?: RetrievedKnowledge[];
  confidence: number;
  reasoning?: string;
  related_questions?: string[];
  follow_up_suggestions?: string[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  thinking_time: number;
}
```

**示例**:
```bash
curl -X POST http://localhost:1229/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "如何提高学习效率？"}
    ],
    "use_rag": true,
    "options": {
      "temperature": 0.7,
      "max_tokens": 512
    }
  }'
```

#### 6.2.2 RAG增强接口

**端点**: `POST /api/rag`

**请求参数**:
```typescript
interface RAGRequest {
  query: string;
  context?: {
    conversation_history?: ChatMessage[];
    user_context?: Record<string, any>;
  };
  options?: {
    top_k?: number;
    min_score?: number;
    use_rerank?: boolean;
  };
}
```

**响应参数**:
```typescript
interface RAGResponse {
  answer: string;
  sources: RetrievedKnowledge[];
  confidence: number;
  reasoning: string;
  related_questions: string[];
  follow_up_suggestions: string[];
  retrieval_time: number;
  generation_time: number;
  total_time: number;
}
```

#### 6.2.3 模型管理接口

**端点**: `GET /api/models`

**响应参数**:
```typescript
interface ModelsResponse {
  models: ModelInfo[];
  current_model: string;
}

interface ModelInfo {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}
```

**端点**: `POST /api/models/:id/switch`

**请求参数**:
```typescript
interface SwitchModelRequest {
  model_id: string;
  warmup?: boolean;
}
```

#### 6.2.4 知识库管理接口

**端点**: `POST /api/knowledge`

**请求参数**:
```typescript
interface AddKnowledgeRequest {
  documents: KnowledgeDocument[];
  options?: {
    preprocess?: boolean;
    chunk_size?: number;
    chunk_overlap?: number;
  };
}
```

**响应参数**:
```typescript
interface AddKnowledgeResponse {
  success_count: number;
  failed_count: number;
  document_ids: string[];
  errors?: Array<{
    document_id: string;
    error: string;
  }>;
}
```

**端点**: `POST /api/knowledge/search`

**请求参数**:
```typescript
interface SearchKnowledgeRequest {
  query: string;
  top_k?: number;
  filters?: Record<string, any>;
}
```

**响应参数**:
```typescript
interface SearchKnowledgeResponse {
  results: RetrievedKnowledge[];
  total_count: number;
  search_time: number;
}
```

### 6.3 错误处理

#### 6.3.1 错误码规范

| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| INVALID_REQUEST | 请求参数无效 | 400 |
| UNAUTHORIZED | 未授权访问 | 401 |
| FORBIDDEN | 禁止访问 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| RATE_LIMIT_EXCEEDED | 超过限流 | 429 |
| MODEL_NOT_FOUND | 模型不存在 | 404 |
| MODEL_LOAD_FAILED | 模型加载失败 | 500 |
| RAG_ERROR | RAG处理失败 | 500 |
| INTERNAL_ERROR | 内部错误 | 500 |

#### 6.3.2 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
    request_id: string;
  };
}
```

**示例**:
```json
{
  "success": false,
  "error": {
    "code": "MODEL_NOT_FOUND",
    "message": "Model 'unknown-model' not found",
    "details": {
      "available_models": ["llama3.2", "mistral", "qwen2.5"]
    },
    "timestamp": 1703462400000,
    "request_id": "req_1234567890"
  }
}
```

## 7. 性能优化

### 7.1 推理性能优化

#### 7.1.1 模型量化

```typescript
// 量化配置
const quantizationConfig = {
  'q4_k_m': {
    precision: '4-bit',
    compression_ratio: 0.5,
    speed_improvement: '2x',
    quality_impact: 'minimal',
  },
  'q8_0': {
    precision: '8-bit',
    compression_ratio: 0.75,
    speed_improvement: '1.5x',
    quality_impact: 'negligible',
  },
};
```

#### 7.1.2 批处理优化

```typescript
class BatchProcessor {
  private queue: ChatRequest[] = [];
  private batchSize: number = 8;
  private batchTimeout: number = 100; // ms

  async processBatch(requests: ChatRequest[]): Promise<ChatResponse[]> {
    // 批量推理
    const responses = await Promise.all(
      requests.map(req => ollamaService.chat(req.messages, req.options))
    );

    return responses;
  }

  async addRequest(request: ChatRequest): Promise<ChatResponse> {
    this.queue.push(request);

    if (this.queue.length >= this.batchSize) {
      const batch = this.queue.splice(0, this.batchSize);
      const responses = await this.processBatch(batch);
      return responses[0];
    }

    // 等待超时
    await new Promise(resolve => setTimeout(resolve, this.batchTimeout));

    if (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.queue.length);
      const responses = await this.processBatch(batch);
      return responses[0];
    }

    throw new Error('Batch processing failed');
  }
}
```

### 7.2 检索性能优化

#### 7.2.1 向量索引优化

```typescript
// HNSW索引配置
const indexConfig = {
  M: 16, // 连接数
  efConstruction: 200, // 构建时的搜索宽度
  efSearch: 50, // 搜索时的搜索宽度
};

// IVF索引配置
const ivfConfig = {
  nlist: 100, // 聚类中心数
  nprobe: 10, // 搜索时检查的聚类数
};
```

#### 7.2.2 缓存优化

```typescript
class RetrievalCache {
  private cache: LRUCache<string, RetrievedKnowledge[]>;
  private ttl: number = 300000; // 5分钟

  constructor(maxSize: number = 1000) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl: this.ttl,
    });
  }

  async get(query: string): Promise<RetrievedKnowledge[] | null> {
    return this.cache.get(query) || null;
  }

  async set(query: string, results: RetrievedKnowledge[]): Promise<void> {
    this.cache.set(query, results);
  }
}
```

### 7.3 并发控制

#### 7.3.1 请求限流

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limit: number = 100;
  private window: number = 60000; // 1分钟

  async checkLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];

    // 清理过期请求
    const validRequests = userRequests.filter(t => now - t < this.window);

    if (validRequests.length >= this.limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(userId, validRequests);

    return true;
  }
}
```

#### 7.3.2 连接池管理

```typescript
class ConnectionPool {
  private pool: Map<string, any[]> = new Map();
  private maxConnections: number = 10;

  async getConnection(service: string): Promise<any> {
    const connections = this.pool.get(service) || [];

    if (connections.length > 0) {
      return connections.pop();
    }

    // 创建新连接
    return this.createConnection(service);
  }

  async releaseConnection(service: string, connection: any): Promise<void> {
    const connections = this.pool.get(service) || [];

    if (connections.length < this.maxConnections) {
      connections.push(connection);
      this.pool.set(service, connections);
    } else {
      // 关闭连接
      await connection.close();
    }
  }
}
```

## 8. 监控与运维

### 8.1 性能监控

#### 8.1.1 关键指标

| 指标类别 | 指标名称 | 阈值 | 告警级别 |
|----------|----------|------|----------|
| 请求性能 | 平均响应时间 | >2000ms | 警告 |
| 请求性能 | P95响应时间 | >5000ms | 严重 |
| 请求性能 | 请求成功率 | <95% | 严重 |
| 模型性能 | 模型推理时间 | >3000ms | 警告 |
| 模型性能 | 模型加载时间 | >10000ms | 严重 |
| 检索性能 | 向量检索时间 | >500ms | 警告 |
| 检索性能 | 检索召回率 | <0.8 | 警告 |
| 资源使用 | CPU使用率 | >80% | 警告 |
| 资源使用 | 内存使用率 | >85% | 严重 |
| 资源使用 | GPU使用率 | >90% | 严重 |

#### 8.1.2 监控实现

```typescript
class PerformanceMonitor {
  private metrics: Map<string, MetricValue> = new Map();

  // 记录指标
  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildMetricKey(name, labels);
    this.metrics.set(key, {
      name,
      value,
      labels,
      timestamp: Date.now(),
    });
  }

  // 获取指标
  getMetric(name: string, labels?: Record<string, string>): MetricValue | undefined {
    const key = this.buildMetricKey(name, labels);
    return this.metrics.get(key);
  }

  // 导出Prometheus格式
  exportPrometheus(): string {
    let output = '';

    for (const [key, metric] of this.metrics.entries()) {
      const labels = metric.labels
        ? `{${Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',')}}`
        : '';

      output += `${metric.name}${labels} ${metric.value} ${metric.timestamp}\n`;
    }

    return output;
  }

  private buildMetricKey(name: string, labels?: Record<string, string>): string {
    const labelStr = labels
      ? JSON.stringify(labels)
      : '';
    return `${name}:${labelStr}`;
  }
}
```

### 8.2 健康检查

#### 8.2.1 健康检查端点

```typescript
// GET /health
app.get('/health', async (c) => {
  const health = {
    status: 'healthy',
    timestamp: Date.now(),
    services: {
      ollama: await checkOllamaHealth(),
      chromadb: await checkChromaDBHealth(),
      redis: await checkRedisHealth(),
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  };

  const allHealthy = Object.values(health.services).every(s => s.status === 'healthy');

  return c.json(health, allHealthy ? 200 : 503);
});

async function checkOllamaHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return { status: response.ok ? 'healthy' : 'unhealthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

#### 8.2.2 自愈机制

```typescript
class AutoRecovery {
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 3;

  async recover(service: string): Promise<boolean> {
    const attempts = this.retryAttempts.get(service) || 0;

    if (attempts >= this.maxRetries) {
      return false;
    }

    try {
      // 尝试重启服务
      await this.restartService(service);
      this.retryAttempts.delete(service);
      return true;
    } catch (error) {
      this.retryAttempts.set(service, attempts + 1);
      return false;
    }
  }

  private async restartService(service: string): Promise<void> {
    // 服务重启逻辑
    console.log(`Restarting service: ${service}`);
  }
}
```

### 8.3 日志管理

#### 8.3.1 日志格式

```typescript
interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  message: string;
  context?: Record<string, any>;
  request_id?: string;
  user_id?: string;
}

class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  log(level: string, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level: level as any,
      service: this.service,
      message,
      context,
    };

    console.log(JSON.stringify(entry));
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }
}
```

#### 8.3.2 日志收集

```typescript
// 使用Winston日志库
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

## 9. 安全架构

### 9.1 认证授权

#### 9.1.1 JWT认证

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// 中间件
async function authMiddleware(c: any, next: any) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const decoded = verifyToken(token);
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}
```

#### 9.1.2 权限控制

```typescript
const PERMISSIONS = {
  'user': ['chat', 'rag'],
  'admin': ['chat', 'rag', 'models', 'knowledge'],
};

function checkPermission(role: string, action: string): boolean {
  const allowedActions = PERMISSIONS[role] || [];
  return allowedActions.includes(action);
}

// 中间件
async function permissionMiddleware(action: string) {
  return async (c: any, next: any) => {
    const user = c.get('user');

    if (!checkPermission(user.role, action)) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await next();
  };
}
```

### 9.2 数据安全

#### 9.2.1 敏感数据加密

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key';
const ALGORITHM = 'aes-256-gcm';

function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return { encrypted, iv: iv.toString('hex'), tag: tag.toString('hex') };
}

function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

#### 9.2.2 数据脱敏

```typescript
function maskSensitiveData(data: any): any {
  if (typeof data === 'string') {
    // 邮箱脱敏
    if (data.includes('@')) {
      const [local, domain] = data.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    }
    // 手机号脱敏
    if (/^\d{11}$/.test(data)) {
      return `${data.substring(0, 3)}****${data.substring(7)}`;
    }
  }

  if (typeof data === 'object' && data !== null) {
    const masked: any = {};
    for (const key in data) {
      if (key.includes('password') || key.includes('secret')) {
        masked[key] = '***';
      } else {
        masked[key] = maskSensitiveData(data[key]);
      }
    }
    return masked;
  }

  return data;
}
```

### 9.3 输入验证

#### 9.3.1 参数验证

```typescript
import { z } from 'zod';

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(4096),
  })).min(1).max(50),
  options: z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    max_tokens: z.number().min(1).max(4096).optional(),
  }).optional(),
  use_rag: z.boolean().optional(),
});

function validateChatRequest(data: any): ChatRequest {
  return ChatRequestSchema.parse(data);
}
```

#### 9.3.2 SQL注入防护

```typescript
// 使用参数化查询
import { Pool } from 'pg';

const pool = new Pool();

async function queryUser(userId: string): Promise<User> {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0];
}
```

## 10. 架构决策记录（ADR）

### ADR-001: 选择Ollama作为本地AI模型运行时

**状态**: 已接受

**日期**: 2024-06-24

**背景**:
- 需要本地运行AI模型，保证数据隐私和响应速度
- 需要支持多种模型和灵活切换
- 需要易于部署和维护

**决策**:
选择Ollama作为本地AI模型运行时，原因如下：
1. 开源免费，无商业限制
2. 支持多种模型（Llama、Mistral、Qwen等）
3. 提供RESTful API，易于集成
4. 支持模型量化和优化
5. 活跃的社区和持续的更新

**后果**:
- 优点：降低成本，提高隐私保护，减少网络延迟
- 缺点：需要本地硬件资源，模型更新需要手动管理

### ADR-002: 采用RAG增强AI回答质量

**状态**: 已接受

**日期**: 2024-06-24

**背景**:
- 纯AI模型可能产生幻觉或回答不准确
- 需要结合领域知识提高回答准确性
- 用户需要可追溯的信息来源

**决策**:
采用RAG（Retrieval-Augmented Generation）架构，原因如下：
1. 结合外部知识库，提高回答准确性
2. 提供信息来源，增强可信度
3. 灵活更新知识库，无需重新训练模型
4. 支持多语言和多领域知识

**后果**:
- 优点：提高回答质量，减少幻觉，支持知识更新
- 缺点：增加系统复杂度，需要维护知识库

### ADR-003: 使用ChromaDB作为向量数据库

**状态**: 已接受

**日期**: 2024-06-24

**背景**:
- 需要高效的向量检索能力
- 需要支持大规模知识库
- 需要易于部署和集成

**决策**:
选择ChromaDB作为向量数据库，原因如下：
1. 开源免费，易于部署
2. 支持多种Embedding模型
3. 提供Python和TypeScript SDK
4. 支持持久化和分布式部署

**后果**:
- 优点：降低成本，易于集成，支持扩展
- 缺点：性能可能不如专业向量数据库（如Pinecone、Milvus）

### ADR-004: 采用Hono作为API网关框架

**状态**: 已接受

**日期**: 2024-06-24

**背景**:
- 需要高性能的API网关
- 需要支持TypeScript
- 需要轻量级和易部署

**决策**:
选择Hono作为API网关框架，原因如下：
1. 极致性能，基于Web标准
2. 原生TypeScript支持
3. 轻量级，易于部署
4. 丰富的中间件生态

**后果**:
- 优点：高性能，类型安全，易于开发
- 缺点：生态相对较小，社区不如Express成熟

## 11. 附录

### 11.1 术语表

| 术语 | 英文 | 解释 |
|------|------|------|
| RAG | Retrieval-Augmented Generation | 检索增强生成，结合知识检索和AI生成 |
| Embedding | Embedding | 文本向量化，将文本转换为向量表示 |
| Ollama | Ollama | 本地AI模型运行时 |
| ChromaDB | ChromaDB | 开源向量数据库 |
| Hono | Hono | 轻量级Web框架 |
| Quantization | 量化 | 模型压缩技术，减少模型大小 |
| Top-K | Top-K | 检索前K个最相关结果 |
| Temperature | Temperature | 控制AI生成随机性的参数 |

### 11.2 参考资源

- Ollama官方文档: https://ollama.com/docs
- ChromaDB官方文档: https://docs.trychroma.com
- Hono官方文档: https://hono.dev
- LangChain文档: https://python.langchain.com
- RAG论文: https://arxiv.org/abs/2005.11401

### 11.3 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2024-06-24 | 初始版本 | AI小语开发团队 |
| v1.0.1 | 2024-12-24 | 完善架构设计，补充实现细节 | AI小语开发团队 |

---

**文档结束**

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
