import React from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Card } from '../foundation/Card';
import { Button } from '../foundation/Button';

export const CreatePage: React.FC = () => {
  const tools = [
    { id: 1, name: '绘画创作', icon: '🎨', description: '发挥想象，创作美丽画作' },
    { id: 2, name: '手工制作', icon: '✂️', description: '动手制作，培养创造力' },
    { id: 3, name: '音乐创作', icon: '🎵', description: '创作旋律，表达情感' },
    { id: 4, name: '故事编写', icon: '📝', description: '编写故事，展现文采' },
    { id: 5, name: '视频剪辑', icon: '🎬', description: '剪辑视频，记录生活' },
    { id: 6, name: '编程创作', icon: '💻', description: '学习编程，创造未来' },
  ];

  const recentWorks = [
    { id: 1, title: '我的家乡', type: '绘画', date: '2天前', thumbnail: '🏞️' },
    { id: 2, title: '折纸小动物', type: '手工', date: '5天前', thumbnail: '🦢' },
    { id: 3, title: '春天的故事', type: '写作', date: '1周前', thumbnail: '🌸' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 导航栏 */}
      <PageNavigation title="创意工坊" icon="🎨" />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <p className="text-gray-600">发挥创造力，创作属于你的作品</p>
        </div>

        {/* 创作工具 */}
        <div className="mb-12">
          <h3 className="mb-4">创作工具</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className="text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{tool.icon}</div>
                <h4 className="mb-2 text-sm">{tool.name}</h4>
                <p className="text-xs text-gray-600">{tool.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* 最近作品 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>最近作品</h3>
            <Button variant="ghost" className="text-sm">查看全部 →</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWorks.map((work) => (
              <Card key={work.id} className="cursor-pointer hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center text-6xl">
                  {work.thumbnail}
                </div>
                <h4 className="mb-2">{work.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {work.type}
                  </span>
                  <span>{work.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};