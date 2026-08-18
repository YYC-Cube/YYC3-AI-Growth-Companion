import React from 'react';
import { GlobalAvatar } from '../../../services/avatar/avatarSystem';
import { Button } from '../foundation/Button';

interface Props {
  userId: string;
  currentAvatar: GlobalAvatar;
  onSave: (avatar: GlobalAvatar) => void;
  onCancel: () => void;
}

export const AvatarCustomizer: React.FC<Props> = ({ currentAvatar, onSave, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4">角色装扮</h2>
      <div className="h-64 bg-gray-100 mb-4 flex items-center justify-center">
        Avatar Preview Here
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={() => onSave(currentAvatar)}>保存</Button>
      </div>
    </div>
  );
};
