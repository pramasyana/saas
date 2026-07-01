import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'new';
    children: ReactNode;
    className?: string;
}

const variantStyles = {
    default: 'bg-primary-50 text-primary ring-1 ring-inset ring-primary/10',
    success: 'bg-success-light text-success ring-1 ring-inset ring-success/20',
    warning: 'bg-warning-light text-warning ring-1 ring-inset ring-warning/20',
    danger: 'bg-danger-light text-danger ring-1 ring-inset ring-danger/20',
    new: 'bg-primary text-white shadow-sm',
};

export default function Badge({
    variant = 'default',
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                variantStyles[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
