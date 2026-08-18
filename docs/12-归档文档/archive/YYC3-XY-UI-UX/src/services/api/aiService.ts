import { BaseAPIService } from './baseService';
import { API_PATHS } from './config';
import { ChatMessage } from '../../types';

export interface TextMessageRequest {
  userId: string;
  message: string;
  context?: ConversationContext;
  options?: MessageOptions;
}

export interface TextMessageResponse {
  messageId: string;
  response: string;
  sessionId: string;
  timestamp: string;
  suggestions?: string[];
}

export interface ConversationContext {
  sessionId?: string;
  previousMessages?: ChatMessage[];
  currentTopic?: string;
}

export interface MessageOptions {
  temperature?: number;
  maxTokens?: number;
  includeVoice?: boolean;
}

export interface VoiceRecognitionParams {
  userId: string;
  language?: 'zh-CN' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
}

export interface VoiceSession {
  sessionId: string;
  userId: string;
  status: 'listening' | 'processing' | 'completed' | 'error';
  startTime: string;
}

export interface AISuggestion {
  id: string;
  text: string;
  type: 'question' | 'topic' | 'action';
  priority: number;
}

export class AIService extends BaseAPIService {
  protected async getMockData<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Text message request
    if (endpoint.includes('/message') && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body as string) : {};
      return this.getMockTextResponse(body) as T;
    }

    // Voice recognition start
    if (endpoint.includes('/voice/start')) {
      return this.getMockVoiceSession() as T;
    }

    // Conversation history
    if (endpoint.includes('/conversations/')) {
      return this.getMockConversationHistory() as T;
    }

    // AI suggestions
    if (endpoint.includes('/suggestions/')) {
      return this.getMockSuggestions() as T;
    }

    return {} as T;
  }

  private getMockTextResponse(request: TextMessageRequest): TextMessageResponse {
    const responses = [
      '你好！我是小语，很高兴能帮助你学习！',
      '这是一个很棒的问题！让我们一起探索吧。',
      '你做得很好！继续保持这样的学习热情！',
      '我理解你的想法，我们可以从另一个角度来看这个问题。',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      messageId: `msg_${Date.now()}`,
      response: randomResponse,
      sessionId: request.context?.sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      suggestions: [
        '继续学习',
        '查看更多示例',
        '尝试练习题',
      ],
    };
  }

  private getMockVoiceSession(): VoiceSession {
    return {
      sessionId: `voice_${Date.now()}`,
      userId: 'user123',
      status: 'listening',
      startTime: new Date().toISOString(),
    };
  }

  private getMockConversationHistory(): ChatMessage[] {
    return [
      {
        id: 'msg1',
        role: 'user',
        content: '你好！',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: 'msg2',
        role: 'assistant',
        content: '你好！我是小语，很高兴认识你！',
        timestamp: new Date(Date.now() - 50000).toISOString(),
      },
      {
        id: 'msg3',
        role: 'user',
        content: '我想学习关于龙门石窟的知识',
        timestamp: new Date(Date.now() - 40000).toISOString(),
      },
      {
        id: 'msg4',
        role: 'assistant',
        content: '龙门石窟是中国著名的石窟艺术宝库之一，位于洛阳...',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
    ];
  }

  private getMockSuggestions(): AISuggestion[] {
    return [
      {
        id: 'sug1',
        text: '探索龙门石窟的历史',
        type: 'topic',
        priority: 1,
      },
      {
        id: 'sug2',
        text: '学习古诗词',
        type: 'topic',
        priority: 2,
      },
      {
        id: 'sug3',
        text: '完成今日作业',
        type: 'action',
        priority: 3,
      },
    ];
  }

  async sendTextMessage(request: TextMessageRequest): Promise<TextMessageResponse> {
    return this.post<TextMessageResponse>(
      `${API_PATHS[this.apiVersion].AI}/message`,
      request
    );
  }

  async startVoiceRecognition(params: VoiceRecognitionParams): Promise<VoiceSession> {
    return this.post<VoiceSession>(
      `${API_PATHS[this.apiVersion].AI}/voice/start`,
      params
    );
  }

  async stopVoiceRecognition(sessionId: string): Promise<void> {
    return this.post<void>(
      `${API_PATHS[this.apiVersion].AI}/voice/stop`,
      { sessionId }
    );
  }

  async getConversationHistory(
    userId: string,
    params?: { limit?: number; before?: string; after?: string }
  ): Promise<ChatMessage[]> {
    return this.get<ChatMessage[]>(
      `${API_PATHS[this.apiVersion].AI}/conversations/${userId}`,
      params
    );
  }

  async clearConversationHistory(userId: string): Promise<void> {
    return this.delete<void>(
      `${API_PATHS[this.apiVersion].AI}/conversations/${userId}`
    );
  }

  async getAISuggestions(
    userId: string,
    context: Record<string, any>
  ): Promise<AISuggestion[]> {
    return this.post<AISuggestion[]>(
      `${API_PATHS[this.apiVersion].AI}/suggestions/${userId}`,
      context
    );
  }
}

// 创建单例实例
export const aiService = new AIService();