# YYC3-XY-勋章系统-UI页面

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
