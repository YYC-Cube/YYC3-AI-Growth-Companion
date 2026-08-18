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
      specialEffect: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01'
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
      animatedIcon: '/badges/growth/platinum.gif',
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01'
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
    metadata: { points: 50, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 150, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 300, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 200, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 500, version: '1.0', specialEffect: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 1000, version: '1.0', glowColor: '#8B4513', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 300, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 500, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 200, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 300, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 300, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 150, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    metadata: { points: 100, version: '1.0', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
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
    icon: '🏛️',
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
