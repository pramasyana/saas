import { create } from 'zustand';

const STORAGE_KEY = 'sidebar_collapsed';

interface SidebarStore {
    collapsed: boolean;
    mobileOpen: boolean;
    toggleCollapsed: () => void;
    setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    collapsed: (() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        }
        return false;
    })(),
    mobileOpen: false,
    toggleCollapsed: () =>
        set((state) => {
            const next = !state.collapsed;
            localStorage.setItem(STORAGE_KEY, String(next));
            return { collapsed: next };
        }),
    setMobileOpen: (open) => set({ mobileOpen: open }),
}));
