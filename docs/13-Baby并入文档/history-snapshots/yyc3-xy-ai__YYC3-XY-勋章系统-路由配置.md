# YYC3-XY-勋章系统-路由配置

// /src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../app/components/layout/Layout';
import BadgesPage from '../app/components/pages/BadgesPage';
import CultureDetailPage from '../app/components/pages/CultureDetailPage';
import ProfilePage from '../app/components/pages/ProfilePage';
import SeriesDetailPage from '../app/components/pages/SeriesDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>首页</div>} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="badges/series/:seriesId" element={<SeriesDetailPage />} />
        <Route path="culture" element={<div>文化探索</div>} />
        <Route path="culture/:id" element={<CultureDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<div>404 页面未找到</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
