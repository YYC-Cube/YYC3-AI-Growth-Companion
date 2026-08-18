/**
 * BadgeCard - 勋章卡片组件
 * 
 * @description
 * 用于展示单个勋章的卡片组件，支持已获得/未获得状态显示，
 * 进度追踪，点击交互等功能。
 * 
 * @features
 * - 勋章图标展示
 * - 稀有度可视化
 * - 进度条显示
 * - 获得时间显示
 * - 成就点数显示
 * - 悬停动画效果
 * 
 * @performance
 * - 使用React.memo优化渲染
 * - CSS动画GPU加速
 * - 避免不必要的重新渲染
 * 
 * @accessibility
 * - 语义化HTML
 * - ARIA标签
 * - 键盘导航
 * 
 * @author 小语AI应用团队
 * @version 1.0.0
 * @date 2025-12-29
 */

import React, { useMemo } from 'react';
import type { Badge, BadgeRarity } from '../../../types/badge';
import { Card } from '../foundation/Card';
import { Progress } from '../foundation/Progress';

/**
 * BadgeCard组件Props接口
 */
export interface BadgeCardProps {
  /** 勋章数据 */
  badge: Badge;
  
  /** 是否已获得 */
  isEarned: boolean;
  
  /** 点击事件回调 */
  onClick?: () => void;
  
  /** 是否显示进度条 */
  showProgress?: boolean;
  
  /** 自定义类名 */
  className?: string;
}

/**
 * BadgeCard组件
 * 
 * @example
 * ```tsx
 * <BadgeCard
 *   badge={badgeData}
 *   isEarned={true}
 *   onClick={handleClick}
 *   showProgress={true}
 * />
 * ```
 */
export const BadgeCard: React.FC<BadgeCardProps> = React.memo(({
  badge,
  isEarned,
  onClick,
  showProgress = true,
  className = '',
}) => {
  // ==================== 辅助函数 ====================
  
  /**
   * 获取稀有度对应的渐变色类名
   * 
   * @param rarity - 勋章稀有度
   * @returns Tailwind CSS渐变类名
   */
  const getRarityColor = (rarity: BadgeRarity): string => {
    const colorMap: Record<BadgeRarity, string> = {
      common: 'from-gray-400 to-gray-500',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-500',
    };
    return colorMap[rarity] || 'from-gray-400 to-gray-500';
  };

  /**
   * 获取稀有度的中文文本
   * 
   * @param rarity - 勋章稀有度
   * @returns 中文稀有度名称
   */
  const getRarityText = (rarity: BadgeRarity): string => {
    const textMap: Record<BadgeRarity, string> = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    };
    return textMap[rarity] || '';
  };

  // ==================== 计算属性 ====================
  
  /**
   * 计算勋章的总体进度百分比
   * 
   * @description
   * 基于所有解锁条件的阈值和当前进度计算总体完成度
   */
  const progressPercent = useMemo(() => {
    const progress = badge.progress || 0;
    const totalThreshold = badge.unlockConditions.reduce(
      (sum, cond) => sum + cond.threshold,
      0
    );
    return totalThreshold > 0 ? (progress / totalThreshold) * 100 : 0;
  }, [badge.progress, badge.unlockConditions]);

  /**
   * 获取稀有度渐变色
   */
  const rarityGradient = useMemo(
    () => getRarityColor(badge.rarity),
    [badge.rarity]
  );

  /**
   * 获取稀有度文本
   */
  const rarityLabel = useMemo(
    () => getRarityText(badge.rarity),
    [badge.rarity]
  );

  // ==================== 渲染 ====================
  
  return (
    <Card
      className={`
        badge-card 
        ${className} 
        ${!isEarned ? 'opacity-60 grayscale' : ''} 
        cursor-pointer 
        hover:scale-105 
        hover:shadow-xl
        transition-all 
        duration-300
        focus-within:ring-2
        focus-within:ring-purple-500
        focus-within:ring-offset-2
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${badge.title}勋章${isEarned ? '已获得' : '未获得'}`}
      onKeyDown={(e) => {
        // 键盘访问支持
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="text-center p-2">
        {/* 勋章图标 */}
        <div
          className={`
            w-16 h-16 
            mx-auto mb-2 
            rounded-full 
            bg-gradient-to-br ${rarityGradient}
            flex items-center justify-center 
            text-3xl 
            shadow-lg
            ${isEarned ? 'animate-pulse-slow' : ''}
            transform
            hover:rotate-12
            transition-transform
            duration-300
          `}
          role="img"
          aria-label={badge.title}
        >
          {isEarned ? (
            <span className="drop-shadow-md">{badge.icon}</span>
          ) : (
            <span className="opacity-50 filter blur-[1px]">{badge.icon}</span>
          )}
        </div>

        {/* 勋章标题 */}
        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
          {badge.title}
        </h4>

        {/* 稀有度标签 */}
        <div className="mb-2">
          <span
            className={`
              inline-block 
              px-2 py-0.5 
              rounded-full 
              text-xs 
              font-medium 
              bg-gradient-to-r ${rarityGradient}
              text-white
              shadow-sm
            `}
            aria-label={`稀有度：${rarityLabel}`}
          >
            {rarityLabel}
          </span>
        </div>

        {/* 描述 */}
        <p 
          className="text-xs text-gray-600 mb-2 line-clamp-2"
          title={badge.description}
        >
          {badge.description}
        </p>

        {/* 进度条 - 仅未获得时显示 */}
        {!isEarned && showProgress && badge.progress !== undefined && (
          <div className="mt-2" role="group" aria-label="解锁进度">
            <Progress 
              value={progressPercent} 
              className="h-1"
              aria-label={`完成进度${Math.round(progressPercent)}%`}
            />
            <p 
              className="text-xs text-gray-500 mt-1"
              aria-live="polite"
            >
              {Math.round(progressPercent)}% 完成
            </p>
          </div>
        )}

        {/* 获得时间 - 仅已获得时显示 */}
        {isEarned && badge.earnedDate && (
          <div className="mt-2">
            <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
              <span role="img" aria-label="已获得">✓</span>
              <span>已获得</span>
            </p>
            <p 
              className="text-xs text-gray-400"
              title={`获得时间：${new Date(badge.earnedDate).toLocaleString('zh-CN')}`}
            >
              {new Date(badge.earnedDate).toLocaleDateString('zh-CN')}
            </p>
          </div>
        )}

        {/* 成就点数 */}
        <div 
          className="mt-2 pt-2 border-t border-gray-100"
          role="group"
          aria-label="成就点数"
        >
          <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <span role="img" aria-label="奖杯">🏆</span>
            <span>{badge.rarityValue} 点</span>
          </span>
        </div>
      </div>
    </Card>
  );
});

// 设置组件显示名称（用于调试）
BadgeCard.displayName = 'BadgeCard';

/**
 * 样式常量
 * 
 * @description
 * 定义勋章卡片相关的样式常量，便于维护和复用
 */
export const BadgeCardStyles = {
  /** 稀有度颜色映射 */
  rarityColors: {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  },
  
  /** 稀有度文本映射 */
  rarityLabels: {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  },
  
  /** 动画时长 */
  animationDuration: {
    hover: '300ms',
    pulse: '2s',
  },
} as const;
