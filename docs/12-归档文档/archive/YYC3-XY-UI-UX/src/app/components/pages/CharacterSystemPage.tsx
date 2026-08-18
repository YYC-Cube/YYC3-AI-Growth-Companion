import React from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { RoleInfoManager } from '../system/RoleInfoManager';

export const CharacterSystemPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <PageNavigation title="角色信息管理" icon="⚙️" />
      <div className="pt-4">
        <RoleInfoManager />
      </div>
    </div>
  );
};
