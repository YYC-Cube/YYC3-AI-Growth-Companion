import React from 'react';

export const WelcomeSection: React.FC<any> = ({ userData }) => (
  <section className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
    <h2 className="text-2xl font-bold mb-2">你好，{userData?.name || '小朋友'}！</h2>
    <p>今天也是充满探索的一天呢！</p>
  </section>
);
