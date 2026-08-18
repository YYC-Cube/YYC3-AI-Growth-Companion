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

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
}

export class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  
  constructor(baseURL: string = '/api', defaultHeaders?: Record<string, string>) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }
  
  async request<T>(config: APIRequest): Promise<APIResponse<T>> {
    const url = new URL(config.url, window.location.origin + this.baseURL); // Handle relative base URLs correctly in browser
    
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    try {
      // In a real app, you would fetch here. 
      // For this demo environment without a real backend, we might just log or mock.
      // But adhering to the interface:
      
      const response = await fetch(url.toString(), {
        method: config.method,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
      });
      
      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: Date.now(),
      };
    }
  }
  
  get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }
  
  post<T>(url: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'POST', url, body });
  }
  
  put<T>(url: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PUT', url, body });
  }
  
  delete<T>(url: string): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }
}

export const apiClient = new APIClient();
