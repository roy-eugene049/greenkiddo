import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  activeModal: string | null;
  notificationsOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setActiveModal: (modal: string | null) => void;
  setNotificationsOpen: (open: boolean) => void;
  toggleNotifications: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  searchQuery: '',
  activeModal: null,
  notificationsOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  toggleNotifications: () =>
    set((state) => ({ notificationsOpen: !state.notificationsOpen })),
}));

