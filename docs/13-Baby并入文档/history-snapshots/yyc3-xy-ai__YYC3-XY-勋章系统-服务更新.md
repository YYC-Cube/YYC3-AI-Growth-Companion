# YYC3-XY-勋章系统-服务更新

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
