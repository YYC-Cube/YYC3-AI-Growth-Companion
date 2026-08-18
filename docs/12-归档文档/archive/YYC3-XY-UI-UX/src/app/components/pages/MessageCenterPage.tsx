import React, { useState } from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Card } from '../foundation/Card';
import { Badge } from '../foundation/Badge';
import { Bell, Archive } from 'lucide-react';

interface Message {
  id: string;
  type: 'homework' | 'system' | 'activity';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
  categoryLabel: string;
  categoryBg: string;
  categoryColor: string;
  borderColor: string;
}

export const MessageCenterPage: React.FC = () => {
  const [messages] = useState<Message[]>([
    // 作业反馈消息
    {
      id: '1',
      type: 'homework',
      title: '语文作业【古诗词背诵】已批改！',
      content: '本次作业完成度高，背诵流畅，理解透彻。小朋友真棒！继续保持！',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      icon: '✏️',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      categoryLabel: '作业反馈',
      categoryBg: 'bg-yellow-50',
      categoryColor: 'text-yellow-700',
      borderColor: 'border-l-yellow-400',
    },
    {
      id: '2',
      type: 'homework',
      title: '数学作业【口算题】待完善',
      content: '有 2 道计算题错误，请仔细检查步骤并重新提交。',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      icon: '✏️',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      categoryLabel: '作业反馈',
      categoryBg: 'bg-blue-50',
      categoryColor: 'text-blue-700',
      borderColor: 'border-l-blue-400',
    },
    // 系统通知
    {
      id: '3',
      type: 'system',
      title: '学习提醒：今天还保持学习天数 30 天！',
      content: '保持每天达成学习！继续努力，继续加油！',
      timestamp: new Date(Date.now() - 14 * 60 * 1000),
      read: false,
      icon: '☀️',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      categoryLabel: '系统通知',
      categoryBg: 'bg-purple-50',
      categoryColor: 'text-purple-700',
      borderColor: 'border-l-purple-400',
    },
    // 活动通知
    {
      id: '4',
      type: 'activity',
      title: '公益活动：故事伴读计划已成功报名！',
      content: '感谢您的爱心！您的资料已被完成活动报名手续！',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      icon: '🌱',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      categoryLabel: '活动通知',
      categoryBg: 'bg-green-50',
      categoryColor: 'text-green-700',
      borderColor: 'border-l-green-400',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'homework' | 'system' | 'activity'>('all');

  const unreadCount = messages.filter(m => !m.read).length;
  const homeworkCount = messages.filter(m => m.type === 'homework' && !m.read).length;
  const systemCount = messages.filter(m => m.type === 'system' && !m.read).length;
  const activityCount = messages.filter(m => m.type === 'activity' && !m.read).length;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'homework':
        return '作业反馈';
      case 'system':
        return '系统通知';
      case 'activity':
        return '活动通知';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return '💡';
      case 'system':
        return '🔔';
      case 'activity':
        return '🎪';
      default:
        return '📢';
    }
  };

  const groupedMessages = messages.reduce((acc, message) => {
    if (!acc[message.type]) {
      acc[message.type] = [];
    }
    acc[message.type].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-gray-900">消息中心</h1>
            </div>
            <button className="flex items-center gap-1 text-blue-600 text-sm">
              <Archive className="w-4 h-4" />
              <span>全部标为已读</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Homework Messages */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getTypeIcon('homework')}</span>
            <h3 className="text-gray-900">
              作业反馈 ({unreadCount} 条未读)
            </h3>
          </div>

          {groupedMessages.homework?.map((message) => (
            <div
              key={message.id}
              className={`${message.categoryBg} rounded-xl p-4 mb-3 transition-all hover:shadow-md cursor-pointer ${
                message.read ? '' : 'border-2 border-yellow-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{message.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`${message.categoryColor} flex-1`}>
                      {message.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Notifications */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getTypeIcon('system')}</span>
            <h3 className="text-gray-900">
              系统通知 ({unreadCount} 条未读)
            </h3>
          </div>

          {groupedMessages.system?.map((message) => (
            <div
              key={message.id}
              className={`${message.categoryBg} rounded-xl p-4 mb-3 transition-all hover:shadow-md cursor-pointer ${
                message.read ? '' : 'border-2 border-purple-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{message.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`${message.categoryColor} flex-1`}>
                      {message.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Notifications */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getTypeIcon('activity')}</span>
            <h3 className="text-gray-900">
              活动通知 ({unreadCount} 条未读)
            </h3>
          </div>

          {groupedMessages.activity?.map((message) => (
            <div
              key={message.id}
              className={`${message.categoryBg} rounded-xl p-4 mb-3 transition-all hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{message.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`${message.categoryColor} flex-1`}>
                      {message.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};