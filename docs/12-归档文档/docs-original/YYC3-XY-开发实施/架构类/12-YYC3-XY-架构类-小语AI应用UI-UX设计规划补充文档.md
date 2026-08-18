---
@file: YYC3-XY-架构类-小语AI应用UI-UX设计规划补充文档.md
@description: 本文档为《小语AI应用UI-UX全量设计规划文档》的补充文档，包含API接口体系、用户信息及全局形象系统、信息映射系统等核心章节。
@author: YYC³
@version: v1.0.0
@created: 2025-12-18
@updated: 2025-12-28
@status: published
@tags: 架构, UI-UX, API接口, 用户信息, 全局形象, 信息映射
---

# YYC³-XY 架构类 - 小语AI应用UI-UX设计规划补充文档

> 本文档为《小语AI应用UI-UX全量设计规划文档》的补充文档，包含API接口体系、用户信息及全局形象系统、信息映射系统等核心章节。

---

## 6. API接口体系

### 6.1 接口架构设计

#### 6.1.1 接口分层架构

```
┌─────────────────────────────────────────┐
│         API Gateway Layer               │
│    (统一入口、认证、限流、路由)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Layer                  │
│  (用户服务、内容服务、AI服务、成长服务)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│     (数据库、缓存、文件存储)              │
└─────────────────────────────────────────┘
```

#### 6.1.2 接口版本管理

```typescript
// API版本配置
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

// 版本化接口路径
export const API_PATHS = {
  [API_VERSIONS.V1]: {
    USERS: '/api/v1/users',
    CONTENTS: '/api/v1/contents',
    AI: '/api/v1/ai',
    GROWTH: '/api/v1/growth',
  },
  [API_VERSIONS.V2]: {
    USERS: '/api/v2/users',
    CONTENTS: '/api/v2/contents',
    AI: '/api/v2/ai',
    GROWTH: '/api/v2/growth',
  },
};
```

### 6.2 用户服务接口

#### 6.2.1 用户信息接口

```typescript
// 用户信息接口定义
interface UserAPI {
  // 获取用户信息
  getUserInfo(userId: string): Promise<UserInfo>;
  
  // 更新用户信息
  updateUserInfo(userId: string, data: Partial<UserInfo>): Promise<UserInfo>;
  
  // 创建用户
  createUser(data: CreateUserRequest): Promise<UserInfo>;
  
  // 删除用户
  deleteUser(userId: string): Promise<void>;
  
  // 获取用户成长记录
  getGrowthRecords(userId: string, params: GrowthRecordQuery): Promise<GrowthRecord[]>;
  
  // 更新用户偏好设置
  updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void>;
}

// 用户信息类型定义
interface UserInfo {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  growthStage: GrowthStage;
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserRequest {
  name: string;
  age: number;
  guardian?: string;
  initialPreferences?: Partial<UserPreferences>;
}

interface UserPreferences {
  language: 'zh-CN' | 'en-US';
  theme: 'light' | 'dark' | 'auto';
  voiceEnabled: boolean;
  voiceSpeed: number;
  fontSize: 'small' | 'medium' | 'large';
  culturalPreference?: string[];
}

interface UserStatistics {
  totalInteractionTime: number;
  totalMessages: number;
  totalVoiceInteractions: number;
  favoriteTopics: string[];
  learningProgress: Record<string, number>;
}
```

#### 6.2.2 接口实现示例

```typescript
// 用户服务API实现
export class UserServiceAPI implements UserAPI {
  private baseUrl: string;
  private apiVersion: string;
  
  constructor(baseUrl: string, apiVersion: string = API_VERSIONS.V1) {
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }
  
  async getUserInfo(userId: string): Promise<UserInfo> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateUserInfo(userId: string, data: Partial<UserInfo>): Promise<UserInfo> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update user info: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async createUser(data: CreateUserRequest): Promise<UserInfo> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
  }
  
  async getGrowthRecords(
    userId: string,
    params: GrowthRecordQuery
  ): Promise<GrowthRecord[]> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}/${userId}/growth-records?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get growth records: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].USERS}/${userId}/preferences`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(preferences),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update user preferences: ${response.statusText}`);
    }
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}
```

### 6.3 内容服务接口

#### 6.3.1 内容管理接口

```typescript
// 内容服务接口定义
interface ContentAPI {
  // 获取内容列表
  getContents(params: ContentQuery): Promise<Content[]>;
  
  // 获取内容详情
  getContentDetail(contentId: string): Promise<ContentDetail>;
  
  // 获取推荐内容
  getRecommendedContents(userId: string, params: RecommendationParams): Promise<Content[]>;
  
  // 获取文化内容
  getCulturalContents(params: CulturalContentQuery): Promise<CulturalContent[]>;
  
  // 记录内容交互
  recordContentInteraction(data: ContentInteractionData): Promise<void>;
  
  // 获取内容分类
  getContentCategories(): Promise<ContentCategory[]>;
}

// 内容类型定义
interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  growthStage: GrowthStage;
  difficulty: number;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentDetail extends Content {
  content: string;
  media?: MediaResource[];
  interactiveElements?: InteractiveElement[];
  relatedContents?: string[];
}

interface CulturalContent extends Content {
  culturalType: 'heluo' | 'luoyang' | 'henan' | 'china';
  culturalElements: CulturalElement[];
  historicalContext?: string;
}

interface MediaResource {
  type: 'image' | 'audio' | 'video' | 'animation';
  url: string;
  caption?: string;
  duration?: number;
}

interface InteractiveElement {
  type: 'quiz' | 'game' | 'story' | 'voice';
  data: any;
}

interface CulturalElement {
  name: string;
  description: string;
  images?: string[];
  audio?: string;
}

interface ContentQuery {
  category?: string;
  growthStage?: GrowthStage;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'popularity' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

interface RecommendationParams {
  limit?: number;
  excludeViewed?: boolean;
  basedOn?: 'history' | 'preferences' | 'growthStage';
}

interface ContentInteractionData {
  userId: string;
  contentId: string;
  interactionType: 'view' | 'like' | 'share' | 'complete';
  duration?: number;
  metadata?: Record<string, any>;
}

interface ContentCategory {
  id: string;
  name: string;
  icon?: string;
  subCategories?: ContentCategory[];
}
```

#### 6.3.2 接口实现示例

```typescript
// 内容服务API实现
export class ContentServiceAPI implements ContentAPI {
  private baseUrl: string;
  private apiVersion: string;
  
  constructor(baseUrl: string, apiVersion: string = API_VERSIONS.V1) {
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }
  
  async getContents(params: ContentQuery): Promise<Content[]> {
    const queryParams = this.buildQueryParams(params);
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get contents: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getContentDetail(contentId: string): Promise<ContentDetail> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}/${contentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get content detail: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getRecommendedContents(
    userId: string,
    params: RecommendationParams
  ): Promise<Content[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.excludeViewed) queryParams.append('excludeViewed', 'true');
    if (params.basedOn) queryParams.append('basedOn', params.basedOn);
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}/recommendations/${userId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get recommended contents: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getCulturalContents(
    params: CulturalContentQuery
  ): Promise<CulturalContent[]> {
    const queryParams = new URLSearchParams();
    if (params.culturalType) queryParams.append('culturalType', params.culturalType);
    if (params.growthStage) queryParams.append('growthStage', params.growthStage);
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}/cultural?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get cultural contents: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async recordContentInteraction(
    data: ContentInteractionData
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}/interactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to record content interaction: ${response.statusText}`);
    }
  }
  
  async getContentCategories(): Promise<ContentCategory[]> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].CONTENTS}/categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get content categories: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private buildQueryParams(params: ContentQuery): string {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.growthStage) queryParams.append('growthStage', params.growthStage);
    if (params.tags?.length) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return queryParams.toString();
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}
```

### 6.4 AI服务接口

#### 6.4.1 AI交互接口

```typescript
// AI服务接口定义
interface AIServiceAPI {
  // 发送文本消息
  sendTextMessage(request: TextMessageRequest): Promise<TextMessageResponse>;
  
  // 开始语音识别
  startVoiceRecognition(params: VoiceRecognitionParams): Promise<VoiceSession>;
  
  // 停止语音识别
  stopVoiceRecognition(sessionId: string): Promise<void>;
  
  // 获取语音识别结果
  getVoiceRecognitionResult(sessionId: string): Promise<VoiceRecognitionResult>;
  
  // 获取AI回复
  getAIResponse(sessionId: string): Promise<AIResponse>;
  
  // 获取对话历史
  getConversationHistory(userId: string, params: ConversationQuery): Promise<ConversationMessage[]>;
  
  // 清除对话历史
  clearConversationHistory(userId: string): Promise<void>;
  
  // 获取AI建议
  getAISuggestions(userId: string, context: SuggestionContext): Promise<AISuggestion[]>;
}

// AI交互类型定义
interface TextMessageRequest {
  userId: string;
  message: string;
  context?: ConversationContext;
  options?: MessageOptions;
}

interface TextMessageResponse {
  messageId: string;
  response: string;
  sessionId: string;
  timestamp: string;
  suggestions?: string[];
}

interface VoiceRecognitionParams {
  userId: string;
  language?: 'zh-CN' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
}

interface VoiceSession {
  sessionId: string;
  userId: string;
  status: 'listening' | 'processing' | 'completed' | 'error';
  startTime: string;
}

interface VoiceRecognitionResult {
  sessionId: string;
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: string;
}

interface AIResponse {
  sessionId: string;
  response: string;
  type: 'text' | 'voice' | 'mixed';
  voiceUrl?: string;
  suggestions?: string[];
  relatedContent?: string[];
  timestamp: string;
}

interface ConversationMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ConversationQuery {
  limit?: number;
  before?: string;
  after?: string;
}

interface SuggestionContext {
  currentTopic?: string;
  recentInteractions?: string[];
  growthStage?: GrowthStage;
  preferences?: UserPreferences;
}

interface AISuggestion {
  id: string;
  text: string;
  type: 'question' | 'topic' | 'action';
  priority: number;
}

interface ConversationContext {
  sessionId?: string;
  previousMessages?: ConversationMessage[];
  currentTopic?: string;
}

interface MessageOptions {
  temperature?: number;
  maxTokens?: number;
  includeVoice?: boolean;
}
```

#### 6.4.2 接口实现示例

```typescript
// AI服务API实现
export class AIService implements AIServiceAPI {
  private baseUrl: string;
  private apiVersion: string;
  
  constructor(baseUrl: string, apiVersion: string = API_VERSIONS.V1) {
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }
  
  async sendTextMessage(
    request: TextMessageRequest
  ): Promise<TextMessageResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to send text message: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async startVoiceRecognition(
    params: VoiceRecognitionParams
  ): Promise<VoiceSession> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/voice/start`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(params),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to start voice recognition: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async stopVoiceRecognition(sessionId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/voice/stop`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ sessionId }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to stop voice recognition: ${response.statusText}`);
    }
  }
  
  async getVoiceRecognitionResult(
    sessionId: string
  ): Promise<VoiceRecognitionResult> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/voice/result/${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get voice recognition result: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getAIResponse(sessionId: string): Promise<AIResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/response/${sessionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get AI response: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getConversationHistory(
    userId: string,
    params: ConversationQuery
  ): Promise<ConversationMessage[]> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.before) queryParams.append('before', params.before);
    if (params.after) queryParams.append('after', params.after);
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/conversations/${userId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get conversation history: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async clearConversationHistory(userId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/conversations/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to clear conversation history: ${response.statusText}`);
    }
  }
  
  async getAISuggestions(
    userId: string,
    context: SuggestionContext
  ): Promise<AISuggestion[]> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].AI}/suggestions/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(context),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get AI suggestions: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}
```

### 6.5 成长服务接口

#### 6.5.1 成长记录接口

```typescript
// 成长服务接口定义
interface GrowthServiceAPI {
  // 获取成长记录
  getGrowthRecords(userId: string, params: GrowthRecordQuery): Promise<GrowthRecord[]>;
  
  // 创建成长记录
  createGrowthRecord(userId: string, data: CreateGrowthRecordRequest): Promise<GrowthRecord>;
  
  // 更新成长记录
  updateGrowthRecord(recordId: string, data: Partial<GrowthRecord>): Promise<GrowthRecord>;
  
  // 删除成长记录
  deleteGrowthRecord(recordId: string): Promise<void>;
  
  // 获取成长阶段
  getGrowthStage(userId: string): Promise<GrowthStageInfo>;
  
  // 更新成长阶段
  updateGrowthStage(userId: string, stage: GrowthStage): Promise<GrowthStageInfo>;
  
  // 获取成长统计
  getGrowthStatistics(userId: string, params: StatisticsQuery): Promise<GrowthStatistics>;
  
  // 获取成长建议
  getGrowthRecommendations(userId: string): Promise<GrowthRecommendation[]>;
}

// 成长记录类型定义
interface GrowthRecord {
  id: string;
  userId: string;
  growthStage: GrowthStage;
  recordType: 'milestone' | 'achievement' | 'progress' | 'interaction';
  title: string;
  description: string;
  data?: Record<string, any>;
  media?: MediaResource[];
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateGrowthRecordRequest {
  growthStage: GrowthStage;
  recordType: GrowthRecord['recordType'];
  title: string;
  description: string;
  data?: Record<string, any>;
  media?: MediaResource[];
}

interface GrowthStageInfo {
  currentStage: GrowthStage;
  stageName: string;
  stageDescription: string;
  ageRange: string;
  characteristics: string[];
  nextStage?: GrowthStage;
  progressToNextStage: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  achievedAt?: string;
  targetDate?: string;
}

interface GrowthStatistics {
  totalRecords: number;
  recordsByType: Record<string, number>;
  recordsByStage: Record<GrowthStage, number>;
  timeRange: {
    start: string;
    end: string;
  };
  trends: {
    date: string;
    count: number;
  }[];
  topAchievements: GrowthRecord[];
}

interface GrowthRecommendation {
  id: string;
  type: 'content' | 'activity' | 'milestone';
  title: string;
  description: string;
  priority: number;
  estimatedImpact: string;
  relatedContentId?: string;
}

interface StatisticsQuery {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}
```

#### 6.5.2 接口实现示例

```typescript
// 成长服务API实现
export class GrowthService implements GrowthServiceAPI {
  private baseUrl: string;
  private apiVersion: string;
  
  constructor(baseUrl: string, apiVersion: string = API_VERSIONS.V1) {
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }
  
  async getGrowthRecords(
    userId: string,
    params: GrowthRecordQuery
  ): Promise<GrowthRecord[]> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.recordType) queryParams.append('recordType', params.recordType);
    if (params.growthStage) queryParams.append('growthStage', params.growthStage);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/records/${userId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get growth records: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async createGrowthRecord(
    userId: string,
    data: CreateGrowthRecordRequest
  ): Promise<GrowthRecord> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/records/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to create growth record: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateGrowthRecord(
    recordId: string,
    data: Partial<GrowthRecord>
  ): Promise<GrowthRecord> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/records/${recordId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update growth record: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async deleteGrowthRecord(recordId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/records/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to delete growth record: ${response.statusText}`);
    }
  }
  
  async getGrowthStage(userId: string): Promise<GrowthStageInfo> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/stage/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get growth stage: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateGrowthStage(
    userId: string,
    stage: GrowthStage
  ): Promise<GrowthStageInfo> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/stage/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ stage }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update growth stage: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getGrowthStatistics(
    userId: string,
    params: StatisticsQuery
  ): Promise<GrowthStatistics> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/statistics/${userId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get growth statistics: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getGrowthRecommendations(
    userId: string
  ): Promise<GrowthRecommendation[]> {
    const response = await fetch(
      `${this.baseUrl}${API_PATHS[this.apiVersion].GROWTH}/recommendations/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get growth recommendations: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}
```

### 6.6 接口错误处理

```typescript
// 统一错误处理
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 错误响应类型
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

// 错误码定义
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  
  // 用户服务错误
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  
  // 内容服务错误
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  INVALID_CONTENT_DATA: 'INVALID_CONTENT_DATA',
  
  // AI服务错误
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  VOICE_RECOGNITION_FAILED: 'VOICE_RECOGNITION_FAILED',
  
  // 成长服务错误
  GROWTH_RECORD_NOT_FOUND: 'GROWTH_RECORD_NOT_FOUND',
  INVALID_GROWTH_STAGE: 'INVALID_GROWTH_STAGE',
} as const;

// 错误处理中间件
export async function handleAPIResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let errorData: ErrorResponse;
    
    try {
      errorData = await response.json();
    } catch {
      throw new APIError(
        response.status,
        response.statusText || '请求失败'
      );
    }
    
    throw new APIError(
      response.status,
      errorData.error.message,
      errorData.error.details
    );
  }
  
  return response.json();
}

// 重试机制
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError!;
}
```

---

## 7. 用户信息及全局形象系统

### 7.0 角色配置定义

YYC³小语AI应用支持多个角色配置，根据用户性别自动选择合适的角色形象。当前系统包含两个核心角色：

**沫语（小语）- 女性角色**
- ID: xiaoyu
- 默认名称: 沫语
- 性别: 女
- 年龄: 1岁
- 生日: 农历十一月初十 / 阳历2024年12月10日
- 星座: ♐ 射手座
- 主题风格: 粉红/蓝色洛丽塔
- 头像路径: `/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png`

**沫言（小言）- 男性角色**
- ID: xiaoyan
- 默认名称: 沫言
- 性别: 男
- 年龄: 10岁
- 生日: 农历八月十九 / 阳历2015年10月1日
- 星座: ♎ 天秤座
- 主题风格: 休闲/酷炫风格
- 头像路径: `/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png`

```typescript
// 角色配置类型定义
interface CharacterConfig {
  id: string;
  name: string;
  defaultName: string;
  gender: 'male' | 'female';
  age: number;
  birthday: {
    lunar: string;
    solar: string;
  };
  zodiac: string;
  themes: CharacterTheme[];
  expressions: CharacterExpression[];
  personality: string[];
  voiceSettings: VoiceSettings;
  avatarPath: string;
  images: CharacterImages;
}

// 角色主题配置
interface CharacterTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
  };
}

// 角色表情配置
interface CharacterExpression {
  id: string;
  name: string;
  description: string;
  image: string;
  emotion: 'happy' | 'sad' | 'excited' | 'calm' | 'surprised' | 'thinking';
}

// 语音设置
interface VoiceSettings {
  voiceType: string;
  pitch: number;
  speed: number;
  volume: number;
  tone: string;
}

// 角色图片路径
interface CharacterImages {
  homePage: string;
  growthRecord: string;
  profileInfo: string;
  settings: string;
  aiAvatar: string;
  jointAvatar: string;
  additionalImages: string[];
}

// 沫语（小语）角色配置
const xiaoyuConfig: CharacterConfig = {
  id: 'xiaoyu',
  name: '小语',
  defaultName: '沫语',
  gender: 'female',
  age: 1,
  birthday: {
    lunar: '十一月初十',
    solar: '2024-12-10'
  },
  zodiac: '射手座',
  themes: [
    {
      id: 'xiaoyu-pink',
      name: '粉红洛丽塔',
      description: '沫语的粉红洛丽塔主题',
      colors: {
        primary: '#FFB6C1',
        secondary: '#FFC0CB',
        accent: '#FF69B4',
        background: '#FFF0F5',
        surface: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    }
  ],
  expressions: [
    {
      id: 'xiaoyu-happy',
      name: '开心',
      description: '沫语开心的表情',
      image: '/role-photos/girl/expressions/xiaoyu-happy.png',
      emotion: 'happy'
    }
  ],
  personality: ['活泼可爱', '好奇心强', '喜欢探索', '富有想象力'],
  voiceSettings: {
    voiceType: 'cute-female',
    pitch: 1.2,
    speed: 1.0,
    volume: 0.8,
    tone: 'sweet'
  },
  avatarPath: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
  images: {
    homePage: '/role-photos/girl/xiaoyu-lolita-pink-001.png',
    growthRecord: '/role-photos/girl/xiaoyu-lolita-pink-002.png',
    profileInfo: '/role-photos/girl/xiaoyu-lolita-pink-003.png',
    settings: '/role-photos/girl/xiaoyu-lolita-pink-005.png',
    aiAvatar: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
    jointAvatar: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/role-photos/girl/xiaoyu-lolita-pink-006.png'
    ]
  }
};

// 沫言（小言）角色配置
const xiaoyanConfig: CharacterConfig = {
  id: 'xiaoyan',
  name: '小言',
  defaultName: '沫言',
  gender: 'male',
  age: 10,
  birthday: {
    lunar: '八月十九',
    solar: '2015-10-01'
  },
  zodiac: '天秤座',
  themes: [
    {
      id: 'xiaoyan-casual',
      name: '休闲酷炫',
      description: '沫言的休闲酷炫主题',
      colors: {
        primary: '#4A90E2',
        secondary: '#5DADE2',
        accent: '#3498DB',
        background: '#EBF5FB',
        surface: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666'
      },
      typography: {
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      }
    }
  ],
  expressions: [
    {
      id: 'xiaoyan-happy',
      name: '开心',
      description: '沫言开心的表情',
      image: '/role-photos/boy/expressions/xiaoyan-happy.png',
      emotion: 'happy'
    }
  ],
  personality: ['阳光开朗', '乐于助人', '善于思考', '富有创造力'],
  voiceSettings: {
    voiceType: 'cheerful-male',
    pitch: 1.0,
    speed: 1.0,
    volume: 0.9,
    tone: 'energetic'
  },
  avatarPath: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
  images: {
    homePage: '/role-photos/boy/xiaoyan-casual-001.png',
    growthRecord: '/role-photos/boy/xiaoyan-casual-002.png',
    profileInfo: '/role-photos/boy/xiaoyan-casual-003.png',
    settings: '/role-photos/boy/xiaoyan-casual-005.png',
    aiAvatar: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
    jointAvatar: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/role-photos/boy/xiaoyan-cool-001.png',
      '/role-photos/boy/xiaoyan-cool-002.png',
      '/role-photos/boy/xiaoyan-formal-001.png',
      '/role-photos/boy/xiaoyan-formal-002.png',
      '/role-photos/boy/xiaoyan-formal-003.png'
    ]
  }
};

// 性别自动映射函数
function getCharacterByGender(gender: 'male' | 'female'): CharacterConfig {
  switch(gender) {
    case 'male':
      return xiaoyanConfig;
    case 'female':
      return xiaoyuConfig;
    default:
      return xiaoyuConfig;
  }
}

function getUserRoleImages(gender: 'male' | 'female'): CharacterImages {
  const character = getCharacterByGender(gender);
  return character.images;
}

function getUserRoleAvatar(gender: 'male' | 'female'): string {
  const character = getCharacterByGender(gender);
  return character.avatarPath;
}

// 角色图片路径映射表
const CHARACTER_IMAGE_MAPPING: Record<string, Record<'male' | 'female', string>> = {
  homePage: {
    male: '/role-photos/boy/xiaoyan-casual-001.png',
    female: '/role-photos/girl/xiaoyu-lolita-pink-001.png'
  },
  growthRecord: {
    male: '/role-photos/boy/xiaoyan-casual-002.png',
    female: '/role-photos/girl/xiaoyu-lolita-pink-002.png'
  },
  profileInfo: {
    male: '/role-photos/boy/xiaoyan-casual-003.png',
    female: '/role-photos/girl/xiaoyu-lolita-pink-003.png'
  },
  settings: {
    male: '/role-photos/boy/xiaoyan-casual-005.png',
    female: '/role-photos/girl/xiaoyu-lolita-pink-005.png'
  },
  aiAvatar: {
    male: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
    female: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png'
  },
  jointAvatar: {
    male: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    female: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png'
  }
};
```

### 7.1 用户信息架构

#### 7.1.1 用户信息数据模型

```typescript
// 用户信息完整数据模型
interface UserInformation {
  // 基础信息
  basicInfo: {
    id: string;
    name: string;
    nickname?: string;
    age: number;
    gender?: 'male' | 'female' | 'other';
    avatar?: string;
    birthDate?: string;
  };
  
  // 成长阶段信息
  growthInfo: {
    currentStage: GrowthStage;
    stageName: string;
    stageDescription: string;
    ageRange: string;
    characteristics: string[];
    progressToNextStage: number;
    milestones: Milestone[];
  };
  
  // 偏好设置
  preferences: {
    language: 'zh-CN' | 'en-US';
    theme: 'light' | 'dark' | 'auto';
    voiceEnabled: boolean;
    voiceSpeed: number;
    fontSize: 'small' | 'medium' | 'large';
    culturalPreference?: string[];
    contentPreference?: string[];
  };
  
  // 统计信息
  statistics: {
    totalInteractionTime: number;
    totalMessages: number;
    totalVoiceInteractions: number;
    favoriteTopics: string[];
    learningProgress: Record<string, number>;
    lastActiveTime: string;
  };
  
  // 全局形象配置
  globalAvatar: {
    avatarId: string;
    avatarName: string;
    avatarImage: string;
    avatarType: '2d' | '3d' | 'emoji';
    customization: AvatarCustomization;
  };
  
  // 关系信息
  relationships: {
    guardians?: Guardian[];
    friends?: Friend[];
    groups?: Group[];
  };
  
  // 元数据
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

// 头像自定义配置
interface AvatarCustomization {
  hairColor?: string;
  hairStyle?: string;
  skinColor?: string;
  eyeColor?: string;
  clothing?: string;
  accessories?: string[];
  background?: string;
}

// 监护人信息
interface Guardian {
  id: string;
  name: string;
  relationship: 'parent' | 'grandparent' | 'teacher' | 'other';
  contact?: string;
  permissions: GuardianPermission[];
}

interface GuardianPermission {
  type: 'view' | 'edit' | 'manage';
  scope: string[];
}

// 好友信息
interface Friend {
  id: string;
  name: string;
  avatar?: string;
  relationshipLevel: number;
  lastInteraction?: string;
}

// 群组信息
interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  role: 'member' | 'admin' | 'owner';
}
```

#### 7.1.2 用户信息管理器

```typescript
// 用户信息管理器
export class UserInformationManager {
  private storageKey = 'user_information';
  private apiService: UserServiceAPI;
  
  constructor(apiService: UserServiceAPI) {
    this.apiService = apiService;
  }
  
  // 获取完整用户信息
  async getUserInformation(userId: string): Promise<UserInformation> {
    try {
      // 先从本地存储获取
      const localInfo = this.getLocalUserInformation();
      if (localInfo && localInfo.basicInfo.id === userId) {
        return localInfo;
      }
      
      // 从API获取
      const userInfo = await this.apiService.getUserInfo(userId);
      const userInformation = this.transformToUserInformation(userInfo);
      
      // 保存到本地存储
      this.saveLocalUserInformation(userInformation);
      
      return userInformation;
    } catch (error) {
      console.error('Failed to get user information:', error);
      throw error;
    }
  }
  
  // 更新用户信息
  async updateUserInformation(
    userId: string,
    updates: Partial<UserInformation>
  ): Promise<UserInformation> {
    try {
      const currentInfo = await this.getUserInformation(userId);
      const updatedInfo = { ...currentInfo, ...updates };
      
      // 转换为API格式并更新
      const apiData = this.transformToAPIFormat(updatedInfo);
      await this.apiService.updateUserInfo(userId, apiData);
      
      // 保存到本地存储
      this.saveLocalUserInformation(updatedInfo);
      
      return updatedInfo;
    } catch (error) {
      console.error('Failed to update user information:', error);
      throw error;
    }
  }
  
  // 更新全局头像
  async updateGlobalAvatar(
    userId: string,
    avatar: UserInformation['globalAvatar']
  ): Promise<UserInformation> {
    try {
      const currentInfo = await this.getUserInformation(userId);
      const updatedInfo = {
        ...currentInfo,
        globalAvatar: avatar,
      };
      
      // 保存到本地存储
      this.saveLocalUserInformation(updatedInfo);
      
      return updatedInfo;
    } catch (error) {
      console.error('Failed to update global avatar:', error);
      throw error;
    }
  }
  
  // 更新偏好设置
  async updatePreferences(
    userId: string,
    preferences: Partial<UserInformation['preferences']>
  ): Promise<UserInformation> {
    try {
      const currentInfo = await this.getUserInformation(userId);
      const updatedInfo = {
        ...currentInfo,
        preferences: { ...currentInfo.preferences, ...preferences },
      };
      
      // 转换为API格式并更新
      await this.apiService.updateUserPreferences(userId, updatedInfo.preferences);
      
      // 保存到本地存储
      this.saveLocalUserInformation(updatedInfo);
      
      return updatedInfo;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
  
  // 获取本地用户信息
  private getLocalUserInformation(): UserInformation | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
  
  // 保存本地用户信息
  private saveLocalUserInformation(info: UserInformation): void {
    localStorage.setItem(this.storageKey, JSON.stringify(info));
  }
  
  // 转换为用户信息格式
  private transformToUserInformation(apiData: any): UserInformation {
    // 根据性别获取角色配置
    const characterConfig = apiData.gender === 'male' 
      ? xiaoyanConfig 
      : xiaoyuConfig; // 默认为女性角色
    
    return {
      basicInfo: {
        id: apiData.id,
        name: apiData.name,
        nickname: apiData.nickname,
        age: apiData.age,
        gender: apiData.gender,
        avatar: characterConfig.avatarPath, // 使用角色配置中的头像路径
        birthDate: apiData.birthDate,
      },
      growthInfo: {
        currentStage: apiData.growthStage,
        stageName: this.getStageName(apiData.growthStage),
        stageDescription: this.getStageDescription(apiData.growthStage),
        ageRange: this.getStageAgeRange(apiData.growthStage),
        characteristics: this.getStageCharacteristics(apiData.growthStage),
        progressToNextStage: apiData.progressToNextStage || 0,
        milestones: apiData.milestones || [],
      },
      preferences: {
        language: apiData.preferences?.language || 'zh-CN',
        theme: apiData.preferences?.theme || 'light',
        voiceEnabled: apiData.preferences?.voiceEnabled ?? true,
        voiceSpeed: apiData.preferences?.voiceSpeed || 1.0,
        fontSize: apiData.preferences?.fontSize || 'medium',
        culturalPreference: apiData.preferences?.culturalPreference,
        contentPreference: apiData.preferences?.contentPreference,
      },
      statistics: {
        totalInteractionTime: apiData.statistics?.totalInteractionTime || 0,
        totalMessages: apiData.statistics?.totalMessages || 0,
        totalVoiceInteractions: apiData.statistics?.totalVoiceInteractions || 0,
        favoriteTopics: apiData.statistics?.favoriteTopics || [],
        learningProgress: apiData.statistics?.learningProgress || {},
        lastActiveTime: apiData.statistics?.lastActiveTime || new Date().toISOString(),
      },
      globalAvatar: {
        avatarId: characterConfig.id,
        avatarName: characterConfig.defaultName,
        avatarImage: characterConfig.avatarPath, // 使用角色配置中的头像路径
        avatarType: '2d',
        customization: apiData.globalAvatar?.customization || {},
      },
      relationships: {
        guardians: apiData.relationships?.guardians,
        friends: apiData.relationships?.friends,
        groups: apiData.relationships?.groups,
      },
      metadata: {
        createdAt: apiData.createdAt,
        updatedAt: apiData.updatedAt,
        version: apiData.version || '1.0',
      },
    };
  }
  
  // 转换为API格式
  private transformToAPIFormat(info: UserInformation): any {
    return {
      id: info.basicInfo.id,
      name: info.basicInfo.name,
      nickname: info.basicInfo.nickname,
      age: info.basicInfo.age,
      gender: info.basicInfo.gender,
      avatar: info.basicInfo.avatar,
      birthDate: info.basicInfo.birthDate,
      growthStage: info.growthInfo.currentStage,
      preferences: info.preferences,
      statistics: info.statistics,
      globalAvatar: info.globalAvatar,
      relationships: info.relationships,
      createdAt: info.metadata.createdAt,
      updatedAt: new Date().toISOString(),
      version: info.metadata.version,
    };
  }
  
  // 获取阶段名称
  private getStageName(stage: GrowthStage): string {
    const stageNames: Record<GrowthStage, string> = {
      'seedling': '幼苗期',
      'sprout': '萌芽期',
      'sapling': '树苗期',
      'young_tree': '小树期',
      'mature_tree': '成树期',
    };
    return stageNames[stage];
  }
  
  // 获取阶段描述
  private getStageDescription(stage: GrowthStage): string {
    const descriptions: Record<GrowthStage, string> = {
      'seedling': '0-3岁，探索世界的开始',
      'sprout': '3-6岁，好奇心旺盛',
      'sapling': '6-9岁，学习基础',
      'young_tree': '9-12岁，能力发展',
      'mature_tree': '12-15岁，独立思考',
    };
    return descriptions[stage];
  }
  
  // 获取阶段年龄范围
  private getStageAgeRange(stage: GrowthStage): string {
    const ageRanges: Record<GrowthStage, string> = {
      'seedling': '0-3岁',
      'sprout': '3-6岁',
      'sapling': '6-9岁',
      'young_tree': '9-12岁',
      'mature_tree': '12-15岁',
    };
    return ageRanges[stage];
  }
  
  // 获取阶段特征
  private getStageCharacteristics(stage: GrowthStage): string[] {
    const characteristics: Record<GrowthStage, string[]> = {
      'seedling': ['感官发展', '语言启蒙', '情感依恋'],
      'sprout': ['好奇心强', '模仿学习', '社交萌芽'],
      'sapling': ['逻辑思维', '知识积累', '规则意识'],
      'young_tree': ['独立思考', '兴趣培养', '团队合作'],
      'mature_tree': ['批判性思维', '自我认知', '价值观念'],
    };
    return characteristics[stage];
  }
}
```

### 7.2 全局形象系统

#### 7.2.1 头像系统架构

```typescript
// 头像系统配置
interface AvatarSystemConfig {
  avatarTypes: AvatarType[];
  defaultAvatar: string;
  customizationOptions: CustomizationOption[];
  storagePath: string;
}

interface AvatarType {
  id: string;
  name: string;
  type: '2d' | '3d' | 'emoji';
  description: string;
  thumbnail: string;
  previewImages: string[];
}

interface CustomizationOption {
  category: string;
  name: string;
  options: CustomizationItem[];
}

interface CustomizationItem {
  id: string;
  name: string;
  value: string;
  image?: string;
  price?: number;
  unlockCondition?: string;
}

// 头像系统管理器
export class AvatarSystemManager {
  private config: AvatarSystemConfig;
  private userAvatarManager: UserAvatarManager;
  
  constructor(config: AvatarSystemConfig) {
    this.config = config;
    this.userAvatarManager = new UserAvatarManager(config.storagePath);
  }
  
  // 获取可用头像类型
  getAvatarTypes(): AvatarType[] {
    return this.config.avatarTypes;
  }
  
  // 获取自定义选项
  getCustomizationOptions(): CustomizationOption[] {
    return this.config.customizationOptions;
  }
  
  // 创建自定义头像
  async createCustomAvatar(
    userId: string,
    baseAvatarId: string,
    customization: AvatarCustomization
  ): Promise<UserInformation['globalAvatar']> {
    try {
      // 验证自定义选项
      this.validateCustomization(customization);
      
      // 生成自定义头像
      const customAvatar = await this.generateCustomAvatar(
        baseAvatarId,
        customization
      );
      
      // 保存用户头像
      await this.userAvatarManager.saveUserAvatar(userId, customAvatar);
      
      return customAvatar;
    } catch (error) {
      console.error('Failed to create custom avatar:', error);
      throw error;
    }
  }
  
  // 获取用户头像
  async getUserAvatar(userId: string): Promise<UserInformation['globalAvatar']> {
    try {
      return await this.userAvatarManager.getUserAvatar(userId);
    } catch (error) {
      console.error('Failed to get user avatar:', error);
      throw error;
    }
  }
  
  // 更新用户头像
  async updateUserAvatar(
    userId: string,
    avatar: UserInformation['globalAvatar']
  ): Promise<void> {
    try {
      await this.userAvatarManager.saveUserAvatar(userId, avatar);
    } catch (error) {
      console.error('Failed to update user avatar:', error);
      throw error;
    }
  }
  
  // 生成自定义头像
  private async generateCustomAvatar(
    baseAvatarId: string,
    customization: AvatarCustomization
  ): Promise<UserInformation['globalAvatar']> {
    // 这里可以调用图像生成服务
    // 例如使用Canvas或第三方API生成自定义头像
    
    const avatarId = `custom_${Date.now()}`;
    const avatarName = `自定义头像_${new Date().toLocaleDateString()}`;
    
    return {
      avatarId,
      avatarName,
      avatarImage: `/images/avatars/${avatarId}.png`,
      avatarType: '2d',
      customization,
    };
  }
  
  // 验证自定义选项
  private validateCustomization(customization: AvatarCustomization): void {
    const validCategories = this.config.customizationOptions.map(opt => opt.category);
    
    Object.keys(customization).forEach(key => {
      if (!validCategories.includes(key)) {
        throw new Error(`Invalid customization category: ${key}`);
      }
    });
  }
}

// 用户头像管理器
class UserAvatarManager {
  private storagePath: string;
  
  constructor(storagePath: string) {
    this.storagePath = storagePath;
  }
  
  async getUserAvatar(userId: string): Promise<UserInformation['globalAvatar']> {
    const avatarData = localStorage.getItem(`${this.storagePath}/${userId}`);
    
    if (!avatarData) {
      return this.getDefaultAvatar();
    }
    
    return JSON.parse(avatarData);
  }
  
  async saveUserAvatar(
    userId: string,
    avatar: UserInformation['globalAvatar']
  ): Promise<void> {
    localStorage.setItem(`${this.storagePath}/${userId}`, JSON.stringify(avatar));
  }
  
  private getDefaultAvatar(): UserInformation['globalAvatar'] {
    return {
      avatarId: 'default',
      avatarName: '默认头像',
      avatarImage: '/images/avatars/default.png',
      avatarType: '2d',
      customization: {},
    };
  }
}
```

#### 7.2.2 头像配置数据

```typescript
// 头像系统配置数据
export const AVATAR_SYSTEM_CONFIG: AvatarSystemConfig = {
  avatarTypes: [
    {
      id: '2d_cartoon',
      name: '2D卡通',
      type: '2d',
      description: '可爱的2D卡通风格头像',
      thumbnail: '/images/avatars/types/2d_cartoon_thumb.png',
      previewImages: [
        '/images/avatars/types/2d_cartoon_1.png',
        '/images/avatars/types/2d_cartoon_2.png',
        '/images/avatars/types/2d_cartoon_3.png',
      ],
    },
    {
      id: '3d_realistic',
      name: '3D写实',
      type: '3d',
      description: '逼真的3D头像',
      thumbnail: '/images/avatars/types/3d_realistic_thumb.png',
      previewImages: [
        '/images/avatars/types/3d_realistic_1.png',
        '/images/avatars/types/3d_realistic_2.png',
      ],
    },
    {
      id: 'emoji_style',
      name: '表情符号',
      type: 'emoji',
      description: '可爱的表情符号风格',
      thumbnail: '/images/avatars/types/emoji_style_thumb.png',
      previewImages: [
        '/images/avatars/types/emoji_style_1.png',
        '/images/avatars/types/emoji_style_2.png',
      ],
    },
  ],
  defaultAvatar: '/images/avatars/default.png',
  customizationOptions: [
    {
      category: 'hairColor',
      name: '发色',
      options: [
        { id: 'black', name: '黑色', value: '#000000' },
        { id: 'brown', name: '棕色', value: '#8B4513' },
        { id: 'blonde', name: '金色', value: '#FFD700' },
        { id: 'red', name: '红色', value: '#FF0000' },
        { id: 'blue', name: '蓝色', value: '#0000FF' },
      ],
    },
    {
      category: 'hairStyle',
      name: '发型',
      options: [
        { id: 'short', name: '短发', value: 'short' },
        { id: 'long', name: '长发', value: 'long' },
        { id: 'curly', name: '卷发', value: 'curly' },
        { id: 'ponytail', name: '马尾', value: 'ponytail' },
      ],
    },
    {
      category: 'skinColor',
      name: '肤色',
      options: [
        { id: 'fair', name: '白皙', value: '#FFE4C4' },
        { id: 'medium', name: '中等', value: '#D2B48C' },
        { id: 'dark', name: '深色', value: '#8B4513' },
      ],
    },
    {
      category: 'eyeColor',
      name: '眼睛颜色',
      options: [
        { id: 'brown', name: '棕色', value: '#8B4513' },
        { id: 'blue', name: '蓝色', value: '#0000FF' },
        { id: 'green', name: '绿色', value: '#008000' },
        { id: 'black', name: '黑色', value: '#000000' },
      ],
    },
    {
      category: 'clothing',
      name: '服装',
      options: [
        { id: 'casual', name: '休闲', value: 'casual' },
        { id: 'formal', name: '正式', value: 'formal' },
        { id: 'sport', name: '运动', value: 'sport' },
        { id: 'traditional', name: '传统', value: 'traditional' },
      ],
    },
    {
      category: 'accessories',
      name: '配饰',
      options: [
        { id: 'glasses', name: '眼镜', value: 'glasses' },
        { id: 'hat', name: '帽子', value: 'hat' },
        { id: 'earring', name: '耳环', value: 'earring' },
        { id: 'none', name: '无', value: 'none' },
      ],
    },
    {
      category: 'background',
      name: '背景',
      options: [
        { id: 'gradient_blue', name: '蓝色渐变', value: 'gradient_blue' },
        { id: 'gradient_pink', name: '粉色渐变', value: 'gradient_pink' },
        { id: 'solid_white', name: '纯白', value: 'solid_white' },
        { id: 'nature', name: '自然', value: 'nature' },
      ],
    },
  ],
  storagePath: 'user_avatars',
};
```

---

## 8. 信息映射系统

### 8.1 系统架构设计

#### 8.1.1 信息映射架构

```
┌─────────────────────────────────────────────────────────┐
│              Information Mapping System                  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Content      │  │ User         │  │ Context      │  │
│  │ Mapping      │  │ Mapping      │  │ Mapping      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│              Mapping Engine Core                        │
│  - Rule Engine    - Recommendation Engine               │
│  - Adaptation     - Personalization                     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│              Data Storage Layer                         │
│  - Content DB    - User Profile DB  - Mapping Cache    │
└─────────────────────────────────────────────────────────┘
```

#### 8.1.2 核心数据结构

```typescript
// 内容映射配置
interface ContentMappingConfig {
  contentId: string;
  contentType: 'story' | 'game' | 'knowledge' | 'activity';
  targetAgeRange: AgeRange;
  targetGrowthStages: GrowthStage[];
  difficultyLevel: DifficultyLevel;
  culturalElements: CulturalElement[];
  keywords: string[];
  tags: string[];
  prerequisites?: string[];
  relatedContentIds: string[];
}

// 用户上下文映射
interface UserContextMapping {
  userId: string;
  currentGrowthStage: GrowthStage;
  recentInteractions: InteractionHistory[];
  preferences: UserPreferences;
  learningProgress: LearningProgress;
  culturalInterests: CulturalElement[];
  timeContext: TimeContext;
}

// 映射结果
interface MappingResult {
  contentId: string;
  matchScore: number;
  adaptationReasons: AdaptationReason[];
  personalizedElements: PersonalizedElement[];
  recommendedActions: RecommendedAction[];
}

// 年龄范围
interface AgeRange {
  min: number;
  max: number;
}

// 难度级别
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// 文化元素
interface CulturalElement {
  id: string;
  name: string;
  category: 'heluo' | 'luoyang' | 'traditional' | 'modern';
  description: string;
}

// 交互历史
interface InteractionHistory {
  contentId: string;
  interactionType: 'view' | 'complete' | 'like' | 'share';
  timestamp: Date;
  duration?: number;
  rating?: number;
}

// 用户偏好
interface UserPreferences {
  contentTypes: string[];
  difficultyLevel: DifficultyLevel;
  culturalInterests: string[];
  timePreferences: TimePreference[];
}

// 学习进度
interface LearningProgress {
  completedContents: string[];
  inProgressContents: Map<string, number>;
  masteredSkills: string[];
  areasForImprovement: string[];
}

// 时间上下文
interface TimeContext {
  currentHour: number;
  dayOfWeek: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isHoliday: boolean;
}

// 适配原因
interface AdaptationReason {
  type: 'age' | 'growth_stage' | 'preference' | 'cultural' | 'time';
  description: string;
  weight: number;
}

// 个性化元素
interface PersonalizedElement {
  type: 'content' | 'ui' | 'interaction' | 'feedback';
  description: string;
  implementation: string;
}

// 推荐动作
interface RecommendedAction {
  action: 'show' | 'highlight' | 'suggest' | 'hide';
  target: string;
  reason: string;
  priority: number;
}

// 时间偏好
interface TimePreference {
  hour: number;
  preferredContentTypes: string[];
}
```

### 8.2 映射引擎实现

#### 8.2.1 内容映射管理器

```typescript
export class ContentMappingManager {
  private mappingRules: MappingRule[];
  private contentDatabase: ContentDatabase;
  private userContextCache: Map<string, UserContextMapping>;

  constructor(config: MappingEngineConfig) {
    this.mappingRules = config.mappingRules;
    this.contentDatabase = config.contentDatabase;
    this.userContextCache = new Map();
  }

  // 获取用户上下文
  async getUserContext(userId: string): Promise<UserContextMapping> {
    if (this.userContextCache.has(userId)) {
      return this.userContextCache.get(userId)!;
    }

    const userProfile = await this.getUserProfile(userId);
    const interactions = await this.getUserInteractions(userId);
    const preferences = await this.getUserPreferences(userId);
    const progress = await this.getLearningProgress(userId);

    const context: UserContextMapping = {
      userId,
      currentGrowthStage: userProfile.growthStage,
      recentInteractions: interactions,
      preferences,
      learningProgress: progress,
      culturalInterests: userProfile.culturalInterests || [],
      timeContext: this.getCurrentTimeContext(),
    };

    this.userContextCache.set(userId, context);
    return context;
  }

  // 映射内容到用户
  async mapContentToUser(
    userId: string,
    contentIds: string[]
  ): Promise<MappingResult[]> {
    const context = await this.getUserContext(userId);
    const results: MappingResult[] = [];

    for (const contentId of contentIds) {
      const content = await this.contentDatabase.getContent(contentId);
      if (!content) continue;

      const mappingResult = await this.evaluateContentMapping(
        content,
        context
      );

      results.push(mappingResult);
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  // 推荐内容
  async recommendContent(
    userId: string,
    count: number = 10
  ): Promise<MappingResult[]> {
    const context = await this.getUserContext(userId);
    const candidateContents = await this.getCandidateContents(context);

    const mappedResults = await Promise.all(
      candidateContents.map(content =>
        this.evaluateContentMapping(content, context)
      )
    );

    return mappedResults
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, count);
  }

  // 评估内容映射
  private async evaluateContentMapping(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): Promise<MappingResult> {
    const adaptationReasons: AdaptationReason[] = [];
    let matchScore = 0;

    // 年龄匹配
    const ageMatch = this.evaluateAgeMatch(content, context);
    matchScore += ageMatch.score;
    adaptationReasons.push(...ageMatch.reasons);

    // 成长阶段匹配
    const stageMatch = this.evaluateGrowthStageMatch(content, context);
    matchScore += stageMatch.score;
    adaptationReasons.push(...stageMatch.reasons);

    // 偏好匹配
    const preferenceMatch = this.evaluatePreferenceMatch(content, context);
    matchScore += preferenceMatch.score;
    adaptationReasons.push(...preferenceMatch.reasons);

    // 文化元素匹配
    const culturalMatch = this.evaluateCulturalMatch(content, context);
    matchScore += culturalMatch.score;
    adaptationReasons.push(...culturalMatch.reasons);

    // 时间上下文匹配
    const timeMatch = this.evaluateTimeMatch(content, context);
    matchScore += timeMatch.score;
    adaptationReasons.push(...timeMatch.reasons);

    // 生成个性化元素
    const personalizedElements = this.generatePersonalizedElements(
      content,
      context,
      adaptationReasons
    );

    // 生成推荐动作
    const recommendedActions = this.generateRecommendedActions(
      matchScore,
      content,
      context
    );

    return {
      contentId: content.contentId,
      matchScore: Math.min(matchScore, 100),
      adaptationReasons,
      personalizedElements,
      recommendedActions,
    };
  }

  // 评估年龄匹配
  private evaluateAgeMatch(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): { score: number; reasons: AdaptationReason[] } {
    const userProfile = await this.getUserProfile(context.userId);
    const userAge = userProfile.age;
    const { min, max } = content.targetAgeRange;

    if (userAge >= min && userAge <= max) {
      return {
        score: 30,
        reasons: [
          {
            type: 'age',
            description: `用户年龄${userAge}岁在内容目标年龄范围${min}-${max}岁内`,
            weight: 30,
          },
        ],
      };
    }

    const distance = Math.min(
      Math.abs(userAge - min),
      Math.abs(userAge - max)
    );

    return {
      score: Math.max(0, 30 - distance * 2),
      reasons: [
        {
          type: 'age',
          description: `用户年龄${userAge}岁与内容目标年龄范围${min}-${max}岁相差${distance}岁`,
          weight: Math.max(0, 30 - distance * 2),
        },
      ],
    };
  }

  // 评估成长阶段匹配
  private evaluateGrowthStageMatch(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): { score: number; reasons: AdaptationReason[] } {
    const isStageMatch = content.targetGrowthStages.includes(
      context.currentGrowthStage
    );

    if (isStageMatch) {
      return {
        score: 25,
        reasons: [
          {
            type: 'growth_stage',
            description: `内容适配用户当前成长阶段：${context.currentGrowthStage}`,
            weight: 25,
          },
        ],
      };
    }

    return {
      score: 10,
      reasons: [
        {
          type: 'growth_stage',
          description: `内容目标成长阶段与用户当前阶段不完全匹配`,
          weight: 10,
        },
      ],
    };
  }

  // 评估偏好匹配
  private evaluatePreferenceMatch(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): { score: number; reasons: AdaptationReason[] } {
    const matchedTypes = content.contentType
      ? context.preferences.contentTypes.includes(content.contentType)
      : false;

    const matchedDifficulty =
      content.difficultyLevel === context.preferences.difficultyLevel;

    let score = 0;
    const reasons: AdaptationReason[] = [];

    if (matchedTypes) {
      score += 15;
      reasons.push({
        type: 'preference',
        description: `内容类型${content.contentType}符合用户偏好`,
        weight: 15,
      });
    }

    if (matchedDifficulty) {
      score += 10;
      reasons.push({
        type: 'preference',
        description: `难度级别${content.difficultyLevel}符合用户偏好`,
        weight: 10,
      });
    }

    return { score, reasons };
  }

  // 评估文化元素匹配
  private evaluateCulturalMatch(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): { score: number; reasons: AdaptationReason[] } {
    const matchedElements = content.culturalElements.filter(element =>
      context.culturalInterests.some(interest =>
        interest.includes(element.name) || element.category.includes(interest)
      )
    );

    const score = matchedElements.length * 5;
    const reasons: AdaptationReason[] = matchedElements.map(element => ({
      type: 'cultural',
      description: `内容包含用户感兴趣的文化元素：${element.name}`,
      weight: 5,
    }));

    return { score, reasons };
  }

  // 评估时间上下文匹配
  private evaluateTimeMatch(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): { score: number; reasons: AdaptationReason[] } {
    const currentHour = context.timeContext.currentHour;
    const timePreference = context.preferences.timePreferences.find(
      pref => pref.hour === currentHour
    );

    if (!timePreference) {
      return {
        score: 5,
        reasons: [
          {
            type: 'time',
            description: '当前时间无特定偏好，使用默认评分',
            weight: 5,
          },
        ],
      };
    }

    const isPreferredType = timePreference.preferredContentTypes.includes(
      content.contentType
    );

    if (isPreferredType) {
      return {
        score: 10,
        reasons: [
          {
            type: 'time',
            description: `内容类型${content.contentType}适合当前时间段`,
            weight: 10,
          },
        ],
      };
    }

    return {
      score: 5,
      reasons: [
        {
          type: 'time',
          description: '内容类型不太适合当前时间段',
          weight: 5,
        },
      ],
    };
  }

  // 生成个性化元素
  private generatePersonalizedElements(
    content: ContentMappingConfig,
    context: UserContextMapping,
    adaptationReasons: AdaptationReason[]
  ): PersonalizedElement[] {
    const elements: PersonalizedElement[] = [];

    // 根据适配原因生成个性化UI元素
    if (adaptationReasons.some(r => r.type === 'age')) {
      elements.push({
        type: 'ui',
        description: '根据用户年龄调整界面字体大小和交互复杂度',
        implementation: 'applyAgeBasedUIAdjustments',
      });
    }

    if (adaptationReasons.some(r => r.type === 'growth_stage')) {
      elements.push({
        type: 'content',
        description: `根据成长阶段${context.currentGrowthStage}调整内容呈现方式`,
        implementation: 'applyGrowthStageContentAdaptation',
      });
    }

    if (adaptationReasons.some(r => r.type === 'cultural')) {
      elements.push({
        type: 'ui',
        description: '突出显示文化元素相关的UI组件',
        implementation: 'highlightCulturalElements',
      });
    }

    return elements;
  }

  // 生成推荐动作
  private generateRecommendedActions(
    matchScore: number,
    content: ContentMappingConfig,
    context: UserContextMapping
  ): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    if (matchScore >= 80) {
      actions.push({
        action: 'show',
        target: content.contentId,
        reason: '高度匹配用户偏好和上下文',
        priority: 1,
      });
    } else if (matchScore >= 60) {
      actions.push({
        action: 'suggest',
        target: content.contentId,
        reason: '中度匹配，可作为备选内容',
        priority: 2,
      });
    } else if (matchScore >= 40) {
      actions.push({
        action: 'highlight',
        target: content.contentId,
        reason: '可能感兴趣的内容',
        priority: 3,
      });
    } else {
      actions.push({
        action: 'hide',
        target: content.contentId,
        reason: '匹配度较低，暂不推荐',
        priority: 4,
      });
    }

    return actions;
  }

  // 获取候选内容
  private async getCandidateContents(
    context: UserContextMapping
  ): Promise<ContentMappingConfig[]> {
    const userProfile = await this.getUserProfile(context.userId);
    const ageRange = {
      min: Math.max(0, userProfile.age - 2),
      max: userProfile.age + 2,
    };

    return await this.contentDatabase.getContentsByAgeRange(ageRange);
  }

  // 获取当前时间上下文
  private getCurrentTimeContext(): TimeContext {
    const now = new Date();
    const month = now.getMonth();

    let season: 'spring' | 'summer' | 'autumn' | 'winter';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';

    return {
      currentHour: now.getHours(),
      dayOfWeek: now.getDay(),
      season,
      isHoliday: this.isHoliday(now),
    };
  }

  // 判断是否为节假日
  private isHoliday(date: Date): boolean {
    const holidays = [
      '01-01',
      '01-02',
      '01-03',
      '02-10',
      '02-11',
      '02-12',
      '04-04',
      '04-05',
      '04-06',
      '05-01',
      '05-02',
      '05-03',
      '06-10',
      '10-01',
      '10-02',
      '10-03',
      '10-04',
      '10-05',
      '10-06',
      '10-07',
    ];

    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

    return holidays.includes(dateStr);
  }

  // 获取用户画像
  private async getUserProfile(userId: string): Promise<UserProfile> {
    return await this.contentDatabase.getUserProfile(userId);
  }

  // 获取用户交互历史
  private async getUserInteractions(
    userId: string
  ): Promise<InteractionHistory[]> {
    return await this.contentDatabase.getUserInteractions(userId);
  }

  // 获取用户偏好
  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    return await this.contentDatabase.getUserPreferences(userId);
  }

  // 获取学习进度
  private async getLearningProgress(
    userId: string
  ): Promise<LearningProgress> {
    return await this.contentDatabase.getLearningProgress(userId);
  }

  // 清除缓存
  clearCache(userId?: string): void {
    if (userId) {
      this.userContextCache.delete(userId);
    } else {
      this.userContextCache.clear();
    }
  }
}
```

#### 8.2.2 映射规则引擎

```typescript
// 映射规则接口
interface MappingRule {
  id: string;
  name: string;
  condition: (content: ContentMappingConfig, context: UserContextMapping) => boolean;
  action: (content: ContentMappingConfig, context: UserContextMapping) => void;
  priority: number;
}

// 映射规则引擎
export class MappingRuleEngine {
  private rules: MappingRule[];

  constructor(rules: MappingRule[]) {
    this.rules = rules.sort((a, b) => b.priority - a.priority);
  }

  // 执行规则
  executeRules(
    content: ContentMappingConfig,
    context: UserContextMapping
  ): void {
    for (const rule of this.rules) {
      if (rule.condition(content, context)) {
        rule.action(content, context);
      }
    }
  }

  // 添加规则
  addRule(rule: MappingRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  // 移除规则
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }
}

// 预定义规则示例
export const predefinedMappingRules: MappingRule[] = [
  {
    id: 'age-based-content-filter',
    name: '基于年龄的内容过滤',
    priority: 100,
    condition: (content, context) => {
      const userProfile = context as any;
      const userAge = userProfile.age || 0;
      const { min, max } = content.targetAgeRange;
      return userAge < min || userAge > max;
    },
    action: (content, context) => {
      console.log(`内容${content.contentId}不适合用户年龄，已过滤`);
    },
  },
  {
    id: 'growth-stage-adaptation',
    name: '成长阶段适配',
    priority: 90,
    condition: (content, context) => {
      return content.targetGrowthStages.includes(context.currentGrowthStage);
    },
    action: (content, context) => {
      console.log(`内容${content.contentId}已适配成长阶段${context.currentGrowthStage}`);
    },
  },
  {
    id: 'cultural-element-highlight',
    name: '文化元素高亮',
    priority: 80,
    condition: (content, context) => {
      return content.culturalElements.some(element =>
        context.culturalInterests.some(interest =>
          interest.includes(element.name)
        )
      );
    },
    action: (content, context) => {
      console.log(`内容${content.contentId}包含用户感兴趣的文化元素`);
    },
  },
];
```

---

## 9. 技术实现规范

### 9.1 前端技术栈

#### 9.1.1 核心框架与库

```typescript
// 核心技术栈配置
export const TECH_STACK = {
  // 框架
  framework: {
    name: 'Next.js',
    version: '14.x',
    features: ['App Router', 'Server Components', 'Streaming'],
  },

  // UI库
  uiLibrary: {
    name: 'shadcn/ui',
    version: 'latest',
    components: [
      'Button',
      'Card',
      'Dialog',
      'Dropdown',
      'Form',
      'Input',
      'Select',
      'Tabs',
      'Toast',
      'Tooltip',
    ],
  },

  // 状态管理
  stateManagement: {
    name: 'Redux Toolkit',
    version: '2.x',
    features: ['Immer', 'RTK Query', 'Redux Thunk'],
  },

  // 样式方案
  styling: {
    primary: 'Tailwind CSS',
    version: '3.x',
    secondary: 'CSS Modules',
  },

  // 类型系统
  typeScript: {
    version: '5.x',
    strictMode: true,
    pathMapping: {
      '@/*': './src/*',
      '@components/*': './src/components/*',
      '@hooks/*': './src/hooks/*',
      '@utils/*': './src/utils/*',
      '@types/*': './src/types/*',
    },
  },

  // 动画库
  animation: {
    name: 'Framer Motion',
    version: '11.x',
    features: ['Gestures', 'Layout Animations', 'Variants'],
  },

  // 表单处理
  forms: {
    library: 'React Hook Form',
    version: '7.x',
    validation: 'Zod',
  },

  // 数据获取
  dataFetching: {
    library: 'TanStack Query',
    version: '5.x',
    features: ['Caching', 'Optimistic Updates', 'Infinite Scroll'],
  },

  // 图表库
  charts: {
    library: 'Recharts',
    version: '2.x',
  },

  // 图标库
  icons: {
    library: 'Lucide React',
    version: 'latest',
  },

  // 日期处理
  date: {
    library: 'date-fns',
    version: '3.x',
  },

  // 工具库
  utilities: {
    library: 'lodash-es',
    version: '4.x',
  },
} as const;
```

#### 9.1.2 项目目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 主应用组
│   │   ├── layout.tsx            # 主布局
│   │   ├── page.tsx              # 首页
│   │   ├── ai-assistant/         # AI助手页面
│   │   ├── discovery/            # 发现页面
│   │   ├── profile/              # 个人中心
│   │   └── settings/             # 设置页面
│   ├── (auth)/                   # 认证组
│   │   ├── login/                # 登录页
│   │   └── register/             # 注册页
│   ├── api/                      # API路由
│   │   ├── users/
│   │   ├── contents/
│   │   └── ai/
│   ├── layout.tsx                # 根布局
│   └── globals.css               # 全局样式
├── components/                   # 组件目录
│   ├── base/                     # 基础组件
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   ├── business/                 # 业务组件
│   │   ├── UserProfile/
│   │   ├── ContentCard/
│   │   ├── GrowthTracker/
│   │   └── ...
│   ├── page/                     # 页面组件
│   │   ├── HomePage/
│   │   ├── DiscoveryPage/
│   │   └── ...
│   ├── system/                   # 系统组件
│   │   ├── AIPopup/
│   │   ├── GlobalNavigation/
│   │   └── ...
│   └── ui/                       # UI组件（shadcn/ui）
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/                          # 工具库
│   ├── api/                      # API客户端
│   ├── utils/                    # 工具函数
│   ├── constants/                # 常量
│   └── validators/               # 验证器
├── hooks/                        # 自定义Hooks
│   ├── useUserProfile.ts
│   ├── useContentMapping.ts
│   ├── useAIPopup.ts
│   └── ...
├── store/                        # Redux Store
│   ├── slices/
│   │   ├── userSlice.ts
│   │   ├── contentSlice.ts
│   │   └── aiSlice.ts
│   └── index.ts
├── types/                        # TypeScript类型
│   ├── user.ts
│   ├── content.ts
│   ├── ai.ts
│   └── index.ts
├── styles/                       # 样式文件
│   ├── globals.css
│   └── themes/
├── config/                       # 配置文件
│   ├── site.config.ts
│   └── feature-flags.ts
└── middleware.ts                 # 中间件
```

### 9.2 代码规范

#### 9.2.1 命名规范

```typescript
// 文件命名规范
export const FILE_NAMING_CONVENTIONS = {
  // 组件文件：PascalCase
  components: 'PascalCase',
  // Hook文件：camelCase，以use开头
  hooks: 'camelCase with "use" prefix',
  // 工具文件：camelCase
  utilities: 'camelCase',
  // 类型文件：PascalCase
  types: 'PascalCase',
  // 常量文件：UPPER_SNAKE_CASE
  constants: 'UPPER_SNAKE_CASE',
  // 配置文件：kebab-case
  configs: 'kebab-case',
} as const;

// 变量命名规范
export const VARIABLE_NAMING_CONVENTIONS = {
  // 变量：camelCase
  variables: 'camelCase',
  // 常量：UPPER_SNAKE_CASE
  constants: 'UPPER_SNAKE_CASE',
  // 函数：camelCase，动词开头
  functions: 'camelCase with verb prefix',
  // 类：PascalCase
  classes: 'PascalCase',
  // 接口：PascalCase，以I开头
  interfaces: 'PascalCase with "I" prefix',
  // 类型：PascalCase
  types: 'PascalCase',
  // 枚举：PascalCase
  enums: 'PascalCase',
  // 私有成员：_camelCase
  privateMembers: '_camelCase',
} as const;

// 示例
const userName: string = 'xiaoyu';
const MAX_RETRY_COUNT: number = 3;

function getUserProfile(): UserProfile {
  return {} as UserProfile;
}

class UserProfileManager {
  private _cache: Map<string, UserProfile>;
}

interface IUserProfile {
  id: string;
  name: string;
}

type GrowthStage = 'infant' | 'toddler' | 'preschool' | 'school';

enum ContentType {
  STORY = 'story',
  GAME = 'game',
  KNOWLEDGE = 'knowledge',
}
```

#### 9.2.2 注释规范

```typescript
// 文件头注释
/**
 * @file 用户画像管理模块
 * @description 提供用户画像的创建、更新、查询等功能
 * @author YYC³ Team
 * @version 1.0.0
 * @date 2025-01-01
 */

// 类注释
/**
 * 用户画像管理器
 * 负责用户画像的完整生命周期管理
 */
export class UserProfileManager {
  private storageKey: string;

  /**
   * 构造函数
   * @param storageKey 存储键名
   */
  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * 获取用户画像
   * @returns 用户画像对象
   */
  getUserProfile(): UserProfile {
    const profile = localStorage.getItem(this.storageKey);
    return profile ? JSON.parse(profile) : this.createDefaultProfile();
  }

  /**
   * 更新用户画像
   * @param updates 需要更新的字段
   */
  updateProfile(updates: Partial<UserProfile>): void {
    const profile = this.getUserProfile();
    const updatedProfile = { ...profile, ...updates };
    this.saveUserProfile(updatedProfile);
  }
}

// 函数注释
/**
 * 计算用户成长阶段
 * @param age 用户年龄
 * @returns 成长阶段
 */
function calculateGrowthStage(age: number): GrowthStage {
  if (age < 3) return 'infant';
  if (age < 6) return 'toddler';
  if (age < 12) return 'preschool';
  return 'school';
}

// 单行注释
const API_BASE_URL = 'https://api.xiaoyu.ai';

// TODO注释
// TODO: 实现用户画像持久化到后端
// FIXME: 修复缓存更新逻辑
// HACK: 临时解决方案，后续需要重构
```

#### 9.2.3 TypeScript类型规范

```typescript
// 严格类型检查
export const TYPE_SCRIPT_CONFIG = {
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictPropertyInitialization: true,
  noImplicitThis: true,
  alwaysStrict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
} as const;

// 类型定义示例
interface UserProfile {
  id: string;
  name: string;
  age: number;
  growthStage: GrowthStage;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  culturalInterests: string[];
}

type GrowthStage = 'infant' | 'toddler' | 'preschool' | 'school';

// 泛型使用
interface ApiResponse<T> {
  data: T;
  message: string;
  code: number;
}

async function fetchUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// 联合类型
type ContentType = 'story' | 'game' | 'knowledge' | 'activity';

// 交叉类型
type BaseUser = {
  id: string;
  name: string;
};

type UserWithProfile = BaseUser & {
  profile: UserProfile;
};

// 类型守卫
function isUserProfile(obj: any): obj is UserProfile {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.age === 'number'
  );
}

// 映射类型
type PartialUserProfile = Partial<UserProfile>;
type RequiredUserProfile = Required<UserProfile>;
type ReadonlyUserProfile = Readonly<UserProfile>;

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

### 9.3 性能优化规范

#### 9.3.1 组件性能优化

```typescript
// 使用React.memo进行组件记忆化
import { memo } from 'react';

interface ContentCardProps {
  content: Content;
  onLike: (id: string) => void;
}

export const ContentCard = memo<ContentCardProps>(({ content, onLike }) => {
  return (
    <Card>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
      <Button onClick={() => onLike(content.id)}>点赞</Button>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.content.id === nextProps.content.id &&
         prevProps.content.likes === nextProps.content.likes;
});

// 使用useMemo缓存计算结果
import { useMemo } from 'react';

function ContentList({ contents }: { contents: Content[] }) {
  const sortedContents = useMemo(() => {
    return [...contents].sort((a, b) => b.likes - a.likes);
  }, [contents]);

  const filteredContents = useMemo(() => {
    return sortedContents.filter(content => content.published);
  }, [sortedContents]);

  return (
    <div>
      {filteredContents.map(content => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}

// 使用useCallback缓存回调函数
import { useCallback } from 'react';

function ContentPage({ contents }: { contents: Content[] }) {
  const handleLike = useCallback((id: string) => {
    console.log('Liked:', id);
  }, []);

  const handleShare = useCallback((id: string) => {
    console.log('Shared:', id);
  }, []);

  return (
    <div>
      {contents.map(content => (
        <ContentCard
          key={content.id}
          content={content}
          onLike={handleLike}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}

// 使用useReducer管理复杂状态
import { useReducer } from 'react';

interface State {
  contents: Content[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Content[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, contents: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function ContentManager() {
  const [state, dispatch] = useReducer(reducer, {
    contents: [],
    loading: false,
    error: null,
  });

  const fetchContents = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const contents = await api.getContents();
      dispatch({ type: 'FETCH_SUCCESS', payload: contents });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  return <div>{/* 渲染内容 */}</div>;
}
```

#### 9.3.2 代码分割与懒加载

```typescript
// 使用动态导入进行代码分割
import dynamic from 'next/dynamic';

// 懒加载组件
const AIPopup = dynamic(() => import('@/components/system/AIPopup'), {
  loading: () => <div>Loading AI Popup...</div>,
  ssr: false,
});

const UserProfile = dynamic(() => import('@/components/business/UserProfile'), {
  loading: () => <div>Loading Profile...</div>,
});

// 懒加载页面
export default function HomePage() {
  return (
    <div>
      <AIPopup />
      <UserProfile />
    </div>
  );
}

// 路由级别的代码分割
// Next.js App Router自动进行代码分割
// app/discovery/page.tsx
// app/profile/page.tsx
// app/settings/page.tsx

// 条件导入
async function loadFeature(featureName: string) {
  if (featureName === 'advanced') {
    const { AdvancedFeature } = await import('@/features/AdvancedFeature');
    return AdvancedFeature;
  }
  return null;
}
```

#### 9.3.3 图片优化

```typescript
// 使用Next.js Image组件
import Image from 'next/image';

function ContentImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgAB//2Q=="
    />
  );
}

// 响应式图片
function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: 'cover' }}
    />
  );
}

// 图片优化配置
export const IMAGE_OPTIMIZATION_CONFIG = {
  domains: ['cdn.xiaoyu.ai', 'images.xiaoyu.ai'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
} as const;
```

---

## 10. 设计规范与标准

### 10.1 视觉设计规范

#### 10.1.1 色彩系统

```typescript
// 主色调
export const PRIMARY_COLORS = {
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  secondary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },
} as const;

// 中性色
export const NEUTRAL_COLORS = {
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// 功能色
export const FUNCTIONAL_COLORS = {
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
} as const;

// 主题色映射
export const THEME_COLORS = {
  light: {
    background: NEUTRAL_COLORS.gray[50],
    foreground: NEUTRAL_COLORS.gray[900],
    primary: PRIMARY_COLORS.primary[500],
    secondary: PRIMARY_COLORS.secondary[500],
  },
  dark: {
    background: NEUTRAL_COLORS.gray[900],
    foreground: NEUTRAL_COLORS.gray[50],
    primary: PRIMARY_COLORS.primary[400],
    secondary: PRIMARY_COLORS.secondary[400],
  },
} as const;
```

#### 10.1.2 字体系统

```typescript
// 字体家族
export const FONT_FAMILY = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  serif: [
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  mono: [
    'Menlo',
    'Monaco',
    'Courier New',
    'monospace',
  ],
} as const;

// 字体大小
export const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
} as const;

// 字重
export const FONT_WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

// 行高
export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// 字间距
export const LETTER_SPACINGS = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;
```

#### 10.1.3 间距系统

```typescript
// 间距单位
export const SPACING = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// 容器宽度
export const CONTAINER_WIDTHS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 断点
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
```

### 10.2 交互设计规范

#### 10.2.1 动画规范

```typescript
// 动画时长
export const DURATION = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const;

// 缓动函数
export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// 动画预设
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.2 },
  },
} as const;

// 使用Framer Motion实现动画
import { motion } from 'framer-motion';

function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={ANIMATIONS.fadeIn.initial}
      animate={ANIMATIONS.fadeIn.animate}
      exit={ANIMATIONS.fadeIn.exit}
      transition={ANIMATIONS.fadeIn.transition}
    >
      {children}
    </motion.div>
  );
}
```

#### 10.2.2 手势交互

```typescript
// 手势配置
export const GESTURE_CONFIG = {
  swipe: {
    threshold: 50,
    velocityThreshold: 0.3,
  },
  tap: {
    threshold: 10,
  },
  longPress: {
    threshold: 500,
  },
  pinch: {
    scaleThreshold: 0.1,
  },
} as const;

// 使用Framer Motion的手势
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

function SwipeableCard({ onSwipeLeft, onSwipeRight, children }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > GESTURE_CONFIG.swipe.threshold) {
      onSwipeRight();
    } else if (info.offset.x < -GESTURE_CONFIG.swipe.threshold) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}
```

### 10.3 响应式设计规范

#### 10.3.1 断点系统

```typescript
// 响应式断点
export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    min: 0,
    max: 639,
    container: '100%',
    padding: '1rem',
  },
  tablet: {
    min: 640,
    max: 1023,
    container: '90%',
    padding: '1.5rem',
  },
  desktop: {
    min: 1024,
    max: 1279,
    container: '1024px',
    padding: '2rem',
  },
  wide: {
    min: 1280,
    max: Infinity,
    container: '1280px',
    padding: '2.5rem',
  },
} as const;

// 响应式工具函数
export function getBreakpoint(): keyof typeof RESPONSIVE_BREAKPOINTS {
  const width = window.innerWidth;

  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  return 'wide';
}

export function isMobile(): boolean {
  return getBreakpoint() === 'mobile';
}

export function isTablet(): boolean {
  return getBreakpoint() === 'tablet';
}

export function isDesktop(): boolean {
  return getBreakpoint() === 'desktop' || getBreakpoint() === 'wide';
}
```

#### 10.3.2 响应式组件

```typescript
// 响应式容器
export function ResponsiveContainer({ children }: { children: React.ReactNode }) {
  const breakpoint = getBreakpoint();
  const config = RESPONSIVE_BREAKPOINTS[breakpoint];

  return (
    <div
      style={{
        maxWidth: config.container,
        margin: '0 auto',
        padding: config.padding,
      }}
    >
      {children}
    </div>
  );
}

// 响应式网格
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  const breakpoint = getBreakpoint();

  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: breakpoint === 'mobile' ? '1fr' :
                       breakpoint === 'tablet' ? 'repeat(2, 1fr)' :
                       breakpoint === 'desktop' ? 'repeat(3, 1fr)' :
                       'repeat(4, 1fr)',
  };

  return <div style={gridStyle}>{children}</div>;
}

// 使用Tailwind CSS的响应式类
export function ResponsiveCard({ title, description }: CardProps) {
  return (
    <div className="
      p-4
      md:p-6
      lg:p-8
      rounded-lg
      shadow-md
      hover:shadow-lg
      transition-shadow
    ">
      <h3 className="
        text-lg
        md:text-xl
        lg:text-2xl
        font-bold
      ">
        {title}
      </h3>
      <p className="
        text-sm
        md:text-base
        lg:text-lg
        mt-2
      ">
        {description}
      </p>
    </div>
  );
}
```

---

## 11. 附录

### 11.1 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| AI弹窗 | AI Popup | 智能助手浮窗，提供语音交互和智能服务 |
| 用户画像 | User Profile | 用户的基本信息、偏好、成长阶段等综合描述 |
| 成长阶段 | Growth Stage | 根据年龄划分的用户发展阶段 |
| 信息映射 | Information Mapping | 根据用户上下文推荐和适配内容的过程 |
| 全局形象 | Global Avatar | 用户在系统中的统一形象展示 |
| 文化元素 | Cultural Element | 河洛文化、洛阳元素等文化相关内容 |
| 分层设计 | Layered Design | 将系统分为多个层次的设计方法 |
| 全链路闭环 | Full-link Closed Loop | 从用户需求到服务反馈的完整闭环 |

### 11.2 参考文档

- [AI浮窗为中心全局语音交互弹窗控制系统.md](/Users/yanyu/yyc3-xy-ai/docs/言语记忆/AI浮窗为中心全局语音交互弹窗控制系统.md)
- [前端架构设计文档.md](/Users/yanyu/yyc3-xy-ai/docs/YYC3-XY-架构类/04-YYC3-XY-架构类-前端架构设计文档.md)
- [接口架构设计文档.md](/Users/yanyu/yyc3-xy-ai/docs/YYC3-XY-架构类/05-YYC3-XY-架构类-接口架构设计文档.md)
- [小语AI应用UI-UX全量设计规划文档.md](/Users/yanyu/yyc3-xy-ai/docs/YYC3-XY-架构类/11-YYC3-XY-架构类-小语AI应用UI-UX全量设计规划文档.md)

### 11.3 版本历史

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| V1.0 | 2025-01-01 | YYC³ Team | 初始版本，包含API接口体系、用户信息及全局形象系统、信息映射系统等核心章节 |

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
