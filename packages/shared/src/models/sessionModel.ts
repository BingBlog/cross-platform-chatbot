import { ChatSession } from '../types';

export const createSession = (data: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>): ChatSession => {
  return {
    ...data,
    id: 'temp-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const validateSession = (session: Partial<ChatSession>): boolean => {
  return !!(session.title && session.userId);
};
