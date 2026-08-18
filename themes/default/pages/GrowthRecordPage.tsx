/**
 * GrowthRecordPage - 成长记录页面
 * 重构UI设计，采用简洁的卡片式布局，集成GrowthService
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '../foundation/Badge';
import { Button } from '../foundation/Button';
import { characterManager } from '../../services/character';
import { growthService, GrowthNode } from '../../services/growth/growthService';

interface GrowthDimension {
  id: string;
  name: string;
  icon: string;
  progress: number;
  level: number;
  maxLevel: number;
  items: GrowthItem[];
  color: string;
  bgColor: string;
}

interface GrowthItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
  icon: string;
}

interface GrowthRecordDisplay {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  images?: string[];
  progress: number;
  tags: string[];
}

import { PageNavigation } from '../layout/PageNavigation';

export const GrowthRecordPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [records, setRecords] = useState<GrowthRecordDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取当前角色
  const currentCharacter = characterManager.getCurrentChild();
  const characterName = currentCharacter?.name || '小朋友';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const nodes = await growthService.getGrowthTree();
      const mappedRecords = nodes.map(mapNodeToRecord);
      setRecords(mappedRecords);
    } catch (error) {
      console.error('Failed to load growth data', error);
    } finally {
      setLoading(false);
    }
  };

  const mapNodeToRecord = (node: GrowthNode): GrowthRecordDisplay => {
    const typeMap: Record<string, string> = {
      'cultural': '文化',
      'academic': '认知',
      'social': '社交',
      'health': '运动',
      'perception': '感知',
    };

    return {
      id: node.id,
      title: node.content.title,
      date: new Date(node.metadata.created).toLocaleDateString(),
      type: typeMap[node.content.type] || '其他',
      description: node.content.description,
      images: [], // GrowthNode doesn't have images yet, strictly speaking
      progress: 100,
      tags: node.content.smartTags || [],
    };
  };

  const tabs = [
    { id: 'all', label: '全部记录', icon: '📊' },
    { id: 'cultural', label: '文化体验', icon: '🎨' },
    { id: 'academic', label: '认知能力', icon: '🧠' }, // mapped from academic/perception
    { id: 'social', label: '社交能力', icon: '👥' },
    { id: 'health', label: '健康运动', icon: '⚽' },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      '认知': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🧠' },
      '语言': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '💬' },
      '社交': { bg: 'bg-green-100', text: 'text-green-700', icon: '👥' },
      '文化': { bg: 'bg-pink-100', text: 'text-pink-700', icon: '🎨' },
      '创造': { bg: 'bg-pink-100', text: 'text-pink-700', icon: '🎨' },
      '运动': { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚽' },
      '健康': { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚽' },
      '习惯': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🌟' },
      '感知': { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '👁️' },
      '其他': { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📝' },
    };
    return colors[type as keyof typeof colors] || colors['其他'];
  };

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(r => {
        if (activeTab === 'academic') return r.type === '认知' || r.type === '感知';
        if (activeTab === 'health') return r.type === '运动' || r.type === '健康';
        if (activeTab === 'cultural') return r.type === '文化' || r.type === '创造';
        const tabLabel = tabs.find(t => t.id === activeTab)?.label;
        return tabLabel && r.type === tabLabel.substring(0, 2); // very rough matching
      });

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageNavigation 
        title="成长记录" 
        icon="📝" 
        onBackClick={onBack}
        showHomeButton={false}
      />
      
      {/* Header Controls */}
      <div className="bg-white shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">记录{characterName}每一个成长的精彩瞬间</p>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {viewMode === 'grid' ? '☰' : '▦'}
            </button>
          </div>

          {/* 标签导航 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 创建新记录按钮 */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
          <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
          <span className="font-medium">创建新记录</span>
        </button>
      </div>

      {/* 内容区 */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-gray-900 font-medium">
            {tabs.find(t => t.id === activeTab)?.label} 
            <span className="text-gray-400 ml-2">({filteredRecords.length})</span>
          </h2>
        </div>

        {/* 空状态 */}
        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-5xl text-gray-300">📝</span>
            </div>
            <p className="text-gray-400 mb-6">还没有记录</p>
            <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all">
              创建第一个记录
            </button>
          </div>
        )}

        {/* 网格视图 */}
        {filteredRecords.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => {
              const typeStyle = getTypeColor(record.type);
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  {/* 卡片头部 */}
                  <div className={`${typeStyle.bg} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{typeStyle.icon}</span>
                        <Badge variant="default" size="sm" className="bg-white/50 backdrop-blur-sm">
                          {record.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-600">{record.date}</span>
                    </div>
                    <h3 className={`${typeStyle.text} font-medium group-hover:scale-105 transition-transform`}>
                      {record.title}
                    </h3>
                  </div>

                  {/* 卡片内容 */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {record.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {record.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {record.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs">
                          +{record.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* 底部操作 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-sm">✓</span>
                        <span className="text-xs">已完成</span>
                      </div>
                      <button className="text-purple-600 text-sm hover:text-purple-700">
                        查看详情 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 列表视图 */}
        {filteredRecords.length > 0 && viewMode === 'list' && (
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const typeStyle = getTypeColor(record.type);
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div className={`${typeStyle.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-2xl">{typeStyle.icon}</span>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900 font-medium">{record.title}</h3>
                        <Badge variant="default" size="sm" className={typeStyle.bg}>
                          {record.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {record.description}
                      </p>
                      <div className="flex items-center gap-2">
                        {record.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{record.date}</span>
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-sm">✓</span>
                        <span className="text-xs">已完成</span>
                      </div>
                      <button className="text-purple-600 text-sm hover:text-purple-700">
                        查看 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
