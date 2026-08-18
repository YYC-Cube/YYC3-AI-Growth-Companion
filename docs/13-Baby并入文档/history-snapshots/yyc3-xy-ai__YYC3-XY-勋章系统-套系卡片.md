# YYC3-XY-勋章系统-套系卡片

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
