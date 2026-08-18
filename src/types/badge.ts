/**
 * @file badge.ts
 * @description 勋章域类型（统一合并版）
 *
 * 共享类型统一重导出自 types/ui（types/index.ts 的规范来源），
 * 本文件仅保留勋章域扩展类型（BadgeFilter / BadgeUnlockEvent / BadgeUserProgress），
 * 消除原先 src/types 与 types/ui 两份重复定义。
 */

import type {
  BadgeSeries,
  BadgeCategory,
  BadgeRarity,
  BadgeLevel,
  UnlockCondition,
} from '../../types/ui';

export type {
  Badge,
  BadgeSeries,
  BadgeLevel,
  BadgeCategory,
  BadgeRarity,
  UnlockCondition,
  ConditionType,
  ShareContent,
  BadgeMetadata,
  SeriesProgress,
  SeriesMilestone,
  BadgeReward,
  BadgeGroup,
  BadgeStats,
} from '../../types/ui';

export interface BadgeFilter {
  series?: BadgeSeries;
  category?: BadgeCategory;
  rarity?: BadgeRarity;
  level?: BadgeLevel;
  status?: 'all' | 'earned' | 'unearned';
  search?: string;
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  earnedDateStart?: Date;
  earnedDateEnd?: Date;
}

export interface BadgeUnlockEvent {
  badgeId: string;
  userId: string;
  timestamp: number;
  conditionsMet: UnlockCondition[];
}

export interface BadgeUserProgress {
  userId: string;
  earnedBadges: string[];
  badgeProgress: Record<string, number>;
  totalPoints: number;
  lastUpdated: string;
}
