import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({
    children,
    className,
    hover = true,
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-border bg-white p-6 shadow-sm',
                hover && 'transition-all duration-200 hover:shadow-md',
                className,
            )}
        >
            {children}
        </div>
    );
}
