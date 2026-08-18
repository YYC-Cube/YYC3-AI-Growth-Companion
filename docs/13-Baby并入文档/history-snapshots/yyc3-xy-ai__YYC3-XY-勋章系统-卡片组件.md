# YYC3-XY-勋章系统-卡片组件

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
