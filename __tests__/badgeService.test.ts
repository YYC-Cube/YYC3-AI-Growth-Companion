import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import BadgeService from '../src/services/badgeService';
import { Badge, BadgeFilter, BadgeSeries, BadgeCategory, BadgeRarity } from '../src/types/badge';

describe('BadgeService', () => {
  let badgeService: BadgeService;

  beforeEach(() => {
    badgeService = BadgeService.getInstance();
    badgeService.resetUserProgress();
  });

  afterEach(() => {
    badgeService.resetUserProgress();
  });

  describe('getAllBadges', () => {
    it('should return all badges', () => {
      const badges = badgeService.getAllBadges();
      expect(Array.isArray(badges)).toBe(true);
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('getBadgeById', () => {
    it('should return badge by id', () => {
      const badge = badgeService.getBadgeById('growth_bronze');
      expect(badge).toBeDefined();
      expect(badge?.id).toBe('growth_bronze');
    });

    it('should return undefined for non-existent badge', () => {
      const badge = badgeService.getBadgeById('non_existent');
      expect(badge).toBeUndefined();
    });
  });

  describe('getBadgesByFilter', () => {
    it('should filter badges by series', () => {
      const filter: BadgeFilter = { series: 'growth' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.every(b => b.series === 'growth')).toBe(true);
    });

    it('should filter badges by category', () => {
      const filter: BadgeFilter = { category: 'learning' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.every(b => b.category === 'learning')).toBe(true);
    });

    it('should filter badges by rarity', () => {
      const filter: BadgeFilter = { rarity: 'common' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.every(b => b.rarity === 'common')).toBe(true);
    });

    it('should filter badges by status', async () => {
      const filter: BadgeFilter = { status: 'earned' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.length).toBe(0);

      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const earnedBadges = badgeService.getBadgesByFilter(filter);
      expect(earnedBadges.length).toBeGreaterThan(0);
      expect(earnedBadges.every(b => badgeService.isBadgeEarned(b.id))).toBe(true);
    });

    it('should filter badges by search query', () => {
      const filter: BadgeFilter = { search: '成长' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.some(b => b.title.includes('成长') || b.description.includes('成长'))).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filter: BadgeFilter = { series: 'growth', rarity: 'common' };
      const badges = badgeService.getBadgesByFilter(filter);
      expect(badges.every(b => b.series === 'growth' && b.rarity === 'common')).toBe(true);
    });
  });

  describe('getBadgeStats', () => {
    it('should return badge statistics', () => {
      const stats = badgeService.getBadgeStats();
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.earned).toBe(0);
      expect(stats.totalPoints).toBe(0);
      expect(stats.bySeries).toBeDefined();
      expect(stats.byCategory).toBeDefined();
      expect(stats.byRarity).toBeDefined();
      expect(stats.byLevel).toBeDefined();
    });

    it('should update stats after earning badges', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const stats = badgeService.getBadgeStats();
      expect(stats.earned).toBeGreaterThan(0);
      expect(stats.totalPoints).toBeGreaterThan(0);
    });
  });

  describe('getBadgeProgress', () => {
    it('should return 0 for new badge', () => {
      const progress = badgeService.getBadgeProgress('growth_silver');
      expect(progress).toBe(0);
    });

    it('should return updated progress', () => {
      badgeService.updateBadgeProgress('growth_silver', 50);
      const progress = badgeService.getBadgeProgress('growth_silver');
      expect(progress).toBe(50);
    });
  });

  describe('isBadgeEarned', () => {
    it('should return false for unearned badge', () => {
      const isEarned = badgeService.isBadgeEarned('growth_bronze');
      expect(isEarned).toBe(false);
    });

    it('should return true for earned badge', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const isEarned = badgeService.isBadgeEarned('growth_bronze');
      expect(isEarned).toBe(true);
    });
  });

  describe('unlockBadge', () => {
    it('should unlock badge when conditions are met', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      const unlockedBadge = await badgeService.unlockBadge('growth_bronze');

      expect(unlockedBadge).toBeDefined();
      expect(unlockedBadge?.id).toBe('growth_bronze');
      expect(badgeService.isBadgeEarned('growth_bronze')).toBe(true);
    });

    it('should not unlock badge when conditions are not met', async () => {
      await expect(badgeService.unlockBadge('growth_bronze')).rejects.toThrow();
    });

    it('should not unlock already earned badge', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const result = await badgeService.unlockBadge('growth_bronze');
      expect(result).toBeNull();
    });

    it('should throw error for non-existent badge', async () => {
      await expect(badgeService.unlockBadge('non_existent')).rejects.toThrow();
    });
  });

  describe('updateBadgeProgress', () => {
    it('should update badge progress', () => {
      badgeService.updateBadgeProgress('growth_silver', 75);
      const progress = badgeService.getBadgeProgress('growth_silver');
      expect(progress).toBe(75);
    });
  });

  describe('getUnlockHistory', () => {
    it('should return empty history initially', () => {
      const history = badgeService.getUnlockHistory();
      expect(history).toEqual([]);
    });

    it('should return unlock history after unlocking badges', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const history = badgeService.getUnlockHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]?.badgeId).toBe('growth_bronze');
    });
  });

  describe('searchBadges', () => {
    it('should search badges by title', () => {
      const results = badgeService.searchBadges('成长');
      expect(results.some(b => b.title.includes('成长'))).toBe(true);
    });

    it('should search badges by description', () => {
      const results = badgeService.searchBadges('学习');
      expect(results.some(b => b.description.includes('学习'))).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = badgeService.searchBadges('xyz123');
      expect(results).toEqual([]);
    });
  });

  describe('getEarnedBadges', () => {
    it('should return empty array initially', () => {
      const earnedBadges = badgeService.getEarnedBadges();
      expect(earnedBadges).toEqual([]);
    });

    it('should return earned badges after unlocking', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const earnedBadges = badgeService.getEarnedBadges();
      expect(earnedBadges.length).toBeGreaterThan(0);
      expect(earnedBadges[0]?.id).toBe('growth_bronze');
    });
  });

  describe('getUnearnedBadges', () => {
    it('should return all badges initially', () => {
      const unearnedBadges = badgeService.getUnearnedBadges();
      expect(unearnedBadges.length).toBeGreaterThan(0);
    });

    it('should exclude earned badges', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const unearnedBadges = badgeService.getUnearnedBadges();
      expect(unearnedBadges.every(b => b.id !== 'growth_bronze')).toBe(true);
    });
  });

  describe('getBadgeGroups', () => {
    it('should return badge groups', () => {
      const groups = badgeService.getBadgeGroups();
      expect(Array.isArray(groups)).toBe(true);
      expect(groups.length).toBeGreaterThan(0);
    });

    it('should update group progress after earning badges', async () => {
      const initialGroups = badgeService.getBadgeGroups();
      const initialProgress = initialGroups.find(g => g.id === 'growth')?.progress || 0;

      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      const updatedGroups = badgeService.getBadgeGroups();
      const updatedProgress = updatedGroups.find(g => g.id === 'growth')?.progress || 0;

      expect(updatedProgress).toBeGreaterThan(initialProgress);
    });
  });

  describe('exportUserProgress', () => {
    it('should export user progress as JSON string', () => {
      const exported = badgeService.exportUserProgress();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('userId');
      expect(parsed).toHaveProperty('earnedBadges');
      expect(parsed).toHaveProperty('badgeProgress');
      expect(parsed).toHaveProperty('totalPoints');
    });
  });

  describe('importUserProgress', () => {
    it('should import valid user progress', () => {
      const progressData = JSON.stringify({
        userId: 'test_user',
        earnedBadges: ['growth_bronze'],
        badgeProgress: { 'growth_silver': 50 },
        totalPoints: 100,
        lastUpdated: new Date().toISOString()
      });

      badgeService.importUserProgress(progressData);
      
      expect(badgeService.isBadgeEarned('growth_bronze')).toBe(true);
      expect(badgeService.getBadgeProgress('growth_silver')).toBe(50);
    });

    it('should throw error for invalid data', () => {
      expect(() => badgeService.importUserProgress('invalid json')).toThrow();
    });
  });

  describe('resetUserProgress', () => {
    it('should reset all user progress', async () => {
      badgeService.updateBadgeProgress('growth_bronze', 100);
      await badgeService.unlockBadge('growth_bronze');

      badgeService.resetUserProgress();

      expect(badgeService.isBadgeEarned('growth_bronze')).toBe(false);
      expect(badgeService.getBadgeProgress('growth_bronze')).toBe(0);
      expect(badgeService.getBadgeStats().totalPoints).toBe(0);
    });
  });
});
