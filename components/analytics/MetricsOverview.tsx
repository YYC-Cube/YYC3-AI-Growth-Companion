/**
 * @fileoverview YYC³ 核心指标概览组件
 * @description 展示系统核心业务指标和数据概览
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Brain, AlertCircle, TrendingUp, BotMessageSquare, Activity, Clock } from 'lucide-react'
import { RealtimeMetric } from '@/types/analytics'

interface MetricsOverviewProps {
  metrics: RealtimeMetric | null
  timeRange: string
}

export function MetricsOverview({ metrics, timeRange }: MetricsOverviewProps) {
  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">加载指标数据中...</p>
          </div>
        </div>
      </div>
    )
  }

  const metricCards = [
    {
      title: '活跃用户',
      value: metrics.activeUsers?.toLocaleString() || '0',
      change: `+${Math.round((metrics.newUsers || 0) * 0.12)}`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue',
      description: '当前在线活跃用户数'
    },
    {
      title: 'AI对话',
      value: metrics.aiConversations?.toLocaleString() || '0',
      change: `+${Math.round((metrics.aiConversations || 0) * 0.08)}`,
      changeType: 'positive' as const,
      icon: BotMessageSquare,
      color: 'purple',
      description: 'AI助手交互次数'
    },
    {
      title: '用户满意度',
      value: `${((metrics.averageSatisfaction || 0) * 100).toFixed(1)}%`,
      change: `+${Math.round((metrics.averageSatisfaction || 0) * 0.05 * 100)}%`,
      changeType: 'positive' as const,
      icon: Brain,
      color: 'green',
      description: '用户反馈满意度评分'
    },
    {
      title: '系统健康度',
      value: `${(metrics.systemHealth || 0).toFixed(1)}%`,
      change: (metrics.systemHealth || 0) >= 95 ? '稳定' : '监控中',
      changeType: (metrics.systemHealth || 0) >= 95 ? 'positive' as const : 'neutral' as const,
      icon: Activity,
      color: (metrics.systemHealth || 0) >= 95 ? 'green' : (metrics.systemHealth || 0) >= 80 ? 'yellow' : 'red',
      description: '系统整体运行状态'
    },
    {
      title: '平均响应时间',
      value: `${metrics.responseTime || 0}ms`,
      change: (metrics.responseTime || 0) <= 200 ? '优秀' : (metrics.responseTime || 0) <= 500 ? '良好' : '需优化',
      changeType: (metrics.responseTime || 0) <= 200 ? 'positive' as const : (metrics.responseTime || 0) <= 500 ? 'neutral' as const : 'negative' as const,
      icon: Clock,
      color: (metrics.responseTime || 0) <= 200 ? 'green' : (metrics.responseTime || 0) <= 500 ? 'yellow' : 'red',
      description: '系统平均响应时间'
    },
    {
      title: '错误率',
      value: `${((metrics.errorRate || 0) * 100).toFixed(2)}%`,
      change: (metrics.errorRate || 0) <= 0.01 ? '正常' : '偏高',
      changeType: (metrics.errorRate || 0) <= 0.01 ? 'positive' as const : 'negative' as const,
      icon: AlertCircle,
      color: (metrics.errorRate || 0) <= 0.01 ? 'green' : 'red',
      description: '系统错误发生率'
    }
  ]

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        border: 'border-yellow-200'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200'
      }
    }
    return colorMap[color]?.[type] || (colorMap.blue && colorMap.blue[type]) || ''
  }

  const getChangeColorClasses = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      case 'neutral':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">核心指标概览</h2>
            <p className="text-sm text-gray-500">实时业务数据监控</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          时间范围: {timeRange === '1h' ? '过去1小时' : 
                   timeRange === '24h' ? '过去24小时' : 
                   timeRange === '7d' ? '过去7天' : '过去30天'}
        </div>
      </div>

      {/* 指标卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative group"
            >
              <div className={`p-4 rounded-lg border ${getColorClasses(card.color, 'border')} ${getColorClasses(card.color, 'bg')} hover:shadow-md transition-all duration-200`}>
                {/* 卡片内容 */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className={`w-4 h-4 ${getColorClasses(card.color, 'text')}`} />
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                  
                  {/* 变化指标 */}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColorClasses(card.changeType)}`}>
                    {card.change}
                  </div>
                </div>

                {/* 悬停效果 */}
                <div className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 底部统计信息 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>最后更新: {metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : '未知'}</span>
            <span>•</span>
            <span>总用户数: {metrics.totalUsers?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>实时数据</span>
          </div>
        </div>
      </div>
    </div>
  )
}