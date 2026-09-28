import { create } from 'zustand';
import { School, Session } from '../types';
import { INITIAL_SCHOOL, INITIAL_SESSIONS } from '../services/mockData';
import { fetchSchool, updateSchoolData, fetchSessions, setActiveSessionId } from '../services/storage';

export type AppTheme = 'emerald' | 'indigo' | 'berry';

export type NavGroupId =
  | 'main'
  | 'students'
  | 'fees'
  | 'academics'
  | 'finance'
  | 'staff'
  | 'communication'
  | 'admin'
  | 'account';

export const SIDEBAR_GROUPS_STORAGE_KEY = 'dc_sidebar_collapsed_groups';

export function getNavGroupByPath(pathname: string): NavGroupId | null {
  if (pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return 'main';
  }
  if (pathname.startsWith('/students') || pathname.startsWith('/enquiries')) {
    return 'students';
  }
  if (pathname.startsWith('/fees')) {
    return 'fees';
  }
  if (pathname.startsWith('/academics')) {
    return 'academics';
  }
  if (pathname.startsWith('/finance')) {
    return 'finance';
  }
  if (pathname.startsWith('/staff')) {
    return 'staff';
  }
  if (pathname.startsWith('/notices')) {
    return 'communication';
  }
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }
  if (pathname.startsWith('/account')) {
    return 'account';
  }
  return null;
}

function loadInitialSidebarCollapsedGroups(): Record<string, boolean> {
  let stored: Record<string, boolean> = {};
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY);
      if (raw) {
        stored = JSON.parse(raw);
      }
    }
  } catch {
    stored = {};
  }

  // Ensure active route group is expanded upon initialization / page refresh
  if (typeof window !== 'undefined') {
    const activeGroup = getNavGroupByPath(window.location.pathname);
    if (activeGroup && stored[activeGroup]) {
      stored[activeGroup] = false;
      try {
        localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(stored));
      } catch {}
    }
  }

  return stored;
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface AppState {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  activeSession: string; // "2027-28"
  sessions: Session[];
  setActiveSession: (sessionName: string) => Promise<void>;
  school: School;
  updateSchool: (data: Partial<School>) => Promise<void>;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  sidebarCollapsedGroups: Record<string, boolean>;
  toggleSidebarGroup: (groupKey: string) => void;
  setSidebarGroupCollapsed: (groupKey: string, collapsed: boolean) => void;
  ensureActiveGroupExpanded: (pathname: string) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickFeeOpen: boolean;
  quickFeeGrNo: string;
  openQuickFee: (initialGr?: string) => void;
  closeQuickFee: () => void;
  initApp: () => Promise<void>;
  addSession: (session: Session) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const savedTheme = (localStorage.getItem('dc_theme') as AppTheme) || 'emerald';

  // Apply initial theme attribute to document
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem('dc_theme', theme);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      set({ theme });
      get().showToast({
        title: 'Theme Applied',
        message:
          theme === 'emerald'
            ? 'Emerald School (Deep Green & Bright Mint) activated.'
            : theme === 'indigo'
            ? 'Royal Indigo-Navy (Cobalt & Electric Blue) activated.'
            : 'Berry Twilight (Purple-Pink & Amber) activated.',
        type: 'info',
        duration: 2500,
      });
    },

    activeSession: '2027-28',
    sessions: INITIAL_SESSIONS,

    setActiveSession: async (sessionName) => {
      const match = get().sessions.find((s) => s.name === sessionName);
      if (match) {
        await setActiveSessionId(match.id);
        const updated = await fetchSessions();
        set({ activeSession: sessionName, sessions: updated });
        get().showToast({
          title: 'Academic Session Switched',
          message: `Active operational year switched to ${sessionName}.`,
          type: 'info',
        });
      }
    },

    school: INITIAL_SCHOOL,
    updateSchool: async (data) => {
      const updated = await updateSchoolData(data);
      set({ school: updated });
      get().showToast({
        title: 'Settings Saved',
        message: 'Institution profile & operational parameters updated.',
        type: 'success',
      });
    },

    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

    sidebarCollapsedGroups: loadInitialSidebarCollapsedGroups(),

    toggleSidebarGroup: (groupKey: string) => {
      const current = get().sidebarCollapsedGroups;
      const isCurrentlyCollapsed = !!current[groupKey];
      const next = { ...current, [groupKey]: !isCurrentlyCollapsed };
      try {
        localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      set({ sidebarCollapsedGroups: next });
    },

    setSidebarGroupCollapsed: (groupKey: string, collapsed: boolean) => {
      const current = get().sidebarCollapsedGroups;
      const next = { ...current, [groupKey]: collapsed };
      try {
        localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      set({ sidebarCollapsedGroups: next });
    },

    ensureActiveGroupExpanded: (pathname: string) => {
      const activeGroup = getNavGroupByPath(pathname);
      if (!activeGroup) return;

      const current = get().sidebarCollapsedGroups;
      if (current[activeGroup]) {
        const next = { ...current, [activeGroup]: false };
        try {
          localStorage.setItem(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        set({ sidebarCollapsedGroups: next });
      }
    },

    mobileDrawerOpen: false,
    setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),

    toasts: [],
    showToast: (toast) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const duration = toast.duration ?? 4000;
      set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));

      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    },

    removeToast: (id) => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    isSearchOpen: false,
    setIsSearchOpen: (open) => set({ isSearchOpen: open }),

    isQuickFeeOpen: false,
    quickFeeGrNo: '',
    openQuickFee: (initialGr = '') => set({ isQuickFeeOpen: true, quickFeeGrNo: initialGr }),
    closeQuickFee: () => set({ isQuickFeeOpen: false, quickFeeGrNo: '' }),

    initApp: async () => {
      const school = await fetchSchool();
      const sessions = await fetchSessions();
      const active = sessions.find((s) => s.isActive)?.name || '2027-28';
      set({ school, sessions, activeSession: active });
    },

    addSession: (session: Session) => {
      set((s) => ({ sessions: [...s.sessions, session] }));
    },
  };
});
