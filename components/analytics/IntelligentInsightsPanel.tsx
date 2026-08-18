/**
 * @fileoverview YYC³ 智能洞察面板组件
 * @description 基于AI的智能数据分析和业务洞察
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  RefreshCw,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { BusinessInsights, KeyFinding } from '@/types/analytics-enhanced'

interface IntelligentInsightsPanelProps {
  metrics: any
  timeRange: string
}

export function IntelligentInsightsPanel({ metrics, timeRange }: IntelligentInsightsPanelProps) {
  const [insights, setInsights] = useState<BusinessInsights | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  // 模拟AI洞察分析
  useEffect(() => {
    const generateInsights = (): BusinessInsights => {
      const now = new Date()

      // 生成关键发现
      const keyFindings = [
        {
          id: 'finding_1',
          category: 'opportunity',
          title: '用户活跃度显著提升',
          description: '过去7天用户活跃度增长23%，主要来源于移动端用户增长',
          impact: 'high' as const,
          trend: 'up' as const,
          metrics: { activeUsers: metrics?.activeUsers || 0, userRetentionRate: 0.85 }
        },
        {
          id: 'finding_2',
          category: 'risk',
          title: 'AI响应时间略有增加',
          description: 'AI模型平均响应时间增加15%，可能影响用户体验',
          impact: 'medium' as const,
          trend: 'down' as const,
          metrics: { averageResponseTime: metrics?.responseTime || 0, userSatisfaction: 0.82 }
        },
        {
          id: 'finding_3',
          category: 'trend',
          title: '用户满意度持续改善',
          description: '用户满意度连续3个月稳步提升，达到历史新高',
          impact: 'high' as const,
          trend: 'up' as const,
          metrics: { averageSatisfaction: metrics?.averageSatisfaction || 0, userRetentionRate: 0.88 }
        }
      ] as KeyFinding[]

      // 生成预测分析
      const predictions = [
        {
          id: 'pred_1',
          type: 'growth',
          timeframe: '30天',
          confidence: 0.85,
          predictedValue: 115000,
          currentValue: 100000,
          change: 15,
          rationale: '基于当前趋势，预计下月用户增长15-20%'
        },
        {
          id: 'pred_2',
          type: 'performance',
          timeframe: '14天',
          confidence: 0.78,
          predictedValue: 85,
          currentValue: 70,
          change: 21,
          rationale: '预计系统负载将在2周内达到当前峰值'
        }
      ]

      // 生成建议行动
      const recommendations = [
        {
          id: 'rec_1',
          priority: 'high' as const,
          title: '优化AI模型性能',
          description: '改进AI推理算法，减少响应时间',
          expectedImpact: '用户体验提升15%',
          effort: 'medium' as const,
          category: 'optimization'
        },
        {
          id: 'rec_2',
          priority: 'medium' as const,
          title: '加强移动端推广',
          description: '针对移动端用户增长趋势，加强移动端营销',
          expectedImpact: '用户增长25%',
          effort: 'low' as const,
          category: 'growth'
        }
      ]

      return {
        keyFindings,
        predictions,
        recommendations,
        generatedAt: now,
        confidence: 0.87
      }
    }

    // 模拟AI分析过程
    setIsAnalyzing(true)
    setTimeout(() => {
      setInsights(generateInsights())
      setIsAnalyzing(false)
    }, 2000)
  }, [metrics, timeRange])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return TrendingUp
      case 'risk':
        return AlertTriangle
      case 'trend':
        return Target
      case 'growth':
        return TrendingUp
      case 'performance':
        return Brain
      default:
        return Info
    }
  }

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'risk') {
      return impact === 'high' ? 'text-red-600 bg-red-50 border-red-200' : 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
    if (type === 'opportunity') {
      return 'text-green-600 bg-green-50 border-green-200'
    }
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const refreshInsights = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      // 重新生成洞察数据
      setInsights(prev => prev ? {
        ...prev,
        generatedAt: new Date()
      } : null)
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">智能洞察面板</h2>
            <p className="text-sm text-gray-500">AI驱动的业务数据分析</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>更新于: {insights ? new Date(insights.generatedAt).toLocaleString() : '分析中...'}</span>
          </div>
          <button
            onClick={refreshInsights}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 分析状态 */}
      {isAnalyzing && (
        <div className="flex items-center justify-center h-32 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500">AI正在分析数据...</p>
          </div>
        </div>
      )}

      {/* 洞察内容 */}
      <AnimatePresence>
        {insights && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 关键发现 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>关键发现</span>
                <span className="text-sm text-gray-500">({insights.keyFindings.length})</span>
              </h3>
              <div className="space-y-3">
                {insights.keyFindings.map((finding, index) => {
                  const Icon = getInsightIcon(finding.category)
                  return (
                    <motion.div
                      key={finding.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getInsightColor(finding.category, finding.impact)} ${
                        selectedInsight === finding.id ? 'ring-2 ring-indigo-400' : ''
                      }`}
                      onClick={() => setSelectedInsight(selectedInsight === finding.id ? null : finding.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getInsightColor(finding.category, finding.impact)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{finding.title}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-white/60">
                                趋势: {finding.trend === 'up' ? '上升' : finding.trend === 'down' ? '下降' : '稳定'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{finding.description}</p>

                            {/* 展开的详细信息 */}
                            {selectedInsight === finding.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-3 pt-3 border-t border-gray-200 space-y-2"
                              >
                                <div className="text-sm">
                                  <span className="font-medium">相关指标:</span>
                                  <div className="mt-1 space-y-1">
                                    {Object.entries(finding.metrics).map(([key, value]) => (
                                      <div key={key} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">{key}:</span>
                                        <span className="font-medium">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          selectedInsight === finding.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* 预测分析 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>预测分析</span>
                <span className="text-sm text-gray-500">({insights.predictions.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.predictions.map((prediction, index) => {
                  const Icon = getInsightIcon(prediction.type)
                  return (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-blue-200 bg-blue-50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{prediction.type}预测</h4>
                          <p className="text-sm text-gray-600 mb-2">{prediction.rationale}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">当前值: </span>
                              <span className="font-medium">{prediction.currentValue}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">预测值: </span>
                              <span className="font-medium text-green-600">{prediction.predictedValue}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">变化: </span>
                              <span className={`font-medium ${prediction.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {prediction.change >= 0 ? '+' : ''}{prediction.change}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">置信度: </span>
                              <span className="font-medium">{(prediction.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* 建议行动 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>建议行动</span>
                <span className="text-sm text-gray-500">({insights.recommendations.length})</span>
              </h3>
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                            {rec.priority === 'urgent' ? '紧急' : rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>预期影响: {rec.expectedImpact}</span>
                          <span>工作量: {rec.effort === 'high' ? '高' : rec.effort === 'medium' ? '中' : '低'}</span>
                          <span>类别: {rec.category}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部信息 */}
      {insights && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>整体置信度: {(insights.confidence * 100).toFixed(0)}%</span>
              <span>•</span>
              <span>生成时间: {new Date(insights.generatedAt).toLocaleString('zh-CN')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>基于AI分析结果</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}