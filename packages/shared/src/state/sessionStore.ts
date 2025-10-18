import { create } from 'zustand';
import { ChatSession } from '../types';

interface SessionState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  addSession: (session: ChatSession) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  currentSession: null,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (currentSession) => set({ currentSession }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
}));
