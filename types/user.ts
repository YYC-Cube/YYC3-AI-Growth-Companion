/**
 * @file user.ts
 * @description 用户档案类型（源自 yyc3-xy-01，统一合并版吸收）
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  notifications: boolean;
  voiceEnabled: boolean;
  autoPlay: boolean;
}

export interface UserProfile {
  bio?: string;
  interests: string[];
  ageGroup: AgeGroup;
  grade?: string;
  school?: string;
  birthday?: {
    lunar?: string;
    solar: string;
  };
  zodiac?: string;
}

export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  description: string;
  characteristics: string[];
  recommendations: string[];
}
