import React from 'react';
import { Card, Tag } from 'antd';

export const RecommendationCard: React.FC<any> = ({ title, subtitle, image, type, onClick }) => (
  <Card
    hoverable
    cover={<img alt={title} src={image} className="h-40 object-cover" />}
    onClick={onClick}
    className="rounded-xl overflow-hidden"
  >
    <Card.Meta
      title={
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <Tag>{type}</Tag>
        </div>
      }
      description={subtitle}
    />
  </Card>
);
