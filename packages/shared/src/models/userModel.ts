import { User } from '../types';

export const createUser = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  return {
    ...data,
    id: 'temp-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const validateUser = (user: Partial<User>): boolean => {
  return !!(user.email && user.username);
};
