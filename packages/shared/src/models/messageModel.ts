import { Message } from '../types';

export const createMessage = (data: Omit<Message, 'id' | 'timestamp'>): Message => {
  return {
    ...data,
    id: 'temp-id',
    timestamp: new Date(),
  };
};

export const validateMessage = (message: Partial<Message>): boolean => {
  return !!(message.content && message.role && message.sessionId);
};
