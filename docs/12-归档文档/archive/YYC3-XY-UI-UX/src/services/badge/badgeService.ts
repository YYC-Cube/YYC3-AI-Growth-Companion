import { Badge, BadgeGroup, BadgeStats } from '../../types/badge';
import { allBadges, badgeGroups, badgeStats } from '../../data/badgeMockData';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const badgeService = {
  /**
   * 获取所有勋章
   */
  getAllBadges: async (): Promise<Badge[]> => {
    await delay(500);
    return [...allBadges];
  },

  /**
   * 获取用户已获得的勋章
   * 目前返回mock数据中的部分勋章
   */
  getUserBadges: async (): Promise<Badge[]> => {
    await delay(500);
    // 模拟用户获得的勋章
    return allBadges.filter(b => 
      ['growth_bronze', 'growth_silver', 'creative_bronze', 'dynasty_silk_road', 'culture_novice', 'learning_streak'].includes(b.id)
    );
  },

  /**
   * 获取勋章组信息
   */
  getBadgeGroups: async (): Promise<BadgeGroup[]> => {
    await delay(500);
    return [...badgeGroups];
  },

  /**
   * 获取勋章统计数据
   */
  getBadgeStats: async (): Promise<BadgeStats> => {
    await delay(500);
    return { ...badgeStats };
  },

  /**
   * 根据ID获取勋章详情
   */
  getBadgeById: async (id: string): Promise<Badge | undefined> => {
    await delay(200);
    return allBadges.find(b => b.id === id);
  }
};
