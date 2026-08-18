/**
 * 增强版AI响应生成器
 * 集成性能优化、智能路由、批量处理等功能
 */

import { generateText } from 'ai';
import {
  AI_ROLES,
  analyzeQueryComplexity,
  getCoordinatedPrompt,
} from '@/lib/ai_roles';
import { aiOptimizer } from '@/lib/ai/performance-optimizer';
import { getModel } from './model-provider';

/** 获取已配置的真实模型实例；未配置时抛出明确错误（调用方应降级处理） */
function requireModel() {
  const model = getModel();
  if (!model) {
    throw new Error(
      'AI model provider not configured (set OPENAI_API_KEY or AI_API_KEY + AI_BASE_URL)'
    );
  }
  return model;
}

export interface EnhancedResponseOptions {
  useCache?: boolean;
  priority?: 'high' | 'normal' | 'low';
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  role: string;
  complexity: 'simple' | 'medium' | 'complex';
  supportingInsights?: Array<{
    role: string;
    roleName: string;
    roleIcon: string;
    insight: string;
  }>;
  suggestedActions?: string[];
  processingTime: number;
  cacheHit?: boolean;
}

export interface ChildContext {
  age?: number;
  gender?: 'male' | 'female';
  name?: string;
  preferences?: string[];
  history?: Array<{
    timestamp: number;
    message: string;
    response: string;
  }>;
  emotionState?: {
    type: string;
    intensity: number;
    timestamp: number;
  };
  [key: string]: unknown;
}

export interface BatchRequest {
  message: string;
  childContext?: ChildContext;
  options?: EnhancedResponseOptions;
}

export class EnhancedResponseGenerator {
  // 智能生成响应
  async generateResponse(
    message: string,
    childContext?: ChildContext,
    options: EnhancedResponseOptions = {}
  ): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      // 1. 分析查询复杂度
      const { complexity, involvedRoles } = analyzeQueryComplexity(message);

      // 2. 根据复杂度选择生成策略
      let response: AIResponse;

      switch (complexity) {
        case 'simple':
          response = await this.generateSimpleResponse(
            message,
            involvedRoles[0],
            childContext,
            options
          );
          break;
        case 'medium':
          response = await this.generateMediumResponse(
            message,
            involvedRoles,
            childContext,
            options
          );
          break;
        case 'complex':
          response = await this.generateComplexResponse(
            message,
            involvedRoles,
            childContext,
            options
          );
          break;
        default:
          throw new Error(`未知的复杂度级别: ${complexity}`);
      }

      // 3. 添加性能元数据
      response.processingTime = Date.now() - startTime;
      response.complexity = complexity;

      // 4. 记录到优化器
      await aiOptimizer.routeRequest(message, childContext, {
        useCache: options.useCache,
        priority: options.priority,
        predictedActions: ['ai_chat'],
      });

      return response;
    } catch (error) {
      console.error('[EnhancedResponseGenerator Error]', error);
      throw new Error(`AI响应生成失败: ${error.message}`);
    }
  }

  // 生成简单响应（单角色）
  private async generateSimpleResponse(
    message: string,
    role: string,
    childContext?: ChildContext,
    options?: EnhancedResponseOptions
  ): Promise<AIResponse> {
    const roleConfig = AI_ROLES[role];

    // 检查缓存
    const cacheKey = `simple:${role}:${message}`;
    const cached = aiOptimizer.get(cacheKey, childContext);
    if (cached) {
      return {
        ...cached,
        cacheHit: true,
      };
    }

    // 生成响应
    const { text } = await generateText({
      model: requireModel(),
      system: getCoordinatedPrompt(message, [role]),
      prompt: message,
      maxTokens: options?.maxTokens || 300,
      temperature: options?.temperature || 0.7,
    });

    const response: AIResponse = {
      content: text,
      role,
      complexity: 'simple',
      processingTime: 0,
    };

    // 缓存响应
    aiOptimizer.set(cacheKey, response, childContext, 5 * 60 * 1000); // 5分钟缓存

    return response;
  }

  // 生成中等复杂度响应（主角色+辅助角色）
  private async generateMediumResponse(
    message: string,
    involvedRoles: string[],
    childContext?: ChildContext,
    options?: EnhancedResponseOptions
  ): Promise<AIResponse> {
    const mainRole = involvedRoles[0];
    const supportRole = involvedRoles[1] || 'advisor';

    // 检查缓存
    const cacheKey = `medium:${mainRole}:${supportRole}:${message}`;
    const cached = aiOptimizer.get(cacheKey, childContext);
    if (cached) {
      return {
        ...cached,
        cacheHit: true,
      };
    }

    // 并行生成主响应和辅助响应
    const [mainResponse, supportResponse] = await Promise.all([
      generateText({
        model: requireModel(),
        system: AI_ROLES[mainRole].systemPrompt,
        prompt: message,
        maxTokens: options?.maxTokens || 250,
        temperature: options?.temperature || 0.7,
      }),
      generateText({
        model: requireModel(),
        system: `基于"${AI_ROLES[supportRole].name}"的视角，针对以下问题给出补充建议（50字以内）：`,
        prompt: message,
        maxTokens: 100,
        temperature: 0.6,
      }),
    ]);

    const response: AIResponse = {
      content: mainResponse.text,
      role: mainRole,
      complexity: 'medium',
      supportingInsights: [
        {
          role: supportRole,
          roleName: AI_ROLES[supportRole].name,
          roleIcon: AI_ROLES[supportRole].icon,
          insight: supportResponse.text,
        },
      ],
      processingTime: 0,
    };

    // 缓存响应
    aiOptimizer.set(cacheKey, response, childContext, 3 * 60 * 1000); // 3分钟缓存

    return response;
  }

  // 生成复杂响应（多角色协同）
  private async generateComplexResponse(
    message: string,
    involvedRoles: string[],
    childContext?: ChildContext,
    options?: EnhancedResponseOptions
  ): Promise<AIResponse> {
    // 检查缓存
    const cacheKey = `complex:${involvedRoles.join(',')}:${message}`;
    const cached = aiOptimizer.get(cacheKey, childContext);
    if (cached) {
      return {
        ...cached,
        cacheHit: true,
      };
    }

    // 生成综合响应
    const coordinatedPrompt = getCoordinatedPrompt(message, involvedRoles);
    const { text: mainText } = await generateText({
      model: requireModel(),
      system: coordinatedPrompt,
      prompt: message,
      maxTokens: options?.maxTokens || 400,
      temperature: options?.temperature || 0.8,
    });

    // 并行生成各角色的专项建议
    const roleInsights = await Promise.all(
      involvedRoles.slice(1, 4).map(async role => {
        const { text } = await generateText({
          model: requireModel(),
          system: `你是"${AI_ROLES[role].name}"，请从你的专业角度给出一条简短建议（30字以内）：`,
          prompt: message,
          maxTokens: 60,
          temperature: 0.6,
        });
        return {
          role,
          roleName: AI_ROLES[role].name,
          roleIcon: AI_ROLES[role].icon,
          insight: text,
        };
      })
    );

    // 生成行动建议
    const { text: actionsText } = await generateText({
      model: requireModel(),
      system:
        '基于上述分析，给出3条具体可行的行动建议，每条15字以内，用|分隔：',
      prompt: `问题：${message}\n分析：${mainText}`,
      maxTokens: 80,
      temperature: 0.5,
    });

    const suggestedActions = actionsText
      .split('|')
      .map(a => a.trim())
      .filter(Boolean);

    const response: AIResponse = {
      content: mainText,
      role: involvedRoles[0],
      complexity: 'complex',
      supportingInsights: roleInsights,
      suggestedActions,
      processingTime: 0,
    };

    // 缓存响应
    aiOptimizer.set(cacheKey, response, childContext, 2 * 60 * 1000); // 2分钟缓存

    return response;
  }

  // 流式响应生成
  async *generateStreamingResponse(
    message: string,
    childContext?: ChildContext,
    options?: EnhancedResponseOptions
  ): AsyncGenerator<Partial<AIResponse>, void, unknown> {
    const startTime = Date.now();
    const { complexity, involvedRoles } = analyzeQueryComplexity(message);

    yield {
      complexity,
      role: involvedRoles[0],
      processingTime: Date.now() - startTime,
    };

    // 这里可以实现流式生成逻辑
    // 现在简单返回完整响应
    const response = await this.generateResponse(
      message,
      childContext,
      options
    );
    yield response;
  }

  // 批量响应生成
  async generateBatchResponses(
    requests: BatchRequest[]
  ): Promise<AIResponse[]> {
    // 按复杂度分组
    const simpleRequests = requests.filter(
      r => analyzeQueryComplexity(r.message).complexity === 'simple'
    );
    const mediumRequests = requests.filter(
      r => analyzeQueryComplexity(r.message).complexity === 'medium'
    );
    const complexRequests = requests.filter(
      r => analyzeQueryComplexity(r.message).complexity === 'complex'
    );

    // 并行处理不同复杂度的请求
    const [simpleResponses, mediumResponses, complexResponses] =
      await Promise.all([
        this.processBatchSimple(simpleRequests),
        this.processBatchMedium(mediumRequests),
        this.processBatchComplex(complexRequests),
      ]);

    // 合并并排序结果
    const allResponses = [
      ...simpleResponses,
      ...mediumResponses,
      ...complexResponses,
    ];
    return requests.map((req, index) => allResponses[index]);
  }

  private async processBatchSimple(
    requests: BatchRequest[]
  ): Promise<AIResponse[]> {
    return Promise.all(
      requests.map(req =>
        this.generateSimpleResponse(
          req.message,
          analyzeQueryComplexity(req.message).involvedRoles[0],
          req.childContext,
          req.options
        )
      )
    );
  }

  private async processBatchMedium(
    requests: BatchRequest[]
  ): Promise<AIResponse[]> {
    return Promise.all(
      requests.map(req =>
        this.generateMediumResponse(
          req.message,
          analyzeQueryComplexity(req.message).involvedRoles,
          req.childContext,
          req.options
        )
      )
    );
  }

  private async processBatchComplex(
    requests: BatchRequest[]
  ): Promise<AIResponse[]> {
    return Promise.all(
      requests.map(req =>
        this.generateComplexResponse(
          req.message,
          analyzeQueryComplexity(req.message).involvedRoles,
          req.childContext,
          req.options
        )
      )
    );
  }

  // 性能监控
  getPerformanceMetrics() {
    return {
      cacheHitRate: aiOptimizer.getCacheHitRate(),
      averageResponseTime: aiOptimizer.getAverageResponseTime(),
      requestQueueSize: aiOptimizer.getRequestQueueSize(),
      memoryUsage: process.memoryUsage(),
    };
  }

  // 缓存管理
  clearCache(): void {
    aiOptimizer.clearCache();
  }

  // 预热缓存
  async warmupCache(): Promise<void> {
    const warmupQueries = [
      '宝宝今天哭闹怎么办',
      '如何记录成长瞬间',
      '推荐一些适合的学习内容',
      '宝宝发育正常吗',
      '如何教宝宝说话',
    ];

    for (const query of warmupQueries) {
      await this.generateResponse(query);
    }
  }
}

// 导出单例
export const enhancedAI = new EnhancedResponseGenerator();

// 自动预热缓存（在服务端）
if (typeof window === 'undefined') {
  enhancedAI.warmupCache().catch(console.error);
}
