# XY-成长系统页面功能拓展

制定完整的实施优先级和技术方案：
🎯 实施优先级规划
第一优先级：核心业务页面

## 1. BadgesPage.tsx - 勋章殿堂页面

// /src/app/components/pages/BadgesPage.tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Modal, Button, Progress, Space, Badge as AntBadge } from 'antd';
import { TrophyOutlined, ShareAltOutlined, FireOutlined } from '@ant-design/icons';
import BadgeCard from '../business/BadgeCard';
import { badgeService } from '../../services/badge/badgeService';
import { Badge, BadgeCategory } from '../../types/badge';
import './BadgesPage.less';

const { TabPane } = Tabs;

const BadgesPage: React.FC = () => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [unearnedBadges, setUnearnedBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const badges = await badgeService.getAllBadges();
    const earned = await badgeService.getUserBadges();
    
    setAllBadges(badges);
    setEarnedBadges(earned);
    setUnearnedBadges(badges.filter(b => 
      !earned.some(e => e.id === b.id)
    ));
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const handleShare = async () => {
    if (selectedBadge) {
      try {
        await navigator.share({
          title: `我获得了${selectedBadge.title}勋章！`,
          text: selectedBadge.description,
          url: window.location.href,
        });
      } catch (err) {
        // 降级方案：复制到剪贴板
        navigator.clipboard.writeText(
          `我在沫语成长守护体系获得了"${selectedBadge.title}"勋章！`
        );
      }
    }
  };

  const getCategoryStats = (category: BadgeCategory) => {
    const categoryBadges = allBadges.filter(b => b.category === category);
    const earnedInCategory = earnedBadges.filter(b => b.category === category);
    return {
      total: categoryBadges.length,
      earned: earnedInCategory.length,
      progress: categoryBadges.length > 0 
        ? (earnedInCategory.length / categoryBadges.length) * 100 
        : 0,
    };
  };

  return (
    <div className="badges-page">
      {/* 页面头部 */}
      <div className="page-header">
        <h1>
          <TrophyOutlined /> 勋章殿堂
        </h1>
        <div className="header-stats">
          <Space size="large">
            <div className="stat-item">
              <div className="stat-label">已获得</div>
              <div className="stat-value">{earnedBadges.length}/{allBadges.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">成就点</div>
              <div className="stat-value">
                {earnedBadges.reduce((sum, b) => sum + (b.rarityValue || 0), 0)}
              </div>
            </div>
          </Space>
        </div>
      </div>

      {/* 分类进度 */}
      <div className="category-progress">
        <Row gutter={[16, 16]}>
          {(['学习成就', '文化探索', '社交互动', '创意制作'] as BadgeCategory[]).map(category => {
            const stats = getCategoryStats(category);
            return (
              <Col xs={24} sm={12} lg={6} key={category}>
                <div className="category-card">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    <span className="category-count">
                      {stats.earned}/{stats.total}
                    </span>
                  </div>
                  <Progress 
                    percent={stats.progress} 
                    strokeColor={{
                      '0%': '#ff7875',
                      '100%': '#ff4d4f',
                    }}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* 勋章筛选 */}
      <div className="badge-filter">
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: '全部勋章',
              children: null,
            },
            {
              key: 'earned',
              label: '已获得',
              children: null,
            },
            {
              key: 'unearned',
              label: '待解锁',
              children: null,
            },
            {
              key: 'rare',
              label: '稀有勋章',
              children: null,
            },
          ]}
        />
      </div>

      {/* 勋章网格 */}
      <div className="badges-grid">
        <Row gutter={[16, 16]}>
          {(activeTab === 'all' ? allBadges : 
            activeTab === 'earned' ? earnedBadges : 
            activeTab === 'unearned' ? unearnedBadges :
            allBadges.filter(b => b.rarity === 'rare' || b.rarity === 'legendary')
          ).map(badge => (
            <Col xs={12} sm={8} md={6} lg={4} key={badge.id}>
              <BadgeCard
                badge={badge}
                isEarned={earnedBadges.some(b => b.id === badge.id)}
                onClick={() => handleBadgeClick(badge)}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* 勋章详情弹窗 */}
      <Modal
        title={selectedBadge?.title}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          selectedBadge && earnedBadges.some(b => b.id === selectedBadge.id) && (
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
        width={600}
      >
        {selectedBadge && (
          <div className="badge-detail">
            <div className="badge-detail-header">
              <img 
                src={selectedBadge.icon} 
                alt={selectedBadge.title}
                className="badge-large-icon"
              />
              <div className="badge-info">
                <div className="badge-meta">
                  <AntBadge 
                    status="processing" 
                    text={selectedBadge.category}
                    color={
                      selectedBadge.category === '学习成就' ? 'blue' :
                      selectedBadge.category === '文化探索' ? 'green' :
                      selectedBadge.category === '社交互动' ? 'orange' :
                      'purple'
                    }
                  />
                  <span className={`rarity rarity-${selectedBadge.rarity}`}>
                    <FireOutlined /> {selectedBadge.rarity}
                  </span>
                </div>
                <div className="badge-description">
                  {selectedBadge.description}
                </div>
              </div>
            </div>

            <div className="badge-unlock-conditions">
              <h4>解锁条件</h4>
              {selectedBadge.unlockConditions.map((condition, index) => {
                const progress = selectedBadge.progress || 0;
                const isCompleted = progress >= condition.threshold;
                
                return (
                  <div 
                    key={index} 
                    className={`condition-item ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="condition-content">
                      <span className="condition-icon">
                        {isCompleted ? '✓' : '○'}
                      </span>
                      <span className="condition-text">{condition.description}</span>
                    </div>
                    <div className="condition-progress">
                      <Progress 
                        percent={(progress / condition.threshold) * 100}
                        size="small"
                        showInfo={false}
                      />
                      <span className="progress-text">
                        {progress}/{condition.threshold}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedBadge.earnedDate && (
              <div className="badge-earned-info">
                <h4>获得时间</h4>
                <p>{new Date(selectedBadge.earnedDate).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BadgesPage;

## 2. CultureDetailPage.tsx - 河洛文化详情页

// /src/app/components/pages/CultureDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Carousel, Button, Tabs, Card, Collapse, 
  Tag, Space, Spin, message 
} from 'antd';
import { 
  HeartOutlined, ShareAltOutlined, StarOutlined, 
  CameraOutlined, PlayCircleOutlined, ArrowsAltOutlined 
} from '@ant-design/icons';
import { cultureService } from '../../services/culture/cultureService';
import { CultureContent, CultureType } from '../../types/culture';
import './CultureDetailPage.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const CultureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cultureDetail, setCultureDetail] = useState<CultureContent | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadCultureDetail(id);
    }
  }, [id]);

  const loadCultureDetail = async (cultureId: string) => {
    setLoading(true);
    try {
      const detail = await cultureService.getCultureDetail(cultureId);
      setCultureDetail(detail);
      // 检查是否已收藏
      const favorites = await cultureService.getUserFavorites();
      setFavorited(favorites.includes(cultureId));
    } catch (error) {
      message.error('加载文化详情失败');
      navigate('/culture');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!cultureDetail) return;
    
    try {
      if (favorited) {
        await cultureService.removeFavorite(cultureDetail.id);
        message.success('已取消收藏');
      } else {
        await cultureService.addFavorite(cultureDetail.id);
        message.success('已添加到收藏');
      }
      setFavorited(!favorited);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleShare = async () => {
    if (!cultureDetail) return;
    
    try {
      await navigator.share({
        title: `了解${cultureDetail.title} - 河洛文化`,
        text: cultureDetail.description,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(
        `我在沫语成长守护体系了解${cultureDetail.title}：${window.location.href}`
      );
      message.success('链接已复制到剪贴板');
    }
  };

  const renderTypeTag = (type: CultureType) => {
    const typeConfig = {
      site: { color: 'blue', text: '历史遗迹' },
      food: { color: 'orange', text: '特色美食' },
      festival: { color: 'green', text: '传统节日' },
      story: { color: 'purple', text: '历史故事' },
    };
    
    const config = typeConfig[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!cultureDetail) {
    return <div>文化内容不存在</div>;
  }

  return (
    <div className="culture-detail-page">
      {/* 头部图片轮播 */}
      <div className="culture-header">
        <Carousel autoplay className="culture-carousel">
          {cultureDetail.multimedia.images.map((img, index) => (
            <div key={index}>
              <div 
                className="carousel-image"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </Carousel>
        
        <div className="culture-header-overlay">
          <Button 
            type="primary" 
            shape="round"
            icon={<ArrowsAltOutlined />}
            className="ar-experience-btn"
            onClick={() => message.info('AR功能开发中...')}
          >
            AR体验
          </Button>
        </div>
      </div>

      {/* 文化基本信息 */}
      <div className="culture-info-section">
        <Row gutter={[24, 16]}>
          <Col span={16}>
            <h1 className="culture-title">
              {cultureDetail.title}
              {renderTypeTag(cultureDetail.type)}
            </h1>
            <p className="culture-description">
              {cultureDetail.description}
            </p>
            
            <Space className="culture-meta" size="middle">
              <span>
                <StarOutlined /> 难度: {cultureDetail.difficultyLevel}
              </span>
              <span>
                👥 适合年龄: {cultureDetail.suitableAgeRange[0]}-{cultureDetail.suitableAgeRange[1]}岁
              </span>
              <span>
                📍 地点: {cultureDetail.location || '洛阳'}
              </span>
            </Space>
          </Col>
          
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type={favorited ? 'primary' : 'default'}
                icon={<HeartOutlined />}
                block
                onClick={handleFavorite}
              >
                {favorited ? '已收藏' : '收藏'}
              </Button>
              
              <Button 
                icon={<ShareAltOutlined />}
                block
                onClick={handleShare}
              >
                分享
              </Button>
              
              {cultureDetail.multimedia.ar && (
                <Button 
                  type="dashed"
                  icon={<CameraOutlined />}
                  block
                  onClick={() => window.open(cultureDetail.multimedia.ar, '_blank')}
                >
                  3D模型查看
                </Button>
              )}
              
              {cultureDetail.multimedia.videos && cultureDetail.multimedia.videos.length > 0 && (
                <Button 
                  type="dashed"
                  icon={<PlayCircleOutlined />}
                  block
                  onClick={() => {
                    const videoUrl = cultureDetail.multimedia.videos![0];
                    window.open(videoUrl, '_blank');
                  }}
                >
                  观看介绍视频
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* 内容标签页 */}
      <div className="culture-content-tabs">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="详细介绍" key="overview">
            <div className="tab-content">
              <div 
                className="detailed-content"
                dangerouslySetInnerHTML={{ __html: cultureDetail.detailedContent }}
              />
            </div>
          </TabPane>
          
          <TabPane tab="知识问答" key="quiz">
            <div className="tab-content">
              <Collapse accordion>
                {cultureDetail.knowledgePoints.map((point, index) => (
                  <Panel 
                    header={`${index + 1}. ${point.question}`} 
                    key={point.id}
                  >
                    <div className="knowledge-answer">
                      <p><strong>答案:</strong> {point.answer}</p>
                      {point.explanation && (
                        <p className="explanation">
                          <strong>解析:</strong> {point.explanation}
                        </p>
                      )}
                    </div>
                  </Panel>
                ))}
              </Collapse>
              
              <div className="interactive-quiz">
                <h3>互动测试</h3>
                <p>完成问答可获得文化探索勋章</p>
                <Button type="primary" onClick={() => message.info('开始答题')}>
                  开始答题
                </Button>
              </div>
            </div>
          </TabPane>
          
          <TabPane tab="互动体验" key="interactive">
            <div className="tab-content">
              <Row gutter={[16, 16]}>
                {cultureDetail.interactiveElements.map((element, index) => (
                  <Col span={8} key={index}>
                    <Card 
                      title={element.title}
                      hoverable
                      onClick={() => {
                        if (element.type === 'game') {
                          message.info(`开始${element.title}游戏`);
                        } else if (element.type === 'quiz') {
                          message.info('开始互动问答');
                        } else if (element.type === 'craft') {
                          message.info('开始手工制作教程');
                        }
                      }}
                    >
                      <p>{element.description}</p>
                      <Tag color="blue">{element.type === 'game' ? '游戏' : 
                                         element.type === 'quiz' ? '问答' : '手工'}</Tag>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>
          
          <TabPane tab="相关内容" key="related">
            <div className="tab-content">
              <Row gutter={[16, 16]}>
                {cultureDetail.relatedContent.map((relatedId, index) => (
                  <Col span={8} key={index}>
                    <Card
                      hoverable
                      cover={
                        <div 
                          className="related-image"
                          style={{ 
                            backgroundImage: 'url(/placeholder.jpg)',
                            height: 120 
                          }}
                        />
                      }
                      onClick={() => navigate(`/culture/${relatedId}`)}
                    >
                      <Card.Meta
                        title={`相关文化 ${index + 1}`}
                        description="点击查看详情"
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* 学习进度 */}
      <div className="learning-progress">
        <h3>学习进度</h3>
        <div className="progress-steps">
          <div className={`step ${cultureDetail.learned ? 'completed' : 'active'}`}>
            <div className="step-icon">1</div>
            <div className="step-content">
              <h4>了解基础</h4>
              <p>阅读详细介绍</p>
            </div>
          </div>
          
          <div className={`step ${cultureDetail.quizCompleted ? 'completed' : ''}`}>
            <div className="step-icon">2</div>
            <div className="step-content">
              <h4>知识问答</h4>
              <p>完成互动测试</p>
            </div>
          </div>
          
          <div className={`step ${cultureDetail.interactiveCompleted ? 'completed' : ''}`}>
            <div className="step-icon">3</div>
            <div className="step-content">
              <h4>互动体验</h4>
              <p>参与互动活动</p>
            </div>
          </div>
          
          <div className={`step ${cultureDetail.shared ? 'completed' : ''}`}>
            <div className="step-icon">4</div>
            <div className="step-content">
              <h4>分享传播</h4>
              <p>分享给朋友</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureDetailPage;

## 3. ProfilePage.tsx - 用户个人中心

// /src/app/components/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Avatar, Statistic, List, Progress, 
  Tabs, Button, Space, Timeline, Divider 
} from 'antd';
import { 
  UserOutlined, SettingOutlined, TrophyOutlined, 
  BookOutlined, TeamOutlined, CalendarOutlined,
  EditOutlined, LogoutOutlined, SafetyOutlined
} from '@ant-design/icons';
import { userService } from '../../services/user/userService';
import { badgeService } from '../../services/badge/badgeService';
import { analyticsService } from '../../services/analytics/analyticsService';
import { Badge } from '../../types/badge';
import { GrowthData } from '../../types/user';
import './ProfilePage.less';

const { TabPane } = Tabs;
const { Meta } = Card;

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [user, growth, badges] = await Promise.all([
        userService.getCurrentUser(),
        analyticsService.getGrowthData(),
        badgeService.getUserBadges()
      ]);
      
      setUserInfo(user);
      setGrowthData(growth);
      setRecentBadges(badges.slice(0, 6));
    } catch (error) {
      console.error('加载个人资料失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await userService.logout();
    window.location.href = '/login';
  };

  const getLearningStats = () => {
    if (!growthData) return { totalHours: 0, days: 0 };
    
    const totalHours = growthData.learningStats.totalHours;
    const days = growthData.learningStats.totalDays;
    
    return { totalHours, days };
  };

  const renderGrowthProgress = () => {
    if (!growthData) return null;
    
    const categories = [
      { key: 'cognitive', label: '认知发展', color: '#1890ff' },
      { key: 'physical', label: '体能发展', color: '#52c41a' },
      { key: 'social', label: '社交情感', color: '#fa8c16' },
      { key: 'cultural', label: '文化认知', color: '#722ed1' },
    ];
    
    return categories.map(cat => {
      const progress = growthData[cat.key]?.progress || 0;
      return (
        <div key={cat.key} className="growth-item">
          <div className="growth-label">
            <span>{cat.label}</span>
            <span className="growth-percent">{progress}%</span>
          </div>
          <Progress 
            percent={progress}
            strokeColor={cat.color}
            size="small"
          />
        </div>
      );
    });
  };

  if (loading) {
    return <div className="loading-spinner">加载中...</div>;
  }

  return (
    <div className="profile-page">
      {/* 个人信息头部 */}
      <Card className="profile-header">
        <Row gutter={24} align="middle">
          <Col span={6}>
            <div className="avatar-section">
              <Avatar 
                size={100} 
                src={userInfo?.avatar}
                icon={<UserOutlined />}
                className="profile-avatar"
              />
              <Button 
                type="link" 
                icon={<EditOutlined />}
                className="edit-avatar-btn"
              >
                更换头像
              </Button>
            </div>
          </Col>
          
          <Col span={12}>
            <div className="profile-info">
              <h1 className="profile-name">
                {userInfo?.name || '沫语家庭'}
                <span className="profile-role">
                  {userInfo?.role === 'parent' ? '家长' : 
                   userInfo?.role === 'child' ? '孩子' : '用户'}
                </span>
              </h1>
              
              <p className="profile-bio">
                {userInfo?.bio || '用爱记录成长，用心守护童年'}
              </p>
              
              <Space className="profile-stats" size="large">
                <Statistic 
                  title="学习时长" 
                  value={getLearningStats().totalHours}
                  suffix="小时"
                />
                <Statistic 
                  title="连续学习" 
                  value={getLearningStats().days}
                  suffix="天"
                />
                <Statistic 
                  title="获得勋章" 
                  value={recentBadges.length}
                  suffix="枚"
                />
              </Space>
            </div>
          </Col>
          
          <Col span={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<SettingOutlined />}
                block
                onClick={() => window.location.href = '/settings'}
              >
                账户设置
              </Button>
              
              <Button 
                icon={<SafetyOutlined />}
                block
                onClick={() => window.location.href = '/privacy'}
              >
                隐私设置
              </Button>
              
              <Button 
                danger
                icon={<LogoutOutlined />}
                block
                onClick={handleLogout}
              >
                退出登录
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 标签页内容 */}
      <div className="profile-tabs">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                成长总览
              </span>
            } 
            key="overview"
          >
            <Row gutter={[24, 24]}>
              <Col span={16}>
                <Card title="发展进度">
                  {renderGrowthProgress()}
                </Card>
                
                <Card title="近期里程碑" className="milestone-card">
                  <Timeline>
                    {growthData?.recentMilestones?.map((milestone, index) => (
                      <Timeline.Item key={index} color="green">
                        <strong>{milestone.title}</strong>
                        <p>{milestone.description}</p>
                        <small>{milestone.date}</small>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="学习统计">
                  <div className="learning-stats">
                    <Statistic 
                      title="今日学习" 
                      value={growthData?.todayStats?.minutes || 0}
                      suffix="分钟"
                    />
                    <Divider />
                    <Statistic 
                      title="本周学习" 
                      value={growthData?.weekStats?.hours || 0}
                      suffix="小时"
                    />
                    <Divider />
                    <Statistic 
                      title="本月学习" 
                      value={growthData?.monthStats?.days || 0}
                      suffix="天"
                    />
                  </div>
                </Card>
                
                <Card title="活跃时段" className="active-time-card">
                  <div className="heatmap">
                    {/* 这里可以添加学习热力图 */}
                    <p>学习热力图开发中...</p>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TrophyOutlined />
                成就徽章
              </span>
            } 
            key="badges"
          >
            <Row gutter={[16, 16]}>
              {recentBadges.map(badge => (
                <Col span={8} key={badge.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="badge-cover">
                        <img 
                          alt={badge.title}
                          src={badge.icon}
                          className="badge-image"
                        />
                      </div>
                    }
                  >
                    <Meta
                      title={badge.title}
                      description={
                        <>
                          <div>{badge.description}</div>
                          <div className="badge-date">
                            获得时间: {badge.earnedDate}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            
            <div className="view-all-badges">
              <Button 
                type="primary"
                onClick={() => window.location.href = '/badges'}
              >
                查看所有勋章
              </Button>
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <BookOutlined />
                学习记录
              </span>
            } 
            key="learning"
          >
            <Card title="学习轨迹">
              <List
                dataSource={growthData?.learningRecords || []}
                renderItem={record => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<BookOutlined />} />}
                      title={record.courseName}
                      description={
                        <>
                          <div>学习时长: {record.duration}分钟</div>
                          <div>完成时间: {record.completedAt}</div>
                        </>
                      }
                    />
                    <Progress 
                      percent={record.progress} 
                      size="small" 
                      style={{ width: 100 }}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                家庭协作
              </span>
            } 
            key="family"
          >
            <Card title="家庭成员">
              <Row gutter={[16, 16]}>
                {userInfo?.familyMembers?.map((member: any) => (
                  <Col span={8} key={member.id}>
                    <Card className="member-card">
                      <Avatar 
                        size={64}
                        src={member.avatar}
                        icon={<UserOutlined />}
                      />
                      <div className="member-info">
                        <h4>{member.name}</h4>
                        <p>{member.relationship}</p>
                        <Tag color={member.isOnline ? 'green' : 'default'}>
                          {member.isOnline ? '在线' : '离线'}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                学习计划
              </span>
            } 
            key="schedule"
          >
            <Card title="本周学习计划">
              {/* 学习计划日历组件 */}
              <div className="weekly-schedule">
                <p>智能课表功能开发中...</p>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* 快捷设置入口 */}
      <div className="quick-settings">
        <h3>快捷设置</h3>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card 
              hoverable 
              className="quick-card"
              onClick={() => window.location.href = '/settings/notifications'}
            >
              <div className="quick-icon">🔔</div>
              <div className="quick-title">通知设置</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              hoverable 
              className="quick-card"
              onClick={() => window.location.href = '/settings/privacy'}
            >
              <div className="quick-icon">🔒</div>
              <div className="quick-title">隐私保护</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              hoverable 
              className="quick-card"
              onClick={() => window.location.href = '/settings/data'}
            >
              <div className="quick-icon">📊</div>
              <div className="quick-title">数据管理</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              hoverable 
              className="quick-card"
              onClick={() => window.location.href = '/help'}
            >
              <div className="quick-icon">❓</div>
              <div className="quick-title">帮助中心</div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;

## 4. BadgeCard.tsx - 勋章卡片组件

// /src/app/components/business/BadgeCard.tsx
import React from 'react';
import { Card, Tooltip, Progress, Badge } from 'antd';
import { CrownOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';
import { Badge as BadgeType } from '../../types/badge';
import './BadgeCard.less';

interface BadgeCardProps {
  badge: BadgeType;
  isEarned: boolean;
  onClick: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, onClick }) => {
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <CrownOutlined style={{ color: '#ffd700' }} />;
      case 'epic':
        return <StarOutlined style={{ color: '#ff6bcb' }} />;
      case 'rare':
        return <StarOutlined style={{ color: '#1890ff' }} />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '学习成就': '#1890ff',
      '文化探索': '#52c41a',
      '社交互动': '#fa8c16',
      '创意制作': '#722ed1',
    };
    return colors[category] || '#d9d9d9';
  };

  return (
    <Tooltip 
      title={isEarned ? '已获得' : '未解锁'}
      placement="top"
    >
      <Card
        className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
        hoverable
        onClick={onClick}
        cover={
          <div className="badge-cover">
            <div className="badge-image-container">
              <img 
                src={badge.icon}
                alt={badge.title}
                className={`badge-image ${!isEarned ? 'locked' : ''}`}
              />
              {!isEarned && (
                <div className="lock-overlay">
                  <LockOutlined className="lock-icon" />
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className="badge-content">
          <div className="badge-header">
            <h3 className="badge-title">{badge.title}</h3>
            <div className="badge-meta">
              {getRarityIcon(badge.rarity)}
              <Badge 
                color={getCategoryColor(badge.category)}
                text={badge.category}
              />
            </div>
          </div>
          
          <p className="badge-description">
            {badge.description}
          </p>
          
          {!isEarned && badge.progress !== undefined && (
            <div className="progress-section">
              <Progress 
                percent={badge.progress}
                size="small"
                showInfo={false}
                strokeColor={getCategoryColor(badge.category)}
              />
              <div className="progress-text">
                进度: {badge.progress}%
              </div>
            </div>
          )}
          
          {isEarned && badge.earnedDate && (
            <div className="earned-info">
              <small>获得时间: {new Date(badge.earnedDate).toLocaleDateString()}</small>
            </div>
          )}
        </div>
      </Card>
    </Tooltip>
  );
};

export default BadgeCard;

## 5. CultureExplorer.tsx - 文化探索组件

// /src/app/components/business/CultureExplorer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, TileLayer, Marker, Popup, Circle,
  ZoomControl, LayersControl, FeatureGroup 
} from 'react-leaflet';
import { Card, Modal, Button, Tag, Space } from 'antd';
import { 
  EnvironmentOutlined, CameraOutlined, 
  InfoCircleOutlined, PlayCircleOutlined 
} from '@ant-design/icons';
import { cultureService } from '../../services/culture/cultureService';
import { CultureSite } from '../../types/culture';
import 'leaflet/dist/leaflet.css';
import './CultureExplorer.less';

// 修复Leaflet默认图标问题
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface CultureExplorerProps {
  onSiteSelect?: (siteId: string) => void;
}

const CultureExplorer: React.FC<CultureExplorerProps> = ({ onSiteSelect }) => {
  const [sites, setSites] = useState<CultureSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<CultureSite | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | '3d'>('map');
  const mapRef = useRef<any>(null);

  useEffect(() => {
    loadCulturalSites();
  }, []);

  const loadCulturalSites = async () => {
    const culturalSites = await cultureService.getCulturalSites();
    setSites(culturalSites);
  };

  const handleMarkerClick = (site: CultureSite) => {
    setSelectedSite(site);
    setModalVisible(true);
    if (onSiteSelect) {
      onSiteSelect(site.id);
    }
  };

  const handleARView = () => {
    if (selectedSite?.arModelUrl) {
      window.open(selectedSite.arModelUrl, '_blank');
    } else {
      // 如果AR模型未就绪，显示3D预览
      setViewMode('3d');
    }
  };

  const renderSiteType = (type: string) => {
    const typeColors: Record<string, string> = {
      '历史遗迹': 'volcano',
      '博物馆': 'blue',
      '公园': 'green',
      '非遗工坊': 'purple',
      '文化街区': 'orange',
    };
    return <Tag color={typeColors[type] || 'default'}>{type}</Tag>;
  };

  const center: [number, number] = [34.683, 112.467]; // 洛阳中心坐标

  return (
    <div className="culture-explorer">
      {/* 模式切换 */}
      <div className="explorer-mode-switch">
        <Button.Group>
          <Button 
            type={viewMode === 'map' ? 'primary' : 'default'}
            onClick={() => setViewMode('map')}
            icon={<EnvironmentOutlined />}
          >
            地图模式
          </Button>
          <Button 
            type={viewMode === '3d' ? 'primary' : 'default'}
            onClick={() => setViewMode('3d')}
            icon={<CameraOutlined />}
          >
            3D探索
          </Button>
        </Button.Group>
      </div>

      {viewMode === 'map' ? (
        <div className="map-container">
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="标准地图">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="卫星地图">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {sites.map(site => (
              <Marker
                key={site.id}
                position={[site.coordinates.lat, site.coordinates.lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(site),
                }}
              >
                <Popup>
                  <div className="site-popup">
                    <h4>{site.name}</h4>
                    <Space direction="vertical" size="small">
                      {renderSiteType(site.type)}
                      <div>{site.description}</div>
                      <Button 
                        size="small"
                        icon={<InfoCircleOutlined />}
                        onClick={() => {
                          window.open(`/culture/${site.id}`, '_blank');
                        }}
                      >
                        查看详情
                      </Button>
                    </Space>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* 文化区域覆盖 */}
            <FeatureGroup>
              <Circle
                center={[34.683, 112.467]}
                radius={5000}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
      ) : (
        <div className="three-d-container">
          {/* 3D模型查看器占位 */}
          <div className="model-viewer-placeholder">
            <div className="placeholder-content">
              <CameraOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <h3>3D文化探索</h3>
              <p>正在加载3D模型...</p>
              <p>支持龙门石窟、白马寺等文化遗址的虚拟游览</p>
              <Space>
                <Button type="primary" onClick={handleARView}>
                  AR体验
                </Button>
                <Button onClick={() => setViewMode('map')}>
                  返回地图
                </Button>
              </Space>
            </div>
          </div>
        </div>
      )}

      {/* 文化遗址详情弹窗 */}
      <Modal
        title={selectedSite?.name}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          selectedSite && (
            <Button 
              key="detail"
              type="primary"
              onClick={() => window.open(`/culture/${selectedSite.id}`, '_blank')}
            >
              查看详情
            </Button>
          ),
        ]}
        width={700}
      >
        {selectedSite && (
          <div className="site-detail">
            <div className="site-header">
              <img 
                src={selectedSite.mainImage} 
                alt={selectedSite.name}
                className="site-image"
              />
              <div className="site-info">
                <h3>{selectedSite.name}</h3>
                <Space>
                  {renderSiteType(selectedSite.type)}
                  <Tag color="geekblue">{selectedSite.era}时期</Tag>
                </Space>
                <p className="site-description">{selectedSite.fullDescription}</p>
                
                <div className="site-features">
                  <h4>特色功能</h4>
                  <Space wrap>
                    {selectedSite.hasAR && (
                      <Button size="small" icon={<CameraOutlined />}>
                        AR体验
                      </Button>
                    )}
                    {selectedSite.hasVR && (
                      <Button size="small" icon={<PlayCircleOutlined />}>
                        VR游览
                      </Button>
                    )}
                    {selectedSite.hasAudioGuide && (
                      <Button size="small">语音导览</Button>
                    )}
                    {selectedSite.hasInteractive && (
                      <Button size="small">互动问答</Button>
                    )}
                  </Space>
                </div>
              </div>
            </div>

            <div className="site-quick-facts">
              <h4>文化速览</h4>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div className="fact-item">
                    <div className="fact-label">建造年代</div>
                    <div className="fact-value">{selectedSite.builtYear}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="fact-item">
                    <div className="fact-label">文化价值</div>
                    <div className="fact-value">{selectedSite.culturalValue}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="fact-item">
                    <div className="fact-label">适合年龄</div>
                    <div className="fact-value">{selectedSite.suitableAge}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CultureExplorer;

## 6. MilestoneTracker.tsx - 里程碑追踪组件

// /src/app/components/business/MilestoneTracker.tsx
import React, { useState, useEffect } from 'react';
import { 
  Timeline, Card, Badge, Progress, 
  Tooltip, Row, Col, Space 
} from 'antd';
import { 
  CheckCircleOutlined, ClockCircleOutlined, 
  FireOutlined, TrophyOutlined 
} from '@ant-design/icons';
import { milestoneService } from '../../services/milestone/milestoneService';
import { Milestone } from '../../types/milestone';
import './MilestoneTracker.less';

interface MilestoneTrackerProps {
  childId?: string;
  filter?: 'upcoming' | 'completed' | 'all';
  onMilestoneClick?: (milestone: Milestone) => void;
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ 
  childId, 
  filter = 'all',
  onMilestoneClick 
}) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMilestones();
  }, [childId, filter]);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      let data: Milestone[] = [];
      
      if (childId) {
        data = await milestoneService.getChildMilestones(childId);
      } else {
        data = await milestoneService.getAllMilestones();
      }

      // 根据筛选条件过滤
      const filteredData = data.filter(milestone => {
        if (filter === 'completed') return milestone.status === 'completed';
        if (filter === 'upcoming') return milestone.status === 'upcoming';
        return true;
      });

      setMilestones(filteredData);
    } catch (error) {
      console.error('加载里程碑失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, isExpected: boolean) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in_progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'upcoming':
        return isExpected ? 
          <FireOutlined style={{ color: '#fa8c16' }} /> : 
          <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'green',
      'in_progress': 'blue',
      'upcoming': 'orange',
      'delayed': 'red',
    };
    return colors[status] || 'default';
  };

  const calculateProgress = (milestone: Milestone): number => {
    if (milestone.status === 'completed') return 100;
    if (milestone.progressData) {
      const { current, target } = milestone.progressData;
      return Math.min((current / target) * 100, 99);
    }
    return 0;
  };

  const renderMilestoneItem = (milestone: Milestone) => {
    const progress = calculateProgress(milestone);
    const isClickable = milestone.status === 'upcoming' || milestone.status === 'in_progress';

    return (
      <Timeline.Item
        key={milestone.id}
        dot={getStatusIcon(milestone.status, milestone.isExpected)}
        color={getStatusColor(milestone.status)}
      >
        <div 
          className={`milestone-item ${isClickable ? 'clickable' : ''}`}
          onClick={() => isClickable && onMilestoneClick && onMilestoneClick(milestone)}
        >
          <div className="milestone-header">
            <Space>
              <span className="milestone-title">{milestone.title}</span>
              <Badge 
                color={getStatusColor(milestone.status)}
                text={milestone.status === 'completed' ? '已完成' : 
                      milestone.status === 'in_progress' ? '进行中' : '待达成'}
              />
            </Space>
            {milestone.category && (
              <Tag color="blue">{milestone.category}</Tag>
            )}
          </div>
          
          <p className="milestone-description">{milestone.description}</p>
          
          <div className="milestone-details">
            <Space size="large">
              <span className="milestone-age">
                📅 适合年龄: {milestone.expectedAge}个月
              </span>
              {milestone.achievedDate && (
                <span className="achieved-date">
                  🏆 达成时间: {new Date(milestone.achievedDate).toLocaleDateString()}
                </span>
              )}
            </Space>
          </div>
          
          {(milestone.status === 'in_progress' || milestone.status === 'upcoming') && (
            <div className="progress-section">
              <div className="progress-header">
                <span>达成进度</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress 
                percent={progress}
                strokeColor={{
                  '0%': '#ff7875',
                  '100%': '#ff4d4f',
                }}
                size="small"
              />
            </div>
          )}
          
          {milestone.tips && milestone.status === 'upcoming' && (
            <div className="tips-section">
              <h5>💡 达成建议</h5>
              <p>{milestone.tips}</p>
            </div>
          )}
        </div>
      </Timeline.Item>
    );
  };

  const getCategoryStats = () => {
    const categories = ['大运动', '精细动作', '语言', '认知', '社交情感'];
    
    return categories.map(category => {
      const categoryMilestones = milestones.filter(m => m.category === category);
      const completed = categoryMilestones.filter(m => m.status === 'completed');
      
      return {
        category,
        total: categoryMilestones.length,
        completed: completed.length,
        progress: categoryMilestones.length > 0 ? 
          (completed.length / categoryMilestones.length) * 100 : 0,
      };
    });
  };

  if (loading) {
    return <div className="loading-placeholder">加载里程碑数据中...</div>;
  }

  return (
    <div className="milestone-tracker">
      {/* 统计概览 */}
      <div className="stats-overview">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <TrophyOutlined className="stat-icon" style={{ color: '#ff4d4f' }} />
                <div className="stat-info">
                  <div className="stat-value">
                    {milestones.filter(m => m.status === 'completed').length}
                  </div>
                  <div className="stat-label">已达成</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <ClockCircleOutlined className="stat-icon" style={{ color: '#1890ff' }} />
                <div className="stat-info">
                  <div className="stat-value">
                    {milestones.filter(m => m.status === 'in_progress').length}
                  </div>
                  <div className="stat-label">进行中</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <FireOutlined className="stat-icon" style={{ color: '#fa8c16' }} />
                <div className="stat-info">
                  <div className="stat-value">
                    {milestones.filter(m => m.status === 'upcoming').length}
                  </div>
                  <div className="stat-label">待达成</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <div className="stat-content">
                <CheckCircleOutlined className="stat-icon" style={{ color: '#52c41a' }} />
                <div className="stat-info">
                  <div className="stat-value">
                    {milestones.filter(m => m.isExpected).length}
                  </div>
                  <div className="stat-label">预期内</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 分类进度 */}
      <div className="category-progress">
        <h3>各领域发展进度</h3>
        <Row gutter={[16, 16]}>
          {getCategoryStats().map(stat => (
            <Col span={24} key={stat.category}>
              <div className="category-item">
                <div className="category-header">
                  <span className="category-name">{stat.category}</span>
                  <span className="category-count">
                    {stat.completed}/{stat.total}
                  </span>
                </div>
                <Progress 
                  percent={stat.progress}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 里程碑时间轴 */}
      <div className="milestone-timeline">
        <h3>里程碑时间线</h3>
        <Timeline mode="alternate">
          {milestones.map(milestone => renderMilestoneItem(milestone))}
        </Timeline>
      </div>

      {/* 成就庆祝 */}
      {milestones.some(m => m.status === 'completed' && m.recentlyCompleted) && (
        <div className="celebration-section">
          <div className="celebration-banner">
            <TrophyOutlined style={{ fontSize: 24, color: '#ffd700' }} />
            <span>恭喜！最近达成了{ 
              milestones.filter(m => m.status === 'completed' && m.recentlyCompleted).length 
            }个里程碑！</span>
            <TrophyOutlined style={{ fontSize: 24, color: '#ffd700' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;

## 7. AIChat.tsx - AI对话组件

// /src/app/components/business/AIChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Input, Button, List, Avatar, Spin, Popover, 
  Space, Tooltip, message 
} from 'antd';
import { 
  SendOutlined, UserOutlined, RobotOutlined, 
  AudioOutlined, SmileOutlined, PictureOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import { aiService } from '../../services/ai/aiService';
import { storageService } from '../../services/storage/storageService';
import { ChatMessage, AIConfig } from '../../types/ai';
import EmotionPicker from '../common/EmotionPicker';
import './AIChat.less';

const { TextArea } = Input;

interface AIChatProps {
  conversationId?: string;
  initialPrompt?: string;
  onMessageSend?: (message: ChatMessage) => void;
  onConversationUpdate?: (conversation: ChatMessage[]) => void;
}

const AIChat: React.FC<AIChatProps> = ({ 
  conversationId, 
  initialPrompt,
  onMessageSend,
  onConversationUpdate 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // 初始化对话
  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
    
    // 加载历史对话
    if (conversationId) {
      loadConversation(conversationId);
    }
    
    // 初始化语音识别
    initSpeechRecognition();
    
    // 加载AI配置
    const savedConfig = storageService.getAIConfig();
    if (savedConfig) {
      setAIConfig(savedConfig);
    }
    
    // 自动滚动到底部
    scrollToBottom();
  }, []);

  // 消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
    if (onConversationUpdate) {
      onConversationUpdate(messages);
    }
  }, [messages]);

  const loadConversation = async (convId: string) => {
    try {
      const history = await storageService.getConversation(convId);
      if (history) {
        setMessages(history);
      }
    } catch (error) {
      console.error('加载对话历史失败:', error);
    }
  };

  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        message.error('语音识别失败，请检查麦克风权限');
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // 添加用户消息
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    
    if (onMessageSend) {
      onMessageSend(userMessage);
    }
    
    // AI回复
    setIsLoading(true);
    try {
      const aiResponse = await aiService.chat({
        messages: updatedMessages,
        config: aiConfig,
      });
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        metadata: aiResponse.metadata,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 保存对话
      if (conversationId) {
        storageService.saveConversation(conversationId, [...updatedMessages, aiMessage]);
      }
    } catch (error) {
      console.error('AI回复失败:', error);
      message.error('AI回复失败，请稍后重试');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我暂时无法回复。请稍后再试。',
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      message.error('当前浏览器不支持语音识别');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      message.info('请开始说话...');
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    const emotionText = `[${emotion}] `;
    setInputText(prev => prev + emotionText);
    setShowEmotionPicker(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    message.success('对话已清空');
  };

  const renderMessageContent = (message: ChatMessage) => {
    if (message.content.includes('[image]')) {
      const imageUrl = message.content.replace('[image]', '').trim();
      return (
        <div className="message-image">
          <img src={imageUrl} alt="用户上传" />
        </div>
      );
    }
    
    if (message.metadata?.type === 'suggestion') {
      return (
        <div className="suggestion-message">
          <div className="suggestion-content">{message.content}</div>
          {message.metadata.suggestions && (
            <Space className="suggestion-actions" size="small">
              {message.metadata.suggestions.map((suggestion, index) => (
                <Button 
                  key={index}
                  size="small"
                  onClick={() => setInputText(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Space>
          )}
        </div>
      );
    }
    
    return <div className="message-text">{message.content}</div>;
  };

  return (
    <div className="ai-chat-container">
      {/* 聊天消息列表 */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <RobotOutlined style={{ fontSize: 48, color: '#722ed1' }} />
            <h3>我是小语AI助手</h3>
            <p>我可以帮您记录成长、解答问题、制定计划</p>
            <p>试试问我：</p>
            <ul className="suggestions">
              <li>"今天可以安排什么活动？"</li>
              <li>"如何培养孩子的专注力？"</li>
              <li>"讲一个关于洛阳的故事"</li>
            </ul>
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item className={`message-item ${msg.sender}`}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      className={`message-avatar ${msg.sender}`}
                    />
                  }
                  title={
                    <div className="message-header">
                      <span className="sender-name">
                        {msg.sender === 'user' ? '您' : '小语AI'}
                      </span>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  }
                  description={renderMessageContent(msg)}
                />
                {msg.isError && (
                  <span className="error-indicator">⚠</span>
                )}
              </List.Item>
            )}
          />
        )}
        
        {isLoading && (
          <div className="typing-indicator">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <span>小语正在思考...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 聊天输入区域 */}
      <div className="chat-input-area">
        <div className="input-tools">
          <Space>
            <Tooltip title="语音输入">
              <Button 
                type="text" 
                icon={<AudioOutlined />}
                onClick={handleVoiceInput}
                className={isRecording ? 'recording' : ''}
              />
            </Tooltip>
            
            <Popover
              content={
                <EmotionPicker 
                  onSelect={handleEmotionSelect}
                  emotions={['开心', '惊讶', '思考', '疑问', '庆祝']}
                />
              }
              trigger="click"
              visible={showEmotionPicker}
              onVisibleChange={setShowEmotionPicker}
            >
              <Tooltip title="添加表情">
                <Button type="text" icon={<SmileOutlined />} />
              </Tooltip>
            </Popover>
            
            <Tooltip title="上传图片">
              <Button 
                type="text" 
                icon={<PictureOutlined />}
                onClick={() => {
                  // 图片上传逻辑
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      // 上传图片并发送
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const imageUrl = event.target?.result as string;
                        const imageMessage: ChatMessage = {
                          id: Date.now().toString(),
                          content: `[image] ${imageUrl}`,
                          sender: 'user',
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, imageMessage]);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              />
            </Tooltip>
          </Space>
        </div>
        
        <TextArea
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="chat-textarea"
        />
        
        <div className="input-actions">
          <Space>
            <Button onClick={handleClearConversation} disabled={messages.length === 0}>
              清空对话
            </Button>
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={isLoading}
              disabled={!inputText.trim()}
            >
              发送
            </Button>
          </Space>
        </div>
      </div>

      {/* AI设置面板 */}
      <div className="ai-settings-panel">
        <div className="settings-header">
          <span>AI设置</span>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label>AI模型:</label>
            <select 
              value={aiConfig.model}
              onChange={(e) => setAIConfig({ ...aiConfig, model: e.target.value })}
            >
              <option value="gpt-4">GPT-4 (智能)</option>
              <option value="gpt-3.5">GPT-3.5 (快速)</option>
              <option value="claude">Claude (创意)</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>创造力: {aiConfig.temperature.toFixed(1)}</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={aiConfig.temperature}
              onChange={(e) => setAIConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
            />
            <span className="range-labels">
              <span>严谨</span>
              <span>平衡</span>
              <span>创意</span>
            </span>
          </div>
          
          <div className="setting-item">
            <label>回答长度:</label>
            <select 
              value={aiConfig.maxTokens}
              onChange={(e) => setAIConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
            >
              <option value="500">简短</option>
              <option value="1000">适中</option>
              <option value="2000">详细</option>
            </select>
          </div>
          
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              storageService.saveAIConfig(aiConfig);
              message.success('设置已保存');
            }}
          >
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

## 第三优先级：数据服务层

提供核心服务接口定义和实现框架，详细实现根据具体业务逻辑填充：

## 8. badgeService.ts - 勋章服务

// /src/services/badge/badgeService.ts
import { Badge, BadgeCategory, UnlockCondition } from '../../types/badge';
import { storageService } from '../storage/storageService';
import { userService } from '../user/userService';

class BadgeService {
  private readonly BADGE_STORAGE_KEY = 'user_badges';
  private readonly BADGE_CONFIG_KEY = 'badge_config';

  async getAllBadges(): Promise<Badge[]> {
    try {
      // 1. 从服务器获取勋章配置
      const response = await fetch('/api/badges');
      if (response.ok) {
        const badges = await response.json();
        await storageService.set(this.BADGE_CONFIG_KEY, badges);
        return badges;
      }
      
      // 2. 降级方案：从本地存储获取
      const localBadges = await storageService.get<Badge[]>(this.BADGE_CONFIG_KEY);
      if (localBadges) {
        return localBadges;
      }
      
      // 3. 返回默认勋章
      return this.getDefaultBadges();
    } catch (error) {
      console.error('获取勋章失败:', error);
      return this.getDefaultBadges();
    }
  }

  async getUserBadges(): Promise<Badge[]> {
    try {
      const userId = userService.getCurrentUserId();
      if (!userId) return [];
      
      // 1. 从服务器获取用户勋章
      const response = await fetch(`/api/users/${userId}/badges`);
      if (response.ok) {
        const badges = await response.json();
        await storageService.set(this.BADGE_STORAGE_KEY, badges);
        return badges;
      }
      
      // 2. 降级方案：从本地存储获取
      const localBadges = await storageService.get<Badge[]>(this.BADGE_STORAGE_KEY);
      return localBadges || [];
    } catch (error) {
      console.error('获取用户勋章失败:', error);
      return [];
    }
  }

  async checkUnlockConditions(userId: string): Promise<Badge[]> {
    try {
      const allBadges = await this.getAllBadges();
      const userBadges = await this.getUserBadges();
      const unlockedBadges: Badge[] = [];
      
      // 获取用户活动数据
      const userStats = await this.getUserStatistics(userId);
      
      for (const badge of allBadges) {
        // 如果已获得，跳过
        if (userBadges.some(b => b.id === badge.id)) continue;
        
        // 检查解锁条件
        const isUnlocked = badge.unlockConditions.every(condition => {
          return this.evaluateCondition(condition, userStats);
        });
        
        if (isUnlocked) {
          const earnedBadge: Badge = {
            ...badge,
            earnedDate: new Date().toISOString(),
            progress: 100,
          };
          
          unlockedBadges.push(earnedBadge);
          
          // 触发勋章获得事件
          await this.onBadgeUnlocked(earnedBadge, userId);
        }
      }
      
      return unlockedBadges;
    } catch (error) {
      console.error('检查解锁条件失败:', error);
      return [];
    }
  }

  async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/badges/${badgeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // 更新本地存储
        const currentBadges = await this.getUserBadges();
        const allBadges = await this.getAllBadges();
        const badgeToAward = allBadges.find(b => b.id === badgeId);
        
        if (badgeToAward) {
          const awardedBadge: Badge = {
            ...badgeToAward,
            earnedDate: new Date().toISOString(),
            progress: 100,
          };
          
          const updatedBadges = [...currentBadges, awardedBadge];
          await storageService.set(this.BADGE_STORAGE_KEY, updatedBadges);
          
          // 发送通知
          this.sendBadgeNotification(awardedBadge);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('颁发勋章失败:', error);
      return false;
    }
  }

  async getBadgeProgress(badgeId: string): Promise<number> {
    try {
      const userStats = await this.getUserStatistics();
      const allBadges = await this.getAllBadges();
      const badge = allBadges.find(b => b.id === badgeId);
      
      if (!badge) return 0;
      
      // 计算所有条件的平均进度
      let totalProgress = 0;
      let conditionCount = 0;
      
      for (const condition of badge.unlockConditions) {
        const progress = this.calculateConditionProgress(condition, userStats);
        totalProgress += progress;
        conditionCount++;
      }
      
      return conditionCount > 0 ? totalProgress / conditionCount : 0;
    } catch (error) {
      console.error('获取勋章进度失败:', error);
      return 0;
    }
  }

  private evaluateCondition(condition: UnlockCondition, stats: any): boolean {
    switch (condition.type) {
      case 'total_hours':
        return stats.totalLearningHours >= condition.value;
      case 'consecutive_days':
        return stats.consecutiveLearningDays >= condition.value;
      case 'completed_courses':
        return stats.completedCourses >= condition.value;
      case 'cultural_sites_visited':
        return stats.culturalSitesVisited >= condition.value;
      case 'interactions':
        return stats.socialInteractions >= condition.value;
      case 'creations':
        return stats.creativeWorks >= condition.value;
      default:
        return false;
    }
  }

  private calculateConditionProgress(condition: UnlockCondition, stats: any): number {
    const current = this.getStatValue(condition.type, stats);
    const target = condition.value;
    
    if (target === 0) return 100;
    return Math.min((current / target) * 100, 100);
  }

  private getStatValue(statType: string, stats: any): number {
    const statMap: Record<string, string> = {
      'total_hours': 'totalLearningHours',
      'consecutive_days': 'consecutiveLearningDays',
      'completed_courses': 'completedCourses',
      'cultural_sites_visited': 'culturalSitesVisited',
      'interactions': 'socialInteractions',
      'creations': 'creativeWorks',
    };
    
    const statKey = statMap[statType];
    return statKey ? stats[statKey] || 0 : 0;
  }

  private async getUserStatistics(userId?: string): Promise<any> {
    // 实现获取用户统计数据逻辑
    const userIdToUse = userId || userService.getCurrentUserId();
    
    try {
      const response = await fetch(`/api/users/${userIdToUse}/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('获取用户统计失败:', error);
    }
    
    // 返回默认统计数据
    return {
      totalLearningHours: 0,
      consecutiveLearningDays: 0,
      completedCourses: 0,
      culturalSitesVisited: 0,
      socialInteractions: 0,
      creativeWorks: 0,
    };
  }

  private async onBadgeUnlocked(badge: Badge, userId: string): Promise<void> {
    // 保存到服务器
    await this.awardBadge(userId, badge.id);
    
    // 发送推送通知
    this.sendBadgeNotification(badge);
    
    // 触发成就事件
    this.triggerAchievementEvent(badge);
  }

  private sendBadgeNotification(badge: Badge): void {
    // 实现通知逻辑
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 恭喜获得新勋章！', {
        body: `您获得了"${badge.title}"勋章！`,
        icon: badge.icon,
      });
    }
  }

  private triggerAchievementEvent(badge: Badge): void {
    // 触发自定义事件，供其他组件监听
    const event = new CustomEvent('badge-earned', {
      detail: { badge },
    });
    window.dispatchEvent(event);
  }

  private getDefaultBadges(): Badge[] {
    return [
      {
        id: 'beginner_learner',
        title: '学习新星',
        description: '连续学习3天',
        icon: '/badges/beginner.png',
        category: '学习成就',
        rarity: 'common',
        unlockConditions: [
          { type: 'consecutive_days', value: 3, description: '连续学习3天' }
        ]
      },
      // 更多默认勋章...
    ];
  }
}

export const badgeService = new BadgeService();

## 9. cultureService.ts - 文化内容服务

// /src/services/culture/cultureService.ts
import { CultureContent, CultureSite, CultureType } from '../../types/culture';
import { storageService } from '../storage/storageService';

class CultureService {
  private readonly CULTURE_STORAGE_KEY = 'culture_data';
  private readonly USER_PROGRESS_KEY = 'culture_progress';
  private readonly FAVORITES_KEY = 'culture_favorites';

  async getCultureList(options?: {
    type?: CultureType;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<CultureContent[]> {
    try {
      const queryParams = new URLSearchParams();
      if (options?.type) queryParams.append('type', options.type);
      if (options?.search) queryParams.append('search', options.search);
      if (options?.page) queryParams.append('page', options.page.toString());
      if (options?.pageSize) queryParams.append('pageSize', options.pageSize.toString());

      const response = await fetch(`/api/culture?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        await storageService.set(this.CULTURE_STORAGE_KEY, data);
        return data;
      }
    } catch (error) {
      console.error('获取文化列表失败:', error);
    }

    // 返回本地缓存或默认数据
    const cached = await storageService.get<CultureContent[]>(this.CULTURE_STORAGE_KEY);
    return cached || this.getDefaultCultureData();
  }

  async getCultureDetail(id: string): Promise<CultureContent | null> {
    try {
      // 从服务器获取详情
      const response = await fetch(`/api/culture/${id}`);
      if (response.ok) {
        const detail = await response.json();
        
        // 更新本地缓存
        const cachedList = await storageService.get<CultureContent[]>(this.CULTURE_STORAGE_KEY) || [];
        const index = cachedList.findIndex(item => item.id === id);
        if (index !== -1) {
          cachedList[index] = { ...cachedList[index], ...detail };
          await storageService.set(this.CULTURE_STORAGE_KEY, cachedList);
        }
        
        return detail;
      }
    } catch (error) {
      console.error('获取文化详情失败:', error);
    }

    // 从缓存中查找
    const cachedList = await storageService.get<CultureContent[]>(this.CULTURE_STORAGE_KEY);
    return cachedList?.find(item => item.id === id) || null;
  }

  async searchCultureContent(keyword: string): Promise<CultureContent[]> {
    try {
      const response = await fetch(`/api/culture/search?q=${encodeURIComponent(keyword)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('搜索文化内容失败:', error);
    }

    // 本地搜索
    const allCulture = await this.getCultureList();
    return allCulture.filter(item => 
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.description.toLowerCase().includes(keyword.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  async recordLearningProgress(contentId: string, progress: number): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      const progressData = {
        contentId,
        userId,
        progress,
        timestamp: new Date().toISOString(),
      };

      // 保存到服务器
      const response = await fetch('/api/culture/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (response.ok) {
        // 更新本地缓存
        const userProgress = await this.getUserProgress();
        const existingIndex = userProgress.findIndex(p => p.contentId === contentId);
        
        if (existingIndex !== -1) {
          userProgress[existingIndex] = progressData;
        } else {
          userProgress.push(progressData);
        }
        
        await storageService.set(this.USER_PROGRESS_KEY, userProgress);
        return true;
      }
    } catch (error) {
      console.error('记录学习进度失败:', error);
    }
    
    return false;
  }

  async getUserProgress(): Promise<any[]> {
    const cached = await storageService.get<any[]>(this.USER_PROGRESS_KEY);
    return cached || [];
  }

  async addFavorite(contentId: string): Promise<boolean> {
    try {
      const favorites = await this.getUserFavorites();
      
      if (!favorites.includes(contentId)) {
        favorites.push(contentId);
        await storageService.set(this.FAVORITES_KEY, favorites);
        
        // 同步到服务器
        await this.syncFavoritesToServer(favorites);
        return true;
      }
    } catch (error) {
      console.error('添加收藏失败:', error);
    }
    
    return false;
  }

  async removeFavorite(contentId: string): Promise<boolean> {
    try {
      let favorites = await this.getUserFavorites();
      favorites = favorites.filter(id => id !== contentId);
      
      await storageService.set(this.FAVORITES_KEY, favorites);
      
      // 同步到服务器
      await this.syncFavoritesToServer(favorites);
      return true;
    } catch (error) {
      console.error('移除收藏失败:', error);
    }
    
    return false;
  }

  async getUserFavorites(): Promise<string[]> {
    const cached = await storageService.get<string[]>(this.FAVORITES_KEY);
    return cached || [];
  }

  async getCulturalSites(): Promise<CultureSite[]> {
    try {
      const response = await fetch('/api/culture/sites');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('获取文化遗址失败:', error);
    }
    
    return this.getDefaultCulturalSites();
  }

  private async syncFavoritesToServer(favorites: string[]): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return;
      
      await fetch(`/api/users/${userId}/favorites`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorites }),
      });
    } catch (error) {
      console.error('同步收藏失败:', error);
    }
  }

  private getCurrentUserId(): string | null {
    // 实现获取当前用户ID的逻辑
    return localStorage.getItem('user_id');
  }

  private getDefaultCultureData(): CultureContent[] {
    return [
      {
        id: 'longmen_grottoes',
        title: '龙门石窟',
        type: 'site',
        description: '世界文化遗产，中国石刻艺术的瑰宝',
        difficultyLevel: 'intermediate',
        suitableAgeRange: [6, 99],
        // ... 其他属性
      },
      // 更多默认数据...
    ];
  }

  private getDefaultCulturalSites(): CultureSite[] {
    return [
      {
        id: 'longmen',
        name: '龙门石窟',
        type: '历史遗迹',
        coordinates: { lat: 34.558, lng: 112.470 },
        era: '北魏至唐',
        mainImage: '/sites/longmen.jpg',
        // ... 其他属性
      },
      // 更多默认数据...
    ];
  }
}

export const cultureService = new CultureService();

## 10. storageService.ts - 本地存储服务

// /src/services/storage/storageService.ts
import { encrypt, decrypt } from '../../utils/cryptoUtils';

interface StorageConfig {
  encryption: boolean;
  compression: boolean;
  version: string;
}

class StorageService {
  private config: StorageConfig = {
    encryption: true,
    compression: false,
    version: '1.0.0',
  };

  // LocalStorage 操作
  async set<T>(key: string, value: T, options?: { encrypt?: boolean }): Promise<void> {
    try {
      let data = JSON.stringify(value);
      
      // 如果需要压缩
      if (this.config.compression) {
        data = this.compress(data);
      }
      
      // 如果需要加密
      const shouldEncrypt = options?.encrypt ?? this.config.encryption;
      if (shouldEncrypt) {
        data = await encrypt(data);
      }
      
      localStorage.setItem(this.getStorageKey(key), data);
    } catch (error) {
      console.error(`存储数据失败 (key: ${key}):`, error);
      throw error;
    }
  }

  async get<T>(key: string, options?: { decrypt?: boolean }): Promise<T | null> {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      if (!data) return null;
      
      let processedData = data;
      
      // 如果需要解密
      const shouldDecrypt = options?.decrypt ?? this.config.encryption;
      if (shouldDecrypt) {
        processedData = await decrypt(processedData);
      }
      
      // 如果需要解压
      if (this.config.compression) {
        processedData = this.decompress(processedData);
      }
      
      return JSON.parse(processedData);
    } catch (error) {
      console.error(`获取数据失败 (key: ${key}):`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error(`删除数据失败 (key: ${key}):`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // 只清除应用相关的数据
      const prefix = this.getStoragePrefix();
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('清除本地存储失败:', error);
      throw error;
    }
  }

  // SessionStorage 操作
  async setSession<T>(key: string, value: T): Promise<void> {
    try {
      const data = JSON.stringify(value);
      sessionStorage.setItem(this.getStorageKey(key), data);
    } catch (error) {
      console.error(`存储会话数据失败 (key: ${key}):`, error);
      throw error;
    }
  }

  async getSession<T>(key: string): Promise<T | null> {
    try {
      const data = sessionStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`获取会话数据失败 (key: ${key}):`, error);
      return null;
    }
  }

  async removeSession(key: string): Promise<void> {
    try {
      sessionStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.error(`删除会话数据失败 (key: ${key}):`, error);
      throw error;
    }
  }

  // IndexedDB 操作 (可选)
  async initIndexedDB(dbName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建对象存储
        if (!db.objectStoreNames.contains('conversations')) {
          const store = db.createObjectStore('conversations', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('media_cache')) {
          const store = db.createObjectStore('media_cache', { keyPath: 'key' });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async saveToIndexedDB(storeName: string, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.initIndexedDB('muyu_storage', 1);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const request = store.put(data);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFromIndexedDB<T>(storeName: string, key: any): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.initIndexedDB('muyu_storage', 1);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        
        const request = store.get(key);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 高级功能：数据迁移
  async migrateData(oldVersion: string, newVersion: string): Promise<void> {
    console.log(`正在迁移数据从 ${oldVersion} 到 ${newVersion}`);
    
    // 根据版本号执行不同的迁移策略
    if (oldVersion === '1.0.0' && newVersion === '2.0.0') {
      await this.migrateFromV1ToV2();
    }
    
    // 更新配置版本
    this.config.version = newVersion;
    await this.set('storage_config', this.config);
  }

  // 数据清理
  async cleanupExpiredData(): Promise<void> {
    const now = Date.now();
    const expirationConfig = {
      'conversations': 30 * 24 * 60 * 60 * 1000, // 30天
      'temp_files': 24 * 60 * 60 * 1000, // 1天
      'cache': 7 * 24 * 60 * 60 * 1000, // 7天
    };
    
    for (const [key, ttl] of Object.entries(expirationConfig)) {
      const data = await this.get<any>(key);
      if (data && data.timestamp && now - data.timestamp > ttl) {
        await this.remove(key);
      }
    }
  }

  // 私有方法
  private getStorageKey(key: string): string {
    return `${this.getStoragePrefix()}_${key}`;
  }

  private getStoragePrefix(): string {
    return `muyu_${this.config.version}`;
  }

  private compress(data: string): string {
    // 简单的压缩实现，生产环境可以使用 lz-string 等库
    try {
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }

  private decompress(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data;
    }
  }

  private async migrateFromV1ToV2(): Promise<void> {
    // V1 到 V2 的数据迁移逻辑
    const oldKeys = ['user_data', 'app_settings', 'learning_progress'];
    
    for (const oldKey of oldKeys) {
      const data = localStorage.getItem(oldKey);
      if (data) {
        // 转换数据格式
        const newData = this.convertV1DataToV2(oldKey, JSON.parse(data));
        
        // 存储到新位置
        await this.set(oldKey, newData);
        
        // 删除旧数据
        localStorage.removeItem(oldKey);
      }
    }
  }

  private convertV1DataToV2(key: string, data: any): any {
    // 数据格式转换逻辑
    switch (key) {
      case 'user_data':
        return {
          ...data,
          metadata: {
            version: '2.0.0',
            migratedAt: new Date().toISOString(),
          },
        };
      case 'app_settings':
        return {
          settings: data,
          version: '2.0.0',
        };
      default:
        return data;
    }
  }
}

export const storageService = new StorageService();

## 11. analyticsService.ts - 数据分析服务

// /src/services/analytics/analyticsService.ts
import { storageService } from '../storage/storageService';

interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface GrowthData {
  learningStats: {
    totalHours: number;
    totalDays: number;
    todayStats: {
      minutes: number;
      activities: string[];
    };
    weekStats: {
      hours: number;
      days: number;
    };
    monthStats: {
      days: number;
      activitiesCompleted: number;
    };
  };
  cognitive: {
    progress: number;
    recentActivities: any[];
  };
  physical: {
    progress: number;
    recentActivities: any[];
  };
  social: {
    progress: number;
    recentActivities: any[];
  };
  cultural: {
    progress: number;
    recentActivities: any[];
  };
  recentMilestones: any[];
}

class AnalyticsService {
  private readonly ANALYTICS_KEY = 'analytics_events';
  private readonly SESSION_KEY = 'analytics_session';
  private sessionId: string = '';
  private eventsQueue: AnalyticsEvent[] = [];
  private isSending: boolean = false;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30秒

  constructor() {
    this.init();
  }

  private init(): void {
    // 初始化会话ID
    this.sessionId = this.getOrCreateSessionId();
    
    // 加载未发送的事件队列
    this.loadPendingEvents();
    
    // 设置定时刷新
    setInterval(() => this.flushEvents(), this.FLUSH_INTERVAL);
    
    // 页面卸载时发送剩余事件
    window.addEventListener('beforeunload', () => this.flushEvents(true));
  }

  trackEvent(eventName: string, eventData: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      eventName,
      eventData,
      timestamp: Date.now(),
      userId: this.getUserId(),
      sessionId: this.sessionId,
    };

    // 添加到队列
    this.eventsQueue.push(event);
    
    // 立即保存到本地存储
    this.savePendingEvents();
    
    // 如果队列达到批量大小，立即发送
    if (this.eventsQueue.length >= this.BATCH_SIZE) {
      this.flushEvents();
    }
    
    // 触发自定义事件供其他组件监听
    this.triggerAnalyticsEvent(event);
  }

  async trackUserBehavior(behavior: string, details: any): Promise<void> {
    this.trackEvent('user_behavior', {
      behavior,
      details,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    });
  }

  async trackLearningActivity(activityType: string, duration: number, metadata: any = {}): Promise<void> {
    this.trackEvent('learning_activity', {
      activityType,
      duration,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // 更新学习统计
    await this.updateLearningStats(activityType, duration);
  }

  async getGrowthData(childId?: string): Promise<GrowthData> {
    try {
      // 从服务器获取成长数据
      const url = childId ? `/api/analytics/growth/${childId}` : '/api/analytics/growth';
      const response = await fetch(url);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('获取成长数据失败:', error);
    }

    // 降级方案：从本地存储生成数据
    return this.generateLocalGrowthData();
  }

  async generateGrowthCurve(dataType: 'cognitive' | 'physical' | 'social' | 'cultural'): Promise<any[]> {
    try {
      // 从本地存储获取历史数据
      const historyKey = `growth_${dataType}_history`;
      const history = await storageService.get<any[]>(historyKey) || [];
      
      // 如果数据不足，生成模拟数据
      if (history.length < 10) {
        return this.generateMockGrowthData(dataType);
      }
      
      // 处理数据生成曲线
      return this.processGrowthData(history);
    } catch (error) {
      console.error('生成成长曲线失败:', error);
      return this.generateMockGrowthData(dataType);
    }
  }

  async getFeatureUsage(featureName: string, period: 'day' | 'week' | 'month'): Promise<number> {
    try {
      // 从服务器获取使用数据
      const response = await fetch(
        `/api/analytics/usage/${featureName}?period=${period}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.usageCount;
      }
    } catch (error) {
      console.error('获取功能使用数据失败:', error);
    }

    // 从本地事件队列计算
    return this.calculateLocalUsage(featureName, period);
  }

  private async flushEvents(force: boolean = false): Promise<void> {
    if (this.isSending || (!force && this.eventsQueue.length === 0)) {
      return;
    }

    this.isSending = true;
    
    try {
      const eventsToSend = [...this.eventsQueue];
      this.eventsQueue = [];
      
      // 发送到分析服务器
      const success = await this.sendEventsToServer(eventsToSend);
      
      if (!success) {
        // 发送失败，重新加入队列
        this.eventsQueue = [...eventsToSend, ...this.eventsQueue];
      }
      
      // 更新本地存储
      await this.savePendingEvents();
    } catch (error) {
      console.error('发送分析事件失败:', error);
      this.eventsQueue = [...this.eventsQueue]; // 保留事件
    } finally {
      this.isSending = false;
    }
  }

  private async sendEventsToServer(events: AnalyticsEvent[]): Promise<boolean> {
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          timestamp: Date.now(),
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('发送事件到服务器失败:', error);
      return false;
    }
  }

  private async savePendingEvents(): Promise<void> {
    await storageService.set('pending_analytics_events', this.eventsQueue);
  }

  private async loadPendingEvents(): Promise<void> {
    const pending = await storageService.get<AnalyticsEvent[]>('pending_analytics_events');
    if (pending) {
      this.eventsQueue = pending;
    }
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);
    
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }
    
    return sessionId;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getUserId(): string | undefined {
    // 实现获取用户ID的逻辑
    return localStorage.getItem('user_id') || undefined;
  }

  private async updateLearningStats(activityType: string, duration: number): Promise<void> {
    const statsKey = 'learning_stats';
    let stats = await storageService.get<any>(statsKey) || {
      totalHours: 0,
      totalDays: 0,
      today: { minutes: 0, activities: [] },
      week: { hours: 0, days: 0 },
      month: { days: 0, activitiesCompleted: 0 },
    };
    
    // 更新统计数据
    const hours = duration / 60;
    stats.totalHours += hours;
    
    // 今日统计
    const today = new Date().toDateString();
    if (stats.today.date !== today) {
      stats.today = { date: today, minutes: 0, activities: [] };
    }
    stats.today.minutes += duration;
    if (!stats.today.activities.includes(activityType)) {
      stats.today.activities.push(activityType);
    }
    
    // 保存更新后的统计
    await storageService.set(statsKey, stats);
  }

  private generateLocalGrowthData(): GrowthData {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return {
      learningStats: {
        totalHours: Math.floor(Math.random() * 100) + 50,
        totalDays: Math.floor(Math.random() * 30) + 10,
        todayStats: {
          minutes: Math.floor(Math.random() * 120) + 30,
          activities: ['阅读', '互动游戏', '文化学习'],
        },
        weekStats: {
          hours: Math.floor(Math.random() * 10) + 5,
          days: Math.floor(Math.random() * 5) + 2,
        },
        monthStats: {
          days: Math.floor(Math.random() * 20) + 8,
          activitiesCompleted: Math.floor(Math.random() * 50) + 20,
        },
      },
      cognitive: {
        progress: Math.floor(Math.random() * 30) + 70,
        recentActivities: [
          { name: '逻辑游戏', date: '2024-04-10', score: 85 },
          { name: '记忆训练', date: '2024-04-12', score: 78 },
        ],
      },
      physical: {
        progress: Math.floor(Math.random() * 40) + 60,
        recentActivities: [
          { name: '户外运动', date: '2024-04-09', duration: 45 },
          { name: '体操练习', date: '2024-04-11', duration: 30 },
        ],
      },
      social: {
        progress: Math.floor(Math.random() * 35) + 65,
        recentActivities: [
          { name: '小组活动', date: '2024-04-08', participants: 4 },
          { name: '角色扮演', date: '2024-04-13', participants: 3 },
        ],
      },
      cultural: {
        progress: Math.floor(Math.random() * 25) + 75,
        recentActivities: [
          { name: '河洛文化学习', date: '2024-04-07', topics: ['龙门石窟', '洛阳历史'] },
          { name: '传统手工艺', date: '2024-04-14', type: '剪纸' },
        ],
      },
      recentMilestones: [
        {
          title: '独立阅读',
          description: '能够独立阅读简短故事',
          date: '2024-04-05',
          category: '认知',
        },
        {
          title: '团队合作',
          description: '在小组活动中主动协作',
          date: '2024-04-03',
          category: '社交',
        },
      ],
    };
  }

  private generateMockGrowthData(dataType: string): any[] {
    const data = [];
    const now = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 生成模拟数据，带有一些随机波动和整体上升趋势
      const baseValue = 50;
      const trend = i * 0.3; // 上升趋势
      const noise = Math.random() * 20 - 10; // 随机波动
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, Math.min(100, baseValue + trend + noise)),
        dataType,
      });
    }
    
    return data;
  }

  private processGrowthData(history: any[]): any[] {
    // 数据平滑处理
    const smoothed = history.map((point, index) => {
      if (index === 0 || index === history.length - 1) {
        return point;
      }
      
      // 简单移动平均
      const prev = history[index - 1].value;
      const next = history[index + 1].value;
      const avg = (prev + point.value + next) / 3;
      
      return {
        ...point,
        value: Math.round(avg * 10) / 10,
      };
    });
    
    return smoothed;
  }

  private calculateLocalUsage(featureName: string, period: string): number {
    // 从本地事件队列计算使用次数
    const now = Date.now();
    let timeWindow = 0;
    
    switch (period) {
      case 'day':
        timeWindow = 24 * 60 * 60 * 1000;
        break;
      case 'week':
        timeWindow = 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        timeWindow = 30 * 24 * 60 * 60 * 1000;
        break;
    }
    
    const relevantEvents = this.eventsQueue.filter(event => {
      return event.eventName === 'user_behavior' &&
             event.eventData.behavior === featureName &&
             (now - event.timestamp) <= timeWindow;
    });
    
    return relevantEvents.length;
  }

  private triggerAnalyticsEvent(event: AnalyticsEvent): void {
    const customEvent = new CustomEvent('analytics-event', {
      detail: event,
    });
    window.dispatchEvent(customEvent);
  }
}

export const analyticsService = new AnalyticsService();

## 第四优先级：类型定义扩展

## 12. badge.ts - 勋章类型定义

// /src/types/badge.ts
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockConditions: UnlockCondition[];
  earnedDate?: string;
  progress?: number;
  metadata?: {
    points?: number; // 成就点
    version?: string; // 勋章版本
    createdAt?: string; // 创建时间
    updatedAt?: string; // 更新时间
  };
  animation?: string; // 解锁动画
  soundEffect?: string; // 音效
  shareContent?: {
    title: string;
    description: string;
    image: string;
  };
}

export type BadgeCategory = '学习成就' | '文化探索' | '社交互动' | '创意制作' | '健康习惯';

export interface UnlockCondition {
  type: 'total_hours' | 'consecutive_days' | 'completed_courses' | 
        'cultural_sites_visited' | 'interactions' | 'creations' | 
        'score' | 'perfect_score' | 'streak' | 'custom';
  value: number;
  description: string;
  progress?: number;
  unit?: string; // 单位，如：小时、天、次
}

export interface BadgeProgress {
  badgeId: string;
  current: number;
  target: number;
  percentage: number;
  lastUpdated: string;
}

export interface BadgeGroup {
  id: string;
  name: string;
  description: string;
  badges: string[]; // Badge IDs
  completionBadge?: string; // 完成所有后的特殊勋章
}

export interface BadgeStats {
  total: number;
  earned: number;
  byCategory: Record<BadgeCategory, number>;
  byRarity: Record<string, number>;
  totalPoints: number;
  recentBadges: Badge[];
}

## 13. culture.ts - 文化内容类型扩展

// /src/types/culture.ts
export interface CultureContent {
  id: string;
  title: string;
  description: string;
  type: CultureType;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  suitableAgeRange: [number, number]; // [minAge, maxAge]
  
  // 多媒体内容
  multimedia: {
    images: string[];
    videos?: string[];
    audio?: string[];
    ar?: string; // AR模型URL
    vr?: string; // VR体验URL
    panoramas?: string[]; // 全景图
  };
  
  // 交互元素
  interactiveElements: InteractiveElement[];
  
  // 关联内容
  relatedContent: string[]; // 相关文化内容ID
  knowledgePoints: KnowledgePoint[];
  
  // 位置信息
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
  
  // 时间信息
  historicalPeriod?: string;
  bestSeason?: string[];
  duration?: number; // 建议时长（分钟）
  
  // 学习进度
  userProgress?: {
    isLearned: boolean;
    learnedDate?: string;
    quizScore?: number;
    interactiveCompleted?: boolean;
    timeSpent?: number; // 分钟
  };
  
  // 元数据
  metadata: {
    tags: string[];
    popularity: number;
    createdAt: string;
    updatedAt: string;
  };
}

export type CultureType = 'site' | 'food' | 'festival' | 'story' | 'art' | 'music' | 'craft';

export interface InteractiveElement {
  type: 'quiz' | 'game' | 'craft' | 'exploration' | 'simulation';
  title: string;
  description: string;
  data: any; // 交互数据
  rewards?: {
    points: number;
    badges?: string[];
  };
}

export interface KnowledgePoint {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  options?: string[]; // 选择题选项
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface CultureSite extends CultureContent {
  type: 'site';
  historicalInfo: {
    builtYear?: string;
    dynasty?: string;
    historicalSignificance: string;
    conservationStatus?: string;
  };
  visitingInfo?: {
    openingHours?: string;
    ticketPrice?: string;
    bestTime?: string;
    facilities?: string[];
  };
  arModelUrl?: string;
  panoramaUrl?: string;
}

export interface CulturalCalendar {
  date: string;
  events: CulturalEvent[];
}

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  type: 'festival' | 'activity' | 'workshop';
  location: string;
  time: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationLink?: string;
}

## 14. activity.ts - 活动类型定义

// /src/types/activity.ts
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  
  // 时间信息
  startDate: string;
  endDate?: string;
  duration?: number; // 分钟
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6 表示周日至周六
  };
  
  // 参与信息
  participants?: Participant[];
  maxParticipants?: number;
  status: ActivityStatus;
  
  // 奖励
  rewards: Reward[];
  
  // 要求
  requirements?: Requirement[];
  
  // 进度
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  
  // 位置
  location?: {
    type: 'online' | 'onsite';
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    onlineLink?: string;
  };
  
  // 元数据
  metadata: {
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type ActivityType = 'task' | 'quiz' | 'challenge' | 'event' | 'workshop' | 'volunteer';

export type ActivityStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  role: 'organizer' | 'participant' | 'volunteer';
  joinedAt: string;
  progress?: number;
  completed?: boolean;
}

export interface Reward {
  type: 'points' | 'badge' | 'certificate' | 'physical';
  value: number | string; // 点数或勋章ID
  description: string;
  awarded?: boolean;
  awardedAt?: string;
}

export interface Requirement {
  type: 'age' | 'skill' | 'prerequisite' | 'equipment';
  description: string;
  value: any;
  isMet: boolean;
}

export interface ActivityFilter {
  type?: ActivityType;
  status?: ActivityStatus;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  difficulty?: string;
  tags?: string[];
}

export interface ActivityStats {
  totalActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  totalParticipants: number;
  totalPointsEarned: number;
  averageCompletionRate: number;
}

## 第五优先级：工具函数和辅助

## 1.  dateUtils.ts - 日期工具

// /src/utils/dateUtils.ts
/**
 * 日期工具类
 */
export class DateUtils {
  /**
   * 格式化日期
   * @param date 日期对象或字符串
   * @param format 格式模板，默认为 'YYYY-MM-DD'
   */
  static format(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const replacements: Record<string, string> = {
      'YYYY': d.getFullYear().toString(),
      'YY': d.getFullYear().toString().slice(-2),
      'MM': pad(d.getMonth() + 1),
      'M': (d.getMonth() + 1).toString(),
      'DD': pad(d.getDate()),
      'D': d.getDate().toString(),
      'HH': pad(d.getHours()),
      'H': d.getHours().toString(),
      'hh': pad(d.getHours() % 12 || 12),
      'h': (d.getHours() % 12 || 12).toString(),
      'mm': pad(d.getMinutes()),
      'm': d.getMinutes().toString(),
      'ss': pad(d.getSeconds()),
      's': d.getSeconds().toString(),
      'A': d.getHours() < 12 ? 'AM' : 'PM',
      'a': d.getHours() < 12 ? 'am' : 'pm',
      'dddd': this.getDayName(d, 'full'),
      'ddd': this.getDayName(d, 'short'),
      'dd': this.getDayName(d, 'min'),
    };
    
    return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a|dddd|ddd|dd/g, 
      match => replacements[match] || match);
  }
  
  /**
   * 计算年龄
   * @param birthDate 出生日期
   * @param referenceDate 参考日期，默认为当前日期
   */
  static calculateAge(birthDate: Date | string, referenceDate: Date = new Date()): number {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const ref = referenceDate;
    
    if (isNaN(birth.getTime())) {
      return 0;
    }
    
    let age = ref.getFullYear() - birth.getFullYear();
    const monthDiff = ref.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  
  /**
   * 计算月龄
   * @param birthDate 出生日期
   * @param referenceDate 参考日期
   */
  static calculateMonthAge(birthDate: Date, referenceDate: Date = new Date()): number {
    const months = (referenceDate.getFullYear() - birthDate.getFullYear()) * 12;
    return months + (referenceDate.getMonth() - birthDate.getMonth());
  }
  
  /**
   * 公历转农历
   * @param date 公历日期
   */
  static toLunar(date: Date): LunarDate {
    // 简化版农历转换，生产环境建议使用完整算法
    const lunarInfo = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      // ... 更多数据
    ];
    
    // 这里实现完整的农历转换算法
    return {
      year: 0,
      month: 0,
      day: 0,
      isLeap: false,
      zodiac: '',
      lunarMonthName: '',
      lunarDayName: '',
    };
  }
  
  /**
   * 计算时间差
   * @param start 开始时间
   * @param end 结束时间，默认为当前时间
   */
  static timeDifference(start: Date, end: Date = new Date()): TimeDifference {
    const diff = Math.abs(end.getTime() - start.getTime());
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    return {
      milliseconds: diff,
      seconds,
      minutes,
      hours,
      days,
      months,
      years,
      humanized: this.humanizeTimeDifference(diff),
    };
  }
  
  /**
   * 人性化时间差
   * @param milliseconds 毫秒数
   */
  static humanizeTimeDifference(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return '刚刚';
    }
  }
  
  /**
   * 获取星期名称
   * @param date 日期
   * @param format 格式：full, short, min
   */
  static getDayName(date: Date, format: 'full' | 'short' | 'min' = 'full'): string {
    const dayNames = {
      full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      short: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      min: ['日', '一', '二', '三', '四', '五', '六'],
    };
    
    return dayNames[format][date.getDay()];
  }
  
  /**
   * 获取月份名称
   * @param month 月份 (0-11)
   * @param format 格式：full, short
   */
  static getMonthName(month: number, format: 'full' | 'short' = 'full'): string {
    const monthNames = {
      full: ['一月', '二月', '三月', '四月', '五月', '六月', 
             '七月', '八月', '九月', '十月', '十一月', '十二月'],
      short: ['1月', '2月', '3月', '4月', '5月', '6月', 
              '7月', '8月', '9月', '10月', '11月', '12月'],
    };
    
    return monthNames[format][month];
  }
  
  /**
   * 获取季节
   * @param date 日期
   */
  static getSeason(date: Date): string {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return '春季';
    if (month >= 6 && month <= 8) return '夏季';
    if (month >= 9 && month <= 11) return '秋季';
    return '冬季';
  }
  
  /**
   * 获取节气
   * @param date 日期
   */
  static getSolarTerm(date: Date): string | null {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化版，实际需要完整算法
    const solarTerms = [
      { month: 2, day: 4, term: '立春' },
      { month: 2, day: 19, term: '雨水' },
      // ... 更多节气
    ];
    
    const term = solarTerms.find(st => st.month === month && st.day === day);
    return term ? term.term : null;
  }
  
  /**
   * 判断是否为节假日
   * @param date 日期
   */
  static isHoliday(date: Date): boolean {
    // 简化版，实际需要完整的节假日数据
    const holidays = [
      '01-01', // 元旦
      '01-01', // 春节（农历，需要转换）
      '04-04', // 清明
      '05-01', // 劳动节
      '06-01', // 儿童节
      '10-01', // 国庆节
    ];
    
    const dateStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return holidays.includes(dateStr);
  }
  
  /**
   * 获取日期范围
   * @param start 开始日期
   * @param end 结束日期
   */
  static getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }
  
  /**
   * 获取指定日期所在周的开始和结束
   * @param date 日期
   * @param startOfWeek 周的开始（0: 周日, 1: 周一）
   */
  static getWeekRange(date: Date, startOfWeek: number = 1): { start: Date; end: Date } {
    const current = new Date(date);
    const day = current.getDay();
    
    // 计算到本周开始的天数差
    const diff = day >= startOfWeek 
      ? day - startOfWeek 
      : 6 - startOfWeek + day + 1;
    
    const start = new Date(current);
    start.setDate(current.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }
  
  /**
   * 获取指定日期所在月份的开始和结束
   * @param date 日期
   */
  static getMonthRange(date: Date): { start: Date; end: Date } {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    
    return { start, end };
  }
}

// 类型定义
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  zodiac: string;
  lunarMonthName: string;
  lunarDayName: string;
}

export interface TimeDifference {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  months: number;
  years: number;
  humanized: string;
}

## 16. validationUtils.ts - 验证工具

// /src/utils/validationUtils.ts
/**
 * 验证工具类
 */
export class ValidationUtils {
  /**
   * 验证邮箱格式
   */
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * 验证手机号格式（中国）
   */
  static isChinesePhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }
  
  /**
   * 验证年龄范围
   */
  static isValidAge(age: number, min: number = 0, max: number = 120): boolean {
    return age >= min && age <= max;
  }
  
  /**
   * 验证出生日期
   */
  static isValidBirthDate(date: Date | string): boolean {
    const birthDate = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(birthDate.getTime())) {
      return false;
    }
    
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120); // 最大120岁
    
    return birthDate >= minDate && birthDate <= today;
  }
  
  /**
   * 验证密码强度
   */
  static isStrongPassword(password: string): {
    isValid: boolean;
    score: number; // 0-4
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];
    
    // 长度检查
    if (password.length >= 8) score++;
    else suggestions.push('密码长度至少8位');
    
    // 包含小写字母
    if (/[a-z]/.test(password)) score++;
    else suggestions.push('至少包含一个小写字母');
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) score++;
    else suggestions.push('至少包含一个大写字母');
    
    // 包含数字
    if (/\d/.test(password)) score++;
    else suggestions.push('至少包含一个数字');
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else suggestions.push('至少包含一个特殊字符');
    
    return {
      isValid: score >= 3,
      score,
      suggestions: score >= 3 ? [] : suggestions,
    };
  }
  
  /**
   * 验证用户名
   */
  static isValidUsername(username: string): {
    isValid: boolean;
    message?: string;
  } {
    // 长度检查
    if (username.length < 3 || username.length > 20) {
      return {
        isValid: false,
        message: '用户名长度应为3-20个字符',
      };
    }
    
    // 字符检查
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return {
        isValid: false,
        message: '用户名只能包含中文、英文、数字和下划线',
      };
    }
    
    // 敏感词检查
    const sensitiveWords = ['admin', 'root', 'system', '管理'];
    if (sensitiveWords.some(word => username.toLowerCase().includes(word))) {
      return {
        isValid: false,
        message: '用户名包含敏感词汇',
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * 验证URL格式
   */
  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * 验证文件类型
   */
  static isValidFileType(file: File, allowedTypes: string[]): boolean {
    const fileType = file.type.toLowerCase();
    return allowedTypes.some(type => fileType.includes(type.toLowerCase()));
  }
  
  /**
   * 验证文件大小
   */
  static isValidFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
  
  /**
   * 验证图片尺寸
   */
  static isValidImageDimensions(
    file: File, 
    maxWidth: number, 
    maxHeight: number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img.width <= maxWidth && img.height <= maxHeight);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      
      img.src = url;
    });
  }
  
  /**
   * 验证表单字段
   */
  static validateField(
    fieldName: string,
    value: any,
    rules: ValidationRule[]
  ): ValidationResult {
    const errors: string[] = [];
    
    for (const rule of rules) {
      const error = this.validateRule(rule, value, fieldName);
      if (error) {
        errors.push(error);
        if (rule.breakOnError) break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      fieldName,
      value,
    };
  }
  
  /**
   * 验证表单
   */
  static validateForm(
    formData: Record<string, any>,
    formRules: Record<string, ValidationRule[]>
  ): FormValidationResult {
    const results: Record<string, ValidationResult> = {};
    let isValid = true;
    
    for (const [fieldName, rules] of Object.entries(formRules)) {
      const value = formData[fieldName];
      const result = this.validateField(fieldName, value, rules);
      
      results[fieldName] = result;
      if (!result.isValid) {
        isValid = false;
      }
    }
    
    return {
      isValid,
      results,
      formData,
    };
  }
  
  /**
   * 验证规则
   */
  private static validateRule(
    rule: ValidationRule,
    value: any,
    fieldName: string
  ): string | null {
    switch (rule.type) {
      case 'required':
        if (!value && value !== 0 && value !== false) {
          return rule.message || `${fieldName}不能为空`;
        }
        break;
        
      case 'minLength':
        if (value && value.length < rule.value) {
          return rule.message || `${fieldName}长度不能少于${rule.value}个字符`;
        }
        break;
        
      case 'maxLength':
        if (value && value.length > rule.value) {
          return rule.message || `${fieldName}长度不能超过${rule.value}个字符`;
        }
        break;
        
      case 'min':
        if (value < rule.value) {
          return rule.message || `${fieldName}不能小于${rule.value}`;
        }
        break;
        
      case 'max':
        if (value > rule.value) {
          return rule.message || `${fieldName}不能大于${rule.value}`;
        }
        break;
        
      case 'pattern':
        if (value && !rule.pattern.test(value)) {
          return rule.message || `${fieldName}格式不正确`;
        }
        break;
        
      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          return rule.message || `${fieldName}验证失败`;
        }
        break;
    }
    
    return null;
  }
  
  /**
   * 过滤HTML标签
   */
  static stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
  
  /**
   * 过滤敏感词
   */
  static filterSensitiveWords(text: string, sensitiveWords: string[]): string {
    let filtered = text;
    sensitiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
  }
  
  /**
   * 验证身份证号（中国）
   */
  static isChineseIDCard(idCard: string): boolean {
    // 简化版，实际需要完整算法
    const idCardRegex = /^\d{17}[\dXx]$/;
    return idCardRegex.test(idCard);
  }
  
  /**
   * 验证银行卡号
   */
  static isBankCardNumber(cardNumber: string): boolean {
    // 使用Luhn算法验证
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
}

// 类型定义
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  pattern?: RegExp;
  message?: string;
  breakOnError?: boolean;
  validator?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldName: string;
  value: any;
}

export interface FormValidationResult {
  isValid: boolean;
  results: Record<string, ValidationResult>;
  formData: Record<string, any>;
}

## 第六优先级：Mock数据扩展

## 18. mockData.ts - 扩展Mock数据

// /src/data/mockData.ts
import { Badge, BadgeCategory } from '../types/badge';
import { CultureContent, CultureSite, CultureType } from '../types/culture';
import { Activity, ActivityType } from '../types/activity';
import { Milestone } from '../types/milestone';
import { User, GrowthData } from '../types/user';
import { Message, Conversation } from '../types/chat';

// 勋章数据
export const mockBadges: Badge[] = [
  {
    id: 'beginner_learner',
    title: '学习新星',
    description: '连续学习3天，培养良好的学习习惯',
    icon: '/badges/learning_star.png',
    category: '学习成就',
    rarity: 'common',
    unlockConditions: [
      { type: 'consecutive_days', value: 3, description: '连续学习3天' }
    ],
    earnedDate: '2024-04-10T10:30:00Z',
    progress: 100,
    metadata: {
      points: 10,
      version: '1.0',
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: 'culture_explorer',
    title: '河洛探索者',
    description: '探索5个河洛文化遗址',
    icon: '/badges/culture_explorer.png',
    category: '文化探索',
    rarity: 'rare',
    unlockConditions: [
      { type: 'cultural_sites_visited', value: 5, description: '探索5个文化遗址' }
    ],
    progress: 60,
    metadata: {
      points: 50,
      version: '1.0'
    }
  },
  {
    id: 'social_butterfly',
    title: '社交小达人',
    description: '完成10次社交互动活动',
    icon: '/badges/social_butterfly.png',
    category: '社交互动',
    rarity: 'common',
    unlockConditions: [
      { type: 'interactions', value: 10, description: '完成10次社交互动' }
    ],
    progress: 40,
    metadata: {
      points: 20,
      version: '1.0'
    }
  },
  {
    id: 'creative_artist',
    title: '创意艺术家',
    description: '创作5件创意作品',
    icon: '/badges/creative_artist.png',
    category: '创意制作',
    rarity: 'epic',
    unlockConditions: [
      { type: 'creations', value: 5, description: '创作5件作品' }
    ],
    progress: 20,
    metadata: {
      points: 100,
      version: '1.0'
    }
  },
  {
    id: 'longmen_expert',
    title: '龙门石窟专家',
    description: '深入学习龙门石窟文化知识',
    icon: '/badges/longmen_expert.png',
    category: '文化探索',
    rarity: 'legendary',
    unlockConditions: [
      { type: 'completed_courses', value: 1, description: '完成龙门石窟课程' },
      { type: 'score', value: 90, description: '测试得分90分以上' }
    ],
    earnedDate: '2024-04-12T14:20:00Z',
    progress: 100,
    metadata: {
      points: 200,
      version: '1.0'
    }
  }
];

// 文化内容数据
export const mockCultureContent: CultureContent[] = [
  {
    id: 'longmen_grottoes',
    title: '龙门石窟',
    description: '世界文化遗产，中国石刻艺术的瑰宝',
    type: 'site' as CultureType,
    difficultyLevel: 'intermediate',
    suitableAgeRange: [6, 99],
    multimedia: {
      images: [
        '/culture/longmen/1.jpg',
        '/culture/longmen/2.jpg',
        '/culture/longmen/3.jpg'
      ],
      videos: ['/culture/longmen/video.mp4'],
      ar: '/models/longmen.glb',
      panoramas: ['/panoramas/longmen/1.jpg']
    },
    interactiveElements: [
      {
        type: 'quiz',
        title: '龙门石窟知识问答',
        description: '测试你对龙门石窟的了解',
        data: { quizId: 'longmen_quiz_1' },
        rewards: { points: 50, badges: ['longmen_expert'] }
      },
      {
        type: 'game',
        title: '石窟修复小游戏',
        description: '体验文物修复的过程',
        data: { gameId: 'restoration_game' },
        rewards: { points: 30 }
      }
    ],
    relatedContent: ['baima_temple', 'luoyang_museum'],
    knowledgePoints: [
      {
        id: 'kp1',
        question: '龙门石窟建造于哪个朝代？',
        answer: '北魏至唐朝',
        explanation: '龙门石窟始凿于北魏孝文帝年间，历经东魏、西魏、北齐、隋、唐、五代、宋等朝代',
        difficulty: 'easy',
        category: '历史'
      },
      {
        id: 'kp2',
        question: '龙门石窟有多少个窟龛？',
        answer: '2345个',
        explanation: '龙门石窟现存窟龛2345个，造像10万余尊，碑刻题记2800余品',
        difficulty: 'medium',
        category: '艺术'
      }
    ],
    location: {
      name: '龙门石窟景区',
      coordinates: { lat: 34.558, lng: 112.470 },
      address: '河南省洛阳市洛龙区龙门中街'
    },
    historicalPeriod: '北魏至唐朝',
    bestSeason: ['春季', '秋季'],
    duration: 180,
    userProgress: {
      isLearned: true,
      learnedDate: '2024-04-10T15:30:00Z',
      quizScore: 95,
      interactiveCompleted: true,
      timeSpent: 120
    },
    metadata: {
      tags: ['世界文化遗产', '石刻艺术', '佛教艺术'],
      popularity: 9.5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z'
    }
  },
  {
    id: 'baima_temple',
    title: '白马寺',
    description: '中国第一古刹，佛教传入中国的第一座官办寺院',
    type: 'site' as CultureType,
    difficultyLevel: 'beginner',
    suitableAgeRange: [4, 99],
    multimedia: {
      images: [
        '/culture/baima/1.jpg',
        '/culture/baima/2.jpg'
      ],
      videos: ['/culture/baima/video.mp4'],
      ar: '/models/baima.glb'
    },
    interactiveElements: [
      {
        type: 'quiz',
        title: '白马寺历史问答',
        description: '了解白马寺的历史渊源',
        data: { quizId: 'baima_quiz_1' },
        rewards: { points: 40 }
      }
    ],
    relatedContent: ['longmen_grottoes'],
    knowledgePoints: [
      {
        id: 'kp1',
        question: '白马寺建于哪个朝代？',
        answer: '东汉',
        explanation: '白马寺创建于东汉永平十一年（公元68年）',
        difficulty: 'easy',
        category: '历史'
      }
    ],
    location: {
      name: '白马寺',
      coordinates: { lat: 34.733, lng: 112.467 },
      address: '河南省洛阳市洛龙区白马寺镇'
    },
    historicalPeriod: '东汉',
    bestSeason: ['春季', '秋季'],
    duration: 120,
    userProgress: {
      isLearned: false,
      timeSpent: 30
    },
    metadata: {
      tags: ['佛教', '古寺', '历史'],
      popularity: 8.7,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z'
    }
  },
  {
    id: 'luoyang_water_banquet',
    title: '洛阳水席',
    description: '千年传承的洛阳传统宴席',
    type: 'food' as CultureType,
    difficultyLevel: 'beginner',
    suitableAgeRange: [5, 99],
    multimedia: {
      images: [
        '/culture/food/water_banquet/1.jpg',
        '/culture/food/water_banquet/2.jpg'
      ],
      videos: ['/culture/food/water_banquet/video.mp4']
    },
    interactiveElements: [
      {
        type: 'craft',
        title: '模拟水席摆盘',
        description: '学习水席的摆盘艺术',
        data: { craftId: 'water_banquet_craft' },
        rewards: { points: 25 }
      }
    ],
    relatedContent: [],
    knowledgePoints: [
      {
        id: 'kp1',
        question: '洛阳水席有多少道菜？',
        answer: '24道菜',
        explanation: '洛阳水席共有24道菜，包括8个冷盘、4个大件、8个中件、4个压桌菜',
        difficulty: 'easy',
        category: '饮食文化'
      }
    ],
    location: {
      name: '洛阳老城区'
    },
    historicalPeriod: '唐代',
    duration: 60,
    metadata: {
      tags: ['饮食文化', '非遗', '传统宴席'],
      popularity: 7.8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-04-01T10:00:00Z'
    }
  }
];

// 文化遗址地图数据
export const mockCulturalSites: CultureSite[] = [
  {
    ...mockCultureContent[0] as CultureSite,
    historicalInfo: {
      builtYear: '493年',
      dynasty: '北魏至唐',
      historicalSignificance: '中国石刻艺术的最高峰',
      conservationStatus: '世界文化遗产'
    },
    visitingInfo: {
      openingHours: '08:00-18:30',
      ticketPrice: '90元',
      bestTime: '春季、秋季',
      facilities: ['停车场', '游客中心', '讲解服务']
    },
    arModelUrl: '/models/longmen.glb',
    panoramaUrl: '/panoramas/longmen/'
  },
  {
    ...mockCultureContent[1] as CultureSite,
    historicalInfo: {
      builtYear: '68年',
      dynasty: '东汉',
      historicalSignificance: '佛教传入中国的第一座官办寺院',
      conservationStatus: '全国重点文物保护单位'
    },
    visitingInfo: {
      openingHours: '07:30-19:00',
      ticketPrice: '35元',
      bestTime: '全年',
      facilities: ['停车场', '法物流通处']
    },
    arModelUrl: '/models/baima.glb'
  }
];

// 活动数据
export const mockActivities: Activity[] = [
  {
    id: 'spring_outing',
    type: 'event' as ActivityType,
    title: '春日户外活动',
    description: '组织孩子们进行户外探索和自然观察',
    startDate: '2024-04-20T09:00:00Z',
    endDate: '2024-04-20T16:00:00Z',
    duration: 420,
    participants: [
      {
        userId: 'user1',
        name: '沫语',
        avatar: '/avatars/muyu.png',
        role: 'participant',
        joinedAt: '2024-04-15T10:00:00Z'
      },
      {
        userId: 'user2',
        name: '小明',
        avatar: '/avatars/user2.png',
        role: 'participant',
        joinedAt: '2024-04-16T09:30:00Z'
      }
    ],
    maxParticipants: 20,
    status: 'scheduled',
    rewards: [
      { type: 'points', value: 100, description: '参与奖励' },
      { type: 'badge', value: 'outdoor_activity', description: '户外活动勋章' }
    ],
    requirements: [
      { type: 'age', description: '年龄3-12岁', value: { min: 3, max: 12 }, isMet: true }
    ],
    progress: {
      current: 2,
      target: 20,
      percentage: 10
    },
    location: {
      type: 'onsite',
      address: '洛阳市王城公园',
      coordinates: { lat: 34.683, lng: 112.467 }
    },
    metadata: {
      category: '户外活动',
      difficulty: 'easy',
      tags: ['户外', '自然', '探索'],
      createdBy: 'system',
      createdAt: '2024-04-01T09:00:00Z',
      updatedAt: '2024-04-01T09:00:00Z'
    }
  },
  {
    id: 'calligraphy_workshop',
    type: 'workshop' as ActivityType,
    title: '书法体验工作坊',
    description: '学习中国传统书法基础',
    startDate: '2024-04-25T14:00:00Z',
    endDate: '2024-04-25T16:30:00Z',
    duration: 150,
    participants: [
      {
        userId: 'user1',
        name: '沫语',
        avatar: '/avatars/muyu.png',
        role: 'participant',
        joinedAt: '2024-04-10T11:00:00Z'
      }
    ],
    maxParticipants: 15,
    status: 'scheduled',
    rewards: [
      { type: 'points', value: 80, description: '参与奖励' },
      { type: 'badge', value: 'calligraphy_beginner', description: '书法入门勋章' }
    ],
    requirements: [
      { type: 'age', description: '年龄6岁以上', value: { min: 6 }, isMet: true },
      { type: 'equipment', description: '自备毛笔和墨汁', value: ['毛笔', '墨汁'], isMet: true }
    ],
    progress: {
      current: 1,
      target: 15,
      percentage: 6.7
    },
    location: {
      type: 'onsite',
      address: '洛阳市文化馆',
      coordinates: { lat: 34.667, lng: 112.433 }
    },
    metadata: {
      category: '文化艺术',
      difficulty: 'medium',
      tags: ['书法', '传统文化', '艺术'],
      createdBy: 'teacher_wang',
      createdAt: '2024-04-05T10:00:00Z',
      updatedAt: '2024-04-05T10:00:00Z'
    }
  }
];

// 里程碑数据
export const mockMilestones: Milestone[] = [
  {
    id: 'milestone_1',
    title: '独立行走',
    description: '能够独立行走10步以上',
    category: '大运动',
    expectedAge: 12,
    actualAge: 13,
    status: 'completed',
    achievedDate: '2016-06-15T00:00:00Z',
    progressData: {
      current: 15,
      target: 10
    },
    tips: '多进行站立练习，鼓励宝宝自己尝试行走',
    isExpected: true,
    recentlyCompleted: false,
    metadata: {
      importance: 'high',
      categoryOrder: 1
    }
  },
  {
    id: 'milestone_2',
    title: '说出第一个词',
    description: '有意识地叫"妈妈"或"爸爸"',
    category: '语言',
    expectedAge: 12,
    actualAge: 11,
    status: 'completed',
    achievedDate: '2016-04-10T00:00:00Z',
    tips: '多与宝宝对话，重复简单的词语',
    isExpected: true,
    recentlyCompleted: false
  },
  {
    id: 'milestone_3',
    title: '认识5种颜色',
    description: '能够正确识别并说出5种基本颜色',
    category: '认知',
    expectedAge: 36,
    status: 'in_progress',
    progressData: {
      current: 3,
      target: 5
    },
    tips: '通过彩色玩具和绘本进行颜色认知训练',
    isExpected: true
  },
  {
    id: 'milestone_4',
    title: '完成20片拼图',
    description: '独立完成20片以上的拼图',
    category: '精细动作',
    expectedAge: 48,
    status: 'upcoming',
    progressData: {
      current: 0,
      target: 20
    },
    tips: '从简单拼图开始，逐渐增加难度',
    isExpected: true
  },
  {
    id: 'milestone_5',
    title: '分享玩具',
    description: '主动与其他小朋友分享玩具',
    category: '社交情感',
    expectedAge: 30,
    actualAge: 28,
    status: 'completed',
    achievedDate: '2018-11-20T00:00:00Z',
    tips: '鼓励分享行为，及时表扬',
    isExpected: true,
    recentlyCompleted: true
  }
];

// 用户数据
export const mockUser: User = {
  id: 'user1',
  name: '沫语',
  avatar: '/avatars/muyu.png',
  role: 'child',
  age: 8,
  birthday: '2016-05-10',
  bio: '热爱学习，喜欢探索河洛文化',
  email: 'muyu@example.com',
  phone: '13800138000',
  familyMembers: [
    {
      id: 'parent1',
      name: '张明',
      relationship: '父亲',
      avatar: '/avatars/father.png',
      isOnline: true
    },
    {
      id: 'parent2',
      name: '李华',
      relationship: '母亲',
      avatar: '/avatars/mother.png',
      isOnline: false
    }
  ],
  settings: {
    notifications: true,
    privacy: 'friends',
    language: 'zh-CN',
    theme: 'light',
    learningReminders: true,
    dataSharing: true
  },
  stats: {
    totalLearningHours: 156,
    consecutiveDays: 12,
    completedCourses: 24,
    earnedBadges: 15,
    totalPoints: 1250
  }
};

// 成长数据
export const mockGrowthData: GrowthData = {
  learningStats: {
    totalHours: 156,
    totalDays: 89,
    todayStats: {
      minutes: 45,
      activities: ['河洛文化学习', '数学练习', '阅读']
    },
    weekStats: {
      hours: 8.5,
      days: 5
    },
    monthStats: {
      days: 22,
      activitiesCompleted: 36
    }
  },
  cognitive: {
    progress: 78,
    recentActivities: [
      { name: '逻辑游戏', date: '2024-04-10', score: 85 },
      { name: '记忆训练', date: '2024-04-12', score: 78 }
    ]
  },
  physical: {
    progress: 82,
    recentActivities: [
      { name: '户外运动', date: '2024-04-09', duration: 45 },
      { name: '体操练习', date: '2024-04-11', duration: 30 }
    ]
  },
  social: {
    progress: 75,
    recentActivities: [
      { name: '小组活动', date: '2024-04-08', participants: 4 },
      { name: '角色扮演', date: '2024-04-13', participants: 3 }
    ]
  },
  cultural: {
    progress: 90,
    recentActivities: [
      { name: '河洛文化学习', date: '2024-04-07', topics: ['龙门石窟', '洛阳历史'] },
      { name: '传统手工艺', date: '2024-04-14', type: '剪纸' }
    ]
  },
  recentMilestones: [
    {
      title: '独立阅读',
      description: '能够独立阅读简短故事',
      date: '2024-04-05',
      category: '认知'
    },
    {
      title: '团队合作',
      description: '在小组活动中主动协作',
      date: '2024-04-03',
      category: '社交'
    }
  ],
  learningRecords: [
    {
      courseName: '河洛文化入门',
      duration: 60,
      completedAt: '2024-04-15T10:30:00Z',
      progress: 100
    },
    {
      courseName: '数学思维训练',
      duration: 45,
      completedAt: '2024-04-14T15:00:00Z',
      progress: 80
    }
  ]
};

// 聊天消息数据
export const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    sender: 'user',
    content: '今天可以安排什么活动？',
    timestamp: '2024-04-15T09:00:00Z',
    status: 'sent',
    metadata: {
      type: 'text'
    }
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    sender: 'ai',
    content: '根据沫语的学习进度和兴趣爱好，我建议今天可以：\n1. 30分钟河洛文化学习（龙门石窟）\n2. 20分钟数学思维训练\n3. 15分钟户外运动\n\n这样可以兼顾学习、文化和体能发展！',
    timestamp: '2024-04-15T09:01:00Z',
    status: 'delivered',
    metadata: {
      type: 'suggestion',
      suggestions: ['开始学习', '查看详细计划', '调整安排']
    }
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    sender: 'user',
    content: '可以讲讲龙门石窟的故事吗？',
    timestamp: '2024-04-15T09:02:00Z',
    status: 'sent',
    metadata: {
      type: 'text'
    }
  },
  {
    id: 'msg4',
    conversationId: 'conv1',
    sender: 'ai',
    content: '当然可以！龙门石窟始建于北魏时期，距今已有1500多年历史。这里有一个美丽的传说：相传龙门山原本是一座完整的山，后来被大禹治水时劈开，形成了伊河两岸的龙门石窟群。\n\n最著名的卢舍那大佛据说是按照武则天的容貌雕刻的，被称为"东方蒙娜丽莎"。',
    timestamp: '2024-04-15T09:03:00Z',
    status: 'delivered',
    metadata: {
      type: 'story'
    }
  }
];

// 对话数据
export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    title: '日常学习规划',
    participants: ['user1', 'ai_assistant'],
    lastMessage: mockMessages[3],
    unreadCount: 0,
    createdAt: '2024-04-15T09:00:00Z',
    updatedAt: '2024-04-15T09:03:00Z'
  },
  {
    id: 'conv2',
    title: '成长问题咨询',
    participants: ['user1', 'ai_assistant'],
    lastMessage: {
      id: 'msg5',
      conversationId: 'conv2',
      sender: 'ai',
      content: '培养专注力的建议已发送，请查收！',
      timestamp: '2024-04-14T16:30:00Z',
      status: 'delivered'
    },
    unreadCount: 1,
    createdAt: '2024-04-14T16:00:00Z',
    updatedAt: '2024-04-14T16:30:00Z'
  }
];

// 活动日历数据
export const mockActivityCalendar = [
  {
    date: '2024-04-20',
    events: [
      {
        id: 'spring_outing',
        title: '春日户外活动',
        type: 'event',
        time: '09:00-16:00',
        location: '王城公园'
      }
    ]
  },
  {
    date: '2024-04-25',
    events: [
      {
        id: 'calligraphy_workshop',
        title: '书法体验工作坊',
        type: 'workshop',
        time: '14:00-16:30',
        location: '文化馆'
      }
    ]
  }
];

// 统计数据
export const mockStats = {
  badges: {
    total: 25,
    earned: 15,
    byCategory: {
      '学习成就': 6,
      '文化探索': 4,
      '社交互动': 3,
      '创意制作': 2
    },
    byRarity: {
      'common': 8,
      'rare': 4,
      'epic': 2,
      'legendary': 1
    },
    totalPoints: 1250
  },
  learning: {
    totalHours: 156,
    averageDaily: 1.8,
    streakDays: 12,
    completedCourses: 24
  },
  culture: {
    visitedSites: 8,
    learnedContents: 12,
    completedQuizzes: 15
  }
};

// 生成模拟数据的工具函数
export const generateMockData = {
  // 生成随机用户
  generateUser: (id: string): User => ({
    id,
    name: `用户${id}`,
    avatar: `/avatars/user${id}.png`,
    role: 'child',
    age: Math.floor(Math.random() * 8) + 3,
    birthday: `201${Math.floor(Math.random() * 5) + 5}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    bio: '热爱学习和探索',
    email: `user${id}@example.com`,
    phone: '13800138000',
    familyMembers: [
      {
        id: 'parent1',
        name: '父亲',
        relationship: '父亲',
        avatar: '/avatars/father.png',
        isOnline: Math.random() > 0.5
      }
    ],
    settings: {
      notifications: true,
      privacy: 'friends',
      language: 'zh-CN',
      theme: 'light',
      learningReminders: true,
      dataSharing: false
    },
    stats: {
      totalLearningHours: Math.floor(Math.random() * 200),
      consecutiveDays: Math.floor(Math.random() * 30),
      completedCourses: Math.floor(Math.random() * 30),
      earnedBadges: Math.floor(Math.random() * 20),
      totalPoints: Math.floor(Math.random() * 2000)
    }
  }),

  // 生成随机勋章
  generateBadge: (id: string): Badge => {
    const categories: BadgeCategory[] = ['学习成就', '文化探索', '社交互动', '创意制作'];
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    return {
      id: `badge_${id}`,
      title: `${category}勋章${id}`,
      description: `获得${category}勋章${id}的成就`,
      icon: `/badges/${category.toLowerCase()}_${id}.png`,
      category,
      rarity: rarity as any,
      unlockConditions: [
        {
          type: 'total_hours',
          value: Math.floor(Math.random() * 50) + 10,
          description: `累计学习${Math.floor(Math.random() * 50) + 10}小时`
        }
      ],
      progress: Math.floor(Math.random() * 100),
      metadata: {
        points: Math.floor(Math.random() * 100) + 10
      }
    };
  },

  // 生成模拟学习记录
  generateLearningRecords: (count: number) => {
    const records = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      records.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 120) + 30,
        activities: ['阅读', '数学', '文化学习'].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }
    
    return records;
  },

  // 生成模拟成长曲线数据
  generateGrowthCurve: (dataType: string, days: number = 90) => {
    const data = [];
    const now = new Date();
    const baseValue = 50;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 模拟成长趋势：逐渐上升，加上一些随机波动
      const trend = i * 0.3;
      const noise = Math.random() * 10 - 5;
      const value = Math.max(0, Math.min(100, baseValue + trend + noise));
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 10) / 10,
        dataType
      });
    }
    
    return data;
  }
};

// 导出所有数据
export default {
  mockBadges,
  mockCultureContent,
  mockCulturalSites,
  mockActivities,
  mockMilestones,
  mockUser,
  mockGrowthData,
  mockMessages,
  mockConversations,
  mockActivityCalendar,
  mockStats,
  generateMockData
};

## 第七优先级：样式文件

由于篇幅限制，这里提供几个关键组件的样式文件示例：

## 19. BadgesPage.less - 勋章页面样式

// /src/app/components/pages/BadgesPage.less
@import '~antd/lib/style/themes/default.less';

.badges-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  
  .page-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    h1 {
      margin: 0 0 16px 0;
      font-size: 32px;
      color: #1890ff;
      display: flex;
      align-items: center;
      gap: 12px;
      
      .anticon {
        font-size: 36px;
        color: #ffd700;
      }
    }
    
    .header-stats {
      display: flex;
      gap: 40px;
      
      .stat-item {
        text-align: center;
        
        .stat-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #1890ff;
        }
      }
    }
  }
  
  .category-progress {
    margin-bottom: 24px;
    
    .category-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
      
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .category-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
        
        .category-count {
          font-weight: bold;
          color: #1890ff;
        }
      }
    }
  }
  
  .badge-filter {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    
    .ant-tabs-nav {
      margin: 0;
      
      .ant-tabs-tab {
        padding: 8px 16px;
        font-size: 14px;
        
        &:hover {
          color: #1890ff;
        }
        
        &.ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: #1890ff;
            font-weight: 500;
          }
        }
      }
      
      .ant-tabs-ink-bar {
        background: #1890ff;
      }
    }
  }
  
  .badges-grid {
    background: white;
    border-radius: 12px;
    padding: 24px;
    
    .ant-row {
      margin: -8px;
      
      .ant-col {
        padding: 8px;
      }
    }
    
    .badge-card {
      border: 2px solid #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
      
      &.earned {
        border-color: #52c41a;
        
        &:hover {
          border-color: #73d13d;
          box-shadow: 0 8px 24px rgba(82, 196, 26, 0.15);
        }
      }
      
      &.locked {
        opacity: 0.7;
        
        &:hover {
          opacity: 0.9;
        }
      }
      
      .ant-card-cover {
        padding: 24px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        text-align: center;
        
        .badge-image-container {
          position: relative;
          display: inline-block;
          
          .badge-image {
            width: 80px;
            height: 80px;
            transition: all 0.3s ease;
            
            &.locked {
              filter: grayscale(1);
              opacity: 0.6;
            }
          }
          
          .lock-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            
            .lock-icon {
              font-size: 24px;
              color: white;
            }
          }
        }
      }
      
      .ant-card-body {
        padding: 16px;
        
        .badge-header {
          margin-bottom: 12px;
          
          .badge-title {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
          
          .badge-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .ant-badge {
              font-size: 12px;
            }
          }
        }
        
        .badge-description {
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        
        .progress-section {
          margin-top: 12px;
          
          .progress-text {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 4px;
          }
        }
        
        .earned-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
          
          small {
            font-size: 11px;
            color: #999;
          }
        }
      }
    }
  }
  
  .badge-detail {
    .badge-detail-header {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      
      .badge-large-icon {
        width: 120px;
        height: 120px;
        object-fit: contain;
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .badge-info {
        flex: 1;
        
        .badge-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          
          .rarity {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            
            &.rarity-common {
              background: #f0f0f0;
              color: #666;
            }
            
            &.rarity-rare {
              background: #e6f7ff;
              color: #1890ff;
            }
            
            &.rarity-epic {
              background: #f9f0ff;
              color: #722ed1;
            }
            
            &.rarity-legendary {
              background: #fff7e6;
              color: #fa8c16;
            }
          }
        }
        
        .badge-description {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
      }
    }
    
    .badge-unlock-conditions {
      margin-bottom: 24px;
      
      h4 {
        margin-bottom: 16px;
        color: #333;
      }
      
      .condition-item {
        padding: 12px 16px;
        border-radius: 8px;
        background: #fafafa;
        margin-bottom: 8px;
        transition: all 0.3s ease;
        
        &.completed {
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          
          .condition-content {
            .condition-icon {
              color: #52c41a;
            }
          }
        }
        
        .condition-content {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          
          .condition-icon {
            font-size: 16px;
            width: 24px;
            text-align: center;
          }
          
          .condition-text {
            flex: 1;
            font-size: 14px;
            color: #333;
          }
        }
        
        .condition-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .ant-progress {
            flex: 1;
          }
          
          .progress-text {
            font-size: 12px;
            color: #999;
            min-width: 60px;
          }
        }
      }
    }
    
    .badge-earned-info {
      h4 {
        margin-bottom: 8px;
        color: #333;
      }
      
      p {
        color: #666;
        margin: 0;
      }
    }
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .badges-page {
    padding: 12px;
    
    .page-header {
      padding: 20px 16px;
      
      h1 {
        font-size: 24px;
        
        .anticon {
          font-size: 28px;
        }
      }
      
      .header-stats {
        flex-wrap: wrap;
        gap: 16px;
        
        .stat-item {
          .stat-value {
            font-size: 24px;
          }
        }
      }
    }
    
    .badge-detail-header {
      flex-direction: column;
      text-align: center;
      gap: 16px;
      
      .badge-large-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }
    }
    
    .badges-grid {
      padding: 12px;
      
      .ant-row {
        margin: -4px;
        
        .ant-col {
          padding: 4px;
        }
      }
    }
  }
}

## 20. CultureDetailPage.less - 文化详情页样式

// /src/app/components/pages/CultureDetailPage.less
@import '~antd/lib/style/themes/default.less';

.culture-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .culture-header {
    position: relative;
    height: 400px;
    overflow: hidden;
    border-radius: 0 0 24px 24px;
    
    .culture-carousel {
      height: 100%;
      
      .carousel-image {
        height: 400px;
        background-size: cover;
        background-position: center;
      }
      
      .slick-dots {
        bottom: 24px;
        
        li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          
          &::before {
            display: none;
          }
        }
        
        li.slick-active button {
          background: white;
          width: 24px;
          border-radius: 6px;
        }
      }
    }
    
    .culture-header-overlay {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 2;
    }
  }
  
  .culture-info-section {
    background: white;
    border-radius: 20px;
    margin: -60px 24px 24px;
    padding: 32px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    .culture-title {
      margin: 0 0 16px 0;
      font-size: 32px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 12px;
      
      .ant-tag {
        font-size: 14px;
        padding: 4px 12px;
        border-radius: 16px;
      }
    }
    
    .culture-description {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .culture-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      
      span {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        
        .anticon {
          color: #1890ff;
        }
      }
    }
    
    .ant-space {
      width: 100%;
      
      .ant-btn {
        height: 48px;
        border-radius: 12px;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        
        &.ar-experience-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }
        }
      }
    }
  }
  
  .culture-content-tabs {
    background: white;
    border-radius: 20px;
    margin: 0 24px 24px;
    padding: 32px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    .ant-tabs {
      .ant-tabs-nav {
        margin-bottom: 24px;
        
        .ant-tabs-tab {
          padding: 12px 24px;
          font-size: 16px;
          
          &:hover {
            color: #1890ff;
          }
          
          &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: #1890ff;
              font-weight: 500;
            }
          }
        }
        
        .ant-tabs-ink-bar {
          background: #1890ff;
          height: 3px;
        }
      }
      
      .tab-content {
        .detailed-content {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
          
          h2, h3, h4 {
            color: #1890ff;
            margin-top: 24px;
            margin-bottom: 16px;
          }
          
          p {
            margin-bottom: 16px;
          }
          
          img {
            max-width: 100%;
            border-radius: 12px;
            margin: 16px 0;
          }
        }
        
        .knowledge-answer {
          padding: 16px;
          background: #f6ffed;
          border-radius: 8px;
          border: 1px solid #b7eb8f;
          
          p {
            margin: 0 0 8px 0;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
          
          .explanation {
            padding-top: 8px;
            border-top: 1px solid #b7eb8f;
          }
        }
        
        .interactive-quiz {
          text-align: center;
          padding: 32px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          margin-top: 24px;
          
          h3 {
            margin-bottom: 8px;
            color: #333;
          }
          
          p {
            color: #666;
            margin-bottom: 16px;
          }
          
          .ant-btn {
            height: 48px;
            padding: 0 32px;
            border-radius: 24px;
            font-size: 16px;
          }
        }
        
        .ant-card {
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          
          &:hover {
            border-color: #1890ff;
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
            
            .ant-card-head-title {
              color: #1890ff;
            }
          }
          
          .ant-card-cover {
            .related-image {
              background-size: cover;
              background-position: center;
            }
          }
        }
      }
    }
  }
  
  .learning-progress {
    background: white;
    border-radius: 20px;
    margin: 0 24px 24px;
    padding: 32px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    h3 {
      margin-bottom: 24px;
      color: #333;
      font-size: 20px;
    }
    
    .progress-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 50px;
        right: 50px;
        height: 4px;
        background: #f0f0f0;
        z-index: 1;
      }
      
      .step {
        position: relative;
        z-index: 2;
        text-align: center;
        flex: 1;
        
        &::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 4px;
          background: #f0f0f0;
          z-index: -1;
        }
        
        &:first-child::before {
          left: 50%;
          width: 50%;
        }
        
        &:last-child::before {
          right: 50%;
          width: 50%;
          left: auto;
        }
        
        &.active, &.completed {
          .step-icon {
            background: #1890ff;
            color: white;
            border-color: #1890ff;
          }
          
          .step-content {
            h4, p {
              color: #333;
            }
          }
        }
        
        &.completed {
          .step-icon {
            background: #52c41a;
            border-color: #52c41a;
          }
        }
        
        .step-icon {
          width: 48px;
          height: 48px;
          background: white;
          border: 4px solid #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 18px;
          font-weight: bold;
          color: #999;
          transition: all 0.3s ease;
        }
        
        .step-content {
          h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 500;
            color: #999;
          }
          
          p {
            margin: 0;
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .culture-detail-page {
    .culture-header {
      height: 300px;
      
      .culture-carousel {
        .carousel-image {
          height: 300px;
        }
      }
    }
    
    .culture-info-section {
      margin: -40px 16px 16px;
      padding: 24px 16px;
      
      .culture-title {
        font-size: 24px;
      }
      
      .culture-meta {
        gap: 16px;
      }
      
      .ant-col {
        width: 100%;
      }
    }
    
    .culture-content-tabs {
      margin: 0 16px 16px;
      padding: 24px 16px;
      
      .ant-tabs {
        .ant-tabs-nav {
          overflow-x: auto;
          white-space: nowrap;
          
          .ant-tabs-tab {
            padding: 8px 16px;
            font-size: 14px;
          }
        }
      }
    }
    
    .learning-progress {
      margin: 0 16px 16px;
      padding: 24px 16px;
      
      .progress-steps {
        flex-direction: column;
        gap: 24px;
        
        &::before {
          display: none;
        }
        
        .step {
          display: flex;
          align-items: center;
          text-align: left;
          gap: 16px;
          
          &::before {
            display: none;
          }
          
          .step-icon {
            margin: 0;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}

## 21. AIChat.less - AI对话组件样式

// /src/app/components/business/AIChat.less
@import '~antd/lib/style/themes/default.less';

.ai-chat-container {
  display: flex;
  height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  
  .chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    
    .welcome-message {
      text-align: center;
      padding: 60px 20px;
      
      .anticon {
        margin-bottom: 24px;
      }
      
      h3 {
        margin-bottom: 16px;
        color: #333;
        font-size: 24px;
      }
      
      p {
        color: #666;
        margin-bottom: 12px;
        font-size: 16px;
      }
      
      .suggestions {
        list-style: none;
        padding: 0;
        margin: 24px 0 0 0;
        
        li {
          display: inline-block;
          margin: 8px;
          padding: 8px 16px;
          background: white;
          border-radius: 20px;
          color: #1890ff;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          
          &:hover {
            background: #1890ff;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
    
    .message-item {
      padding: 12px 0;
      border-bottom: none !important;
      
      &.user {
        .message-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .sender-name {
          color: #667eea;
        }
      }
      
      &.ai {
        .message-avatar {
          background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
        }
        
        .sender-name {
          color: #52c41a;
        }
      }
      
      .message-avatar {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .anticon {
          color: white;
          font-size: 18px;
        }
      }
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .sender-name {
          font-weight: 500;
          font-size: 14px;
        }
        
        .message-time {
          font-size: 12px;
          color: #999;
        }
      }
      
      .message-text {
        padding: 12px 16px;
        background: white;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 12px;
          left: -8px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 8px 8px 8px 0;
          border-color: transparent white transparent transparent;
        }
      }
      
      &.ai .message-text {
        background: #f6ffed;
        
        &::before {
          border-color: transparent #f6ffed transparent transparent;
        }
      }
      
      .suggestion-message {
        .suggestion-content {
          padding: 12px 16px;
          background: #f6ffed;
          border-radius: 12px 12px 0 0;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }
        
        .suggestion-actions {
          padding: 12px 16px;
          background: #e6f7ff;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #bae7ff;
          
          .ant-btn {
            border-radius: 16px;
            font-size: 12px;
            padding: 2px 12px;
          }
        }
      }
      
      .message-image {
        img {
          max-width: 200px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
      
      .error-indicator {
        color: #ff4d4f;
        font-size: 16px;
        margin-left: 8px;
      }
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-top: 12px;
      
      span {
        color: #666;
        font-size: 14px;
      }
    }
  }
  
  .chat-input-area {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid #f0f0f0;
    background: white;
    
    .input-tools {
      padding: 12px 24px;
      border-bottom: 1px solid #f0f0f0;
      
      .ant-btn {
        border: none;
        box-shadow: none;
        
        &:hover {
          background: #f5f5f5;
        }
        
        &.recording {
          color: #ff4d4f;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      }
    }
    
    .chat-textarea {
      flex: 1;
      border: none;
      padding: 24px;
      font-size: 14px;
      resize: none;
      outline: none;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .input-actions {
      padding: 12px 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
      
      .ant-btn {
        border-radius: 20px;
        padding: 6px 24px;
        
        &[type="primary"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
          
          &:disabled {
            background: #f5f5f5;
            color: #999;
            transform: none;
            box-shadow: none;
          }
        }
      }
    }
  }
  
  .ai-settings-panel {
    width: 280px;
    background: white;
    border-left: 1px solid #f0f0f0;
    padding: 24px;
    overflow-y: auto;
    
    .settings-header {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .settings-content {
      .setting-item {
        margin-bottom: 24px;
        
        label {
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
        }
        
        select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          
          &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
        }
        
        input[type="range"] {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #f0f0f0;
          outline: none;
          
          &::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1890ff;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        }
        
        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
      }
      
      .ant-btn-link {
        padding: 0;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: @screen-sm) {
  .ai-chat-container {
    flex-direction: column;
    height: auto;
    max-height: 80vh;
    
    .ai-settings-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid #f0f0f0;
    }
  }
}

## 🚀 完整实施路线图

### 第一阶段：基础搭建

1. 项目结构初始化
    ◦ 创建React + TypeScript项目
    ◦ 配置Ant Design和其他依赖
    ◦ 设置路由系统
    ◦ 配置开发环境
2. 核心类型定义
    ◦ 实现所有TypeScript接口定义
    ◦ 创建数据模型文件
    ◦ 建立Mock数据系统
3. 核心页面组件
    ◦ 实现所有基础页面（登录、注册、主页面等）
    ◦ 配置路由和导航
    ◦ 搭建基础布局（Header、Footer、Sidebar等）

### 第二阶段：核心页面开发

1. 页面组件开发
    ◦ BadgesPage（勋章殿堂）
    ◦ CultureDetailPage（文化详情页）
    ◦ ProfilePage（用户个人中心）
2. 业务组件开发
    ◦ BadgeCard（勋章卡片）
    ◦ CultureExplorer（文化探索器）
    ◦ MilestoneTracker（里程碑追踪）
    ◦ AIChat（AI对话）

### 第三阶段：服务层实现

1. 数据服务
    ◦ badgeService（勋章服务）
    ◦ cultureService（文化服务）
    ◦ storageService（本地存储）
    ◦ analyticsService（数据分析）
2. 工具函数
    ◦ dateUtils（日期工具）
    ◦ validationUtils（验证工具）
    ◦ cryptoUtils（加密工具）

### 第四阶段：样式优化

1. Less样式开发
    ◦ 所有页面样式文件
    ◦ 组件样式文件
    ◦ 响应式设计适配
2. 主题定制
    ◦ 定制Ant Design主题
    ◦ 创建主题变量系统
    ◦ 暗色模式支持

### 第五阶段：功能集成测试

1. 单元测试
    ◦ 服务层单元测试
    ◦ 工具函数单元测试
    ◦ 组件单元测试
2. 集成测试
    ◦ 页面流程测试
    ◦ 数据流测试
    ◦ 用户体验测试
3. 性能优化
    ◦ 代码分割
    ◦ 图片懒加载
    ◦ 缓存策略优化

### 第六阶段：部署上线

1. 生产环境配置
    ◦ 环境变量配置
    ◦ 构建优化
    ◦ CDN配置
2. 监控部署
    ◦ 错误监控
    ◦ 性能监控
    ◦ 用户行为分析
3. 文档编写
    ◦ API文档
    ◦ 用户手册
    ◦ 开发指南

### 📋 技术栈建议

#### 核心框架

• React 18+：主框架
• TypeScript 5+：类型安全
• Ant Design 5+：UI组件库
• Less/Sass：样式预处理

#### 路由管理

• React Router v6：页面路由
• 路由懒加载：性能优化

#### 状态管理

• Redux Toolkit：全局状态
• React Context：局部状态
• Zustand：轻量级状态（可选）

#### 数据请求

• Axios：HTTP客户端
• React Query：数据获取和缓存
• WebSocket：实时通信

#### 地图和3D

• Leaflet：2D地图
• Three.js：3D渲染
• AR.js：增强现实

#### 测试工具

• Jest：单元测试
• React Testing Library：组件测试
• Cypress：端到端测试

#### 构建工具

• Vite：构建工具
• ESLint：代码检查
• Prettier：代码格式化

### 🔧 最佳实践建议

#### 代码组织

src/
├── app/                          # 应用主目录
│   ├── components/              # 组件目录
│   │   ├── common/             # 通用组件
│   │   ├── business/           # 业务组件
│   │   └── pages/              # 页面组件
│   ├── layouts/                # 布局组件
│   └── hooks/                  # 自定义Hook
├── services/                    # 服务层
│   ├── api/                    # API服务
│   ├── storage/                # 存储服务
│   └── analytics/              # 分析服务
├── types/                       # 类型定义
├── utils/                       # 工具函数
├── data/                        # 数据文件
├── styles/                      # 全局样式
├── assets/                      # 静态资源
└── config/                      # 配置文件

#### 性能优化

1. 代码分割
    ◦ 路由级代码分割
    ◦ 组件懒加载
    ◦ 动态导入
2. 图片优化
    ◦ WebP格式支持
    ◦ 图片懒加载
    ◦ CDN加速
3. 缓存策略
    ◦ 本地缓存
    ◦ Service Worker
    ◦ 离线支持

#### 安全考虑

1. 数据安全
    ◦ 客户端加密
    ◦ 输入验证
    ◦ XSS防护
2. 隐私保护
    ◦ GDPR合规
    ◦ 数据匿名化
    ◦ 隐私设置
3. 访问控制
    ◦ 权限管理
    ◦ 身份验证
    ◦ API安全

#### 后续扩展计划

##### 短期扩展

1. 社交功能
    ◦ 家庭协作
    ◦ 朋友系统
    ◦ 成就分享
2. 高级AI功能
    ◦ 个性化推荐
    ◦ 智能学习路径
    ◦ 语音交互
3. 更多文化内容
    ◦ 视频课程
    ◦ 互动游戏
    ◦ VR体验

##### 中期扩展

1. 多平台支持
    ◦ 移动App
    ◦ 桌面应用
    ◦ 微信小程序
2. 国际化
    ◦ 多语言支持
    ◦ 本地化内容
    ◦ 跨文化适配
3. 生态系统
    ◦ 开发者API
    ◦ 插件系统
    ◦ 第三方集成

##### 长期愿景

1. 智慧教育平台
    ◦ AI个性化教育
    ◦ 成长预测分析
    ◦ 智能评估系统
2. 文化传播网络
    ◦ 文化内容创作
    ◦ 社区贡献系统
    ◦ 文化保护项目
3. 学术研究合作
    ◦ 儿童发展研究
    ◦ 教育技术研究
    ◦ 文化传承研究

#### 成功指标

##### 技术指标

• 页面加载时间 < 3秒
• 首次内容绘制 < 1.5秒
• 核心Web指标得分 > 90
• 测试覆盖率 > 80%

##### 业务指标

• 用户活跃度 > 60%
• 勋章获得率 > 70%
• 文化内容完成率 > 50%
• 用户满意度 > 4.5/5

##### 增长指标

• 月活跃用户增长率 > 20%
• 用户留存率 > 40%
• 推荐率 > 30%
---
这个完整的实施计划为您提供了从技术架构到业务实现的全面指导。建议按阶段实施，每完成一个阶段都进行测试和用户反馈，确保产品质量和用户体验。祝您的《沫语成长守护体系》项目取得成功！
