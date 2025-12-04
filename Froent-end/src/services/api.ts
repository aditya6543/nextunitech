import { config } from '../config/index.js';

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: ApiResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use relative URLs in dev so Vite proxy handles cookies/CORS
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    this.baseUrl = baseUrl ?? (isDev ? '' : config.backendUrl);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include'
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData && (errorData.error || errorData.message || errorData.detail)) || `HTTP ${response.status}`;
        throw new ApiError(message, response.status, errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH', // Specify PATCH method
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API service instances
export const mockApi = new ApiService(config.apiBaseUrl);
// Use relative base in dev (via constructor logic) and env URL in production
export const backendApi = new ApiService('');

// Auth service
export const authService = {
  async login(email: string, password: string) {
    return backendApi.post('/api/auth/login', { email, password });
  },

  async signup(userData: { name: string; email: string; password: string }) {
    return backendApi.post('/api/auth/signup', userData);
  },

  async logout() {
    return backendApi.post('/api/auth/logout');
  },

  async session() {
    return backendApi.get('/api/auth/session');
  },

  async me() {
    return backendApi.get('/api/users/me');
  }
};

// User service
export const userService = {
  async getUsers() {
    return mockApi.get('/users');
  },

  async getUserById(id: number) {
    return mockApi.get(`/users/${id}`);
  }
};

// Message service
export const messageService = {
  async getMessages() {
    return backendApi.post('/api/messages')
  },

  async createMessage(messageData: { name: string; email: string; message: string }) {
    return backendApi.post('/api/messages', messageData);
  },
  async updateMessageStatus(messageId: string, newStatus: 'read' | 'replied') {
    return backendApi.patch(`/api/messages/${messageId}`, { status: newStatus });
  }
};

// Chat service (backend)
// Chat service (backend)
// In api.ts
export const chatService = {
  async sendMessage(payload: { message: string, conversation_id?: string }) {
    return backendApi.post('/api/chat/send', payload);
  }, // <-- Comma was here

  async getHistory() {
    const cacheBust = new Date().getTime();
    return backendApi.get(`/api/chat/history?_t=${cacheBust}`);
  }, // <-- Make sure this comma is present

  async deleteChat(conversationId: string | number) { // <-- Make sure this function exists
    const idString = conversationId.toString();
    return backendApi.delete(`/api/chat/${idString}`);
  }
};

// Waitlist service
export const waitlistService = {
  async getWaitlist() {
    return mockApi.get('/waitlist');
  },

  async addToWaitlist(email: string, message?: string) {
    return mockApi.post('/waitlist', { email, message });
  }
};
