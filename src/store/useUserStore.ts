import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences } from '../services/userPreferences';

interface UserState {
  userId: string | null;
  preferences: UserPreferences | null;
  setUserId: (userId: string | null) => void;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      preferences: null,
      setUserId: (userId) => set({ userId }),
      setPreferences: (preferences) => set({ preferences }),
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: state.preferences
            ? { ...state.preferences, ...updates }
            : null,
        })),
    }),
    {
      name: 'greenkiddo-user-storage',
    }
  )
);

