# 完整勋章殿堂系统 - BadgesPage

基于需求，设计一个完整的勋章殿堂系统，包含多个套系、分级解锁、隐藏成就等功能。

## 1. 完整勋章类型定义

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

## 2. 完整Mock数据

// /src/data/badgeMockData.ts
import { Badge, BadgeSeries, BadgeLevel, BadgeCategory, BadgeRarity, BadgeGroup } from '../types/badge';

// 成长勋章套系（阶段式）
export const growthBadges: Badge[] = [
  {
    id: 'growth_bronze',
    title: '成长青铜',
    description: '完成基础学习目标，迈出成长第一步',
    icon: '/badges/growth/bronze.png',
    series: 'growth',
    level: 'bronze',
    category: 'learning',
    rarity: 'common',
    unlockConditions: [
      { type: 'total_hours', value: 10, description: '累计学习10小时' },
      { type: 'completed_courses', value: 3, description: '完成3门课程' }
    ],
    metadata: {
      points: 100,
      version: '1.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01'
    },
    nextBadge: 'growth_silver'
  },
  {
    id: 'growth_silver',
    title: '成长白银',
    description: '建立良好学习习惯，持续进步',
    icon: '/badges/growth/silver.png',
    series: 'growth',
    level: 'silver',
    category: 'learning',
    rarity: 'rare',
    unlockConditions: [
      { type: 'total_hours', value: 50, description: '累计学习50小时' },
      { type: 'consecutive_days', value: 7, description: '连续学习7天' },
      { type: 'completed_courses', value: 10, description: '完成10门课程' }
    ],
    metadata: {
      points: 300,
      version: '1.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01'
    },
    prerequisiteBadge: 'growth_bronze',
    nextBadge: 'growth_gold'
  },
  {
    id: 'growth_gold',
    title: '成长黄金',
    description: '成为学习小能手，掌握多项技能',
    icon: '/badges/growth/gold.png',
    series: 'growth',
    level: 'gold',
    category: 'learning',
    rarity: 'epic',
    unlockConditions: [
      { type: 'total_hours', value: 100, description: '累计学习100小时' },
      { type: 'consecutive_days', value: 21, description: '连续学习21天' },
      { type: 'completed_courses', value: 20, description: '完成20门课程' },
      { type: 'score', value: 90, description: '平均成绩90分以上' }
    ],
    metadata: {
      points: 500,
      version: '1.0',
      glowColor: '#FFD700',
      specialEffect: true
    },
    prerequisiteBadge: 'growth_silver',
    nextBadge: 'growth_platinum'
  },
  {
    id: 'growth_platinum',
    title: '成长白金',
    description: '卓越的学习者，在多个领域表现出色',
    icon: '/badges/growth/platinum.png',
    series: 'growth',
    level: 'platinum',
    category: 'learning',
    rarity: 'legendary',
    unlockConditions: [
      { type: 'total_hours', value: 200, description: '累计学习200小时' },
      { type: 'consecutive_days', value: 30, description: '连续学习30天' },
      { type: 'completed_courses', value: 40, description: '完成40门课程' },
      { type: 'perfect_score', value: 5, description: '获得5次满分' }
    ],
    metadata: {
      points: 1000,
      version: '1.0',
      glowColor: '#E5E4E2',
      sparkleEffect: true,
      animatedIcon: '/badges/growth/platinum.gif'
    },
    prerequisiteBadge: 'growth_gold',
    nextBadge: 'growth_diamond'
  }
];

// 创意勋章套系
export const creativeBadges: Badge[] = [
  {
    id: 'creative_bronze',
    title: '创意萌芽',
    description: '完成第一个创意作品',
    icon: '/badges/creative/bronze.png',
    series: 'creative',
    level: 'bronze',
    category: 'creative',
    rarity: 'common',
    unlockConditions: [
      { type: 'creations', value: 1, description: '创作1件作品' }
    ],
    metadata: { points: 50, version: '1.0' }
  },
  {
    id: 'creative_silver',
    title: '创意小能手',
    description: '展示多样化创作能力',
    icon: '/badges/creative/silver.png',
    series: 'creative',
    level: 'silver',
    category: 'creative',
    rarity: 'rare',
    unlockConditions: [
      { type: 'creations', value: 5, description: '创作5件不同类型作品' }
    ],
    metadata: { points: 150, version: '1.0' }
  },
  {
    id: 'creative_gold',
    title: '创意大师',
    description: '创作作品获得广泛认可',
    icon: '/badges/creative/gold.png',
    series: 'creative',
    level: 'gold',
    category: 'creative',
    rarity: 'epic',
    unlockConditions: [
      { type: 'creations', value: 10, description: '创作10件优秀作品' },
      { type: 'interactions', value: 50, description: '作品获得50次点赞' }
    ],
    metadata: { points: 300, version: '1.0' }
  }
];

// 隐藏勋章（特殊成就）
export const hiddenBadges: Badge[] = [
  {
    id: 'hidden_midnight',
    title: '夜行者',
    description: '在深夜坚持学习',
    icon: '/badges/hidden/midnight.png',
    series: 'hidden',
    level: 'silver',
    category: 'learning',
    rarity: 'rare',
    isHidden: true,
    hiddenDescription: '在特定时间进行学习可能解锁此勋章',
    unlockConditions: [
      { type: 'custom', value: 1, description: '在00:00-05:00完成学习任务' }
    ],
    metadata: { points: 200, version: '1.0' }
  },
  {
    id: 'hidden_perfect_month',
    title: '完美之星',
    description: '一个月内所有任务完美完成',
    icon: '/badges/hidden/perfect.png',
    series: 'hidden',
    level: 'gold',
    category: 'learning',
    rarity: 'epic',
    isHidden: true,
    hiddenDescription: '卓越的表现可能带来惊喜',
    unlockConditions: [
      { type: 'perfect_score', value: 30, description: '连续30天获得满分' },
      { type: 'streak', value: 30, description: '连续30天完成任务' }
    ],
    metadata: { points: 500, version: '1.0', specialEffect: true }
  },
  {
    id: 'hidden_explorer',
    title: '文化探索者',
    description: '发现所有文化遗址',
    icon: '/badges/hidden/explorer.png',
    series: 'hidden',
    level: 'platinum',
    category: 'culture',
    rarity: 'legendary',
    isHidden: true,
    hiddenDescription: '深入探索文化遗址的秘密',
    unlockConditions: [
      { type: 'cultural_sites_visited', value: 15, description: '探索15个文化遗址' },
      { type: 'completed_courses', value: 10, description: '完成10个文化课程' }
    ],
    metadata: { points: 1000, version: '1.0', glowColor: '#8B4513' }
  }
];

// 朝代勋章套系（丝绸之路）
export const dynastyBadges: Badge[] = [
  {
    id: 'dynasty_silk_road',
    title: '丝路启程',
    description: '了解丝绸之路的开端',
    icon: '/badges/dynasty/silk_bronze.png',
    series: 'dynasty',
    level: 'bronze',
    category: 'culture',
    rarity: 'common',
    unlockConditions: [
      { type: 'completed_courses', value: 1, description: '完成"丝绸之路起源"课程' }
    ],
    metadata: { points: 100, version: '1.0' }
  },
  {
    id: 'dynasty_tang_glory',
    title: '大唐风华',
    description: '深入了解唐朝的繁荣',
    icon: '/badges/dynasty/tang_silver.png',
    series: 'dynasty',
    level: 'silver',
    category: 'culture',
    rarity: 'rare',
    unlockConditions: [
      { type: 'completed_courses', value: 3, description: '完成唐朝相关课程' },
      { type: 'cultural_sites_visited', value: 2, description: '探索唐代文化遗址' }
    ],
    metadata: { points: 300, version: '1.0' }
  },
  {
    id: 'dynasty_song_wisdom',
    title: '宋词雅韵',
    description: '掌握宋代文化与科技',
    icon: '/badges/dynasty/song_gold.png',
    series: 'dynasty',
    level: 'gold',
    category: 'culture',
    rarity: 'epic',
    unlockConditions: [
      { type: 'completed_courses', value: 5, description: '完成宋代文化课程' },
      { type: 'score', value: 95, description: '宋代文化测试95分以上' }
    ],
    metadata: { points: 500, version: '1.0' }
  }
];

// 名人勋章套系（栋梁）
export const celebritiesBadges: Badge[] = [
  {
    id: 'celebrity_poet',
    title: '诗仙李白',
    description: '学习李白的诗歌与精神',
    icon: '/badges/celebrities/li_bai.png',
    series: 'celebrities',
    level: 'bronze',
    category: 'culture',
    rarity: 'common',
    unlockConditions: [
      { type: 'completed_courses', value: 1, description: '完成李白诗词课程' }
    ],
    metadata: { points: 100, version: '1.0' }
  },
  {
    id: 'celebrity_scientist',
    title: '天工开物',
    description: '学习古代科学家的智慧',
    icon: '/badges/celebrities/scientist.png',
    series: 'celebrities',
    level: 'silver',
    category: 'cognitive',
    rarity: 'rare',
    unlockConditions: [
      { type: 'completed_courses', value: 2, description: '完成古代科技课程' }
    ],
    metadata: { points: 200, version: '1.0' }
  }
];

// 科技勋章套系
export const technologyBadges: Badge[] = [
  {
    id: 'tech_bronze',
    title: '科技启蒙',
    description: '了解基础科技知识',
    icon: '/badges/tech/bronze.png',
    series: 'technology',
    level: 'bronze',
    category: 'cognitive',
    rarity: 'common',
    unlockConditions: [
      { type: 'completed_courses', value: 2, description: '完成科技基础课程' }
    ],
    metadata: { points: 100, version: '1.0' }
  },
  {
    id: 'tech_silver',
    title: '科技探索者',
    description: '掌握多项科技技能',
    icon: '/badges/tech/silver.png',
    series: 'technology',
    level: 'silver',
    category: 'cognitive',
    rarity: 'rare',
    unlockConditions: [
      { type: 'completed_courses', value: 5, description: '完成5门科技课程' },
      { type: 'creations', value: 2, description: '完成2个科技项目' }
    ],
    metadata: { points: 300, version: '1.0' }
  }
];

// 筑梦勋章套系
export const dreamBadges: Badge[] = [
  {
    id: 'dream_visionary',
    title: '梦想规划师',
    description: '制定并开始执行梦想计划',
    icon: '/badges/dream/visionary.png',
    series: 'dream',
    level: 'bronze',
    category: 'emotional',
    rarity: 'common',
    unlockConditions: [
      { type: 'creations', value: 1, description: '创建梦想计划' }
    ],
    metadata: { points: 100, version: '1.0' }
  },
  {
    id: 'dream_achiever',
    title: '梦想实现家',
    description: '完成重要梦想里程碑',
    icon: '/badges/dream/achiever.png',
    series: 'dream',
    level: 'silver',
    category: 'emotional',
    rarity: 'rare',
    unlockConditions: [
      { type: 'completed_courses', value: 3, description: '完成梦想相关课程' },
      { type: 'creations', value: 3, description: '实现3个梦想目标' }
    ],
    metadata: { points: 300, version: '1.0' }
  }
];

// 文化勋章套系
export const cultureBadges: Badge[] = [
  {
    id: 'culture_novice',
    title: '文化爱好者',
    description: '开始探索河洛文化',
    icon: '/badges/culture/novice.png',
    series: 'culture',
    level: 'bronze',
    category: 'culture',
    rarity: 'common',
    unlockConditions: [
      { type: 'cultural_sites_visited', value: 3, description: '参观3个文化遗址' }
    ],
    metadata: { points: 100, version: '1.0' }
  }
];

// 学习勋章套系
export const learningBadges: Badge[] = [
  {
    id: 'learning_streak',
    title: '学习之星',
    description: '保持学习连续性',
    icon: '/badges/learning/streak.png',
    series: 'learning',
    level: 'bronze',
    category: 'learning',
    rarity: 'common',
    unlockConditions: [
      { type: 'consecutive_days', value: 7, description: '连续学习7天' }
    ],
    metadata: { points: 150, version: '1.0' }
  }
];

// 社交勋章套系
export const socialBadges: Badge[] = [
  {
    id: 'social_butterfly',
    title: '社交达人',
    description: '积极参与社交互动',
    icon: '/badges/social/butterfly.png',
    series: 'social',
    level: 'bronze',
    category: 'social',
    rarity: 'common',
    unlockConditions: [
      { type: 'interactions', value: 20, description: '完成20次社交互动' }
    ],
    metadata: { points: 100, version: '1.0' }
  }
];

// 合并所有勋章
export const allBadges: Badge[] = [
  ...growthBadges,
  ...creativeBadges,
  ...hiddenBadges,
  ...dynastyBadges,
  ...celebritiesBadges,
  ...technologyBadges,
  ...dreamBadges,
  ...cultureBadges,
  ...learningBadges,
  ...socialBadges
];

// 勋章套系组
export const badgeGroups: BadgeGroup[] = [
  {
    id: 'growth',
    name: '成长勋章',
    description: '记录学习成长的每一个阶段',
    icon: '📚',
    badgeCount: 4,
    earnedCount: 2,
    progress: 50,
    badges: ['growth_bronze', 'growth_silver', 'growth_gold', 'growth_platinum'],
    category: 'learning'
  },
  {
    id: 'creative',
    name: '创意勋章',
    description: '激发创造力和想象力',
    icon: '🎨',
    badgeCount: 3,
    earnedCount: 1,
    progress: 33,
    badges: ['creative_bronze', 'creative_silver', 'creative_gold'],
    category: 'creative'
  },
  {
    id: 'hidden',
    name: '隐藏勋章',
    description: '等待探索的神秘成就',
    icon: '🔮',
    badgeCount: 3,
    earnedCount: 0,
    progress: 0,
    badges: ['hidden_midnight', 'hidden_perfect_month', 'hidden_explorer'],
    category: 'learning',
    isLocked: true,
    unlockRequirement: '探索系统功能'
  },
  {
    id: 'dynasty',
    name: '朝代勋章',
    description: '探索丝绸之路与古代文明',
    icon: '🏯',
    badgeCount: 3,
    earnedCount: 1,
    progress: 33,
    badges: ['dynasty_silk_road', 'dynasty_tang_glory', 'dynasty_song_wisdom'],
    category: 'culture'
  },
  {
    id: 'celebrities',
    name: '名人勋章',
    description: '学习历史名人的智慧与精神',
    icon: '👑',
    badgeCount: 2,
    earnedCount: 0,
    progress: 0,
    badges: ['celebrity_poet', 'celebrity_scientist'],
    category: 'culture'
  },
  {
    id: 'technology',
    name: '科技勋章',
    description: '探索古代与现代科技',
    icon: '🔬',
    badgeCount: 2,
    earnedCount: 0,
    progress: 0,
    badges: ['tech_bronze', 'tech_silver'],
    category: 'cognitive'
  },
  {
    id: 'dream',
    name: '筑梦勋章',
    description: '记录梦想的实现过程',
    icon: '✨',
    badgeCount: 2,
    earnedCount: 0,
    progress: 0,
    badges: ['dream_visionary', 'dream_achiever'],
    category: 'emotional'
  },
  {
    id: 'culture',
    name: '文化勋章',
    description: '深入了解河洛文化',
    icon: '🏛',
    badgeCount: 1,
    earnedCount: 1,
    progress: 100,
    badges: ['culture_novice'],
    category: 'culture'
  },
  {
    id: 'learning',
    name: '学习勋章',
    description: '学习过程中的成就奖励',
    icon: '🎓',
    badgeCount: 1,
    earnedCount: 1,
    progress: 100,
    badges: ['learning_streak'],
    category: 'learning'
  },
  {
    id: 'social',
    name: '社交勋章',
    description: '社交互动与协作成就',
    icon: '👥',
    badgeCount: 1,
    earnedCount: 0,
    progress: 0,
    badges: ['social_butterfly'],
    category: 'social'
  }
];

// 勋章统计数据
export const badgeStats = {
  total: allBadges.length,
  earned: 5, // 示例数据
  bySeries: {
    'growth': 2,
    'creative': 1,
    'hidden': 0,
    'dynasty': 1,
    'celebrities': 0,
    'technology': 0,
    'dream': 0,
    'culture': 1,
    'learning': 1,
    'social': 0
  },
  byCategory: {
    'learning': 3,
    'culture': 2,
    'social': 0,
    'creative': 1,
    'physical': 0,
    'cognitive': 0,
    'emotional': 0
  },
  byRarity: {
    'common': 3,
    'rare': 1,
    'epic': 1,
    'legendary': 0,
    'mythical': 0
  },
  byLevel: {
    'bronze': 3,
    'silver': 1,
    'gold': 1,
    'platinum': 0,
    'diamond': 0,
    'legend': 0
  },
  totalPoints: 850,
  ranking: 156,
  recentBadges: allBadges.slice(0, 3)
};

## 3. 完整勋章殿堂页面

// /src/app/components/pages/BadgesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Row, Col, Tabs, Modal, Button, Progress, Space, Badge, 
  Card, Tag, Input, Select, Pagination, Tooltip, Divider,
  Alert, Empty, Skeleton, Spin, message 
} from 'antd';
import { 
  TrophyOutlined, ShareAltOutlined, FireOutlined, CrownOutlined,
  SearchOutlined, FilterOutlined, StarOutlined, LockOutlined,
  EyeInvisibleOutlined, CheckCircleOutlined, CalendarOutlined,
  TeamOutlined, BookOutlined, BulbOutlined, CompassOutlined,
  RocketOutlined, SettingOutlined, SyncOutlined, DownloadOutlined
} from '@ant-design/icons';
import BadgeCard from '../business/BadgeCard';
import BadgeSeriesCard from '../business/BadgeSeriesCard';
import { badgeService } from '../../services/badge/badgeService';
import { allBadges, badgeGroups, badgeStats } from '../../data/badgeMockData';
import { Badge as BadgeType, BadgeSeries, BadgeCategory, BadgeRarity, BadgeLevel } from '../../types/badge';
import './BadgesPage.less';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const BadgesPage: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [filteredBadges, setFilteredBadges] = useState<BadgeType[]>(allBadges);
  const [earnedBadges, setEarnedBadges] = useState<BadgeType[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('series');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    series: 'all' as string | BadgeSeries,
    category: 'all' as string | BadgeCategory,
    rarity: 'all' as string | BadgeRarity,
    level: 'all' as string | BadgeLevel,
    status: 'all' as 'all' | 'earned' | 'unearned' | 'in_progress'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [stats, setStats] = useState(badgeStats);
  const [groups, setGroups] = useState(badgeGroups);
  const [seriesProgress, setSeriesProgress] = useState<Record<string, any>>({});

  // 初始化加载
  useEffect(() => {
    loadBadgesData();
    calculateSeriesProgress();
  }, []);

  // 加载勋章数据
  const loadBadgesData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用真实的API
      // const badges = await badgeService.getAllBadges();
      // const earned = await badgeService.getUserBadges();
      
      // 使用Mock数据
      const earned = allBadges.filter(b => 
        ['growth_bronze', 'growth_silver', 'creative_bronze', 'dynasty_silk_road', 'culture_novice', 'learning_streak'].includes(b.id)
      );
      
      setEarnedBadges(earned);
      setFilteredBadges(allBadges);
      
      // 更新统计
      const updatedStats = {
        ...badgeStats,
        earned: earned.length,
        bySeries: calculateSeriesStats(earned),
        byCategory: calculateCategoryStats(earned),
        recentBadges: earned.slice(0, 3)
      };
      setStats(updatedStats);
      
    } catch (error) {
      message.error('加载勋章数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 计算套系统计
  const calculateSeriesStats = (earned: BadgeType[]) => {
    const seriesStats: Record<string, number> = {};
    badgeGroups.forEach(group => {
      const earnedInSeries = earned.filter(b => group.badges.includes(b.id));
      seriesStats[group.id] = earnedInSeries.length;
    });
    return seriesStats;
  };

  // 计算分类统计
  const calculateCategoryStats = (earned: BadgeType[]) => {
    const categoryStats: Record<string, number> = {};
    earned.forEach(badge => {
      categoryStats[badge.category] = (categoryStats[badge.category] || 0) + 1;
    });
    return categoryStats;
  };

  // 计算套系进度
  const calculateSeriesProgress = () => {
    const progress: Record<string, any> = {};
    
    badgeGroups.forEach(group => {
      const earnedInGroup = earnedBadges.filter(b => group.badges.includes(b.id));
      const earnedCount = earnedInGroup.length;
      const progressPercentage = group.badgeCount > 0 ? (earnedCount / group.badgeCount) * 100 : 0;
      
      // 确定当前等级
      let currentLevel: BadgeLevel = 'bronze';
      if (progressPercentage >= 75) currentLevel = 'platinum';
      else if (progressPercentage >= 50) currentLevel = 'gold';
      else if (progressPercentage >= 25) currentLevel = 'silver';
      
      progress[group.id] = {
        earnedCount,
        totalCount: group.badgeCount,
        progressPercentage,
        currentLevel,
        nextLevel: getNextLevel(currentLevel),
        milestones: generateMilestones(group)
      };
    });
    
    setSeriesProgress(progress);
  };

  // 获取下一等级
  const getNextLevel = (currentLevel: BadgeLevel): BadgeLevel | undefined => {
    const levels: BadgeLevel[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  };

  // 生成里程碑
  const generateMilestones = (group: any) => {
    return [
      { level: 'bronze' as BadgeLevel, requiredBadges: 1, reward: { type: 'points', value: 100 }, unlocked: true },
      { level: 'silver' as BadgeLevel, requiredBadges: Math.ceil(group.badgeCount * 0.33), reward: { type: 'points', value: 300 }, unlocked: false },
      { level: 'gold' as BadgeLevel, requiredBadges: Math.ceil(group.badgeCount * 0.66), reward: { type: 'title', value: `${group.name}大师` }, unlocked: false },
      { level: 'platinum' as BadgeLevel, requiredBadges: group.badgeCount, reward: { type: 'badge', value: `${group.id}_master` }, unlocked: false }
    ];
  };

  // 过滤勋章
  const filterBadges = useCallback(() => {
    let filtered = allBadges;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(badge =>
        badge.title.toLowerCase().includes(searchText.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 套系过滤
    if (filters.series !== 'all') {
      filtered = filtered.filter(badge => badge.series === filters.series);
    }

    // 分类过滤
    if (filters.category !== 'all') {
      filtered = filtered.filter(badge => badge.category === filters.category);
    }

    // 稀有度过滤
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === filters.rarity);
    }

    // 等级过滤
    if (filters.level !== 'all') {
      filtered = filtered.filter(badge => badge.level === filters.level);
    }

    // 状态过滤
    if (filters.status !== 'all') {
      const earnedIds = earnedBadges.map(b => b.id);
      if (filters.status === 'earned') {
        filtered = filtered.filter(badge => earnedIds.includes(badge.id));
      } else if (filters.status === 'unearned') {
        filtered = filtered.filter(badge => !earnedIds.includes(badge.id));
      } else if (filters.status === 'in_progress') {
        filtered = filtered.filter(badge => 
          !earnedIds.includes(badge.id) && 
          badge.progress && 
          badge.progress > 0 && 
          badge.progress < 100
        );
      }
    }

    setFilteredBadges(filtered);
    setCurrentPage(1);
  }, [searchText, filters, earnedBadges]);

  // 应用过滤器
  useEffect(() => {
    filterBadges();
  }, [filterBadges]);

  // 处理勋章点击
  const handleBadgeClick = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  // 处理套系点击
  const handleSeriesClick = (seriesId: string) => {
    setSelectedSeries(seriesId);
    setFilters(prev => ({ ...prev, series: seriesId }));
    setActiveTab('badges');
  };

  // 分享勋章
  const handleShare = async () => {
    if (!selectedBadge) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `我获得了"${selectedBadge.title}"勋章！`,
          text: selectedBadge.description,
          url: window.location.href,
        });
        message.success('分享成功！');
      } else {
        await navigator.clipboard.writeText(
          `我在沫语成长守护体系获得了"${selectedBadge.title}"勋章！\n${selectedBadge.description}\n${window.location.href}`
        );
        message.success('分享内容已复制到剪贴板');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 重置过滤器
  const handleResetFilters = () => {
    setSearchText('');
    setFilters({
      series: 'all',
      category: 'all',
      rarity: 'all',
      level: 'all',
      status: 'all'
    });
  };

  // 导出成就
  const handleExportAchievements = () => {
    const data = {
      earnedBadges,
      stats,
      exportDate: new Date().toISOString(),
      totalPoints: stats.totalPoints
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `沫语成就记录_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('成就记录已导出');
  };

  // 渲染套系列表
  const renderSeriesList = () => (
    <div className="series-grid">
      <Row gutter={[24, 24]}>
        {groups.map(group => {
          const progress = seriesProgress[group.id] || { earnedCount: 0, totalCount: 0, progressPercentage: 0 };
          
          return (
            <Col xs={24} sm={12} lg={8} key={group.id}>
              <BadgeSeriesCard
                group={group}
                progress={progress}
                onClick={() => handleSeriesClick(group.id)}
                isLocked={group.isLocked}
                unlockRequirement={group.unlockRequirement}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );

  // 渲染勋章网格
  const renderBadgesGrid = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentBadges = filteredBadges.slice(startIndex, endIndex);
    const isEarned = (badge: BadgeType) => earnedBadges.some(b => b.id === badge.id);

    return (
      <div className="badges-grid-container">
        {/* 勋章统计 */}
        <div className="badges-stats">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                message={
                  <Space>
                    <TrophyOutlined />
                    <span>找到 {filteredBadges.length} 个勋章</span>
                    <Divider type="vertical" />
                    <span>已获得 {earnedBadges.length} 个</span>
                    <Divider type="vertical" />
                    <span>成就点: {stats.totalPoints}</span>
                    <Divider type="vertical" />
                    <span>排名: 第 {stats.ranking} 名</span>
                  </Space>
                }
                type="info"
                showIcon
              />
            </Col>
          </Row>
        </div>

        {/* 勋章列表 */}
        {currentBadges.length > 0 ? (
          <>
            <div className="badges-grid">
              <Row gutter={[16, 16]}>
                {currentBadges.map(badge => (
                  <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
                    <BadgeCard
                      badge={badge}
                      isEarned={isEarned(badge)}
                      onClick={() => handleBadgeClick(badge)}
                      showProgress={true}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            {/* 分页 */}
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredBadges.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
              />
            </div>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <p>没有找到符合条件的勋章</p>
                <Button type="link" onClick={handleResetFilters}>
                  清除筛选条件
                </Button>
              </div>
            }
          />
        )}
      </div>
    );
  };

  // 渲染过滤器
  const renderFilters = () => (
    <div className="filter-section">
      <Card className="filter-card">
        <Space size="large" wrap>
          <Search
            placeholder="搜索勋章名称或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />

          <Select
            placeholder="选择套系"
            value={filters.series}
            onChange={(value) => setFilters(prev => ({ ...prev, series: value }))}
            style={{ width: 120 }}
          >
            <Option value="all">所有套系</Option>
            {groups.map(group => (
              <Option key={group.id} value={group.id}>
                {group.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="选择分类"
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            style={{ width: 120 }}
          >
            <Option value="all">所有分类</Option>
            <Option value="learning">学习成就</Option>
            <Option value="culture">文化探索</Option>
            <Option value="social">社交互动</Option>
            <Option value="creative">创意制作</Option>
            <Option value="cognitive">认知发展</Option>
          </Select>

          <Select
            placeholder="选择稀有度"
            value={filters.rarity}
            onChange={(value) => setFilters(prev => ({ ...prev, rarity: value }))}
            style={{ width: 100 }}
          >
            <Option value="all">所有稀有度</Option>
            <Option value="common">普通</Option>
            <Option value="rare">稀有</Option>
            <Option value="epic">史诗</Option>
            <Option value="legendary">传说</Option>
          </Select>

          <Select
            placeholder="选择等级"
            value={filters.level}
            onChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
            style={{ width: 100 }}
          >
            <Option value="all">所有等级</Option>
            <Option value="bronze">青铜</Option>
            <Option value="silver">白银</Option>
            <Option value="gold">黄金</Option>
            <Option value="platinum">白金</Option>
          </Select>

          <Select
            placeholder="选择状态"
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            style={{ width: 100 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="earned">已获得</Option>
            <Option value="unearned">未获得</Option>
            <Option value="in_progress">进行中</Option>
          </Select>

          <Button 
            icon={<FilterOutlined />} 
            onClick={handleResetFilters}
          >
            重置筛选
          </Button>

          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleExportAchievements}
          >
            导出成就
          </Button>
        </Space>
      </Card>
    </div>
  );

  // 渲染统计卡片
  const renderStatsCards = () => (
    <div className="stats-cards">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="stat-card total-card">
            <div className="stat-content">
              <div className="stat-icon">
                <TrophyOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.earned}/{stats.total}</div>
                <div className="stat-label">获得勋章</div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={6}>
          <Card className="stat-card points-card">
            <div className="stat-content">
              <div className="stat-icon">
                <StarOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalPoints}</div>
                <div className="stat-label">成就点</div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={6}>
          <Card className="stat-card rank-card">
            <div className="stat-content">
              <div className="stat-icon">
                <CrownOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-value">#{stats.ranking}</div>
                <div className="stat-label">当前排名</div>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={12} sm={6}>
          <Card className="stat-card recent-card">
            <div className="stat-content">
              <div className="stat-icon">
                <CalendarOutlined />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.recentBadges.length}</div>
                <div className="stat-label">近期获得</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 渲染类别进度
  const renderCategoryProgress = () => {
    const categories = [
      { key: 'learning', name: '学习成就', icon: <BookOutlined />, color: '#1890ff' },
      { key: 'culture', name: '文化探索', icon: <CompassOutlined />, color: '#52c41a' },
      { key: 'social', name: '社交互动', icon: <TeamOutlined />, color: '#fa8c16' },
      { key: 'creative', name: '创意制作', icon: <BulbOutlined />, color: '#722ed1' },
      { key: 'cognitive', name: '认知发展', icon: <RocketOutlined />, color: '#13c2c2' },
    ];

    return (
      <div className="category-progress">
        <Card title="各领域进度" className="progress-card">
          {categories.map(category => {
            const earnedCount = stats.byCategory[category.key as keyof typeof stats.byCategory] || 0;
            const totalCount = Object.values(allBadges).filter(b => b.category === category.key).length;
            const percentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

            return (
              <div key={category.key} className="category-item">
                <div className="category-header">
                  <Space>
                    <span className="category-icon" style={{ color: category.color }}>
                      {category.icon}
                    </span>
                    <span className="category-name">{category.name}</span>
                  </Space>
                  <span className="category-count">
                    {earnedCount}/{totalCount}
                  </span>
                </div>
                <Progress 
                  percent={percentage} 
                  strokeColor={category.color}
                  trailColor="#f0f0f0"
                  size="small"
                />
              </div>
            );
          })}
        </Card>
      </div>
    );
  };

  // 渲染勋章详情弹窗
  const renderBadgeDetailModal = () => {
    if (!selectedBadge) return null;

    const isEarned = earnedBadges.some(b => b.id === selectedBadge.id);
    const seriesGroup = groups.find(g => g.badges.includes(selectedBadge.id));
    const nextBadge = selectedBadge.nextBadge ? allBadges.find(b => b.id === selectedBadge.nextBadge) : null;

    return (
      <Modal
        title={
          <Space>
            <img 
              src={selectedBadge.icon} 
              alt={selectedBadge.title}
              className="modal-badge-icon"
            />
            <span>{selectedBadge.title}</span>
            <Tag color={
              selectedBadge.rarity === 'legendary' ? 'gold' :
              selectedBadge.rarity === 'epic' ? 'purple' :
              selectedBadge.rarity === 'rare' ? 'blue' : 'default'
            }>
              {selectedBadge.rarity}
            </Tag>
            {selectedBadge.isHidden && (
              <Tag icon={<EyeInvisibleOutlined />} color="warning">
                隐藏勋章
              </Tag>
            )}
          </Space>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          isEarned && (
            <Button 
              key="share" 
              type="primary" 
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享成就
            </Button>
          ),
        ]}
        width={700}
        className="badge-detail-modal"
      >
        <div className="badge-detail-content">
          {/* 基本信息 */}
          <div className="basic-info">
            <Row gutter={24}>
              <Col span={24}>
                <p className="badge-description">{selectedBadge.description}</p>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} className="badge-meta">
              <Col span={8}>
                <div className="meta-item">
                  <div className="meta-label">套系</div>
                  <div className="meta-value">
                    <Tag color="blue">
                      {seriesGroup?.name || selectedBadge.series}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="meta-item">
                  <div className="meta-label">等级</div>
                  <div className="meta-value">
                    <Tag color={
                      selectedBadge.level === 'platinum' ? '#E5E4E2' :
                      selectedBadge.level === 'gold' ? '#FFD700' :
                      selectedBadge.level === 'silver' ? '#C0C0C0' : '#CD7F32'
                    }>
                      {selectedBadge.level}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="meta-item">
                  <div className="meta-label">成就点</div>
                  <div className="meta-value">
                    <span className="points-value">
                      <StarOutlined /> {selectedBadge.metadata.points}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* 解锁条件 */}
          <div className="unlock-conditions">
            <h4>
              <LockOutlined /> 解锁条件
              {isEarned && (
                <Tag icon={<CheckCircleOutlined />} color="success" style={{ marginLeft: 8 }}>
                  已解锁
                </Tag>
              )}
            </h4>
            
            {selectedBadge.unlockConditions.map((condition, index) => {
              const progress = isEarned ? 100 : condition.progress || 0;
              const isCompleted = progress >= 100;
              
              return (
                <div 
                  key={index} 
                  className={`condition-item ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="condition-content">
                    <span className="condition-icon">
                      {isCompleted ? '✅' : '⭕'}
                    </span>
                    <span className="condition-text">{condition.description}</span>
                  </div>
                  <div className="condition-progress">
                    <Progress 
                      percent={progress}
                      size="small"
                      strokeColor={isCompleted ? '#52c41a' : '#1890ff'}
                      showInfo={false}
                    />
                    <span className="progress-text">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 隐藏信息 */}
          {selectedBadge.isHidden && !isEarned && selectedBadge.hiddenDescription && (
            <Alert
              message="隐藏勋章"
              description={selectedBadge.hiddenDescription}
              type="warning"
              showIcon
              icon={<EyeInvisibleOutlined />}
            />
          )}

          {/* 套系信息 */}
          {seriesGroup && (
            <div className="series-info">
              <h4>
                <CompassOutlined /> 套系进度
              </h4>
              <div className="series-progress">
                <div className="series-header">
                  <span>{seriesGroup.name}</span>
                  <span>{seriesProgress[seriesGroup.id]?.earnedCount || 0}/{seriesGroup.badgeCount}</span>
                </div>
                <Progress 
                  percent={seriesProgress[seriesGroup.id]?.progressPercentage || 0}
                  strokeColor="#722ed1"
                />
                <p className="series-description">{seriesGroup.description}</p>
              </div>
            </div>
          )}

          {/* 下一级勋章 */}
          {nextBadge && (
            <div className="next-badge">
              <h4>
                <RocketOutlined /> 下一级勋章
              </h4>
              <div 
                className="next-badge-preview"
                onClick={() => {
                  setSelectedBadge(nextBadge);
                  setModalVisible(true);
                }}
              >
                <img src={nextBadge.icon} alt={nextBadge.title} />
                <div className="next-badge-info">
                  <div className="next-badge-title">{nextBadge.title}</div>
                  <div className="next-badge-desc">{nextBadge.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* 解锁信息 */}
          {selectedBadge.earnedDate && (
            <div className="earned-info">
              <h4>
                <CalendarOutlined /> 获得时间
              </h4>
              <p>{new Date(selectedBadge.earnedDate).toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="badges-page loading">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="badges-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <TrophyOutlined /> 勋章殿堂
          </h1>
          <p className="header-description">
            记录成长的每一个里程碑，解锁属于你的荣耀时刻
          </p>
        </div>
        
        {/* 快速操作 */}
        <div className="header-actions">
          <Space>
            <Tooltip title="刷新数据">
              <Button 
                icon={<SyncOutlined />} 
                onClick={loadBadgesData}
                loading={loading}
              />
            </Tooltip>
            <Tooltip title="勋章设置">
              <Button icon={<SettingOutlined />} />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      {renderStatsCards()}

      {/* 类别进度 */}
      {renderCategoryProgress()}

      {/* 过滤器 */}
      {renderFilters()}

      {/* 主要内容 */}
      <div className="main-content">
        <Card className="content-card">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            className="badges-tabs"
            items={[
              {
                key: 'series',
                label: (
                  <span>
                    <CompassOutlined />
                    勋章套系
                  </span>
                ),
                children: renderSeriesList()
              },
              {
                key: 'badges',
                label: (
                  <span>
                    <TrophyOutlined />
                    所有勋章
                  </span>
                ),
                children: renderBadgesGrid()
              },
              {
                key: 'recent',
                label: (
                  <span>
                    <CalendarOutlined />
                    近期获得
                  </span>
                ),
                children: (
                  <div className="recent-badges">
                    <Row gutter={[16, 16]}>
                      {stats.recentBadges.map(badge => (
                        <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
                          <BadgeCard
                            badge={badge}
                            isEarned={true}
                            onClick={() => handleBadgeClick(badge)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                )
              },
              {
                key: 'hidden',
                label: (
                  <span>
                    <EyeInvisibleOutlined />
                    隐藏勋章
                  </span>
                ),
                children: (
                  <div className="hidden-badges">
                    <Alert
                      message="探索提示"
                      description="隐藏勋章需要满足特定条件才能解锁，请继续探索系统的各项功能"
                      type="info"
                      showIcon
                    />
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                      {hiddenBadges.map(badge => {
                        const isEarned = earnedBadges.some(b => b.id === badge.id);
                        
                        return (
                          <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
                            <BadgeCard
                              badge={badge}
                              isEarned={isEarned}
                              onClick={() => handleBadgeClick(badge)}
                              showHiddenInfo={!isEarned}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                )
              }
            ]}
          />
        </Card>
      </div>

      {/* 勋章详情弹窗 */}
      {renderBadgeDetailModal()}
    </div>
  );
};

export default BadgesPage;

## 4. 勋章套系卡片组件

// /src/app/components/business/BadgeSeriesCard.tsx
import React from 'react';
import { Card, Progress, Tag, Button, Tooltip } from 'antd';
import { 
  LockOutlined, RightOutlined, TrophyOutlined,
  StarOutlined, FireOutlined, CrownOutlined 
} from '@ant-design/icons';
import { BadgeGroup } from '../../types/badge';
import './BadgeSeriesCard.less';

interface BadgeSeriesCardProps {
  group: BadgeGroup;
  progress: {
    earnedCount: number;
    totalCount: number;
    progressPercentage: number;
    currentLevel: string;
    nextLevel?: string;
  };
  onClick: () => void;
  isLocked?: boolean;
  unlockRequirement?: string;
}

const BadgeSeriesCard: React.FC<BadgeSeriesCardProps> = ({
  group,
  progress,
  onClick,
  isLocked = false,
  unlockRequirement
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#8C8C8C';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'platinum': return <CrownOutlined style={{ color: '#E5E4E2' }} />;
      case 'gold': return <StarOutlined style={{ color: '#FFD700' }} />;
      case 'silver': return <StarOutlined style={{ color: '#C0C0C0' }} />;
      case 'bronze': return <FireOutlined style={{ color: '#CD7F32' }} />;
      default: return <TrophyOutlined />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'learning': 'blue',
      'culture': 'green',
      'social': 'orange',
      'creative': 'purple',
      'cognitive': 'cyan',
      'emotional': 'pink'
    };
    return colors[category] || 'default';
  };

  return (
    <Card
      className={`series-card ${isLocked ? 'locked' : ''}`}
      hoverable={!isLocked}
      onClick={!isLocked ? onClick : undefined}
      cover={
        <div className="series-cover">
          <div className="series-icon">{group.icon}</div>
          {isLocked && (
            <div className="lock-overlay">
              <LockOutlined className="lock-icon" />
            </div>
          )}
        </div>
      }
    >
      <div className="series-content">
        <div className="series-header">
          <h3 className="series-name">{group.name}</h3>
          <Tag color={getCategoryColor(group.category)}>
            {group.category}
          </Tag>
        </div>
        
        <p className="series-description">{group.description}</p>
        
        {/* 进度信息 */}
        <div className="series-progress">
          <div className="progress-header">
            <span className="progress-label">收集进度</span>
            <span className="progress-count">
              {progress.earnedCount}/{progress.totalCount}
            </span>
          </div>
          <Progress 
            percent={progress.progressPercentage}
            strokeColor={{
              '0%': '#ff7875',
              '100%': '#ff4d4f',
            }}
            size="small"
          />
          
          {/* 等级显示 */}
          <div className="level-info">
            <div className="current-level">
              {getLevelIcon(progress.currentLevel)}
              <span className="level-text" style={{ color: getLevelColor(progress.currentLevel) }}>
                {progress.currentLevel}
              </span>
            </div>
            {progress.nextLevel && (
              <>
                <RightOutlined className="level-arrow" />
                <div className="next-level">
                  {getLevelIcon(progress.nextLevel)}
                  <span className="level-text" style={{ color: getLevelColor(progress.nextLevel) }}>
                    {progress.nextLevel}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 解锁要求（如果锁定） */}
        {isLocked && unlockRequirement && (
          <div className="unlock-requirement">
            <LockOutlined />
            <span>{unlockRequirement}</span>
          </div>
        )}
        
        {/* 查看按钮 */}
        {!isLocked && (
          <div className="action-section">
            <Button 
              type="link" 
              className="view-button"
              onClick={onClick}
            >
              查看详情 <RightOutlined />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BadgeSeriesCard;

## 5. 完整的勋章卡片组件

// /src/app/components/business/BadgeCard.tsx
import React from 'react';
import { Card, Tooltip, Progress, Badge as AntBadge, Tag } from 'antd';
import { 
  CrownOutlined, LockOutlined, StarOutlined, 
  EyeInvisibleOutlined, CheckCircleOutlined,
  RocketOutlined, FireOutlined 
} from '@ant-design/icons';
import { Badge as BadgeType } from '../../types/badge';
import './BadgeCard.less';

interface BadgeCardProps {
  badge: BadgeType;
  isEarned: boolean;
  onClick: () => void;
  showProgress?: boolean;
  showHiddenInfo?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const BadgeCard: React.FC<BadgeCardProps> = ({ 
  badge, 
  isEarned, 
  onClick,
  showProgress = false,
  showHiddenInfo = false,
  size = 'medium'
}) => {
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <CrownOutlined className="rarity-icon legendary" />;
      case 'epic':
        return <StarOutlined className="rarity-icon epic" />;
      case 'rare':
        return <StarOutlined className="rarity-icon rare" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#8C8C8C';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#ff6bcb';
      case 'rare': return '#1890ff';
      default: return '#d9d9d9';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'badge-card-small';
      case 'large': return 'badge-card-large';
      default: return '';
    }
  };

  return (
    <Tooltip 
      title={
        <div className="badge-tooltip">
          <div className="tooltip-title">{badge.title}</div>
          <div className="tooltip-description">{badge.description}</div>
          {badge.isHidden && !isEarned && (
            <div className="tooltip-hidden">
              <EyeInvisibleOutlined /> 隐藏勋章
            </div>
          )}
        </div>
      }
      placement="top"
    >
      <Card
        className={`badge-card ${getSizeClass()} ${isEarned ? 'earned' : 'unearned'} ${badge.isHidden ? 'hidden' : ''}`}
        hoverable={!badge.isHidden || isEarned}
        onClick={(!badge.isHidden || isEarned) ? onClick : undefined}
        cover={
          <div className="badge-cover">
            <div className="badge-image-container">
              {/* 勋章辉光效果 */}
              {isEarned && badge.metadata.glowColor && (
                <div 
                  className="badge-glow"
                  style={{ 
                    background: `radial-gradient(circle, ${badge.metadata.glowColor}40 0%, transparent 70%)`,
                    animation: 'glow 2s ease-in-out infinite alternate'
                  }}
                />
              )}
              
              {/* 勋章图标 */}
              <img 
                src={badge.icon}
                alt={badge.title}
                className={`badge-image ${!isEarned ? 'locked' : ''} ${badge.metadata.sparkleEffect ? 'sparkle' : ''}`}
              />
              
              {/* 锁定状态 */}
              {!isEarned && (
                <div className="lock-overlay">
                  <LockOutlined className="lock-icon" />
                  {badge.isHidden && showHiddenInfo && (
                    <div className="hidden-indicator">
                      <EyeInvisibleOutlined />
                    </div>
                  )}
                </div>
              )}
              
              {/* 已获得标记 */}
              {isEarned && (
                <div className="earned-indicator">
                  <CheckCircleOutlined />
                </div>
              )}
              
              {/* 稀有度标记 */}
              {getRarityIcon(badge.rarity)}
            </div>
            
            {/* 进度条 */}
            {showProgress && badge.progress !== undefined && badge.progress < 100 && (
              <div className="progress-overlay">
                <Progress 
                  percent={badge.progress}
                  size="small"
                  showInfo={false}
                  strokeColor={getRarityColor(badge.rarity)}
                />
              </div>
            )}
          </div>
        }
      >
        <div className="badge-content">
          <div className="badge-header">
            <h3 className="badge-title">{badge.title}</h3>
            <div className="badge-meta">
              {/* 等级标记 */}
              <Tag 
                className="level-tag"
                style={{ 
                  backgroundColor: getLevelColor(badge.level),
                  color: badge.level === 'platinum' || badge.level === 'gold' ? '#000' : '#fff',
                  border: 'none'
                }}
              >
                {badge.level.charAt(0).toUpperCase()}
              </Tag>
              
              {/* 稀有度标记 */}
              {badge.rarity !== 'common' && (
                <AntBadge 
                  color={getRarityColor(badge.rarity)}
                  text={badge.rarity}
                  className="rarity-badge"
                />
              )}
            </div>
          </div>
          
          {/* 勋章描述 */}
          <p className="badge-description">
            {badge.description.length > 30 
              ? badge.description.substring(0, 30) + '...' 
              : badge.description}
          </p>
          
          {/* 成就点数 */}
          <div className="badge-points">
            <StarOutlined className="points-icon" />
            <span className="points-value">{badge.metadata.points}</span>
          </div>
          
          {/* 进度信息 */}
          {showProgress && badge.progress !== undefined && badge.progress < 100 && (
            <div className="progress-info">
              <div className="progress-text">
                解锁进度: {badge.progress.toFixed(0)}%
              </div>
            </div>
          )}
          
          {/* 获得时间 */}
          {isEarned && badge.earnedDate && (
            <div className="earned-info">
              <small>
                {new Date(badge.earnedDate).toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric'
                })}
              </small>
            </div>
          )}
          
          {/* 隐藏勋章提示 */}
          {badge.isHidden && !isEarned && showHiddenInfo && (
            <div className="hidden-hint">
              <EyeInvisibleOutlined /> 隐藏成就
            </div>
          )}
        </div>
      </Card>
    </Tooltip>
  );
};

export default BadgeCard;

## 6. 完整样式文件

// /src/app/components/pages/BadgesPage.less
@import '~antd/lib/style/themes/default.less';

.badges-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  &.loading {
    background: #f0f2f5;
  }
  
  // 页面头部
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 32px 40px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
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
          color: #ffd700;
        }
      }
      
      .header-description {
        margin: 0;
        font-size: 16px;
        color: #666;
        max-width: 600px;
      }
    }
    
    .header-actions {
      .ant-btn {
        border-radius: 12px;
        height: 48px;
        width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  
  // 统计卡片
  .stats-cards {
    margin-bottom: 24px;
    
    .stat-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
      
      &.total-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      &.points-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }
      
      &.rank-card {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      
      &.recent-card {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
      }
      
      .stat-content {
        display: flex;
        align-items: center;
        gap: 20px;
        
        .stat-icon {
          .anticon {
            font-size: 36px;
            opacity: 0.8;
          }
        }
        
        .stat-info {
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            line-height: 1;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 4px;
          }
        }
      }
    }
  }
  
  // 类别进度
  .category-progress {
    margin-bottom: 24px;
    
    .progress-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-head {
        border-bottom: 2px solid #f0f0f0;
        padding: 20px 24px;
        
        .ant-card-head-title {
          font-size: 18px;
          font-weight: 500;
        }
      }
      
      .ant-card-body {
        padding: 24px;
      }
      
      .category-item {
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .category-icon {
            .anticon {
              font-size: 18px;
              margin-right: 8px;
            }
          }
          
          .category-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
          
          .category-count {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  // 过滤器
  .filter-section {
    margin-bottom: 24px;
    
    .filter-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-body {
        padding: 20px;
      }
    }
  }
  
  // 主要内容
  .main-content {
    .content-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      
      .ant-card-body {
        padding: 0;
      }
    }
  }
  
  // 标签页
  .badges-tabs {
    .ant-tabs-nav {
      margin: 0;
      padding: 0 24px;
      background: white;
      border-radius: 16px 16px 0 0;
      
      .ant-tabs-tab {
        padding: 20px 24px;
        font-size: 16px;
        font-weight: 500;
        
        .anticon {
          margin-right: 8px;
          font-size: 18px;
        }
        
        &:hover {
          color: #1890ff;
        }
        
        &.ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: #1890ff;
            font-weight: 600;
          }
        }
      }
      
      .ant-tabs-ink-bar {
        background: #1890ff;
        height: 3px;
      }
    }
    
    .ant-tabs-content-holder {
      padding: 24px;
    }
  }
  
  // 套系列表
  .series-grid {
    .series-card {
      border: 2px solid #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
      
      &.locked {
        opacity: 0.6;
        cursor: not-allowed;
        
        &:hover {
          border-color: #f0f0f0;
          transform: none;
          box-shadow: none;
        }
      }
      
      &:hover:not(.locked) {
        border-color: #1890ff;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
      }
      
      .series-cover {
        position: relative;
        height: 180px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .series-icon {
          font-size: 64px;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          
          .lock-icon {
            font-size: 48px;
            color: white;
          }
        }
      }
      
      .series-content {
        padding: 20px;
        
        .series-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .series-name {
            margin: 0;
            font-size: 18px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .series-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
          height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .series-progress {
          margin-bottom: 16px;
          
          .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .progress-label {
              font-size: 14px;
              color: #666;
            }
            
            .progress-count {
              font-size: 14px;
              font-weight: 500;
              color: #1890ff;
            }
          }
          
          .level-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
            
            .current-level, .next-level {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .anticon {
                font-size: 16px;
              }
              
              .level-text {
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
              }
            }
            
            .level-arrow {
              color: #999;
              font-size: 12px;
            }
          }
        }
        
        .unlock-requirement {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #fa8c16;
          padding: 8px 12px;
          background: #fff7e6;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        
        .action-section {
          text-align: right;
          
          .view-button {
            padding: 0;
            height: auto;
            
            &:hover {
              color: #1890ff;
            }
          }
        }
      }
    }
  }
  
  // 勋章网格
  .badges-grid-container {
    .badges-stats {
      margin-bottom: 24px;
      
      .ant-alert {
        border-radius: 12px;
        border: none;
        background: #e6f7ff;
        
        .ant-alert-message {
          font-size: 14px;
          color: #333;
        }
      }
    }
    
    .badges-grid {
      margin-bottom: 24px;
      
      .badge-card {
        border: 2px solid #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        height: 100%;
        
        &.earned {
          border-color: #52c41a;
          
          &:hover {
            border-color: #73d13d;
            box-shadow: 0 8px 24px rgba(82, 196, 26, 0.15);
          }
        }
        
        &.unearned {
          opacity: 0.7;
          
          &:hover {
            opacity: 0.9;
            border-color: #d9d9d9;
          }
        }
        
        &.hidden {
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
            z-index: 1;
            border-radius: 12px;
          }
          
          &:hover {
            &::before {
              background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
            }
          }
        }
        
        .ant-card-cover {
          padding: 24px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          text-align: center;
          position: relative;
          
          .badge-image-container {
            position: relative;
            display: inline-block;
            
            .badge-glow {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 120%;
              height: 120%;
              border-radius: 50%;
              z-index: 1;
            }
            
            .badge-image {
              width: 80px;
              height: 80px;
              transition: all 0.3s ease;
              position: relative;
              z-index: 2;
              
              &.locked {
                filter: grayscale(1);
                opacity: 0.6;
              }
              
              &.sparkle {
                animation: sparkle 2s ease-in-out infinite;
              }
              
              @keyframes sparkle {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
              }
            }
            
            .lock-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 50%;
              z-index: 3;
              
              .lock-icon {
                font-size: 24px;
                color: white;
              }
              
              .hidden-indicator {
                position: absolute;
                bottom: -8px;
                right: -8px;
                background: #fa8c16;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
              }
            }
            
            .earned-indicator {
              position: absolute;
              top: -8px;
              right: -8px;
              background: #52c41a;
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              z-index: 4;
              animation: bounce 2s ease-in-out infinite;
              
              @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            }
            
            .rarity-icon {
              position: absolute;
              top: -12px;
              left: -12px;
              font-size: 24px;
              z-index: 4;
              
              &.legendary {
                color: #ffd700;
                animation: spin 4s linear infinite;
                
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              }
              
              &.epic {
                color: #ff6bcb;
                animation: pulse 2s ease-in-out infinite;
              }
              
              &.rare {
                color: #1890ff;
                animation: pulse 3s ease-in-out infinite;
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
            }
          }
          
          .progress-overlay {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
            border-radius: 12px;
          }
        }
        
        .ant-card-body {
          padding: 16px;
          
          .badge-header {
            margin-bottom: 12px;
            
            .badge-title {
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 500;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .badge-meta {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .level-tag {
                font-size: 10px;
                font-weight: bold;
                padding: 0 6px;
                height: 20px;
                line-height: 20px;
                min-width: 20px;
                text-align: center;
              }
              
              .rarity-badge {
                font-size: 10px;
                
                .ant-badge-status-text {
                  font-size: 10px;
                }
              }
            }
          }
          
          .badge-description {
            font-size: 12px;
            color: #666;
            margin-bottom: 12px;
            line-height: 1.4;
            height: 34px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .badge-points {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 8px;
            
            .points-icon {
              color: #ffd700;
              font-size: 14px;
            }
            
            .points-value {
              font-size: 14px;
              font-weight: bold;
              color: #fa8c16;
            }
          }
          
          .progress-info {
            .progress-text {
              font-size: 11px;
              color: #999;
              text-align: center;
            }
          }
          
          .earned-info {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #f0f0f0;
            
            small {
              font-size: 10px;
              color: #999;
            }
          }
          
          .hidden-hint {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: #fa8c16;
            margin-top: 8px;
          }
        }
        
        // 小尺寸
        &.badge-card-small {
          .ant-card-cover {
            padding: 16px;
            
            .badge-image-container {
              .badge-image {
                width: 60px;
                height: 60px;
              }
              
              .earned-indicator {
                width: 24px;
                height: 24px;
                font-size: 12px;
                top: -4px;
                right: -4px;
              }
            }
          }
          
          .ant-card-body {
            padding: 12px;
            
            .badge-title {
              font-size: 14px;
            }
          }
        }
        
        // 大尺寸
        &.badge-card-large {
          .ant-card-cover {
            padding: 32px;
            
            .badge-image-container {
              .badge-image {
                width: 100px;
                height: 100px;
              }
              
              .earned-indicator {
                width: 40px;
                height: 40px;
                font-size: 20px;
                top: -12px;
                right: -12px;
              }
            }
          }
          
          .ant-card-body {
            padding: 20px;
            
            .badge-title {
              font-size: 18px;
            }
          }
        }
      }
    }
    
    .pagination-container {
      display: flex;
      justify-content: center;
      padding: 24px 0;
      
      .ant-pagination {
        .ant-pagination-item {
          border-radius: 8px;
          
          a {
            color: #666;
          }
          
          &:hover {
            border-color: #1890ff;
            
            a {
              color: #1890ff;
            }
          }
          
          &.ant-pagination-item-active {
            background: #1890ff;
            border-color: #1890ff;
            
            a {
              color: white;
            }
          }
        }
        
        .ant-pagination-prev,
        .ant-pagination-next {
          .ant-pagination-item-link {
            border-radius: 8px;
          }
        }
      }
    }
  }
  
  // 近期勋章
  .recent-badges {
    .badge-card {
      border: 2px solid #52c41a;
    }
  }
  
  // 隐藏勋章
  .hidden-badges {
    .ant-alert {
      border-radius: 12px;
      margin-bottom: 24px;
    }
  }
  
  // 勋章详情弹窗
  .badge-detail-modal {
    .ant-modal-header {
      border-bottom: none;
      padding: 24px 24px 0;
      
      .ant-modal-title {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .modal-badge-icon {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
      }
    }
    
    .ant-modal-body {
      padding: 24px;
    }
    
    .badge-detail-content {
      .basic-info {
        margin-bottom: 24px;
        
        .badge-description {
          font-size: 16px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .badge-meta {
          .meta-item {
            .meta-label {
              font-size: 12px;
              color: #999;
              margin-bottom: 4px;
            }
            
            .meta-value {
              font-size: 14px;
              color: #333;
              
              .points-value {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #fa8c16;
                font-weight: 500;
              }
            }
          }
        }
      }
      
      .unlock-conditions {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 16px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .condition-item {
          padding: 12px 16px;
          border-radius: 8px;
          background: #fafafa;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          
          &.completed {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            
            .condition-content {
              .condition-icon {
                color: #52c41a;
              }
            }
          }
          
          .condition-content {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
            
            .condition-icon {
              font-size: 16px;
              width: 24px;
              text-align: center;
            }
            
            .condition-text {
              flex: 1;
              font-size: 14px;
              color: #333;
            }
          }
          
          .condition-progress {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .ant-progress {
              flex: 1;
            }
            
            .progress-text {
              font-size: 12px;
              color: #999;
              min-width: 40px;
            }
          }
        }
      }
      
      .series-info {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 12px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .series-progress {
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          
          .series-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #333;
          }
          
          .series-description {
            font-size: 14px;
            color: #666;
            margin-top: 12px;
            margin-bottom: 0;
          }
        }
      }
      
      .next-badge {
        margin-bottom: 24px;
        
        h4 {
          margin-bottom: 12px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .next-badge-preview {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f0f8ff;
          border-radius: 8px;
          border: 1px solid #bae7ff;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #e6f7ff;
            border-color: #91d5ff;
            transform: translateX(4px);
          }
          
          img {
            width: 48px;
            height: 48px;
            object-fit: contain;
          }
          
          .next-badge-info {
            .next-badge-title {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }
            
            .next-badge-desc {
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
      
      .earned-info {
        h4 {
          margin-bottom: 8px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .badges-page {
    padding: 12px;
    
    .page-header {
      padding: 20px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      h1 {
        font-size: 24px;
        
        .anticon {
          font-size: 28px;
        }
      }
      
      .header-actions {
        align-self: flex-end;
      }
    }
    
    .stats-cards {
      .stat-card {
        .stat-content {
          gap: 12px;
          
          .stat-icon {
            .anticon {
              font-size: 24px;
            }
          }
          
          .stat-info {
            .stat-value {
              font-size: 24px;
            }
          }
        }
      }
    }
    
    .filter-section {
      .filter-card {
        .ant-card-body {
          padding: 16px;
        }
        
        .ant-space {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          
          > * {
            width: 100%;
          }
        }
      }
    }
    
    .badges-tabs {
      .ant-tabs-nav {
        padding: 0 16px;
        
        .ant-tabs-tab {
          padding: 12px 16px;
          font-size: 14px;
        }
      }
      
      .ant-tabs-content-holder {
        padding: 16px;
      }
    }
    
    .badge-detail-modal {
      width: 95% !important;
      
      .ant-modal-header {
        padding: 16px 16px 0;
      }
      
      .ant-modal-body {
        padding: 16px;
      }
      
      .badge-detail-content {
        .basic-info {
          .badge-meta {
            .ant-row {
              flex-direction: column;
              gap: 12px;
              
              .ant-col {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}

## 7. 勋章服务更新

// /src/services/badge/badgeService.ts
import { Badge, BadgeSeries, BadgeCategory, UnlockCondition, SeriesProgress } from '../../types/badge';
import { storageService } from '../storage/storageService';
import { userService } from '../user/userService';
import { allBadges, badgeGroups } from '../../data/badgeMockData';

class BadgeService {
  private readonly BADGE_STORAGE_KEY = 'user_badges';
  private readonly BADGE_CONFIG_KEY = 'badge_config';
  private readonly SERIES_PROGRESS_KEY = 'series_progress';

  // 获取所有勋章
  async getAllBadges(): Promise<Badge[]> {
    return allBadges;
  }

  // 获取用户已获得的勋章
  async getUserBadges(): Promise<Badge[]> {
    const userId = userService.getCurrentUserId();
    if (!userId) return [];
    
    // 模拟数据：用户已获得的勋章
    const earnedIds = ['growth_bronze', 'growth_silver', 'creative_bronze', 'dynasty_silk_road', 'culture_novice', 'learning_streak'];
    return allBadges.filter(badge => earnedIds.includes(badge.id)).map(badge => ({
      ...badge,
      earnedDate: new Date().toISOString(),
      progress: 100
    }));
  }

  // 获取勋章套系进度
  async getSeriesProgress(): Promise<Record<string, SeriesProgress>> {
    const userBadges = await this.getUserBadges();
    const progress: Record<string, SeriesProgress> = {};
    
    badgeGroups.forEach(group => {
      const badgesInSeries = allBadges.filter(b => group.badges.includes(b.id));
      const earnedBadges = userBadges.filter(b => group.badges.includes(b.id));
      const earnedCount = earnedBadges.length;
      const totalCount = badgesInSeries.length;
      const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;
      
      // 确定当前等级
      let currentLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legend' = 'bronze';
      if (progressPercentage >= 100) currentLevel = 'legend';
      else if (progressPercentage >= 80) currentLevel = 'diamond';
      else if (progressPercentage >= 60) currentLevel = 'platinum';
      else if (progressPercentage >= 40) currentLevel = 'gold';
      else if (progressPercentage >= 20) currentLevel = 'silver';
      
      // 生成里程碑
      const milestones = [
        {
          level: 'bronze' as const,
          requiredBadges: 1,
          reward: { type: 'points', value: 100, description: '100成就点' },
          unlocked: earnedCount >= 1
        },
        {
          level: 'silver' as const,
          requiredBadges: Math.ceil(totalCount * 0.33),
          reward: { type: 'title', value: `${group.name}爱好者`, description: '专属称号' },
          unlocked: earnedCount >= Math.ceil(totalCount * 0.33)
        },
        {
          level: 'gold' as const,
          requiredBadges: Math.ceil(totalCount * 0.66),
          reward: { type: 'badge', value: `${group.id}_master`, description: '大师勋章' },
          unlocked: earnedCount >= Math.ceil(totalCount * 0.66)
        },
        {
          level: 'platinum' as const,
          requiredBadges: totalCount,
          reward: { type: 'avatar', value: `${group.id}_avatar`, description: '专属头像' },
          unlocked: earnedCount >= totalCount
        }
      ];
      
      progress[group.id] = {
        seriesId: group.id,
        totalBadges: totalCount,
        earnedBadges: earnedCount,
        currentLevel,
        nextLevel: this.getNextLevel(currentLevel),
        progressPercentage,
        completionReward: {
          type: 'badge',
          value: `${group.id}_complete`,
          description: '套系完成勋章'
        },
        milestones
      };
    });
    
    return progress;
  }

  // 检查并解锁新勋章
  async checkAndUnlockBadges(): Promise<Badge[]> {
    const userId = userService.getCurrentUserId();
    if (!userId) return [];
    
    const userBadges = await this.getUserBadges();
    const allBadges = await this.getAllBadges();
    const userStats = await this.getUserStatistics(userId);
    
    const newlyUnlocked: Badge[] = [];
    
    // 检查每个未获得的勋章
    for (const badge of allBadges) {
      if (userBadges.some(b => b.id === badge.id)) continue;
      
      // 检查前置勋章
      if (badge.prerequisiteBadge && !userBadges.some(b => b.id === badge.prerequisiteBadge)) {
        continue;
      }
      
      // 检查解锁条件
      const isUnlocked = badge.unlockConditions.every(condition => {
        return this.evaluateCondition(condition, userStats);
      });
      
      if (isUnlocked) {
        const unlockedBadge: Badge = {
          ...badge,
          earnedDate: new Date().toISOString(),
          progress: 100
        };
        
        newlyUnlocked.push(unlockedBadge);
        
        // 保存到用户勋章列表
        await this.awardBadgeToUser(userId, unlockedBadge);
        
        // 发送通知
        this.sendBadgeUnlockNotification(unlockedBadge);
        
        // 检查是否解锁了套系奖励
        await this.checkSeriesCompletion(badge.series, userId);
      } else {
        // 计算进度
        const progress = this.calculateBadgeProgress(badge, userStats);
        if (progress > 0) {
          badge.progress = progress;
        }
      }
    }
    
    return newlyUnlocked;
  }

  // 计算勋章进度
  private calculateBadgeProgress(badge: Badge, stats: any): number {
    let totalProgress = 0;
    let conditionCount = 0;
    
    for (const condition of badge.unlockConditions) {
      const progress = this.calculateConditionProgress(condition, stats);
      totalProgress += progress;
      conditionCount++;
    }
    
    return conditionCount > 0 ? totalProgress / conditionCount : 0;
  }

  // 评估解锁条件
  private evaluateCondition(condition: UnlockCondition, stats: any): boolean {
    const currentValue = this.getStatValue(condition.type, stats);
    return currentValue >= condition.value;
  }

  // 计算条件进度
  private calculateConditionProgress(condition: UnlockCondition, stats: any): number {
    const currentValue = this.getStatValue(condition.type, stats);
    return Math.min((currentValue / condition.value) * 100, 100);
  }

  // 获取统计值
  private getStatValue(statType: string, stats: any): number {
    const statMap: Record<string, string> = {
      'total_hours': 'totalLearningHours',
      'consecutive_days': 'consecutiveLearningDays',
      'completed_courses': 'completedCourses',
      'cultural_sites_visited': 'culturalSitesVisited',
      'interactions': 'socialInteractions',
      'creations': 'creativeWorks',
      'score': 'averageScore',
      'perfect_score': 'perfectScores',
      'streak': 'currentStreak'
    };
    
    const statKey = statMap[statType];
    return statKey ? stats[statKey] || 0 : 0;
  }

  // 获取用户统计数据
  private async getUserStatistics(userId: string): Promise<any> {
    // 这里应该调用真实的API获取用户统计数据
    return {
      totalLearningHours: 156,
      consecutiveLearningDays: 12,
      completedCourses: 24,
      culturalSitesVisited: 5,
      socialInteractions: 18,
      creativeWorks: 3,
      averageScore: 88,
      perfectScores: 2,
      currentStreak: 7
    };
  }

  // 颁发勋章给用户
  private async awardBadgeToUser(userId: string, badge: Badge): Promise<boolean> {
    try {
      // 保存到本地存储
      const currentBadges = await this.getUserBadges();
      const updatedBadges = [...currentBadges, badge];
      await storageService.set(this.BADGE_STORAGE_KEY, updatedBadges);
      
      // 这里应该调用API保存到服务器
      // await fetch(`/api/users/${userId}/badges/${badge.id}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ earnedDate: badge.earnedDate })
      // });
      
      return true;
    } catch (error) {
      console.error('颁发勋章失败:', error);
      return false;
    }
  }

  // 发送解锁通知
  private sendBadgeUnlockNotification(badge: Badge): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 恭喜获得新勋章！', {
        body: `您获得了"${badge.title}"勋章！\n${badge.description}`,
        icon: badge.icon,
        tag: badge.id
      });
    }
    
    // 触发自定义事件
    const event = new CustomEvent('badge-unlocked', {
      detail: { badge }
    });
    window.dispatchEvent(event);
  }

  // 检查套系完成情况
  private async checkSeriesCompletion(seriesId: BadgeSeries, userId: string): Promise<void> {
    const seriesBadges = allBadges.filter(b => b.series === seriesId);
    const userBadges = await this.getUserBadges();
    const earnedCount = userBadges.filter(b => b.series === seriesId).length;
    
    // 检查是否完成了整个套系
    if (earnedCount === seriesBadges.length) {
      // 解锁套系完成奖励
      const seriesGroup = badgeGroups.find(g => g.id === seriesId);
      if (seriesGroup?.completionBadge) {
        const completionBadge = allBadges.find(b => b.id === seriesGroup.completionBadge);
        if (completionBadge) {
          await this.awardBadgeToUser(userId, {
            ...completionBadge,
            earnedDate: new Date().toISOString(),
            progress: 100
          });
        }
      }
    }
  }

  // 获取下一等级
  private getNextLevel(currentLevel: string): string | undefined {
    const levels = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  }

  // 获取勋章统计数据
  async getBadgeStats(): Promise<any> {
    const userBadges = await this.getUserBadges();
    const allBadges = await this.getAllBadges();
    
    // 按套系统计
    const bySeries: Record<string, number> = {};
    badgeGroups.forEach(group => {
      const earnedInSeries = userBadges.filter(b => group.badges.includes(b.id));
      bySeries[group.id] = earnedInSeries.length;
    });
    
    // 按分类统计
    const byCategory: Record<string, number> = {};
    userBadges.forEach(badge => {
      byCategory[badge.category] = (byCategory[badge.category] || 0) + 1;
    });
    
    // 按稀有度统计
    const byRarity: Record<string, number> = {};
    userBadges.forEach(badge => {
      byRarity[badge.rarity] = (byRarity[badge.rarity] || 0) + 1;
    });
    
    // 按等级统计
    const byLevel: Record<string, number> = {};
    userBadges.forEach(badge => {
      byLevel[badge.level] = (byLevel[badge.level] || 0) + 1;
    });
    
    // 计算总成就点
    const totalPoints = userBadges.reduce((sum, badge) => sum + badge.metadata.points, 0);
    
    return {
      total: allBadges.length,
      earned: userBadges.length,
      bySeries,
      byCategory,
      byRarity,
      byLevel,
      totalPoints,
      ranking: 156, // 模拟排名
      recentBadges: userBadges.slice(0, 3)
    };
  }

  // 搜索勋章
  async searchBadges(keyword: string, filters?: any): Promise<Badge[]> {
    let filtered = allBadges;
    
    // 关键词搜索
    if (keyword) {
      filtered = filtered.filter(badge =>
        badge.title.toLowerCase().includes(keyword.toLowerCase()) ||
        badge.description.toLowerCase().includes(keyword.toLowerCase()) ||
        badge.series.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // 套系过滤
    if (filters?.series && filters.series !== 'all') {
      filtered = filtered.filter(badge => badge.series === filters.series);
    }
    
    // 分类过滤
    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter(badge => badge.category === filters.category);
    }
    
    // 稀有度过滤
    if (filters?.rarity && filters.rarity !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === filters.rarity);
    }
    
    // 等级过滤
    if (filters?.level && filters.level !== 'all') {
      filtered = filtered.filter(badge => badge.level === filters.level);
    }
    
    // 状态过滤
    if (filters?.status && filters.status !== 'all') {
      const userBadges = await this.getUserBadges();
      const earnedIds = userBadges.map(b => b.id);
      
      if (filters.status === 'earned') {
        filtered = filtered.filter(badge => earnedIds.includes(badge.id));
      } else if (filters.status === 'unearned') {
        filtered = filtered.filter(badge => !earnedIds.includes(badge.id));
      }
    }
    
    return filtered;
  }

  // 导出用户成就
  async exportUserAchievements(): Promise<string> {
    const userBadges = await this.getUserBadges();
    const stats = await this.getBadgeStats();
    const seriesProgress = await this.getSeriesProgress();
    
    const exportData = {
      userInfo: {
        id: userService.getCurrentUserId(),
        exportDate: new Date().toISOString()
      },
      badges: userBadges,
      stats,
      seriesProgress,
      summary: {
        totalBadges: stats.total,
        earnedBadges: stats.earned,
        totalPoints: stats.totalPoints,
        completionRate: (stats.earned / stats.total * 100).toFixed(1) + '%'
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

export const badgeService = new BadgeService();

## 8. 路由配置

// /src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../app/components/layout/Layout';
import BadgesPage from '../app/components/pages/BadgesPage';
import CultureDetailPage from '../app/components/pages/CultureDetailPage';
import ProfilePage from '../app/components/pages/ProfilePage';
import SeriesDetailPage from '../app/components/pages/SeriesDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>首页</div>} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="badges/series/:seriesId" element={<SeriesDetailPage />} />
        <Route path="culture" element={<div>文化探索</div>} />
        <Route path="culture/:id" element={<CultureDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<div>404 页面未找到</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

## 9. 套系详情页面

// /src/app/components/pages/SeriesDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Progress, Timeline, Tag, Space, Alert, Empty } from 'antd';
import { ArrowLeftOutlined, TrophyOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';
import BadgeCard from '../business/BadgeCard';
import { badgeService } from '../../services/badge/badgeService';
import { badgeGroups } from '../../data/badgeMockData';
import { allBadges } from '../../data/badgeMockData';
import './SeriesDetailPage.less';

const SeriesDetailPage: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seriesBadges, setSeriesBadges] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);
  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [seriesProgress, setSeriesProgress] = useState<any>(null);

  useEffect(() => {
    if (seriesId) {
      loadSeriesData(seriesId);
    }
  }, [seriesId]);

  const loadSeriesData = async (id: string) => {
    setLoading(true);
    try {
      // 获取套系信息
      const group = badgeGroups.find(g => g.id === id);
      if (!group) {
        navigate('/badges');
        return;
      }
      
      // 获取套系勋章
      const badges = allBadges.filter(b => group.badges.includes(b.id));
      
      // 获取用户已获得勋章
      const userBadges = await badgeService.getUserBadges();
      const earned = badges.filter(b => userBadges.some(ub => ub.id === b.id));
      
      // 获取套系进度
      const progressData = await badgeService.getSeriesProgress();
      const progress = progressData[id];
      
      setSeriesInfo(group);
      setSeriesBadges(badges);
      setEarnedBadges(earned);
      setSeriesProgress(progress);
    } catch (error) {
      console.error('加载套系数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#8C8C8C';
    }
  };

  const renderMilestones = () => {
    if (!seriesProgress?.milestones) return null;
    
    return (
      <div className="milestones-section">
        <h3>里程碑奖励</h3>
        <Timeline>
          {seriesProgress.milestones.map((milestone: any, index: number) => (
            <Timeline.Item
              key={index}
              color={milestone.unlocked ? 'green' : 'gray'}
              dot={
                milestone.unlocked ? <TrophyOutlined /> : <StarOutlined />
              }
            >
              <div className="milestone-item">
                <div className="milestone-header">
                  <span className="milestone-title">{milestone.level}级达成</span>
                  <Tag color={milestone.unlocked ? 'success' : 'default'}>
                    {milestone.requiredBadges}个勋章
                  </Tag>
                </div>
                <p className="milestone-reward">
                  奖励: {milestone.reward.description}
                </p>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  };

  if (loading) {
    return <div className="loading-spinner">加载中...</div>;
  }

  if (!seriesInfo) {
    return <Empty description="套系不存在" />;
  }

  return (
    <div className="series-detail-page">
      {/* 头部导航 */}
      <div className="page-header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/badges')}
          className="back-button"
        >
          返回勋章殿堂
        </Button>
        
        <div className="header-content">
          <h1>
            <span className="series-icon">{seriesInfo.icon}</span>
            {seriesInfo.name}
          </h1>
          <p className="series-description">{seriesInfo.description}</p>
        </div>
      </div>

      {/* 套系概览 */}
      <Card className="series-overview">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className="progress-display">
              <div className="progress-header">
                <span>套系进度</span>
                <span className="progress-count">
                  {seriesProgress?.earnedBadges || 0}/{seriesInfo.badgeCount}
                </span>
              </div>
              <Progress 
                percent={seriesProgress?.progressPercentage || 0}
                strokeColor={{
                  '0%': '#ff7875',
                  '100%': '#ff4d4f',
                }}
                strokeWidth={8}
              />
              
              <div className="current-level">
                <span className="level-label">当前等级:</span>
                <Tag 
                  className="level-tag"
                  style={{ 
                    backgroundColor: getLevelColor(seriesProgress?.currentLevel || 'bronze'),
                    color: (seriesProgress?.currentLevel === 'platinum' || seriesProgress?.currentLevel === 'gold') ? '#000' : '#fff',
                    fontSize: '14px',
                    padding: '4px 12px'
                  }}
                >
                  {seriesProgress?.currentLevel?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 勋章展示 */}
      <Card className="series-badges">
        <h3>套系勋章 ({seriesBadges.length}个)</h3>
        
        {seriesBadges.length > 0 ? (
          <div className="badges-list">
            <Row gutter={[16, 16]}>
              {seriesBadges.map(badge => {
                const isEarned = earnedBadges.some(b => b.id === badge.id);
                
                return (
                  <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
                    <BadgeCard
                      badge={badge}
                      isEarned={isEarned}
                      onClick={() => {/* 点击查看勋章详情 */}}
                      showProgress={!isEarned}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        ) : (
          <Empty description="暂无勋章" />
        )}
      </Card>

      {/* 里程碑 */}
      {renderMilestones()}

      {/* 解锁提示 */}
      {seriesInfo.isLocked && (
        <Alert
          message="套系锁定"
          description={seriesInfo.unlockRequirement || '需要满足特定条件才能解锁此套系'}
          type="warning"
          showIcon
          className="locked-alert"
        />
      )}

      {/* 完成奖励 */}
      {seriesProgress?.earnedBadges === seriesInfo.badgeCount && (
        <Alert
          message="🎉 套系完成！"
          description="恭喜您已收集完此套系的所有勋章，获得套系完成奖励！"
          type="success"
          showIcon
          className="completion-alert"
        />
      )}
    </div>
  );
};

export default SeriesDetailPage;

## 10. 组件样式

// /src/app/components/pages/SeriesDetailPage.less
.series-detail-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 24px;
    
    .back-button {
      flex-shrink: 0;
    }
    
    .header-content {
      flex: 1;
      
      h1 {
        margin: 0 0 8px 0;
        font-size: 28px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .series-icon {
          font-size: 32px;
        }
      }
      
      .series-description {
        margin: 0;
        color: #666;
        font-size: 16px;
      }
    }
  }
  
  .series-overview {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    .progress-display {
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
        
        .progress-count {
          color: #1890ff;
          font-size: 20px;
          font-weight: bold;
        }
      }
      
      .current-level {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        
        .level-label {
          color: #666;
        }
        
        .level-tag {
          font-weight: bold;
          border-radius: 20px;
        }
      }
    }
  }
  
  .series-badges {
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 20px;
    }
  }
  
  .milestones-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 20px;
    }
    
    .milestone-item {
      .milestone-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .milestone-title {
          font-weight: 500;
          color: #333;
        }
      }
      
      .milestone-reward {
        color: #666;
        margin: 0;
        font-size: 14px;
      }
    }
  }
  
  .locked-alert,
  .completion-alert {
    border-radius: 12px;
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .series-detail-page {
    padding: 12px;
    
    .page-header {
      padding: 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      h1 {
        font-size: 22px;
      }
      
      .back-button {
        align-self: flex-start;
      }
    }
  }
}

## 11. 系统特色功能总结

这个完整的勋章殿堂系统具有以下特色：

### 1. 多维度勋章体系

• 10个勋章套系：成长、创意、隐藏、朝代、名人、科技、筑梦、文化、学习、社交
• 6个等级划分：青铜、白银、黄金、白金、钻石、传说
• 5个稀有度等级：普通、稀有、史诗、传说、神话

### 2. 阶段性解锁机制

• 每个套系分阶段解锁
• 勋章之间有前置关系
• 套系完成有额外奖励

### 3. 隐藏成就系统

• 特殊条件触发的隐藏勋章
• 探索性解锁机制
• 增加系统趣味性

### 4. 丰富的数据展示

• 实时统计卡片
• 多维度进度展示
• 排行榜功能

### 5. 完善的交互体验

• 响应式设计
• 动画效果和特效
• 分享功能
• 成就导出

### 6. 河洛文化特色

• 朝代勋章（丝绸之路）
• 名人勋章（栋梁）
• 科技勋章（古代发明）
• 文化勋章（河洛文化）
这个系统不仅是一个成就展示平台，更是激励学习、记录成长、传承文化的完整解决方案。
