import React from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Card } from '../foundation/Card';
import { Button } from '../foundation/Button';

export const VideoPage: React.FC = () => {
  const videos = [
    { id: 1, title: '龙门石窟探秘', duration: '12:34', thumbnail: '🏛️', category: '文化' },
    { id: 2, title: '古诗词诵读', duration: '08:21', thumbnail: '📖', category: '语文' },
    { id: 3, title: '数学趣味课堂', duration: '15:42', thumbnail: '🔢', category: '数学' },
    { id: 4, title: '科学小实验', duration: '10:15', thumbnail: '🔬', category: '科学' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 导航栏 */}
      <PageNavigation title="视频工坊" icon="🎬" />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <p className="text-gray-600">观看精彩视频，学习更有趣</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="cursor-pointer hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center text-6xl">
                {video.thumbnail}
              </div>
              <div className="mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {video.category}
                </span>
              </div>
              <h4 className="mb-2">{video.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱️ {video.duration}</span>
                <Button variant="ghost" className="text-sm">观看</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};