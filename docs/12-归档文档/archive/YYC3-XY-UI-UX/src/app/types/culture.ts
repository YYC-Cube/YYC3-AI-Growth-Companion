export interface CultureContent {
  id: string;
  title: string;
  description: string;
  type: 'site' | 'food' | 'festival' | 'story';
  difficultyLevel: number;
  suitableAgeRange: [number, number];
  location?: string;
  detailedContent: string;
  multimedia: {
    images: string[];
    videos?: string[];
    audio?: string[];
    ar?: boolean;
  };
  knowledgePoints: {
    id: string;
    question: string;
    answer: string;
    explanation?: string;
  }[];
  interactiveElements: {
    id: string;
    title: string;
    description: string;
    type: 'game' | 'quiz' | 'craft' | 'ar' | 'video';
    duration?: number;
  }[];
  relatedContent: string[];
  learned: boolean;
  quizCompleted: boolean;
  interactiveCompleted: boolean;
  shared: boolean;
}

export type CultureType = CultureContent['type'];
