/**
 * Growth System Manager
 * 模拟成长系统的核心逻辑和配置
 */

export type DevelopmentDimension = 'academic' | 'social' | 'health' | 'perception' | 'cultural';

export interface DimensionConfig {
  name: string;
  description: string;
  color: string;
  icon: string;
  stages: string[];
}

export const DEVELOPMENT_DIMENSIONS: Record<string, DimensionConfig> = {
  academic: {
    name: '认知与学业',
    description: '包括逻辑思维、语言表达、知识储备等',
    color: 'purple',
    icon: '🧠',
    stages: ['启蒙', '基础', '进阶', '精通'],
  },
  social: {
    name: '社交与情感',
    description: '包括人际交往、情绪管理、同理心等',
    color: 'pink',
    icon: '❤️',
    stages: ['依赖', '独立', '合作', '领导'],
  },
  health: {
    name: '身体与健康',
    description: '包括大运动、精细动作、生活习惯等',
    color: 'green',
    icon: '🏃',
    stages: ['发育', '协调', '强健', '卓越'],
  },
  perception: {
    name: '感知与探索',
    description: '包括观察力、好奇心、创造力等',
    color: 'blue',
    icon: '👁️',
    stages: ['觉醒', '敏感', '洞察', '创造'],
  },
  cultural: {
    name: '文化与修养',
    description: '包括传统文化、艺术鉴赏、礼仪规范等',
    color: 'orange',
    icon: '🏛️',
    stages: ['接触', '了解', '喜爱', '传承'],
  },
};

export const SYSTEM_CONFIG = {
  systemName: '小语AI成长助手',
  systemVersion: '1.0.0',
  coreElements: {
    character: 'AI伴侣',
  },
};

class GrowthSystemManager {
  getAgeStageConfig(age: number) {
    let stageName = '学龄前';
    let growthStage = '探索期';

    if (age < 3) {
      stageName = '婴幼儿_感知启蒙';
      growthStage = '依恋与感知';
    } else if (age >= 3 && age < 6) {
      stageName = '幼儿园_社交萌芽';
      growthStage = '游戏与模仿';
    } else if (age >= 6 && age < 12) {
      stageName = '小学_学业基础';
      growthStage = '勤奋与自律';
    } else {
      stageName = '中学_青春叛逆';
      growthStage = '自我认同';
    }

    return { stageName, growthStage };
  }

  getCulturalMessage(age: number) {
    const messages = [
      '读万卷书，行万里路。',
      '学而时习之，不亦说乎。',
      '温故而知新，可以为师矣。',
      '三人行，必有我师焉。',
    ];
    return messages[age % messages.length];
  }

  getDimensionProgress(age: number) {
    // Mock data based on age
    const baseProgress = Math.min((age / 12) * 100, 100);
    return [
      { dimension: 'academic' as DevelopmentDimension, progress: Math.min(baseProgress + 5, 100), level: Math.floor(age / 3), maxLevel: 4, items: [] },
      { dimension: 'social' as DevelopmentDimension, progress: Math.min(baseProgress, 100), level: Math.floor(age / 3), maxLevel: 4, items: [] },
      { dimension: 'health' as DevelopmentDimension, progress: Math.min(baseProgress + 10, 100), level: Math.floor(age / 3), maxLevel: 4, items: [] },
      { dimension: 'perception' as DevelopmentDimension, progress: Math.min(baseProgress - 5, 100), level: Math.floor(age / 3), maxLevel: 4, items: [] },
      { dimension: 'cultural' as DevelopmentDimension, progress: Math.min(baseProgress + 2, 100), level: Math.floor(age / 3), maxLevel: 4, items: [] },
    ];
  }

  analyzeGrowthData(age: number) {
    return {
      overallScore: 85,
      developmentBalance: {
        academic: 80,
        social: 75,
        health: 90,
        perception: 85,
        cultural: 70,
      },
      recommendations: [
        '建议增加户外活动时间',
        '多参与集体游戏，提升社交能力',
        '阅读更多历史故事，增强文化底蕴',
      ],
      riskFactors: [],
    };
  }

  getMilestones(age: number) {
    return [
      '学会骑自行车',
      '独立阅读一本故事书',
      '结交3个新朋友',
      '参加一次博物馆参观',
    ];
  }

  getMilestoneRecords(age: number) {
    return [
      { milestone: '学会骑自行车', completed: true, timestamp: Date.now(), notes: '在公园学会的' },
      { milestone: '独立阅读一本故事书', completed: false, timestamp: 0, notes: '' },
    ];
  }
}

export const growthSystemManager = new GrowthSystemManager();
