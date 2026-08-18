import { GlobalAvatar } from '../avatar/avatarSystem';

export interface UserInformation {
  basicInfo: {
    name: string;
    age: number;
    gender: 'male' | 'female';
    avatar: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    voiceEnabled: boolean;
    language: 'zh-CN' | 'en-US';
  };
  globalAvatar: GlobalAvatar;
}

class UserInformationManager {
  private userInfo: UserInformation = {
    basicInfo: {
      name: '小朋友',
      age: 8,
      gender: 'female',
      avatar: '',
    },
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      voiceEnabled: true,
      language: 'zh-CN',
    },
    globalAvatar: {
      id: 'default',
      appearance: {},
      accessories: [],
    },
  };

  async getUserProfile(userId: string): Promise<UserInformation> {
    return Promise.resolve(this.userInfo);
  }

  async updatePreferences(userId: string, prefs: Partial<UserInformation['preferences']>) {
    this.userInfo.preferences = { ...this.userInfo.preferences, ...prefs };
    return Promise.resolve(this.userInfo);
  }

  async updateAvatar(userId: string, avatar: GlobalAvatar) {
    this.userInfo.globalAvatar = avatar;
    return Promise.resolve(this.userInfo);
  }
}

export const userInformationManager = new UserInformationManager();
