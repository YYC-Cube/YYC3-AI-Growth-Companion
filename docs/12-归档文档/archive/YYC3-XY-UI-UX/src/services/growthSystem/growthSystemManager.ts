/**
 * Growth System Manager
 * 沫语成长守护体系 - 系统管理器
 * 前端版本的成长记录系统管理
 */

import {
  GrowthRecord,
  MilestoneRecord,
  AgeStageConfig,
  DimensionProgress,
  AIAnalysisResult,
  GrowthTrendPrediction,
  CulturalSuggestion,
  AnnualSummary,
  DevelopmentDimension
} from '../../types/growth-system';

import {
  SYSTEM_CONFIG,
  CULTURAL_MESSAGES,
  DEVELOPMENT_DIMENSIONS,
  MILESTONES_BY_AGE,
  generateAgeStageConfig
} from './growthSystemConfig';

/**
 * 成长系统管理器类
 */
class GrowthSystemManager {
  private static instance: GrowthSystemManager;
  private records: Map<string, GrowthRecord>;
  private milestones: Map<string, MilestoneRecord>;
  private cache: Map<string, any>;

  private constructor() {
    this.records = new Map();
    this.milestones = new Map();
    this.cache = new Map();
    this.initialize();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): GrowthSystemManager {
    if (!GrowthSystemManager.instance) {
      GrowthSystemManager.instance = new GrowthSystemManager();
    }
    return GrowthSystemManager.instance;
  }

  /**
   * 初始化系统
   */
  private initialize(): void {
    console.log('🚀 沫语成长守护体系初始化...');
    console.log(`📚 系统名称: ${SYSTEM_CONFIG.systemName}`);
    console.log(`🎯 系统版本: ${SYSTEM_CONFIG.systemVersion}`);
    console.log(`👤 核心人物: ${SYSTEM_CONFIG.coreElements.character}`);
    console.log(`🏛️ 文化基底: ${SYSTEM_CONFIG.coreElements.culturalBase}`);
  }

  /**
   * 获取系统信息
   */
  public getSystemInfo() {
    return {
      ...SYSTEM_CONFIG,
      totalAgeStages: 22,
      developmentDimensions: Object.keys(DEVELOPMENT_DIMENSIONS).length,
      culturalSymbols: SYSTEM_CONFIG.coreElements.culturalSymbols.length
    };
  }

  /**
   * 获取年龄阶段配置
   */
  public getAgeStageConfig(age: number): AgeStageConfig | null {
    if (age < 0 || age > 21) {
      return null;
    }

    const cacheKey = `age_config_${age}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const config = generateAgeStageConfig(age);
    this.cache.set(cacheKey, config);
    return config;
  }

  /**
   * 获取所有年龄阶段配置
   */
  public getAllAgeStageConfigs(): AgeStageConfig[] {
    const configs: AgeStageConfig[] = [];
    for (let age = 0; age <= 21; age++) {
      const config = this.getAgeStageConfig(age);
      if (config) {
        configs.push(config);
      }
    }
    return configs;
  }

  /**
   * 获取文化寄语
   */
  public getCulturalMessage(age: number): string {
    return CULTURAL_MESSAGES[age] || '记录成长的每一个精彩瞬间';
  }

  /**
   * 获取里程碑列表
   */
  public getMilestones(age: number): string[] {
    return MILESTONES_BY_AGE[age] || [];
  }

  /**
   * 添加成长记录
   */
  public addGrowthRecord(record: Omit<GrowthRecord, 'id'>): GrowthRecord {
    const id = `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRecord: GrowthRecord = {
      id,
      ...record
    };
    this.records.set(id, fullRecord);
    return fullRecord;
  }

  /**
   * 获取成长记录
   */
  public getGrowthRecords(filters?: {
    age?: number;
    type?: DevelopmentDimension;
    startDate?: string;
    endDate?: string;
  }): GrowthRecord[] {
    let records = Array.from(this.records.values());

    if (filters) {
      if (filters.age !== undefined) {
        records = records.filter(r => r.age === filters.age);
      }
      if (filters.type) {
        records = records.filter(r => r.type === filters.type);
      }
      if (filters.startDate) {
        records = records.filter(r => r.date >= filters.startDate!);
      }
      if (filters.endDate) {
        records = records.filter(r => r.date <= filters.endDate!);
      }
    }

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * 添加里程碑记录
   */
  public addMilestone(milestone: Omit<MilestoneRecord, 'id'>): MilestoneRecord {
    const id = `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullMilestone: MilestoneRecord = {
      id,
      ...milestone
    };
    this.milestones.set(id, fullMilestone);
    return fullMilestone;
  }

  /**
   * 获取里程碑记录
   */
  public getMilestoneRecords(age?: number): MilestoneRecord[] {
    let milestones = Array.from(this.milestones.values());

    if (age !== undefined) {
      milestones = milestones.filter(m => m.age === age);
    }

    return milestones.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * 获取维度进度
   */
  public getDimensionProgress(age: number): DimensionProgress[] {
    const records = this.getGrowthRecords({ age });
    const dimensions: DevelopmentDimension[] = ['生活', '学习', '社交', '情感', '文化'];

    return dimensions.map(dimension => {
      const dimensionRecords = records.filter(r => r.type === dimension);
      const completedCount = dimensionRecords.filter(r => r.progress === 100).length;
      const totalCount = dimensionRecords.length || 10; // 默认10个项目
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        dimension,
        progress,
        level: Math.floor(progress / 10),
        maxLevel: 10,
        items: dimensionRecords.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          completed: r.progress === 100,
          date: r.date,
          icon: DEVELOPMENT_DIMENSIONS[dimension].icon
        }))
      };
    });
  }

  /**
   * AI分析成长数据
   */
  public analyzeGrowthData(age: number): AIAnalysisResult {
    const cacheKey = `ai_analysis_${age}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const records = this.getGrowthRecords({ age });
    const milestones = this.getMilestoneRecords(age);
    const dimensionProgress = this.getDimensionProgress(age);

    // 计算综合评分
    const overallScore = this.calculateOverallScore(records, milestones);

    // 计算发展平衡性
    const developmentBalance: Record<DevelopmentDimension, number> = {
      '生活': 0,
      '学习': 0,
      '社交': 0,
      '情感': 0,
      '文化': 0
    };

    dimensionProgress.forEach(dp => {
      developmentBalance[dp.dimension] = dp.progress;
    });

    // 里程碑进度
    const totalMilestones = this.getMilestones(age).length;
    const completedMilestones = milestones.filter(m => m.completed).length;
    const milestoneProgress = {
      total: totalMilestones,
      completed: completedMilestones,
      progressPercent: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
      recentMilestones: milestones.slice(0, 5)
    };

    // 生成建议
    const recommendations = this.generateRecommendations(age, dimensionProgress);

    // 识别风险因素
    const riskFactors = this.identifyRiskFactors(dimensionProgress, milestoneProgress);

    const analysis: AIAnalysisResult = {
      age,
      timestamp: new Date().toISOString(),
      overallScore,
      developmentBalance,
      milestoneProgress,
      recommendations,
      riskFactors
    };

    this.cache.set(cacheKey, analysis);
    return analysis;
  }

  /**
   * 计算综合评分
   */
  private calculateOverallScore(records: GrowthRecord[], milestones: MilestoneRecord[]): number {
    let score = 75; // 基础分

    if (records.length > 0) score += 5;
    if (records.length > 5) score += 5;
    if (milestones.length > 0) score += 5;
    if (milestones.filter(m => m.completed).length > 3) score += 10;

    return Math.min(score, 100);
  }

  /**
   * 生成推荐建议
   */
  private generateRecommendations(age: number, dimensionProgress: DimensionProgress[]): string[] {
    const recommendations: string[] = [];

    // 基于年龄的建议
    if (age < 3) {
      recommendations.push('加强感官刺激训练，促进大脑发育');
      recommendations.push('多进行亲子互动，培养安全感');
      recommendations.push('注意营养均衡，支持身体发育');
    } else if (age < 6) {
      recommendations.push('培养独立生活能力');
      recommendations.push('鼓励探索和好奇心');
      recommendations.push('建立良好的作息习惯');
    } else if (age < 12) {
      recommendations.push('培养学习兴趣和方法');
      recommendations.push('发展社交技能');
      recommendations.push('建立自信心和责任感');
    } else {
      recommendations.push('培养批判性思维');
      recommendations.push('发展特长和兴趣');
      recommendations.push('建立人生目标和规划');
    }

    // 基于维度进度的建议
    dimensionProgress.forEach(dp => {
      if (dp.progress < 50) {
        recommendations.push(`建议加强${dp.dimension}维度的发展`);
      }
    });

    return recommendations.slice(0, 5); // 最多返回5条
  }

  /**
   * 识别风险因素
   */
  private identifyRiskFactors(
    dimensionProgress: DimensionProgress[],
    milestoneProgress: { total: number; completed: number; progressPercent: number }
  ): string[] {
    const riskFactors: string[] = [];

    // 检查维度发展不平衡
    const lowProgress = dimensionProgress.filter(dp => dp.progress < 30);
    if (lowProgress.length > 0) {
      riskFactors.push(`${lowProgress.map(dp => dp.dimension).join('、')}维度发展较慢`);
    }

    // 检查里程碑延迟
    if (milestoneProgress.progressPercent < 50) {
      riskFactors.push('多项里程碑完成度较低');
    }

    return riskFactors;
  }

  /**
   * 预测成长趋势
   */
  public predictGrowthTrend(age: number): GrowthTrendPrediction {
    const currentAnalysis = this.analyzeGrowthData(age);

    return {
      currentAge: age,
      predictedAge: age + 1,
      trendDirection: currentAnalysis.overallScore >= 80 ? 'positive' : currentAnalysis.overallScore >= 60 ? 'neutral' : 'negative',
      confidence: 0.75,
      keyAreas: Object.entries(currentAnalysis.developmentBalance)
        .filter(([_, score]) => score >= 70)
        .map(([dim]) => dim),
      focusAreas: Object.entries(currentAnalysis.developmentBalance)
        .filter(([_, score]) => score < 50)
        .map(([dim]) => dim)
    };
  }

  /**
   * 获取文化建议
   */
  public getCulturalSuggestions(age: number): CulturalSuggestion[] {
    return [
      {
        type: '河洛文化',
        content: '了解河洛文化的历史渊源，培养文化认同感',
        activity: '参观洛阳博物馆，了解河洛文明'
      },
      {
        type: '传统文化',
        content: '学习传统节日和习俗，传承中华文化',
        activity: '参与传统节日庆祝活动'
      },
      {
        type: '现代文化',
        content: '结合现代科技，创新文化表达方式',
        activity: '使用AI工具创作文化作品'
      }
    ];
  }

  /**
   * 生成年度总结
   */
  public generateAnnualSummary(age: number, year: number): AnnualSummary {
    const config = this.getAgeStageConfig(age);
    const records = this.getGrowthRecords({ age });
    const milestones = this.getMilestoneRecords(age);

    return {
      age,
      year,
      stageName: config?.stageName || '',
      culturalMessage: this.getCulturalMessage(age),
      milestones,
      achievements: records.filter(r => r.progress === 100).map(r => r.title),
      improvements: [],
      nextYearGoals: [],
      healthRecords: [],
      culturalExperiences: []
    };
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * 导出系统报告
   */
  public exportSystemReport() {
    return {
      systemInfo: this.getSystemInfo(),
      totalRecords: this.records.size,
      totalMilestones: this.milestones.size,
      exportTimestamp: new Date().toISOString()
    };
  }
}

// 导出单例实例
export const growthSystemManager = GrowthSystemManager.getInstance();
