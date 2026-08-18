// Culture Content Type Definitions
// Based on YYC³-XY UI/UX Design Specification

export type CultureType = 'site' | 'food' | 'festival' | 'story';

export interface InteractiveElement {
  id: string;
  type: 'game' | 'quiz' | 'craft' | 'ar' | 'video';
  title: string;
  description: string;
  difficulty: number;
  duration?: number; // 分钟
  completed?: boolean;
  url?: string;
}

export interface KnowledgePoint {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty: number;
  answered?: boolean;
  correct?: boolean;
}

export interface CultureMultimedia {
  images: string[];
  videos?: string[];
  audio?: string[];
  ar?: string; // AR体验链接
  panorama?: string; // 全景图链接
}

export interface CultureContent {
  id: string;
  title: string;
  description: string;
  detailedContent: string; // HTML内容
  type: CultureType;
  category: string;
  tags: string[];
  difficultyLevel: number; // 1-5
  suitableAgeRange: [number, number];
  location?: string;
  
  multimedia: CultureMultimedia;
  interactiveElements: InteractiveElement[];
  knowledgePoints: KnowledgePoint[];
  relatedContent: string[]; // 关联内容ID
  
  // 学习进度
  learned?: boolean;
  quizCompleted?: boolean;
  interactiveCompleted?: boolean;
  shared?: boolean;
  favorited?: boolean;
  
  // 统计信息
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface CultureCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface CultureProgress {
  totalItems: number;
  learnedItems: number;
  favoriteItems: number;
  completedQuizzes: number;
  earnedBadges: number;
}
