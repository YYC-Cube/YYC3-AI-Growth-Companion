import React from 'react';
import { Card, Progress, Button } from 'antd';

export const LearningProgress: React.FC<any> = ({ subject, progress, onContinue }) => (
  <Card className="rounded-xl shadow-sm">
    <h4 className="font-bold mb-4">{subject}</h4>
    <Progress type="circle" percent={progress} width={80} strokeColor="#722ed1" className="mb-4 block mx-auto" />
    <Button block onClick={onContinue}>继续学习</Button>
  </Card>
);
