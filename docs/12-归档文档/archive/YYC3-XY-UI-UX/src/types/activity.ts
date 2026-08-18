export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  
  // 时间信息
  startDate: string;
  endDate?: string;
  duration?: number; // 分钟
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6 表示周日至周六
  };
  
  // 参与信息
  participants?: Participant[];
  maxParticipants?: number;
  status: ActivityStatus;
  
  // 奖励
  rewards: Reward[];
  
  // 要求
  requirements?: Requirement[];
  
  // 进度
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  
  // 位置
  location?: {
    type: 'online' | 'onsite';
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    onlineLink?: string;
  };
  
  // 元数据
  metadata: {
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type ActivityType = 'task' | 'quiz' | 'challenge' | 'event' | 'workshop' | 'volunteer';

export type ActivityStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  role: 'organizer' | 'participant' | 'volunteer';
  joinedAt: string;
  progress?: number;
  completed?: boolean;
}

export interface Reward {
  type: 'points' | 'badge' | 'certificate' | 'physical';
  value: number | string; // 点数或勋章ID
  description: string;
  awarded?: boolean;
  awardedAt?: string;
}

export interface Requirement {
  type: 'age' | 'skill' | 'prerequisite' | 'equipment';
  description: string;
  value: any;
  isMet: boolean;
}

export interface ActivityFilter {
  type?: ActivityType;
  status?: ActivityStatus;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  difficulty?: string;
  tags?: string[];
}

export interface ActivityStats {
  totalActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  totalParticipants: number;
  totalPointsEarned: number;
  averageCompletionRate: number;
}
