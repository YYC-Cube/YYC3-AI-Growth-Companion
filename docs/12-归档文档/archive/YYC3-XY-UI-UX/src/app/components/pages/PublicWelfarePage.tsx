import React, { useState } from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Heart, Users, Clock, MapPin, Award, BookOpen } from 'lucide-react';

interface Activity {
  id: string;
  type: 'ongoing' | 'history';
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  participants?: number;
  deadline?: string;
  points?: number;
  status?: string;
  buttonText: string;
  buttonColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export const PublicWelfarePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'ongoing',
      icon: '💚',
      iconBg: 'bg-green-400',
      title: '"我的绿色小星球" 线上种植活动',
      description: '通过线上工具，模拟种植一棵树，学习环保知识。每完成一步，平台将捐赠一棵树给环保基金。',
      participants: 1200,
      deadline: '5 天',
      points: 0,
      status: '已有 1,200 名同学参与',
      buttonText: '立即报名并开始',
      buttonColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradientFrom: 'from-green-100',
      gradientTo: 'to-emerald-100',
    },
    {
      id: '2',
      type: 'ongoing',
      icon: '📚',
      iconBg: 'bg-blue-400',
      title: '故事伴读计划',
      description: '同学们可以录制朗读自己的声音，为乡村小朋友录制制图画故事。让听的声音传递温暖，让你的声音成为陪伴！',
      participants: 580,
      deadline: '',
      points: 0,
      status: '已有 580 位音频完成',
      buttonText: '查看详情并录制',
      buttonColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradientFrom: 'from-blue-100',
      gradientTo: 'to-cyan-100',
    },
    {
      id: '3',
      type: 'history',
      icon: '📖',
      iconBg: 'bg-purple-400',
      title: '为山区儿童捐赠图书',
      description: '通过完成学习任务，累积爱心积分，平台将代表你向山区儿童捐赠图书。',
      participants: 2500,
      points: 150,
      status: '活动已结束',
      buttonText: '查看活动回顾',
      buttonColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradientFrom: 'from-purple-100',
      gradientTo: 'to-pink-100',
    },
  ]);

  const ongoingActivities = activities.filter((a) => a.type === 'ongoing');
  const historyActivities = activities.filter((a) => a.type === 'history');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 pb-20">
      {/* 导航栏 */}
      <PageNavigation title="公益活动中心" icon="🌱" />

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-[64px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'ongoing'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Heart className="w-4 h-4" fill={activeTab === 'ongoing' ? 'currentColor' : 'none'} />
              <span>正在进行 (2)</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>历史回顾 (5)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Ongoing Activities */}
        {activeTab === 'ongoing' && (
          <div className="space-y-4">
            {ongoingActivities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-gradient-to-br ${activity.gradientFrom} ${activity.gradientTo} rounded-2xl p-5 shadow-md hover:shadow-xl transition-all`}
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 ${activity.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-gray-900 flex-1">{activity.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {activity.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-green-700">
                    <Users className="w-4 h-4" />
                    <span>已有 {activity.participants?.toLocaleString()} 名同学参与</span>
                  </div>
                  {activity.deadline && (
                    <div className="flex items-center gap-1.5 text-sm text-red-600">
                      <Clock className="w-4 h-4" />
                      <span>仅剩 {activity.deadline}</span>
                    </div>
                  )}
                  {activity.status && (
                    <div className="flex items-center gap-1.5 text-sm text-blue-700">
                      <Award className="w-4 h-4" />
                      <span>{activity.status}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className={`w-full ${activity.buttonColor} text-white py-3 rounded-xl hover:shadow-lg transition-all`}>
                  {activity.buttonText}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* History Activities */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyActivities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-gradient-to-br ${activity.gradientFrom} ${activity.gradientTo} rounded-2xl p-5 shadow-md hover:shadow-xl transition-all opacity-90`}
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 ${activity.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-gray-900 flex-1">{activity.title}</h3>
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
                        已结束
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {activity.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-purple-700">
                    <Users className="w-4 h-4" />
                    <span>共 {activity.participants?.toLocaleString()} 名同学参与</span>
                  </div>
                  {activity.points && (
                    <div className="flex items-center gap-1.5 text-sm text-orange-600">
                      <Award className="w-4 h-4" />
                      <span>你获得了 {activity.points} 爱心积分</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gray-400 text-white py-3 rounded-xl hover:bg-gray-500 transition-all">
                  {activity.buttonText}
                </button>
              </div>
            ))}

            {/* More History Items */}
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🏆</div>
              <p className="text-gray-500 text-sm">你已参与 5 项公益活动</p>
              <p className="text-gray-400 text-xs mt-1">累计获得 500 爱心积分</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Info */}
      <div className="fixed bottom-20 right-4 bg-gradient-to-br from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
        <Heart className="w-4 h-4" fill="white" />
        <span>爱心值: 500</span>
      </div>
    </div>
  );
};