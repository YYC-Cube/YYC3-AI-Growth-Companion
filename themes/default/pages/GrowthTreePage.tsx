import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Tree, Timeline, Progress, Statistic, 
  Button, Input, Select, Tag, Space, Modal, message
} from 'antd';
import {
  HeartOutlined, TrophyOutlined, BookOutlined,
  TeamOutlined, CrownOutlined, SearchOutlined,
  PlusOutlined, FilterOutlined, ShareAltOutlined,
  CalendarOutlined, EnvironmentOutlined, FireOutlined
} from '@ant-design/icons';
import { growthService } from '../../../services/growth/growthService';
import GrowthRecordForm from '../business/GrowthRecordForm';
import AIGrowthInsights from '../business/AIGrowthInsights';

import './GrowthTreePage.css';

const { Search } = Input;
const { Option } = Select;

const GrowthTreePage: React.FC<{ onNavigate?: (page: string, data?: Record<string, unknown>) => void }> = ({ onNavigate }) => {
  const navigate = (path: string) => {
     // Map path to page key for App.tsx
     if (path.startsWith('/growth/record/')) {
         console.log("Navigate to detail", path);
     } else if (path === '/growth/cultural') {
         onNavigate?.('culture');
     } else if (path === '/growth/milestones') {
         onNavigate?.('badges');
     } else {
         console.log("Navigate to", path);
     }
  };
  const [loading, setLoading] = useState(true);
  const [growthTree, setGrowthTree] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ageRange: [0, 21] as [number, number],
    category: 'all',
    type: 'all',
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    loadGrowthData();
  }, []);

  const loadGrowthData = async () => {
    setLoading(true);
    try {
      const [tree, timelineData, stats] = await Promise.all([
        growthService.getGrowthTree(),
        growthService.getGrowthTimeline(),
        growthService.getGrowthStatistics(),
      ]);

      setGrowthTree(tree);
      setTimeline(timelineData);
      setStatistics(stats);
      
      // 构建树形数据
      const treeStructure = buildTreeStructure(tree, timelineData.phases);
      setTreeData(treeStructure);
      
      // 获取AI分析
      const insights = await generateAIGrowthInsights(tree, timelineData);
      setAiInsights(insights);
    } catch (error) {
      message.error('加载成长数据失败');
    } finally {
      setLoading(false);
    }
  };

  const buildTreeStructure = (nodes: any[], phases: any) => {
    // 按年龄段分组
    const ageGroups: Record<number, any[]> = {};
    
    nodes.forEach(node => {
      if (!ageGroups[node.age]) {
        ageGroups[node.age] = [];
      }
      ageGroups[node.age].push(node);
    });

    // 构建树节点
    return Object.entries(ageGroups).map(([age, nodes]) => {
      const phase = phases[parseInt(age)];
      return {
        title: (
          <div className="tree-phase-node">
            <span className="phase-icon">{phase?.icon || '👶'}</span>
            <span className="phase-name">{phase?.name || `年龄${age}岁`}</span>
            <Tag color={phase?.color || '#1890ff'}>
              {nodes.length}条记录
            </Tag>
          </div>
        ),
        key: `age-${age}`,
        children: nodes.map(node => ({
          title: (
            <div 
              className="tree-record-node"
              onClick={() => handleNodeClick(node)}
            >
              <div className="record-header">
                <span className="record-title">{node.content.title}</span>
                <Tag 
                  color={
                    node.content.type === 'cultural' ? 'purple' :
                    node.content.type === 'academic' ? 'blue' :
                    node.content.type === 'social' ? 'green' :
                    node.content.type === 'health' ? 'orange' : 'default'
                  }
                >
                  {node.content.type}
                </Tag>
              </div>
              <div className="record-meta">
                <span className="record-date">
                  {new Date(node.metadata.created).toLocaleDateString()}
                </span>
                {node.content.milestones.length > 0 && (
                  <span className="milestone-count">
                    <TrophyOutlined /> {node.content.milestones.length}
                  </span>
                )}
              </div>
            </div>
          ),
          key: node.id,
          isLeaf: true,
        })),
      };
    });
  };

  const generateAIGrowthInsights = async (tree: any[], timeline: any) => {
    // 模拟AI分析结果
    return {
      summary: "基于成长记录分析，孩子在文化浸润和社交发展方面表现突出。",
      trends: [
        { area: '文化认知', trend: '上升', confidence: 0.85 },
        { area: '社交能力', trend: '上升', confidence: 0.78 },
        { area: '学业发展', trend: '稳定', confidence: 0.65 },
      ],
      recommendations: [
        {
          priority: 'high',
          action: '增加户外文化实践活动',
          reason: '将文化学习与实际体验结合',
        },
      ],
    };
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    navigate(`/growth/record/${node.id}`);
  };

  const handleAddRecord = () => {
    setShowRecordForm(true);
  };

  const handleRecordSubmit = async (record: any) => {
    try {
      await growthService.addGrowthRecord(record);
      message.success('成长记录添加成功');
      setShowRecordForm(false);
      loadGrowthData();
    } catch (error) {
      message.error('添加记录失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderStatisticsCards = () => {
    if (!statistics) return null;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="stat-card total-card">
            <Statistic
              title="成长记录"
              value={statistics.totalRecords}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card milestone-card">
            <Statistic
              title="里程碑"
              value={statistics.milestones}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card cultural-card">
            <Statistic
              title="文化活动"
              value={statistics.culturalActivities}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card photo-card">
            <Statistic
              title="珍贵照片"
              value={statistics.attachmentCounts?.photos || 0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderGrowthTimeline = () => {
    if (!timeline) return null;

    const recentNodes = growthTree
      .sort((a, b) => new Date(b.metadata.created).getTime() - new Date(a.metadata.created).getTime())
      .slice(0, 5);

    return (
      <Card title="最近成长记录" className="recent-timeline-card">
        <Timeline>
          {recentNodes.map((node, index) => (
            <Timeline.Item
              key={index}
              color={timeline.phases[node.age]?.color || 'blue'}
            >
              <div className="timeline-item">
                <div className="timeline-header">
                  <span className="age-tag">{node.age}岁</span>
                  <span className="record-title">{node.content.title}</span>
                </div>
                <div className="timeline-content">
                  <p className="record-description">
                    {node.content.description.substring(0, 80)}...
                  </p>
                  <div className="record-tags">
                    {node.content.smartTags?.slice(0, 3).map((tag: string, i: number) => (
                      <Tag key={i} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    );
  };

  const renderGrowthAreas = () => {
    if (!statistics?.growthAreas) return null;

    return (
      <Card title="成长领域分布" className="areas-card">
        <div className="areas-list">
          {statistics.growthAreas.map((area: any, index: number) => (
            <div key={index} className="area-item">
              <div className="area-header">
                <span className="area-name">{area.category}</span>
                <span className="area-count">{area.count}条</span>
              </div>
              <Progress
                percent={Math.min((area.count / statistics.totalRecords) * 100, 100)}
                strokeColor={
                  area.trend === 'up' ? '#52c41a' :
                  area.trend === 'down' ? '#ff4d4f' : '#1890ff'
                }
                size="small"
              />
              <div className="area-trend">
                <Tag color={
                  area.trend === 'up' ? 'success' :
                  area.trend === 'down' ? 'error' : 'default'
                }>
                  {area.trend === 'up' ? '上升' : area.trend === 'down' ? '下降' : '稳定'}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (loading) {
    return <div className="loading-container">加载成长数据中...</div>;
  }

  return (
    <div className="growth-tree-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <EnvironmentOutlined /> 沫语成长树
          </h1>
          <p className="header-description">
            记录成长每一刻，传承河洛文化，连接智慧未来
          </p>
        </div>
        <div className="header-actions">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRecord}
            >
              添加记录
            </Button>
            <Button icon={<ShareAltOutlined />}>
              分享成长
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      {renderStatisticsCards()}

      {/* AI洞察 */}
      {aiInsights && <AIGrowthInsights insights={aiInsights} />}

      {/* 搜索和筛选 */}
      <Card className="search-filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="搜索成长记录..."
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="选择年龄段"
              style={{ width: '100%' }}
              value={filters.ageRange}
              onChange={(value) => handleFilterChange('ageRange', value)}
            >
              <Option value={[0, 3]}>0-3岁 感知启蒙期</Option>
              <Option value={[4, 6]}>4-6岁 文化浸润期</Option>
              <Option value={[7, 12]}>7-12岁 学业发展期</Option>
              <Option value={[13, 18]}>13-18岁 青春成长期</Option>
              <Option value={[19, 21]}>19-21岁 成人准备期</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="选择记录类型"
              style={{ width: '100%' }}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="all">全部类型</Option>
              <Option value="cultural">文化体验</Option>
              <Option value="academic">学业成长</Option>
              <Option value="social">社交发展</Option>
              <Option value="health">健康守护</Option>
              <Option value="perception">感知启蒙</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button
              icon={<FilterOutlined />}
              block
              onClick={() => setFilters({ ageRange: [0, 21], category: 'all', type: 'all' })}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 主要内容区 */}
      <Row gutter={[24, 24]}>
        {/* 成长树 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined />
                成长树视图
                <Tag color="green">
                  {growthTree.length}条记录
                </Tag>
              </Space>
            }
            className="growth-tree-card"
          >
            <div className="tree-container">
              <Tree
                treeData={treeData}
                defaultExpandAll
                showLine
                onSelect={(selectedKeys, info) => {
                  if (info.node.isLeaf) {
                    const nodeId = selectedKeys[0] as string;
                    const node = growthTree.find(n => n.id === nodeId);
                    if (node) handleNodeClick(node);
                  }
                }}
              />
            </div>
          </Card>

          {/* 成长领域分布 */}
          {renderGrowthAreas()}
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 最近记录时间线 */}
          {renderGrowthTimeline()}

          {/* 文化里程碑 */}
          <Card title="河洛文化里程碑" className="cultural-milestones-card">
            <div className="milestones-list">
              {growthTree
                .filter(node => node.content.type === 'cultural')
                .slice(0, 5)
                .map((node, index) => (
                  <div key={index} className="milestone-item">
                    <div className="milestone-icon">
                      <CrownOutlined style={{ color: '#ffd700' }} />
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-title">{node.content.title}</div>
                      <div className="milestone-age">{node.age}岁</div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* 快速添加 */}
          <Card title="快速记录" className="quick-add-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="dashed" 
                block
                icon={<CalendarOutlined />}
                onClick={() => setShowRecordForm(true)}
              >
                今日成长
              </Button>
              <Button 
                type="dashed" 
                block
                icon={<TeamOutlined />}
                onClick={() => navigate('/growth/cultural')}
              >
                文化活动
              </Button>
              <Button 
                type="dashed" 
                block
                icon={<FireOutlined />}
                onClick={() => navigate('/growth/milestones')}
              >
                里程碑
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 添加记录弹窗 */}
      <Modal
        title="添加成长记录"
        open={showRecordForm}
        onCancel={() => setShowRecordForm(false)}
        footer={null}
        width={800}
      >
        <GrowthRecordForm
          onSubmit={handleRecordSubmit}
          onCancel={() => setShowRecordForm(false)}
        />
      </Modal>
    </div>
  );
};

export default GrowthTreePage;
