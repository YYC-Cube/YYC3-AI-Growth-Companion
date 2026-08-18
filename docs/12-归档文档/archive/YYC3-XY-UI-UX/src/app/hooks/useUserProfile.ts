import { useState, useEffect } from 'react';
import { userInformationManager, UserInformation } from '../services/userProfile/userInformationManager';
import { GlobalAvatar } from '../services/avatar/avatarSystem';

export const useUserProfile = (userId: string) => {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const info = await userInformationManager.getUserProfile(userId);
      setUserInfo(info);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (prefs: Partial<UserInformation['preferences']>) => {
    await userInformationManager.updatePreferences(userId, prefs);
    await loadProfile();
  };

  const updateAvatar = async (avatar: GlobalAvatar) => {
    await userInformationManager.updateAvatar(userId, avatar);
    await loadProfile();
  };

  return {
    userInfo,
    loading,
    updatePreferences,
    updateAvatar,
  };
};
