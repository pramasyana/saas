import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    className?: string;
}

const variantStyles = {
    primary:
        'bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md active:bg-primary-dark',
    secondary:
        'bg-white text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 hover:ring-neutral-400',
    outline:
        'bg-transparent text-primary ring-1 ring-inset ring-primary/30 hover:bg-primary-50 hover:ring-primary',
    ghost:
        'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
    danger:
        'bg-danger text-white shadow-sm hover:bg-danger-dark hover:shadow-md active:bg-danger-dark',
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-[0.97]',
                variantStyles[variant],
                sizeStyles[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
