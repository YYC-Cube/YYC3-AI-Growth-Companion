/**
 * @file badgeService.ts
 * @description 勋章系统统一服务（合并原 src/services 与 lib/services 双实现）
 *
 * 变更说明（统一合并版）：
 * - 唯一数据源：@/lib/data/badgeMockData（32 枚勋章、10 大套系，源自 yyc3-xy-01）
 * - 唯一类型源：../types/badge（重导出 types/ui 规范类型 + 徽章域扩展类型）
 * - 修复原实现两处缺陷：
 *   1. checkUnlockConditions 引用未定义变量 badgeId
 *   2. 日期过滤误用 metadata.earnedDate（正确字段为顶层 earnedDate）
 * - localStorage 读写增加环境守卫，服务端（API 路由）与浏览器均可安全使用
 */

import {
  Badge,
  BadgeFilter,
  BadgeStats,
  BadgeUserProgress,
  BadgeUnlockEvent,
  BadgeSeries,
  BadgeCategory,
  BadgeRarity,
  BadgeLevel,
} from '../types/badge';
import { allBadges, badgeGroups, mockUserProgress } from '@/lib/data/badgeMockData';

const STORAGE_KEY = 'badgeUserProgress';

/** 环境安全的进度存取：浏览器持久化，服务端仅内存 */
function loadStoredProgress(): BadgeUserProgress | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as BadgeUserProgress) : null;
  } catch {
    return null;
  }
}

function saveStoredProgress(progress: BadgeUserProgress): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // 存储不可用（隐私模式/配额）时静默降级为内存态
  }
}

export class BadgeService {
  private static instance: BadgeService;
  private badges: Map<string, Badge> = new Map();
  private userProgress: BadgeUserProgress;
  private unlockHistory: BadgeUnlockEvent[] = [];

  private constructor() {
    allBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
    this.userProgress = loadStoredProgress() ?? structuredClone(mockUserProgress);
  }

  static getInstance(): BadgeService {
    if (!BadgeService.instance) {
      BadgeService.instance = new BadgeService();
    }
    return BadgeService.instance;
  }

  public getAllBadges(): Badge[] {
    return Array.from(this.badges.values());
  }

  public getBadgeById(id: string): Badge | undefined {
    return this.badges.get(id);
  }

  public getBadgesByFilter(filter: BadgeFilter): Badge[] {
    let badges = this.getAllBadges();
    const earnedIds = this.userProgress.earnedBadges;

    if (filter.series) {
      badges = badges.filter(b => b.series === filter.series);
    }

    if (filter.category) {
      badges = badges.filter(b => b.category === filter.category);
    }

    if (filter.rarity) {
      badges = badges.filter(b => b.rarity === filter.rarity);
    }

    if (filter.level) {
      badges = badges.filter(b => b.level === filter.level);
    }

    if (filter.status) {
      if (filter.status === 'earned') {
        badges = badges.filter(b => earnedIds.includes(b.id));
      } else if (filter.status === 'unearned') {
        badges = badges.filter(b => !earnedIds.includes(b.id));
      }
    }

    if (filter.tags && filter.tags.length > 0) {
      const tagSet = new Set(filter.tags.map(tag => tag.toLowerCase()));
      badges = badges.filter(b => {
        const badgeTags = (b.metadata.tags || []).map(tag => tag.toLowerCase());
        return badgeTags.some(tag => tagSet.has(tag));
      });
    }

    if (filter.minPoints !== undefined || filter.maxPoints !== undefined) {
      badges = badges.filter(b => {
        const points = b.metadata.points;
        return (
          (filter.minPoints === undefined || points >= filter.minPoints) &&
          (filter.maxPoints === undefined || points <= filter.maxPoints)
        );
      });
    }

    if (filter.earnedDateStart || filter.earnedDateEnd) {
      badges = badges.filter(b => {
        if (!b.earnedDate || !earnedIds.includes(b.id)) return false;

        const earnedDate = new Date(b.earnedDate);
        return (
          (!filter.earnedDateStart || earnedDate >= filter.earnedDateStart) &&
          (!filter.earnedDateEnd || earnedDate <= filter.earnedDateEnd)
        );
      });
    }

    if (filter.search) {
      badges = this.searchBadges(filter.search, {
        fuzzy: true,
        fields: ['title', 'description', 'tags'],
      }).filter(b => badges.some(candidate => candidate.id === b.id));
    }

    return badges;
  }

  public getBadgeStats(): BadgeStats {
    const earnedIds = this.userProgress.earnedBadges;
    const earnedBadges = earnedIds
      .map(id => this.badges.get(id))
      .filter(Boolean) as Badge[];

    const stats: BadgeStats = {
      total: this.badges.size,
      earned: earnedIds.length,
      bySeries: {} as Record<BadgeSeries, number>,
      byCategory: {} as Record<BadgeCategory, number>,
      byRarity: {} as Record<BadgeRarity, number>,
      byLevel: {} as Record<BadgeLevel, number>,
      totalPoints: this.userProgress.totalPoints,
      recentBadges: earnedBadges.slice(-5),
    };

    earnedBadges.forEach(badge => {
      stats.bySeries[badge.series] = (stats.bySeries[badge.series] || 0) + 1;
      stats.byCategory[badge.category] = (stats.byCategory[badge.category] || 0) + 1;
      stats.byRarity[badge.rarity] = (stats.byRarity[badge.rarity] || 0) + 1;
      stats.byLevel[badge.level] = (stats.byLevel[badge.level] || 0) + 1;
    });

    return stats;
  }

  public getBadgeProgress(badgeId: string): number {
    return this.userProgress.badgeProgress[badgeId] || 0;
  }

  public isBadgeEarned(badgeId: string): boolean {
    return this.userProgress.earnedBadges.includes(badgeId);
  }

  public async unlockBadge(badgeId: string): Promise<Badge | null> {
    const badge = this.badges.get(badgeId);
    if (!badge) {
      throw new Error(`Badge not found: ${badgeId}`);
    }

    if (this.isBadgeEarned(badgeId)) {
      return null;
    }

    const canUnlock = await this.checkUnlockConditions(badge);
    if (!canUnlock) {
      throw new Error('Unlock conditions not met');
    }

    this.userProgress.earnedBadges.push(badgeId);
    this.userProgress.badgeProgress[badgeId] = 100;
    this.userProgress.totalPoints += badge.metadata.points;
    this.userProgress.lastUpdated = new Date().toISOString();

    const unlockEvent: BadgeUnlockEvent = {
      badgeId,
      userId: this.userProgress.userId,
      timestamp: Date.now(),
      conditionsMet: badge.unlockConditions,
    };

    this.unlockHistory.push(unlockEvent);
    saveStoredProgress(this.userProgress);

    return badge;
  }

  private async checkUnlockConditions(badge: Badge): Promise<boolean> {
    // 解锁条件：勋章进度达到 100（进度由业务事件通过 updateBadgeProgress 驱动）
    if (this.getBadgeProgress(badge.id) < 100) {
      return false;
    }

    for (const condition of badge.unlockConditions) {
      const current = await this.getConditionValue(condition.type);
      if (current < condition.value) {
        return false;
      }
    }

    return true;
  }

  private async getConditionValue(_type: string): Promise<number> {
    // Mock 阶段所有条件视为已满足；接入真实数据源后替换为统计查询
    void _type;
    return Number.MAX_SAFE_INTEGER;
  }

  public updateBadgeProgress(badgeId: string, progress: number): void {
    this.userProgress.badgeProgress[badgeId] = progress;
    saveStoredProgress(this.userProgress);
  }

  public getUnlockHistory(): BadgeUnlockEvent[] {
    return this.unlockHistory;
  }

  public getBadgeGroups() {
    return badgeGroups.map(group => ({
      ...group,
      earnedCount: group.badges.filter(id => this.isBadgeEarned(id)).length,
      progress: group.badges.filter(id => this.isBadgeEarned(id)).length / group.badgeCount,
    }));
  }

  public searchBadges(
    query: string,
    options: { fuzzy?: boolean; fields?: ('title' | 'description' | 'tags')[] } = {}
  ): Badge[] {
    if (!query.trim()) return this.getAllBadges();

    const searchLower = query.toLowerCase();
    const fields = options.fields || ['title', 'description', 'tags'];

    return this.getAllBadges().filter(badge => {
      const badgeData = {
        title: badge.title.toLowerCase(),
        description: badge.description.toLowerCase(),
        tags: (badge.metadata.tags || []).map(tag => tag.toLowerCase()),
      };

      return fields.some(field => {
        if (field === 'tags') {
          return badgeData.tags.some(tag =>
            options.fuzzy ? this.fuzzyMatch(tag, searchLower) : tag.includes(searchLower)
          );
        }
        const fieldValue = badgeData[field] as string;
        return options.fuzzy
          ? this.fuzzyMatch(fieldValue, searchLower)
          : fieldValue.includes(searchLower);
      });
    });
  }

  private fuzzyMatch(str: string, pattern: string): boolean {
    let i = 0;
    let j = 0;

    while (i < str.length && j < pattern.length) {
      if (str[i] === pattern[j]) {
        j++;
      }
      i++;
    }

    return j === pattern.length;
  }

  public getEarnedBadges(): Badge[] {
    return this.userProgress.earnedBadges
      .map(id => this.badges.get(id))
      .filter(Boolean) as Badge[];
  }

  public getUnearnedBadges(): Badge[] {
    const earnedIds = this.userProgress.earnedBadges;
    return this.getAllBadges().filter(b => !earnedIds.includes(b.id));
  }

  public getHiddenBadges(): Badge[] {
    return this.getAllBadges().filter(b => b.isHidden);
  }

  public getBadgesBySeries(series: BadgeSeries): Badge[] {
    return this.getAllBadges().filter(b => b.series === series);
  }

  public getBadgesByCategory(category: BadgeCategory): Badge[] {
    return this.getAllBadges().filter(b => b.category === category);
  }

  public getBadgesByRarity(rarity: BadgeRarity): Badge[] {
    return this.getAllBadges().filter(b => b.rarity === rarity);
  }

  public getBadgesByLevel(level: BadgeLevel): Badge[] {
    return this.getAllBadges().filter(b => b.level === level);
  }

  /** 套系进度（API action=progress 使用） */
  public getSeriesProgress(series: BadgeSeries) {
    const badges = this.getBadgesBySeries(series);
    const earned = badges.filter(b => this.isBadgeEarned(b.id));
    return {
      series,
      totalBadges: badges.length,
      earnedBadges: earned.length,
      progressPercentage:
        badges.length === 0 ? 0 : Math.round((earned.length / badges.length) * 100),
      badgeIds: badges.map(b => b.id),
      earnedBadgeIds: earned.map(b => b.id),
    };
  }

  public resetUserProgress(): void {
    this.userProgress = {
      userId: this.userProgress.userId,
      earnedBadges: [],
      badgeProgress: {},
      totalPoints: 0,
      lastUpdated: new Date().toISOString(),
    };
    this.unlockHistory = [];
    saveStoredProgress(this.userProgress);
  }

  public exportUserProgress(): string {
    return JSON.stringify(this.userProgress, null, 2);
  }

  public importUserProgress(data: string): void {
    try {
      const progress = JSON.parse(data) as BadgeUserProgress;
      this.userProgress = progress;
      saveStoredProgress(this.userProgress);
    } catch {
      throw new Error('Invalid user progress data');
    }
  }
}

export default BadgeService;
