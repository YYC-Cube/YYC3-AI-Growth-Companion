import React from 'react';

export const SectionTitle: React.FC<any> = ({ title, subtitle, onMore }) => (
  <div className="flex justify-between items-end mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    {onMore && (
      <button onClick={onMore} className="text-purple-600 text-sm font-medium hover:text-purple-700">
        查看更多
      </button>
    )}
  </div>
);
