import { HttpClient } from './httpClient';
import { ApiResponse, User } from '../types';

export class AuthClient {
  constructor(private httpClient: HttpClient) {}

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.httpClient.post('/auth/login', { email, password });
  }

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return this.httpClient.post('/auth/register', userData);
  }
}
