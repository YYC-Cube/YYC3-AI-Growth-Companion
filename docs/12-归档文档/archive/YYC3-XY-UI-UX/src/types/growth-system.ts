/**
 * Growth System Types
 * 沫语成长守护体系 - 类型定义
 * 基于Python后端系统的TypeScript类型映射
 */

/**
 * 成长阶段枚举
 */
export enum GrowthStage {
  INFANT = '0-3岁',
  PRESCHOOL = '4-6岁',
  PRIMARY = '7-12岁',
  MIDDLE = '13-18岁',
  ADULT = '19-21岁',
}

/**
 * 发展维度类型
 */
export type DevelopmentDimension = '生活' | '学习' | '社交' | '情感' | '文化';

/**
 * 角色类型
 */
export type RoleType = 'recorder' | 'observer' | 'guide' | 'protector';

/**
 * 文化元素
 */
export interface CulturalElement {
  name: string;
  description: string;
  images?: string[];
  audio?: string;
}

/**
 * 年龄阶段配置
 */
export interface AgeStageConfig {
  age: number;
  stageName: string;
  growthStage: GrowthStage;
  culturalMessage: string;
  developmentDimensions: string[];
  coreFolders: string[];
}

/**
 * 里程碑记录
 */
export interface MilestoneRecord {
  id: string;
  age: number;
  milestone: string;
  timestamp: string;
  notes?: string;
  completed: boolean;
  category: 'physical' | 'cognitive' | 'social' | 'emotional' | 'cultural';
}

/**
 * 成长记录
 */
export interface GrowthRecord {
  id: string;
  title: string;
  date: string;
  age: number;
  type: DevelopmentDimension;
  description: string;
  images?: string[];
  videos?: string[];
  progress: number;
  tags: string[];
  roleType?: RoleType;
  milestones?: string[];
}

/**
 * 维度进度
 */
export interface DimensionProgress {
  dimension: DevelopmentDimension;
  progress: number;
  level: number;
  maxLevel: number;
  items: DimensionItem[];
}

/**
 * 维度项目
 */
export interface DimensionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
  icon: string;
}

/**
 * AI分析结果
 */
export interface AIAnalysisResult {
  age: number;
  timestamp: string;
  overallScore: number;
  developmentBalance: Record<DevelopmentDimension, number>;
  milestoneProgress: {
    total: number;
    completed: number;
    progressPercent: number;
    recentMilestones: MilestoneRecord[];
  };
  recommendations: string[];
  riskFactors: string[];
}

/**
 * 成长趋势预测
 */
export interface GrowthTrendPrediction {
  currentAge: number;
  predictedAge: number;
  trendDirection: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keyAreas: string[];
  focusAreas: string[];
}

/**
 * 文化建议
 */
export interface CulturalSuggestion {
  type: string;
  content: string;
  activity: string;
}

/**
 * 系统配置
 */
export interface SystemConfig {
  systemName: string;
  systemVersion: string;
  currentYear: number;
  coreElements: {
    character: string;
    culturalBase: string;
    culturalSymbols: string[];
  };
  roleCoreFolders: Record<RoleType, Record<string, string[]>>;
}

/**
 * 年度总结
 */
export interface AnnualSummary {
  age: number;
  year: number;
  stageName: string;
  culturalMessage: string;
  milestones: MilestoneRecord[];
  achievements: string[];
  improvements: string[];
  nextYearGoals: string[];
  healthRecords: HealthRecord[];
  culturalExperiences: CulturalExperience[];
}

/**
 * 健康记录
 */
export interface HealthRecord {
  id: string;
  date: string;
  type: 'checkup' | 'vaccination' | 'illness' | 'dental';
  title: string;
  description: string;
  height?: number;
  weight?: number;
  doctorNotes?: string;
}

/**
 * 文化体验
 */
export interface CulturalExperience {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  location?: string;
  photos?: string[];
}

/**
 * 角色记录项目
 */
export interface RoleRecord {
  id: string;
  roleType: RoleType;
  date: string;
  category: string;
  title: string;
  content: string;
  observations?: string[];
  recommendations?: string[];
}

/**
 * 系统健康状态
 */
export interface SystemHealth {
  systemStatus: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  memoryUsage: Record<string, any>;
  cacheHitRate: number;
  cacheSize: number;
  totalOperations: number;
  errorCount: number;
}

/**
 * 系统报告
 */
export interface SystemReport {
  systemInfo: {
    systemName: string;
    currentYear: number;
    character: string;
    culturalBase: string;
    culturalSymbols: string[];
    ageStages: number;
    developmentDimensions: number;
    roleCoreFolders: number;
    systemVersion: string;
  };
  systemHealth: SystemHealth;
  milestoneSummary: {
    totalAges: number;
    totalMilestones: number;
    totalCompleted: number;
    byAge: Array<{
      age: number;
      totalMilestones: number;
      completedMilestones: number;
      completionRate: string;
    }>;
  };
  exportTimestamp: string;
}
