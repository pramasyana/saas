import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconBoxProps {
    children: ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const colorStyles = {
    primary:
        'bg-primary-50 text-primary ring-1 ring-inset ring-primary/10',
    success:
        'bg-success-light text-success ring-1 ring-inset ring-success/20',
    warning:
        'bg-warning-light text-warning ring-1 ring-inset ring-warning/20',
    danger:
        'bg-danger-light text-danger ring-1 ring-inset ring-danger/20',
};

const sizeStyles = {
    sm: 'h-9 w-9 text-lg',
    md: 'h-12 w-12 text-2xl',
    lg: 'h-16 w-16 text-3xl',
};

export default function IconBox({
    children,
    color = 'primary',
    size = 'md',
    className,
}: IconBoxProps) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center rounded-xl',
                colorStyles[color],
                sizeStyles[size],
                className,
            )}
        >
            {children}
        </div>
    );
}
