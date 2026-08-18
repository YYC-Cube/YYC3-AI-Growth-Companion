---
@file: 12-YYC3-XY-架构类-小语AI应用UI-UX设计规划补充文档
@description: 本文档为《小语AI应用UI-UX全量设计规划文档》的补充文档，包含API接口体系、用户信息及全局形象系统、信息映射系统等核心章节。
@author: YYC³
@version: 1.0.0
@created: 2025-12-18
@updated: 2025-12-28
@status: published
@tags: [架构, UI-UX, API接口, 用户信息, 全局形象, 信息映射]
---

# 12-YYC3-XY-架构类-小语AI应用UI-UX设计规划补充文档

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

### 6.5 统一错误处理体系

#### 6.5.1 错误响应格式标准

```typescript
/**
 * @file 统一API错误处理体系
 * @description 定义API接口的统一错误处理格式和错误码规范
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

// 统一API响应格式
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
    requestId: string;
  };
  timestamp: number;
}

// 统一错误响应格式
export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
    requestId: string;
  };
  timestamp: number;
}

// 成功响应格式
export interface APISuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: number;
}

// 错误码枚举
export const API_ERROR_CODES = {
  // 通用错误 (1xxx)
  UNKNOWN_ERROR: '1000',
  INVALID_REQUEST: '1001',
  UNAUTHORIZED: '1002',
  FORBIDDEN: '1003',
  NOT_FOUND: '1004',
  METHOD_NOT_ALLOWED: '1005',
  REQUEST_TIMEOUT: '1006',
  PAYLOAD_TOO_LARGE: '1007',
  RATE_LIMIT_EXCEEDED: '1008',
  INTERNAL_ERROR: '1009',
  SERVICE_UNAVAILABLE: '1010',
  
  // 用户服务错误 (2xxx)
  USER_NOT_FOUND: '2001',
  USER_ALREADY_EXISTS: '2002',
  INVALID_USER_DATA: '2003',
  USER_NOT_AUTHENTICATED: '2004',
  USER_PERMISSION_DENIED: '2005',
  USER_PREFERENCES_INVALID: '2006',
  
  // 内容服务错误 (3xxx)
  CONTENT_NOT_FOUND: '3001',
  INVALID_CONTENT_DATA: '3002',
  CONTENT_ACCESS_DENIED: '3003',
  CONTENT_ALREADY_EXISTS: '3004',
  CONTENT_CATEGORY_NOT_FOUND: '3005',
  
  // AI服务错误 (4xxx)
  AI_SERVICE_UNAVAILABLE: '4001',
  VOICE_RECOGNITION_FAILED: '4002',
  AI_MODEL_ERROR: '4003',
  AI_RESPONSE_TIMEOUT: '4004',
  AI_QUOTA_EXCEEDED: '4005',
  
  // 成长服务错误 (5xxx)
  GROWTH_RECORD_NOT_FOUND: '5001',
  INVALID_GROWTH_STAGE: '5002',
  GROWTH_DATA_INVALID: '5003',
  GROWTH_RECORD_EXISTS: '5004',
  
  // 验证错误 (6xxx)
  VALIDATION_ERROR: '6001',
  REQUIRED_FIELD_MISSING: '6002',
  INVALID_FORMAT: '6003',
  INVALID_VALUE_RANGE: '6004',
} as const;

// 错误码映射到HTTP状态码
export const ERROR_CODE_TO_STATUS: Record<string, number> = {
  // 4xx 客户端错误
  [API_ERROR_CODES.INVALID_REQUEST]: 400,
  [API_ERROR_CODES.UNAUTHORIZED]: 401,
  [API_ERROR_CODES.FORBIDDEN]: 403,
  [API_ERROR_CODES.NOT_FOUND]: 404,
  [API_ERROR_CODES.METHOD_NOT_ALLOWED]: 405,
  [API_ERROR_CODES.REQUEST_TIMEOUT]: 408,
  [API_ERROR_CODES.PAYLOAD_TOO_LARGE]: 413,
  [API_ERROR_CODES.RATE_LIMIT_EXCEEDED]: 429,
  
  // 用户服务错误
  [API_ERROR_CODES.USER_NOT_FOUND]: 404,
  [API_ERROR_CODES.USER_ALREADY_EXISTS]: 409,
  [API_ERROR_CODES.INVALID_USER_DATA]: 400,
  [API_ERROR_CODES.USER_NOT_AUTHENTICATED]: 401,
  [API_ERROR_CODES.USER_PERMISSION_DENIED]: 403,
  
  // 内容服务错误
  [API_ERROR_CODES.CONTENT_NOT_FOUND]: 404,
  [API_ERROR_CODES.INVALID_CONTENT_DATA]: 400,
  [API_ERROR_CODES.CONTENT_ACCESS_DENIED]: 403,
  [API_ERROR_CODES.CONTENT_ALREADY_EXISTS]: 409,
  
  // AI服务错误
  [API_ERROR_CODES.AI_SERVICE_UNAVAILABLE]: 503,
  [API_ERROR_CODES.VOICE_RECOGNITION_FAILED]: 500,
  [API_ERROR_CODES.AI_MODEL_ERROR]: 500,
  [API_ERROR_CODES.AI_RESPONSE_TIMEOUT]: 504,
  [API_ERROR_CODES.AI_QUOTA_EXCEEDED]: 429,
  
  // 成长服务错误
  [API_ERROR_CODES.GROWTH_RECORD_NOT_FOUND]: 404,
  [API_ERROR_CODES.INVALID_GROWTH_STAGE]: 400,
  [API_ERROR_CODES.GROWTH_DATA_INVALID]: 400,
  
  // 验证错误
  [API_ERROR_CODES.VALIDATION_ERROR]: 400,
  [API_ERROR_CODES.REQUIRED_FIELD_MISSING]: 400,
  [API_ERROR_CODES.INVALID_FORMAT]: 400,
  [API_ERROR_CODES.INVALID_VALUE_RANGE]: 400,
  
  // 5xx 服务器错误
  [API_ERROR_CODES.INTERNAL_ERROR]: 500,
  [API_ERROR_CODES.SERVICE_UNAVAILABLE]: 503,
};

// 自定义错误类
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode || ERROR_CODE_TO_STATUS[code] || 500;
  }
  
  toJSON(): APIErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: Date.now(),
        requestId: this.generateRequestId(),
      },
      timestamp: Date.now(),
    };
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 错误处理工具函数
export function createAPIError(
  code: keyof typeof API_ERROR_CODES,
  message?: string,
  details?: any
): APIError {
  const defaultMessage = getDefaultErrorMessage(code);
  return new APIError(API_ERROR_CODES[code], message || defaultMessage, details);
}

function getDefaultErrorMessage(code: keyof typeof API_ERROR_CODES): string {
  const messages: Record<string, string> = {
    [API_ERROR_CODES.UNKNOWN_ERROR]: '未知错误',
    [API_ERROR_CODES.INVALID_REQUEST]: '请求参数无效',
    [API_ERROR_CODES.UNAUTHORIZED]: '未授权，请先登录',
    [API_ERROR_CODES.FORBIDDEN]: '无权限访问',
    [API_ERROR_CODES.NOT_FOUND]: '请求的资源不存在',
    [API_ERROR_CODES.METHOD_NOT_ALLOWED]: '请求方法不允许',
    [API_ERROR_CODES.REQUEST_TIMEOUT]: '请求超时',
    [API_ERROR_CODES.PAYLOAD_TOO_LARGE]: '请求体过大',
    [API_ERROR_CODES.RATE_LIMIT_EXCEEDED]: '请求过于频繁，请稍后再试',
    [API_ERROR_CODES.INTERNAL_ERROR]: '服务器内部错误',
    [API_ERROR_CODES.SERVICE_UNAVAILABLE]: '服务暂时不可用',
    
    [API_ERROR_CODES.USER_NOT_FOUND]: '用户不存在',
    [API_ERROR_CODES.USER_ALREADY_EXISTS]: '用户已存在',
    [API_ERROR_CODES.INVALID_USER_DATA]: '用户数据无效',
    [API_ERROR_CODES.USER_NOT_AUTHENTICATED]: '用户未认证',
    [API_ERROR_CODES.USER_PERMISSION_DENIED]: '用户权限不足',
    [API_ERROR_CODES.USER_PREFERENCES_INVALID]: '用户偏好设置无效',
    
    [API_ERROR_CODES.CONTENT_NOT_FOUND]: '内容不存在',
    [API_ERROR_CODES.INVALID_CONTENT_DATA]: '内容数据无效',
    [API_ERROR_CODES.CONTENT_ACCESS_DENIED]: '无权访问该内容',
    [API_ERROR_CODES.CONTENT_ALREADY_EXISTS]: '内容已存在',
    [API_ERROR_CODES.CONTENT_CATEGORY_NOT_FOUND]: '内容分类不存在',
    
    [API_ERROR_CODES.AI_SERVICE_UNAVAILABLE]: 'AI服务暂时不可用',
    [API_ERROR_CODES.VOICE_RECOGNITION_FAILED]: '语音识别失败',
    [API_ERROR_CODES.AI_MODEL_ERROR]: 'AI模型错误',
    [API_ERROR_CODES.AI_RESPONSE_TIMEOUT]: 'AI响应超时',
    [API_ERROR_CODES.AI_QUOTA_EXCEEDED]: 'AI配额已用尽',
    
    [API_ERROR_CODES.GROWTH_RECORD_NOT_FOUND]: '成长记录不存在',
    [API_ERROR_CODES.INVALID_GROWTH_STAGE]: '成长阶段无效',
    [API_ERROR_CODES.GROWTH_DATA_INVALID]: '成长数据无效',
    [API_ERROR_CODES.GROWTH_RECORD_EXISTS]: '成长记录已存在',
    
    [API_ERROR_CODES.VALIDATION_ERROR]: '数据验证失败',
    [API_ERROR_CODES.REQUIRED_FIELD_MISSING]: '缺少必填字段',
    [API_ERROR_CODES.INVALID_FORMAT]: '格式无效',
    [API_ERROR_CODES.INVALID_VALUE_RANGE]: '数值超出范围',
  };
  
  return messages[code] || '未知错误';
}

// 响应处理工具函数
export async function handleAPIResponse<T>(
  response: Response
): Promise<T> {
  const requestId = response.headers.get('X-Request-ID') || '';
  
  if (!response.ok) {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      throw new APIError(
        API_ERROR_CODES.INTERNAL_ERROR,
        '服务器响应格式错误',
        { requestId }
      );
    }
    
    throw new APIError(
      errorData.error?.code || API_ERROR_CODES.UNKNOWN_ERROR,
      errorData.error?.message || '请求失败',
      errorData.error?.details,
      response.status
    );
  }
  
  return response.json();
}

// 创建成功响应
export function createSuccessResponse<T>(data: T): APISuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
}

// 创建错误响应
export function createErrorResponse(
  error: APIError
): APIErrorResponse {
  return error.toJSON();
}

// 请求ID生成器
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

#### 6.5.2 错误处理中间件

```typescript
// Next.js API路由错误处理中间件
import { NextRequest, NextResponse } from 'next/server';
import { APIError, createErrorResponse, generateRequestId } from './error-handling';

export async function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    
    try {
      const response = await handler(req);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error) {
      console.error(`[API Error] ${requestId}:`, error);
      
      if (error instanceof APIError) {
        const errorResponse = createErrorResponse(error);
        return NextResponse.json(errorResponse, {
          status: error.statusCode || 500,
          headers: {
            'X-Request-ID': requestId,
          },
        });
      }
      
      const unknownError = new APIError(
        '1000',
        '服务器内部错误',
        process.env.NODE_ENV === 'development' ? String(error) : undefined
      );
      
      return NextResponse.json(createErrorResponse(unknownError), {
        status: 500,
        headers: {
          'X-Request-ID': requestId,
        },
      });
    }
  };
}

// 使用示例
export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    throw new APIError('1001', '缺少用户ID参数');
  }
  
  const user = await getUserById(userId);
  
  if (!user) {
    throw new APIError('2001', '用户不存在');
  }
  
  return NextResponse.json(createSuccessResponse(user));
});
```

### 6.6 API缓存策略

#### 6.6.1 缓存策略配置

```typescript
/**
 * @file API缓存策略
 * @description 定义API接口的缓存策略和实现方案
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

// 缓存策略枚举
export const CACHE_STRATEGIES = {
  NO_CACHE: 'no-cache',
  SHORT_TERM: '5m',
  MEDIUM_TERM: '1h',
  LONG_TERM: '24h',
  VERY_LONG_TERM: '7d',
} as const;

// 缓存配置类型
export interface CacheConfig {
  strategy: keyof typeof CACHE_STRATEGIES;
  enabled: boolean;
  maxAge: number;
  staleWhileRevalidate?: number;
  tags?: string[];
}

// 可缓存端点配置
export const CACHEABLE_ENDPOINTS: Record<string, CacheConfig> = {
  // 用户服务
  [`${API_PATHS[API_VERSIONS.V1].USERS}/*`]: {
    strategy: 'SHORT_TERM',
    enabled: true,
    maxAge: 5 * 60 * 1000,
    tags: ['user'],
  },
  
  // 内容服务
  [`${API_PATHS[API_VERSIONS.V1].CONTENTS}`]: {
    strategy: 'MEDIUM_TERM',
    enabled: true,
    maxAge: 60 * 60 * 1000,
    tags: ['content', 'list'],
  },
  
  [`${API_PATHS[API_VERSIONS.V1].CONTENTS}/*`]: {
    strategy: 'LONG_TERM',
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000,
    tags: ['content', 'detail'],
  },
  
  [`${API_PATHS[API_VERSIONS.V1].CONTENTS}/categories`]: {
    strategy: 'VERY_LONG_TERM',
    enabled: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    tags: ['content', 'categories'],
  },
  
  [`${API_PATHS[API_VERSIONS.V1].CONTENTS}/cultural`]: {
    strategy: 'LONG_TERM',
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000,
    tags: ['content', 'cultural'],
  },
  
  // AI服务 - 不缓存
  [`${API_PATHS[API_VERSIONS.V1].AI}/*`]: {
    strategy: 'NO_CACHE',
    enabled: false,
    maxAge: 0,
  },
  
  // 成长服务
  [`${API_PATHS[API_VERSIONS.V1].GROWTH}/*`]: {
    strategy: 'MEDIUM_TERM',
    enabled: true,
    maxAge: 60 * 60 * 1000,
    tags: ['growth'],
  },
};

// 缓存键生成器
export function generateCacheKey(
  url: string,
  params?: Record<string, any>
): string {
  const key = `${url}:${JSON.stringify(params || {})}`;
  return Buffer.from(key).toString('base64');
}

// 缓存TTL计算器
export function getCacheTTL(strategy: keyof typeof CACHE_STRATEGIES): number {
  const ttlMap: Record<keyof typeof CACHE_STRATEGIES, number> = {
    NO_CACHE: 0,
    SHORT_TERM: 5 * 60 * 1000,
    MEDIUM_TERM: 60 * 60 * 1000,
    LONG_TERM: 24 * 60 * 60 * 1000,
    VERY_LONG_TERM: 7 * 24 * 60 * 60 * 1000,
  };
  
  return ttlMap[strategy];
}
```

#### 6.6.2 缓存实现

```typescript
// Next.js缓存实现
import { unstable_cache } from 'next/cache';
import { generateCacheKey, getCacheTTL, CACHEABLE_ENDPOINTS } from './cache-config';

// 带缓存的API请求包装器
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string
): Promise<T> {
  const key = cacheKey || generateCacheKey(url, options);
  
  // 检查是否应该缓存
  const cacheConfig = Object.entries(CACHEABLE_ENDPOINTS).find(([pattern]) => 
    url.includes(pattern.replace('/*', ''))
  );
  
  if (!cacheConfig || !cacheConfig[1].enabled) {
    return fetch(url, options).then(res => res.json());
  }
  
  const [, config] = cacheConfig;
  const ttl = getCacheTTL(config.strategy);
  
  if (ttl === 0) {
    return fetch(url, options).then(res => res.json());
  }
  
  // 使用Next.js缓存
  const cached = unstable_cache(
    async () => fetch(url, options).then(res => res.json()),
    [key],
    {
      revalidate: ttl / 1000,
      tags: config.tags,
    }
  );
  
  return cached();
}

// 缓存失效函数
export async function invalidateCache(tags: string[]): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  
  tags.forEach(tag => {
    revalidateTag(tag);
  });
}

// 使用示例
export async function getUserInfo(userId: string): Promise<UserInfo> {
  const url = `${API_PATHS[API_VERSIONS.V1].USERS}/${userId}`;
  
  return cachedFetch<UserInfo>(url, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });
}

// 更新用户信息后失效缓存
export async function updateUserInfo(
  userId: string,
  data: Partial<UserInfo>
): Promise<UserInfo> {
  const url = `${API_PATHS[API_VERSIONS.V1].USERS}/${userId}`;
  
  const result = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
  
  // 失效相关缓存
  await invalidateCache(['user']);
  
  return result;
}

// React Hook封装
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUserInfo(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserInfo(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateUserInfo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserInfo> }) =>
      updateUserInfo(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

### 6.7 API限流和配额管理

#### 6.7.1 限流策略配置

```typescript
/**
 * @file API限流和配额管理
 * @description 定义API接口的限流策略和配额管理方案
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

// 限流策略类型
export interface RateLimitConfig {
  requests: number;
  window: string;
  burst?: number;
  strategy: 'fixed' | 'sliding' | 'token-bucket';
}

// 限流策略枚举
export const RATE_LIMIT_STRATEGIES = {
  DEFAULT: {
    requests: 100,
    window: '1m',
    burst: 20,
    strategy: 'token-bucket' as const,
  },
  
  AI_CHAT: {
    requests: 20,
    window: '1m',
    burst: 5,
    strategy: 'token-bucket' as const,
  },
  
  CONTENT_CREATE: {
    requests: 10,
    window: '1h',
    burst: 2,
    strategy: 'fixed' as const,
  },
  
  USER_UPDATE: {
    requests: 30,
    window: '1h',
    burst: 5,
    strategy: 'sliding' as const,
  },
  
  VOICE_RECOGNITION: {
    requests: 50,
    window: '1h',
    burst: 10,
    strategy: 'token-bucket' as const,
  },
} as const;

// 端点限流配置
export const ENDPOINT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // AI服务
  [`${API_PATHS[API_VERSIONS.V1].AI}/message`]: RATE_LIMIT_STRATEGIES.AI_CHAT,
  [`${API_PATHS[API_VERSIONS.V1].AI}/voice/*`]: RATE_LIMIT_STRATEGIES.VOICE_RECOGNITION,
  
  // 内容服务
  [`${API_PATHS[API_VERSIONS.V1].CONTENTS}`]: RATE_LIMIT_STRATEGIES.CONTENT_CREATE,
  
  // 用户服务
  [`${API_PATHS[API_VERSIONS.V1].USERS}/*`]: RATE_LIMIT_STRATEGIES.USER_UPDATE,
  
  // 默认限流
  '*': RATE_LIMIT_STRATEGIES.DEFAULT,
};

// 配额类型
export interface QuotaConfig {
  daily: number;
  monthly: number;
  resetTime: string;
}

// 用户配额配置
export const USER_QUOTAS = {
  FREE: {
    daily: 100,
    monthly: 3000,
    resetTime: '00:00:00',
  },
  
  PREMIUM: {
    daily: 1000,
    monthly: 30000,
    resetTime: '00:00:00',
  },
  
  ENTERPRISE: {
    daily: 10000,
    monthly: 300000,
    resetTime: '00:00:00',
  },
} as const;

// 限流响应头
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'X-RateLimit-Window': string;
  'Retry-After'?: string;
}

// 配额响应头
export interface QuotaHeaders {
  'X-Quota-Limit-Daily': string;
  'X-Quota-Remaining-Daily': string;
  'X-Quota-Limit-Monthly': string;
  'X-Quota-Remaining-Monthly': string;
  'X-Quota-Reset': string;
}
```

#### 6.7.2 限流实现

```typescript
// Redis限流实现
import { Redis } from 'ioredis';

export class RateLimiter {
  private redis: Redis;
  
  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }
  
  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; headers: RateLimitHeaders }> {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowMs = this.parseWindow(config.window);
    
    if (config.strategy === 'token-bucket') {
      return this.tokenBucketLimit(key, config, now);
    } else if (config.strategy === 'sliding') {
      return this.slidingWindowLimit(key, config, now, windowMs);
    } else {
      return this.fixedWindowLimit(key, config, now, windowMs);
    }
  }
  
  private async tokenBucketLimit(
    key: string,
    config: RateLimitConfig,
    now: number
  ): Promise<{ allowed: boolean; headers: RateLimitHeaders }> {
    const burst = config.burst || config.requests;
    const refillRate = config.requests / this.parseWindow(config.window);
    
    const tokens = await this.redis.incrbyfloat(`${key}:tokens`, -1);
    const lastRefill = await this.redis.get(`${key}:last_refill`);
    
    if (tokens === -1) {
      await this.redis.set(`${key}:tokens`, burst - 1);
      await this.redis.set(`${key}:last_refill`, now);
    } else {
      const timePassed = now - parseInt(lastRefill || '0');
      const refill = timePassed * refillRate / 1000;
      const newTokens = Math.min(burst, tokens + refill);
      
      await this.redis.set(`${key}:tokens`, newTokens);
      await this.redis.set(`${key}:last_refill`, now);
      
      if (newTokens >= 1) {
        await this.redis.incrbyfloat(`${key}:tokens`, -1);
      }
    }
    
    const currentTokens = parseFloat(await this.redis.get(`${key}:tokens`) || '0');
    const allowed = currentTokens >= 0;
    
    const headers: RateLimitHeaders = {
      'X-RateLimit-Limit': burst.toString(),
      'X-RateLimit-Remaining': Math.max(0, currentTokens).toFixed(2),
      'X-RateLimit-Reset': (now + this.parseWindow(config.window)).toString(),
      'X-RateLimit-Window': config.window,
    };
    
    if (!allowed) {
      const retryAfter = Math.ceil(this.parseWindow(config.window) / 1000);
      headers['Retry-After'] = retryAfter.toString();
    }
    
    return { allowed, headers };
  }
  
  private async slidingWindowLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowMs: number
  ): Promise<{ allowed: boolean; headers: RateLimitHeaders }> {
    const windowStart = now - windowMs;
    
    await this.redis.zremrangebyscore(key, 0, windowStart);
    const count = await this.redis.zcard(key);
    
    const allowed = count < config.requests;
    
    if (allowed) {
      await this.redis.zadd(key, now, `${now}:${Math.random()}`);
      await this.redis.expire(key, Math.ceil(windowMs / 1000));
    }
    
    const ttl = await this.redis.ttl(key);
    const resetTime = now + (ttl > 0 ? ttl * 1000 : windowMs);
    
    const headers: RateLimitHeaders = {
      'X-RateLimit-Limit': config.requests.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.requests - count).toString(),
      'X-RateLimit-Reset': resetTime.toString(),
      'X-RateLimit-Window': config.window,
    };
    
    if (!allowed) {
      const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const retryAfter = oldestRequest.length > 0 
        ? Math.ceil((parseInt(oldestRequest[1]) + windowMs - now) / 1000)
        : Math.ceil(windowMs / 1000);
      headers['Retry-After'] = retryAfter.toString();
    }
    
    return { allowed, headers };
  }
  
  private async fixedWindowLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowMs: number
  ): Promise<{ allowed: boolean; headers: RateLimitHeaders }> {
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;
    
    const count = await this.redis.incr(windowKey);
    if (count === 1) {
      await this.redis.expire(windowKey, Math.ceil(windowMs / 1000));
    }
    
    const allowed = count <= config.requests;
    const ttl = await this.redis.ttl(windowKey);
    const resetTime = now + (ttl > 0 ? ttl * 1000 : windowMs);
    
    const headers: RateLimitHeaders = {
      'X-RateLimit-Limit': config.requests.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.requests - count).toString(),
      'X-RateLimit-Reset': resetTime.toString(),
      'X-RateLimit-Window': config.window,
    };
    
    if (!allowed) {
      headers['Retry-After'] = ttl.toString();
    }
    
    return { allowed, headers };
  }
  
  private parseWindow(window: string): number {
    const match = window.match(/^(\d+)([smhd])$/);
    if (!match) return 60000;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    
    return value * multipliers[unit];
  }
}

// Next.js API路由限流中间件
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from './rate-limiter';
import { ENDPOINT_RATE_LIMITS } from './rate-limit-config';
import { createAPIError } from './error-handling';

const rateLimiter = new RateLimiter(process.env.REDIS_URL || 'redis://localhost:6379');

export async function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const identifier = req.headers.get('X-User-ID') || req.ip || 'anonymous';
    const pathname = req.nextUrl.pathname;
    
    const limitConfig = Object.entries(ENDPOINT_RATE_LIMITS).find(([pattern]) => 
      pathname.includes(pattern.replace('*', ''))
    )?.[1] || ENDPOINT_RATE_LIMITS['*'];
    
    const { allowed, headers } = await rateLimiter.checkRateLimit(
      identifier,
      limitConfig
    );
    
    if (!allowed) {
      throw createAPIError('RATE_LIMIT_EXCEEDED', '请求过于频繁，请稍后再试');
    }
    
    const response = await handler(req);
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

// 使用示例
export const POST = withRateLimit(withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  
  const response = await aiService.sendMessage(body);
  
  return NextResponse.json(createSuccessResponse(response));
}));
```

#### 6.7.3 配额管理

```typescript
// 用户配额管理
export class QuotaManager {
  private redis: Redis;
  
  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }
  
  async checkQuota(userId: string, tier: keyof typeof USER_QUOTAS): Promise<{
    allowed: boolean;
    headers: QuotaHeaders;
  }> {
    const quota = USER_QUOTAS[tier];
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    
    const dailyKey = `quota:${userId}:daily:${today}`;
    const monthlyKey = `quota:${userId}:monthly:${month}`;
    
    const dailyCount = parseInt(await this.redis.get(dailyKey) || '0');
    const monthlyCount = parseInt(await this.redis.get(monthlyKey) || '0');
    
    const allowed = dailyCount < quota.daily && monthlyCount < quota.monthly;
    
    const resetTime = this.calculateResetTime(quota.resetTime);
    
    const headers: QuotaHeaders = {
      'X-Quota-Limit-Daily': quota.daily.toString(),
      'X-Quota-Remaining-Daily': Math.max(0, quota.daily - dailyCount).toString(),
      'X-Quota-Limit-Monthly': quota.monthly.toString(),
      'X-Quota-Remaining-Monthly': Math.max(0, quota.monthly - monthlyCount).toString(),
      'X-Quota-Reset': resetTime.toString(),
    };
    
    return { allowed, headers };
  }
  
  async incrementQuota(userId: string, amount: number = 1): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);
    
    const dailyKey = `quota:${userId}:daily:${today}`;
    const monthlyKey = `quota:${userId}:monthly:${month}`;
    
    await this.redis.incrby(dailyKey, amount);
    await this.redis.incrby(monthlyKey, amount);
    
    await this.redis.expire(dailyKey, 86400);
    await this.redis.expire(monthlyKey, 2592000);
  }
  
  private calculateResetTime(resetTime: string): number {
    const now = new Date();
    const [hours, minutes, seconds] = resetTime.split(':').map(Number);
    
    const reset = new Date(now);
    reset.setHours(hours, minutes, seconds, 0);
    
    if (reset < now) {
      reset.setDate(reset.getDate() + 1);
    }
    
    return reset.getTime();
  }
}

// 配额中间件
const quotaManager = new QuotaManager(process.env.REDIS_URL || 'redis://localhost:6379');

export async function withQuotaCheck(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userId = req.headers.get('X-User-ID');
    
    if (!userId) {
      throw createAPIError('USER_NOT_AUTHENTICATED', '用户未认证');
    }
    
    const userTier = await getUserTier(userId);
    const { allowed, headers } = await quotaManager.checkQuota(userId, userTier);
    
    if (!allowed) {
      throw createAPIError('AI_QUOTA_EXCEEDED', '配额已用尽，请升级套餐或等待重置');
    }
    
    const response = await handler(req);
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    await quotaManager.incrementQuota(userId);
    
    return response;
  };
}
```

### 6.8 API文档生成工具

#### 6.8.1 OpenAPI/Swagger集成

```typescript
/**
 * @file API文档生成工具
 * @description 推荐和配置API文档生成工具
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

// OpenAPI规范配置
export const openAPISpec = {
  openapi: '3.0.0',
  info: {
    title: '小语AI应用API',
    version: '1.0.0',
    description: '小语AI应用后端API接口文档',
    contact: {
      name: 'YYC³ Team',
      email: 'admin@0379.email',
    },
  },
  servers: [
    {
      url: 'https://api.yyc3-xy-ai.com/v1',
      description: '生产环境',
    },
    {
      url: 'https://api-staging.yyc3-xy-ai.com/v1',
      description: '测试环境',
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: '开发环境',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'USER_NOT_FOUND',
              },
              message: {
                type: 'string',
                example: '用户不存在',
              },
              details: {
                type: 'object',
              },
              timestamp: {
                type: 'number',
                example: 1703740800000,
              },
              requestId: {
                type: 'string',
                example: 'req_1703740800000_abc123',
              },
            },
          },
          timestamp: {
            type: 'number',
            example: 1703740800000,
          },
        },
      },
      UserInfo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'user_123',
          },
          name: {
            type: 'string',
            example: '小明',
          },
          age: {
            type: 'number',
            example: 8,
          },
          avatar: {
            type: 'string',
            example: 'https://cdn.example.com/avatars/user_123.jpg',
          },
          growthStage: {
            type: 'string',
            enum: ['infant', 'toddler', 'preschool', 'school', 'adolescent'],
            example: 'school',
          },
          preferences: {
            $ref: '#/components/schemas/UserPreferences',
          },
          statistics: {
            $ref: '#/components/schemas/UserStatistics',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      UserPreferences: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            enum: ['zh-CN', 'en-US'],
            example: 'zh-CN',
          },
          theme: {
            type: 'string',
            enum: ['light', 'dark', 'auto'],
            example: 'light',
          },
          voiceEnabled: {
            type: 'boolean',
            example: true,
          },
          voiceSpeed: {
            type: 'number',
            example: 1.0,
          },
          fontSize: {
            type: 'string',
            enum: ['small', 'medium', 'large'],
            example: 'medium',
          },
          culturalPreference: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['heluo', 'luoyang'],
          },
        },
      },
      UserStatistics: {
        type: 'object',
        properties: {
          totalInteractionTime: {
            type: 'number',
            example: 3600,
          },
          totalMessages: {
            type: 'number',
            example: 100,
          },
          totalVoiceInteractions: {
            type: 'number',
            example: 50,
          },
          favoriteTopics: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['历史', '文化', '科学'],
          },
          learningProgress: {
            type: 'object',
            example: {
              math: 0.8,
              language: 0.9,
              science: 0.7,
            },
          },
        },
      },
    },
  },
  paths: {
    '/users/{userId}': {
      get: {
        summary: '获取用户信息',
        description: '根据用户ID获取用户详细信息',
        tags: ['Users'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: '用户ID',
          },
        ],
        responses: {
          '200': {
            description: '成功获取用户信息',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/UserInfo',
                    },
                    timestamp: {
                      type: 'number',
                      example: 1703740800000,
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: '用户不存在',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};

// Swagger UI集成
export const swaggerConfig = {
  title: '小语AI应用API文档',
  spec: openAPISpec,
  routePrefix: '/api/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

// 推荐工具列表
export const RECOMMENDED_API_TOOLS = {
  documentation: [
    {
      name: 'Swagger UI',
      description: '交互式API文档界面',
      url: 'https://swagger.io/tools/swagger-ui/',
      recommended: true,
    },
    {
      name: 'Redoc',
      description: '美观的API文档生成器',
      url: 'https://github.com/Redocly/redoc',
      recommended: true,
    },
    {
      name: 'Stoplight',
      description: 'API设计和文档平台',
      url: 'https://stoplight.io/',
      recommended: false,
    },
  ],
  testing: [
    {
      name: 'Postman',
      description: 'API测试和协作平台',
      url: 'https://www.postman.com/',
      recommended: true,
    },
    {
      name: 'Insomnia',
      description: 'REST客户端API测试工具',
      url: 'https://insomnia.rest/',
      recommended: true,
    },
    {
      name: 'Bruno',
      description: '开源API测试工具',
      url: 'https://www.usebruno.com/',
      recommended: false,
    },
  ],
  monitoring: [
    {
      name: 'Prometheus',
      description: '监控和告警系统',
      url: 'https://prometheus.io/',
      recommended: true,
    },
    {
      name: 'Grafana',
      description: '数据可视化平台',
      url: 'https://grafana.com/',
      recommended: true,
    },
  ],
};
```

#### 6.8.2 Next.js集成

```typescript
// Next.js API路由文档生成
import { createOpenApiNextMiddleware } from 'next-openapi';
import { openAPISpec } from './openapi-spec';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createOpenApiNextMiddleware({
  apiSpec: openAPISpec,
  ui: 'swagger-ui',
  docsUrl: '/api/docs',
  apiDocsUrl: '/api/docs/json',
});

// 自动生成OpenAPI规范的装饰器
export function OpenAPIEndpoint(
  summary: string,
  description?: string,
  tags?: string[]
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const result = await method.apply(this, args);
      
      return result;
    };
    
    return descriptor;
  };
}

// 使用示例
export class UserAPIHandler {
  @OpenAPIEndpoint(
    '获取用户信息',
    '根据用户ID获取用户详细信息',
    ['Users']
  )
  static async GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');
    
    const user = await getUserById(userId);
    
    return NextResponse.json(createSuccessResponse(user));
  }
}
```

### 6.9 API测试工具集成

#### 6.9.1 Postman集合配置

```json
{
  "info": {
    "name": "小语AI应用API",
    "description": "小语AI应用后端API接口测试集合",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "用户服务",
      "item": [
        {
          "name": "获取用户信息",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users/{{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["users", "{{userId}}"]
            }
          }
        },
        {
          "name": "创建用户",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"测试用户\",\n  \"age\": 8,\n  \"guardian\": \"测试监护人\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users",
              "host": ["{{baseUrl}}"],
              "path": ["users"]
            }
          }
        }
      ]
    },
    {
      "name": "AI服务",
      "item": [
        {
          "name": "发送文本消息",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"userId\": \"{{userId}}\",\n  \"message\": \"你好\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/ai/message",
              "host": ["{{baseUrl}}"],
              "path": ["ai", "message"]
            }
          }
        }
      ]
    }
  ]
}
```

#### 6.9.2 自动化测试配置

```typescript
// Jest API测试配置
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { UserServiceAPI } from '@/services/user';

describe('User API Tests', () => {
  let userService: UserServiceAPI;
  let testUserId: string;
  
  beforeAll(() => {
    userService = new UserServiceAPI('http://localhost:3000');
  });
  
  afterAll(async () => {
    if (testUserId) {
      await userService.deleteUser(testUserId);
    }
  });
  
  describe('POST /users', () => {
    it('应该成功创建用户', async () => {
      const userData = {
        name: '测试用户',
        age: 8,
        guardian: '测试监护人',
      };
      
      const user = await userService.createUser(userData);
      
      expect(user).toHaveProperty('id');
      expect(user.name).toBe(userData.name);
      expect(user.age).toBe(userData.age);
      
      testUserId = user.id;
    });
    
    it('应该拒绝无效的用户数据', async () => {
      const invalidData = {
        name: '',
        age: -1,
      };
      
      await expect(userService.createUser(invalidData)).rejects.toThrow();
    });
  });
  
  describe('GET /users/:id', () => {
    it('应该成功获取用户信息', async () => {
      const user = await userService.getUserInfo(testUserId);
      
      expect(user).toHaveProperty('id', testUserId);
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('age');
    });
    
    it('应该返回404当用户不存在时', async () => {
      await expect(
        userService.getUserInfo('non_existent_user')
      ).rejects.toThrow();
    });
  });
});

// Playwright E2E测试
import { test, expect } from '@playwright/test';

test.describe('API E2E Tests', () => {
  test('完整的用户交互流程', async ({ request }) => {
    const baseUrl = 'http://localhost:3000/api/v1';
    
    const createResponse = await request.post(`${baseUrl}/users`, {
      data: {
        name: 'E2E测试用户',
        age: 8,
      },
    });
    
    expect(createResponse.ok()).toBeTruthy();
    const user = await createResponse.json();
    expect(user.success).toBe(true);
    
    const getResponse = await request.get(`${baseUrl}/users/${user.data.id}`);
    expect(getResponse.ok()).toBeTruthy();
    const getUser = await getResponse.json();
    expect(getUser.data.name).toBe('E2E测试用户');
    
    const deleteResponse = await request.delete(
      `${baseUrl}/users/${user.data.id}`
    );
    expect(deleteResponse.ok()).toBeTruthy();
  });
});
```

---

## 7. 用户信息及全局形象系统

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
    return {
      basicInfo: {
        id: apiData.id,
        name: apiData.name,
        nickname: apiData.nickname,
        age: apiData.age,
        gender: apiData.gender,
        avatar: apiData.avatar,
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
        avatarId: apiData.globalAvatar?.avatarId || 'default',
        avatarName: apiData.globalAvatar?.avatarName || '默认头像',
        avatarImage: apiData.globalAvatar?.avatarImage || '/images/avatars/default.png',
        avatarType: apiData.globalAvatar?.avatarType || '2d',
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

- [AI浮窗为中心全局语音交互弹窗控制系统.md](/Users/yanyu/yyc3-xiaoyu-ai/docs/言语记忆/AI浮窗为中心全局语音交互弹窗控制系统.md)
- [前端架构设计文档.md](/Users/yanyu/yyc3-xiaoyu-ai/docs/YYC3-XY-架构设计/架构类/02-YYC3-XY-架构类-前端架构设计文档.md)
- [接口架构设计文档.md](/Users/yanyu/yyc3-xiaoyu-ai/docs/YYC3-XY-架构设计/架构类/04-YYC3-XY-架构类-接口架构设计文档.md)
- [小语AI应用UI-UX全量设计规划文档.md](/Users/yanyu/yyc3-xiaoyu-ai/docs/YYC3-XY-架构设计/架构类/小语AI应用UI-UX全量设计规划文档.md)

### 11.3 版本历史

| 版本 | 日期 | 作者 | 说明 |
|------|------|------|------|
| V1.0 | 2025-01-01 | YYC³ Team | 初始版本，包含API接口体系、用户信息及全局形象系统、信息映射系统等核心章节 |

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
