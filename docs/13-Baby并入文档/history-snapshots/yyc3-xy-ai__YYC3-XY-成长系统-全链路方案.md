# YYC3-XY-成长系统-全链路方案

完整的Web端智能成长记录系统，包含数据管理、可视化展示、AI集成等功能。

### 一、系统架构设计

// /src/types/growth.ts - 智能成长系统核心类型定义
export interface GrowthNode {
  id: string;
  age: number;
  phase: string;
  path: string;
  content: GrowthContent;
  metadata: GrowthMetadata;
  children?: GrowthNode[];
  aiAnalysis?: AIAnalysis;
}

export interface GrowthContent {
  title: string;
  description: string;
  type: 'perception' | 'health' | 'social' | 'academic' | 'cultural' | 'career';
  category: string;
  milestones: Milestone[];
  attachments: Attachment[];
  culturalElements: CulturalElement[];
  smartTags: string[];
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'first' | 'achievement' | 'learning' | 'cultural' | 'social';
  evidence?: Evidence[];
  aiSummary?: string;
}

export interface Evidence {
  type: 'photo' | 'video' | 'audio' | 'document' | 'certificate';
  url: string;
  thumbnail?: string;
  metadata: {
    date: string;
    location?: string;
    participants?: string[];
    duration?: number;
  };
}

export interface CulturalElement {
  type: '河洛文化' | '传统节日' | '地方习俗' | '历史遗迹' | '文化符号';
  name: string;
  description: string;
  connection: string; // 与成长的关联
  significance: number; // 重要性评分 1-5
}

export interface GrowthMetadata {
  created: string;
  updated: string;
  version: string;
  aiGenerated: boolean;
  importance: number; // 1-10
  emotionTags: string[];
  relatedNodes: string[]; // 相关节点ID
  culturalDensity: number; // 文化密度 0-1
}

export interface AIAnalysis {
  summary: string;
  insights: Insight[];
  recommendations: Recommendation[];
  patterns: Pattern[];
  predictions: Prediction[];
}

export interface Insight {
  category: '健康' | '认知' | '社交' | '情感' | '文化';
  description: string;
  confidence: number;
  evidence: string[];
}

export interface Recommendation {
  type: 'immediate' | 'short-term' | 'long-term';
  category: string;
  action: string;
  reason: string;
  priority: number;
}

export interface Pattern {
  type: 'trend' | 'cycle' | 'correlation';
  description: string;
  confidence: number;
  dataPoints: string[];
}

export interface Prediction {
  timeframe: '1个月' | '3个月' | '6个月' | '1年' | '3年';
  prediction: string;
  confidence: number;
  assumptions: string[];
}

export interface GrowthTimeline {
  nodes: GrowthNode[];
  phases: {
    [age: number]: {
      name: string;
      color: string;
      icon: string;
      summary: string;
    }
  };
  statistics: GrowthStatistics;
}

export interface GrowthStatistics {
  totalRecords: number;
  milestones: number;
  culturalActivities: number;
  attachmentCounts: {
    photos: number;
    videos: number;
    documents: number;
    certificates: number;
  };
  growthAreas: {
    category: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export interface AIAssistantConfig {
  model: string;
  temperature: number;
  contextWindow: number;
  capabilities: {
    analysis: boolean;
    summarization: boolean;
    prediction: boolean;
    recommendation: boolean;
    culturalInsight: boolean;
  };
}

### 二、核心服务层

// /src/services/growth/growthService.ts - 智能成长记录服务
import { GrowthNode, GrowthTimeline, AIAnalysis, GrowthStatistics } from '../../types/growth';
import { storageService } from '../storage/storageService';
import { aiService } from '../ai/aiService';
import { cultureService } from '../culture/cultureService';

class GrowthService {
  private readonly GROWTH_DATA_KEY = 'growth_tree_data';
  private readonly GROWTH_TIMELINE_KEY = 'growth_timeline';
  private readonly GROWTH_STATS_KEY = 'growth_statistics';
  
  // 从Python脚本结构解析生成成长树
  async parsePythonGrowthTree(rootPath: string): Promise<GrowthNode[]> {
    try {
      // 这里可以调用Python脚本解析，或者直接使用模拟数据
      const mockData = await this.generateMockGrowthTree();
      
      // 保存到本地存储
      await storageService.set(this.GROWTH_DATA_KEY, mockData);
      
      // 生成时间线和统计
      await this.generateTimelineAndStats(mockData);
      
      return mockData;
    } catch (error) {
      console.error('解析成长树失败:', error);
      return this.getDefaultGrowthTree();
    }
  }

  // 获取成长树
  async getGrowthTree(): Promise<GrowthNode[]> {
    try {
      const data = await storageService.get<GrowthNode[]>(this.GROWTH_DATA_KEY);
      if (data && data.length > 0) {
        return data;
      }
      return this.parsePythonGrowthTree('/path/to/python/script');
    } catch (error) {
      console.error('获取成长树失败:', error);
      return [];
    }
  }

  // 获取成长时间线
  async getGrowthTimeline(): Promise<GrowthTimeline> {
    try {
      const timeline = await storageService.get<GrowthTimeline>(this.GROWTH_TIMELINE_KEY);
      if (timeline) {
        return timeline;
      }
      
      const nodes = await this.getGrowthTree();
      return this.generateTimeline(nodes);
    } catch (error) {
      console.error('获取成长时间线失败:', error);
      return this.getDefaultTimeline();
    }
  }

  // 获取统计信息
  async getGrowthStatistics(): Promise<GrowthStatistics> {
    try {
      const stats = await storageService.get<GrowthStatistics>(this.GROWTH_STATS_KEY);
      if (stats) {
        return stats;
      }
      
      const nodes = await this.getGrowthTree();
      return this.calculateStatistics(nodes);
    } catch (error) {
      console.error('获取成长统计失败:', error);
      return this.getDefaultStatistics();
    }
  }

  // 添加成长记录
  async addGrowthRecord(record: Partial<GrowthNode>): Promise<string> {
    try {
      const id = `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newNode: GrowthNode = {
        id,
        age: record.age || 0,
        phase: record.phase || '通用',
        path: record.path || '',
        content: {
          title: record.content?.title || '新记录',
          description: record.content?.description || '',
          type: record.content?.type || 'perception',
          category: record.content?.category || 'general',
          milestones: record.content?.milestones || [],
          attachments: record.content?.attachments || [],
          culturalElements: record.content?.culturalElements || [],
          smartTags: record.content?.smartTags || [],
        },
        metadata: {
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0',
          aiGenerated: false,
          importance: record.metadata?.importance || 5,
          emotionTags: record.metadata?.emotionTags || [],
          relatedNodes: record.metadata?.relatedNodes || [],
          culturalDensity: record.metadata?.culturalDensity || 0.5,
        },
      };

      // 请求AI分析
      const aiAnalysis = await this.analyzeGrowthRecord(newNode);
      newNode.aiAnalysis = aiAnalysis;

      // 保存记录
      const currentTree = await this.getGrowthTree();
      const updatedTree = [...currentTree, newNode];
      
      await storageService.set(this.GROWTH_DATA_KEY, updatedTree);
      await this.updateTimelineAndStats(updatedTree);

      // 触发事件通知
      this.notifyRecordAdded(newNode);

      return id;
    } catch (error) {
      console.error('添加成长记录失败:', error);
      throw error;
    }
  }

  // AI分析成长记录
  async analyzeGrowthRecord(record: GrowthNode): Promise<AIAnalysis> {
    try {
      const analysis = await aiService.analyzeGrowth({
        age: record.age,
        phase: record.phase,
        content: record.content,
        metadata: record.metadata,
      });

      return analysis;
    } catch (error) {
      console.error('AI分析失败:', error);
      return this.getDefaultAnalysis();
    }
  }

  // 获取文化相关推荐
  async getCulturalRecommendations(age: number): Promise<any[]> {
    try {
      // 获取河洛文化内容
      const culturalContent = await cultureService.getCultureList({
        suitableAgeRange: [age - 1, age + 1],
      });

      // AI生成个性化推荐
      const recommendations = await aiService.generateCulturalRecommendations({
        age,
        interests: await this.getChildInterests(),
        previousActivities: await this.getCulturalActivities(),
        culturalContent,
      });

      return recommendations;
    } catch (error) {
      console.error('获取文化推荐失败:', error);
      return [];
    }
  }

  // 生成里程碑报告
  async generateMilestoneReport(ageRange?: [number, number]): Promise<any> {
    try {
      const nodes = await this.getGrowthTree();
      const filteredNodes = ageRange 
        ? nodes.filter(n => n.age >= ageRange[0] && n.age <= ageRange[1])
        : nodes;

      const milestones = filteredNodes.flatMap(node => 
        node.content.milestones.map(m => ({
          ...m,
          age: node.age,
          phase: node.phase,
          category: node.content.type,
        }))
      );

      // 分类统计
      const categories = {
        first: milestones.filter(m => m.type === 'first'),
        achievement: milestones.filter(m => m.type === 'achievement'),
        cultural: milestones.filter(m => m.type === 'cultural'),
      };

      // AI生成总结
      const aiSummary = await aiService.summarizeMilestones(milestones);

      return {
        total: milestones.length,
        categories,
        aiSummary,
        timeline: this.groupMilestonesByAge(milestones),
        recommendations: await this.generateMilestoneRecommendations(milestones),
      };
    } catch (error) {
      console.error('生成里程碑报告失败:', error);
      return null;
    }
  }

  // 辅助方法
  private async generateTimelineAndStats(nodes: GrowthNode[]): Promise<void> {
    const timeline = this.generateTimeline(nodes);
    const stats = this.calculateStatistics(nodes);
    
    await storageService.set(this.GROWTH_TIMELINE_KEY, timeline);
    await storageService.set(this.GROWTH_STATS_KEY, stats);
  }

  private generateTimeline(nodes: GrowthNode[]): GrowthTimeline {
    const phases = this.getPhasesDefinition();
    
    return {
      nodes,
      phases,
      statistics: this.calculateStatistics(nodes),
    };
  }

  private calculateStatistics(nodes: GrowthNode[]): GrowthStatistics {
    const milestones = nodes.flatMap(n => n.content.milestones).length;
    const culturalActivities = nodes.flatMap(n => 
      n.content.culturalElements
    ).length;

    const attachmentCounts = nodes.reduce((acc, node) => {
      node.content.attachments.forEach(att => {
        if (att.type === 'photo') acc.photos++;
        else if (att.type === 'video') acc.videos++;
        else if (att.type === 'document') acc.documents++;
        else if (att.type === 'certificate') acc.certificates++;
      });
      return acc;
    }, { photos: 0, videos: 0, documents: 0, certificates: 0 });

    // 分析成长领域
    const growthAreas = this.analyzeGrowthAreas(nodes);

    return {
      totalRecords: nodes.length,
      milestones,
      culturalActivities,
      attachmentCounts,
      growthAreas,
    };
  }

  private analyzeGrowthAreas(nodes: GrowthNode[]): any[] {
    const categories = nodes.reduce((acc, node) => {
      const category = node.content.type;
      if (!acc[category]) {
        acc[category] = { count: 0, ages: [] };
      }
      acc[category].count++;
      acc[category].ages.push(node.age);
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(categories).map(([category, data]) => ({
      category,
      count: data.count,
      trend: this.calculateTrend(data.ages),
    }));
  }

  private calculateTrend(ages: number[]): 'up' | 'down' | 'stable' {
    if (ages.length < 2) return 'stable';
    
    const sorted = [...ages].sort((a, b) => a - b);
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    
    const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const diff = ((avg2 - avg1) / avg1) * 100;
    
    if (diff > 10) return 'up';
    if (diff < -10) return 'down';
    return 'stable';
  }

  private getPhasesDefinition() {
    // 基于Python脚本中的年龄阶段定义
    return {
      0: { name: '启元初绽', color: '#ffb6c1', icon: '👶', summary: '新生儿期，生命初绽' },
      1: { name: '萌智初醒', color: '#87cefa', icon: '🌱', summary: '感知觉醒，认知萌芽' },
      2: { name: '学步观春', color: '#98fb98', icon: '🚶', summary: '探索世界，学习成长' },
      3: { name: '探趣洛城', color: '#ffa07a', icon: '🏯', summary: '文化初识，兴趣发现' },
      4: { name: '言启智云', color: '#da70d6', icon: '💬', summary: '语言发展，智能启蒙' },
      5: { name: '语枢萌芽', color: '#9370db', icon: '🌿', summary: '表达清晰，思维发展' },
      6: { name: '入学明礼', color: '#4682b4', icon: '🎒', summary: '学校生活，礼仪养成' },
      7: { name: '学科启途', color: '#5f9ea0', icon: '📚', summary: '学科学习，知识积累' },
      8: { name: '兴趣深耕', color: '#ff6347', icon: '🎨', summary: '特长培养，兴趣深化' },
      9: { name: '河洛少年', color: '#32cd32', icon: '🏮', summary: '文化认同，少年成长' },
      10: { name: '智能同行', color: '#1e90ff', icon: '🤖', summary: '科技应用，智能学习' },
      11: { name: '未来雏型', color: '#ff69b4', icon: '🚀', summary: '目标明确，规划未来' },
      12: { name: '初中文枢', color: '#8a2be2', icon: '🏫', summary: '中学阶段，学习深化' },
      13: { name: '青春履新', color: '#dc143c', icon: '🌺', summary: '青春期，自我探索' },
      14: { name: '牡丹韶华', color: '#ff4500', icon: '🌸', summary: '青春绽放，文化传承' },
      15: { name: '高中进阶', color: '#2e8b57', icon: '🎓', summary: '学业精进，目标冲刺' },
      16: { name: '志向明途', color: '#4169e1', icon: '🎯', summary: '职业探索，志向明确' },
      17: { name: '冲刺征途', color: '#8b0000', icon: '🏃', summary: '高考备战，全力冲刺' },
      18: { name: '成人礼赞', color: '#4b0082', icon: '👑', summary: '成年仪式，责任担当' },
      19: { name: '大学新章', color: '#228b22', icon: '🎓', summary: '大学启航，专业学习' },
      20: { name: '社会洞察', color: '#daa520', icon: '🌍', summary: '社会认知，实践锻炼' },
      21: { name: '毕业启程', color: '#000080', icon: '🎖', summary: '毕业准备，职业启航' },
    };
  }

  private notifyRecordAdded(record: GrowthNode): void {
    const event = new CustomEvent('growth-record-added', {
      detail: { record },
    });
    window.dispatchEvent(event);
  }

  // 模拟数据生成
  private async generateMockGrowthTree(): Promise<GrowthNode[]> {
    const nodes: GrowthNode[] = [];
    
    // 生成0-21岁的成长节点
    for (let age = 0; age <= 21; age++) {
      const phase = this.getPhasesDefinition()[age];
      
      // 每个年龄段生成2-4个成长记录
      const recordCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < recordCount; i++) {
        const types: any[] = ['perception', 'health', 'social', 'academic', 'cultural'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const node: GrowthNode = {
          id: `node_${age}_${i}`,
          age,
          phase: phase.name,
          path: `${phase.name}/${type}`,
          content: {
            title: this.generateRecordTitle(age, type),
            description: this.generateRecordDescription(age, type),
            type,
            category: this.getCategoryByType(type),
            milestones: this.generateMilestones(age, type),
            attachments: this.generateAttachments(),
            culturalElements: this.generateCulturalElements(age),
            smartTags: this.generateSmartTags(type),
          },
          metadata: {
            created: new Date(Date.now() - (age * 365 * 24 * 60 * 60 * 1000)).toISOString(),
            updated: new Date().toISOString(),
            version: '1.0',
            aiGenerated: true,
            importance: Math.floor(Math.random() * 10) + 1,
            emotionTags: ['快乐', '惊喜', '期待'],
            relatedNodes: [],
            culturalDensity: Math.random() * 0.5 + 0.3,
          },
        };
        
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  private generateRecordTitle(age: number, type: string): string {
    const titles: Record<string, string[]> = {
      perception: ['第一次认识颜色', '声音敏感度测试', '触觉探索日记', '视觉追踪练习'],
      health: ['定期体检报告', '疫苗接种记录', '生长发育曲线', '健康生活习惯养成'],
      social: ['与小伙伴的第一次互动', '幼儿园集体生活', '友谊建立记录', '社交技能发展'],
      academic: ['第一个100分', '学习习惯养成', '学科兴趣发现', '自主学习记录'],
      cultural: ['第一次参观龙门石窟', '牡丹文化初体验', '河洛文化学习', '传统节日庆祝'],
    };
    
    const list = titles[type] || ['成长记录'];
    return list[Math.floor(Math.random() * list.length)];
  }

  private generateRecordDescription(age: number, type: string): string {
    return `记录沫语${age}岁在${type}领域的成长经历，包含关键发展里程碑和珍贵瞬间。`;
  }

  private generateMilestones(age: number, type: string): any[] {
    const milestones = [];
    const milestoneCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < milestoneCount; i++) {
      milestones.push({
        id: `milestone_${age}_${i}`,
        date: new Date(Date.now() - (age * 365 * 24 * 60 * 60 * 1000) + i * 86400000).toISOString(),
        title: `第${i + 1}个里程碑`,
        description: `重要的成长瞬间记录`,
        type: i === 0 ? 'first' : 'achievement',
        evidence: [],
      });
    }
    
    return milestones;
  }

  private generateAttachments(): any[] {
    const attachments = [];
    const attachmentCount = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < attachmentCount; i++) {
      attachments.push({
        type: 'photo',
        url: '/growth/attachments/example.jpg',
        thumbnail: '/growth/attachments/thumb.jpg',
        metadata: {
          date: new Date().toISOString(),
          location: '洛阳',
        },
      });
    }
    
    return attachments;
  }

  private generateCulturalElements(age: number): any[] {
    const elements = [];
    
    if (age >= 3) {
      elements.push({
        type: '河洛文化',
        name: '牡丹文化',
        description: '了解洛阳牡丹的历史和象征意义',
        connection: '通过观察和绘画认识家乡文化',
        significance: 4,
      });
    }
    
    if (age >= 6) {
      elements.push({
        type: '传统节日',
        name: '端午节',
        description: '学习包粽子和端午习俗',
        connection: '传统文化体验，增强文化认同',
        significance: 3,
      });
    }
    
    return elements;
  }

  private generateSmartTags(type: string): string[] {
    const tags: Record<string, string[]> = {
      perception: ['感知发展', '早期教育', '认知启蒙'],
      health: ['健康成长', '生理发展', '健康习惯'],
      social: ['社交能力', '情绪发展', '人际交往'],
      academic: ['学业进步', '学习能力', '知识积累'],
      cultural: ['文化传承', '民族认同', '传统美德'],
    };
    
    return tags[type] || ['成长记录'];
  }

  private getCategoryByType(type: string): string {
    const map: Record<string, string> = {
      perception: '感知启蒙',
      health: '健康守护',
      social: '社交发展',
      academic: '学业成长',
      cultural: '文化浸润',
    };
    
    return map[type] || '通用';
  }

  // 默认数据
  private getDefaultGrowthTree(): GrowthNode[] {
    return this.generateMockGrowthTree();
  }

  private getDefaultTimeline(): GrowthTimeline {
    return {
      nodes: [],
      phases: this.getPhasesDefinition(),
      statistics: this.getDefaultStatistics(),
    };
  }

  private getDefaultStatistics(): GrowthStatistics {
    return {
      totalRecords: 0,
      milestones: 0,
      culturalActivities: 0,
      attachmentCounts: {
        photos: 0,
        videos: 0,
        documents: 0,
        certificates: 0,
      },
      growthAreas: [],
    };
  }

  private getDefaultAnalysis(): AIAnalysis {
    return {
      summary: '暂无AI分析',
      insights: [],
      recommendations: [],
      patterns: [],
      predictions: [],
    };
  }

  // 获取孩子兴趣（从记录中分析）
  private async getChildInterests(): Promise<string[]> {
    const nodes = await this.getGrowthTree();
    const interests: string[] = [];
    
    nodes.forEach(node => {
      if (node.content.smartTags) {
        interests.push(...node.content.smartTags);
      }
    });
    
    return [...new Set(interests)];
  }

  // 获取文化活动记录
  private async getCulturalActivities(): Promise<any[]> {
    const nodes = await this.getGrowthTree();
    return nodes.filter(n => n.content.type === 'cultural');
  }

  // 按年龄分组里程碑
  private groupMilestonesByAge(milestones: any[]): Record<number, any[]> {
    return milestones.reduce((acc, milestone) => {
      const age = milestone.age;
      if (!acc[age]) {
        acc[age] = [];
      }
      acc[age].push(milestone);
      return acc;
    }, {} as Record<number, any[]>);
  }

  // 生成里程碑推荐
  private async generateMilestoneRecommendations(milestones: any[]): Promise<any[]> {
    // 分析现有里程碑，找出缺失的重要里程碑
    const ageGroups = this.groupMilestonesByAge(milestones);
    const recommendations = [];
    
    for (let age = 0; age <= 21; age++) {
      const ageMilestones = ageGroups[age] || [];
      const milestoneTypes = ageMilestones.map(m => m.type);
      
      // 检查是否有重要的里程碑类型缺失
      if (age === 1 && !milestoneTypes.includes('first')) {
        recommendations.push({
          age: 1,
          type: 'first',
          suggestion: '记录第一个生日或重要"第一次"经历',
          priority: 'high',
        });
      }
      
      if (age === 3 && milestoneTypes.length < 3) {
        recommendations.push({
          age: 3,
          type: 'cultural',
          suggestion: '建议增加河洛文化初体验记录',
          priority: 'medium',
        });
      }
      
      if (age === 6 && !milestoneTypes.includes('achievement')) {
        recommendations.push({
          age: 6,
          type: 'achievement',
          suggestion: '记录入学后的第一个重要成就',
          priority: 'high',
        });
      }
    }
    
    return recommendations;
  }

  private async updateTimelineAndStats(nodes: GrowthNode[]): Promise<void> {
    await this.generateTimelineAndStats(nodes);
  }
}

export const growthService = new GrowthService();

### 三、AI集成服务

// /src/services/ai/growthAIService.ts - 成长AI分析服务
import { GrowthNode, AIAnalysis } from '../../types/growth';

class GrowthAIService {
  private readonly AI_MODEL = 'gpt-4';
  private readonly CULTURE_CONTEXT = '河洛文化背景，洛阳地区特色';

  // 分析成长记录
  async analyzeGrowth(data: {
    age: number;
    phase: string;
    content: any;
    metadata: any;
  }): Promise<AIAnalysis> {
    try {
      // 构建分析请求
      const prompt = this.buildAnalysisPrompt(data);
      
      // 调用AI服务
      const response = await this.callAIApi(prompt);
      
      // 解析AI响应
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('成长AI分析失败:', error);
      return this.getDefaultAnalysis(data);
    }
  }

  // 生成文化推荐
  async generateCulturalRecommendations(data: {
    age: number;
    interests: string[];
    previousActivities: any[];
    culturalContent: any[];
  }): Promise<any[]> {
    try {
      const prompt = this.buildRecommendationPrompt(data);
      const response = await this.callAIApi(prompt);
      
      return JSON.parse(response);
    } catch (error) {
      console.error('生成文化推荐失败:', error);
      return [];
    }
  }

  // 总结里程碑
  async summarizeMilestones(milestones: any[]): Promise<string> {
    try {
      const prompt = this.buildSummaryPrompt(milestones);
      const response = await this.callAIApi(prompt);
      
      return response;
    } catch (error) {
      console.error('总结里程碑失败:', error);
      return '里程碑总结生成失败';
    }
  }

  // 生成智能标签
  async generateSmartTags(content: string): Promise<string[]> {
    try {
      const prompt = this.buildTaggingPrompt(content);
      const response = await this.callAIApi(prompt);
      
      return JSON.parse(response);
    } catch (error) {
      console.error('生成智能标签失败:', error);
      return [];
    }
  }

  // 构建分析提示词
  private buildAnalysisPrompt(data: any): string {
    return `作为沫语成长守护AI，请分析以下成长记录：
年龄：${data.age}岁
阶段：${data.phase}
内容：${JSON.stringify(data.content, null, 2)}
文化背景：${this.CULTURE_CONTEXT}

请提供：
1. 简要总结（200字以内）
2. 3-5个关键洞察（包含认知、社交、情感、文化等方面）
3. 2-3条成长建议（立即/短期/长期）
4. 发现的有趣模式
5. 基于现状的未来预测

请以JSON格式返回，结构如下：
{
  "summary": "",
  "insights": [
    {"category": "", "description": "", "confidence": 0.9, "evidence": []}
  ],
  "recommendations": [
    {"type": "", "category": "", "action": "", "reason": "", "priority": 1}
  ],
  "patterns": [
    {"type": "", "description": "", "confidence": 0.8, "dataPoints": []}
  ],
  "predictions": [
    {"timeframe": "", "prediction": "", "confidence": 0.7, "assumptions": []}
  ]
}`;
  }

  // 构建推荐提示词
  private buildRecommendationPrompt(data: any): string {
    return `根据以下信息，推荐适合的河洛文化活动：
年龄：${data.age}岁
已知兴趣：${data.interests.join(', ')}
历史活动：${data.previousActivities.length}个
可用文化内容：${data.culturalContent.length}个

请推荐5-8个活动，考虑：
1. 年龄适宜性
2. 兴趣匹配度
3. 文化教育价值
4. 创新性和趣味性

返回JSON数组格式，每个活动包含：
{
  "name": "活动名称",
  "description": "活动描述",
  "culturalValue": 1-5,
  "educationalValue": 1-5,
  "ageSuitability": 1-5,
  "implementationTips": "实施建议",
  "relatedContent": "关联内容ID"
}`;
  }

  // 构建总结提示词
  private buildSummaryPrompt(milestones: any[]): string {
    const milestoneText = milestones
      .map(m => `年龄${m.age}岁：${m.title} - ${m.description}`)
      .join('\n');
    
    return `总结以下成长里程碑，突出成长轨迹和文化特色：
${milestoneText}

请用200-300字总结，包含：
1. 总体成长轨迹
2. 关键发展节点
3. 文化浸润特点
4. 未来展望

语言风格：温暖、鼓励、有文化底蕴`;
  }

  // 构建标签提示词
  private buildTaggingPrompt(content: string): string {
    return `为以下成长内容生成智能标签：
${content}

请生成5-10个标签，包含：
1. 成长领域（认知、社交、情感等）
2. 技能发展
3. 文化元素
4. 情绪标签
5. 特殊里程碑

返回JSON数组格式：["标签1", "标签2", ...]`;
  }

  // 调用AI API
  private async callAIApi(prompt: string): Promise<string> {
    // 这里应该调用实际的AI服务
    // 例如：OpenAI API, Azure OpenAI, 本地模型等
    
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟AI响应
        const response = this.generateMockAIResponse(prompt);
        resolve(response);
      }, 1000);
    });
  }

  // 解析AI响应
  private parseAIResponse(response: string): AIAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('解析AI响应失败:', error);
      return this.getDefaultAnalysis({} as any);
    }
  }

  // 生成模拟AI响应
  private generateMockAIResponse(prompt: string): string {
    // 根据prompt类型返回不同的模拟响应
    if (prompt.includes('分析以下成长记录')) {
      return JSON.stringify({
        summary: '这是一个模拟AI分析结果，展示孩子的良好发展趋势。',
        insights: [
          {
            category: '认知',
            description: '表现出良好的观察能力和记忆力',
            confidence: 0.85,
            evidence: ['细节描述准确', '关联能力强']
          }
        ],
        recommendations: [
          {
            type: 'short-term',
            category: '文化体验',
            action: '参观龙门石窟，结合历史故事讲解',
            reason: '增强文化认同，激发学习兴趣',
            priority: 1
          }
        ],
        patterns: [
          {
            type: 'trend',
            description: '每月记录数量呈上升趋势',
            confidence: 0.9,
            dataPoints: ['记录频率增加', '内容质量提升']
          }
        ],
        predictions: [
          {
            timeframe: '6个月',
            prediction: '在语言表达和文化认知方面会有显著进步',
            confidence: 0.75,
            assumptions: ['继续保持当前记录频率', '参与推荐的文化活动']
          }
        ]
      });
    }
    
    // 默认响应
    return '{"summary": "AI分析完成", "insights": [], "recommendations": []}';
  }

  // 默认分析结果
  private getDefaultAnalysis(data: any): AIAnalysis {
    return {
      summary: `基于${data.age}岁的成长记录，AI分析暂时不可用。`,
      insights: [],
      recommendations: [],
      patterns: [],
      predictions: [],
    };
  }
}

export const growthAIService = new GrowthAIService();

### 四、核心页面组件

// /src/app/components/pages/GrowthTreePage.tsx - 成长树主页面
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row, Col, Card, Tree, Timeline, Progress, Statistic, 
  Button, Input, Select, Tag, Space, Modal, message
} from 'antd';
import {
  HeartOutlined, TrophyOutlined, BookOutlined,
  TeamOutlined, CrownOutlined, SearchOutlined,
  PlusOutlined, FilterOutlined, ShareAltOutlined,
  CalendarOutlined, EnvironmentOutlined, FireOutlined
} from '@ant-design/icons';
import { growthService } from '../../../services/growth/growthService';
import GrowthRecordForm from '../business/GrowthRecordForm';
import AIGrowthInsights from '../business/AIGrowthInsights';
import './GrowthTreePage.less';

const { Search } = Input;
const { Option } = Select;

const GrowthTreePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [growthTree, setGrowthTree] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ageRange: [0, 21] as [number, number],
    category: 'all',
    type: 'all',
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    loadGrowthData();
  }, []);

  const loadGrowthData = async () => {
    setLoading(true);
    try {
      const [tree, timelineData, stats] = await Promise.all([
        growthService.getGrowthTree(),
        growthService.getGrowthTimeline(),
        growthService.getGrowthStatistics(),
      ]);

      setGrowthTree(tree);
      setTimeline(timelineData);
      setStatistics(stats);
      
      // 构建树形数据
      const treeStructure = buildTreeStructure(tree, timelineData.phases);
      setTreeData(treeStructure);
      
      // 获取AI分析
      const insights = await generateAIGrowthInsights(tree, timelineData);
      setAiInsights(insights);
    } catch (error) {
      message.error('加载成长数据失败');
    } finally {
      setLoading(false);
    }
  };

  const buildTreeStructure = (nodes: any[], phases: any) => {
    // 按年龄段分组
    const ageGroups: Record<number, any[]> = {};
    
    nodes.forEach(node => {
      if (!ageGroups[node.age]) {
        ageGroups[node.age] = [];
      }
      ageGroups[node.age].push(node);
    });

    // 构建树节点
    return Object.entries(ageGroups).map(([age, nodes]) => {
      const phase = phases[parseInt(age)];
      return {
        title: (
          <div className="tree-phase-node">
            <span className="phase-icon">{phase?.icon || '👶'}</span>
            <span className="phase-name">{phase?.name || `年龄${age}岁`}</span>
            <Tag color={phase?.color || '#1890ff'}>
              {nodes.length}条记录
            </Tag>
          </div>
        ),
        key: `age-${age}`,
        children: nodes.map(node => ({
          title: (
            <div 
              className="tree-record-node"
              onClick={() => handleNodeClick(node)}
            >
              <div className="record-header">
                <span className="record-title">{node.content.title}</span>
                <Tag 
                  color={
                    node.content.type === 'cultural' ? 'purple' :
                    node.content.type === 'academic' ? 'blue' :
                    node.content.type === 'social' ? 'green' :
                    node.content.type === 'health' ? 'orange' : 'default'
                  }
                >
                  {node.content.type}
                </Tag>
              </div>
              <div className="record-meta">
                <span className="record-date">
                  {new Date(node.metadata.created).toLocaleDateString()}
                </span>
                {node.content.milestones.length > 0 && (
                  <span className="milestone-count">
                    <TrophyOutlined /> {node.content.milestones.length}
                  </span>
                )}
              </div>
            </div>
          ),
          key: node.id,
          isLeaf: true,
        })),
      };
    });
  };

  const generateAIGrowthInsights = async (tree: any[], timeline: any) => {
    // 模拟AI分析结果
    return {
      summary: "基于成长记录分析，孩子在文化浸润和社交发展方面表现突出。",
      trends: [
        { area: '文化认知', trend: '上升', confidence: 0.85 },
        { area: '社交能力', trend: '上升', confidence: 0.78 },
        { area: '学业发展', trend: '稳定', confidence: 0.65 },
      ],
      recommendations: [
        {
          priority: 'high',
          action: '增加户外文化实践活动',
          reason: '将文化学习与实际体验结合',
        },
      ],
    };
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    navigate(`/growth/record/${node.id}`);
  };

  const handleAddRecord = () => {
    setShowRecordForm(true);
  };

  const handleRecordSubmit = async (record: any) => {
    try {
      await growthService.addGrowthRecord(record);
      message.success('成长记录添加成功');
      setShowRecordForm(false);
      loadGrowthData(); // 刷新数据
    } catch (error) {
      message.error('添加记录失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderStatisticsCards = () => {
    if (!statistics) return null;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="stat-card total-card">
            <Statistic
              title="成长记录"
              value={statistics.totalRecords}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card milestone-card">
            <Statistic
              title="里程碑"
              value={statistics.milestones}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card cultural-card">
            <Statistic
              title="文化活动"
              value={statistics.culturalActivities}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card photo-card">
            <Statistic
              title="珍贵照片"
              value={statistics.attachmentCounts?.photos || 0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderGrowthTimeline = () => {
    if (!timeline) return null;

    const recentNodes = growthTree
      .sort((a, b) => new Date(b.metadata.created).getTime() - new Date(a.metadata.created).getTime())
      .slice(0, 5);

    return (
      <Card title="最近成长记录" className="recent-timeline-card">
        <Timeline>
          {recentNodes.map((node, index) => (
            <Timeline.Item
              key={index}
              color={timeline.phases[node.age]?.color || 'blue'}
            >
              <div className="timeline-item">
                <div className="timeline-header">
                  <span className="age-tag">{node.age}岁</span>
                  <span className="record-title">{node.content.title}</span>
                </div>
                <div className="timeline-content">
                  <p className="record-description">
                    {node.content.description.substring(0, 80)}...
                  </p>
                  <div className="record-tags">
                    {node.content.smartTags?.slice(0, 3).map((tag: string, i: number) => (
                      <Tag key={i} color="blue" size="small">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    );
  };

  const renderGrowthAreas = () => {
    if (!statistics?.growthAreas) return null;

    return (
      <Card title="成长领域分布" className="areas-card">
        <div className="areas-list">
          {statistics.growthAreas.map((area: any, index: number) => (
            <div key={index} className="area-item">
              <div className="area-header">
                <span className="area-name">{area.category}</span>
                <span className="area-count">{area.count}条</span>
              </div>
              <Progress
                percent={Math.min((area.count / statistics.totalRecords) * 100, 100)}
                strokeColor={
                  area.trend === 'up' ? '#52c41a' :
                  area.trend === 'down' ? '#ff4d4f' : '#1890ff'
                }
                size="small"
              />
              <div className="area-trend">
                <Tag color={
                  area.trend === 'up' ? 'success' :
                  area.trend === 'down' ? 'error' : 'default'
                }>
                  {area.trend === 'up' ? '上升' : area.trend === 'down' ? '下降' : '稳定'}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div className="loading-container">加载成长数据中...</div>;
  }

  return (
    <div className="growth-tree-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <EnvironmentOutlined /> 沫语成长树
          </h1>
          <p className="header-description">
            记录成长每一刻，传承河洛文化，连接智慧未来
          </p>
        </div>
        <div className="header-actions">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRecord}
            >
              添加记录
            </Button>
            <Button icon={<ShareAltOutlined />}>
              分享成长
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      {renderStatisticsCards()}

      {/* AI洞察 */}
      {aiInsights && <AIGrowthInsights insights={aiInsights} />}

      {/* 搜索和筛选 */}
      <Card className="search-filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="搜索成长记录..."
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="选择年龄段"
              style={{ width: '100%' }}
              value={filters.ageRange}
              onChange={(value) => handleFilterChange('ageRange', value)}
            >
              <Option value={[0, 3]}>0-3岁 感知启蒙期</Option>
              <Option value={[4, 6]}>4-6岁 文化浸润期</Option>
              <Option value={[7, 12]}>7-12岁 学业发展期</Option>
              <Option value={[13, 18]}>13-18岁 青春成长期</Option>
              <Option value={[19, 21]}>19-21岁 成人准备期</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="选择记录类型"
              style={{ width: '100%' }}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="all">全部类型</Option>
              <Option value="cultural">文化体验</Option>
              <Option value="academic">学业成长</Option>
              <Option value="social">社交发展</Option>
              <Option value="health">健康守护</Option>
              <Option value="perception">感知启蒙</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button
              icon={<FilterOutlined />}
              block
              onClick={() => setFilters({ ageRange: [0, 21], category: 'all', type: 'all' })}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区 */}
      <Row gutter={[24, 24]}>
        {/* 成长树 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined />
                成长树视图
                <Tag color="green">
                  {growthTree.length}条记录
                </Tag>
              </Space>
            }
            className="growth-tree-card"
          >
            <div className="tree-container">
              <Tree
                treeData={treeData}
                defaultExpandAll
                showLine
                onSelect={(selectedKeys, info) => {
                  if (info.node.isLeaf) {
                    const nodeId = selectedKeys[0] as string;
                    const node = growthTree.find(n => n.id === nodeId);
                    if (node) handleNodeClick(node);
                  }
                }}
              />
            </div>
          </Card>

          {/* 成长领域分布 */}
          {renderGrowthAreas()}
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 最近记录时间线 */}
          {renderGrowthTimeline()}

          {/* 文化里程碑 */}
          <Card title="河洛文化里程碑" className="cultural-milestones-card">
            <div className="milestones-list">
              {growthTree
                .filter(node => node.content.type === 'cultural')
                .slice(0, 5)
                .map((node, index) => (
                  <div key={index} className="milestone-item">
                    <div className="milestone-icon">
                      <CrownOutlined style={{ color: '#ffd700' }} />
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-title">{node.content.title}</div>
                      <div className="milestone-age">{node.age}岁</div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* 快速添加 */}
          <Card title="快速记录" className="quick-add-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="dashed" 
                block
                icon={<CalendarOutlined />}
                onClick={() => setShowRecordForm(true)}
              >
                今日成长
              </Button>
              <Button 
                type="dashed" 
                block
                icon={<TeamOutlined />}
                onClick={() => navigate('/growth/cultural')}
              >
                文化活动
              </Button>
              <Button 
                type="dashed" 
                block
                icon={<FireOutlined />}
                onClick={() => navigate('/growth/milestones')}
              >
                里程碑
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 添加记录弹窗 */}
      <Modal
        title="添加成长记录"
        visible={showRecordForm}
        onCancel={() => setShowRecordForm(false)}
        footer={null}
        width={800}
      >
        <GrowthRecordForm
          onSubmit={handleRecordSubmit}
          onCancel={() => setShowRecordForm(false)}
        />
      </Modal>
    </div>
  );
};

export default GrowthTreePage;

### 五、AI弹窗系统接口

// /src/services/ai/aiPopupIntegration.ts - AI弹窗系统与成长记录集成
import { growthService } from '../growth/growthService';
import { growthAIService } from '../ai/growthAIService';
import { GrowthNode, AIAnalysis } from '../../types/growth';

/**
 * AI弹窗系统接口定义
 * 允许AI助手在聊天中调用成长记录系统的功能
 */
export class AIPopupIntegration {
  private static instance: AIPopupIntegration;
  
  static getInstance(): AIPopupIntegration {
    if (!AIPopupIntegration.instance) {
      AIPopupIntegration.instance = new AIPopupIntegration();
    }
    return AIPopupIntegration.instance;
  }

  // ===================== 核心接口方法 =====================

  /**
   * 获取成长摘要（供AI弹窗显示）
   */
  async getGrowthSummary(age?: number): Promise<string> {
    try {
      const tree = await growthService.getGrowthTree();
      const stats = await growthService.getGrowthStatistics();
      
      const filteredTree = age 
        ? tree.filter(node => node.age === age)
        : tree;
      
      const summary = await growthAIService.summarizeMilestones(
        filteredTree.flatMap(node => node.content.milestones)
      );
      
      return summary;
    } catch (error) {
      console.error('获取成长摘要失败:', error);
      return '暂时无法获取成长摘要';
    }
  }

  /**
   * 分析最近成长趋势（AI弹窗调用）
   */
  async analyzeRecentTrends(days: number = 30): Promise<any> {
    try {
      const tree = await growthService.getGrowthTree();
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentRecords = tree.filter(node => 
        new Date(node.metadata.created) >= cutoffDate
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

  /**
   * 获取文化推荐（AI弹窗推荐）
   */
  async getCulturalSuggestions(age?: number, interests?: string[]): Promise<any[]> {
    try {
      const currentAge = age || await this.getCurrentAge();
      const childInterests = interests || await this.getChildInterests();
      
      return await growthService.getCulturalRecommendations(currentAge);
    } catch (error) {
      console.error('获取文化推荐失败:', error);
      return [];
    }
  }

  /**
   * 记录AI检测到的成长事件（AI主动触发）
   */
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
          type: this.mapEventType(event.type),
          category: 'AI检测',
          milestones: [{
            id: `ai_milestone_${Date.now()}`,
            date: new Date().toISOString(),
            title: `AI检测到的${event.type}`,
            description: event.description,
            type: 'achievement',
            aiSummary: `AI分析：置信度${event.confidence}`,
          }],
          smartTags: ['AI检测', event.type, '自动化记录'],
        },
        metadata: {
          aiGenerated: true,
          importance: Math.round(event.confidence * 10),
          emotionTags: ['惊喜', '发现'],
          culturalDensity: 0.3,
        },
      };
      
      return await growthService.addGrowthRecord(record);
    } catch (error) {
      console.error('记录AI事件失败:', error);
      throw error;
    }
  }

  /**
   * 生成成长报告（供AI弹窗生成）
   */
  async generateGrowthReport(options: {
    reportType: 'weekly' | 'monthly' | 'annual';
    includeAI: boolean;
    culturalFocus?: boolean;
  }): Promise<any> {
    try {
      const tree = await growthService.getGrowthTree();
      const stats = await growthService.getGrowthStatistics();
      
      let filteredTree = tree;
      if (options.reportType === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredTree = tree.filter(node => 
          new Date(node.metadata.created) >= weekAgo
        );
      } else if (options.reportType === 'monthly') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filteredTree = tree.filter(node => 
          new Date(node.metadata.created) >= monthAgo
        );
      }
      
      const report = {
        period: options.reportType,
        totalRecords: filteredTree.length,
        milestones: filteredTree.flatMap(n => n.content.milestones).length,
        culturalActivities: filteredTree.filter(n => n.content.type === 'cultural').length,
        growthAreas: this.analyzeGrowthAreas(filteredTree),
      };
      
      if (options.includeAI) {
        report['aiAnalysis'] = await this.generateAIReportAnalysis(filteredTree);
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

  /**
   * 回答关于成长的AI问答
   */
  async answerGrowthQuestion(question: string, context?: any): Promise<string> {
    try {
      const tree = await growthService.getGrowthTree();
      const timeline = await growthService.getGrowthTimeline();
      
      const prompt = this.buildQuestionPrompt(question, tree, timeline, context);
      const answer = await this.callAIApi(prompt);
      
      return answer;
    } catch (error) {
      console.error('回答成长问题失败:', error);
      return '暂时无法回答这个问题';
    }
  }

  /**
   * 触发成长提醒（AI弹窗提醒）
   */
  async triggerGrowthReminder(type: 'milestone' | 'cultural' | 'health' | 'academic'): Promise<any> {
    try {
      const age = await this.getCurrentAge();
      const tree = await growthService.getGrowthTree();
      
      const ageRecords = tree.filter(node => node.age === age);
      const typeRecords = ageRecords.filter(node => node.content.type === type);
      
      const expectedMilestones = this.getExpectedMilestones(age, type);
      const achievedMilestones = this.getAchievedMilestones(typeRecords);
      
      const missingMilestones = expectedMilestones.filter(expected =>
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
        suggestions: this.generateReminderSuggestions(missingMilestones, age, type),
      };
    } catch (error) {
      console.error('触发成长提醒失败:', error);
      return null;
    }
  }

  // ===================== 辅助方法 =====================

  private async getCurrentAge(): Promise<number> {
    // 这里应该根据当前日期和孩子生日计算年龄
    // 暂时返回模拟年龄
    return 8; // 示例：8岁
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
      '语言发展': 'academic',
      '社交互动': 'social',
      '文化体验': 'cultural',
      '健康行为': 'health',
      '认知发展': 'perception',
    };
    
    return mapping[eventType] || 'perception';
  }

  private groupByType(records: GrowthNode[]): Record<string, number> {
    return records.reduce((acc, node) => {
      const type = node.content.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateCulturalDensity(records: GrowthNode[]): number {
    const culturalRecords = records.filter(node => 
      node.content.type === 'cultural' || 
      node.content.culturalElements.length > 0
    );
    
    return records.length > 0 
      ? culturalRecords.length / records.length 
      : 0;
  }

  private async generateTrendInsights(records: GrowthNode[]): Promise<any[]> {
    // 生成趋势洞察
    const insights = [];
    
    if (records.length > 0) {
      const typeDistribution = this.groupByType(records);
      const dominantType = Object.entries(typeDistribution)
        .sort(([, a], [, b]) => b - a)[0];
      
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
    const areas = records.reduce((acc, node) => {
      const area = node.content.type;
      if (!acc[area]) {
        acc[area] = { count: 0, records: [] };
      }
      acc[area].count++;
      acc[area].records.push(node.id);
      return acc;
    }, {} as Record<string, any>);
    
    return Object.entries(areas).map(([area, data]) => ({
      area,
      count: data.count,
      percentage: Math.round((data.count / records.length) * 100),
    }));
  }

  private async generateAIReportAnalysis(records: GrowthNode[]): Promise<any> {
    // 调用AI服务生成报告分析
    const analysis = await growthAIService.analyzeGrowth({
      age: await this.getCurrentAge(),
      phase: 'AI报告分析',
      content: {
        title: '成长报告分析',
        description: '基于历史记录的分析',
        type: 'academic',
        category: 'AI分析',
        milestones: records.flatMap(r => r.content.milestones),
      },
      metadata: {
        importance: 8,
        culturalDensity: this.calculateCulturalDensity(records),
      },
    });
    
    return analysis;
  }

  private analyzeCulturalFocus(records: GrowthNode[]): any {
    const culturalRecords = records.filter(node => 
      node.content.type === 'cultural' || 
      node.content.culturalElements.length > 0
    );
    
    const culturalElements = culturalRecords.flatMap(node => 
      node.content.culturalElements
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

  private buildQuestionPrompt(question: string, tree: any[], timeline: any, context?: any): string {
    const relevantRecords = this.findRelevantRecords(question, tree);
    
    return `问题：${question}
    
上下文：
- 成长记录总数：${tree.length}条
- 年龄分布：${Object.keys(timeline.phases).length}个阶段
- 相关记录：${relevantRecords.length}条

请基于以上信息回答这个问题，要求：
1. 结合成长记录的具体内容
2. 考虑河洛文化背景
3. 提供有深度的分析
4. 语言温暖、鼓励

相关记录摘要：
${relevantRecords.slice(0, 5).map(r => 
  `${r.age}岁：${r.content.title} - ${r.content.description.substring(0, 100)}...`
).join('\n')}`;
  }

  private findRelevantRecords(question: string, tree: any[]): any[] {
    const keywords = question.toLowerCase().split(' ');
    
    return tree.filter(node => {
      const contentStr = JSON.stringify(node.content).toLowerCase();
      const metadataStr = JSON.stringify(node.metadata).toLowerCase();
      
      return keywords.some(keyword => 
        contentStr.includes(keyword) || metadataStr.includes(keyword)
      );
    });
  }

  private async callAIApi(prompt: string): Promise<string> {
    // 这里应该调用实际的AI服务
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`这是AI对问题的回答：\n\n基于成长记录分析，...`);
      }, 1000);
    });
  }

  private getExpectedMilestones(age: number, type: string): any[] {
    // 基于年龄和类型的预期里程碑
    const milestones: Record<string, Record<number, any[]>> = {
      cultural: {
        3: [{ title: '第一次参观文化遗址', description: '如龙门石窟、白马寺' }],
        6: [{ title: '了解传统节日习俗', description: '春节、端午节等' }],
        8: [{ title: '学习河洛历史故事', description: '如武则天、白居易的故事' }],
      },
      academic: {
        7: [{ title: '独立完成作业', description: '养成良好的学习习惯' }],
        10: [{ title: '学科竞赛参与', description: '数学、语文等竞赛' }],
      },
      // 其他类型...
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
    // 简单的相似度匹配
    const expectedStr = expected.title.toLowerCase();
    const achievedStr = achieved.title.toLowerCase();
    
    return expectedStr.includes(achievedStr) || achievedStr.includes(expectedStr);
  }

  private generateReminderSuggestions(missingMilestones: any[], age: number, type: string): string[] {
    const suggestions: string[] = [];
    
    missingMilestones.forEach(milestone => {
      suggestions.push(`建议安排：${milestone.title}（${milestone.description}）`);
    });
    
    if (type === 'cultural') {
      suggestions.push(`洛阳有丰富的文化资源，可以考虑参观博物馆或参加文化活动`);
    }
    
    return suggestions;
  }

  // ===================== 事件监听器 =====================

  /**
   * 注册AI弹窗事件监听器
   */
  registerEventListeners(): void {
    // 监听AI弹窗事件
    window.addEventListener('ai-popup-request', this.handleAIPopupRequest.bind(this));
    
    // 监听成长记录事件
    window.addEventListener('growth-record-added', this.handleNewGrowthRecord.bind(this));
    
    // 监听里程碑达成事件
    window.addEventListener('milestone-achieved', this.handleMilestoneAchieved.bind(this));
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
    
    // 发送响应事件
    const responseEvent = new CustomEvent('ai-popup-response', {
      detail: { type, data, response },
    });
    window.dispatchEvent(responseEvent);
  }

  private async handleNewGrowthRecord(event: CustomEvent): Promise<void> {
    const { record } = event.detail;
    
    // 检查是否需要AI分析
    if (record.metadata.importance >= 7) {
      const analysis = await growthAIService.analyzeGrowth({
        age: record.age,
        phase: record.phase,
        content: record.content,
        metadata: record.metadata,
      });
      
      // 触发AI弹窗显示分析结果
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
    
    // 记录AI事件
    await this.recordAIEvent({
      type: '里程碑达成',
      description: `达成了重要里程碑：${milestone.title}`,
      confidence: 0.9,
      evidence: [milestone],
      suggestions: [
        '可以记录更多相关经历',
        '考虑安排庆祝活动',
        '分享给家人和朋友',
      ],
    });
    
    // 触发庆祝弹窗
    const celebrationEvent = new CustomEvent('trigger-celebration-popup', {
      detail: {
        milestone,
        age,
        message: `恭喜达成${milestone.title}里程碑！`,
      },
    });
    window.dispatchEvent(celebrationEvent);
  }

  // ===================== 工具方法 =====================

  /**
   * 导出供AI弹窗系统调用的接口
   */
  getExportMethods() {
    return {
      getGrowthSummary: this.getGrowthSummary.bind(this),
      analyzeRecentTrends: this.analyzeRecentTrends.bind(this),
      getCulturalSuggestions: this.getCulturalSuggestions.bind(this),
      recordAIEvent: this.recordAIEvent.bind(this),
      generateGrowthReport: this.generateGrowthReport.bind(this),
      answerGrowthQuestion: this.answerGrowthQuestion.bind(this),
      triggerGrowthReminder: this.triggerGrowthReminder.bind(this),
      
      // 事件相关
      registerEventListeners: this.registerEventListeners.bind(this),
      
      // 工具方法
      getCurrentAge: this.getCurrentAge.bind(this),
      getChildInterests: this.getChildInterests.bind(this),
    };
  }
}

// 导出单例实例
export const aiPopupIntegration = AIPopupIntegration.getInstance();

// 简化导出，供AI弹窗系统直接调用
export const growthAI = aiPopupIntegration.getExportMethods();

// 在应用启动时自动注册事件监听器
if (typeof window !== 'undefined') {
  aiPopupIntegration.registerEventListeners();
}

### 六、样式文件

// /src/app/components/pages/GrowthTreePage.less
@import '~antd/lib/style/themes/default.less';

.growth-tree-page {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  
  .page-header {
    background: white;
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-content {
      h1 {
        margin: 0 0 12px 0;
        font-size: 36px;
        color: #1890ff;
        display: flex;
        align-items: center;
        gap: 16px;
        
        .anticon {
          font-size: 40px;
          color: #52c41a;
        }
      }
      
      .header-description {
        margin: 0;
        font-size: 16px;
        color: #666;
      }
    }
    
    .header-actions {
      .ant-btn {
        border-radius: 12px;
        height: 48px;
        padding: 0 24px;
        
        &[type="primary"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }
        }
      }
    }
  }
  
  .stat-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .ant-statistic {
      .ant-statistic-title {
        font-size: 14px;
        color: #666;
      }
      
      .ant-statistic-content {
        .ant-statistic-content-value {
          font-size: 28px;
        }
      }
    }
  }
  
  .search-filter-card {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    .ant-card-body {
      padding: 20px;
    }
  }
  
  .growth-tree-card {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    .tree-container {
      max-height: 600px;
      overflow-y: auto;
      padding: 16px;
      
      .tree-phase-node {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        
        .phase-icon {
          font-size: 20px;
        }
        
        .phase-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }
      
      .tree-record-node {
        padding: 12px 16px;
        border-radius: 8px;
        background: #fafafa;
        margin: 4px 0;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #e6f7ff;
          transform: translateX(4px);
        }
        
        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .record-title {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .record-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .recent-timeline-card,
  .cultural-milestones-card,
  .quick-add-card,
  .areas-card {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .timeline-item {
    .timeline-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      .age-tag {
        padding: 2px 8px;
        background: #1890ff;
        color: white;
        border-radius: 12px;
        font-size: 12px;
      }
      
      .record-title {
        font-size: 14px;
        font-weight: 500;
      }
    }
    
    .record-description {
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }
  }
  
  .milestones-list {
    .milestone-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border-radius: 8px;
      background: #fff7e6;
      margin-bottom: 8px;
      
      .milestone-icon {
        .anticon {
          font-size: 20px;
        }
      }
      
      .milestone-content {
        flex: 1;
        
        .milestone-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .milestone-age {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .areas-list {
    .area-item {
      margin-bottom: 16px;
      
      .area-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .area-name {
          font-size: 14px;
          color: #333;
        }
        
        .area-count {
          font-size: 14px;
          font-weight: 500;
          color: #1890ff;
        }
      }
      
      .area-trend {
        margin-top: 4px;
      }
    }
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 18px;
    color: #666;
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .growth-tree-page {
    padding: 12px;
    
    .page-header {
      padding: 20px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      h1 {
        font-size: 24px;
      }
      
      .header-actions {
        align-self: stretch;
        
        .ant-btn {
          width: 100%;
        }
      }
    }
    
    .search-filter-card {
      .ant-row {
        > .ant-col {
          margin-bottom: 12px;
        }
      }
    }
  }
}

### 七、AI弹窗系统集成示例

// /src/app/components/ai/AIGrowthPopup.tsx - AI成长弹窗组件
import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Timeline, Tag, Space, message } from 'antd';
import { 
  RobotOutlined, BulbOutlined, FireOutlined, 
  TrophyOutlined, CalendarOutlined, CloseOutlined 
} from '@ant-design/icons';
import { growthAI } from '../../../services/ai/aiPopupIntegration';
import './AIGrowthPopup.less';

const { TabPane } = Tabs;

interface AIGrowthPopupProps {
  visible: boolean;
  onClose: () => void;
  type?: 'summary' | 'analysis' | 'suggestions' | 'report' | 'question';
  initialData?: any;
}

const AIGrowthPopup: React.FC<AIGrowthPopupProps> = ({
  visible,
  onClose,
  type = 'summary',
  initialData
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [summary, setSummary] = useState('');
  const [trends, setTrends] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      loadAIData();
    }
  }, [visible, type]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      switch (type) {
        case 'summary':
          const summaryData = await growthAI.getGrowthSummary();
          setSummary(summaryData);
          break;
          
        case 'analysis':
          const trendsData = await growthAI.analyzeRecentTrends();
          setTrends(trendsData);
          break;
          
        case 'suggestions':
          const suggestionsData = await growthAI.getCulturalSuggestions();
          setSuggestions(suggestionsData);
          break;
          
        case 'report':
          const reportData = await growthAI.generateGrowthReport({
            reportType: 'monthly',
            includeAI: true,
            culturalFocus: true,
          });
          setAiAnalysis(reportData);
          break;
      }
    } catch (error) {
      message.error('加载AI数据失败');
    } finally {
      setLoading(false);
    }
  };

  const renderSummaryTab = () => (
    <div className="summary-tab">
      <div className="ai-avatar">
        <RobotOutlined style={{ fontSize: 48, color: '#722ed1' }} />
      </div>
      <div className="summary-content">
        <h3>成长摘要</h3>
        <p>{summary || '正在生成成长摘要...'}</p>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="analysis-tab">
      <h3>成长趋势分析</h3>
      {trends ? (
        <div className="trends-content">
          <div className="trends-stats">
            <Space size="large">
              <div className="stat-item">
                <div className="stat-label">近期记录</div>
                <div className="stat-value">{trends.recordCount}条</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">文化密度</div>
                <div className="stat-value">
                  {(trends.culturalDensity * 100).toFixed(1)}%
                </div>
              </div>
            </Space>
          </div>
          
          <div className="type-distribution">
            <h4>记录类型分布</h4>
            {Object.entries(trends.byType || {}).map(([type, count]) => (
              <div key={type} className="type-item">
                <span className="type-name">{type}</span>
                <span className="type-count">{count}条</span>
              </div>
            ))}
          </div>
          
          {trends.aiInsights && trends.aiInsights.length > 0 && (
            <div className="ai-insights">
              <h4>
                <BulbOutlined /> AI洞察
              </h4>
              {trends.aiInsights.map((insight: any, index: number) => (
                <div key={index} className="insight-item">
                  <div className="insight-header">
                    <Tag color="blue">{insight.type}</Tag>
                    <span className="confidence">
                      置信度: {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="insight-description">{insight.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>正在分析成长趋势...</p>
      )}
    </div>
  );

  const renderSuggestionsTab = () => (
    <div className="suggestions-tab">
      <h3>
        <FireOutlined /> 文化推荐
      </h3>
      {suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <div className="suggestion-header">
                <h4>{suggestion.name}</h4>
                <Space>
                  <Tag color="purple">文化价值: {suggestion.culturalValue}/5</Tag>
                  <Tag color="green">教育价值: {suggestion.educationalValue}/5</Tag>
                </Space>
              </div>
              <p className="suggestion-description">{suggestion.description}</p>
              <p className="suggestion-tips">
                <strong>实施建议:</strong> {suggestion.implementationTips}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>正在生成文化推荐...</p>
      )}
    </div>
  );

  const renderReportTab = () => (
    <div className="report-tab">
      <h3>
        <CalendarOutlined /> 成长报告
      </h3>
      {aiAnalysis ? (
        <div className="report-content">
          <div className="report-summary">
            <Space size="large">
              <div className="summary-item">
                <div className="summary-label">报告周期</div>
                <div className="summary-value">{aiAnalysis.period}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">总记录数</div>
                <div className="summary-value">{aiAnalysis.totalRecords}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">里程碑</div>
                <div className="summary-value">{aiAnalysis.milestones}</div>
              </div>
            </Space>
          </div>
          
          <div className="growth-areas">
            <h4>成长领域分布</h4>
            {aiAnalysis.growthAreas?.map((area: any, index: number) => (
              <div key={index} className="area-item">
                <span className="area-name">{area.area}</span>
                <div className="area-progress">
                  <div 
                    className="area-bar" 
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
                <span className="area-percentage">{area.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>正在生成成长报告...</p>
      )}
    </div>
  );

  const handleRecordEvent = async () => {
    try {
      await growthAI.recordAIEvent({
        type: '主动记录',
        description: '通过AI弹窗主动记录了成长事件',
        confidence: 0.8,
        suggestions: ['继续保持记录习惯', '分享给家人'],
      });
      message.success('已记录成长事件');
    } catch (error) {
      message.error('记录失败');
    }
  };

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined style={{ color: '#722ed1' }} />
          <span>沫语成长AI助手</span>
        </Space>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="ai-growth-popup"
      closeIcon={<CloseOutlined />}
    >
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        className="ai-tabs"
      >
        <TabPane 
          tab={
            <span>
              <RobotOutlined />
              成长摘要
            </span>
          } 
          key="summary"
        >
          {renderSummaryTab()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BulbOutlined />
              趋势分析
            </span>
          } 
          key="analysis"
        >
          {renderAnalysisTab()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <FireOutlined />
              文化推荐
            </span>
          } 
          key="suggestions"
        >
          {renderSuggestionsTab()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              成长报告
            </span>
          } 
          key="report"
        >
          {renderReportTab()}
        </TabPane>
      </Tabs>
      
      <div className="popup-actions">
        <Space>
          <Button 
            type="primary" 
            onClick={handleRecordEvent}
            icon={<TrophyOutlined />}
          >
            记录成长事件
          </Button>
          <Button onClick={onClose}>
            关闭
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default AIGrowthPopup;

### 八、Python脚本集成接口

// /src/services/integration/pythonIntegration.ts - Python脚本集成
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class PythonIntegration {
  private readonly PYTHON_SCRIPT_PATH = '/path/to/沫语成长树创建.py';
  private readonly GROWTH_TREE_OUTPUT = '沫语成长守护体系';
  
  /**
   * 执行Python脚本生成成长树
   */
  async executeGrowthTreeScript(): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(`python3 ${this.PYTHON_SCRIPT_PATH}`);
      
      if (stderr) {
        console.warn('Python脚本警告:', stderr);
      }
      
      console.log('Python脚本输出:', stdout);
      
      // 读取生成的文件夹结构
      const treeStructure = await this.parseGeneratedTree();
      
      return treeStructure;
    } catch (error) {
      console.error('执行Python脚本失败:', error);
      throw new Error('无法生成成长树结构');
    }
  }
  
  /**
   * 解析Python脚本生成的文件夹结构
   */
  async parseGeneratedTree(): Promise<string> {
    const treePath = path.join(process.cwd(), this.GROWTH_TREE_OUTPUT);
    
    if (!fs.existsSync(treePath)) {
      throw new Error('成长树文件夹未找到');
    }
    
    // 读取文件夹结构
    const structure = await this.readDirectoryRecursive(treePath);
    
    // 转换为JSON格式
    return JSON.stringify(structure, null, 2);
  }
  
  /**
   * 递归读取目录结构
   */
  private async readDirectoryRecursive(dirPath: string, depth = 0): Promise<any> {
    const items = fs.readdirSync(dirPath);
    const structure: any = {};
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        structure[item] = await this.readDirectoryRecursive(itemPath, depth + 1);
      } else {
        // 读取文件内容的前几行作为预览
        const content = await this.readFilePreview(itemPath);
        structure[item] = {
          type: 'file',
          size: stats.size,
          preview: content,
        };
      }
    }
    
    return structure;
  }
  
  /**
   * 读取文件预览
   */
  private async readFilePreview(filePath: string): Promise<string> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.split('\n').slice(0, 10).join('\n');
    } catch (error) {
      return '无法读取文件内容';
    }
  }
  
  /**
   * 同步Python脚本配置到前端
   */
  async syncPythonConfig(): Promise<any> {
    try {
      // 读取Python脚本中的配置
      const scriptContent = fs.readFileSync(this.PYTHON_SCRIPT_PATH, 'utf-8');
      
      // 解析配置（这里需要根据实际Python脚本格式调整）
      const config = this.parsePythonConfig(scriptContent);
      
      return config;
    } catch (error) {
      console.error('同步Python配置失败:', error);
      return {};
    }
  }
  
  /**
   * 解析Python脚本中的配置
   */
  private parsePythonConfig(scriptContent: string): any {
    const config: any = {};
    
    // 提取年龄阶段定义
    const ageStageMatch = scriptContent.match(/age_stages\s*=\s*{([^}]+)}/);
    if (ageStageMatch) {
      config.ageStages = this.parsePythonDict(ageStageMatch[1]);
    }
    
    // 提取发展维度
    const dimensionsMatch = scriptContent.match(/development_dimensions\s*=\s*{([^}]+)}/);
    if (dimensionsMatch) {
      config.developmentDimensions = this.parsePythonDict(dimensionsMatch[1]);
    }
    
    // 提取文件夹命名库
    const namingMatch = scriptContent.match(/folder_naming\s*=\s*{([^}]+)}/);
    if (namingMatch) {
      config.folderNaming = this.parsePythonDict(namingMatch[1]);
    }
    
    return config;
  }
  
  /**
   * 解析Python字典字符串
   */
  private parsePythonDict(dictStr: string): Record<string, any> {
    const result: Record<string, any> = {};
    
    // 简单的Python字典解析（可以根据需要增强）
    const lines = dictStr.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const match = line.match(/"([^"]+)"\s*:\s*\[([^\]]+)\]|"([^"]+)"\s*:\s*"([^"]+)"/);
      if (match) {
        if (match[1]) {
          // 数组类型
          result[match[1]] = match[2].split(',').map(item => item.trim().replace(/["']/g, ''));
        } else if (match[3]) {
          // 字符串类型
          result[match[3]] = match[4];
        }
      }
    }
    
    return result;
  }
  
  /**
   * 导出Python脚本生成的成长数据
   */
  async exportGrowthData(format: 'json' | 'csv' | 'markdown' = 'json'): Promise<string> {
    try {
      const treePath = path.join(process.cwd(), this.GROWTH_TREE_OUTPUT);
      const data = await this.collectGrowthData(treePath);
      
      switch (format) {
        case 'json':
          return JSON.stringify(data, null, 2);
        case 'csv':
          return this.convertToCSV(data);
        case 'markdown':
          return this.convertToMarkdown(data);
        default:
          return JSON.stringify(data);
      }
    } catch (error) {
      console.error('导出成长数据失败:', error);
      throw error;
    }
  }
  
  /**
   * 收集成长数据
   */
  private async collectGrowthData(dirPath: string): Promise<any> {
    const data: any = {
      timestamp: new Date().toISOString(),
      structure: {},
      content: [],
    };
    
    await this.walkDirectory(dirPath, (filePath, relativePath) => {
      if (filePath.endsWith('.md') || filePath.endsWith('.txt')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        data.content.push({
          path: relativePath,
          content: content.substring(0, 500), // 限制内容长度
        });
      }
    });
    
    data.structure = await this.readDirectoryRecursive(dirPath);
    
    return data;
  }
  
  /**
   * 遍历目录
   */
  private async walkDirectory(dirPath: string, callback: (filePath: string, relativePath: string) => void): Promise<void> {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const relativePath = path.relative(process.cwd(), itemPath);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        await this.walkDirectory(itemPath, callback);
      } else {
        callback(itemPath, relativePath);
      }
    }
  }
  
  /**
   * 转换为CSV格式
   */
  private convertToCSV(data: any): string {
    // 简化实现
    const csvLines = ['path,type,size,preview'];
    
    const addToCSV = (structure: any, prefix = '') => {
      for (const [key, value] of Object.entries(structure)) {
        const fullPath = prefix ? `${prefix}/${key}` : key;
        
        if (typeof value === 'object' && value.type === 'file') {
          csvLines.push(`"${fullPath}",file,${value.size},"${value.preview.replace(/"/g, '""')}"`);
        } else if (typeof value === 'object') {
          addToCSV(value, fullPath);
        }
      }
    };
    
    addToCSV(data.structure);
    
    return csvLines.join('\n');
  }
  
  /**
   * 转换为Markdown格式
   */
  private convertToMarkdown(data: any): string {
    let markdown = `# 沫语成长树导出\n\n`;
    markdown += `生成时间：${new Date().toLocaleString()}\n\n`;
    
    markdown += `## 文件夹结构\n\n\`\`\`\n`;
    markdown += this.formatTreeStructure(data.structure);
    markdown += `\n\`\`\`\n\n`;
    
    markdown += `## 文件内容预览\n\n`;
    data.content.forEach((item: any) => {
      markdown += `### ${item.path}\n\n\`\`\`\n`;
      markdown += item.content;
      markdown += `\n\`\`\`\n\n`;
    });
    
    return markdown;
  }
  
  /**
   * 格式化树状结构
   */
  private formatTreeStructure(structure: any, prefix = ''): string {
    let output = '';
    const keys = Object.keys(structure).sort();
    
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const value = structure[key];
      
      output += `${prefix}${isLast ? '└──' : '├──'} ${key}\n`;
      
      if (typeof value === 'object' && value.type !== 'file') {
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        output += this.formatTreeStructure(value, childPrefix);
      }
    });
    
    return output;
  }
}

export const pythonIntegration = new PythonIntegration();

// 导出供AI弹窗系统调用的接口
export const pythonAI = {
  generateGrowthTree: pythonIntegration.executeGrowthTreeScript.bind(pythonIntegration),
  syncConfig: pythonIntegration.syncPythonConfig.bind(pythonIntegration),
  exportData: pythonIntegration.exportGrowthData.bind(pythonIntegration),
};

### 九、集成使用示例

// /src/app/components/integration/GrowthSystemIntegration.tsx
import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { pythonAI } from '../../../services/integration/pythonIntegration';
import { growthAI } from '../../../services/ai/aiPopupIntegration';
import AIGrowthPopup from '../ai/AIGrowthPopup';

const GrowthSystemIntegration: React.FC = () => {
  const [showAIPopup, setShowAIPopup] = React.useState(false);
  const [popupType, setPopupType] = React.useState<'summary' | 'analysis'>('summary');

  // 初始化时自动同步Python配置
  useEffect(() => {
    initializeGrowthSystem();
  }, []);

  const initializeGrowthSystem = async () => {
    try {
      // 同步Python配置
      const config = await pythonAI.syncConfig();
      
      // 注册AI事件监听器（已在aiPopupIntegration中自动注册）
      
      console.log('成长系统初始化完成', config);
    } catch (error) {
      console.error('成长系统初始化失败:', error);
    }
  };

  const handleGenerateTree = async () => {
    try {
      message.loading('正在生成成长树...', 0);
      await pythonAI.generateGrowthTree();
      message.destroy();
      message.success('成长树生成成功！');
    } catch (error) {
      message.destroy();
      message.error('生成成长树失败');
    }
  };

  const handleExportData = async () => {
    try {
      const data = await pythonAI.exportData('json');
      
      // 下载JSON文件
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `沫语成长数据_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      message.success('数据导出成功');
    } catch (error) {
      message.error('数据导出失败');
    }
  };

  const handleAIPopupRequest = (type: 'summary' | 'analysis' | 'suggestions' | 'report') => {
    setPopupType(type as any);
    setShowAIPopup(true);
  };

  const handleAIAction = async (action: string) => {
    switch (action) {
      case 'record-event':
        try {
          await growthAI.recordAIEvent({
            type: '用户主动记录',
            description: '用户通过界面主动触发记录',
            confidence: 0.9,
            suggestions: ['继续记录成长瞬间'],
          });
          message.success('AI记录已保存');
        } catch (error) {
          message.error('记录失败');
        }
        break;
        
      case 'generate-report':
        try {
          const report = await growthAI.generateGrowthReport({
            reportType: 'monthly',
            includeAI: true,
          });
          
          // 可以在界面上显示报告
          console.log('成长报告:', report);
          message.success('成长报告生成成功');
        } catch (error) {
          message.error('报告生成失败');
        }
        break;
    }
  };

  return (
    <div className="integration-page">
      <div className="integration-actions">
        <h2>成长系统集成</h2>
        
        <div className="action-buttons">
          <Button 
            type="primary" 
            onClick={handleGenerateTree}
            style={{ marginRight: 16 }}
          >
            生成成长树
          </Button>
          
          <Button 
            onClick={handleExportData}
            style={{ marginRight: 16 }}
          >
            导出数据
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('summary')}
            style={{ marginRight: 16 }}
          >
            AI成长摘要
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('analysis')}
            style={{ marginRight: 16 }}
          >
            AI趋势分析
          </Button>
          
          <Button 
            onClick={() => handleAIPopupRequest('suggestions')}
            style={{ marginRight: 16 }}
          >
            AI文化推荐
          </Button>
        </div>
        
        <div className="ai-actions" style={{ marginTop: 24 }}>
          <h3>AI快速操作</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button onClick={() => handleAIAction('record-event')}>
              记录AI事件
            </Button>
            <Button onClick={() => handleAIAction('generate-report')}>
              生成月报
            </Button>
            <Button onClick={() => {
              growthAI.triggerGrowthReminder('cultural')
                .then(result => {
                  if (result?.missing?.length > 0) {
                    message.info(`发现${result.missing.length}个未完成的文化里程碑`);
                  }
                });
            }}>
              文化里程碑检查
            </Button>
          </div>
        </div>
      </div>
      
      {/* AI弹窗 */}
      <AIGrowthPopup
        visible={showAIPopup}
        onClose={() => setShowAIPopup(false)}
        type={popupType}
      />
    </div>
  );
};

export default GrowthSystemIntegration;

### 十、项目路由集成

// /src/routes/GrowthRoutes.tsx - 成长系统路由
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../app/components/layout/Layout';
import GrowthTreePage from '../app/components/pages/GrowthTreePage';
import GrowthRecordPage from '../app/components/pages/GrowthRecordPage';
import GrowthTimelinePage from '../app/components/pages/GrowthTimelinePage';
import CulturalGrowthPage from '../app/components/pages/CulturalGrowthPage';
import GrowthAnalyticsPage from '../app/components/pages/GrowthAnalyticsPage';
import GrowthSystemIntegration from '../app/components/integration/GrowthSystemIntegration';
import GrowthRecordDetail from '../app/components/business/GrowthRecordDetail';

const GrowthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="growth">
          <Route index element={<GrowthTreePage />} />
          <Route path="tree" element={<GrowthTreePage />} />
          <Route path="record/:id" element={<GrowthRecordDetail />} />
          <Route path="record/add" element={<GrowthRecordPage />} />
          <Route path="timeline" element={<GrowthTimelinePage />} />
          <Route path="cultural" element={<CulturalGrowthPage />} />
          <Route path="analytics" element={<GrowthAnalyticsPage />} />
          <Route path="integration" element={<GrowthSystemIntegration />} />
          <Route path="*" element={<div>成长页面未找到</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default GrowthRoutes;

### AI弹窗系统引用接口为AI弹窗系统提供了完整的接口

1. 核心调用接口

// 在AI弹窗系统中可以这样调用：
import { growthAI } from '../../services/ai/aiPopupIntegration';

// 获取成长摘要
const summary = await growthAI.getGrowthSummary();

// 分析趋势
const trends = await growthAI.analyzeRecentTrends(30);

// 获取文化推荐
const suggestions = await growthAI.getCulturalSuggestions();

// 记录AI检测到的事件
await growthAI.recordAIEvent({
  type: '语言发展',
  description: '检测到新的词汇表达能力',
  confidence: 0.85,
});

// 生成报告
const report = await growthAI.generateGrowthReport({
  reportType: 'weekly',
  includeAI: true,
});

// 回答成长问题
const answer = await growthAI.answerGrowthQuestion('孩子最近的语言发展如何？');

1. 事件驱动接口

// AI弹窗监听成长事件
window.addEventListener('growth-record-added', (event) => {
  const { record } = event.detail;
  // 显示AI分析弹窗
  showAIPopup({
    type: 'analysis',
    data: { record },
  });
});

// 触发AI弹窗
window.dispatchEvent(new CustomEvent('trigger-ai-popup', {
  detail: {
    type: 'growth-insight',
    title: 'AI成长洞察',
    content: '发现新的成长趋势...',
  },
}));

1. Python脚本集成接口

import { pythonAI } from '../../services/integration/pythonIntegration';

// 调用Python脚本生成成长树
await pythonAI.generateGrowthTree();

// 同步Python配置
const config = await pythonAI.syncConfig();

// 导出数据
const jsonData = await pythonAI.exportData('json');

1. 在React组件中使用

// 在React组件中调用AI弹窗
const MyComponent: React.FC = () => {
  const showAIGrowthPopup = () => {
    // 触发全局事件
    window.dispatchEvent(new CustomEvent('ai-popup-request', {
      detail: {
        type: 'get-growth-summary',
        data: { age: 8 },
      },
    }));
  };

  return (
    <Button onClick={showAIGrowthPopup}>
      显示AI成长分析
    </Button>
  );
};

1. 自动触发机制

系统会自动在以下情况下触发AI弹窗：
• 添加重要的成长记录时（importance ≥ 7）
• 达成里程碑时
• 检测到成长趋势变化时
• 定期生成报告时
• 用户主动请求时

这样，AI弹窗系统可以无缝集成到智能成长记录页面系统中，为用户提供实时、智能的成长洞察和建议。
