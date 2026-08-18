import { growthService } from '../growth/growthService';
import { growthAIService } from './growthAIService';
import { GrowthNode } from '../../types/growth';

export class AIPopupIntegration {
  private static instance: AIPopupIntegration;

  static getInstance(): AIPopupIntegration {
    if (!AIPopupIntegration.instance) {
      AIPopupIntegration.instance = new AIPopupIntegration();
    }
    return AIPopupIntegration.instance;
  }

  async getGrowthSummary(age?: number): Promise<string> {
    try {
      const tree = await growthService.getGrowthTree();

      const filteredTree = age ? tree.filter(node => node.age === age) : tree;

      const summary = await growthAIService.summarizeMilestones(
        filteredTree.flatMap(node => node.content.milestones)
      );

      return summary;
    } catch (error) {
      console.error('获取成长摘要失败:', error);
      return '暂时无法获取成长摘要';
    }
  }

  async analyzeRecentTrends(days: number = 30): Promise<any> {
    try {
      const tree = await growthService.getGrowthTree();

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentRecords = tree.filter(
        node => new Date(node.metadata.created) >= cutoffDate
      );

      return {
        recordCount: recentRecords.length,
        byType: this.groupByType(recentRecords),
        culturalDensity: this.calculateCulturalDensity(recentRecords),
        aiInsights: await this.generateTrendInsights(recentRecords),
      };
    } catch (error) {
      console.error('分析成长趋势失败:', error);
      return null;
    }
  }

  async getCulturalSuggestions(
    age?: number,
    interests?: string[]
  ): Promise<any[]> {
    try {
      const currentAge = age || (await this.getCurrentAge());
      const childInterests = interests || (await this.getChildInterests());

      return await growthService.getCulturalRecommendations(currentAge);
    } catch (error) {
      console.error('获取文化推荐失败:', error);
      return [];
    }
  }

  async recordAIEvent(event: {
    type: string;
    description: string;
    confidence: number;
    evidence?: any[];
    suggestions?: string[];
  }): Promise<string> {
    try {
      const age = await this.getCurrentAge();

      const record: Partial<GrowthNode> = {
        age,
        phase: `AI检测_${event.type}`,
        content: {
          title: `AI记录：${event.type}`,
          description: event.description,
          type: this.mapEventType(event.type) as any,
          category: 'AI检测',
          milestones: [
            {
              id: `ai_milestone_${Date.now()}`,
              date: new Date().toISOString(),
              title: `AI检测到的${event.type}`,
              description: event.description,
              type: 'achievement',
              aiSummary: `AI分析：置信度${event.confidence}`,
            },
          ],
          attachments: [],
          culturalElements: [],
          smartTags: ['AI检测', event.type, '自动化记录'],
        },
        metadata: {
          aiGenerated: true,
          importance: Math.round(event.confidence * 10),
          emotionTags: ['惊喜', '发现'],
          culturalDensity: 0.3,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0',
          relatedNodes: [],
        },
      };

      return await growthService.addGrowthRecord(record);
    } catch (error) {
      console.error('记录AI事件失败:', error);
      throw error;
    }
  }

  async generateGrowthReport(options: {
    reportType: 'weekly' | 'monthly' | 'annual';
    includeAI: boolean;
    culturalFocus?: boolean;
  }): Promise<any> {
    try {
      const tree = await growthService.getGrowthTree();

      let filteredTree = tree;
      if (options.reportType === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredTree = tree.filter(
          node => new Date(node.metadata.created) >= weekAgo
        );
      } else if (options.reportType === 'monthly') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredTree = tree.filter(
          node => new Date(node.metadata.created) >= monthAgo
        );
      }

      const report: any = {
        period: options.reportType,
        totalRecords: filteredTree.length,
        milestones: filteredTree.flatMap(n => n.content.milestones).length,
        culturalActivities: filteredTree.filter(
          n => n.content.type === 'cultural'
        ).length,
        growthAreas: this.analyzeGrowthAreas(filteredTree),
      };

      if (options.includeAI) {
        report['aiAnalysis'] =
          await this.generateAIReportAnalysis(filteredTree);
      }

      if (options.culturalFocus) {
        report['culturalAnalysis'] = this.analyzeCulturalFocus(filteredTree);
      }

      return report;
    } catch (error) {
      console.error('生成成长报告失败:', error);
      return null;
    }
  }

  async answerGrowthQuestion(question: string, context?: any): Promise<string> {
    try {
      const tree = await growthService.getGrowthTree();
      const timeline = await growthService.getGrowthTimeline();

      const prompt = this.buildQuestionPrompt(
        question,
        tree,
        timeline,
        context
      );
      const answer = await this.callAIApi(prompt);

      return answer;
    } catch (error) {
      console.error('回答成长问题失败:', error);
      return '暂时无法回答这个问题';
    }
  }

  async triggerGrowthReminder(
    type: 'milestone' | 'cultural' | 'health' | 'academic'
  ): Promise<any> {
    try {
      const age = await this.getCurrentAge();
      const tree = await growthService.getGrowthTree();

      const ageRecords = tree.filter(node => node.age === age);
      const typeRecords = ageRecords.filter(node => node.content.type === type);

      const expectedMilestones = this.getExpectedMilestones(age, type);
      const achievedMilestones = this.getAchievedMilestones(typeRecords);

      const missingMilestones = expectedMilestones.filter(
        expected =>
          !achievedMilestones.some(achieved =>
            this.similarMilestones(expected, achieved)
          )
      );

      return {
        type,
        age,
        expected: expectedMilestones.length,
        achieved: achievedMilestones.length,
        missing: missingMilestones,
        suggestions: this.generateReminderSuggestions(
          missingMilestones,
          age,
          type
        ),
      };
    } catch (error) {
      console.error('触发成长提醒失败:', error);
      return null;
    }
  }

  private async getCurrentAge(): Promise<number> {
    return 8; // Mock
  }

  private async getChildInterests(): Promise<string[]> {
    const tree = await growthService.getGrowthTree();
    const interests: string[] = [];

    tree.forEach(node => {
      if (node.content.smartTags) {
        interests.push(...node.content.smartTags);
      }
    });

    return [...new Set(interests)];
  }

  private mapEventType(eventType: string): string {
    const mapping: Record<string, string> = {
      语言发展: 'academic',
      社交互动: 'social',
      文化体验: 'cultural',
      健康行为: 'health',
      认知发展: 'perception',
    };

    return mapping[eventType] || 'perception';
  }

  private groupByType(records: GrowthNode[]): Record<string, number> {
    return records.reduce(
      (acc, node) => {
        const type = node.content.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private calculateCulturalDensity(records: GrowthNode[]): number {
    const culturalRecords = records.filter(
      node =>
        node.content.type === 'cultural' ||
        node.content.culturalElements.length > 0
    );

    return records.length > 0 ? culturalRecords.length / records.length : 0;
  }

  private async generateTrendInsights(records: GrowthNode[]): Promise<any[]> {
    const insights = [];

    if (records.length > 0) {
      const typeDistribution = this.groupByType(records);
      const dominantType = Object.entries(typeDistribution).sort(
        ([, a], [, b]) => b - a
      )[0];

      if (dominantType) {
        insights.push({
          type: '趋势分析',
          description: `最近主要关注${dominantType[0]}领域`,
          confidence: 0.8,
        });
      }

      const culturalDensity = this.calculateCulturalDensity(records);
      if (culturalDensity > 0.3) {
        insights.push({
          type: '文化浸润',
          description: '文化相关活动较为丰富',
          confidence: culturalDensity,
        });
      }
    }

    return insights;
  }

  private analyzeGrowthAreas(records: GrowthNode[]): any[] {
    const areas = records.reduce(
      (acc, node) => {
        const area = node.content.type;
        if (!acc[area]) {
          acc[area] = { count: 0, records: [] };
        }
        acc[area].count++;
        acc[area].records.push(node.id);
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.entries(areas).map(([area, data]) => ({
      area,
      count: data.count,
      percentage: Math.round((data.count / records.length) * 100),
    }));
  }

  private async generateAIReportAnalysis(records: GrowthNode[]): Promise<any> {
    const analysis = await growthAIService.analyzeGrowth({
      age: await this.getCurrentAge(),
      phase: 'AI报告分析',
      content: {
        title: '成长报告分析',
        description: '基于历史记录的分析',
        type: 'academic',
        category: 'AI分析',
        milestones: records.flatMap(r => r.content.milestones),
        attachments: [],
        culturalElements: [],
        smartTags: [],
      },
      metadata: {
        importance: 8,
        culturalDensity: this.calculateCulturalDensity(records),
      },
    });

    return analysis;
  }

  private analyzeCulturalFocus(records: GrowthNode[]): any {
    const culturalRecords = records.filter(
      node =>
        node.content.type === 'cultural' ||
        node.content.culturalElements.length > 0
    );

    const culturalElements = culturalRecords.flatMap(
      node => node.content.culturalElements
    );

    return {
      total: culturalRecords.length,
      elements: culturalElements.map(el => ({
        type: el.type,
        name: el.name,
        count: 1,
      })),
      diversity: this.calculateCulturalDiversity(culturalElements),
    };
  }

  private calculateCulturalDiversity(elements: any[]): number {
    const uniqueTypes = new Set(elements.map(el => el.type));
    return uniqueTypes.size / Math.max(elements.length, 1);
  }

  private buildQuestionPrompt(
    question: string,
    tree: any[],
    timeline: any,
    context?: any
  ): string {
    const relevantRecords = this.findRelevantRecords(question, tree);

    return `问题：${question}\n\n相关记录：${relevantRecords.length}条`;
  }

  private findRelevantRecords(question: string, tree: any[]): any[] {
    const keywords = question.toLowerCase().split(' ');

    return tree.filter(node => {
      const contentStr = JSON.stringify(node.content).toLowerCase();
      const metadataStr = JSON.stringify(node.metadata).toLowerCase();

      return keywords.some(
        keyword => contentStr.includes(keyword) || metadataStr.includes(keyword)
      );
    });
  }

  private async callAIApi(prompt: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`这是AI对问题的回答：\n\n基于成长记录分析...`);
      }, 1000);
    });
  }

  private getExpectedMilestones(age: number, type: string): any[] {
    const milestones: Record<string, Record<number, any[]>> = {
      cultural: {
        3: [{ title: '第一次参观文化遗址', description: '如龙门石窟、白马寺' }],
        6: [{ title: '了解传统节日习俗', description: '春节、端午节等' }],
        8: [
          { title: '学习河洛历史故事', description: '如武则天、白居易的故事' },
        ],
      },
      academic: {
        7: [{ title: '独立完成作业', description: '养成良好的学习习惯' }],
        10: [{ title: '学科竞赛参与', description: '数学、语文等竞赛' }],
      },
    };

    return milestones[type]?.[age] || [];
  }

  private getAchievedMilestones(records: GrowthNode[]): any[] {
    return records.flatMap(record =>
      record.content.milestones.map(m => ({
        title: m.title,
        description: m.description,
        type: m.type,
        date: m.date,
      }))
    );
  }

  private similarMilestones(expected: any, achieved: any): boolean {
    const expectedStr = expected.title.toLowerCase();
    const achievedStr = achieved.title.toLowerCase();

    return (
      expectedStr.includes(achievedStr) || achievedStr.includes(expectedStr)
    );
  }

  private generateReminderSuggestions(
    missingMilestones: any[],
    age: number,
    type: string
  ): string[] {
    const suggestions: string[] = [];

    missingMilestones.forEach(milestone => {
      suggestions.push(
        `建议安排：${milestone.title}（${milestone.description}）`
      );
    });

    if (type === 'cultural') {
      suggestions.push(
        `洛阳有丰富的文化资源，可以考虑参观博物馆或参加文化活动`
      );
    }

    return suggestions;
  }

  registerEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener(
      'ai-popup-request',
      this.handleAIPopupRequest.bind(this) as EventListener
    );
    window.addEventListener(
      'growth-record-added',
      this.handleNewGrowthRecord.bind(this) as EventListener
    );
    window.addEventListener(
      'milestone-achieved',
      this.handleMilestoneAchieved.bind(this) as EventListener
    );
  }

  private async handleAIPopupRequest(event: CustomEvent): Promise<void> {
    const { type, data } = event.detail;

    let response;
    switch (type) {
      case 'get-growth-summary':
        response = await this.getGrowthSummary(data.age);
        break;
      case 'analyze-trends':
        response = await this.analyzeRecentTrends(data.days);
        break;
      case 'get-suggestions':
        response = await this.getCulturalSuggestions(data.age, data.interests);
        break;
      case 'generate-report':
        response = await this.generateGrowthReport(data.options);
        break;
      case 'answer-question':
        response = await this.answerGrowthQuestion(data.question, data.context);
        break;
      default:
        response = { error: '未知请求类型' };
    }

    const responseEvent = new CustomEvent('ai-popup-response', {
      detail: { type, data, response },
    });
    window.dispatchEvent(responseEvent);
  }

  private async handleNewGrowthRecord(event: CustomEvent): Promise<void> {
    const { record } = event.detail;

    if (record.metadata.importance >= 7) {
      const analysis = await growthAIService.analyzeGrowth({
        age: record.age,
        phase: record.phase,
        content: record.content,
        metadata: record.metadata,
      });

      const aiPopupEvent = new CustomEvent('trigger-ai-popup', {
        detail: {
          type: 'growth-analysis',
          title: '成长记录AI分析',
          content: analysis.summary,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
        },
      });
      window.dispatchEvent(aiPopupEvent);
    }
  }

  private async handleMilestoneAchieved(event: CustomEvent): Promise<void> {
    const { milestone, age } = event.detail;

    await this.recordAIEvent({
      type: '里程碑达��',
      description: `达成了重要里程碑：${milestone.title}`,
      confidence: 0.9,
      evidence: [milestone],
      suggestions: [
        '可以记录更多相关经历',
        '考虑安排庆祝活动',
        '分享给家人和朋友',
      ],
    });

    const celebrationEvent = new CustomEvent('trigger-celebration-popup', {
      detail: {
        milestone,
        age,
        message: `恭喜达成${milestone.title}里程碑！`,
      },
    });
    window.dispatchEvent(celebrationEvent);
  }

  getExportMethods() {
    return {
      getGrowthSummary: this.getGrowthSummary.bind(this),
      analyzeRecentTrends: this.analyzeRecentTrends.bind(this),
      getCulturalSuggestions: this.getCulturalSuggestions.bind(this),
      recordAIEvent: this.recordAIEvent.bind(this),
      generateGrowthReport: this.generateGrowthReport.bind(this),
      answerGrowthQuestion: this.answerGrowthQuestion.bind(this),
      triggerGrowthReminder: this.triggerGrowthReminder.bind(this),
      registerEventListeners: this.registerEventListeners.bind(this),
      getCurrentAge: this.getCurrentAge.bind(this),
      getChildInterests: this.getChildInterests.bind(this),
    };
  }
}

export const aiPopupIntegration = AIPopupIntegration.getInstance();
export const growthAI = aiPopupIntegration.getExportMethods();

if (typeof window !== 'undefined') {
  aiPopupIntegration.registerEventListeners();
}
