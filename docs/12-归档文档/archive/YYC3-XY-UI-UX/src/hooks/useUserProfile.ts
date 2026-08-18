import { useState, useEffect } from 'react';
import { userInformationManager, UserInformation } from '../services/userProfile/userInformationManager';

export function useUserProfile(userId: string) {
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await userInformationManager.getUserInformation(userId);
      setUserInfo(info);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserInformation>) => {
    if (!userId) return;

    try {
      const updatedInfo = await userInformationManager.updateUserInformation(userId, updates);
      setUserInfo(updatedInfo);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updatePreferences = async (preferences: Partial<UserInformation['preferences']>) => {
    if (!userId) return;

    try {
      const updatedInfo = await userInformationManager.updatePreferences(userId, preferences);
      setUserInfo(updatedInfo);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateAvatar = async (avatar: UserInformation['globalAvatar']) => {
    if (!userId) return;

    try {
      const updatedInfo = await userInformationManager.updateGlobalAvatar(userId, avatar);
      setUserInfo(updatedInfo);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    userInfo,
    loading,
    error,
    updateProfile,
    updatePreferences,
    updateAvatar,
    reload: loadUserProfile,
  };
}
