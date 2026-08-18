import React from 'react';
import { Modal, Button, Result, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface AIGrowthPopupProps {
  visible: boolean;
  onClose: () => void;
  type: 'summary' | 'analysis' | 'suggestions' | 'report';
}

const AIGrowthPopup: React.FC<AIGrowthPopupProps> = ({ visible, onClose, type }) => {
  const getTitle = () => {
    switch (type) {
      case 'summary': return 'AI 成长摘要';
      case 'analysis': return 'AI 趋势分析';
      case 'suggestions': return 'AI 智能推荐';
      case 'report': return 'AI 成长报告';
      default: return 'AI 助手';
    }
  };

  const getContent = () => {
    // Mock content based on type
    switch (type) {
      case 'summary':
        return (
          <Result
            icon={<RobotOutlined style={{ color: '#722ed1' }} />}
            title="本月成长摘要"
            subTitle="孩子在本月的文化探索活动中表现积极，特别是在参观博物馆时展现出了浓厚的兴趣。"
          />
        );
      case 'analysis':
        return (
          <Result
            status="info"
            title="成长趋势分析"
            subTitle="数据显示，孩子的语言表达能力稳步提升，但在户外运动方面还可以适当加强。"
          />
        );
      case 'suggestions':
        return (
          <Result
            status="success"
            title="为您推荐"
            subTitle="基于孩子的兴趣，我们推荐周末去体验一下洛阳三彩艺术制作。"
          />
        );
      default:
        return <Paragraph>暂无内容</Paragraph>;
    }
  };

  return (
    <Modal
      title={getTitle()}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="action" type="primary">
          了解更多
        </Button>
      ]}
    >
      {getContent()}
    </Modal>
  );
};

export default AIGrowthPopup;
