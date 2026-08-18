// Core Type Definitions for Xiaoyu AI Application
// Based on YYC³-XY UI/UX Design Specification

export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  growthStage: string;
}

export interface GrowthRecord {
  id: string;
  age: number;
  stage: string;
  dimensions: GrowthDimension[];
  achievements: Achievement[];
  lastUpdated: string;
}

export interface GrowthDimension {
  name: string;
  progress: number;
  items: GrowthItem[];
}

export interface GrowthItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earnedDate: string;
}

export interface CultureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

export interface LearningProgressData {
  subject: string;
  progress: number;
  lessons: Lesson[];
  currentLesson?: Lesson;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'image';
}

export interface UserData {
  id: string;
  name: string;
  age: number;
  avatar: string;
  growthStage: string;
}

export interface Recommendation {
  id: string;
  type: 'content' | 'action' | 'question';
  title: string;
  description: string;
  image?: string;
}

// Character System Types
export interface Child {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday?: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BirthdayInfo {
  lunar: string;
  solar: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
}

export type ExpressionTrigger = 
  | 'greeting'
  | 'celebration'
  | 'encouragement'
  | 'comfort'
  | 'thinking'
  | 'listening';

export interface ExpressionConfig {
  id: string;
  name: string;
  trigger: ExpressionTrigger;
  imagePath: string;
  description: string;
}

export interface PersonalityConfig {
  traits: {
    friendliness: number;
    curiosity: number;
    empathy: number;
    creativity: number;
    patience: number;
    playfulness: number;
  };
  description: string;
  preferences: string[];
  dislikes: string[];
}

export interface VoiceSettings {
  enabled: boolean;
  voiceId: string;
  pitch: number;
  speed: number;
  volume: number;
  language: string;
  accent: string;
}

export interface CharacterImages {
  homePage: string;
  growthRecord: string;
  profileInfo: string;
  settings: string;
  aiAvatar: string;
  jointAvatar: string;
  additionalImages: string[];
}

export interface CharacterConfig {
  id: string;
  name: string;
  defaultName: string;
  gender: 'male' | 'female';
  age: number;
  birthday?: BirthdayInfo;
  zodiac?: string;
  themes: ThemeConfig[];
  currentTheme?: string;
  expressions: ExpressionConfig[];
  personality: PersonalityConfig;
  voiceSettings: VoiceSettings;
  avatarPath: string;
  images: CharacterImages;
  createdAt: Date;
  updatedAt: Date;
}

// Export growth system types
export * from './growth-system';

// Export badge system types
export * from './badge';

// Export culture system types
export * from './culture';