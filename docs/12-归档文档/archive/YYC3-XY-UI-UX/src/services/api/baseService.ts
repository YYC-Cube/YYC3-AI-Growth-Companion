import { APIResponse, APIError, API_BASE_URL } from './config';

// Mock mode flag - set to true to use mock data instead of real API calls
const MOCK_MODE = true;

export class BaseAPIService {
  protected baseUrl: string;
  protected apiVersion: string;

  constructor(baseUrl: string = API_BASE_URL, apiVersion: string = 'v1') {
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // In mock mode, return mock data instead of making real API calls
    if (MOCK_MODE) {
      return this.getMockData<T>(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const authToken = this.getAuthToken();
    if (authToken) {
      defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  protected async getMockData<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock data based on endpoint
    // This will be overridden by specific service classes
    return {} as T;
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: APIResponse;
      
      try {
        errorData = await response.json();
      } catch {
        throw new APIError(
          response.status,
          response.statusText || '请求失败'
        );
      }
      
      throw new APIError(
        response.status,
        errorData.error?.message || '请求失败',
        errorData.error?.details
      );
    }

    const data: APIResponse<T> = await response.json();
    return data.data as T;
  }

  protected getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  protected buildQueryParams(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, String(item)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    
    return queryParams.toString();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${this.buildQueryParams(params)}` : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}