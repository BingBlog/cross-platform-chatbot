import { ChatSession, Message } from '../types';

export class ChatService {
  async sendMessage(message: Message): Promise<Message> {
    // TODO: Implement message sending logic
    return message;
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    // TODO: Implement message retrieval logic
    return [];
  }
}
