import React from 'react';
import { Card, Progress, Tag, Button } from 'antd';

export const GrowthCard: React.FC<any> = ({ ageStage, growthData, onViewDetails }) => (
  <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="text-lg font-bold">{ageStage}</h4>
        <p className="text-gray-500 text-sm">Age: {growthData?.age}</p>
      </div>
      <Tag color="purple">进行中</Tag>
    </div>
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>成长进度</span>
        <span>75%</span>
      </div>
      <Progress percent={75} showInfo={false} strokeColor="#722ed1" />
    </div>
    {onViewDetails && (
      <Button type="primary" block onClick={onViewDetails} className="bg-purple-600">
        查看详情
      </Button>
    )}
  </Card>
);
