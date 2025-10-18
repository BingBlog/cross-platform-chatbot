import { HttpClient } from './httpClient';
import { ApiResponse, ChatSession, Message } from '../types';

export class ChatClient {
  constructor(private httpClient: HttpClient) {}

  async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<ApiResponse<Message>> {
    return this.httpClient.post('/chat/messages', message);
  }

  async getMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
    return this.httpClient.get(`/chat/sessions/${sessionId}/messages`);
  }

  async createSession(session: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ChatSession>> {
    return this.httpClient.post('/chat/sessions', session);
  }
}
