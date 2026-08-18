// API配置文件
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

export const API_PATHS = {
  [API_VERSIONS.V1]: {
    USERS: '/api/v1/users',
    CONTENTS: '/api/v1/contents',
    AI: '/api/v1/ai',
    GROWTH: '/api/v1/growth',
  },
  [API_VERSIONS.V2]: {
    USERS: '/api/v2/users',
    CONTENTS: '/api/v2/contents',
    AI: '/api/v2/ai',
    GROWTH: '/api/v2/growth',
  },
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const ERROR_CODES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  INVALID_CONTENT_DATA: 'INVALID_CONTENT_DATA',
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  VOICE_RECOGNITION_FAILED: 'VOICE_RECOGNITION_FAILED',
  GROWTH_RECORD_NOT_FOUND: 'GROWTH_RECORD_NOT_FOUND',
  INVALID_GROWTH_STAGE: 'INVALID_GROWTH_STAGE',
} as const;

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}
