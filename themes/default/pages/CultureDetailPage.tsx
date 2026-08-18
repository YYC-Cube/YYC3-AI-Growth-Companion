import React, { useState, useEffect } from 'react';
import type { CultureContent, CultureType } from '../../types/culture';
import { cultureService } from '../../services/culture/cultureService';
import { Card } from '../foundation/Card';
import { Button } from '../foundation/Button';
import { PageNavigation } from '../layout/PageNavigation';

export interface CultureDetailPageProps {
  cultureId: string;
  onBack?: () => void;
}

export const CultureDetailPage: React.FC<CultureDetailPageProps> = ({
  cultureId,
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [cultureDetail, setCultureDetail] = useState<CultureContent | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz' | 'interactive' | 'related'>('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadCultureDetail();
  }, [cultureId]);

  const loadCultureDetail = async () => {
    setLoading(true);
    try {
      const detail = await cultureService.getCultureDetail(cultureId);
      setCultureDetail(detail);
      
      const favorites = await cultureService.getUserFavorites();
      setFavorited(favorites.includes(cultureId));
    } catch (error) {
      console.error('Failed to load culture detail:', error);
      alert('加载文化详情失败');
      onBack?.();
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!cultureDetail) return;
    
    try {
      if (favorited) {
        await cultureService.removeFavorite(cultureDetail.id);
        alert('已取消收藏');
      } else {
        await cultureService.addFavorite(cultureDetail.id);
        alert('已添加到收藏');
      }
      setFavorited(!favorited);
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleShare = async () => {
    if (!cultureDetail) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `了解${cultureDetail.title} - 河洛文化`,
          text: cultureDetail.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `我在小语AI应用了解${cultureDetail.title}：${cultureDetail.description}`
        );
        alert('链接已复制到剪贴板');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const getTypeTag = (type: CultureType) => {
    const typeConfig = {
      site: { color: 'bg-blue-100 text-blue-700', text: '历史遗迹' },
      food: { color: 'bg-orange-100 text-orange-700', text: '特色美食' },
      festival: { color: 'bg-green-100 text-green-700', text: '传统节日' },
      story: { color: 'bg-purple-100 text-purple-700', text: '历史故事' },
    };
    
    return typeConfig[type] || { color: 'bg-gray-100 text-gray-700', text: type };
  };

  const nextImage = () => {
    if (!cultureDetail) return;
    setCurrentImageIndex((prev) => 
      (prev + 1) % cultureDetail.multimedia.images.length
    );
  };

  const prevImage = () => {
    if (!cultureDetail) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? cultureDetail.multimedia.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载文化详情...</p>
        </div>
      </div>
    );
  }

  if (!cultureDetail) {
    return <div className="p-4">文化内容不存在</div>;
  }

  const typeTag = getTypeTag(cultureDetail.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <PageNavigation title={cultureDetail.title} onBack={onBack} />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
        {/* 头部图片轮播 */}
        <div className="mb-6 relative">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-200">
            <img
              src={cultureDetail.multimedia.images[currentImageIndex]}
              alt={cultureDetail.title}
              className="w-full h-full object-cover"
            />
            
            {/* 轮播控制 */}
            {cultureDetail.multimedia.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  ›
                </button>
                
                {/* 指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {cultureDetail.multimedia.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* AR体验按钮 */}
            {cultureDetail.multimedia.ar && (
              <div className="absolute top-4 right-4">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => alert('AR功能开发中...')}
                >
                  📷 AR体验
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 基本信息 */}
        <Card className="mb-6 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {cultureDetail.title}
                </h1>
                <span className={`px-2 py-1 rounded text-xs ${typeTag.color}`}>
                  {typeTag.text}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{cultureDetail.description}</p>
              
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span>⭐ 难度: {cultureDetail.difficultyLevel}/5</span>
                <span>
                  👥 适合年龄: {cultureDetail.suitableAgeRange[0]}-
                  {cultureDetail.suitableAgeRange[1]}岁
                </span>
                {cultureDetail.location && (
                  <span>📍 {cultureDetail.location}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              variant={favorited ? 'primary' : 'outline'}
              onClick={handleFavorite}
              className="flex-1"
            >
              {favorited ? '❤️ 已收藏' : '🤍 收藏'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1"
            >
              📤 分享
            </Button>
            
            {cultureDetail.multimedia.videos && cultureDetail.multimedia.videos.length > 0 && (
              <Button
                variant="outline"
                onClick={() => window.open(cultureDetail.multimedia.videos![0], '_blank')}
                className="flex-1"
              >
                ▶️ 视频
              </Button>
            )}
          </div>
        </Card>

        {/* 标签页 */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className="rounded-full whitespace-nowrap"
            >
              📖 详细介绍
            </Button>
            <Button
              variant={activeTab === 'quiz' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('quiz')}
              className="rounded-full whitespace-nowrap"
            >
              ❓ 知识问答
            </Button>
            <Button
              variant={activeTab === 'interactive' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('interactive')}
              className="rounded-full whitespace-nowrap"
            >
              🎮 互动体验
            </Button>
            <Button
              variant={activeTab === 'related' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('related')}
              className="rounded-full whitespace-nowrap"
            >
              🔗 相关内容
            </Button>
          </div>
        </div>

        {/* 标签页内容 */}
        <Card className="p-6">
          {activeTab === 'overview' && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: cultureDetail.detailedContent }}
            />
          )}
          
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {cultureDetail.knowledgePoints.map((point, index) => (
                <Card key={point.id} className="p-4 bg-purple-50">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {index + 1}. {point.question}
                  </h3>
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-sm">
                      <strong className="text-green-600">答案：</strong>
                      {point.answer}
                    </p>
                    {point.explanation && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>解析：</strong>
                        {point.explanation}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
              
              <div className="text-center mt-6">
                <Button variant="primary" onClick={() => alert('开始答题')}>
                  🎯 开始互动测试
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  完成问答可获得文化探索勋章
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'interactive' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cultureDetail.interactiveElements.map((element) => (
                <Card
                  key={element.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => alert(`开始${element.title}`)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {element.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {element.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {element.type === 'game' ? '🎮 游戏' : 
                       element.type === 'quiz' ? '❓ 问答' : 
                       element.type === 'craft' ? '✂️ 手工' : 
                       element.type === 'ar' ? '📷 AR' : '🎬 视频'}
                    </span>
                    {element.duration && (
                      <span className="text-xs text-gray-500">
                        ⏱ {element.duration}分钟
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === 'related' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cultureDetail.relatedContent.length > 0 ? (
                cultureDetail.relatedContent.map((relatedId, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => alert(`查看相关内容 ${relatedId}`)}
                  >
                    <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">🏛️</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      相关文化内容 {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      点击查看详情
                    </p>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  暂无相关内容
                </div>
              )}
            </div>
          )}
        </Card>

        {/* 学习进度 */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold mb-4">学习进度</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-lg ${cultureDetail.learned ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">
                {cultureDetail.learned ? '✅' : '1️⃣'}
              </div>
              <h4 className="font-medium text-sm mb-1">了解基础</h4>
              <p className="text-xs text-gray-600">阅读详细介绍</p>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${cultureDetail.quizCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">
                {cultureDetail.quizCompleted ? '✅' : '2️⃣'}
              </div>
              <h4 className="font-medium text-sm mb-1">知识问答</h4>
              <p className="text-xs text-gray-600">完成互动测试</p>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${cultureDetail.interactiveCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">
                {cultureDetail.interactiveCompleted ? '✅' : '3️⃣'}
              </div>
              <h4 className="font-medium text-sm mb-1">互动体验</h4>
              <p className="text-xs text-gray-600">参与互动活动</p>
            </div>
            
            <div className={`text-center p-4 rounded-lg ${cultureDetail.shared ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">
                {cultureDetail.shared ? '✅' : '4️⃣'}
              </div>
              <h4 className="font-medium text-sm mb-1">分享传播</h4>
              <p className="text-xs text-gray-600">分享给朋友</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};