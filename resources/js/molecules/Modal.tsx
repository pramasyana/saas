import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ open, onClose, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) {
return null;
}

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div
                className={cn(
                    'relative z-10 w-full rounded-2xl bg-white shadow-xl',
                    size === 'sm' && 'max-w-sm',
                    size === 'md' && 'max-w-md',
                    size === 'lg' && 'max-w-lg',
                    size === 'xl' && 'max-w-2xl',
                )}
            >
                {children}
            </div>
        </div>
    );
}
