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

export interface Attachment {
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
