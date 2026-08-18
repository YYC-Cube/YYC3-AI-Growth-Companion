import React from 'react';
import { Card, Alert, List, Typography } from 'antd';
import { BulbOutlined, RiseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Insight {
  area: string;
  trend: string;
  confidence: number;
}

interface Recommendation {
  priority: string;
  action: string;
  reason: string;
}

interface AIGrowthInsightsProps {
  insights: {
    summary: string;
    trends: Insight[];
    recommendations: Recommendation[];
  };
}

const AIGrowthInsights: React.FC<AIGrowthInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <Card className="ai-insights-card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <BulbOutlined style={{ fontSize: 24, color: '#faad14', marginRight: 8 }} />
        <Title level={4} style={{ margin: 0 }}>AI 成长洞察</Title>
      </div>

      <Alert
        message="成长综述"
        description={insights.summary}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 16 }}>
        <Title level={5}><RiseOutlined /> 发展趋势</Title>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={insights.trends}
          renderItem={(item) => (
            <List.Item>
              <Card size="small">
                <Text strong>{item.area}</Text>
                <br />
                <Text type={item.trend === '上升' ? 'success' : 'secondary'}>
                  {item.trend} (置信度: {Math.round(item.confidence * 100)}%)
                </Text>
              </Card>
            </List.Item>
          )}
        />
      </div>

      <div>
        <Title level={5}>个性化建议</Title>
        <List
          itemLayout="horizontal"
          dataSource={insights.recommendations}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.priority === 'high' ? '#f5222d' : '#1890ff', marginTop: 8 }} />}
                title={item.action}
                description={item.reason}
              />
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default AIGrowthInsights;
