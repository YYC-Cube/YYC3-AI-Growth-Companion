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
      21: { name: '毕业启程', color: '#000080', icon: '🎖️', summary: '毕业准备，职业启航' },
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
      const phase = this.getPhasesDefinition()[age as keyof ReturnType<typeof this.getPhasesDefinition>];
      
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
    return []; // Should call generateMockGrowthTree in real scenario if empty
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
