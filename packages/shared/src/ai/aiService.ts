import { QwenClient } from './qwenClient';
import { AIResponse } from '../types';

export class AIService {
  private qwenClient: QwenClient;

  constructor(apiKey: string) {
    this.qwenClient = new QwenClient(apiKey);
  }

  async processMessage(message: string): Promise<AIResponse> {
    return this.qwenClient.generateResponse(message);
  }
}
