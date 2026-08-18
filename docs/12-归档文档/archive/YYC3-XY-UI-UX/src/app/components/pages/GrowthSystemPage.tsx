/**
 * GrowthSystemPage - 沫语成长守护体系页面
 * 集成完整的成长记录系统（基于Python后端架构）
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../foundation/Icon';
import { Badge } from '../foundation/Badge';
import { Progress, CircularProgress } from '../foundation/Progress';
import { Button } from '../foundation/Button';
import { Card } from '../foundation/Card';
import { growthSystemManager, DEVELOPMENT_DIMENSIONS, SYSTEM_CONFIG } from '../../services/growthSystem';
import { characterManager } from '../../services/character';
import type { DevelopmentDimension } from '../../services/growthSystem';

interface GrowthSystemPageProps {
  onBack?: () => void;
}

import { PageNavigation } from '../layout/PageNavigation';

export const GrowthSystemPage: React.FC<GrowthSystemPageProps> = ({ onBack }) => {
  const [currentAge, setCurrentAge] = useState(8); // 默认8岁
  const [activeView, setActiveView] = useState<'overview' | 'dimensions' | 'milestones' | 'ai-analysis'>('overview');
  const [selectedDimension, setSelectedDimension] = useState<DevelopmentDimension | null>(null);

  // 获取当前角色信息
  const currentCharacter = characterManager.getCurrentCharacter();
  const characterName = currentCharacter?.name || '小朋友';

  // 获取年龄阶段配置
  const ageConfig = growthSystemManager.getAgeStageConfig(currentAge);
  const culturalMessage = growthSystemManager.getCulturalMessage(currentAge);
  const dimensionProgress = growthSystemManager.getDimensionProgress(currentAge);
  const aiAnalysis = growthSystemManager.analyzeGrowthData(currentAge);
  const milestones = growthSystemManager.getMilestones(currentAge);
  const milestoneRecords = growthSystemManager.getMilestoneRecords(currentAge);

  // 计算总体进度
  const overallProgress = dimensionProgress.length > 0
    ? Math.round(dimensionProgress.reduce((sum, dp) => sum + dp.progress, 0) / dimensionProgress.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <PageNavigation 
        title={SYSTEM_CONFIG.systemName} 
        icon="🌟" 
        onBackClick={onBack}
        showHomeButton={false}
      />

      {/* Header Controls */}
      <div className="bg-white shadow-sm sticky top-[72px] z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
               <p className="text-gray-500 text-sm">{SYSTEM_CONFIG.coreElements.character}</p>
            </div>
            <Badge variant="primary" size="md">
              v{SYSTEM_CONFIG.systemVersion}
            </Badge>
          </div>

          {/* 年龄选择器 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">当前年龄:</span>
            <select
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Array.from({ length: 22 }, (_, i) => i).map((age) => {
                const config = growthSystemManager.getAgeStageConfig(age);
                return (
                  <option key={age} value={age}>
                    {age}岁 - {config?.stageName.split('_')[1]}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 文化寄语 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Icon icon="🏛️" size="md" variant="primary" background="soft" circle />
              <div className="flex-1">
                <h3 className="text-purple-900 mb-1">河洛文化寄语</h3>
                <p className="text-purple-700 text-sm">{culturalMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 导航标签 */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
          {[
            { id: 'overview', label: '成长概览', icon: '📊' },
            { id: 'dimensions', label: '发展维度', icon: '📈' },
            { id: 'milestones', label: '成长里程碑', icon: '🎯' },
            { id: 'ai-analysis', label: 'AI智能分析', icon: '🤖' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 成长概览 */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* 阶段信息卡片 */}
            <Card variant="gradient" rounded="2xl" padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 总体进度 */}
                <div className="flex flex-col items-center justify-center">
                  <CircularProgress value={overallProgress} size={140} variant="primary" />
                  <h3 className="mt-4 text-gray-900">总体进度</h3>
                  <p className="text-gray-600 text-sm">继续加油！{characterName}</p>
                </div>

                {/* 阶段信息 */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon icon="🎭" size="md" variant="primary" background="soft" circle />
                      <div>
                        <p className="text-sm text-gray-500">成长阶段</p>
                        <p className="font-medium text-gray-900">{ageConfig?.stageName}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{ageConfig?.growthStage}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Icon icon="✅" size="sm" variant="success" background="soft" circle />
                        <div>
                          <p className="text-xl font-bold text-gray-900">{milestoneRecords.filter(m => m.completed).length}</p>
                          <p className="text-xs text-gray-600">已完成里程碑</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Icon icon="🎯" size="sm" variant="info" background="soft" circle />
                        <div>
                          <p className="text-xl font-bold text-gray-900">{milestones.length}</p>
                          <p className="text-xs text-gray-600">总里程碑数</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 发展维度概览 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensionProgress.map((dp, index) => {
                  const dimConfig = DEVELOPMENT_DIMENSIONS[dp.dimension];
                  // 映射颜色到Icon variant
                  const colorToVariant: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
                    'orange': 'warning',
                    'blue': 'info',
                    'green': 'success',
                    'pink': 'secondary',
                    'purple': 'primary'
                  };
                  const iconVariant = colorToVariant[dimConfig.color] || 'default';
                  
                  return (
                    <Card
                      key={index}
                      rounded="2xl"
                      padding="lg"
                      hoverable
                      onClick={() => {
                        setSelectedDimension(dp.dimension);
                        setActiveView('dimensions');
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Icon
                            icon={dimConfig.icon}
                            size="lg"
                            variant={iconVariant}
                            background="soft"
                            circle
                          />
                          <div>
                            <h3 className="text-gray-900">{dimConfig.name}</h3>
                            <p className="text-gray-500 text-sm">
                              Lv.{dp.level}/{dp.maxLevel}
                            </p>
                          </div>
                        </div>
                        <Badge variant="primary" size="sm">
                          {dp.progress}%
                        </Badge>
                      </div>

                      <Progress
                        value={dp.progress}
                        variant="primary"
                        size="md"
                        animated
                      />

                      <p className="mt-3 text-sm text-gray-600">{dimConfig.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 发展维度详情 */}
        {activeView === 'dimensions' && (
          <div className="space-y-6">
            {dimensionProgress.map((dp, index) => {
              const dimConfig = DEVELOPMENT_DIMENSIONS[dp.dimension];
              // 映射颜色到Icon variant
              const colorToVariant: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
                'orange': 'warning',
                'blue': 'info',
                'green': 'success',
                'pink': 'secondary',
                'purple': 'primary'
              };
              const iconVariant = colorToVariant[dimConfig.color] || 'default';
              
              return (
                <Card key={index} rounded="2xl" padding="lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Icon
                        icon={dimConfig.icon}
                        size="xl"
                        variant={iconVariant}
                        background="soft"
                        circle
                      />
                      <div>
                        <h2 className="text-gray-900 mb-1">{dimConfig.name}</h2>
                        <p className="text-gray-600 text-sm">{dimConfig.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">{dp.progress}%</p>
                      <Badge variant="primary" size="sm">
                        Lv.{dp.level}
                      </Badge>
                    </div>
                  </div>

                  <Progress
                    value={dp.progress}
                    variant="primary"
                    size="lg"
                    animated
                    className="mb-6"
                  />

                  {/* 发展阶段 */}
                  <div className="mb-6">
                    <h3 className="text-gray-900 mb-3">发展阶段</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {dimConfig.stages.map((stage, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-lg text-center text-sm ${
                            idx <= dp.level
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {stage}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 具体项目 */}
                  {dp.items.length > 0 && (
                    <div>
                      <h3 className="text-gray-900 mb-3">具体项目</h3>
                      <div className="space-y-2">
                        {dp.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              item.completed
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <Icon
                              icon={item.icon}
                              size="md"
                              variant={item.completed ? 'success' : 'default'}
                              background="soft"
                              circle
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-gray-900">{item.title}</h4>
                                {item.completed && (
                                  <Badge variant="success" size="sm" icon="✓">
                                    已完成
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                              {item.date && (
                                <p className="text-gray-500 text-xs mt-1">完成时间：{item.date}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* 成长里程碑 */}
        {activeView === 'milestones' && (
          <div className="space-y-6">
            <Card variant="gradient" rounded="2xl" padding="lg">
              <div className="text-center mb-6">
                <Icon icon="🎯" size="2xl" variant="primary" background="soft" circle className="mx-auto mb-4" />
                <h2 className="text-gray-900 mb-2">{currentAge}岁成长里程碑</h2>
                <p className="text-gray-600">
                  已完成 {milestoneRecords.filter(m => m.completed).length} / {milestones.length} 个里程碑
                </p>
              </div>

              <Progress
                value={(milestoneRecords.filter(m => m.completed).length / milestones.length) * 100}
                variant="primary"
                size="lg"
                showPercentage
                animated
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((milestone, idx) => {
                const record = milestoneRecords.find(r => r.milestone === milestone);
                const isCompleted = record?.completed || false;

                return (
                  <Card
                    key={idx}
                    rounded="xl"
                    padding="md"
                    className={isCompleted ? 'border-2 border-green-200' : 'border border-gray-200'}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        icon={isCompleted ? '✅' : '⭕'}
                        size="md"
                        variant={isCompleted ? 'success' : 'default'}
                        background="soft"
                        circle
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{milestone}</h4>
                        {record && (
                          <>
                            <p className="text-gray-600 text-sm mb-2">{record.notes}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(record.timestamp).toLocaleDateString('zh-CN')}
                            </p>
                          </>
                        )}
                        {!isCompleted && (
                          <Button variant="outline" size="sm" className="mt-2">
                            标记完成
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* AI智能分析 */}
        {activeView === 'ai-analysis' && (
          <div className="space-y-6">
            {/* AI综合评分 */}
            <Card variant="gradient" rounded="2xl" padding="lg">
              <div className="text-center mb-6">
                <Icon icon="🤖" size="2xl" variant="primary" background="soft" circle className="mx-auto mb-4" />
                <h2 className="text-gray-900 mb-2">AI智能分析</h2>
                <p className="text-gray-600">基于多维度数据的智能成长分析</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CircularProgress value={aiAnalysis.overallScore} size={120} variant="primary" />
                  <h3 className="mt-3 text-gray-900">综合评分</h3>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-gray-900 mb-3">发展平衡性</h3>
                  <div className="space-y-3">
                    {Object.entries(aiAnalysis.developmentBalance).map(([dim, score]) => {
                      const dimConfig = DEVELOPMENT_DIMENSIONS[dim as DevelopmentDimension];
                      return (
                        <div key={dim}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <span>{dimConfig.icon}</span>
                              <span>{dim}</span>
                            </span>
                            <span className="font-semibold">{score}%</span>
                          </div>
                          <Progress value={score} variant="primary" size="md" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* AI建议 */}
            <Card rounded="2xl" padding="lg">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="💡" size="md" variant="warning" background="soft" circle />
                <span>个性化建议</span>
              </h3>
              <div className="space-y-2">
                {aiAnalysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <p className="text-gray-700 text-sm flex-1">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 风险提示 */}
            {aiAnalysis.riskFactors.length > 0 && (
              <Card rounded="2xl" padding="lg" className="border-2 border-red-200">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Icon icon="⚠️" size="md" variant="danger" background="soft" circle />
                  <span>需要关注</span>
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.riskFactors.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-red-600 mt-0.5">•</span>
                      <p className="text-gray-700 text-sm flex-1">{risk}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};