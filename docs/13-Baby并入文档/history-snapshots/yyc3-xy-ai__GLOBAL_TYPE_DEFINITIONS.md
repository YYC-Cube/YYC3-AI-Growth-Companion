# YYC³ 项目全局统一类型定义文档

## 文档概述

本文档提供 YYC³ 项目中所有类型定义的统一参考指南，包括类型层级结构、使用说明和实际示例。本文档旨在帮助开发团队理解和使用项目中的类型系统，确保代码的一致性和可维护性。

## 目录

1. [类型系统架构](#类型系统架构)
2. [基础类型](#基础类型)
3. [领域类型](#领域类型)
4. [类型使用指南](#类型使用指南)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)

---

## 类型系统架构

### 类型模块组织

```
types/
├── common.ts          # 基础类型和通用接口
├── ai.ts              # AI 相关类型
├── analytics.ts       # 分析和统计类型
├── database.ts        # 数据库相关类型
├── schedule.ts        # 调度和时间管理类型
├── prediction/        # 预测引擎类型
│   └── common.ts      # 预测引擎通用类型
└── index.ts           # 统一导出入口
```

### 类型导入规范

```typescript
// ✅ 推荐：从统一入口导入
import type { User, Schedule, AIRole } from '@/types';

// ✅ 也可以从具体模块导入
import type { User as CommonUser } from '@/types/common';
import type { Schedule } from '@/types/schedule';
import type { AIRole } from '@/types/ai';

// ❌ 不推荐：直接导入内部模块
import type { User } from '@/types/common';
```

---

## 基础类型

### 1. 通用基础类型

#### 实体基类

```typescript
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**使用场景**：所有需要审计追踪的实体都应该继承此接口。

**示例**：
```typescript
interface Product extends BaseEntity {
  name: string;
  price: number;
}

const product: Product = {
  id: '1',
  name: 'iPhone',
  price: 999,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

#### 可审计实体

```typescript
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: Date;
}
```

**使用场景**：需要完整审计追踪的实体。

#### JSON 类型

```typescript
export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
```

**使用场景**：处理动态 JSON 数据、配置文件、API 响应等。

**示例**：
```typescript
const config: JsonObject = {
  appName: 'YYC³',
  version: '1.0.0',
  features: ['ai', 'analytics', 'prediction']
};

function processConfig(data: JsonValue): void {
  if (typeof data === 'object' && data !== null) {
    console.log('Processing JSON object');
  }
}
```

#### API 响应类型

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  timestamp: Date;
}
```

**使用场景**：统一的 API 响应格式。

**示例**：
```typescript
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const result = await fetchUser('1');
if (result.success && result.data) {
  console.log(result.data.name);
}
```

#### 分页类型

```typescript
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginatedResponse<T> {
  data: T[];
  meta: ResponseMeta;
}
```

**使用场景**：分页查询和列表展示。

**示例**：
```typescript
async function fetchUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
  const response = await fetch(`/api/users?page=${params.page}&pageSize=${params.pageSize}`);
  return response.json();
}

const users = await fetchUsers({ page: 1, pageSize: 20, sortOrder: 'asc' });
```

#### 验证类型

```typescript
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
```

**使用场景**：表单验证和数据校验。

**示例**：
```typescript
function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!email.includes('@')) {
    errors.push({
      field: 'email',
      message: 'Email must contain @',
      code: 'INVALID_FORMAT'
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 2. 用户和认证类型

#### 用户类型

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'guest';
```

**使用场景**：用户信息管理和权限控制。

**示例**：
```typescript
function hasPermission(user: User, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 3,
    user: 2,
    guest: 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log(hasPermission(user, 'user')); // true
```

#### 认证请求类型

```typescript
export interface AuthenticatedRequest {
  user: User;
  token: string;
  timestamp: Date;
}
```

**使用场景**：需要认证的 API 请求。

**示例**：
```typescript
function createAuthenticatedHeaders(auth: AuthenticatedRequest): HeadersInit {
  return {
    'Authorization': `Bearer ${auth.token}`,
    'X-User-ID': auth.user.id
  };
}
```

### 3. 消息和状态类型

#### 消息类型

```typescript
export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: MessageType;
}

export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file';
```

**使用场景**：聊天、通知、消息队列等。

**示例**：
```typescript
function formatMessage(message: Message): string {
  const time = message.timestamp.toLocaleTimeString();
  return `[${time}] ${message.sender}: ${message.content}`;
}
```

#### 状态类型

```typescript
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed';
```

**使用场景**：任务状态、订单状态、流程状态等。

**示例**：
```typescript
function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
    completed: 'blue',
    failed: 'red'
  };
  
  return colors[status];
}
```

---

## 领域类型

### 1. AI 相关类型

#### AI 角色类型

```typescript
export interface AIRole {
  id: string;
  name: string;
  description: string;
  personality: string;
  knowledgeBase: string[];
  capabilities: string[];
  voiceStyle?: VoiceStyle;
  difficultyLevel?: DifficultyLevel;
}

export type VoiceStyle = 'gentle' | 'energetic' | 'professional' | 'friendly';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
```

**使用场景**：AI 角色配置和个性化设置。

**示例**：
```typescript
const mentorRole: AIRole = {
  id: 'mentor-1',
  name: '学习导师',
  description: '帮助学生学习的 AI 导师',
  personality: '耐心、鼓励、专业',
  knowledgeBase: ['math', 'science', 'language'],
  capabilities: ['答疑', '讲解', '练习'],
  voiceStyle: 'gentle',
  difficultyLevel: 'intermediate'
};
```

#### 聊天消息类型

```typescript
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  model?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  usage: TokenUsage;
  modelInfo: ModelInfo;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ModelInfo {
  modelId: string;
  modelName: string;
  version: string;
}
```

**使用场景**：AI 聊天对话系统。

**示例**：
```typescript
async function sendChatMessage(
  messages: ChatMessage[],
  options: ChatOptions
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, options })
  });
  
  return response.json();
}

const userMessage: ChatMessage = {
  id: '1',
  role: 'user',
  content: '什么是人工智能？',
  timestamp: new Date()
};

const response = await sendChatMessage([userMessage], {
  temperature: 0.7,
  maxTokens: 500
});

console.log(response.message.content);
console.log(`使用了 ${response.usage.totalTokens} 个 token`);
```

#### RAG（检索增强生成）类型

```typescript
export interface RAGContext {
  query: string;
  retrievedDocs: RetrievalResult[];
  userContext?: UserContext;
}

export interface RetrievalResult {
  documentId: string;
  content: string;
  relevanceScore: number;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeMetadata {
  source: string;
  author?: string;
  createdAt: Date;
  tags: string[];
  category?: string;
}

export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  history: string[];
  currentSession: string[];
}

export interface RAGResponse {
  answer: string;
  sources: RetrievalResult[];
  confidence: number;
  followUpQuestions: string[];
}
```

**使用场景**：知识库问答、文档检索、智能搜索。

**示例**：
```typescript
async function queryKnowledgeBase(
  query: string,
  userId: string
): Promise<RAGResponse> {
  const ragContext: RAGContext = {
    query,
    retrievedDocs: [],
    userContext: {
      userId,
      preferences: {},
      history: [],
      currentSession: []
    }
  };
  
  const response = await fetch('/api/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ragContext)
  });
  
  return response.json();
}

const result = await queryKnowledgeBase('如何学习编程？', 'user-123');
console.log(result.answer);
console.log(`相关文档数：${result.sources.length}`);
```

#### AI 系统配置类型

```typescript
export interface AISystemConfig {
  ragEngine: RAGEngineConfig;
  model: AIModelConfig;
  ollama?: OllamaConfig;
  openai?: OpenAIConfig;
}

export interface RAGEngineConfig {
  enabled: boolean;
  maxRetrievalDocs: number;
  relevanceThreshold: number;
  embeddingModel: string;
}

export interface AIModelConfig {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

export interface OllamaConfig {
  baseUrl: string;
  models: string[];
  timeout: number;
}

export interface OpenAIConfig {
  apiKey: string;
  organizationId?: string;
  baseUrl?: string;
}
```

**使用场景**：AI 系统配置和管理。

**示例**：
```typescript
const aiConfig: AISystemConfig = {
  ragEngine: {
    enabled: true,
    maxRetrievalDocs: 5,
    relevanceThreshold: 0.7,
    embeddingModel: 'text-embedding-ada-002'
  },
  model: {
    defaultModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 30000
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    organizationId: 'org-123'
  }
};
```

### 2. 调度类型

#### 调度基础类型

```typescript
export interface Schedule {
  id: string;
  childId: string;
  title: string;
  description?: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  repeat?: RepeatPattern;
  reminder?: ReminderType;
  priority?: SchedulePriority;
  status?: ScheduleStatus;
  aiGenerated?: boolean;
  completed?: boolean;
  color?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  participants?: string[];
  attachments?: string[];
  recurrenceRule?: RecurrenceRule;
  reminderTime?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ScheduleType =
  | 'study'
  | 'rest'
  | 'meal'
  | 'exercise'
  | 'play'
  | 'class'
  | 'homework'
  | 'sleep'
  | 'other';

export type RepeatPattern = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReminderType = 'none' | '5min' | '15min' | '30min' | '1hour' | '1day';
export type SchedulePriority = 'low' | 'medium' | 'high' | 'urgent';
export type ScheduleStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
```

**使用场景**：日程管理、任务调度、时间规划。

**示例**：
```typescript
const studySchedule: Schedule = {
  id: 'schedule-1',
  childId: 'child-1',
  title: '数学作业',
  description: '完成第三章练习题',
  type: 'homework',
  startTime: new Date('2024-01-07T14:00:00'),
  endTime: new Date('2024-01-07T16:00:00'),
  repeat: 'none',
  reminder: '15min',
  priority: 'high',
  status: 'pending',
  aiGenerated: true,
  color: '#FF5733',
  tags: ['数学', '作业'],
  createdAt: new Date(),
  updatedAt: new Date()
};

function isScheduleOverdue(schedule: Schedule): boolean {
  return schedule.status === 'pending' && schedule.endTime < new Date();
}

console.log(isScheduleOverdue(studySchedule)); // false
```

#### 调度表单类型

```typescript
export interface ScheduleFormData {
  title: string;
  description?: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  repeat?: RepeatPattern;
  reminder?: ReminderType;
  priority?: SchedulePriority;
  color?: string;
  location?: string;
  notes?: string;
  tags?: string[];
}
```

**使用场景**：调度表单数据绑定。

**示例**：
```typescript
function createScheduleFromFormData(
  formData: ScheduleFormData,
  childId: string
): Schedule {
  return {
    id: `schedule-${Date.now()}`,
    childId,
    ...formData,
    status: 'pending',
    completed: false,
    aiGenerated: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
```

#### 重复规则类型

```typescript
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  occurrences?: number;
}
```

**使用场景**：重复事件的规则定义。

**示例**：
```typescript
const weeklyRecurrence: RecurrenceRule = {
  frequency: 'weekly',
  interval: 1,
  daysOfWeek: [1, 3, 5], // 周一、周三、周五
  endDate: new Date('2024-06-30')
};

function getNextOccurrence(
  schedule: Schedule,
  fromDate: Date = new Date()
): Date | null {
  if (!schedule.recurrenceRule) {
    return null;
  }
  
  const rule = schedule.recurrenceRule;
  const nextDate = new Date(fromDate);
  
  switch (rule.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + rule.interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (rule.interval * 7));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + rule.interval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + rule.interval);
      break;
  }
  
  return nextDate;
}
```

#### 调度分析类型

```typescript
export interface ScheduleAnalytics {
  totalSchedules: number;
  completedSchedules: number;
  overdueSchedules: number;
  upcomingSchedules: number;
  byType: Record<ScheduleType, number>;
  byPriority: Record<SchedulePriority, number>;
  averageCompletionTime: number;
  completionRate: number;
}
```

**使用场景**：调度统计和分析。

**示例**：
```typescript
async function getScheduleAnalytics(
  childId: string,
  startDate: Date,
  endDate: Date
): Promise<ScheduleAnalytics> {
  const response = await fetch(
    `/api/schedules/analytics?childId=${childId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  );
  
  return response.json();
}

const analytics = await getScheduleAnalytics(
  'child-1',
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

console.log(`完成率：${analytics.completionRate * 100}%`);
console.log(`平均完成时间：${analytics.averageCompletionTime} 分钟`);
```

### 3. 分析类型

#### 实时活动类型

```typescript
export interface RealtimeActivity {
  activityId: string;
  type: string;
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
}
```

**使用场景**：实时活动追踪和监控。

**示例**：
```typescript
function logActivity(activity: RealtimeActivity): void {
  console.log(`[${activity.timestamp}] ${activity.type}: ${activity.description}`);
  
  if (activity.userId) {
    console.log(`用户：${activity.userId}`);
  }
  
  if (activity.metadata) {
    console.log('元数据：', activity.metadata);
  }
}

const activity: RealtimeActivity = {
  activityId: 'activity-1',
  type: 'user_action',
  description: '用户完成了数学作业',
  timestamp: new Date(),
  userId: 'user-123',
  metadata: {
    subject: 'math',
    duration: 45,
    score: 95
  }
};

logActivity(activity);
```

#### 实时指标类型

```typescript
export interface RealtimeMetric {
  metricId: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  trend?: 'up' | 'down' | 'stable';
  threshold?: {
    warning: number;
    critical: number;
  };
}
```

**使用场景**：实时性能监控和指标追踪。

**示例**：
```typescript
function checkMetricThreshold(metric: RealtimeMetric): 'normal' | 'warning' | 'critical' {
  if (!metric.threshold) {
    return 'normal';
  }
  
  if (metric.value >= metric.threshold.critical) {
    return 'critical';
  }
  
  if (metric.value >= metric.threshold.warning) {
    return 'warning';
  }
  
  return 'normal';
}

const cpuMetric: RealtimeMetric = {
  metricId: 'cpu-usage',
  name: 'CPU 使用率',
  value: 85,
  unit: '%',
  timestamp: new Date(),
  trend: 'up',
  threshold: {
    warning: 70,
    critical: 90
  }
};

const status = checkMetricThreshold(cpuMetric);
console.log(`CPU 状态：${status}`); // warning
```

#### 趋势分析类型

```typescript
export interface TrendData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface TrendAnalysis {
  metric: string;
  data: TrendData[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  changeRate: number;
  prediction?: {
    nextValue: number;
    confidence: number;
  };
}
```

**使用场景**：数据趋势分析和预测。

**示例**：
```typescript
function calculateTrend(data: TrendData[]): 'increasing' | 'decreasing' | 'stable' | 'volatile' {
  if (data.length < 2) {
    return 'stable';
  }
  
  let increases = 0;
  let decreases = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i].value > data[i - 1].value) {
      increases++;
    } else if (data[i].value < data[i - 1].value) {
      decreases++;
    }
  }
  
  const total = data.length - 1;
  const increaseRatio = increases / total;
  const decreaseRatio = decreases / total;
  
  if (increaseRatio > 0.7) return 'increasing';
  if (decreaseRatio > 0.7) return 'decreasing';
  if (increaseRatio < 0.3 && decreaseRatio < 0.3) return 'stable';
  return 'volatile';
}

const trendData: TrendData[] = [
  { timestamp: new Date('2024-01-01'), value: 10 },
  { timestamp: new Date('2024-01-02'), value: 15 },
  { timestamp: new Date('2024-01-03'), value: 20 },
  { timestamp: new Date('2024-01-04'), value: 25 }
];

const trend = calculateTrend(trendData);
console.log(`趋势：${trend}`); // increasing
```

### 4. 预测引擎类型

#### 预测数据类型

```typescript
export interface PredictionData {
  dataPoints: DataPoint[];
  metadata?: Record<string, unknown>;
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  features?: Record<string, number>;
  labels?: string[];
}
```

**使用场景**：预测模型输入数据。

**示例**：
```typescript
function preparePredictionData(
  rawValues: number[],
  startDate: Date,
  intervalHours: number = 1
): PredictionData {
  const dataPoints: DataPoint[] = rawValues.map((value, index) => ({
    timestamp: new Date(startDate.getTime() + index * intervalHours * 60 * 60 * 1000),
    value,
    features: {
      hourOfDay: new Date(startDate.getTime() + index * intervalHours * 60 * 60 * 1000).getHours(),
      dayOfWeek: new Date(startDate.getTime() + index * intervalHours * 60 * 60 * 1000).getDay()
    }
  }));
  
  return { dataPoints };
}

const predictionData = preparePredictionData(
  [10, 15, 20, 25, 30],
  new Date('2024-01-01'),
  24 // 24小时间隔
);
```

#### 预测结果类型

```typescript
export interface PredictionResult {
  predictionId: string;
  taskId: string;
  predictedValues: number[];
  confidence: number;
  timestamp: Date;
  modelInfo: {
    modelId: string;
    modelName: string;
    version: string;
  };
  metrics?: QualityMetrics;
}

export interface QualityMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mae?: number; // Mean Absolute Error
  rmse?: number; // Root Mean Square Error
}
```

**使用场景**：预测模型输出结果。

**示例**：
```typescript
function formatPredictionResult(result: PredictionResult): string {
  const predictions = result.predictedValues
    .map((v, i) => `t+${i + 1}: ${v.toFixed(2)}`)
    .join(', ');
  
  return `
预测 ID: ${result.predictionId}
模型: ${result.modelInfo.modelName} v${result.modelInfo.version}
置信度: ${(result.confidence * 100).toFixed(1)}%
预测值: ${predictions}
${result.metrics ? `准确率: ${(result.metrics.accuracy * 100).toFixed(1)}%` : ''}
  `.trim();
}

const result: PredictionResult = {
  predictionId: 'pred-1',
  taskId: 'task-1',
  predictedValues: [32, 35, 38],
  confidence: 0.85,
  timestamp: new Date(),
  modelInfo: {
    modelId: 'model-1',
    modelName: 'LinearRegression',
    version: '1.0.0'
  },
  metrics: {
    accuracy: 0.92,
    precision: 0.90,
    recall: 0.88,
    f1Score: 0.89,
    mae: 2.5,
    rmse: 3.2
  }
};

console.log(formatPredictionResult(result));
```

#### 预测任务类型

```typescript
export interface PredictionTask {
  taskId: string;
  name: string;
  description?: string;
  type: 'time_series' | 'classification' | 'regression' | 'anomaly_detection';
  status: 'pending' | 'running' | 'completed' | 'failed';
  config: PredictionConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionConfig {
  algorithm: string;
  parameters: Record<string, unknown>;
  constraints?: ModelConstraints;
  validation?: {
    splitRatio: number;
    crossValidationFolds?: number;
  };
}

export interface ModelConstraints {
  maxTrainingTime?: number;
  memoryLimit?: number;
  accuracyThreshold?: number;
  realTimeCapability?: boolean;
}
```

**使用场景**：预测任务管理和配置。

**示例**：
```typescript
function createPredictionTask(
  name: string,
  algorithm: string,
  parameters: Record<string, unknown>
): PredictionTask {
  return {
    taskId: `task-${Date.now()}`,
    name,
    type: 'time_series',
    status: 'pending',
    config: {
      algorithm,
      parameters,
      constraints: {
        maxTrainingTime: 300000, // 5分钟
        accuracyThreshold: 0.8
      },
      validation: {
        splitRatio: 0.8,
        crossValidationFolds: 5
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

const task = createPredictionTask(
  '销售预测',
  'ARIMA',
  { p: 1, d: 1, q: 1, seasonal: { period: 7 } }
);
```

#### 训练结果类型

```typescript
export interface TrainingResult {
  modelId: string;
  accuracy: number;
  trainingTime: number;
  timestamp: Date;
  metrics: Record<string, number>;
}
```

**使用场景**：模型训练结果记录。

**示例**：
```typescript
function compareTrainingResults(
  results: TrainingResult[]
): TrainingResult {
  return results.reduce((best, current) => 
    current.accuracy > best.accuracy ? current : best
  );
}

const results: TrainingResult[] = [
  {
    modelId: 'model-1',
    accuracy: 0.85,
    trainingTime: 120000,
    timestamp: new Date(),
    metrics: { precision: 0.83, recall: 0.87, f1: 0.85 }
  },
  {
    modelId: 'model-2',
    accuracy: 0.90,
    trainingTime: 180000,
    timestamp: new Date(),
    metrics: { precision: 0.89, recall: 0.91, f1: 0.90 }
  }
];

const bestModel = compareTrainingResults(results);
console.log(`最佳模型：${bestModel.modelId}，准确率：${bestModel.accuracy}`);
```

#### 数据漂移检测类型

```typescript
export interface DataDriftMetrics {
  modelId: string;
  driftScore: number;
  driftType: 'concept' | 'data' | 'none';
  timestamp: Date;
  affectedFeatures: string[];
}

export interface DriftDetection {
  detected: boolean;
  driftType: 'concept' | 'data' | 'none';
  driftScore: number;
  timestamp: Date;
  affectedFeatures: string[];
  recommendation?: string;
}
```

**使用场景**：模型性能监控和漂移检测。

**示例**：
```typescript
function handleDriftDetection(drift: DriftDetection): void {
  if (drift.detected) {
    console.warn(`检测到${drift.driftType}漂移，得分：${drift.driftScore}`);
    console.warn(`受影响特征：${drift.affectedFeatures.join(', ')}`);
    
    if (drift.recommendation) {
      console.log(`建议：${drift.recommendation}`);
    }
    
    // 触发模型重新训练
    triggerModelRetraining(drift);
  }
}

const driftDetection: DriftDetection = {
  detected: true,
  driftType: 'concept',
  driftScore: 0.75,
  timestamp: new Date(),
  affectedFeatures: ['feature1', 'feature2'],
  recommendation: '建议使用最新数据重新训练模型'
};

handleDriftDetection(driftDetection);
```

#### 异常检测类型

```typescript
export interface AnomalyReport {
  reportId: string;
  anomalies: Anomaly[];
  summary: {
    totalAnomalies: number;
    severity: 'low' | 'medium' | 'high';
    timeRange: {
      start: Date;
      end: Date;
    };
  };
  timestamp: Date;
}

export interface Anomaly {
  anomalyId: string;
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  explanation?: AnomalyExplanation;
}

export interface AnomalyExplanation {
  type: string;
  description: string;
  factors: Array<{
    factor: string;
    contribution: number;
  }>;
}
```

**使用场景**：异常检测和告警。

**示例**：
```typescript
function generateAnomalyAlert(report: AnomalyReport): string {
  const highSeverityCount = report.anomalies.filter(
    a => a.severity === 'high'
  ).length;
  
  return `
异常报告：${report.reportId}
时间范围：${report.summary.timeRange.start.toISOString()} - ${report.summary.timeRange.end.toISOString()}
异常总数：${report.summary.totalAnomalies}
严重程度：${report.summary.severity}
高严重异常：${highSeverityCount}
  `.trim();
}

const anomalyReport: AnomalyReport = {
  reportId: 'report-1',
  anomalies: [
    {
      anomalyId: 'anomaly-1',
      timestamp: new Date(),
      value: 100,
      expectedValue: 50,
      deviation: 2.0,
      severity: 'high',
      explanation: {
        type: 'statistical',
        description: '值超出3个标准差',
        factors: [
          { factor: 'seasonal', contribution: 0.6 },
          { factor: 'trend', contribution: 0.4 }
        ]
      }
    }
  ],
  summary: {
    totalAnomalies: 1,
    severity: 'high',
    timeRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    }
  },
  timestamp: new Date()
};

console.log(generateAnomalyAlert(anomalyReport));
```

---

## 类型使用指南

### 1. 类型导入最佳实践

#### 推荐的导入方式

```typescript
// ✅ 推荐：从统一入口导入
import type { 
  User, 
  Schedule, 
  AIRole, 
  ApiResponse,
  PaginatedResponse 
} from '@/types';

// ✅ 也可以：按需从具体模块导入
import type { Schedule } from '@/types/schedule';
import type { AIRole } from '@/types/ai';
```

#### 避免的导入方式

```typescript
// ❌ 不推荐：从内部模块导入
import type { User } from '@/types/common';

// ❌ 不推荐：混合导入
import type { User } from '@/types/common';
import type { Schedule } from '@/types';
```

### 2. 类型定义最佳实践

#### 使用接口定义对象类型

```typescript
// ✅ 推荐：使用 interface
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ 不推荐：使用 type 定义对象
type UserProfile = {
  id: string;
  name: string;
  email: string;
};
```

#### 使用 type 定义联合类型和交叉类型

```typescript
// ✅ 推荐：使用 type 定义联合类型
type Status = 'active' | 'inactive' | 'pending';

// ✅ 推荐：使用 type 定义交叉类型
type UserWithProfile = User & UserProfile;

// ✅ 推荐：使用 type 定义条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### 使用泛型提高类型复用性

```typescript
// ✅ 推荐：使用泛型
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// 使用示例
const userResponse: ApiResponse<User> = {
  success: true,
  data: {
    id: '1',
    name: 'John',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

const scheduleResponse: ApiResponse<Schedule[]> = {
  success: true,
  data: []
};
```

### 3. 类型守卫和类型断言

#### 使用类型守卫

```typescript
// ✅ 推荐：使用类型守卫
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

function handleError(error: unknown): void {
  if (isApiError(error)) {
    console.error(`API Error [${error.code}]: ${error.message}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

#### 避免过度使用类型断言

```typescript
// ❌ 不推荐：过度使用类型断言
const user = response.data as User;

// ✅ 推荐：使用类型守卫或类型检查
if (isUser(response.data)) {
  const user = response.data;
  // 使用 user
}
```

### 4. 可选属性和只读属性

#### 正确使用可选属性

```typescript
// ✅ 推荐：明确标记可选属性
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // 可选属性
  bio?: string;    // 可选属性
}

// 使用可选属性
const user: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com'
  // avatar 和 bio 可以省略
};
```

#### 使用只读属性

```typescript
// ✅ 推荐：使用 readonly 保护不可变属性
interface Config {
  readonly version: string;
  readonly buildDate: Date;
  apiUrl: string;
}

const config: Config = {
  version: '1.0.0',
  buildDate: new Date(),
  apiUrl: 'https://api.example.com'
};

// config.version = '2.0.0'; // 编译错误：不能修改只读属性
config.apiUrl = 'https://api.new.com'; // 可以修改
```

---

## 最佳实践

### 1. 类型命名规范

#### 接口命名

```typescript
// ✅ 推荐：使用 PascalCase
interface UserProfile { }
interface ScheduleFormData { }
interface PredictionResult { }

// ❌ 不推荐：使用其他命名方式
interface userProfile { }
interface user_profile { }
interface USER_PROFILE { }
```

#### 类型别名命名

```typescript
// ✅ 推荐：使用 PascalCase
type UserRole = 'admin' | 'user' | 'guest';
type Status = 'active' | 'inactive';
type ApiResponse<T> = { success: boolean; data?: T };

// ❌ 不推荐：使用其他命名方式
type userRole = 'admin' | 'user' | 'guest';
type user_role = 'admin' | 'user' | 'guest';
```

#### 枚举命名

```typescript
// ✅ 推荐：使用 PascalCase，成员使用 PascalCase
enum ScheduleType {
  Study = 'study',
  Rest = 'rest',
  Meal = 'meal'
}

// ✅ 推荐：使用字符串字面量联合类型（更现代）
type ScheduleType = 'study' | 'rest' | 'meal';
```

### 2. 类型组织规范

#### 按功能模块组织类型

```typescript
// ✅ 推荐：按功能模块组织
// types/user.ts
export interface User { }
export interface UserProfile { }
export type UserRole = 'admin' | 'user' | 'guest';

// types/schedule.ts
export interface Schedule { }
export interface ScheduleFormData { }
export type ScheduleType = 'study' | 'rest' | 'meal';

// types/index.ts
export * from './user';
export * from './schedule';
```

#### 使用命名空间避免冲突

```typescript
// ✅ 推荐：使用命名空间
namespace AI {
  export interface Role { }
  export interface ChatMessage { }
  export interface ChatResponse { }
}

namespace Schedule {
  export interface Task { }
  export interface Event { }
}

// 使用
const aiRole: AI.Role = { };
const scheduleTask: Schedule.Task = { };
```

### 3. 类型文档规范

#### 添加类型注释

```typescript
/**
 * 用户信息接口
 * 
 * @description 表示系统中的用户基本信息
 * @example
 * const user: User = {
 *   id: '1',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 */
export interface User {
  /** 用户唯一标识符 */
  id: string;
  
  /** 用户姓名 */
  name: string;
  
  /** 用户邮箱地址 */
  email: string;
  
  /** 用户角色 */
  role: UserRole;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 更新时间 */
  updatedAt: Date;
}
```

#### 添加使用示例

```typescript
/**
 * API 响应类型
 * 
 * @template T - 响应数据类型
 * @example
 * // 用户响应
 * const userResponse: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '1', name: 'John', email: 'john@example.com' }
 * };
 * 
 * @example
 * // 错误响应
 * const errorResponse: ApiResponse<User> = {
 *   success: false,
 *   error: {
 *     code: 'USER_NOT_FOUND',
 *     message: 'User not found'
 *   }
 * };
 */
export interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  success: boolean;
  
  /** 响应数据 */
  data?: T;
  
  /** 错误信息 */
  error?: ApiError;
  
  /** 响应元数据 */
  meta?: ResponseMeta;
}
```

### 4. 类型测试规范

#### 使用类型测试

```typescript
// __tests__/types.test.ts
import { describe, it, expect } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type { User, Schedule, ApiResponse } from '@/types';

describe('Type Tests', () => {
  it('User type should have correct properties', () => {
    expectTypeOf<User>().toMatchTypeOf<{
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'user' | 'guest';
      createdAt: Date;
      updatedAt: Date;
    }>();
  });
  
  it('ApiResponse should be generic', () => {
    expectTypeOf<ApiResponse<User>>().toHaveProperty('data');
    expectTypeOf<ApiResponse<User>>().toHaveProperty('success');
  });
  
  it('should prevent invalid type assignments', () => {
    // @ts-expect-error - age should be optional number
    const user: User = { 
      id: '1', 
      name: 'John', 
      email: 'john@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      age: '30' // 类型错误
    };
  });
});
```

---

## 常见问题

### 1. 如何处理动态属性？

#### 使用索引签名

```typescript
// ✅ 推荐：使用索引签名
interface DynamicObject {
  id: string;
  name: string;
  [key: string]: unknown; // 允许任意属性
}

const obj: DynamicObject = {
  id: '1',
  name: 'John',
  customField: 'value',
  anotherField: 123
};
```

#### 使用 Record 类型

```typescript
// ✅ 推荐：使用 Record 类型
type StringMap = Record<string, string>;
type NumberMap = Record<string, number>;
type AnyMap = Record<string, unknown>;

const stringMap: StringMap = {
  key1: 'value1',
  key2: 'value2'
};

const numberMap: NumberMap = {
  count: 10,
  total: 100
};
```

### 2. 如何处理可选链和空值合并？

#### 使用可选链操作符

```typescript
interface User {
  profile?: {
    address?: {
      city?: string;
    };
  };
}

const user: User = {};

// ✅ 推荐：使用可选链
const city = user.profile?.address?.city; // 类型为 string | undefined

// ❌ 不推荐：手动检查
const city2 = user.profile && user.profile.address && user.profile.address.city;
```

#### 使用空值合并操作符

```typescript
// ✅ 推荐：使用空值合并
const defaultCity = 'Unknown';
const city = user.profile?.address?.city ?? defaultCity;

// ❌ 不推荐：使用逻辑或
const city2 = user.profile?.address?.city || defaultCity;
```

### 3. 如何处理异步类型？

#### 使用 Promise 类型

```typescript
// ✅ 推荐：明确返回 Promise 类型
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// 使用
const user = await fetchUser('1');
console.log(user.name);
```

#### 使用 async/await 类型推断

```typescript
// ✅ 推荐：让 TypeScript 推断类型
async function processUser(id: string) {
  const user = await fetchUser(id);
  // user 的类型自动推断为 User
  return user.name;
}

// 返回类型自动推断为 Promise<string>
```

### 4. 如何处理类型错误？

#### 常见类型错误和解决方案

```typescript
// 错误 1：类型 'X' 不能赋值给类型 'Y'
// 解决方案：使用类型断言或类型守卫
const value: unknown = 'hello';
const str: string = value as string; // 类型断言

// 错误 2：属性 'X' 不存在于类型 'Y'
// 解决方案：检查类型定义，确保属性存在
interface User {
  name: string;
  // age?: number; // 添加可选属性
}

// 错误 3：不能将类型 'X' 分配给类型 'Y'
// 解决方案：使用泛型或联合类型
function process<T>(value: T): T {
  return value;
}
```

### 5. 如何优化类型性能？

#### 避免过度复杂的类型

```typescript
// ❌ 不推荐：过度复杂的类型
type ComplexType<T> = T extends { a: infer A } 
  ? A extends { b: infer B } 
    ? B 
    : never 
  : never;

// ✅ 推荐：简化类型定义
interface SimpleType {
  a: {
    b: string;
  };
}
```

#### 使用类型别名提高可读性

```typescript
// ❌ 不推荐：重复的复杂类型
function func1(data: { id: string; name: string; email: string; role: 'admin' | 'user' }) { }
function func2(data: { id: string; name: string; email: string; role: 'admin' | 'user' }) { }

// ✅ 推荐：使用类型别名
type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

function func1(data: UserData) { }
function func2(data: UserData) { }
```

---

## 附录

### A. 类型定义速查表

| 类型名称 | 模块 | 用途 |
|---------|------|------|
| User | common | 用户信息 |
| UserRole | common | 用户角色 |
| ApiResponse | common | API 响应 |
| PaginatedResponse | common | 分页响应 |
| Schedule | schedule | 调度信息 |
| ScheduleType | schedule | 调度类型 |
| AIRole | ai | AI 角色 |
| ChatMessage | ai | 聊天消息 |
| RAGContext | ai | RAG 上下文 |
| RealtimeActivity | analytics | 实时活动 |
| RealtimeMetric | analytics | 实时指标 |
| PredictionResult | prediction | 预测结果 |
| PredictionTask | prediction | 预测任务 |

### B. 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 深入理解](https://basarat.gitbook.io/typescript/)
- [TypeScript 类型体操](https://github.com/type-challenges/type-challenges)

### C. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2024-01-07 | 初始版本，包含所有核心类型定义 |

---

## 联系方式

如有类型定义相关的问题或建议，请联系开发团队。

**文档版本**: 1.0.0  
**最后更新**: 2024-01-07  
**维护者**: YYC³ 开发团队
