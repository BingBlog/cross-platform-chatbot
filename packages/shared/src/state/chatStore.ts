import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
}));
