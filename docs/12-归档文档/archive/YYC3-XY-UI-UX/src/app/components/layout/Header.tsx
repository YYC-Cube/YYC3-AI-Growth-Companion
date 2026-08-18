import React from 'react';

export const Header: React.FC<any> = ({ userData }) => (
  <header className="p-4 bg-white shadow-sm flex justify-between items-center">
    <div className="font-bold text-lg text-purple-600">小语AI</div>
    <div>{userData?.name || 'User'}</div>
  </header>
);
