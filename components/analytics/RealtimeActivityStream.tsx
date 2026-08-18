/**
 * @fileoverview YYC³ 实时活动流组件
 * @description 展示系统实时活动和事件流
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
import { Users, Activity, BotMessageSquare, CheckCircle, Filter, RefreshCw, Eye, Clock, AlertCircle } from 'lucide-react'
import { RealtimeActivity } from '@/types/analytics'

export function RealtimeActivityStream() {
  const [activities, setActivities] = useState<RealtimeActivity[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // 模拟实时活动数据
  useEffect(() => {
    const generateMockActivity = (): RealtimeActivity | null => {
      const types: RealtimeActivity['type'][] = ['user_action', 'system_event', 'ai_interaction', 'business_event']
      const impacts: RealtimeActivity['impact'][] = ['low', 'medium', 'high']
      
      const type = types[Math.floor(Math.random() * types.length)]
      const impact = impacts[Math.floor(Math.random() * impacts.length)]
      
      const activitiesByType = {
        user_action: [
          '用户登录系统',
          '用户查看成长记录',
          '用户上传新照片',
          '用户创建成长里程碑',
          '用户与AI助手对话'
        ],
        system_event: [
          '系统自动备份完成',
          '数据库优化执行',
          '缓存清理完成',
          '服务健康检查通过',
          '系统性能监控报告生成'
        ],
        ai_interaction: [
          'AI模型推理完成',
          '智能推荐算法更新',
          '自然语言处理成功',
          'AI图像识别完成',
          '智能分析报告生成'
        ],
        business_event: [
          '新用户注册',
          '付费订阅激活',
          '用户满意度调查完成',
          '成长数据报告导出',
          '家长账户创建'
        ]
      }
      
      const descriptions = activitiesByType[type as keyof typeof activitiesByType]
      if (!descriptions || descriptions.length === 0) {
        return null
      }
      const description = descriptions[Math.floor(Math.random() * descriptions.length)] || '未知活动'
      
      return {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        activityId: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type as RealtimeActivity['type'],
        timestamp: new Date().toISOString(),
        description,
        details: {
          duration: Math.floor(Math.random() * 5000) + 500,
          success: Math.random() > 0.1,
          ...(type === 'user_action' || type === 'ai_interaction' ? { userId: `user_${Math.floor(Math.random() * 1000)}` } : {}),
          sessionId: `session_${Math.floor(Math.random() * 10000)}`
        },
        ...(impact ? { impact } : {}),
        metadata: {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'YYC³ Client',
          location: (['北京', '上海', '广州', '深圳', '杭州'] as const)[Math.floor(Math.random() * 5)] as string,
          device: (['iOS', 'Android', 'Web', 'Desktop'] as const)[Math.floor(Math.random() * 4)] as string
        }
      }
    }

    // 初始化一些活动数据
    const initialActivities: RealtimeActivity[] = []
    for (let i = 0; i < 10; i++) {
      const activity = generateMockActivity()
      if (activity) {
        const timestamp = new Date(Date.now() - (i * 60000)) // 每个活动间隔1分钟
        activity.timestamp = timestamp.toISOString()
        initialActivities.push(activity)
      }
    }
    
    setActivities(initialActivities)
    setIsLoading(false)

    // 模拟实时活动更新
    const interval = setInterval(() => {
      const newActivity = generateMockActivity()
      if (newActivity) {
        setActivities(prev => [newActivity, ...prev].slice(0, 20)) // 保持最多20条活动
      }
    }, 8000) // 每8秒添加一个新活动

    return () => clearInterval(interval)
  }, [])

  const getIconForType = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'user_action':
        return Users
      case 'system_event':
        return Activity
      case 'ai_interaction':
        return BotMessageSquare
      case 'business_event':
        return CheckCircle
      default:
        return Activity
    }
  }

  const getImpactColor = (impact: RealtimeActivity['impact']) => {
    switch (impact) {
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

  const getTypeColor = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'user_action':
        return 'text-blue-600 bg-blue-50'
      case 'system_event':
        return 'text-purple-600 bg-purple-50'
      case 'ai_interaction':
        return 'text-green-600 bg-green-50'
      case 'business_event':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTimeAgo = (timestamp: Date | string) => {
    const now = new Date()
    const time = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '刚刚'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`
    return `${Math.floor(diffInMinutes / 1440)}天前`
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.type === filter
  })

  const refreshActivities = () => {
    setIsLoading(true)
    // 模拟刷新延迟
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">实时活动流</h2>
            <p className="text-sm text-gray-500">系统实时事件监控</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 过滤器 */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">全部活动</option>
              <option value="user_action">用户行为</option>
              <option value="system_event">系统事件</option>
              <option value="ai_interaction">AI交互</option>
              <option value="business_event">业务事件</option>
            </select>
          </div>
          
          {/* 刷新按钮 */}
          <button
            onClick={refreshActivities}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">加载活动数据中...</p>
            </div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">暂无相关活动</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredActivities.map((activity, index) => {
              const Icon = getIconForType(activity.type)
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* 活动图标 */}
                  <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* 活动内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(activity.impact)}`}>
                        {activity.impact === 'high' ? '高' : activity.impact === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </span>
                      
                      {activity.metadata?.location && (
                        <span>{activity.metadata.location}</span>
                      )}
                      
                      {activity.details?.success !== undefined && (
                        <span className={`flex items-center space-x-1 ${activity.details.success ? 'text-green-600' : 'text-red-600'}`}>
                          {activity.details.success ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          <span>{activity.details.success ? '成功' : '失败'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 底部统计 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>显示 {filteredActivities.length} 条活动</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>实时更新</span>
          </div>
        </div>
      </div>
    </div>
  )
}