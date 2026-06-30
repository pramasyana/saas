import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = nextId++;
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 4000);
    },
    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },
}));
