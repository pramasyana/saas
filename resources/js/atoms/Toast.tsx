import { cn } from '@/lib/utils';
import { useToastStore, type Toast } from '@/stores/toast';
import type { ReactNode } from 'react';

const typeStyles: Record<Toast['type'], string> = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
};

const typeIcons: Record<Toast['type'], ReactNode> = {
    success: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
    ),
    info: (
        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    ),
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300',
                typeStyles[toast.type],
            )}
        >
            {typeIcons[toast.type]}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={onDismiss} className="ml-2 rounded-lg p-0.5 opacity-70 hover:opacity-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
