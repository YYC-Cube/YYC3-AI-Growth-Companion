import React from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Card } from '../foundation/Card';

export const SchedulePage: React.FC = () => {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  const schedule = [
    { time: '08:00-08:40', monday: '语文', tuesday: '数学', wednesday: '英语', thursday: '语文', friday: '数学' },
    { time: '08:50-09:30', monday: '数学', tuesday: '语文', wednesday: '数学', thursday: '英语', friday: '语文' },
    { time: '09:40-10:20', monday: '英语', tuesday: '体育', wednesday: '音乐', thursday: '数学', friday: '美术' },
    { time: '10:30-11:10', monday: '科学', tuesday: '英语', wednesday: '科学', thursday: '体育', friday: '英语' },
    { time: '14:00-14:40', monday: '音乐', tuesday: '美术', wednesday: '体育', thursday: '科学', friday: '信息' },
    { time: '14:50-15:30', monday: '美术', tuesday: '科学', wednesday: '信息', thursday: '音乐', friday: '体育' },
  ];

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      '语文': 'bg-blue-100 text-blue-700',
      '数学': 'bg-orange-100 text-orange-700',
      '英语': 'bg-purple-100 text-purple-700',
      '科学': 'bg-green-100 text-green-700',
      '体育': 'bg-red-100 text-red-700',
      '音乐': 'bg-pink-100 text-pink-700',
      '美术': 'bg-yellow-100 text-yellow-700',
      '信息': 'bg-indigo-100 text-indigo-700',
    };
    return colors[subject] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 导航栏 */}
      <PageNavigation title="智能课表" icon="📅" />

      {/* 页面内容 */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">智能课表</h1>
          <p className="text-gray-600">合理安排时间，高效学习每一天</p>
        </div>

        {/* 今日课程卡片 */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="mb-4">今日课程 - 周四</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">第1节 08:00</p>
              <p className="font-medium text-blue-600">语文</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">第2节 08:50</p>
              <p className="font-medium text-purple-600">英语</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">第3节 09:40</p>
              <p className="font-medium text-orange-600">数学</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">第4节 10:30</p>
              <p className="font-medium text-red-600">体育</p>
            </div>
          </div>
        </Card>

        {/* 周课程表 */}
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-gray-600">时间</th>
                {weekDays.slice(0, 5).map((day) => (
                  <th key={day} className="px-4 py-3 text-center text-gray-600">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.monday && (
                      <span className={`px-3 py-1 rounded text-sm ${getSubjectColor(row.monday)}`}>
                        {row.monday}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.tuesday && (
                      <span className={`px-3 py-1 rounded text-sm ${getSubjectColor(row.tuesday)}`}>
                        {row.tuesday}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.wednesday && (
                      <span className={`px-3 py-1 rounded text-sm ${getSubjectColor(row.wednesday)}`}>
                        {row.wednesday}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.thursday && (
                      <span className={`px-3 py-1 rounded text-sm ${getSubjectColor(row.thursday)}`}>
                        {row.thursday}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.friday && (
                      <span className={`px-3 py-1 rounded text-sm ${getSubjectColor(row.friday)}`}>
                        {row.friday}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};