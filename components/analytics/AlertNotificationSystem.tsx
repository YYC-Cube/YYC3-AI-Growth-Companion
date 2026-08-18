/**
 * @fileoverview YYC³ 告警通知系统组件
 * @description 实时告警监控和通知管理
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
  Bell,
  BellRing,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  Filter,
  Settings,
  X,
  Clock
} from 'lucide-react'

// Local type definition since AlertData is not exported from @/types/analytics
interface AlertData {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: string
  source: string
  acknowledged: boolean
  resolved: boolean
  metadata?: Record<string, unknown>
  actions?: Array<{
    id: string
    label: string
    type: 'primary' | 'secondary' | 'danger'
  }>
}

export function AlertNotificationSystem() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [notifications, setNotifications] = useState(true)

  // 模拟告警数据
  useEffect(() => {
    const generateMockAlerts = (): AlertData[] => {
      const alerts: AlertData[] = [
        {
          id: 'alert_1',
          type: 'error' as const,
          severity: 'high' as const,
          title: 'AI服务响应异常',
          message: 'AI模型响应时间超过阈值，当前平均响应时间: 2.3秒',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5分钟前
          source: 'ai_service',
          acknowledged: false,
          resolved: false,
          metadata: {
            service: 'ai_model',
            metric: 'response_time',
            threshold: '2000ms',
            currentValue: '2300ms'
          },
          actions: [
            { id: 'restart', label: '重启服务', type: 'primary' },
            { id: 'check', label: '检查状态', type: 'secondary' }
          ]
        },
        {
          id: 'alert_2',
          type: 'warning' as const,
          severity: 'medium' as const,
          title: '数据库连接池使用率过高',
          message: '数据库连接池使用率达到85%，建议增加连接池大小',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15分钟前
          source: 'database',
          acknowledged: true,
          resolved: false,
          metadata: {
            database: 'postgresql',
            poolUsage: '85%',
            maxConnections: '100',
            activeConnections: '85'
          },
          actions: [
            { id: 'scale', label: '扩容连接池', type: 'primary' },
            { id: 'monitor', label: '监控详情', type: 'secondary' }
          ]
        },
        {
          id: 'alert_3',
          type: 'info' as const,
          severity: 'low' as const,
          title: '系统备份完成',
          message: '每日自动备份已成功完成，备份文件大小: 2.3GB',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分钟前
          source: 'backup_service',
          acknowledged: true,
          resolved: true,
          metadata: {
            backupType: 'daily',
            fileSize: '2.3GB',
            duration: '12分钟',
            location: 's3://backups/'
          },
          actions: [
            { id: 'download', label: '下载报告', type: 'secondary' }
          ]
        },
        {
          id: 'alert_4',
          type: 'error' as const,
          severity: 'critical' as const,
          title: '用户认证服务异常',
          message: 'JWT认证服务无法访问，用户登录功能可能受影响',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2分钟前
          source: 'auth_service',
          acknowledged: false,
          resolved: false,
          metadata: {
            service: 'jwt_auth',
            endpoint: '/api/auth',
            statusCode: '503',
            error: 'Service Unavailable'
          },
          actions: [
            { id: 'restart', label: '紧急重启', type: 'primary' },
            { id: 'rollback', label: '回滚版本', type: 'danger' }
          ]
        },
        {
          id: 'alert_5',
          type: 'success' as const,
          severity: 'low' as const,
          title: '性能优化完成',
          message: 'AI模型推理性能优化完成，响应时间提升30%',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45分钟前
          source: 'optimization_service',
          acknowledged: true,
          resolved: true,
          metadata: {
            optimizationType: 'model_inference',
            improvement: '30%',
            previousTime: '2.1s',
            currentTime: '1.5s'
          },
          actions: [
            { id: 'details', label: '查看详情', type: 'secondary' }
          ]
        }
      ]
      
      return alerts
    }

    setAlerts(generateMockAlerts())

    // 模拟新告警
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30%概率产生新告警
        const newAlert: AlertData = {
          id: `alert_${Date.now()}`,
          type: ['error', 'warning', 'info'][Math.floor(Math.random() * 3)] as AlertData['type'],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as AlertData['severity'],
          title: '系统监控告警',
          message: '检测到系统异常，请及时处理',
          timestamp: new Date().toISOString(),
          source: 'monitoring_system',
          acknowledged: false,
          resolved: false,
          metadata: {
            autoGenerated: true
          },
          actions: [
            { id: 'investigate', label: '调查', type: 'primary' }
          ]
        }
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 20)) // 保持最多20条告警
      }
    }, 30000) // 每30秒检查一次

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: AlertData['type']) => {
    switch (type) {
      case 'error':
        return XCircle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      case 'success':
        return CheckCircle
      default:
        return AlertCircle
    }
  }

  const getAlertColor = (type: AlertData['type'], severity: AlertData['severity']) => {
    if (type === 'error') {
      return severity === 'critical' ? 'text-red-700 bg-red-50 border-red-200' : 'text-red-600 bg-red-50 border-red-200'
    }
    if (type === 'warning') {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
    if (type === 'info') {
      return 'text-blue-600 bg-blue-50 border-blue-200'
    }
    if (type === 'success') {
      return 'text-green-600 bg-green-50 border-green-200'
    }
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getSeverityBadgeColor = (severity: AlertData['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return '刚刚'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`
    return `${Math.floor(diffInMinutes / 1440)}天前`
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const executeAction = (alertId: string, actionId: string) => {
    // 模拟执行操作
    console.log(`执行操作: ${actionId} for alert: ${alertId}`)
    
    // 根据操作类型执行不同逻辑
    if (actionId === 'restart' || actionId === 'scale') {
      // 模拟操作完成后自动解决告警
      setTimeout(() => {
        resolveAlert(alertId)
      }, 2000)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'unresolved') return !alert.resolved
    if (filter === 'unacknowledged') return !alert.acknowledged
    if (filter === 'critical') return alert.severity === 'critical'
    return alert.type === filter
  })

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved)
  const unresolvedAlerts = alerts.filter(alert => !alert.resolved)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-white" />
            {criticalAlerts.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">告警通知系统</h2>
            <p className="text-sm text-gray-500">实时监控告警和异常处理</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 过滤器 */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">全部告警</option>
              <option value="unresolved">未解决</option>
              <option value="unacknowledged">未确认</option>
              <option value="critical">紧急</option>
              <option value="error">错误</option>
              <option value="warning">警告</option>
              <option value="info">信息</option>
            </select>
          </div>
          
          {/* 设置按钮 */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 告警统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">紧急告警</p>
              <p className="text-2xl font-bold text-red-700">{criticalAlerts.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">未解决</p>
              <p className="text-2xl font-bold text-orange-700">{unresolvedAlerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">今日告警</p>
              <p className="text-2xl font-bold text-blue-700">{alerts.length}</p>
            </div>
            <BellRing className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">已解决</p>
              <p className="text-2xl font-bold text-green-700">{alerts.filter(a => a.resolved).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* 告警列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">暂无告警信息</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type)
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type, alert.severity)} ${
                    !alert.acknowledged ? 'border-l-4 border-l-current' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {/* 告警图标 */}
                      <div className={`p-2 rounded-lg ${getAlertColor(alert.type, alert.severity)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* 告警内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityBadgeColor(alert.severity)}`}>
                            {alert.severity === 'critical' ? '紧急' : 
                             alert.severity === 'high' ? '高' :
                             alert.severity === 'medium' ? '中' : '低'}
                          </span>
                          {!alert.acknowledged && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              未确认
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        
                        {/* 元数据 */}
                        {alert.metadata && (
                          <div className="text-xs text-gray-500 mb-2">
                            {Object.entries(alert.metadata).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-2">
                          {alert.actions?.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => executeAction(alert.id, action.id)}
                              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                action.type === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                action.type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                                'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                          
                          {!alert.acknowledged && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="px-3 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                            >
                              确认
                            </button>
                          )}
                          
                          {!alert.resolved && (
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              解决
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 关闭按钮和时间 */}
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-900 mb-3">通知设置</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">启用桌面通知</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">紧急告警声音提醒</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">邮件通知</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* 底部统计 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>显示 {filteredAlerts.length} 条告警</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>系统正常</span>
          </div>
        </div>
      </div>
    </div>
  )
}