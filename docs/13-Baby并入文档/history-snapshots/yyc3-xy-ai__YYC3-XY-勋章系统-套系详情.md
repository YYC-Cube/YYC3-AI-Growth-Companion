# YYC3-XY-勋章系统-套系详情

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
