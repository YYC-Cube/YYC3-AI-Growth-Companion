export interface CharacterConfig {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  zodiac: string;
  avatarPath: string;
  birthday?: {
    solar: string;
    lunar: string;
  };
  currentTheme: string;
  personality: {
    traits: Record<string, number>;
  };
}

// Add other shared types here
