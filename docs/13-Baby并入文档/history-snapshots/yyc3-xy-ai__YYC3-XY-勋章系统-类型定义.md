# YYC3-XY-勋章系统-类型定义

完整的勋章殿堂系统，包含多个套系、分级解锁、隐藏成就等功能。

1. 完整勋章类型定义

// /src/types/badge.ts
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  series: BadgeSeries; // 所属套系
  level: BadgeLevel; // 勋章等级
  category: BadgeCategory; // 分类
  rarity: BadgeRarity; // 稀有度
  unlockConditions: UnlockCondition[]; // 解锁条件
  earnedDate?: string; // 获得时间
  progress?: number; // 进度百分比
  isHidden?: boolean; // 是否隐藏勋章
  hiddenDescription?: string; // 隐藏描述（解锁前显示）
  unlockAnimation?: string; // 解锁动画
  soundEffect?: string; // 解锁音效
  shareContent?: ShareContent; // 分享内容
  metadata: BadgeMetadata; // 元数据
  nextBadge?: string; // 下一级勋章ID
  prerequisiteBadge?: string; // 前置勋章ID
  seriesProgress?: SeriesProgress; // 套系进度
}

export type BadgeSeries = 
  | 'growth'          // 成长勋章
  | 'creative'        // 创意勋章
  | 'hidden'          // 隐藏勋章
  | 'dynasty'         // 朝代勋章
  | 'celebrities'     // 名人勋章
  | 'technology'      // 科技勋章
  | 'dream'           // 筑梦勋章
  | 'culture'         // 文化勋章
  | 'learning'        // 学习勋章
  | 'social'          // 社交勋章;

export type BadgeLevel = 
  | 'bronze'          // 青铜
  | 'silver'          // 白银
  | 'gold'            // 黄金
  | 'platinum'        // 白金
  | 'diamond'         // 钻石
  | 'legend'          // 传说;

export type BadgeCategory = 
  | 'learning'        // 学习成就
  | 'culture'         // 文化探索
  | 'social'          // 社交互动
  | 'creative'        // 创意制作
  | 'physical'        // 体能发展
  | 'cognitive'       // 认知发展
  | 'emotional'       // 情感发展;

export type BadgeRarity = 
  | 'common'          // 普通
  | 'rare'            // 稀有
  | 'epic'            // 史诗
  | 'legendary'       // 传说
  | 'mythical';       // 神话

export interface UnlockCondition {
  type: ConditionType;
  value: number;
  description: string;
  progress?: number;
  current?: number;
  target?: number;
}

export type ConditionType = 
  | 'total_hours'            // 总学习时长
  | 'consecutive_days'       // 连续学习天数
  | 'completed_courses'      // 完成课程数
  | 'cultural_sites_visited' // 参观文化遗址
  | 'interactions'           // 社交互动次数
  | 'creations'              // 创作作品数
  | 'score'                  // 达到分数
  | 'perfect_score'          // 满分次数
  | 'streak'                 // 连续达标天数
  | 'custom';                // 自定义条件

export interface ShareContent {
  title: string;
  description: string;
  image: string;
  hashtags: string[];
}

export interface BadgeMetadata {
  points: number;                    // 成就点数
  version: string;                   // 勋章版本
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
  unlockCount?: number;              // 总解锁人数
  specialEffect?: boolean;           // 是否有特效
  animatedIcon?: string;             // 动态图标
  glowColor?: string;                // 辉光颜色
  sparkleEffect?: boolean;           // 闪光效果
}

export interface SeriesProgress {
  seriesId: string;
  totalBadges: number;
  earnedBadges: number;
  currentLevel: BadgeLevel;
  nextLevel?: BadgeLevel;
  progressPercentage: number;
  completionReward?: BadgeReward;
  milestones: SeriesMilestone[];
}

export interface SeriesMilestone {
  level: BadgeLevel;
  requiredBadges: number;
  reward: BadgeReward;
  unlocked: boolean;
}

export interface BadgeReward {
  type: 'points' | 'badge' | 'title' | 'avatar' | 'privilege';
  value: any;
  description: string;
}

export interface BadgeGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeCount: number;
  earnedCount: number;
  progress: number;
  badges: string[]; // Badge IDs
  completionBadge?: string;
  category: BadgeCategory;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface BadgeStats {
  total: number;
  earned: number;
  bySeries: Record<BadgeSeries, number>;
  byCategory: Record<BadgeCategory, number>;
  byRarity: Record<BadgeRarity, number>;
  byLevel: Record<BadgeLevel, number>;
  totalPoints: number;
  ranking?: number;
  recentBadges: Badge[];
}
