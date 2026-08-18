import { CharacterConfig } from '../types';

// Mock Data
const MOCK_CHARACTERS: Record<string, CharacterConfig> = {
  female: {
    id: 'char_001',
    name: '沫语',
    gender: 'female',
    age: 8,
    zodiac: '兔',
    avatarPath: 'figma:asset/avatar_female.png', // Placeholder
    birthday: { solar: '2016-03-15', lunar: '二月初七' },
    currentTheme: 'default',
    personality: {
      traits: {
        curiosity: 0.8,
        creativity: 0.7,
        patience: 0.6
      }
    }
  },
  male: {
    id: 'char_002',
    name: '沫言',
    gender: 'male',
    age: 8,
    zodiac: '兔',
    avatarPath: 'figma:asset/avatar_male.png', // Placeholder
    birthday: { solar: '2016-03-15', lunar: '二月初七' },
    currentTheme: 'default',
    personality: {
      traits: {
        energy: 0.9,
        logic: 0.7,
        empathy: 0.6
      }
    }
  }
};

export const characterManager = {
  setCurrentChild: (child: any) => {
    localStorage.setItem('currentChild', JSON.stringify(child));
  },

  getCurrentChild: () => {
    const child = localStorage.getItem('currentChild');
    return child ? JSON.parse(child) : MOCK_CHARACTERS.female; // Default to female if not set
  },

  getCurrentCharacter: () => {
    return characterManager.getCurrentChild();
  },

  getCharacterByGender: (gender: 'male' | 'female'): CharacterConfig => {
    return MOCK_CHARACTERS[gender];
  }
};

export const characterValidator = {
  validateCharacterConfig: (config: CharacterConfig) => {
    const errors: any[] = [];
    const warnings: any[] = [];
    const suggestions: any[] = [];

    if (!config.id) errors.push({ field: 'id', message: 'ID is missing' });
    if (!config.name) errors.push({ field: 'name', message: 'Name is missing' });
    if (config.age < 0) errors.push({ field: 'age', message: 'Age cannot be negative' });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  },

  autoFixCharacterConfig: (config: CharacterConfig): CharacterConfig => {
    return {
      ...config,
      // Implement auto-fix logic if needed
    };
  }
};
