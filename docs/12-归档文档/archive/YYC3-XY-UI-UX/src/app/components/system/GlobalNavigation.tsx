import React from 'react';
import { HomeOutlined, BookOutlined, CompassOutlined, UserOutlined } from '@ant-design/icons';

export const GlobalNavigation: React.FC<any> = ({ currentPage, onNavigate }) => {
  const items = [
    { key: 'home', icon: <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />, label: '首页' },
    { key: 'growth', icon: <BookOutlined style={{ fontSize: '24px', color: '#52c41a' }} />, label: '成长' },
    { key: 'culture', icon: <CompassOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />, label: '探索' },
    { key: 'profile', icon: <UserOutlined style={{ fontSize: '24px', color: '#722ed1' }} />, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 shadow-lg">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-95 ${
            currentPage === item.key ? 'scale-110 font-bold' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <span className="filter drop-shadow-sm">{item.icon}</span>
          <span className={`text-[10px] ${currentPage === item.key ? 'text-gray-900' : 'text-gray-500'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
